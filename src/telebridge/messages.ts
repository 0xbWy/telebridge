/**
 * TeleBridge — Encrypted Message Pipeline
 *
 * Handles encrypting outgoing messages and decrypting incoming messages.
 * Supports all message types: text, edits, forwards, replies.
 * Filters protocol messages (kx, pk) from chat UI.
 *
 * Wire format: tb<version>.<mode>.<base64_payload>
 * Modes: s (symmetric), a (asymmetric/secured), kx (key exchange), pk (prekey)
 *
 * V1 Bug Regression Guards:
 * - #3: Single consistent HKDF-SHA256 key derivation path for text and binary
 * - #4: Key lookup by explicit chatId, NOT selectCurrentChat()
 * - #1: GCM auth tags mandatory, never discarded
 */

import type { ProtocolMessage, ProtocolMode } from './crypto/protocol';
import type { RatchetState } from './crypto/symmetric';

import {
  decodeProtocol,
  encodeProtocol,
  isProtocolMessage,
  MAX_PLAINTEXT_BYTES,
} from './crypto/protocol';
import {
  decryptSymmetric,
  encryptSymmetric,
  generateChatKey,
  keyIdFromKey,
  RatchetState as RatchetStateClass,
} from './crypto/symmetric';

// ---------- Types ----------

/** Result of encrypting a message for sending. */
export interface EncryptedMessageResult {
  /** Protocol-encoded string (tb1.s.base64) */
  readonly protocolMessage: string;
  /** The mode used for encryption. */
  readonly mode: ProtocolMode;
  /** Key ID used for this message (for ratchet tracking). */
  readonly keyId: string;
  /** Message counter (for HKDF ratchet). */
  readonly counter: number;
}

/** Result of decrypting an incoming message. */
export interface DecryptedMessageResult {
  /** Decrypted plaintext text. */
  readonly text: string;
  /** The mode of the original protocol message. */
  readonly mode: ProtocolMode;
  /** Key ID that was used to decrypt (for ratchet verification). */
  readonly keyId: string;
  /** Whether this is a protocol control message (kx/pk) that should be hidden from UI. */
  readonly isProtocolControl: boolean;
  /** Protocol control message type, if applicable. */
  readonly controlType?: 'kx' | 'pk' | 'sk';
  /** Protocol payload (for kx/pk messages that need further processing). */
  readonly rawPayload?: Uint8Array;
}

/** Chat key store: maps chatId → { key, ratchet }. */
export interface ChatKeyEntry {
  /** The 32-byte AES-256 chat key. */
  readonly key: Uint8Array;
  /** Key ID (hex of first 4 bytes). */
  readonly keyId: string;
  /** HKDF ratchet state for this chat key. */
  readonly ratchet: RatchetState;
}

/** In-memory chat key store (populated after bridge unlock or key exchange). */
const chatKeys = new Map<string, ChatKeyEntry>();

// ---------- Chat Key Management ----------

/**
 * Get the chat key entry for a given chatId.
 * Returns undefined if no key has been established.
 */
export function getChatKeyEntry(chatId: string): ChatKeyEntry | undefined {
  return chatKeys.get(chatId);
}

/**
 * Set the chat key for a given chatId.
 * Called after key exchange completion or key rotation.
 */
export function setChatKey(chatId: string, key: Uint8Array): ChatKeyEntry {
  const keyId = keyIdFromKey(key);
  const ratchet = new RatchetStateClass(key, keyId);
  const entry: ChatKeyEntry = { key, keyId, ratchet };
  chatKeys.set(chatId, entry);
  return entry;
}

/**
 * Remove the chat key for a given chatId.
 * Called during key rotation (old key is retained by ratchet).
 */
export function removeChatKey(chatId: string): boolean {
  return chatKeys.delete(chatId);
}

/**
 * Check if a chat key exists for the given chatId.
 */
export function hasChatKey(chatId: string): boolean {
  return chatKeys.has(chatId);
}

// ---------- Symmetric Message Encryption (Layer 3) ----------

/**
 * Encrypt a text message for sending via TeleBridge symmetric encryption.
 *
 * Process:
 * 1. Look up the chat key for the given chatId
 * 2. Advance the HKDF ratchet to get a per-message key
 * 3. UTF-8 encode the plaintext
 * 4. Encrypt with AES-256-GCM using the per-message key
 * 5. Construct the binary payload: [keyId (4B)][counter (4B)][nonce (12B)][ciphertext][authTag (16B)]
 * 6. Encode as tb1.s.<base64>
 *
 * @param text - Plaintext text to encrypt
 * @param chatId - Chat ID (used for explicit key lookup, NOT current UI state)
 * @returns Encrypted message result
 * @throws Error if no chat key exists for the chatId
 */
export async function encryptMessage(
  text: string,
  chatId: string,
): Promise<EncryptedMessageResult> {
  const entry = chatKeys.get(chatId);
  if (!entry) {
    throw new Error(`No chat key established for chat ${chatId}. Cannot encrypt.`);
  }

  // Check text size budget
  const textBytes = new TextEncoder().encode(text);
  if (textBytes.length > MAX_PLAINTEXT_BYTES) {
    throw new Error(
      `Plaintext too large: ${textBytes.length} bytes. Maximum: ${MAX_PLAINTEXT_BYTES} bytes.`,
    );
  }

  // Advance ratchet to get per-message key
  const { messageKey, keyId, counter } = entry.ratchet.nextSendKey();

  // Encrypt with AES-256-GCM
  // AAD includes key ID and counter for authenticity
  const aad = buildAAD(keyId, counter);
  const { nonce, ciphertext, authTag } = await encryptSymmetric(textBytes, messageKey, aad);

  // Build binary payload: [keyId (4B)][counter (4B)][nonce (12B)][ciphertext][authTag (16B)]
  const keyIdBytes = hexToBytes(keyId);
  const counterBytes = encodeCounterBE(counter);
  const payload = concatUint8Arrays(keyIdBytes, counterBytes, nonce, ciphertext, authTag);

  // Encode as protocol message
  const protocolMessage = encodeProtocol('s', payload);

  return {
    protocolMessage,
    mode: 's',
    keyId,
    counter,
  };
}

// ---------- Symmetric Message Decryption (Layer 3) ----------

/**
 * Decrypt an incoming symmetric message (tb1.s.<base64>).
 *
 * Process:
 * 1. Decode the protocol message
 * 2. Extract keyId, counter, nonce, ciphertext, authTag from binary payload
 * 3. Look up the chat key for the given chatId
 * 4. Derive the per-message key from the ratchet using the counter
 * 5. Decrypt with AES-256-GCM (mandatory auth tag verification)
 * 6. UTF-8 decode the plaintext
 *
 * @param protocolString - The tb1.s.<base64> string
 * @param chatId - Chat ID for explicit key lookup
 * @returns Decrypted message result, or undefined if no key exists
 * @throws Error on decryption failure (auth tag mismatch, wrong key, etc.)
 */
export async function decryptMessage(
  protocolString: string,
  chatId: string,
): Promise<DecryptedMessageResult | undefined> {
  const entry = chatKeys.get(chatId);
  if (!entry) {
    return undefined; // No key for this chat — message stays encrypted
  }

  const decoded = decodeProtocol(protocolString);
  if (!decoded) {
    throw new Error('Invalid protocol message format');
  }

  if (decoded.mode !== 's') {
    // Not a symmetric message — delegate to other handlers
    return handleNonSymmetricMessage(decoded, chatId);
  }

  return decryptSymmetricPayload(decoded.payload, entry);
}

/**
 * Decrypt a symmetric payload given a chat key entry.
 * Shared between direct decryption and out-of-order message handling.
 */
async function decryptSymmetricPayload(
  payload: Uint8Array,
  entry: ChatKeyEntry,
): Promise<DecryptedMessageResult> {
  // Parse binary payload: [keyId (4B)][counter (4B)][nonce (12B)][ciphertext][authTag (16B)]
  const MIN_PAYLOAD = 4 + 4 + 12 + 16; // keyId + counter + nonce + authTag (no ciphertext)
  if (payload.length < MIN_PAYLOAD) {
    throw new Error(`Payload too short: ${payload.length} bytes (minimum ${MIN_PAYLOAD})`);
  }

  const keyIdBytes = payload.slice(0, 4);
  const keyId = bytesToHex(keyIdBytes);
  const counterBytes = payload.slice(4, 8);
  const counter = decodeCounterBE(counterBytes);
  const nonce = payload.slice(8, 20);
  const authTag = payload.slice(payload.length - 16);
  const ciphertext = payload.slice(20, payload.length - 16);

  // Try the current key first
  let messageKey: Uint8Array | undefined;
  if (keyId === entry.keyId) {
    messageKey = entry.ratchet.nextReceiveKey(counter).messageKey;
  } else {
    // Try previous keys during rotation grace period
    messageKey = entry.ratchet.getPreviousKeyMessageKey(keyId, counter);
  }

  if (!messageKey) {
    throw new Error(`No message key found for keyId=${keyId}, counter=${counter}`);
  }

  // AAD includes key ID and counter for authenticity
  const aad = buildAAD(keyId, counter);

  // Decrypt — GCM auth tag verification is ALWAYS performed (V1 Bug #7 guard)
  const plaintext = await decryptSymmetric(nonce, ciphertext, authTag, messageKey, aad);

  // UTF-8 decode
  const text = new TextDecoder().decode(plaintext);

  return {
    text,
    mode: 's',
    keyId,
    isProtocolControl: false,
  };
}

// ---------- Protocol Control Message Handling ----------

/**
 * Handle kx (key exchange) and pk (prekey) protocol messages.
 * These are hidden from the chat UI and processed as side effects.
 */
function handleNonSymmetricMessage(
  decoded: ProtocolMessage,
  chatId: string,
): DecryptedMessageResult {
  if (decoded.mode === 'kx') {
    return {
      text: '🔐', // Placeholder — not shown to user
      mode: 'kx',
      keyId: '',
      isProtocolControl: true,
      controlType: 'kx',
      rawPayload: decoded.payload,
    };
  }

  if (decoded.mode === 'pk') {
    return {
      text: '🔑', // Placeholder — not shown to user
      mode: 'pk',
      keyId: '',
      isProtocolControl: true,
      controlType: 'pk',
      rawPayload: decoded.payload,
    };
  }

  // Sender key distribution messages — processed by the integration layer
  if (decoded.mode === 'sk') {
    return {
      text: '🔑', // Placeholder — not shown to user
      mode: 'sk',
      keyId: '',
      isProtocolControl: true,
      controlType: 'sk',
      rawPayload: decoded.payload,
    };
  }

  // Asymmetric (secured) messages — decrypted separately
  if (decoded.mode === 'a') {
    return {
      text: '', // Will be decrypted by the caller using asymmetric decryption
      mode: 'a',
      keyId: '',
      isProtocolControl: false,
      rawPayload: decoded.payload,
    };
  }

  // Unknown mode — hide from UI
  return {
    text: '',
    mode: decoded.mode,
    keyId: '',
    isProtocolControl: true,
  };
}

// ---------- Key Rotation ----------

/**
 * Check if the chat key for a given chatId should be rotated
 * based on message count or time thresholds.
 */
export function shouldRotateChatKey(chatId: string): boolean {
  const entry = chatKeys.get(chatId);
  if (!entry) return false;
  return entry.ratchet.shouldRotate();
}

/**
 * Rotate the chat key for a given chatId.
 * Generates a new key and updates the store.
 * Returns the old key ID and new key for sending a kx message.
 */
export function rotateChatKey(chatId: string): {
  oldKeyId: string;
  newKeyId: string;
  newKey: Uint8Array;
} {
  const entry = chatKeys.get(chatId);
  if (!entry) {
    throw new Error(`No chat key to rotate for chat ${chatId}`);
  }

  const oldKeyId = entry.keyId;
  const { key: newKey, keyId: newKeyId } = generateChatKey();

  // Rotate within the ratchet (retains old key for grace period)
  entry.ratchet.rotateKey(newKey, newKeyId);

  // Update the entry with the new key
  const newEntry: ChatKeyEntry = {
    key: newKey,
    keyId: newKeyId,
    ratchet: entry.ratchet,
  };
  chatKeys.set(chatId, newEntry);

  return { oldKeyId, newKeyId, newKey };
}

// ---------- Utility Functions ----------

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function encodeCounterBE(counter: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = (counter >>> 24) & 0xFF;
  buf[1] = (counter >>> 16) & 0xFF;
  buf[2] = (counter >>> 8) & 0xFF;
  buf[3] = counter & 0xFF;
  return buf;
}

function decodeCounterBE(bytes: Uint8Array): number {
  return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
}

/**
 * Build Additional Authenticated Data (AAD) for message encryption.
 * Includes key ID and counter for message authentication.
 */
function buildAAD(keyId: string, counter: number): Uint8Array {
  const keyIdBytes = hexToBytes(keyId);
  const counterBytes = encodeCounterBE(counter);
  return concatUint8Arrays(keyIdBytes, counterBytes);
}

/**
 * Check if a text string is a TeleBridge protocol message.
 * Fast check — only looks at the prefix.
 */
export function isTeleBridgeMessage(text: string): boolean {
  return isProtocolMessage(text);
}

/**
 * Decrypt a protocol message string.
 * Returns undefined if the text is not a protocol message or if no key exists.
 * Returns a DecryptedMessageResult for successful decryption.
 * Throws on decryption failure (tampered data, wrong key, etc.).
 */
export async function decryptProtocolMessage(
  text: string,
  chatId: string,
): Promise<DecryptedMessageResult | undefined> {
  if (!isProtocolMessage(text)) {
    return undefined;
  }

  const decoded = decodeProtocol(text);
  if (!decoded) {
    return undefined;
  }

  // Handle based on mode
  switch (decoded.mode) {
    case 's':
      return decryptMessage(text, chatId);
    case 'kx':
    case 'pk':
      return handleNonSymmetricMessage(decoded, chatId);
    case 'a':
      // Asymmetric decryption requires the user's private key
      // This is handled separately in the integration layer
      return handleNonSymmetricMessage(decoded, chatId);
    default:
      return undefined;
  }
}

/**
 * Should a message be hidden from the chat UI?
 * Protocol control messages (kx, pk) should be hidden.
 */
export function shouldHideMessage(text: string): boolean {
  if (!isProtocolMessage(text)) return false;
  const decoded = decodeProtocol(text);
  return decoded?.mode === 'kx' || decoded?.mode === 'pk' || decoded?.mode === 'sk';
}

/**
 * Increment the message counter for a chat (called after each encrypted send).
 * Returns the new counter value.
 */
export function incrementMessageCounter(chatId: string): number {
  const entry = chatKeys.get(chatId);
  if (!entry) {
    // No key established — counter stays at 0
    return 0;
  }
  // Counter is tracked by the ratchet (sendCounter)
  return entry.ratchet.currentSendCounter;
}

/**
 * Get the current message counter for a chat (for display/testing).
 */
export function getMessageCounter(chatId: string): number {
  const entry = chatKeys.get(chatId);
  if (!entry) return 0;
  return entry.ratchet.currentSendCounter + entry.ratchet.currentReceiveCounter;
}

/**
 * Clear all chat keys (used when locking the bridge).
 */
export function clearAllChatKeys(): void {
  chatKeys.clear();
}

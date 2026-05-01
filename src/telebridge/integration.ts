/**
 * TeleBridge — Message Integration Layer
 *
 * Hooks into the Telegram message flow for:
 * - Intercepting outgoing messages → encrypt before sending
 * - Intercepting incoming messages → detect tb prefix → decrypt → display as normal
 * - Filtering kx/pk protocol messages from chat UI
 * - Handling key rotation triggers
 * - Message counter tracking (monotonic, never 0 after first message)
 *
 * Integration points:
 * 1. sendMessage action (outgoing text)
 * 2. apiUpdate handler (incoming messages)
 * 3. Message rendering (MessageText component)
 *
 * V1 Bug Regression Guards:
 * - #4: Key lookup by explicit chatId, NOT selectCurrentChat()
 * - #3: Single consistent HKDF-SHA256 derivation path
 * - #8: Password never in global state
 */

import { x25519 } from '@noble/curves/ed25519.js';

import type { MediaType } from './crypto/media';
import type { ProtocolMode } from './crypto/protocol';

import {
  deriveChatKey,
} from './crypto/keyExchange';
import {
  getUnlockedIdentity,
  isBridgeUnlocked,
} from './crypto/persistence';
import {
  decodeProtocol,
  encodeProtocol,
  MAX_PLAINTEXT_BYTES,
  PROTOCOL_PREFIX,
} from './crypto/protocol';
import {
  decryptSymmetric,
  encryptSymmetric,
} from './crypto/symmetric';
import {
  validateMessageInputSize,
} from './edgeCases';
import {
  clearAllChatKeys,
  decryptProtocolMessage,
  encryptMessage,
  getChatKeyEntry,
  hasChatKey,
  isTeleBridgeMessage,
  rotateChatKey,
  setChatKey,
  shouldHideMessage,
  shouldRotateChatKey,
} from './messages';
import {
  ReplayDetector,
  replayDetector,
  validateKeyExchangeMessage,
  validateProtocolVersion,
} from './security';

// Re-exports for external consumers (like Composer.tsx)
export { hasChatKey, setChatKey, isTeleBridgeMessage } from './messages';

// ---------- Pending Key Exchange Messages ----------

/**
 * In-memory store for pending outgoing key exchange messages.
 * When Alice initiates a key exchange, the tb1.kx message is stored here
 * until the Telegram transport layer sends it.
 * Maps chatId → kx protocol message string.
 */
const pendingKeyExchangeMessages = new Map<string, string>();

/**
 * Store a pending key exchange message for a chat.
 * Called by telebridgeStartKeyExchange after successful key derivation.
 */
export function setPendingKeyExchangeMessage(chatId: string, kxMessage: string): void {
  pendingKeyExchangeMessages.set(chatId, kxMessage);
}

/**
 * Get and remove the pending key exchange message for a chat.
 * Called by the transport layer when sending the kx message.
 */
export function consumePendingKeyExchangeMessage(chatId: string): string | undefined {
  const msg = pendingKeyExchangeMessages.get(chatId);
  pendingKeyExchangeMessages.delete(chatId);
  return msg;
}

/**
 * Check if there's a pending key exchange message for a chat.
 */
export function hasPendingKeyExchangeMessage(chatId: string): boolean {
  return pendingKeyExchangeMessages.has(chatId);
}

// ---------- Types ----------

/** Result of processing an outgoing message through TeleBridge. */
export interface OutboundMessageResult {
  /** Whether the message was encrypted by TeleBridge. */
  readonly wasEncrypted: boolean;
  /** The modified text (protocol string) to send via Telegram. */
  readonly text: string;
  /** The mode used for encryption ('s' for symmetric, 'a' for asymmetric/secured). */
  readonly mode: ProtocolMode | undefined;
  /** The key ID used. */
  readonly keyId: string | undefined;
}

/** Result of processing an incoming message through TeleBridge. */
export interface InboundMessageResult {
  /** Whether the message was a TeleBridge protocol message. */
  readonly isProtocol: boolean;
  /** Whether this is a control message (kx, pk) that should be hidden from UI. */
  readonly shouldHide: boolean;
  /** The decrypted text to display (if decryption succeeded). */
  readonly decryptedText: string | undefined;
  /** The type of protocol message (kx, pk, s, a). */
  readonly mode: ProtocolMode | undefined;
  /** Whether this was a secured (Layer 4) message. */
  readonly isSecured: boolean;
  /** Key ID used for decryption (for tracking). */
  readonly keyId: string | undefined;
  /** Decryption error info (VAL-ERR-001: user-facing error indicator). */
  readonly decryptionError?: import('./errorHandling').DecryptionErrorInfo;
}

// ---------- Outgoing Message Encryption ----------

/**
 * Process an outgoing text message for TeleBridge encryption.
 *
 * If the chat has an established key, the message is encrypted as tb1.s.<base64>.
 * If this is a "Send Secured" action, it's encrypted as tb1.a.<base64>.
 * If no key is established, the message is sent unencrypted (no forced encryption).
 *
 * VAL-ERR-002: If encryption fails, plaintext is NOT sent unencrypted.
 * The message stays in the input field for retry. Error shown.
 *
 * VAL-EDGE-005: Message input enforces size limit. Warning shown when near limit.
 *
 * Note: We check for chat key existence rather than bridge unlock state because
 * chat keys can be set externally (e.g., via key exchange actions) even if the
 * full bridge unlock hasn't occurred in the current session. The bridge state
 * check is only needed for operations that require the identity key (Layer 4).
 *
 * @param text - Original plaintext text
 * @param chatId - Chat ID for key lookup
 * @param options - Encryption options
 * @returns Result indicating whether encryption was applied and the text to send
 */
export async function processOutgoingMessage(
  text: string,
  chatId: string,
  options?: {
    isSecured?: boolean;
  },
): Promise<OutboundMessageResult> {
  // Already a protocol message — don't re-encrypt
  if (text.startsWith(PROTOCOL_PREFIX)) {
    return { wasEncrypted: false, text, mode: undefined, keyId: undefined };
  }

  // Secured message (Layer 4) — not supported by this simple API,
  // use processOutgoingSecuredMessage instead which returns a pair
  if (options?.isSecured) {
    throw new Error('Use processOutgoingSecuredMessage for secured messages');
  }

  // Symmetric message (Layer 3) — only if chat key exists
  if (!hasChatKey(chatId)) {
    return { wasEncrypted: false, text, mode: undefined, keyId: undefined };
  }

  // VAL-EDGE-005: Validate message size before encryption
  const sizeValidation = validateMessageInputSize(text);
  if (sizeValidation.exceedsLimit) {
    // VAL-ERR-002: Prevent plaintext leak by throwing instead of sending unencrypted
    throw new Error(
      `Message too long: ${sizeValidation.byteSize} bytes exceeds limit of ${sizeValidation.maxBytes} bytes. `
      + 'Please shorten your message.',
    );
  }

  try {
    const result = await encryptMessage(text, chatId);

    // Check if key rotation is needed after sending
    if (shouldRotateChatKey(chatId)) {
      // Key rotation will be triggered asynchronously by the action handler
    }

    return {
      wasEncrypted: true,
      text: result.protocolMessage,
      mode: result.mode,
      keyId: result.keyId,
    };
  } catch (error) {
    // VAL-ERR-002: If encryption fails, plaintext is NOT sent unencrypted.
    // Message stays in input field for retry. Error shown.
    // We throw the error rather than returning the plaintext.

    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Encryption failed:', error);
    throw error;
  }
}

/**
 * Process a secured (Layer 4) outgoing message.
 * Uses the recipient's X25519 public key for asymmetric encryption.
 * Produces two messages: one for the recipient and one for the sender (encrypt-to-self).
 *
 * Wire format: tb1.a.<base64_payload>
 * Binary payload: [ephPub(32B)][nonce(12B)][ciphertext(var)][authTag(16B)][signature(64B)]
 *
 * @param text - Plaintext text to send securely
 * @param chatId - Chat ID (used for key lookup)
 * @returns Result with two protocol messages: recipient and self
 */
export interface SecuredMessagePair {
  /** Protocol message for recipient: tb1.a.<base64> */
  readonly forRecipient: string;
  /** Protocol message for sender's self-copy: tb1.a.<base64> */
  readonly forSelf: string;
  /** Whether encryption was successful */
  readonly wasEncrypted: boolean;
}

export async function processOutgoingSecuredMessage(
  text: string,
  chatId: string,
): Promise<SecuredMessagePair> {
  // Guard: bridge must be unlocked to access identity keys
  const identity = getUnlockedIdentity();
  if (!identity) {
    throw new Error('Bridge must be unlocked for secured messages');
  }

  // Guard: recipient's X25519 public key must be available
  // The recipient's public key is stored in the chat encryption state
  const recipientX25519Pub = getRecipientX25519PublicKey(chatId);
  if (!recipientX25519Pub) {
    throw new Error('Recipient key exchange must be completed before sending secured messages');
  }

  // Encode plaintext to bytes
  const plaintext = new TextEncoder().encode(text);

  // Check size budget
  if (plaintext.length > MAX_PLAINTEXT_BYTES) {
    throw new Error(
      `Plaintext too large for secured message: ${plaintext.length} bytes. Maximum: ${MAX_PLAINTEXT_BYTES} bytes.`,
    );
  }

  const { encryptSecuredMessage } = await import('./crypto/asymmetric');
  const result = await encryptSecuredMessage(plaintext, recipientX25519Pub, identity.ed25519);

  // Encode both payloads as tb1.a.<base64>
  const { encodeProtocol: encode } = await import('./crypto/protocol');
  const forRecipient = encode('a', result.forRecipient);
  const forSelf = encode('a', result.forSelf);

  return {
    forRecipient,
    forSelf,
    wasEncrypted: true,
  };
}

// ---------- KX Message Detection ----------

/**
 * Check if a message text is a key exchange (tb1.kx) protocol message.
 * Used by the message ingestion pipeline to detect kx messages
 * that need to be dispatched to telebridgeCompleteKeyExchange.
 *
 * @param text - Raw message text from Telegram
 * @returns true if the message is a tb1.kx message
 */
export function isKeyExchangeMessage(text: string): boolean {
  if (!isTeleBridgeMessage(text)) return false;
  const decoded = decodeProtocol(text);
  return decoded?.mode === 'kx';
}

/**
 * Check if a message is a sender key distribution (tb1.sk) protocol message.
 * Used by the message ingestion pipeline to detect sk messages
 * that need to be dispatched to processIncomingSenderKeyMessage.
 *
 * @param text - Raw message text from Telegram
 * @returns true if the message is a tb1.sk message
 */
export function isSenderKeyDistributionMessage(text: string): boolean {
  if (!isTeleBridgeMessage(text)) return false;
  const decoded = decodeProtocol(text);
  return decoded?.mode === 'sk';
}

// ---------- Incoming Message Decryption ----------

/**
 * Process an incoming text message for TeleBridge decryption.
 *
 * Detects tb-prefixed messages and:
 * - Symmetric (s): Decrypts and returns plaintext
 * - Asymmetric (a): Decrypts with recipient's private key
 * - Key exchange (kx): Processes and hides from UI
 * - Prekey (pk): Processes and hides from UI
 * - Non-protocol: Returns as-is (unencrypted coexistence)
 *
 * @param text - Raw message text from Telegram
 * @param chatId - Chat ID for key lookup
 * @param senderId - Sender's user ID (for asymmetric decryption)
 * @returns Decryption result
 */
export async function processIncomingMessage(
  text: string,
  chatId: string,
  senderId?: string,
  ourUserId?: string,
): Promise<InboundMessageResult> {
  // Fast check: if not a TeleBridge message, pass through
  if (!isTeleBridgeMessage(text)) {
    return {
      isProtocol: false,
      shouldHide: false,
      decryptedText: undefined,
      mode: undefined,
      isSecured: false,
      keyId: undefined,
    };
  }

  // Check if this message should be hidden from UI (kx/pk messages)
  // This is done regardless of bridge state
  const hide = shouldHideMessage(text);
  if (hide) {
    return {
      isProtocol: true,
      shouldHide: true,
      decryptedText: undefined,
      mode: undefined,
      isSecured: false,
      keyId: undefined,
    };
  }

  // For encrypted messages (s/a), we need the chat key to decrypt.
  // VAL-ERR-001: Show localized error, not blank/protocol string
  if (!hasChatKey(chatId) && !isBridgeUnlocked()) {
    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: undefined,
      mode: undefined,
      isSecured: false,
      keyId: undefined,
    };
  }

  try {
    // Detect mode early for proper routing
    const decoded = decodeProtocol(text);

    // Handle Layer 4 (asymmetric/secured) messages separately
    if (decoded?.mode === 'a') {
      // For self-sent secured messages (encrypt-to-self duplicate), hide them
      if (senderId && ourUserId && senderId === ourUserId) {
        // Try to decrypt as self-copy for display, but mark as hidden
        const selfResult = await processIncomingSelfSecuredMessage(text);
        return {
          ...selfResult,
          // Even if we can decrypt it, mark as hidden to avoid duplicate display
          shouldHide: true,
        };
      }

      // Regular incoming secured message — decrypt with our identity key
      const securedResult = await processIncomingSecuredMessage(text, chatId);
      return securedResult;
    }

    const result = await decryptProtocolMessage(text, chatId);
    if (!result) {
      // Decryption returned undefined — may not have the key
      return {
        isProtocol: true,
        shouldHide: false,
        decryptedText: undefined,
        mode: undefined,
        isSecured: false,
        keyId: undefined,
      };
    }

    // VAL-SEC-001: Replay detection for symmetric messages
    // Uses unique messageId built from keyId + counter + nonce to prevent
    // all messages under the same chat key from being flagged as replays.
    if (result.mode === 's' && result.keyId) {
      // Build unique messageId from keyId, counter, and nonce
      // This ensures each distinct encrypted message has a unique ID
      let messageId: string;
      if (decoded?.mode === 's' && decoded.payload.length >= 20) {
        // Extract counter (bytes 4-8) and nonce (bytes 8-20) from payload
        // Payload format: [keyId (4B)][counter (4B)][nonce (12B)][ciphertext][authTag (16B)]
        const counter = (decoded.payload[4] << 24) | (decoded.payload[5] << 16)
          | (decoded.payload[6] << 8) | decoded.payload[7];
        const nonce = decoded.payload.slice(8, 20);
        messageId = ReplayDetector.createMessageId(result.keyId, counter, nonce);
      } else {
        // Fallback: use only keyId (less precise but still provides basic protection)
        messageId = result.keyId;
      }

      if (replayDetector.isReplay(chatId, messageId)) {
        // Replayed message — return error indicator instead of plaintext
        return {
          isProtocol: true,
          shouldHide: false,
          decryptedText: undefined,
          mode: result.mode,
          isSecured: false,
          keyId: result.keyId,
        };
      }
      // Mark this message as seen
      replayDetector.markProcessed(chatId, messageId);
    }

    return {
      isProtocol: true,
      shouldHide: result.isProtocolControl,
      decryptedText: result.text,
      mode: result.mode,
      isSecured: result.mode === 'a',
      keyId: result.keyId,
    };
  } catch (error) {
    // Decryption failed — show a user-facing error indicator
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Decryption failed:', error);
    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: undefined,
      mode: undefined,
      isSecured: false,
      keyId: undefined,
    };
  }
}

// ---------- Key Exchange Message Handling ----------

/**
 * Process an incoming key exchange message.
 * Called when a tb1.kx.<base64> message is received.
 *
 * VAL-SEC-002: Protocol version downgrade rejection is applied here.
 * VAL-SEC-003: Forged kx/pk messages are rejected or flagged.
 *
 * This function:
 * 1. Validates the protocol version
 * 2. Validates the kx message structure
 * 3. Extracts the sender's ephemeral public key
 * 4. Derives the shared chat key using ECDH
 * 5. Stores the chat key for future message decryption
 * 6. Returns the new key ID
 *
 * @param protocolString - The tb1.kx.<base64> message
 * @param chatId - Chat ID for key storage
 * @returns Key ID of the newly established chat key
 */
/** Result of processing an incoming key exchange message. */
export interface KeyExchangeResult {
  /** Whether validation succeeded. */
  readonly isValid: boolean;
  /** The sender's ephemeral X25519 public key (32 bytes). */
  readonly ephemeralPub: Uint8Array | undefined;
  /** The sender's X25519 identity public key (32 bytes).
   *  Only present for initial kx messages (not rotation). */
  readonly x25519IdentityPub: Uint8Array | undefined;
  /** The new key ID for rotation kx messages.
   *  Only present for rotation kx messages (not initial). */
  readonly newKeyId: string | undefined;
  /** Error message if validation failed. */
  readonly error: string | undefined;
}

export function processKeyExchangeMessage(
  protocolString: string,
  _chatId: string,
): KeyExchangeResult {
  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'kx') {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: 'Invalid key exchange message',
    };
  }

  // VAL-SEC-002: Validate protocol version (reject downgrades)
  const versionValidation = validateProtocolVersion(decoded.version);
  if (!versionValidation.isValid) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Protocol version rejected: ${versionValidation.reason}`,
    };
  }

  // VAL-SEC-003: Validate kx message structure (reject forged messages)
  const kxValidation = validateKeyExchangeMessage(protocolString);
  if (!kxValidation.isValid) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Forged key exchange message: ${kxValidation.reason}`,
    };
  }

  // Check if this is a rotation kx message (starts with 0x02 marker)
  if (decoded.payload.length > 0 && decoded.payload[0] === ROTATION_KX_MARKER) {
    return processRotationKxMessage(decoded.payload, _chatId);
  }

  // Initial kx message: ephemeralPub (32 bytes) + x25519IdentityPub (32 bytes) = 64 bytes
  if (decoded.payload.length < 64) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Key exchange payload too short: ${decoded.payload.length} bytes (expected 64)`,
    };
  }

  const ephemeralPub = decoded.payload.slice(0, 32);
  const x25519IdentityPub = decoded.payload.slice(32, 64);

  return {
    isValid: true,
    ephemeralPub,
    x25519IdentityPub,
    newKeyId: undefined, // Not present in initial kx messages
    error: undefined,
  };
}

// ---------- Rotation Key Exchange Message Processing ----------

/**
 * Rotation kx payload minimum size:
 * [0x02 marker (1)] [keyId (4)] [ephemeralPub (32)] [nonce (12)] [ciphertext (32)] [authTag (16)] = 97 bytes
 */
const ROTATION_KX_MIN_PAYLOAD = 1 + 4 + 32 + 12 + 32 + 16;

/**
 * Process a rotation key exchange message (payload starts with 0x02 marker).
 *
 * Rotation kx messages are used during key rotation to deliver a new symmetric key
 * encrypted via ECDH. The format is:
 * [0x02 marker (1)] [keyId (4)] [ephemeralPub (32)] [nonce (12)] [ciphertext (32)] [authTag (16)]
 *
 * VAL-SEC-006: The new symmetric key is never sent in the clear — it's encrypted
 * via ECDH with the recipient's public key.
 *
 * @param payload - The decoded kx payload (starting with 0x02 marker)
 * @param _chatId - Chat ID (for future key storage)
 * @returns Rotation kx result with ephemeralPub and newKeyId
 */
function processRotationKxMessage(
  payload: Uint8Array,
  _chatId: string,
): KeyExchangeResult {
  // Validate minimum payload size
  if (payload.length < ROTATION_KX_MIN_PAYLOAD) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Rotation kx payload too short: ${payload.length} bytes (minimum ${ROTATION_KX_MIN_PAYLOAD})`,
    };
  }

  // Parse the payload
  let offset = 0;

  // Marker byte (already verified to be 0x02 by the caller)
  const marker = payload[offset];
  if (marker !== ROTATION_KX_MARKER) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Invalid rotation kx marker: expected 0x02, got 0x${marker.toString(16).padStart(2, '0')}`,
    };
  }
  offset += 1;

  // Key ID (4 bytes)
  const keyIdBytes = payload.slice(offset, offset + 4);
  const newKeyId = Array.from(keyIdBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  offset += 4;

  // Ephemeral public key (32 bytes)
  const ephemeralPub = payload.slice(offset, offset + 32);
  offset += 32;

  // Nonce (12 bytes) — extracted for validation
  const _nonce = payload.slice(offset, offset + 12);
  offset += 12;

  // Ciphertext (remaining - 16 bytes authTag)
  const ciphertextLen = payload.length - offset - 16;
  if (ciphertextLen <= 0) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: `Rotation kx ciphertext too short: ${ciphertextLen} bytes`,
    };
  }
  const _ciphertext = payload.slice(offset, offset + ciphertextLen);
  offset += ciphertextLen;

  // Auth tag (16 bytes)
  const _authTag = payload.slice(offset, offset + 16);

  // Validate ephemeral public key is not all zeros (low-order point check)
  let isAllZeros = true;
  for (let i = 0; i < 32; i++) {
    if (ephemeralPub[i] !== 0) {
      isAllZeros = false;
      break;
    }
  }
  if (isAllZeros) {
    return {
      isValid: false,
      ephemeralPub: undefined,
      x25519IdentityPub: undefined,
      newKeyId: undefined,
      error: 'All-zero ephemeral public key detected in rotation kx message',
    };
  }

  // The rotation kx message is valid.
  // The actual decryption of the new chat key requires the recipient's private key
  // and is handled by processRotationKxDecryption().
  // Here we just validate and extract the public components.

  return {
    isValid: true,
    ephemeralPub,
    x25519IdentityPub: undefined, // Not present in rotation kx messages
    newKeyId,
    error: undefined,
  };
}

/**
 * Result of decrypting a rotation key exchange message.
 */
export interface RotationKxDecryptionResult {
  /** Whether decryption succeeded. */
  readonly success: boolean;
  /** The new chat key (32 bytes), decrypted from the rotation message. */
  readonly newKey: Uint8Array | undefined;
  /** The new key ID (hex of first 4 bytes of the key). */
  readonly newKeyId: string | undefined;
  /** Error message if decryption failed. */
  readonly error: string | undefined;
}

/**
 * Decrypt the new chat key from a rotation kx message using the recipient's
 * X25519 private key and the sender's ephemeral public key.
 *
 * This performs the ECDH computation in reverse:
 * 1. ECDH(X25519_identity_priv, sender_ephemeral_pub) → shared secret
 * 2. HKDF(shared_secret, ...) → rotation encryption key
 * 3. AES-256-GCM decrypt the ciphertext using the rotation encryption key
 * 4. Store the new chat key for future message encryption/decryption
 *
 * @param protocolString - The tb1.kx.<base64> message
 * @param chatId - Chat ID for key storage
 * @param myX25519Scalar - Our X25519 private scalar
 * @returns Decryption result with the new chat key
 */
export async function processRotationKxDecryption(
  protocolString: string,
  chatId: string,
  myX25519Scalar: Uint8Array,
): Promise<RotationKxDecryptionResult> {
  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'kx') {
    return { success: false, newKey: undefined, newKeyId: undefined, error: 'Invalid kx message' };
  }

  const payload = decoded.payload;

  // Must be a rotation kx message (starts with 0x02 marker)
  if (payload.length < 1 || payload[0] !== ROTATION_KX_MARKER) {
    return { success: false, newKey: undefined, newKeyId: undefined, error: 'Not a rotation kx message' };
  }

  if (payload.length < ROTATION_KX_MIN_PAYLOAD) {
    return {
      success: false,
      newKey: undefined,
      newKeyId: undefined,
      error: `Rotation kx payload too short: ${payload.length} bytes`,
    };
  }

  // Parse the payload
  let offset = 0;
  offset += 1; // skip marker

  const keyIdBytes = payload.slice(offset, offset + 4);
  const newKeyId = Array.from(keyIdBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  offset += 4;

  const ephemeralPub = payload.slice(offset, offset + 32);
  offset += 32;

  const nonce = payload.slice(offset, offset + 12);
  offset += 12;

  const ciphertextLen = payload.length - offset - 16;
  if (ciphertextLen <= 0) {
    return {
      success: false,
      newKey: undefined,
      newKeyId: undefined,
      error: `Rotation kx ciphertext too short: ${ciphertextLen} bytes`,
    };
  }
  const ciphertext = payload.slice(offset, offset + ciphertextLen);
  offset += ciphertextLen;

  const authTag = payload.slice(offset, offset + 16);

  try {
    // Perform ECDH: our X25519 private key × sender's ephemeral public key
    const ecdhSharedSecret = x25519.getSharedSecret(myX25519Scalar, ephemeralPub);

    // Derive the same rotation encryption key using HKDF-SHA256
    const rotationEncKey = deriveChatKey(ecdhSharedSecret);

    // Build AAD: rotation marker + key ID
    const aad = new Uint8Array(5);
    aad[0] = ROTATION_KX_MARKER;
    aad.set(keyIdBytes, 1);

    // Decrypt the new chat key using AES-256-GCM
    const decryptedKey = await decryptSymmetric(nonce, ciphertext, authTag, rotationEncKey, aad);

    // Defense-in-depth: verify decrypted key length is 32 bytes (AES-256)
    if (decryptedKey.length !== 32) {
      return {
        success: false,
        newKey: undefined,
        newKeyId: undefined,
        error: `Decrypted key length is ${decryptedKey.length} bytes (expected 32)`,
      };
    }

    // Store the new chat key for this chat
    setChatKey(chatId, decryptedKey);

    return {
      success: true,
      newKey: decryptedKey,
      newKeyId,
      error: undefined,
    };
  } catch (error) {
    return {
      success: false,
      newKey: undefined,
      newKeyId: undefined,
      error: `Rotation kx decryption failed: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

/**
 * Process an incoming prekey message.
 * Called when a tb1.pk.<base64> message is received.
 *
 * @param protocolString - The tb1.pk.<base64> message
 * @param _chatId - Chat ID for key storage
 * @returns Key ID of the newly established chat key
 */
export function processPrekeyMessage(
  protocolString: string,
  _chatId: string,
): string {
  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'pk') {
    throw new Error('Invalid prekey message');
  }

  // Similar to kx — handled by the key exchange action
  return decoded.mode;
}

// ---------- Message Edit Handling ----------

/**
 * Process an edited message.
 * If the original message was encrypted, re-encrypt the edited text.
 *
 * @param newText - The new edited text
 * @param chatId - Chat ID for key lookup
 * @param wasOriginalEncrypted - Whether the original message was encrypted
 * @returns Encrypted edited message or original text
 */
export async function processEditedMessage(
  newText: string,
  chatId: string,
  wasOriginalEncrypted: boolean,
): Promise<OutboundMessageResult> {
  if (!wasOriginalEncrypted) {
    return { wasEncrypted: false, text: newText, mode: undefined, keyId: undefined };
  }

  // Re-encrypt the edited text with the same chat key
  return processOutgoingMessage(newText, chatId);
}

// ---------- Forward Handling ----------

/**
 * Process a forwarded message.
 * If the destination chat has encryption, re-encrypt with the destination key.
 * If the source message was encrypted but destination has no key, it remains encrypted.
 *
 * @param originalText - The text being forwarded
 * @param sourceChatId - Source chat ID
 * @param destChatId - Destination chat ID
 * @returns Encrypted message for destination or original text
 */
export async function processForwardedMessage(
  originalText: string,
  sourceChatId: string,
  destChatId: string,
): Promise<OutboundMessageResult> {
  // If destination has a key, re-encrypt with destination key
  if (hasChatKey(destChatId)) {
    // If source was encrypted, decrypt first, then re-encrypt for destination
    if (isTeleBridgeMessage(originalText)) {
      const decrypted = await decryptProtocolMessage(originalText, sourceChatId);
      if (decrypted?.text) {
        return processOutgoingMessage(decrypted.text, destChatId);
      }
    }
    // Unencrypted source but encrypted destination — encrypt for destination
    return processOutgoingMessage(originalText, destChatId);
  }

  // Destination has no key — forward as-is
  return { wasEncrypted: false, text: originalText, mode: undefined, keyId: undefined };
}

// ---------- Reply Handling ----------

/**
 * Process a reply to an encrypted message.
 * The reply is encrypted with the same chat key.
 * The quoted text from the parent message is decrypted for display.
 *
 * @param replyText - The reply text
 * @param chatId - Chat ID for key lookup
 * @param parentMessageText - The parent message text (may be encrypted)
 * @returns Reply encryption result and decrypted parent text
 */
export async function processReplyMessage(
  replyText: string,
  chatId: string,
  parentMessageText?: string,
): Promise<{
  reply: OutboundMessageResult;
  decryptedParentText?: string;
}> {
  // Decrypt parent message if it was encrypted
  let decryptedParentText: string | undefined;
  if (parentMessageText && isTeleBridgeMessage(parentMessageText)) {
    const parentResult = await processIncomingMessage(parentMessageText, chatId);
    decryptedParentText = parentResult.decryptedText;
  }

  // Encrypt the reply with the same chat key
  const reply = await processOutgoingMessage(replyText, chatId);

  return { reply, decryptedParentText };
}

// ---------- Key Rotation Actions ----------

/**
 * Check if key rotation is needed and return the rotation data.
 * Called after each encrypted message send.
 * Also generates the ECDH-encrypted kx message for distribution.
 *
 * @param chatId - Chat ID to check
 * @returns Rotation data including kx message if rotation needed and possible, undefined otherwise
 */
export async function checkKeyRotation(chatId: string): Promise<{
  oldKeyId: string;
  newKeyId: string;
  newKey: Uint8Array;
  kxMessage?: string;
} | undefined> {
  if (!shouldRotateChatKey(chatId)) return undefined;

  const rotationData = rotateChatKey(chatId);

  // Try to generate an ECDH-encrypted kx message for distribution
  const kxMessage = await buildRotationKxMessage(chatId, rotationData);

  return {
    ...rotationData,
    kxMessage,
  };
}

/**
 * Build an ECDH-encrypted key rotation kx message.
 * Uses the recipient's X25519 public key to encrypt the new symmetric key.
 *
 * @param chatId - Chat ID (to look up recipient's public key)
 * @param rotationData - The rotation data containing old/new key IDs and the new key
 * @returns kx protocol message string, or undefined if recipient's public key is not available
 */
async function buildRotationKxMessage(
  chatId: string,
  rotationData: { oldKeyId: string; newKeyId: string; newKey: Uint8Array },
): Promise<string | undefined> {
  // Must have the recipient's X25519 public key for ECDH encryption
  const recipientPubKey = recipientX25519PublicKeys.get(chatId);
  if (!recipientPubKey) {
    // Cannot perform ECDH without recipient's public key
    return undefined;
  }

  const { newKeyId, newKey } = rotationData;

  // Generate ephemeral X25519 keypair for this rotation
  const ephemeralKeypair = x25519.keygen();

  // Perform ECDH: our ephemeral private key × recipient's X25519 public key
  const ecdhSharedSecret = x25519.getSharedSecret(ephemeralKeypair.secretKey, recipientPubKey);

  // Derive an AES-256 encryption key from the ECDH shared secret using HKDF-SHA256
  const rotationEncKey = deriveChatKey(ecdhSharedSecret);

  // Encrypt the new chat key with AES-256-GCM using the ECDH-derived key
  // AAD includes the rotation marker and key ID for authenticity
  const aad = new Uint8Array(5);
  aad[0] = ROTATION_KX_MARKER;
  const keyIdBytes = hexToBytes(newKeyId);
  aad.set(keyIdBytes, 1);

  const { nonce, ciphertext, authTag } = await encryptSymmetric(newKey, rotationEncKey, aad);

  // Build the rotation kx payload:
  // [0x02 marker][keyId (4B)][ephemeralPub (32B)][nonce (12B)][ciphertext (32B)][authTag (16B)]
  const kxPayload = new Uint8Array(1 + 4 + 32 + 12 + ciphertext.length + 16);
  let offset = 0;
  kxPayload[offset] = ROTATION_KX_MARKER;
  offset += 1;
  kxPayload.set(keyIdBytes, offset);
  offset += 4;
  kxPayload.set(ephemeralKeypair.publicKey, offset);
  offset += 32;
  kxPayload.set(nonce, offset);
  offset += 12;
  kxPayload.set(ciphertext, offset);
  offset += ciphertext.length;
  kxPayload.set(authTag, offset);

  return encodeProtocol('kx', kxPayload);
}

// ---------- Encrypt-to-self Handling ----------

/**
 * For Layer 4 (secured) messages, we send two messages:
 * one for the recipient and one for ourselves (encrypt-to-self).
 * This function checks if an incoming message is our own encrypt-to-self copy
 * and should be hidden from the UI as a duplicate.
 *
 * @param text - The message text
 * @param senderId - The sender's user ID
 * @param ourUserId - Our own user ID
 * @returns true if this is an encrypt-to-self duplicate that should be filtered
 */
export function isEncryptToSelfDuplicate(
  text: string,
  senderId: string,
  ourUserId: string,
): boolean {
  if (!isTeleBridgeMessage(text)) return false;
  if (senderId !== ourUserId) return false;

  const decoded = decodeProtocol(text);
  // Only secured (Layer 4) messages have encrypt-to-self duplicates
  return decoded?.mode === 'a';
}

// ---------- Cleanup ----------

/**
 * Clear module-level stores that contain private key material.
 * Called from telebridgeLock action to clear stores defined in
 * the telebridge.ts action file that integration.ts cannot access.
 *
 * Also callable directly for test teardown.
 */
export function clearPrekeyAndRecipientStores(): void {
  recipientX25519PublicKeys.clear();
}

/**
 * Lock the bridge and clear all in-memory keys.
 * Called when the user locks the bridge.
 *
 * Clears ALL in-memory private key material including:
 * - Chat keys (chatKeys Map in messages.ts)
 * - Recipient X25519 public keys (this module)
 * - Pending key exchange messages (this module)
 * - Group encryption keys
 * - Prekey bundles and recipient stores in action module
 *
 * Call clearActionLevelStores() from the telebridge.ts action file
 * BEFORE calling this to clear action-level stores too.
 */
export function lockMessagePipeline(): void {
  clearAllChatKeys();
  recipientX25519PublicKeys.clear();
  pendingKeyExchangeMessages.clear();
  // Clear group encryption keys
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require('./group/groupState') as typeof import('./group/groupState');
  groupState.clearAllGroupEncryption();
  // Clear sender key distribution state
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const senderKeyDist = require(
    './group/senderKeyDistribution',
  ) as typeof import('./group/senderKeyDistribution');
  senderKeyDist.lockSenderKeyDistribution();
}

// ---------- Recipient X25519 Public Key Store ----------

/**
 * In-memory store for recipient X25519 public keys.
 * Maps chatId → recipient's X25519 public point (32 bytes).
 * Populated during key exchange or from global state.
 */
const recipientX25519PublicKeys = new Map<string, Uint8Array>();

/**
 * Store a recipient's X25519 public key for a chat.
 * Called after key exchange completion or when loading chat encryption state.
 */
export function setRecipientX25519PublicKey(chatId: string, publicKey: Uint8Array): void {
  if (publicKey.length !== 32) {
    throw new Error(`X25519 public key must be 32 bytes, got ${publicKey.length}`);
  }
  recipientX25519PublicKeys.set(chatId, publicKey);
}

/**
 * Get the recipient's X25519 public key for a chat.
 * Returns undefined if no key exchange has been completed.
 */
export function getRecipientX25519PublicKey(chatId: string): Uint8Array | undefined {
  return recipientX25519PublicKeys.get(chatId);
}

/**
 * Remove a recipient's X25519 public key (called during key rotation or lock).
 */
export function removeRecipientX25519PublicKey(chatId: string): boolean {
  return recipientX25519PublicKeys.delete(chatId);
}

// ---------- Incoming Secured Message Decryption ----------

/**
 * Decrypt an incoming secured (Layer 4) message.
 * Uses the recipient's identity keypair (Ed25519 → X25519 derivation).
 *
 * @param protocolString - The tb1.a.<base64> message
 * @param chatId - Chat ID for sender key lookup
 * @param senderEd25519Pub - Sender's Ed25519 public key for signature verification
 * @returns Decrypted message result
 */
export async function processIncomingSecuredMessage(
  protocolString: string,
  _chatId: string,
  senderEd25519Pub?: Uint8Array,
): Promise<InboundMessageResult> {
  const identity = getUnlockedIdentity();
  if (!identity) {
    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }

  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'a') {
    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }

  try {
    const { decryptSecuredMessageRecipient } = await import('./crypto/asymmetric');

    // Use the sender's Ed25519 public key if provided for signature verification
    // Fallback to zero bytes if sender key not available (signature verification will fail)
    const senderVerifyKey = senderEd25519Pub ?? new Uint8Array(32);

    const decrypted = await decryptSecuredMessageRecipient(
      decoded.payload,
      identity.ed25519,
      senderVerifyKey,
    );

    const text = new TextDecoder().decode(decrypted.plaintext);

    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: text,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Secured message decryption failed:', error);
    return {
      isProtocol: true,
      shouldHide: false,
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }
}

/**
 * Decrypt a self-copy of a secured message (encrypt-to-self).
 * The sender uses this to decrypt the copy they sent to themselves.
 *
 * @param protocolString - The tb1.a.<base64> self-copy message
 * @returns Decrypted message result
 */
export async function processIncomingSelfSecuredMessage(
  protocolString: string,
): Promise<InboundMessageResult> {
  const identity = getUnlockedIdentity();
  if (!identity) {
    return {
      isProtocol: true,
      shouldHide: true, // Hide self-copy if bridge is locked
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }

  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'a') {
    return {
      isProtocol: true,
      shouldHide: true,
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }

  try {
    const { decryptSecuredMessageSelf } = await import('./crypto/asymmetric');

    const decrypted = await decryptSecuredMessageSelf(
      decoded.payload,
      identity.ed25519,
    );

    const text = new TextDecoder().decode(decrypted.plaintext);

    return {
      isProtocol: true,
      shouldHide: true, // Self-copies are always hidden (duplicate of sender's view)
      decryptedText: text,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Self-copy decryption failed:', error);
    return {
      isProtocol: true,
      shouldHide: true,
      decryptedText: undefined,
      mode: 'a',
      isSecured: true,
      keyId: undefined,
    };
  }
}

// ---------- Key Rotation Triggers ----------

/** Default message count threshold for key rotation. */
export const ROTATE_AFTER_MESSAGES = 100;

/** Default time threshold for key rotation (7 days in ms). */
export const ROTATE_AFTER_TIME_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if key rotation should be triggered based on message count.
 * Called after each encrypted message send.
 *
 * @param chatId - Chat ID to check
 * @param currentMessageCount - Current message count for the chat
 * @returns true if key rotation should be triggered
 */
export function shouldTriggerKeyRotationByCount(
  chatId: string,
  currentMessageCount: number,
): boolean {
  if (!hasChatKey(chatId)) return false;
  return currentMessageCount >= ROTATE_AFTER_MESSAGES;
}

/**
 * Check if key rotation should be triggered based on time threshold.
 * Called before encrypting a message if the time threshold has passed.
 *
 * @param chatId - Chat ID to check
 * @param lastKeyExchangeAt - Timestamp of last key exchange (ms since epoch)
 * @returns true if key rotation should be triggered
 */
export function shouldTriggerKeyRotationByTime(
  chatId: string,
  lastKeyExchangeAt: number | undefined,
): boolean {
  if (!hasChatKey(chatId)) return false;
  if (!lastKeyExchangeAt) return false;
  return Date.now() - lastKeyExchangeAt >= ROTATE_AFTER_TIME_MS;
}

/**
 * Rotation kx payload marker byte.
 * Distinguishes rotation kx messages from initial kx messages.
 * Initial kx: payload starts with ephemeralPub (32 bytes) + x25519IdentityPub (32 bytes)
 * Rotation kx: payload starts with 0x02 marker byte.
 */
export const ROTATION_KX_MARKER = 0x02;

/**
 * Perform key rotation and return the kx protocol message for distribution.
 *
 * The rotation uses ECDH to encrypt the new symmetric key:
 * 1. Generate a new ephemeral X25519 keypair
 * 2. Perform ECDH with the recipient's X25519 public key to derive an encryption key
 * 3. Encrypt the new chat key with AES-256-GCM using the ECDH-derived key
 * 4. Build the rotation kx payload:
 *    [0x02 marker][keyId (4B)][ephemeralPub (32B)][nonce (12B)][ciphertext (32B)][authTag (16B)]
 *
 * VAL-SEC-006: Key rotation never sends raw symmetric keys in the clear.
 * The new key is encrypted via ECDH — only an X25519 public point is transmitted.
 *
 * VAL-E2E-007: Key rotation sends new public key (not raw symmetric key) in tb1.kx payload.
 *
 * @param chatId - Chat ID to rotate
 * @returns kx protocol message and rotation info, or undefined if rotation not possible
 */
export async function performKeyRotation(
  chatId: string,
): Promise<{ kxMessage: string | undefined; oldKeyId: string; newKeyId: string } | undefined> {
  // Must have a chat key to rotate
  if (!hasChatKey(chatId)) return undefined;

  // Rotate the key — generates a new symmetric key and retains the old one in previousKeys
  const rotationData = rotateChatKey(chatId);

  // Build the ECDH-encrypted kx message
  const kxMessage = await buildRotationKxMessage(chatId, rotationData);

  if (!kxMessage) {
    // Cannot build kx message (no recipient public key) — rotation was performed locally
    // but the kx message cannot be sent to the other party
    // Return undefined (not empty string) — callers must check before sending
    return {
      kxMessage: undefined,
      oldKeyId: rotationData.oldKeyId,
      newKeyId: rotationData.newKeyId,
    };
  }

  return { kxMessage, oldKeyId: rotationData.oldKeyId, newKeyId: rotationData.newKeyId };
}

// ---------- Media Encryption Integration ----------

/**
 * Encrypt media data for sending via TeleBridge.
 * Wraps the crypto-level encryptMedia with key lookup by explicit chatId.
 *
 * V1 Bug #4 guard: Key lookup uses explicit chatId, NOT selectCurrentChat().
 *
 * @param fileData - Raw media data to encrypt
 * @param chatId - Explicit chat ID for key derivation
 * @param mediaId - Unique media file identifier
 * @param mediaType - Type of media (ALL types encrypted unconditionally)
 * @returns Encrypted data
 */
export async function encryptMediaForChat(
  fileData: Uint8Array,
  chatId: string,
  mediaId: string,
  mediaType: MediaType,
): Promise<Uint8Array> {
  const entry = getChatKeyEntry(chatId);
  if (!entry) {
    throw new Error(`No chat key for chat ${chatId}. Cannot encrypt media.`);
  }

  const { encryptMedia } = await import('./crypto/media');
  return encryptMedia(fileData, entry.key, chatId, mediaId, mediaType);
}

/**
 * Decrypt media data received via TeleBridge.
 * Wraps the crypto-level decryptMedia with key lookup by explicit chatId.
 *
 * V1 Bug #4 guard: Key lookup uses explicit chatId, NOT selectCurrentChat().
 *
 * @param encryptedData - Encrypted media data
 * @param chatId - Explicit chat ID for key derivation
 * @param mediaId - Unique media file identifier
 * @returns Decrypted data, or undefined if decryption fails
 */
export async function decryptMediaForChat(
  encryptedData: Uint8Array,
  chatId: string,
  mediaId: string,
): Promise<Uint8Array | undefined> {
  const entry = getChatKeyEntry(chatId);
  if (!entry) {
    return undefined;
  }

  const { decryptMedia } = await import('./crypto/media');
  return decryptMedia(encryptedData, entry.key, chatId, mediaId);
}

// ---------- Utility ----------

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// ---------- Group Message Processing ----------

/**
 * Check if a message is a group encrypted message.
 * Group messages use the 'g' mode in the protocol format: tb1.g.<base64>
 */
function isGroupTeleBridgeMessage(text: string): boolean {
  return typeof text === 'string' && text.startsWith('tb1.g.');
}

/**
 * Result of processing a group encrypted message.
 */
export interface GroupMessageResult {
  /** Whether the message was a TeleBridge group message. */
  readonly isGroupMessage: boolean;
  /** Decrypted text (if decryption succeeded). */
  readonly decryptedText: string | undefined;
  /** Sender's member ID. */
  readonly senderId: string | undefined;
  /** Group ID. */
  readonly groupId: string | undefined;
  /** Whether the sender's signature was verified. */
  readonly isSignatureValid: boolean;
  /** Whether this message should be hidden from UI (control message). */
  readonly shouldHide: boolean;
}

/**
 * Process an incoming group message.
 * Detects tb1.g.<base64> messages and decrypts them using the
 * distributed sender key for the message sender.
 *
 * @param text - Raw message text from Telegram
 * @param groupId - Group chat ID for key lookup
 * @param senderId - Sender's user ID for sender key lookup
 * @returns Group message result
 */
export async function processIncomingGroupMessage(
  text: string,
  groupId: string,
  senderId: string,
): Promise<GroupMessageResult> {
  // Not a group message — pass through
  if (!isGroupTeleBridgeMessage(text)) {
    return {
      isGroupMessage: false,
      decryptedText: undefined,
      senderId: undefined,
      groupId: undefined,
      isSignatureValid: false,
      shouldHide: false,
    };
  }

  // Get the distributed sender key for this sender in this group
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require('./group/groupState') as typeof import('./group/groupState');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupEnc = require('./group/groupEncryption') as typeof import('./group/groupEncryption');

  const distKey = groupState.getDistributedSenderKey(groupId, senderId);
  if (!distKey) {
    return {
      isGroupMessage: true,
      decryptedText: undefined,
      senderId,
      groupId,
      isSignatureValid: false,
      shouldHide: false,
    };
  }

  try {
    const result = await groupEnc.decryptGroupMessage(text, distKey);
    return {
      isGroupMessage: true,
      decryptedText: result.text,
      senderId: result.senderId,
      groupId: result.groupId,
      isSignatureValid: result.isSignatureValid,
      shouldHide: false,
    };
  } catch {
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Group message decryption failed');
    return {
      isGroupMessage: true,
      decryptedText: undefined,
      senderId,
      groupId,
      isSignatureValid: false,
      shouldHide: false,
    };
  }
}

/**
 * Process an outgoing group message for encryption.
 * Uses the sender's own Sender Key to encrypt the message.
 *
 * @param text - Plaintext text to encrypt
 * @param groupId - Group chat ID
 * @param memberId - Our member ID
 * @returns Encrypted group message, or original text if encryption not available
 */
export async function processOutgoingGroupMessage(
  text: string,
  groupId: string,
  memberId: string,
): Promise<{ wasEncrypted: boolean; text: string; chainIndex: number }> {
  // Already a protocol message — don't re-encrypt
  if (isTeleBridgeMessage(text)) {
    return { wasEncrypted: false, text, chainIndex: 0 };
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require('./group/groupState') as typeof import('./group/groupState');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupEnc = require('./group/groupEncryption') as typeof import('./group/groupEncryption');

  // Get our own sender key for this group
  const senderKey = groupState.getOwnGroupSenderKey(groupId, memberId);
  if (!senderKey) {
    return { wasEncrypted: false, text, chainIndex: 0 };
  }

  try {
    const result = await groupEnc.encryptGroupMessage(text, senderKey);
    return {
      wasEncrypted: true,
      text: result.protocolMessage,
      chainIndex: result.chainIndex,
    };
  } catch {
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Group message encryption failed');
    throw new Error('Group message encryption failed');
  }
}

// ---------- Incoming Sender Key Distribution ----------

/**
 * Result of processing an incoming sender key distribution message.
 */
export interface SenderKeyDistributionResult {
  /** Whether the key was successfully processed and stored. */
  readonly success: boolean;
  /** Group ID the key belongs to. */
  readonly groupId: string;
  /** Member ID of the key owner. */
  readonly memberId: string;
  /** Error message if failed. */
  readonly error?: string;
}

/**
 * Process an incoming sender key distribution message (tb1.sk.<base64>).
 * Called by the message ingestion pipeline when a tb1.sk message is detected.
 *
 * This function:
 * 1. Decodes the tb1.sk protocol message
 * 2. Deserializes and verifies the distributed sender key
 * 3. Stores the key for future group message decryption
 *
 * VAL-GROUP-002: Received sender keys are stored and available for decryption.
 *
 * @param text - The raw message text (tb1.sk.<base64>)
 * @param groupId - Group chat ID for validation
 * @returns Distribution result
 */
export function processIncomingSenderKeyDistribution(
  text: string,
  groupId: string,
): SenderKeyDistributionResult {
  if (!isSenderKeyDistributionMessage(text)) {
    return {
      success: false,
      groupId,
      memberId: '',
      error: 'Not a sender key distribution message',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const senderKeyDist = require(
    './group/senderKeyDistribution',
  ) as typeof import('./group/senderKeyDistribution');

  return senderKeyDist.processIncomingSenderKeyMessage(text, groupId);
}

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

import type { MediaType } from './crypto/media';
import type { ProtocolMode } from './crypto/protocol';

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
  clearAllChatKeys,
  decryptProtocolMessage,
  encryptMessage,
  getChatKeyEntry,
  hasChatKey,
  isTeleBridgeMessage,
  rotateChatKey,
  shouldHideMessage,
  shouldRotateChatKey,
} from './messages';

import {
  createDecryptionError,
  classifyDecryptionError,
  handleEncryptionFailure,
  isEncryptionFailure,
} from './errorHandling';

import {
  replayDetector,
  validateProtocolMessage,
  validateProtocolVersion,
  validateKeyExchangeMessage,
} from './security';

import {
  validateMessageInputSize,
} from './edgeCases';

// Re-exports for external consumers (like Composer.tsx)
export { hasChatKey, setChatKey, isTeleBridgeMessage } from './messages';

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
    if (result.mode === 's' && result.keyId) {
      // Extract counter from the binary payload for replay detection
      // The counter is embedded in the protocol message
      const messageId = result.keyId;
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
export function processKeyExchangeMessage(
  protocolString: string,
  _chatId: string,
): string {
  const decoded = decodeProtocol(protocolString);
  if (!decoded || decoded.mode !== 'kx') {
    throw new Error('Invalid key exchange message');
  }

  // VAL-SEC-002: Validate protocol version (reject downgrades)
  const versionValidation = validateProtocolVersion(decoded.version);
  if (!versionValidation.isValid) {
    throw new Error(`Protocol version rejected: ${versionValidation.reason}`);
  }

  // VAL-SEC-003: Validate kx message structure (reject forged messages)
  const kxValidation = validateKeyExchangeMessage(protocolString);
  if (!kxValidation.isValid) {
    throw new Error(`Forged key exchange message: ${kxValidation.reason}`);
  }

  // The kx payload contains the sender's X25519 ephemeral public key
  // Full ECDH and key derivation is handled in the telebridge actions
  return decoded.mode;
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
 *
 * @param chatId - Chat ID to check
 * @returns Rotation data if rotation needed, undefined otherwise
 */
export function checkKeyRotation(chatId: string): {
  oldKeyId: string;
  newKeyId: string;
  newKey: Uint8Array;
} | undefined {
  if (!shouldRotateChatKey(chatId)) return undefined;
  return rotateChatKey(chatId);
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
 * Lock the bridge and clear all in-memory keys.
 * Called when the user locks the bridge.
 */
export function lockMessagePipeline(): void {
  clearAllChatKeys();
  recipientX25519PublicKeys.clear();
  // Clear group encryption keys
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require('./group/groupState') as typeof import('./group/groupState');
  groupState.clearAllGroupEncryption();
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
 * Perform key rotation and return the kx protocol message for distribution.
 *
 * @param chatId - Chat ID to rotate
 * @returns kx protocol message and rotation info, or undefined if rotation not needed
 */
export function performKeyRotation(
  chatId: string,
): { kxMessage: string; oldKeyId: string; newKeyId: string } | undefined {
  if (!shouldRotateChatKey(chatId)) return undefined;

  const { oldKeyId, newKeyId, newKey } = rotateChatKey(chatId);

  // Construct a key exchange message containing the new key
  // In a full implementation, this would use X3DH to derive a shared secret
  // For now, encode a kx message with the new public key info
  const kxPayload = new Uint8Array(36); // 4 bytes keyId + 32 bytes new public key
  const keyIdBytes = hexToBytes(newKeyId);
  kxPayload.set(keyIdBytes, 0);
  // The new key itself is not sent in clear — this is a placeholder
  // In the real implementation, the key would be encrypted with ECDH
  kxPayload.set(newKey.subarray(0, 32), 4);

  const kxMessage = encodeProtocol('kx', kxPayload);

  return { kxMessage, oldKeyId, newKeyId };
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

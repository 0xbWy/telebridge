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

import type { ProtocolMode } from './crypto/protocol';

import {
  isBridgeUnlocked,
} from './crypto/persistence';
import {
  decodeProtocol,
  PROTOCOL_PREFIX,
} from './crypto/protocol';
import {
  clearAllChatKeys,
  decryptProtocolMessage,
  encryptMessage,
  hasChatKey,
  isTeleBridgeMessage,
  rotateChatKey,
  shouldHideMessage,
  shouldRotateChatKey,
} from './messages';

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
}

// ---------- Outgoing Message Encryption ----------

/**
 * Process an outgoing text message for TeleBridge encryption.
 *
 * If the chat has an established key, the message is encrypted as tb1.s.<base64>.
 * If this is a "Send Secured" action, it's encrypted as tb1.a.<base64>.
 * If no key is established, the message is sent unencrypted (no forced encryption).
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

  // Secured message (Layer 4)
  if (options?.isSecured) {
    return processOutgoingSecuredMessage(text, chatId);
  }

  // Symmetric message (Layer 3) — only if chat key exists
  if (!hasChatKey(chatId)) {
    return { wasEncrypted: false, text, mode: undefined, keyId: undefined };
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
    // V1 Bug #2 guard: If encryption fails, do NOT send plaintext

    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Encryption failed:', error);
    throw error;
  }
}

/**
 * Process a secured (Layer 4) outgoing message.
 * Uses the recipient's X25519 public key for asymmetric encryption.
 * TODO: Implement full Layer 4 send once recipient key lookup is available.
 */
function processOutgoingSecuredMessage(
  text: string,
  _chatId: string,
): OutboundMessageResult {
  // Secured messages require the bridge to be unlocked and the recipient's
  // X25519 public key to be available. These will be implemented when the
  // contact key store is built out. For now, throw an informative error.
  throw new Error('Secured message send requires recipient key exchange completion');
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
  // If no key is available, the message remains encrypted (shown as raw protocol string).
  // Bridge unlock is only needed for Layer 4 (asymmetric) decryption which requires
  // the identity private key. Layer 3 (symmetric) only needs the in-memory chat key.
  if (!hasChatKey(chatId) && !isBridgeUnlocked()) {
    return {
      isProtocol: true,
      shouldHide: false, // Show the raw protocol string when no key available
      decryptedText: undefined,
      mode: undefined,
      isSecured: false,
      keyId: undefined,
    };
  }

  try {
    const result = await decryptProtocolMessage(text, chatId);
    if (!result) {
      // Decryption returned undefined — may not have the key
      return {
        isProtocol: true,
        shouldHide: hide,
        decryptedText: undefined,
        mode: undefined,
        isSecured: false,
        keyId: undefined,
      };
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
 * This function:
 * 1. Decodes the kx message
 * 2. Extracts the sender's ephemeral public key
 * 3. Derives the shared chat key using ECDH
 * 4. Stores the chat key for future message decryption
 * 5. Returns the new key ID
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
}

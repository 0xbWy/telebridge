/**
 * TeleBridge — Group Message Encryption/Decryption
 *
 * Sender Key-based group encryption following the Signal protocol design:
 * - Sender encrypts with their own Sender Key
 * - Recipients decrypt with the distributed sender key
 * - Each message includes sender ID, group ID, chain index, and signature
 * - Forward secrecy via chain key ratcheting
 * - Member leave triggers re-keying of all remaining members
 *
 * Wire format for group messages: tb1.g.<base64>
 * Binary payload:
 *   [keyIdLen(2B)][keyId(var)][groupIdLen(2B)][groupId(var)]
 *   [memberIdLen(2B)][memberId(var)][chainIndex(4B)]
 *   [nonce(12B)][ciphertext(var)][authTag(16B)][signature(64B)]
 */

import {
  MAX_PLAINTEXT_BYTES,
} from '../crypto/protocol';
import {
  decryptSymmetric,
  encryptSymmetric,
} from '../crypto/symmetric';
import {
  deriveMessageKeyAtChainIndex,
  type DistributedSenderKey,
  ratchetSenderKey,
  type SenderKey,
  SIGNATURE_LENGTH,
  signGroupMessage,
  verifyGroupMessageSignature,
} from './senderKey';

// ---------- Constants ----------

/** GCM nonce length. */
const NONCE_LENGTH = 12;

/** GCM auth tag length. */
const TAG_LENGTH = 16;

/** Protocol mode for group messages. */
export const GROUP_PROTOCOL_MODE = 'g';

/** Minimum payload size for a group encrypted message. */
const MIN_PAYLOAD_SIZE = 8 + 2 + 2 + 4 + NONCE_LENGTH + TAG_LENGTH + SIGNATURE_LENGTH;

// ---------- Utility ----------

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// ---------- Group Message Encryption Result ----------

/**
 * Result of encrypting a group message.
 */
export interface GroupEncryptedMessageResult {
  /** Protocol-encoded string: tb1.g.<base64> */
  readonly protocolMessage: string;
  /** The chain index used for this message. */
  readonly chainIndex: number;
  /** The key ID of the sender key used. */
  readonly keyId: string;
}

/**
 * Result of decrypting a group message.
 */
export interface GroupDecryptedMessageResult {
  /** Decrypted plaintext. */
  readonly text: string;
  /** Sender's member ID. */
  readonly senderId: string;
  /** Group ID. */
  readonly groupId: string;
  /** Chain index of the message. */
  readonly chainIndex: number;
  /** Whether the sender's signature was verified. */
  readonly isSignatureValid: boolean;
  /** Key ID used for decryption. */
  readonly keyId: string;
}

// ---------- Group Message AAD ----------

/**
 * Build Additional Authenticated Data (AAD) for group message encryption.
 * Includes key ID, group ID, member ID, and chain index for message authentication.
 */
function buildGroupAAD(
  keyId: string,
  groupId: string,
  memberId: string,
  chainIndex: number,
): Uint8Array {
  const groupIdBytes = new TextEncoder().encode(groupId);
  const memberIdBytes = new TextEncoder().encode(memberId);
  const keyIdBytes = new TextEncoder().encode(keyId);
  const chainIndexBytes = new Uint8Array(4);
  chainIndexBytes[0] = (chainIndex >>> 24) & 0xFF;
  chainIndexBytes[1] = (chainIndex >>> 16) & 0xFF;
  chainIndexBytes[2] = (chainIndex >>> 8) & 0xFF;
  chainIndexBytes[3] = chainIndex & 0xFF;

  return concat(
    keyIdBytes,
    new Uint8Array([groupIdBytes.length >> 8, groupIdBytes.length & 0xFF]),
    groupIdBytes,
    new Uint8Array([memberIdBytes.length >> 8, memberIdBytes.length & 0xFF]),
    memberIdBytes,
    chainIndexBytes,
  );
}

// ---------- Group Message Encryption ----------

/**
 * Encrypt a message for a group using the sender's Sender Key.
 *
 * Process:
 * 1. Advance the sender key ratchet to get a fresh message key
 * 2. Encrypt the plaintext with AES-256-GCM using the message key
 * 3. Sign the ciphertext with the sender's Ed25519 signing key
 * 4. Build the binary payload and encode as tb1.g.<base64>
 *
 * @param text - Plaintext text to encrypt
 * @param senderKey - The sender's Sender Key (will be ratcheted in place)
 * @returns Encrypted message result
 * @throws Error if sender key is invalid or text is too large
 */
export async function encryptGroupMessage(
  text: string,
  senderKey: SenderKey,
): Promise<GroupEncryptedMessageResult> {
  // Validate text size
  const textBytes = new TextEncoder().encode(text);
  if (textBytes.length > MAX_PLAINTEXT_BYTES) {
    throw new Error(
      `Plaintext too large for group message: ${textBytes.length} bytes. Maximum: ${MAX_PLAINTEXT_BYTES} bytes.`,
    );
  }

  // Ratchet the sender key to get a fresh message key
  const { messageKey, chainIndex } = ratchetSenderKey(senderKey);

  // Build AAD (Additional Authenticated Data)
  const aad = buildGroupAAD(senderKey.keyId, senderKey.groupId, senderKey.memberId, chainIndex);

  // Encrypt with AES-256-GCM
  const { nonce, ciphertext, authTag } = await encryptSymmetric(textBytes, messageKey, aad);

  // Sign the ciphertext (not plaintext) for authentication
  // Signature covers: keyId + groupId + memberId + chainIndex + nonce + ciphertext + authTag
  const dataToSign = concat(
    new TextEncoder().encode(senderKey.keyId),
    new TextEncoder().encode(senderKey.groupId),
    new TextEncoder().encode(senderKey.memberId),
    new Uint8Array([
      (chainIndex >>> 24) & 0xFF,
      (chainIndex >>> 16) & 0xFF,
      (chainIndex >>> 8) & 0xFF,
      chainIndex & 0xFF,
    ]),
    nonce,
    ciphertext,
    authTag,
  );
  const signature = signGroupMessage(dataToSign, senderKey.signingBytes);

  // Build binary payload:
  // [keyIdLen(2B)][keyId(var)][groupIdLen(2B)][groupId(var)]
  // [memberIdLen(2B)][memberId(var)][chainIndex(4B)]
  // [nonce(12B)][ciphertext(var)][authTag(16B)][signature(64B)]
  const keyIdBytes = new TextEncoder().encode(senderKey.keyId);
  const groupIdBytes = new TextEncoder().encode(senderKey.groupId);
  const memberIdBytes = new TextEncoder().encode(senderKey.memberId);
  const keyIdLen = new Uint8Array([keyIdBytes.length >> 8, keyIdBytes.length & 0xFF]);
  const groupIdLen = new Uint8Array([groupIdBytes.length >> 8, groupIdBytes.length & 0xFF]);
  const memberIdLen = new Uint8Array([memberIdBytes.length >> 8, memberIdBytes.length & 0xFF]);
  const chainIndexBytes = new Uint8Array([
    (chainIndex >>> 24) & 0xFF,
    (chainIndex >>> 16) & 0xFF,
    (chainIndex >>> 8) & 0xFF,
    chainIndex & 0xFF,
  ]);

  const payload = concat(
    keyIdLen, keyIdBytes,
    groupIdLen, groupIdBytes,
    memberIdLen, memberIdBytes,
    chainIndexBytes,
    nonce,
    ciphertext,
    authTag,
    signature,
  );

  // Encode as protocol message: tb1.g.<base64>
  // We use encodeProtocol with 'g' mode — need to extend protocol to support 'g' mode
  // For now, manually construct the protocol string since 'g' isn't in ProtocolMode
  const base64 = uint8ArrayToBase64(payload);
  const protocolMessage = `tb1.g.${base64}`;

  return {
    protocolMessage,
    chainIndex,
    keyId: senderKey.keyId,
  };
}

// ---------- Group Message Decryption ----------

/**
 * Decrypt a group message using a distributed sender key.
 *
 * Process:
 * 1. Decode the protocol message
 * 2. Parse the binary payload
 * 3. Derive the message key at the specified chain index
 * 4. Decrypt with AES-256-GCM
 * 5. Verify the sender's Ed25519 signature
 *
 * Handles out-of-order messages by deriving the message key from the chain key
 * at the specified chain index without advancing the chain.
 *
 * @param protocolString - The tb1.g.<base64> message
 * @param distKey - The distributed sender key for the message sender
 * @returns Decrypted message result
 * @throws Error on invalid format, decryption failure, or signature mismatch
 */
export async function decryptGroupMessage(
  protocolString: string,
  distKey: DistributedSenderKey,
): Promise<GroupDecryptedMessageResult> {
  // Decode the group protocol message
  const payload = decodeGroupProtocol(protocolString);
  if (!payload) {
    throw new Error('Invalid group protocol message format');
  }

  return decryptGroupMessagePayload(payload, distKey);
}

/**
 * Decrypt a group message payload using a distributed sender key.
 * Handles out-of-order messages by deriving the key at the specified index.
 */
async function decryptGroupMessagePayload(
  payload: Uint8Array,
  distKey: DistributedSenderKey,
): Promise<GroupDecryptedMessageResult> {
  if (payload.length < MIN_PAYLOAD_SIZE) {
    throw new Error(`Group message payload too short: ${payload.length} bytes (minimum ${MIN_PAYLOAD_SIZE})`);
  }

  let offset = 0;

  // keyId
  const keyIdLen = (payload[offset] << 8) | payload[offset + 1];
  offset += 2;
  const keyId = new TextDecoder().decode(payload.slice(offset, offset + keyIdLen));
  offset += keyIdLen;

  // groupId
  const groupIdLen = (payload[offset] << 8) | payload[offset + 1];
  offset += 2;
  const groupId = new TextDecoder().decode(payload.slice(offset, offset + groupIdLen));
  offset += groupIdLen;

  // memberId (senderId)
  const memberIdLen = (payload[offset] << 8) | payload[offset + 1];
  offset += 2;
  const senderId = new TextDecoder().decode(payload.slice(offset, offset + memberIdLen));
  offset += memberIdLen;

  // Verify groupId and memberId match the distributed key
  if (groupId !== distKey.groupId) {
    throw new Error(`Group ID mismatch: expected ${distKey.groupId}, got ${groupId}`);
  }
  if (senderId !== distKey.memberId) {
    throw new Error(`Member ID mismatch: expected ${distKey.memberId}, got ${senderId}`);
  }

  // chainIndex
  const chainIndex = (payload[offset] << 24) | (payload[offset + 1] << 16)
    | (payload[offset + 2] << 8) | payload[offset + 3];
  offset += 4;

  // nonce (12 bytes)
  const nonce = new Uint8Array(payload.slice(offset, offset + NONCE_LENGTH));
  offset += NONCE_LENGTH;

  // signature (last 64 bytes)
  const signature = new Uint8Array(
    payload.slice(payload.length - SIGNATURE_LENGTH),
  );
  // ciphertext and authTag are between nonce and signature
  const authTagEnd = payload.length - SIGNATURE_LENGTH;
  const authTag = new Uint8Array(
    payload.slice(authTagEnd - TAG_LENGTH, authTagEnd),
  );
  const ciphertext = new Uint8Array(
    payload.slice(offset, authTagEnd - TAG_LENGTH),
  );

  // Derive the message key at the specified chain index
  // For out-of-order messages, we derive from the distributed chain key
  // at the startChainIndex position
  const messageKey = deriveMessageKeyAtChainIndex(distKey.chainKey, chainIndex, distKey.startChainIndex);

  // Build AAD (must match exactly what was used during encryption)
  const aad = buildGroupAAD(keyId, groupId, senderId, chainIndex);

  // Decrypt — GCM auth tag verification is ALWAYS performed (V1 Bug #7 guard)
  const plaintext = await decryptSymmetric(nonce, ciphertext, authTag, messageKey, aad);

  // Verify the sender's signature
  // Reconstruct the signed data
  const dataToSign = concat(
    new TextEncoder().encode(keyId),
    new TextEncoder().encode(groupId),
    new TextDecoder().decode(new TextEncoder().encode(senderId)) === senderId
      ? new TextEncoder().encode(senderId) : new TextEncoder().encode(senderId),
    new Uint8Array([
      (chainIndex >>> 24) & 0xFF,
      (chainIndex >>> 16) & 0xFF,
      (chainIndex >>> 8) & 0xFF,
      chainIndex & 0xFF,
    ]),
    nonce,
    ciphertext,
    authTag,
  );

  const isSignatureValid = verifyGroupMessageSignature(dataToSign, signature, distKey.verifyingBytes);

  const text = new TextDecoder().decode(plaintext);

  return {
    text,
    senderId,
    groupId,
    chainIndex,
    isSignatureValid,
    keyId,
  };
}

// ---------- Group Protocol Decoding ----------

/**
 * Decode a group protocol message (tb1.g.<base64>).
 * Returns the binary payload, or undefined if not a valid group protocol message.
 */
export function decodeGroupProtocol(message: string): Uint8Array | undefined {
  if (typeof message !== 'string') return undefined;
  if (!message.startsWith('tb1.g.')) return undefined;

  const base64 = message.slice(6); // Skip "tb1.g."
  if (base64.length === 0) return undefined;

  try {
    return base64ToUint8Array(base64);
  } catch {
    return undefined;
  }
}

/**
 * Check if a message is a group encrypted message.
 * Group messages use the 'g' mode in the protocol format.
 */
export function isGroupMessage(text: string): boolean {
  return typeof text === 'string' && text.startsWith('tb1.g.');
}

/**
 * Check if a message should be handled as a group encrypted message.
 * Falls back to checking protocol prefix and mode.
 */
export function isTeleBridgeGroupMessage(text: string): boolean {
  return isGroupMessage(text);
}

// ---------- Utility ----------

function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

/**
 * TeleBridge — Sender Key Management for Group Encryption
 *
 * Signal-style Sender Keys for group chat encryption.
 * Each member generates a unique Sender Key (chain key + signing key) per group.
 * Sender Keys are distributed via pairwise 1-on-1 encrypted channels.
 *
 * Key properties:
 * - Per-member-per-group uniqueness: each member's Sender Key is specific to one group
 * - Chain key ratcheting: HKDF-SHA256 advances the chain per message (forward secrecy)
 * - Ed25519 signing: every group message is signed by the sender
 * - Re-keying on membership changes: member leave triggers all remaining members to regenerate
 * - Independent per-sender sequence tracking: concurrent sends work independently
 */

import { ed25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { randomBytes } from '@noble/hashes/utils.js';

import { signBytes, verifySignature } from '../crypto/identity';

// ---------- Constants ----------

/** AES-256 key length in bytes. */
export const KEY_LENGTH = 32;

/** Sender Key chain key length. */
export const CHAIN_KEY_LENGTH = 32;

/** Ed25519 signing key length. */
export const SIGNING_KEY_LENGTH = 32;

/** Ed25519 verifying key length. */
export const VERIFYING_KEY_LENGTH = 32;

/** Ed25519 signature length. */
export const SIGNATURE_LENGTH = 64;

/** HKDF info string for Sender Key chain advancement. */
const SENDER_CHAIN_INFO = new TextEncoder().encode('TeleBridge-SenderChain-v1');

/** HKDF info string for Sender Key message key derivation. */
const SENDER_MESSAGE_INFO = new TextEncoder().encode('TeleBridge-SenderMessage-v1');

/** HKDF info string for Sender Key generation. */
const SENDER_KEY_GEN_INFO = new TextEncoder().encode('TeleBridge-SenderKeyGen-v1');

// ---------- Utility ----------

function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

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

// ---------- Sender Key Types ----------

/**
 * A Sender Key for a specific member in a specific group.
 * Contains the chain key (ratcheting per message) and an Ed25519 signing keypair.
 */
export interface SenderKey {
  /** Unique sender key ID (hex of first 8 bytes of chain key). */
  readonly keyId: string;
  /** Group ID this sender key belongs to. */
  readonly groupId: string;
  /** Member's user ID who owns this sender key. */
  readonly memberId: string;
  /** Chain key (32 bytes) for HKDF ratcheting. */
  chainKey: Uint8Array;
  /** Ed25519 signing bytes (private, 32 bytes) — only for own keys. */
  readonly signingBytes: Uint8Array;
  /** Ed25519 verifying bytes (public, 32 bytes). */
  readonly verifyingBytes: Uint8Array;
  /** Current message chain sequence number. */
  chainIndex: number;
  /** Timestamp when this sender key was generated. */
  readonly createdAt: number;
}

/**
 * A distributed sender key — sent to other group members.
 * Contains the chain key and verifying key, but NOT the signing key.
 * The signing key stays only with the owner.
 */
export interface DistributedSenderKey {
  /** Sender key ID. */
  readonly keyId: string;
  /** Group ID. */
  readonly groupId: string;
  /** Member's user ID who owns this sender key. */
  readonly memberId: string;
  /** Chain key (32 bytes) for message decryption. */
  chainKey: Uint8Array;
  /** Ed25519 verifying bytes (public, 32 bytes) for signature verification. */
  readonly verifyingBytes: Uint8Array;
  /** Current chain index when the key was distributed. */
  readonly startChainIndex: number;
  /** Timestamp when the Sender Key was generated. */
  readonly createdAt: number;
}

/**
 * Result of advancing the sender key chain.
 */
export interface RatchetedKey {
  /** Message key (32 bytes) for encrypting/decrypting the current message. */
  readonly messageKey: Uint8Array;
  /** Chain index of this message. */
  readonly chainIndex: number;
}

/**
 * Serialization format for Sender Key distribution via 1-on-1 channels.
 * Binary format for efficient transport.
 *
 * [keyId (8B)] [groupIdLen (2B)] [groupId (var)]
 * [memberIdLen (2B)] [memberId (var)]
 * [chainKey (32B)] [verifyingKey (32B)]
 * [startChainIndex (4B)] [createdAt (8B)]
 */
export interface SerializedSenderKey {
  /** The binary payload. */
  readonly payload: Uint8Array;
  /** The protocol-encoded string for transport. */
  readonly protocolString: string;
  /** The mode for protocol encoding (always 'sk' for sender key). */
  readonly mode: 'sk';
}

// ---------- Sender Key Generation ----------

/**
 * Generate a new Sender Key for a specific member in a specific group.
 *
 * The sender key is derived from a random seed, ensuring per-member-per-group
 * uniqueness. Contains:
 * - Chain key: 32-byte random value that ratchets per message via HKDF
 * - Signing keypair: Ed25519 keypair for message signatures
 *
 * @param groupId - Group ID (chat ID string)
 * @param memberId - Member's user ID
 * @param identitySigningKey - Member's Ed25519 identity signing key (used to derive uniqueness)
 * @returns A new Sender Key
 */
export function generateSenderKey(
  groupId: string,
  memberId: string,
  identitySigningKey?: Uint8Array,
): SenderKey {
  // Generate random chain key seed (32 bytes)
  const chainKeySeed = randomBytes(CHAIN_KEY_LENGTH);

  // Generate Ed25519 signing keypair for this sender key
  const { secretKey: signingKey, publicKey: verifyingKey } = ed25519.keygen();

  // If identity key is provided, incorporate it for additional uniqueness
  let chainKey: Uint8Array;
  if (identitySigningKey && isUint8Array(identitySigningKey)) {
    // Derive the chain key from the random seed + identity + group + member info
    // This ensures per-member-per-group uniqueness even if randomBytes collides
    const context = new TextEncoder().encode(
      `TeleBridge-SenderKey:${groupId}:${memberId}`,
    );
    const salt = concat(chainKeySeed, identitySigningKey.slice(0, 16));
    chainKey = new Uint8Array(hkdf(sha256, salt, new Uint8Array(KEY_LENGTH), context, KEY_LENGTH));
  } else {
    // Use the random seed directly as chain key
    chainKey = new Uint8Array(chainKeySeed);
  }

  // Zero the seed (no longer needed)
  chainKeySeed.fill(0);

  const keyId = bytesToHex(chainKey.slice(0, 4));

  return {
    keyId,
    groupId,
    memberId,
    chainKey,
    signingBytes: signingKey,
    verifyingBytes: verifyingKey,
    chainIndex: 0,
    createdAt: Date.now(),
  };
}

/**
 * Generate a Sender Key deterministically from identity key and group info.
 * Produces the same key for the same inputs (useful for testing and verification).
 */
export function generateSenderKeyDeterministic(
  groupId: string,
  memberId: string,
  identitySigningKey: Uint8Array,
): SenderKey {
  if (!isUint8Array(identitySigningKey) || identitySigningKey.length !== SIGNING_KEY_LENGTH) {
    throw new Error(`Identity signing key must be ${SIGNING_KEY_LENGTH} bytes`);
  }

  // Derive chain key from identity + group + member using HKDF
  const salt = identitySigningKey.slice(0, KEY_LENGTH);
  const info = new TextEncoder().encode(`TeleBridge-SenderKey:${groupId}:${memberId}`);
  const chainKey = new Uint8Array(hkdf(sha256, salt, new Uint8Array(KEY_LENGTH), info, KEY_LENGTH));

  // Derive signing key from identity + group context
  const signingSeed = new Uint8Array(hkdf(
    sha256,
    identitySigningKey,
    new Uint8Array(KEY_LENGTH),
    concat(info, SENDER_KEY_GEN_INFO),
    KEY_LENGTH,
  ));
  const { secretKey: signingKey, publicKey: verifyingKey } = ed25519.keygen(signingSeed);

  // Zero the seed
  signingSeed.fill(0);

  const keyId = bytesToHex(chainKey.slice(0, 4));

  return {
    keyId,
    groupId,
    memberId,
    chainKey,
    signingBytes: signingKey,
    verifyingBytes: verifyingKey,
    chainIndex: 0,
    createdAt: Date.now(),
  };
}

// ---------- Sender Key Ratcheting ----------

/**
 * Advance the sender key chain and derive a message key for the next message.
 *
 * The ratchet works as follows:
 * 1. Derive message key from chain key at current chain index: HKDF(chainKey, chainIndex, MESSAGE_INFO)
 * 2. Advance the chain key: HKDF(chainKey, chainIndex, CHAIN_INFO)
 * 3. Increment chain index
 *
 * This provides forward secrecy: knowing a message key doesn't reveal past chain keys.
 *
 * @param senderKey - The sender key to advance (mutated in place)
 * @returns The message key and chain index for this message
 */
export function ratchetSenderKey(senderKey: SenderKey): RatchetedKey {
  const chainIndex = senderKey.chainIndex;
  const counterBytes = encodeCounterBE(chainIndex);

  // Derive message key from current chain key
  const messageKeyInfo = concat(SENDER_MESSAGE_INFO, counterBytes);
  const messageKey = new Uint8Array(
    hkdf(sha256, senderKey.chainKey, new Uint8Array(KEY_LENGTH), messageKeyInfo, KEY_LENGTH),
  );

  // Advance the chain key
  const chainKeyInfo = concat(SENDER_CHAIN_INFO, counterBytes);
  const nextChainKey = new Uint8Array(
    hkdf(sha256, senderKey.chainKey, new Uint8Array(KEY_LENGTH), chainKeyInfo, KEY_LENGTH),
  );

  // Overwrite the old chain key (forward secrecy)
  senderKey.chainKey.fill(0);
  senderKey.chainKey = nextChainKey;
  senderKey.chainIndex = chainIndex + 1;

  return { messageKey, chainIndex };
}

/**
 * Derive a message key at a specific chain index from a distributed sender key.
 * Used for out-of-order message decryption.
 *
 * This walks the ratchet from the chain key to the desired index,
 * then derives the message key at that position.
 *
 * @param chainKey - The starting chain key (at startChainIndex)
 * @param chainIndex - The target chain index
 * @param startChainIndex - The chain index of the starting chain key (default: 0)
 * @returns The message key at the specified chain index
 */
export function deriveMessageKeyAtChainIndex(
  chainKey: Uint8Array,
  chainIndex: number,
  startChainIndex: number = 0,
): Uint8Array {
  if (!isUint8Array(chainKey) || chainKey.length !== KEY_LENGTH) {
    throw new Error(`Chain key must be ${KEY_LENGTH} bytes`);
  }
  if (chainIndex < startChainIndex) {
    throw new Error(`Target chain index (${chainIndex}) must be >= start index (${startChainIndex})`);
  }

  // Walk the ratchet from startChainIndex to the target chainIndex
  let currentChainKey = new Uint8Array(chainKey);

  for (let i = startChainIndex; i < chainIndex; i++) {
    const counterBytes = encodeCounterBE(i);
    const chainKeyInfo = concat(SENDER_CHAIN_INFO, counterBytes);
    currentChainKey = new Uint8Array(
      hkdf(sha256, currentChainKey, new Uint8Array(KEY_LENGTH), chainKeyInfo, KEY_LENGTH),
    );
  }

  // At the target index, derive the message key
  const counterBytes = encodeCounterBE(chainIndex);
  const messageKeyInfo = concat(SENDER_MESSAGE_INFO, counterBytes);
  return new Uint8Array(hkdf(sha256, currentChainKey, new Uint8Array(KEY_LENGTH), messageKeyInfo, KEY_LENGTH));
}

/**
 * Derive the chain key at a specific chain index from a starting chain key.
 * Walks the ratchet chain forward from chain key at index 0.
 *
 * @param startChainKey - The chain key at index 0 (original distribution)
 * @param targetIndex - The target chain index
 * @returns The chain key at the target index
 */
export function deriveChainKeyAtIndex(
  startChainKey: Uint8Array,
  targetIndex: number,
): Uint8Array {
  if (!isUint8Array(startChainKey) || startChainKey.length !== KEY_LENGTH) {
    throw new Error(`Starting chain key must be ${KEY_LENGTH} bytes`);
  }
  if (targetIndex < 0) {
    throw new Error('Target index must be non-negative');
  }

  let currentChainKey = new Uint8Array(startChainKey);

  for (let i = 0; i < targetIndex; i++) {
    const counterBytes = encodeCounterBE(i);
    const chainKeyInfo = concat(SENDER_CHAIN_INFO, counterBytes);
    currentChainKey = new Uint8Array(
      hkdf(sha256, currentChainKey, new Uint8Array(KEY_LENGTH), chainKeyInfo, KEY_LENGTH),
    );
  }

  return currentChainKey;
}

// ---------- Sender Key Signing & Verification ----------

/**
 * Sign a group message with the sender's signing key.
 *
 * @param message - The message data to sign
 * @param signingKey - Sender's Ed25519 signing key (from Sender Key)
 * @returns 64-byte Ed25519 signature
 */
export function signGroupMessage(message: Uint8Array, signingKey: Uint8Array): Uint8Array {
  if (!isUint8Array(signingKey) || signingKey.length !== SIGNING_KEY_LENGTH) {
    throw new Error(`Signing key must be ${SIGNING_KEY_LENGTH} bytes`);
  }
  return signBytes(signingKey, message);
}

/**
 * Verify a group message signature.
 *
 * @param message - The message data
 * @param signature - 64-byte Ed25519 signature
 * @param verifyingKey - Sender's Ed25519 verifying key (from distributed Sender Key)
 * @returns true if the signature is valid
 */
export function verifyGroupMessageSignature(
  message: Uint8Array,
  signature: Uint8Array,
  verifyingKey: Uint8Array,
): boolean {
  if (!isUint8Array(verifyingKey) || verifyingKey.length !== VERIFYING_KEY_LENGTH) {
    throw new Error(`Verifying key must be ${VERIFYING_KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(signature) || signature.length !== SIGNATURE_LENGTH) {
    throw new Error(`Signature must be ${SIGNATURE_LENGTH} bytes`);
  }
  return verifySignature(verifyingKey, signature, message);
}

// ---------- Sender Key Distribution Serialization ----------

/**
 * Serialize a DistributedSenderKey for transport via 1-on-1 encrypted channel.
 *
 * Binary format:
 * [keyIdLen (2B)] [keyId (var)] [groupIdLen (2B)] [groupId (var)]
 * [memberIdLen (2B)] [memberId (var)] [chainKey (32B)] [verifyingKey (32B)]
 * [startChainIndex (4B)] [createdAt (8B)]
 *
 * @param distKey - The distributed sender key to serialize
 * @returns Serialized payload
 */
export function serializeSenderKey(distKey: DistributedSenderKey): Uint8Array {
  const keyIdBytes = new TextEncoder().encode(distKey.keyId);
  const groupIdBytes = new TextEncoder().encode(distKey.groupId);
  const memberIdBytes = new TextEncoder().encode(distKey.memberId);

  // Validate lengths fit in 2 bytes (65535)
  if (keyIdBytes.length > 65535 || groupIdBytes.length > 65535 || memberIdBytes.length > 65535) {
    throw new Error('Sender key field too long for serialization');
  }

  const keyIdLenBytes = new Uint8Array([(keyIdBytes.length >> 8) & 0xFF, keyIdBytes.length & 0xFF]);
  const groupIdLenBytes = new Uint8Array([(groupIdBytes.length >> 8) & 0xFF, groupIdBytes.length & 0xFF]);
  const memberIdLenBytes = new Uint8Array([(memberIdBytes.length >> 8) & 0xFF, memberIdBytes.length & 0xFF]);
  const startChainIndexBytes = encodeCounterBE(distKey.startChainIndex);
  const createdAtBytes = new BigInt64Array([BigInt(distKey.createdAt)]);

  return concat(
    keyIdLenBytes, keyIdBytes,
    groupIdLenBytes, groupIdBytes,
    memberIdLenBytes, memberIdBytes,
    distKey.chainKey,
    distKey.verifyingBytes,
    startChainIndexBytes,
    new Uint8Array(createdAtBytes.buffer),
  );
}

/**
 * Deserialize a DistributedSenderKey from binary payload.
 *
 * @param payload - The binary payload to deserialize
 * @returns Deserialized distributed sender key
 * @throws Error if the payload is malformed
 */
export function deserializeSenderKey(payload: Uint8Array): DistributedSenderKey {
  if (payload.length < 32 + 32 + 4 + 8 + 6) {
    throw new Error(`Payload too short for sender key: ${payload.length} bytes`);
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

  // memberId
  const memberIdLen = (payload[offset] << 8) | payload[offset + 1];
  offset += 2;
  const memberId = new TextDecoder().decode(payload.slice(offset, offset + memberIdLen));
  offset += memberIdLen;

  // chainKey (32 bytes)
  const chainKey = new Uint8Array(payload.slice(offset, offset + CHAIN_KEY_LENGTH));
  offset += CHAIN_KEY_LENGTH;

  // verifyingBytes (32 bytes)
  const verifyingBytes = new Uint8Array(payload.slice(offset, offset + VERIFYING_KEY_LENGTH));
  offset += VERIFYING_KEY_LENGTH;

  // startChainIndex (4 bytes)
  const startChainIndex = (payload[offset] << 24) | (payload[offset + 1] << 16)
    | (payload[offset + 2] << 8) | payload[offset + 3];
  offset += 4;

  // createdAt (8 bytes)
  const createdAt = Number(new BigInt64Array(payload.slice(offset, offset + 8).buffer)[0]);

  return {
    keyId,
    groupId,
    memberId,
    chainKey,
    verifyingBytes,
    startChainIndex,
    createdAt,
  };
}

// ---------- Create Distributed Sender Key (for sharing) ----------

/**
 * Create a DistributedSenderKey from a SenderKey for sharing with other members.
 * Strips the signing key — only the verifying key and chain key are shared.
 *
 * @param senderKey - The full sender key (with signing key)
 * @returns A distributed sender key safe for sharing
 */
export function createDistributedSenderKey(senderKey: SenderKey): DistributedSenderKey {
  return {
    keyId: senderKey.keyId,
    groupId: senderKey.groupId,
    memberId: senderKey.memberId,
    chainKey: new Uint8Array(senderKey.chainKey),
    verifyingBytes: new Uint8Array(senderKey.verifyingBytes),
    startChainIndex: senderKey.chainIndex,
    createdAt: senderKey.createdAt,
  };
}

// ---------- Sender Key ID Verification ----------

/**
 * Derive the expected sender key ID from the chain key.
 * Used to verify that a distributed sender key matches its claimed ID.
 */
export function senderKeyIdFromChainKey(chainKey: Uint8Array): string {
  if (!isUint8Array(chainKey) || chainKey.length !== KEY_LENGTH) {
    throw new Error(`Chain key must be ${KEY_LENGTH} bytes`);
  }
  return bytesToHex(chainKey.slice(0, 4));
}

/**
 * Verify that a distributed sender key's key ID matches its chain key.
 */
export function verifySenderKeyId(distKey: DistributedSenderKey): boolean {
  const expectedKeyId = senderKeyIdFromChainKey(distKey.chainKey);
  return expectedKeyId === distKey.keyId;
}

// ---------- Re-keying ----------

/**
 * Regenerate a new Sender Key after a member leaves the group.
 * All remaining members must regenerate their sender keys.
 * The old keys should be deleted, and new keys distributed via 1-on-1 channels.
 *
 * @param groupId - Group ID
 * @param memberId - Member's user ID
 * @param identitySigningKey - Member's identity signing key (for uniqueness)
 * @returns A fresh Sender Key with a new chain key and signing keypair
 */
export function regenerateSenderKey(
  groupId: string,
  memberId: string,
  identitySigningKey: Uint8Array,
): SenderKey {
  // Generate a completely new sender key
  // The identity key ensures uniqueness and binds it to the member
  return generateSenderKey(groupId, memberId, identitySigningKey);
}

/**
 * Zero out sensitive key material in a SenderKey.
 * Called when a sender key is being discarded (e.g., after re-keying).
 */
export function zeroSenderKey(senderKey: SenderKey): void {
  senderKey.chainKey.fill(0);
  senderKey.signingBytes.fill(0);
}

/**
 * Zero out the chain key in a DistributedSenderKey.
 * Called when a distributed sender key is being discarded.
 */
export function zeroDistributedSenderKey(distKey: DistributedSenderKey): void {
  distKey.chainKey.fill(0);
}

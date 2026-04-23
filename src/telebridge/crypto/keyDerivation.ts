/**
 * TeleBridge — Consistent Key Derivation
 *
 * Single HKDF-SHA256 key derivation path for ALL data types.
 * Regardless of whether the input is text (string) or binary (Uint8Array),
 * the same derivation path is used: HKDF-SHA256 with purpose-specific info strings.
 *
 * V1 Bug Regression Guards:
 * - #3: Single consistent key derivation path (no conditional paths based on input type)
 * - No bare SHA-256 used as KDF (HKDF-SHA256 always used)
 *
 * This module centralizes ALL key derivation to ensure consistency.
 * Any code that needs to derive a key MUST use functions from this module.
 */

import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

// ---------- HKDF Info Strings ----------
// Each purpose gets a unique info string for domain separation.
// This ensures keys derived for different purposes are always different,
// even from the same input material.

/** Info string for chat key derivation from ECDH shared secret. */
const CHAT_KEY_INFO = new TextEncoder().encode('TeleBridge-ChatKey-v1');

/** Info string for ratchet message key derivation. */
const RATCHET_MESSAGE_INFO = new TextEncoder().encode('TeleBridge-Ratchet-v1');

/** Info string for ratchet chain key advancement. */
const RATCHET_CHAIN_INFO = new TextEncoder().encode('TeleBridge-ChainKey-v1');

/** Info string for media key derivation. */
const MEDIA_KEY_INFO = new TextEncoder().encode('TeleBridge-MediaKey-v1');

/** Info string for file encryption key derivation. */
const FILE_KEY_INFO = new TextEncoder().encode('TeleBridge-FileKey-v1');

/** Info string for asymmetric secured message key derivation. */
const SECURED_MESSAGE_INFO = new TextEncoder().encode('TeleBridge-Secured-v1');

/** Info string for encrypt-to-self message key derivation. */
const SECURED_SELF_INFO = new TextEncoder().encode('TeleBridge-Secured-Self-v1');

/** Info string for BIP39-to-encryption-key derivation. */
const BIP39_KEY_INFO = new TextEncoder().encode('TeleBridge-BIP39-Key-v1');

/** Info string for key-encryption key derivation from bridge password. */
const KEY_ENCRYPTION_INFO = new TextEncoder().encode('TeleBridge-KeyEncryption-v1');

/** Info string for password verifier key derivation. */
const PASSWORD_VERIFY_INFO = new TextEncoder().encode('TeleBridge-PasswordVerify-v1');

/** Default salt length for HKDF. */
const SALT_LENGTH = 32;

/** Default derived key length (AES-256). */
const KEY_LENGTH = 32;

/** Check if value is a Uint8Array-like typed array (handles cross-realm instances). */
function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

// ---------- Core Derivation ----------

/**
 * Derive a key using HKDF-SHA256.
 *
 * This is the SINGLE consistent key derivation function used throughout
 * TeleBridge. ALL key derivation uses this function with purpose-specific
 * info strings. No other KDF is used.
 *
 * GUARD (V1 Bug #3): This function treats all inputs uniformly —
 * both text and binary inputs are converted to Uint8Array before derivation.
 * There is NO conditional path based on input type.
 *
 * GUARD (V1 Bug #27): HKDF-SHA256 is ALWAYS used. Bare SHA-256 is NEVER
 * used as a KDF.
 *
 * @param ikm - Input keying material (shared secret, seed, etc.)
 * @param info - HKDF info string for domain separation (purpose-specific)
 * @param salt - Optional salt (defaults to 32 zero bytes)
 * @param length - Output key length in bytes (default: 32 for AES-256)
 * @returns Derived key as Uint8Array
 */
export function deriveKey(
  ikm: Uint8Array,
  info: Uint8Array,
  salt: Uint8Array = new Uint8Array(SALT_LENGTH),
  length: number = KEY_LENGTH,
): Uint8Array {
  // Validate inputs
  if (!isUint8Array(ikm) || ikm.length === 0) {
    throw new Error('Input keying material must be a non-empty Uint8Array');
  }
  if (!isUint8Array(info) || info.length === 0) {
    throw new Error('HKDF info must be a non-empty Uint8Array');
  }
  if (length < 1 || length > 255 * 32) {
    throw new Error(`Invalid key length: ${length}`);
  }

  return new Uint8Array(hkdf(sha256, ikm, salt, info, length));
}

// ---------- Purpose-Specific Derivation ----------
// Each function uses a unique info string for domain separation.

/**
 * Derive a per-chat AES-256 key from ECDH shared secret.
 * Uses the CHAT_KEY_INFO string for domain separation.
 *
 * @param dhOutput - Raw ECDH output (32 bytes, or concatenated for X3DH)
 * @param salt - Optional salt
 * @returns 32-byte AES-256 derived key
 */
export function deriveChatKey(
  dhOutput: Uint8Array,
  salt: Uint8Array = new Uint8Array(SALT_LENGTH),
): Uint8Array {
  return deriveKey(dhOutput, CHAT_KEY_INFO, salt);
}

/**
 * Derive a ratchet message key from a chain key.
 *
 * @param ikm - Current chain material (32 bytes)
 * @param counter - Message counter (monotonically increasing)
 * @returns 32-byte message key
 */
export function deriveRatchetMessageKey(
  ikm: Uint8Array,
  counter: number,
): Uint8Array {
  // Encode counter as 4-byte big-endian and append to info
  const counterBytes = new Uint8Array(4);
  counterBytes[0] = (counter >>> 24) & 0xFF;
  counterBytes[1] = (counter >>> 16) & 0xFF;
  counterBytes[2] = (counter >>> 8) & 0xFF;
  counterBytes[3] = counter & 0xFF;

  const info = new Uint8Array(RATCHET_MESSAGE_INFO.length + 4);
  info.set(RATCHET_MESSAGE_INFO);
  info.set(counterBytes, RATCHET_MESSAGE_INFO.length);

  return deriveKey(ikm, info);
}

/**
 * Derive the next chain material in the ratchet.
 *
 * @param ikm - Current chain material (32 bytes)
 * @param counter - Current message counter
 * @returns 32-byte next chain material
 */
export function deriveNextChainKey(
  ikm: Uint8Array,
  counter: number,
): Uint8Array {
  const counterBytes = new Uint8Array(4);
  counterBytes[0] = (counter >>> 24) & 0xFF;
  counterBytes[1] = (counter >>> 16) & 0xFF;
  counterBytes[2] = (counter >>> 8) & 0xFF;
  counterBytes[3] = counter & 0xFF;

  const info = new Uint8Array(RATCHET_CHAIN_INFO.length + 4);
  info.set(RATCHET_CHAIN_INFO);
  info.set(counterBytes, RATCHET_CHAIN_INFO.length);

  return deriveKey(ikm, info);
}

/**
 * Derive a media encryption key from a chat key.
 * Uses the MEDIA_KEY_INFO string for domain separation from chat message keys.
 *
 * GUARD (V1 Bug #3): The same function is used regardless of whether
 * the media is a photo, video, voice, document, etc.
 * There is no conditional path for "quick" media types.
 *
 * @param ikm - Per-chat AES-256 material (32 bytes)
 * @param chatId - Explicit chat ID for derivation (NOT from UI state)
 * @param mediaId - Unique media file identifier
 * @returns 32-byte media encryption output
 */
export function deriveMediaKey(
  ikm: Uint8Array,
  chatId: string,
  mediaId: string,
): Uint8Array {
  // Combine chat material + chatId + mediaId as IKM
  // This ensures different media files get different outputs even in the same chat
  const chatIdBytes = new TextEncoder().encode(chatId);
  const mediaIdBytes = new TextEncoder().encode(mediaId);
  const combined = new Uint8Array(ikm.length + chatIdBytes.length + mediaIdBytes.length);
  combined.set(ikm);
  combined.set(chatIdBytes, ikm.length);
  combined.set(mediaIdBytes, ikm.length + chatIdBytes.length);

  return deriveKey(combined, MEDIA_KEY_INFO);
}

/**
 * Derive a file encryption key from a chat key for chunked file encryption.
 *
 * @param ikm - Per-chat AES-256 material (32 bytes)
 * @param fileHash - Hash of the original file for binding
 * @returns 32-byte file encryption output
 */
export function deriveFileKey(
  ikm: Uint8Array,
  fileHash: Uint8Array,
): Uint8Array {
  const combined = new Uint8Array(ikm.length + fileHash.length);
  combined.set(ikm);
  combined.set(fileHash, ikm.length);

  return deriveKey(combined, FILE_KEY_INFO);
}

/**
 * Derive a secured message key from ECDH output.
 * Used for asymmetric (Layer 4) message encryption.
 *
 * @param dhOutput - Raw X25519 ECDH output (32 bytes)
 * @returns 32-byte derived key for secured message encryption
 */
export function deriveSecuredMessageKey(dhOutput: Uint8Array): Uint8Array {
  return deriveKey(dhOutput, SECURED_MESSAGE_INFO);
}

/**
 * Derive a self-copy message key from ECDH output.
 * Used for encrypt-to-self in Layer 4.
 *
 * @param dhOutput - Raw X25519 ECDH output (32 bytes)
 * @returns 32-byte derived key for self-copy encryption
 */
export function deriveSecuredSelfKey(dhOutput: Uint8Array): Uint8Array {
  return deriveKey(dhOutput, SECURED_SELF_INFO);
}

/**
 * Derive an encryption key from a BIP39 mnemonic seed.
 * Uses BIP39_KEY_INFO for domain separation from other seed uses.
 *
 * @param seed - 64-byte BIP39 seed
 * @returns 32-byte AES-256 encryption key
 */
export function deriveBIP39Key(seed: Uint8Array): Uint8Array {
  return deriveKey(seed, BIP39_KEY_INFO);
}

/**
 * Derive a key-encryption key from a bridge password.
 * Used for encrypting/decrypting the key store.
 *
 * @param argon2Output - 32-byte output derived from bridge password via Argon2id
 * @returns 32-byte wrapping output for encrypting the store
 */
export function deriveKeyEncryptionKey(argon2Output: Uint8Array): Uint8Array {
  return deriveKey(argon2Output, KEY_ENCRYPTION_INFO);
}

// ---------- Re-exporting info strings for tests ----------
// These allow tests to verify that different info strings produce different keys.

export const INFO_STRINGS = {
  CHAT_KEY: CHAT_KEY_INFO,
  RATCHET_MESSAGE: RATCHET_MESSAGE_INFO,
  RATCHET_CHAIN: RATCHET_CHAIN_INFO,
  MEDIA: MEDIA_KEY_INFO,
  FILE: FILE_KEY_INFO,
  SECURED_MESSAGE: SECURED_MESSAGE_INFO,
  SECURED_SELF: SECURED_SELF_INFO,
  BIP39: BIP39_KEY_INFO,
  KEY_ENCRYPTION: KEY_ENCRYPTION_INFO,
  PASSWORD_VERIFY: PASSWORD_VERIFY_INFO,
} as const;

/**
 * Consistency verification: derive a key from text input.
 * This function ensures that text (string) inputs go through the
 * SAME derivation path as binary (Uint8Array) inputs.
 *
 * GUARD (V1 Bug #3): The text is encoded to UTF-8 bytes first,
 * then processed identically to binary input. No conditional
 * code path based on input type.
 *
 * @param text - Text input (will be UTF-8 encoded before derivation)
 * @param info - HKDF info string for domain separation
 * @param salt - Optional salt
 * @returns 32-byte derived key
 */
export function deriveKeyFromText(
  text: string,
  info: Uint8Array,
  salt: Uint8Array = new Uint8Array(SALT_LENGTH),
): Uint8Array {
  // Encode text to UTF-8 bytes — then use the SAME derivation function
  const textBytes = new TextEncoder().encode(text);
  return deriveKey(textBytes, info, salt);
}

/**
 * Verify that text and binary inputs produce the same derived key.
 * This is the CRITICAL test for V1 Bug #3 (dual-hash bug).
 *
 * If you UTF-8 encode "hello" and pass it as Uint8Array, you should
 * get the SAME derived key as passing the string "hello" through
 * deriveKeyFromText. Both go through the same HKDF-SHA256 path.
 *
 * @param text - Text input
 * @param textBytes - Same text encoded as UTF-8 Uint8Array
 * @param info - HKDF info string
 * @returns true if both produce the same derived key
 */
export function verifyConsistentDerivation(
  text: string,
  textBytes: Uint8Array,
  info: Uint8Array,
): boolean {
  const fromText = deriveKeyFromText(text, info);
  const fromBytes = deriveKey(textBytes, info);

  if (fromText.length !== fromBytes.length) return false;
  for (let i = 0; i < fromText.length; i++) {
    if (fromText[i] !== fromBytes[i]) return false;
  }
  return true;
}

"use strict";
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["src_telebridge_crypto_media_ts"],{

/***/ "./src/telebridge/crypto/keyDerivation.ts"
/*!************************************************!*\
  !*** ./src/telebridge/crypto/keyDerivation.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INFO_STRINGS: () => (/* binding */ INFO_STRINGS),
/* harmony export */   deriveBIP39Key: () => (/* binding */ deriveBIP39Key),
/* harmony export */   deriveChatKey: () => (/* binding */ deriveChatKey),
/* harmony export */   deriveFileKey: () => (/* binding */ deriveFileKey),
/* harmony export */   deriveKey: () => (/* binding */ deriveKey),
/* harmony export */   deriveKeyEncryptionKey: () => (/* binding */ deriveKeyEncryptionKey),
/* harmony export */   deriveKeyFromText: () => (/* binding */ deriveKeyFromText),
/* harmony export */   deriveMediaKey: () => (/* binding */ deriveMediaKey),
/* harmony export */   deriveNextChainKey: () => (/* binding */ deriveNextChainKey),
/* harmony export */   deriveRatchetMessageKey: () => (/* binding */ deriveRatchetMessageKey),
/* harmony export */   deriveSecuredMessageKey: () => (/* binding */ deriveSecuredMessageKey),
/* harmony export */   deriveSecuredSelfKey: () => (/* binding */ deriveSecuredSelfKey),
/* harmony export */   verifyConsistentDerivation: () => (/* binding */ verifyConsistentDerivation)
/* harmony export */ });
/* harmony import */ var _noble_hashes_hkdf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/hashes/hkdf.js */ "./node_modules/@noble/hashes/hkdf.js");
/* harmony import */ var _noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/hashes/sha2.js */ "./node_modules/@noble/hashes/sha2.js");
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
function isUint8Array(value) {
  return value instanceof Uint8Array || ArrayBuffer.isView(value) && value.constructor?.name === 'Uint8Array';
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
function deriveKey(ikm, info, salt = new Uint8Array(SALT_LENGTH), length = KEY_LENGTH) {
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
  return new Uint8Array((0,_noble_hashes_hkdf_js__WEBPACK_IMPORTED_MODULE_0__.hkdf)(_noble_hashes_sha2_js__WEBPACK_IMPORTED_MODULE_1__.sha256, ikm, salt, info, length));
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
function deriveChatKey(dhOutput, salt = new Uint8Array(SALT_LENGTH)) {
  return deriveKey(dhOutput, CHAT_KEY_INFO, salt);
}

/**
 * Derive a ratchet message key from a chain key.
 *
 * @param ikm - Current chain material (32 bytes)
 * @param counter - Message counter (monotonically increasing)
 * @returns 32-byte message key
 */
function deriveRatchetMessageKey(ikm, counter) {
  // Encode counter as 4-byte big-endian and append to info
  const counterBytes = new Uint8Array(4);
  counterBytes[0] = counter >>> 24 & 0xFF;
  counterBytes[1] = counter >>> 16 & 0xFF;
  counterBytes[2] = counter >>> 8 & 0xFF;
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
function deriveNextChainKey(ikm, counter) {
  const counterBytes = new Uint8Array(4);
  counterBytes[0] = counter >>> 24 & 0xFF;
  counterBytes[1] = counter >>> 16 & 0xFF;
  counterBytes[2] = counter >>> 8 & 0xFF;
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
function deriveMediaKey(ikm, chatId, mediaId) {
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
function deriveFileKey(ikm, fileHash) {
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
function deriveSecuredMessageKey(dhOutput) {
  return deriveKey(dhOutput, SECURED_MESSAGE_INFO);
}

/**
 * Derive a self-copy message key from ECDH output.
 * Used for encrypt-to-self in Layer 4.
 *
 * @param dhOutput - Raw X25519 ECDH output (32 bytes)
 * @returns 32-byte derived key for self-copy encryption
 */
function deriveSecuredSelfKey(dhOutput) {
  return deriveKey(dhOutput, SECURED_SELF_INFO);
}

/**
 * Derive an encryption key from a BIP39 mnemonic seed.
 * Uses BIP39_KEY_INFO for domain separation from other seed uses.
 *
 * @param seed - 64-byte BIP39 seed
 * @returns 32-byte AES-256 encryption key
 */
function deriveBIP39Key(seed) {
  return deriveKey(seed, BIP39_KEY_INFO);
}

/**
 * Derive a key-encryption key from a bridge password.
 * Used for encrypting/decrypting the key store.
 *
 * @param argon2Output - 32-byte output derived from bridge password via Argon2id
 * @returns 32-byte wrapping output for encrypting the store
 */
function deriveKeyEncryptionKey(argon2Output) {
  return deriveKey(argon2Output, KEY_ENCRYPTION_INFO);
}

// ---------- Re-exporting info strings for tests ----------
// These allow tests to verify that different info strings produce different keys.

const INFO_STRINGS = {
  CHAT_KEY: CHAT_KEY_INFO,
  RATCHET_MESSAGE: RATCHET_MESSAGE_INFO,
  RATCHET_CHAIN: RATCHET_CHAIN_INFO,
  MEDIA: MEDIA_KEY_INFO,
  FILE: FILE_KEY_INFO,
  SECURED_MESSAGE: SECURED_MESSAGE_INFO,
  SECURED_SELF: SECURED_SELF_INFO,
  BIP39: BIP39_KEY_INFO,
  KEY_ENCRYPTION: KEY_ENCRYPTION_INFO,
  PASSWORD_VERIFY: PASSWORD_VERIFY_INFO
};

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
function deriveKeyFromText(text, info, salt = new Uint8Array(SALT_LENGTH)) {
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
function verifyConsistentDerivation(text, textBytes, info) {
  const fromText = deriveKeyFromText(text, info);
  const fromBytes = deriveKey(textBytes, info);
  if (fromText.length !== fromBytes.length) return false;
  for (let i = 0; i < fromText.length; i++) {
    if (fromText[i] !== fromBytes[i]) return false;
  }
  return true;
}

/***/ },

/***/ "./src/telebridge/crypto/media.ts"
/*!****************************************!*\
  !*** ./src/telebridge/crypto/media.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ALL_MEDIA_TYPES: () => (/* binding */ ALL_MEDIA_TYPES),
/* harmony export */   CHUNK_SIZE: () => (/* binding */ CHUNK_SIZE),
/* harmony export */   MAX_SINGLE_PIECE_SIZE: () => (/* binding */ MAX_SINGLE_PIECE_SIZE),
/* harmony export */   calculateChunkCount: () => (/* binding */ calculateChunkCount),
/* harmony export */   decryptMedia: () => (/* binding */ decryptMedia),
/* harmony export */   encryptMedia: () => (/* binding */ encryptMedia),
/* harmony export */   shouldChunk: () => (/* binding */ shouldChunk)
/* harmony export */ });
/* harmony import */ var _keyDerivation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keyDerivation */ "./src/telebridge/crypto/keyDerivation.ts");
/* harmony import */ var _symmetric__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./symmetric */ "./src/telebridge/crypto/symmetric.ts");
/**
 * TeleBridge — Media Encryption
 *
 * Encryption and decryption of ALL media types (photos, videos, voice
 * messages, documents) with no skip paths.
 *
 * V1 Bug Regression Guards:
 * - #10: No "if(quick) skip" — ALL media types are encrypted unconditionally
 * - #4: Key lookup by explicit chatId (NOT from UI state like selectCurrentChat)
 * - Per-chunk GCM auth tags for large files
 *
 * Architecture:
 * - Small files: encrypted in one piece (version byte + nonce + ciphertext + authTag)
 * - Large files: encrypted in chunks, each with its own IV and auth tag
 * - Media keys derived per-chat, per-media via explicit chatId (not UI state)
 */




// ---------- Constants ----------

/** File format version byte for single-piece encryption. */
const FILE_VERSION = 0x01;

/** File format version byte for chunked encryption. */
const FILE_VERSION_CHUNKED = 0x02;

/** Chunk size for large file encryption: 64 KiB (65536 bytes). */
const CHUNK_SIZE = 65536;

/** Minimum payload size after decryption: version(1) + nonce(12) + authTag(16) = 29 bytes. */
const MIN_ENCRYPTED_SIZE = 1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH + _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH;

/** Maximum file size that can be encrypted in a single piece: 10 MB. */
const MAX_SINGLE_PIECE_SIZE = 10 * 1024 * 1024;

/** Check if value is a Uint8Array-like typed array (handles cross-realm instances). */
function isUint8Array(value) {
  return value instanceof Uint8Array || ArrayBuffer.isView(value) && value.constructor?.name === 'Uint8Array';
}

// ---------- Supported Media Types ----------

/**
 * All supported media types for encryption.
 *
 * GUARD (V1 Bug #10): Every type is listed and ALL are encrypted.
 * There is NO conditional skip path. The encryptMedia/decryptMedia
 * functions treat EVERY media type identically.
 */

/**
 * Set of all supported media types for fast lookup.
 * Every media type MUST go through encryption — no exceptions.
 */
const ALL_MEDIA_TYPES = new Set(['photo', 'video', 'voice', 'videoMessage', 'document', 'audio', 'sticker', 'animation']);

// ---------- Chunk Encryption ----------

/**
 * Result of encrypting a large file in chunks.
 */

/**
 * A single encrypted chunk with its own IV and auth tag.
 */

// ---------- Encryption ----------

/**
 * Encrypt media data for a specific chat and media file.
 *
 * GUARD (V1 Bug #4): Key lookup uses explicit chatId parameter,
 * NOT UI state like selectCurrentChat(). The caller MUST provide
 * the chatId explicitly.
 *
 * GUARD (V1 Bug #10): ALL media types are encrypted unconditionally.
 * There is NO "if(quick) skip" or other conditional skip logic.
 * The mediaType parameter is for metadata tracking only —
 * it does NOT affect whether encryption happens.
 *
 * @param fileData - Raw media data to encrypt
 * @param encryptionInput - Per-chat AES-256 material (32 bytes)
 * @param chatId - Explicit chat ID for key derivation (NOT from UI state)
 * @param mediaId - Unique media file identifier (e.g., file_id)
 * @param mediaType - Type of media (for metadata; ALL types encrypted)
 * @param chunkThreshold - Size threshold above which chunked encryption is used (default: MAX_SINGLE_PIECE_SIZE)
 * @returns Encrypted file data with format header
 */
async function encryptMedia(fileData, encryptionInput, chatId, mediaId, mediaType, chunkThreshold = MAX_SINGLE_PIECE_SIZE) {
  validateInputs(fileData, encryptionInput, chatId, mediaId);

  // GUARD (V1 Bug #10): ALL media types are encrypted — no skip paths.
  // The mediaType is only used for metadata/tracking, not to decide
  // whether to encrypt. Every call to encryptMedia produces encrypted output.

  // Derive a unique media output from the chat input, chatId, and mediaId
  const derivedOutput = (0,_keyDerivation__WEBPACK_IMPORTED_MODULE_0__.deriveMediaKey)(encryptionInput, chatId, mediaId);

  // For large files, use chunked encryption
  if (fileData.length > chunkThreshold) {
    const result = await encryptMediaChunked(fileData, derivedOutput);
    return serializeChunkedResult(result);
  }

  // For smaller files, encrypt in one piece
  const {
    nonce,
    ciphertext,
    authTag
  } = await (0,_symmetric__WEBPACK_IMPORTED_MODULE_1__.encryptSymmetric)(fileData, derivedOutput);

  // Format: [version(1)] [nonce(12)] [ciphertext(var)] [authTag(16)]
  const result = new Uint8Array(1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH + ciphertext.length + _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH);
  result[0] = FILE_VERSION;
  result.set(nonce, 1);
  result.set(ciphertext, 1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH);
  result.set(authTag, 1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH + ciphertext.length);
  return result;
}

/**
 * Encrypt a large file in chunks with per-chunk IV and auth tags.
 *
 * Each chunk gets its own:
 * - 12-byte random nonce (IV)
 * - 16-byte mandatory GCM auth tag
 *
 * The format for chunked encryption is:
 * [version(1)] [totalChunks(2)] [originalSize(4)] [chunk0_nonce(12)] [chunk0_ciphertext(var)] [chunk0_authTag(16)] [chunk1_nonce(12)] ...
 *
 * GUARD: Every chunk has its own auth tag — no MAC-then-encrypt pattern.
 */
async function encryptMediaChunked(fileData, derivedOutput) {
  const totalChunks = Math.ceil(fileData.length / CHUNK_SIZE);
  const chunks = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileData.length);
    const chunkPlaintext = fileData.slice(start, end);

    // Each chunk has its own random nonce — guarantees unique IV per chunk
    const {
      nonce,
      ciphertext,
      authTag
    } = await (0,_symmetric__WEBPACK_IMPORTED_MODULE_1__.encryptSymmetric)(chunkPlaintext, derivedOutput);
    chunks.push({
      index: i,
      nonce,
      ciphertext,
      tag: authTag
    });
  }
  return {
    chunks,
    totalChunks,
    originalSize: fileData.length,
    isChunked: true
  };
}

// ---------- Decryption ----------

/**
 * Decrypt media data for a specific chat and media file.
 *
 * GUARD (V1 Bug #4): Key lookup uses explicit chatId parameter,
 * NOT from UI state like selectCurrentChat().
 *
 * @param encryptedData - Encrypted file data
 * @param encryptionInput - Per-chat AES-256 material (32 bytes)
 * @param chatId - Explicit chat ID for key derivation
 * @param mediaId - Unique media file identifier
 * @returns Decrypted file data, or undefined if decryption fails
 */
async function decryptMedia(encryptedData, encryptionInput, chatId, mediaId) {
  if (!isUint8Array(encryptedData) || encryptedData.length < MIN_ENCRYPTED_SIZE) {
    return undefined;
  }
  if (!isUint8Array(encryptionInput) || encryptionInput.length !== _symmetric__WEBPACK_IMPORTED_MODULE_1__.KEY_LENGTH) {
    return undefined;
  }
  if (typeof chatId !== 'string' || chatId.length === 0) {
    return undefined;
  }
  if (typeof mediaId !== 'string' || mediaId.length === 0) {
    return undefined;
  }

  // Derive the same media output
  const derivedOutput = (0,_keyDerivation__WEBPACK_IMPORTED_MODULE_0__.deriveMediaKey)(encryptionInput, chatId, mediaId);
  const version = encryptedData[0];
  if (version === FILE_VERSION_CHUNKED) {
    // Chunked file format: [version(0x02)] [totalChunks(2)] [originalSize(4)] [chunks...]
    return deserializeAndDecryptChunked(encryptedData, derivedOutput);
  }
  if (version === FILE_VERSION) {
    // Single-piece format: [version(0x01)] [nonce(12)] [ciphertext(var)] [authTag(16)]
    const nonce = encryptedData.slice(1, 1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH);
    const authTag = encryptedData.slice(encryptedData.length - _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH);
    const ciphertext = encryptedData.slice(1 + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH, encryptedData.length - _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH);
    try {
      return await (0,_symmetric__WEBPACK_IMPORTED_MODULE_1__.decryptSymmetric)(nonce, ciphertext, authTag, derivedOutput);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/**
 * Decrypt a chunked encrypted file.
 */
async function deserializeAndDecryptChunked(encryptedData, derivedOutput) {
  try {
    // Header: [version(1)] [totalChunks(2)] [originalSize(4)]
    const totalChunks = encryptedData[1] << 8 | encryptedData[2];
    const originalSize = encryptedData[3] << 24 | encryptedData[4] << 16 | encryptedData[5] << 8 | encryptedData[6];
    let offset = 7; // After header
    const decryptedChunks = [];
    for (let i = 0; i < totalChunks; i++) {
      // Read nonce (12 bytes)
      if (offset + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH > encryptedData.length) return undefined;
      const nonce = encryptedData.slice(offset, offset + _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH);
      offset += _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH;

      // Read auth tag at end of chunk (16 bytes)
      // Each chunk: [nonce(12)][ciphertext(var)][authTag(16)]
      // We need to find where the ciphertext ends and authTag begins
      // For the last chunk, we can calculate from remaining data
      // For middle chunks, we use CHUNK_SIZE as the plaintext size

      // Calculate expected ciphertext length for this chunk
      const isLastChunk = i === totalChunks - 1;
      const expectedPlaintextSize = isLastChunk ? originalSize - (totalChunks - 1) * CHUNK_SIZE : CHUNK_SIZE;

      // Ciphertext length = plaintext length (GCM doesn't expand)
      const ciphertextLength = expectedPlaintextSize;
      if (offset + ciphertextLength + _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH > encryptedData.length) return undefined;
      const ciphertext = encryptedData.slice(offset, offset + ciphertextLength);
      offset += ciphertextLength;
      const authTag = encryptedData.slice(offset, offset + _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH);
      offset += _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH;

      // Decrypt this chunk — MANDATORY auth tag verification per chunk
      const decryptedChunk = await (0,_symmetric__WEBPACK_IMPORTED_MODULE_1__.decryptSymmetric)(nonce, ciphertext, authTag, derivedOutput);
      decryptedChunks.push(decryptedChunk);
    }

    // Combine all decrypted chunks
    const result = new Uint8Array(originalSize);
    let resultOffset = 0;
    for (const chunk of decryptedChunks) {
      result.set(chunk, resultOffset);
      resultOffset += chunk.length;
    }
    return result;
  } catch {
    return undefined;
  }
}

// ---------- Utility ----------

/**
 * Determine if a file should be encrypted in chunks.
 * Files larger than MAX_SINGLE_PIECE_SIZE are chunked.
 */
function shouldChunk(fileSize) {
  return fileSize > MAX_SINGLE_PIECE_SIZE;
}

/**
 * Calculate the number of chunks for a given file size.
 */
function calculateChunkCount(fileSize) {
  return Math.ceil(fileSize / CHUNK_SIZE);
}

/**
 * Serialize a chunked encryption result into a single Uint8Array.
 *
 * Chunked format:
 * [version(1)] [totalChunks(2)] [originalSize(4)]
 * [chunk0_nonce(12)] [chunk0_ciphertext(var)] [chunk0_authTag(16)]
 * [chunk1_nonce(12)] [chunk1_ciphertext(var)] [chunk1_authTag(16)]
 * ...
 */
function serializeChunkedResult(result) {
  let totalSize = 1 + 2 + 4; // header: version + totalChunks + originalSize

  for (const chunk of result.chunks) {
    totalSize += _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH + chunk.ciphertext.length + _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH;
  }
  const output = new Uint8Array(totalSize);
  let offset = 0;

  // Header
  output[offset] = FILE_VERSION_CHUNKED; // version 0x02 for chunked
  offset += 1;
  output[offset] = result.totalChunks >> 8 & 0xFF;
  output[offset + 1] = result.totalChunks & 0xFF;
  offset += 2;
  output[offset] = result.originalSize >> 24 & 0xFF;
  output[offset + 1] = result.originalSize >> 16 & 0xFF;
  output[offset + 2] = result.originalSize >> 8 & 0xFF;
  output[offset + 3] = result.originalSize & 0xFF;
  offset += 4;

  // Chunks
  for (const chunk of result.chunks) {
    output.set(chunk.nonce, offset);
    offset += _symmetric__WEBPACK_IMPORTED_MODULE_1__.NONCE_LENGTH;
    output.set(chunk.ciphertext, offset);
    offset += chunk.ciphertext.length;
    output.set(chunk.tag, offset);
    offset += _symmetric__WEBPACK_IMPORTED_MODULE_1__.TAG_LENGTH;
  }
  return output;
}

/**
 * Validate inputs for encryptMedia/decryptMedia.
 * GUARD: chatId MUST be provided explicitly — this is the V1 Bug #4 fix.
 */
function validateInputs(fileData, encryptionInput, chatId, mediaId) {
  if (!isUint8Array(fileData) || fileData.length === 0) {
    throw new Error('File data must be a non-empty Uint8Array');
  }
  if (!isUint8Array(encryptionInput) || encryptionInput.length !== _symmetric__WEBPACK_IMPORTED_MODULE_1__.KEY_LENGTH) {
    throw new Error(`Chat input must be ${_symmetric__WEBPACK_IMPORTED_MODULE_1__.KEY_LENGTH} bytes`);
  }
  // GUARD (V1 Bug #4): chatId MUST be provided explicitly.
  // This is NOT derived from UI state (like selectCurrentChat).
  // The caller is responsible for passing the correct chatId.
  if (typeof chatId !== 'string' || chatId.length === 0) {
    throw new Error('chatId must be a non-empty string (explicit, not from UI state)');
  }
  if (typeof mediaId !== 'string' || mediaId.length === 0) {
    throw new Error('mediaId must be a non-empty string');
  }
}

/***/ }

}]);
//# sourceMappingURL=src_telebridge_crypto_media_ts.180823149e62fc5435fc.js.map
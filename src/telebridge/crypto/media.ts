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

import {
  deriveMediaKey,
} from './keyDerivation';
import {
  decryptSymmetric,
  encryptSymmetric,
  KEY_LENGTH,
  NONCE_LENGTH,
  TAG_LENGTH,
} from './symmetric';

// ---------- Constants ----------

/** File format version byte for single-piece encryption. */
const FILE_VERSION = 0x01;

/** File format version byte for chunked encryption. */
const FILE_VERSION_CHUNKED = 0x02;

/** Chunk size for large file encryption: 64 KiB (65536 bytes). */
export const CHUNK_SIZE = 65536;

/** Minimum payload size after decryption: version(1) + nonce(12) + authTag(16) = 29 bytes. */
const MIN_ENCRYPTED_SIZE = 1 + NONCE_LENGTH + TAG_LENGTH;

/** Maximum file size that can be encrypted in a single piece: 10 MB. */
export const MAX_SINGLE_PIECE_SIZE = 10 * 1024 * 1024;

/** Check if value is a Uint8Array-like typed array (handles cross-realm instances). */
function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

// ---------- Supported Media Types ----------

/**
 * All supported media types for encryption.
 *
 * GUARD (V1 Bug #10): Every type is listed and ALL are encrypted.
 * There is NO conditional skip path. The encryptMedia/decryptMedia
 * functions treat EVERY media type identically.
 */
export type MediaType =
  | 'photo'
  | 'video'
  | 'voice'
  | 'videoMessage'
  | 'document'
  | 'audio'
  | 'animation';

/**
 * All media types that are encrypted in transit.
 * Stickers are public assets and are NOT encrypted (by design).
 * Every media type in this set MUST go through encryption — no exceptions.
 */
export const ALL_MEDIA_TYPES: ReadonlySet<string> = new Set([
  'photo',
  'video',
  'voice',
  'videoMessage',
  'document',
  'audio',
  'animation',
]);

/**
 * Media types that are excluded from encryption.
 * Stickers are public assets and should never be encrypted.
 */
export const EXCLUDED_MEDIA_TYPES: ReadonlySet<string> = new Set([
  'sticker',
]);

/**
 * Check if a media type should be encrypted.
 * Returns true for all types in ALL_MEDIA_TYPES, false for excluded types like 'sticker'.
 *
 * @param mediaType - The media type to check
 * @returns true if the media type should be encrypted
 */
export function shouldEncryptMediaType(mediaType: string): boolean {
  return ALL_MEDIA_TYPES.has(mediaType) && !EXCLUDED_MEDIA_TYPES.has(mediaType);
}

// ---------- Chunk Encryption ----------

/**
 * Result of encrypting a large file in chunks.
 */
export interface ChunkedEncryptionResult {
  /** Array of encrypted chunks, each with its own IV, ciphertext, and auth tag. */
  readonly chunks: ChunkData[];
  /** Total number of chunks. */
  readonly totalChunks: number;
  /** Original file size in bytes. */
  readonly originalSize: number;
  /** Whether the file was encrypted in chunks (true) or single piece (false). */
  readonly isChunked: boolean;
}

/**
 * A single encrypted chunk with its own IV and auth tag.
 */
export interface ChunkData {
  /** Chunk index (0-based). */
  readonly index: number;
  /** Per-chunk nonce (12 bytes). */
  readonly nonce: Uint8Array;
  /** Encrypted chunk data (ciphertext). */
  readonly ciphertext: Uint8Array;
  /** Per-chunk authentication tag (16 bytes) — MANDATORY for each chunk. */
  readonly tag: Uint8Array;
}

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
export async function encryptMedia(
  fileData: Uint8Array,
  encryptionInput: Uint8Array,
  chatId: string,
  mediaId: string,
  mediaType: MediaType,
  chunkThreshold: number = MAX_SINGLE_PIECE_SIZE,
): Promise<Uint8Array> {
  validateInputs(fileData, encryptionInput, chatId, mediaId);

  // GUARD (V1 Bug #10): ALL media types are encrypted — no skip paths.
  // The mediaType is only used for metadata/tracking, not to decide
  // whether to encrypt. Every call to encryptMedia produces encrypted output.

  // Derive a unique media output from the chat input, chatId, and mediaId
  const derivedOutput = deriveMediaKey(encryptionInput, chatId, mediaId);

  // For large files, use chunked encryption
  if (fileData.length > chunkThreshold) {
    const result = await encryptMediaChunked(fileData, derivedOutput);
    return serializeChunkedResult(result);
  }

  // For smaller files, encrypt in one piece
  const { nonce, ciphertext, authTag } = await encryptSymmetric(fileData, derivedOutput);

  // Format: [version(1)] [nonce(12)] [ciphertext(var)] [authTag(16)]
  const result = new Uint8Array(1 + NONCE_LENGTH + ciphertext.length + TAG_LENGTH);
  result[0] = FILE_VERSION;
  result.set(nonce, 1);
  result.set(ciphertext, 1 + NONCE_LENGTH);
  result.set(authTag, 1 + NONCE_LENGTH + ciphertext.length);

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
async function encryptMediaChunked(
  fileData: Uint8Array,
  derivedOutput: Uint8Array,
): Promise<ChunkedEncryptionResult> {
  const totalChunks = Math.ceil(fileData.length / CHUNK_SIZE);
  const chunks: ChunkData[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileData.length);
    const chunkPlaintext = fileData.slice(start, end);

    // Each chunk has its own random nonce — guarantees unique IV per chunk
    const { nonce, ciphertext, authTag } = await encryptSymmetric(chunkPlaintext, derivedOutput);

    chunks.push({
      index: i,
      nonce,
      ciphertext,
      tag: authTag,
    });
  }

  return {
    chunks,
    totalChunks,
    originalSize: fileData.length,
    isChunked: true,
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
export async function decryptMedia(
  encryptedData: Uint8Array,
  encryptionInput: Uint8Array,
  chatId: string,
  mediaId: string,
): Promise<Uint8Array | undefined> {
  if (!isUint8Array(encryptedData) || encryptedData.length < MIN_ENCRYPTED_SIZE) {
    return undefined;
  }
  if (!isUint8Array(encryptionInput) || encryptionInput.length !== KEY_LENGTH) {
    return undefined;
  }
  if (typeof chatId !== 'string' || chatId.length === 0) {
    return undefined;
  }
  if (typeof mediaId !== 'string' || mediaId.length === 0) {
    return undefined;
  }

  // Derive the same media output
  const derivedOutput = deriveMediaKey(encryptionInput, chatId, mediaId);

  const version = encryptedData[0];

  if (version === FILE_VERSION_CHUNKED) {
    // Chunked file format: [version(0x02)] [totalChunks(2)] [originalSize(4)] [chunks...]
    return deserializeAndDecryptChunked(encryptedData, derivedOutput);
  }

  if (version === FILE_VERSION) {
    // Single-piece format: [version(0x01)] [nonce(12)] [ciphertext(var)] [authTag(16)]
    const nonce = encryptedData.slice(1, 1 + NONCE_LENGTH);
    const authTag = encryptedData.slice(encryptedData.length - TAG_LENGTH);
    const ciphertext = encryptedData.slice(1 + NONCE_LENGTH, encryptedData.length - TAG_LENGTH);

    try {
      return await decryptSymmetric(nonce, ciphertext, authTag, derivedOutput);
    } catch {
      return undefined;
    }
  }

  return undefined;
}

/**
 * Decrypt a chunked encrypted file.
 */
async function deserializeAndDecryptChunked(
  encryptedData: Uint8Array,
  derivedOutput: Uint8Array,
): Promise<Uint8Array | undefined> {
  try {
    // Header: [version(1)] [totalChunks(2)] [originalSize(4)]
    const totalChunks = (encryptedData[1] << 8) | encryptedData[2];
    const originalSize =
      (encryptedData[3] << 24)
      | (encryptedData[4] << 16)
      | (encryptedData[5] << 8)
      | encryptedData[6];

    let offset = 7; // After header
    const decryptedChunks: Uint8Array[] = [];

    for (let i = 0; i < totalChunks; i++) {
      // Read nonce (12 bytes)
      if (offset + NONCE_LENGTH > encryptedData.length) return undefined;
      const nonce = encryptedData.slice(offset, offset + NONCE_LENGTH);
      offset += NONCE_LENGTH;

      // Read auth tag at end of chunk (16 bytes)
      // Each chunk: [nonce(12)][ciphertext(var)][authTag(16)]
      // We need to find where the ciphertext ends and authTag begins
      // For the last chunk, we can calculate from remaining data
      // For middle chunks, we use CHUNK_SIZE as the plaintext size

      // Calculate expected ciphertext length for this chunk
      const isLastChunk = i === totalChunks - 1;
      const expectedPlaintextSize = isLastChunk
        ? originalSize - (totalChunks - 1) * CHUNK_SIZE
        : CHUNK_SIZE;

      // Ciphertext length = plaintext length (GCM doesn't expand)
      const ciphertextLength = expectedPlaintextSize;

      if (offset + ciphertextLength + TAG_LENGTH > encryptedData.length) return undefined;

      const ciphertext = encryptedData.slice(offset, offset + ciphertextLength);
      offset += ciphertextLength;

      const authTag = encryptedData.slice(offset, offset + TAG_LENGTH);
      offset += TAG_LENGTH;

      // Decrypt this chunk — MANDATORY auth tag verification per chunk
      const decryptedChunk = await decryptSymmetric(nonce, ciphertext, authTag, derivedOutput);
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
export function shouldChunk(fileSize: number): boolean {
  return fileSize > MAX_SINGLE_PIECE_SIZE;
}

/**
 * Calculate the number of chunks for a given file size.
 */
export function calculateChunkCount(fileSize: number): number {
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
function serializeChunkedResult(result: ChunkedEncryptionResult): Uint8Array {
  let totalSize = 1 + 2 + 4; // header: version + totalChunks + originalSize

  for (const chunk of result.chunks) {
    totalSize += NONCE_LENGTH + chunk.ciphertext.length + TAG_LENGTH;
  }

  const output = new Uint8Array(totalSize);
  let offset = 0;

  // Header
  output[offset] = FILE_VERSION_CHUNKED; // version 0x02 for chunked
  offset += 1;

  output[offset] = (result.totalChunks >> 8) & 0xFF;
  output[offset + 1] = result.totalChunks & 0xFF;
  offset += 2;

  output[offset] = (result.originalSize >> 24) & 0xFF;
  output[offset + 1] = (result.originalSize >> 16) & 0xFF;
  output[offset + 2] = (result.originalSize >> 8) & 0xFF;
  output[offset + 3] = result.originalSize & 0xFF;
  offset += 4;

  // Chunks
  for (const chunk of result.chunks) {
    output.set(chunk.nonce, offset);
    offset += NONCE_LENGTH;

    output.set(chunk.ciphertext, offset);
    offset += chunk.ciphertext.length;

    output.set(chunk.tag, offset);
    offset += TAG_LENGTH;
  }

  return output;
}

/**
 * Validate inputs for encryptMedia/decryptMedia.
 * GUARD: chatId MUST be provided explicitly — this is the V1 Bug #4 fix.
 */
function validateInputs(
  fileData: Uint8Array,
  encryptionInput: Uint8Array,
  chatId: string,
  mediaId: string,
): void {
  if (!isUint8Array(fileData) || fileData.length === 0) {
    throw new Error('File data must be a non-empty Uint8Array');
  }
  if (!isUint8Array(encryptionInput) || encryptionInput.length !== KEY_LENGTH) {
    throw new Error(`Chat input must be ${KEY_LENGTH} bytes`);
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

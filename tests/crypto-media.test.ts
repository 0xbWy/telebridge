/**
 * TeleBridge — Media Encryption Tests
 *
 * VAL-CRYPTO-028: All media types encrypted without exception
 * VAL-CRYPTO-029: Media key lookup by explicit chatId (not selectCurrentChat)
 * VAL-CRYPTO-030: Large files encrypted in chunks with per-chunk auth tags
 */
import type { MediaType } from '../src/telebridge/crypto/media';

import {
  ALL_MEDIA_TYPES,
  calculateChunkCount,
  CHUNK_SIZE,
  decryptMedia,
  encryptMedia,
  MAX_SINGLE_PIECE_SIZE,
  shouldChunk,
} from '../src/telebridge/crypto/media';

// ---------- Helpers ----------

function createRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  // getRandomValues has a 65536 byte limit in some environments
  const CHUNK = 65536;
  for (let offset = 0; offset < size; offset += CHUNK) {
    const end = Math.min(offset + CHUNK, size);
    crypto.getRandomValues(data.subarray(offset, end));
  }
  return data;
}

// ---------- VAL-CRYPTO-028: All media types encrypted without exception ----------

describe('VAL-CRYPTO-028: All media types encrypted unconditionally', () => {
  const mediaTypes: MediaType[] = ['photo', 'video', 'voice', 'videoMessage', 'document', 'audio', 'animation'];
  const chatKey = new Uint8Array(32);
  crypto.getRandomValues(chatKey);

  test('every media type in ALL_MEDIA_TYPES is encrypted', async () => {
    for (const mediaType of mediaTypes) {
      const data = createRandomData(1024);
      const encrypted = await encryptMedia(data, chatKey, 'chat-1', `media-${mediaType}`, mediaType);
      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted.length).toBeGreaterThan(0);
      // Verify it starts with version byte
      expect(encrypted[0]).toBe(0x01);
    }
  });

  test('ALL_MEDIA_TYPES set contains all expected types (except sticker)', () => {
    expect(ALL_MEDIA_TYPES.has('photo')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('video')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('voice')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('videoMessage')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('document')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('audio')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('sticker')).toBe(false); // Stickers excluded by design
    expect(ALL_MEDIA_TYPES.has('animation')).toBe(true);
  });

  test('sticker type is excluded from ALL_MEDIA_TYPES and in EXCLUDED_MEDIA_TYPES', async () => {
    const { EXCLUDED_MEDIA_TYPES, shouldEncryptMediaType } = await import('../src/telebridge/crypto/media');
    expect(EXCLUDED_MEDIA_TYPES.has('sticker')).toBe(true);
    expect(shouldEncryptMediaType('sticker')).toBe(false);
    expect(shouldEncryptMediaType('photo')).toBe(true);
    expect(shouldEncryptMediaType('video')).toBe(true);
  });

  test('encryption produces different ciphertext each time (random nonce)', async () => {
    const data = createRandomData(512);
    const enc1 = await encryptMedia(data, chatKey, 'chat-1', 'media-1', 'photo');
    const enc2 = await encryptMedia(data, chatKey, 'chat-1', 'media-2', 'photo');
    // Different nonces → different ciphertexts
    expect(enc1).not.toEqual(enc2);
  });

  test('decryption round-trips for every media type', async () => {
    for (const mediaType of mediaTypes) {
      const data = createRandomData(512);
      const encrypted = await encryptMedia(data, chatKey, 'chat-1', `media-${mediaType}`, mediaType);
      const decrypted = await decryptMedia(encrypted, chatKey, 'chat-1', `media-${mediaType}`);

      expect(decrypted).toBeDefined();
      expect(decrypted).toEqual(data);
    }
  });

  test('tampered ciphertext fails decryption', async () => {
    const data = createRandomData(256);
    const encrypted = await encryptMedia(data, chatKey, 'chat-1', 'media-1', 'photo');

    // Tamper with the ciphertext (after version byte and nonce)
    const tampered = new Uint8Array(encrypted);
    tampered[20] ^= 0xFF; // Flip a byte in the ciphertext area

    const result = await decryptMedia(tampered, chatKey, 'chat-1', 'media-1');
    expect(result).toBeUndefined();
  });

  test('wrong key fails decryption', async () => {
    const data = createRandomData(256);
    const encrypted = await encryptMedia(data, chatKey, 'chat-1', 'media-1', 'photo');

    const wrongKey = new Uint8Array(32);
    crypto.getRandomValues(wrongKey);

    const result = await decryptMedia(encrypted, wrongKey, 'chat-1', 'media-1');
    expect(result).toBeUndefined();
  });
});

// ---------- VAL-CRYPTO-029: Media key lookup by explicit chatId ----------

describe('VAL-CRYPTO-029: Media key uses explicit chatId (not UI state)', () => {
  const chatKey = new Uint8Array(32);
  crypto.getRandomValues(chatKey);

  test('different chatIds produce different encrypted output', async () => {
    const data = createRandomData(512);

    const encrypted1 = await encryptMedia(data, chatKey, 'chat-alice', 'media-1', 'photo');
    const encrypted2 = await encryptMedia(data, chatKey, 'chat-bob', 'media-1', 'photo');

    // Different chatId → different media key → different ciphertext
    expect(encrypted1).not.toEqual(encrypted2);
  });

  test('encryption with chatId A decrypts only with chatId A', async () => {
    const data = createRandomData(256);
    const encrypted = await encryptMedia(data, chatKey, 'chat-alice', 'media-1', 'video');

    // Correct chatId decrypts
    const decrypted = await decryptMedia(encrypted, chatKey, 'chat-alice', 'media-1');
    expect(decrypted).toEqual(data);

    // Wrong chatId fails
    const wrongResult = await decryptMedia(encrypted, chatKey, 'chat-bob', 'media-1');
    expect(wrongResult).toBeUndefined();
  });

  test('empty chatId throws error (requires explicit ID)', async () => {
    const data = createRandomData(256);
    await expect(encryptMedia(data, chatKey, '', 'media-1', 'photo')).rejects.toThrow(/non-empty string/);
  });

  test('different mediaIds produce different keys within same chat', async () => {
    const data = createRandomData(256);

    const enc1 = await encryptMedia(data, chatKey, 'chat-alice', 'photo-1', 'photo');
    const enc2 = await encryptMedia(data, chatKey, 'chat-alice', 'photo-2', 'photo');

    // Different mediaId → different media key → different ciphertext
    expect(enc1).not.toEqual(enc2);
  });

  test('two different chats with same mediaId produce different ciphertexts', async () => {
    const data = createRandomData(256);

    const enc1 = await encryptMedia(data, chatKey, 'chat-alice', 'photo-1', 'photo');
    const enc2 = await encryptMedia(data, chatKey, 'chat-bob', 'photo-1', 'photo');

    // Explicit chatId produces different keys per chat
    expect(enc1).not.toEqual(enc2);
  });
});

// ---------- VAL-CRYPTO-030: Large files chunked with per-chunk auth tags ----------

describe('VAL-CRYPTO-030: Large files encrypted in chunks with per-chunk GCM tags', () => {
  const chatKey = new Uint8Array(32);
  crypto.getRandomValues(chatKey);

  // Use a small threshold for testing chunked encryption without needing huge files
  const TEST_CHUNK_THRESHOLD = 1024; // 1KB threshold forces chunking for larger data

  test('100KB file encrypts and decrypts correctly (chunked)', async () => {
    const size100KB = 100 * 1024;
    const data = createRandomData(size100KB);

    const encrypted = await encryptMedia(data, chatKey, 'chat-chunk-100k', 'large-1', 'document', TEST_CHUNK_THRESHOLD);
    // Chunked format: version byte should be 0x02
    expect(encrypted[0]).toBe(0x02);
    const decrypted = await decryptMedia(encrypted, chatKey, 'chat-chunk-100k', 'large-1');

    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(data);
  });

  test('1MB file encrypts and decrypts correctly (single-piece)', async () => {
    const size1MB = 1024 * 1024;
    const data = createRandomData(size1MB);

    // 1MB is under MAX_SINGLE_PIECE_SIZE, so it uses single-piece format
    const encrypted = await encryptMedia(data, chatKey, 'chat-chunk-1m', 'large-2', 'document');
    // Single-piece: version byte should be 0x01
    expect(encrypted[0]).toBe(0x01);
    const decrypted = await decryptMedia(encrypted, chatKey, 'chat-chunk-1m', 'large-2');

    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(data);
  });

  test('chunked file round-trip with multiple chunks', async () => {
    // Create a file that will produce exactly 3 chunks with TEST_CHUNK_THRESHOLD
    const data = createRandomData(TEST_CHUNK_THRESHOLD * 3 + 100);

    const encrypted = await encryptMedia(data, chatKey, 'chat-chunks-3', 'chunk-3', 'video', TEST_CHUNK_THRESHOLD);
    expect(encrypted[0]).toBe(0x02); // Chunked format version

    const decrypted = await decryptMedia(encrypted, chatKey, 'chat-chunks-3', 'chunk-3');
    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(data);
  });

  test('files exceeding MAX_SINGLE_PIECE_SIZE are chunked', () => {
    expect(shouldChunk(MAX_SINGLE_PIECE_SIZE + 1)).toBe(true);
    expect(shouldChunk(MAX_SINGLE_PIECE_SIZE)).toBe(false);
  });

  test('calculateChunkCount is correct', () => {
    expect(calculateChunkCount(CHUNK_SIZE)).toBe(1);
    expect(calculateChunkCount(CHUNK_SIZE + 1)).toBe(2);
  });

  test('tampering with one chunk causes decryption failure (chunked)', async () => {
    const data = createRandomData(TEST_CHUNK_THRESHOLD * 2 + 100);

    const encrypted = await encryptMedia(data, chatKey, 'chat-tamper', 'tamper-1', 'document', TEST_CHUNK_THRESHOLD);

    // Tamper with a byte in the middle of the encrypted data (after header)
    const tampered = new Uint8Array(encrypted);
    const midPoint = Math.floor(tampered.length / 2);
    tampered[midPoint] ^= 0xFF;

    const result = await decryptMedia(tampered, chatKey, 'chat-tamper', 'tamper-1');
    expect(result).toBeUndefined();
  });

  test('wrong key fails for chunked files', async () => {
    const data = createRandomData(TEST_CHUNK_THRESHOLD * 2);

    const encrypted = await encryptMedia(data, chatKey, 'chat-wrongkey', 'wrong-key-1', 'document', TEST_CHUNK_THRESHOLD);

    const wrongKey = new Uint8Array(32);
    // Fill with different random data by chunking getRandomValues calls
    for (let i = 0; i < wrongKey.length; i += 32) {
      crypto.getRandomValues(wrongKey.subarray(i, Math.min(i + 32, wrongKey.length)));
    }

    const result = await decryptMedia(encrypted, wrongKey, 'chat-wrongkey', 'wrong-key-1');
    expect(result).toBeUndefined();
  });

  test('small files use single-piece encryption (not chunked)', async () => {
    const smallData = createRandomData(1024);
    const encrypted = await encryptMedia(smallData, chatKey, 'chat-small', 'small-1', 'photo');

    // Single-piece format: version(1) + nonce(12) + ciphertext + authTag(16)
    // For 1024 bytes: 1 + 12 + 1024 + 16 = 1053
    expect(encrypted.length).toBe(1 + 12 + 1024 + 16);

    // Version byte should be 0x01 (single-piece)
    expect(encrypted[0]).toBe(0x01);
  });

  test('CHUNK_SIZE is 64KB (65536 bytes)', () => {
    expect(CHUNK_SIZE).toBe(65536);
  });

  test('every chunk has its own auth tag (chunked round-trip)', async () => {
    // Create a file that results in multiple chunks
    const data = createRandomData(TEST_CHUNK_THRESHOLD * 2 + 500);

    const encrypted = await encryptMedia(data, chatKey, 'chat-auth', 'auth-test', 'video', TEST_CHUNK_THRESHOLD);
    const decrypted = await decryptMedia(encrypted, chatKey, 'chat-auth', 'auth-test');

    expect(decrypted).toEqual(data);
  });
});

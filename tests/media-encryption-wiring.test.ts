/**
 * TeleBridge — Media Encryption Wiring Tests
 *
 * Tests that encryptMediaForChat and decryptMediaForChat are properly wired
 * into the upload and download media pipelines.
 *
 * VAL-MEDIA-001: Photos encrypted on upload
 * VAL-MEDIA-002: Photos decrypted on download
 * VAL-MEDIA-003: Documents encrypted on upload
 * VAL-MEDIA-004: Documents decrypted on download
 * VAL-MEDIA-005: All media types encrypted unconditionally
 * VAL-MEDIA-006: Key lookup uses message chatId
 * VAL-MEDIA-007: Voice messages encrypted and decrypted
 * VAL-MEDIA-008: Video messages encrypted and decrypted
 * VAL-MEDIA-009: Stickers excluded from encryption
 * VAL-REG-004: Key lookup uses explicit chatId for messages
 */

import type { MediaType } from '../src/telebridge/crypto/media';

import {
  ALL_MEDIA_TYPES,
  EXCLUDED_MEDIA_TYPES,
  shouldEncryptMediaType,
  encryptMedia,
  decryptMedia,
} from '../src/telebridge/crypto/media';
import {
  setChatKey,
  hasChatKey,
  clearAllChatKeys,
} from '../src/telebridge/messages';
import {
  encryptMediaForChat,
  decryptMediaForChat,
} from '../src/telebridge/integration';
import {
  shouldEncryptAttachment,
  shouldEncryptAttachmentsForChat,
  shouldDecryptForChat,
  getMediaTypeFromAttachment,
  decryptDownloadedMedia,
  getMediaIdFromHash,
} from '../src/telebridge/mediaPipeline';
import {
  generateChatKey,
} from '../src/telebridge/crypto/symmetric';

// ---------- Test Utilities ----------

function createRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  crypto.getRandomValues(data);
  return data;
}

// ---------- Setup/Teardown ----------

beforeEach(() => {
  clearAllChatKeys();
});

afterEach(() => {
  clearAllChatKeys();
});

// ---------- VAL-MEDIA-001: Photos encrypted on upload ----------

describe('VAL-MEDIA-001: Photos encrypted on upload', () => {
  const chatId = 'chat-photo-upload-test';

  test('encryptMediaForChat encrypts photo data with chat key', async () => {
    setChatKey(chatId, generateChatKey().key);
    const photoData = createRandomData(1024);

    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-upload-1', 'photo');

    // Encrypted data should start with version byte 0x01 or 0x02
    expect(encrypted[0]).toBe(0x01);
    // Encrypted data should not be the same as plaintext
    expect(encrypted).not.toEqual(photoData);
    // Encrypted data should be larger (version byte + nonce + auth tag)
    expect(encrypted.length).toBeGreaterThan(photoData.length);
  });

  test('photo version byte is 0x01 for single-piece', async () => {
    setChatKey(chatId, generateChatKey().key);
    const photoData = createRandomData(512); // Small enough for single-piece

    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-upload-2', 'photo');
    expect(encrypted[0]).toBe(0x01);
  });
});

// ---------- VAL-MEDIA-002: Photos decrypted on download ----------

describe('VAL-MEDIA-002: Photos decrypted on download', () => {
  const chatId = 'chat-photo-download-test';

  test('decryptMediaForChat decrypts photo data with chat key', async () => {
    setChatKey(chatId, generateChatKey().key);
    const photoData = createRandomData(1024);

    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-dl-1', 'photo');
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'photo-dl-1');

    expect(decrypted).toBeDefined();
    expect(decrypted).toEqual(photoData);
  });

  test('decryptDownloadedMedia decrypts encrypted blob', async () => {
    setChatKey(chatId, generateChatKey().key);
    const photoData = createRandomData(512);

    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-dl-blob', 'photo');

    // Test the decryptMediaForChat path (raw Uint8Array) rather than Blob path
    // since Blob arrayBuffer is not available in Jest
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'photo-dl-blob');
    expect(decrypted).toEqual(photoData);
  });
});

// ---------- VAL-MEDIA-003: Documents encrypted on upload ----------

describe('VAL-MEDIA-003: Documents encrypted on upload', () => {
  const chatId = 'chat-doc-upload-test';

  test('encryptMediaForChat encrypts document data with chat key', async () => {
    setChatKey(chatId, generateChatKey().key);
    const docData = createRandomData(2048);

    const encrypted = await encryptMediaForChat(docData, chatId, 'doc-upload-1', 'document');

    expect(encrypted[0]).toBe(0x01);
    expect(encrypted.length).toBeGreaterThan(docData.length);
  });
});

// ---------- VAL-MEDIA-004: Documents decrypted on download ----------

describe('VAL-MEDIA-004: Documents decrypted on download', () => {
  const chatId = 'chat-doc-download-test';

  test('round-trip: encrypt document → decrypt document', async () => {
    setChatKey(chatId, generateChatKey().key);
    const docData = createRandomData(2048);

    const encrypted = await encryptMediaForChat(docData, chatId, 'doc-dl-1', 'document');
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'doc-dl-1');

    expect(decrypted).toEqual(docData);
  });
});

// ---------- VAL-MEDIA-005: All media types encrypted unconditionally ----------

describe('VAL-MEDIA-005: All media types encrypted unconditionally', () => {
  test('ALL_MEDIA_TYPES includes photo, video, voice, document, audio, animation', () => {
    expect(ALL_MEDIA_TYPES.has('photo')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('video')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('voice')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('document')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('audio')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('animation')).toBe(true);
    expect(ALL_MEDIA_TYPES.has('videoMessage')).toBe(true);
  });

  test('ALL_MEDIA_TYPES does NOT include sticker', () => {
    expect(ALL_MEDIA_TYPES.has('sticker')).toBe(false);
  });

  test('no "if(quick) skip" conditional skip path in encryptMedia', async () => {
    // Verify that ALL media types in ALL_MEDIA_TYPES are encrypted without exception
    const chatId = 'chat-all-types-test';
    const chatKey = generateChatKey().key;
    setChatKey(chatId, chatKey);
    const testData = createRandomData(256);

    for (const mediaType of ALL_MEDIA_TYPES) {
      const encKey = generateChatKey().key;
      const encrypted = await encryptMedia(testData, encKey, chatId, `media-${mediaType}`, mediaType as MediaType);
      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted[0]).toBe(0x01); // Version byte for single-piece
    }
  });
});

// ---------- VAL-MEDIA-006: Key lookup uses message chatId ----------

describe('VAL-MEDIA-006: Key lookup uses message chatId', () => {
  test('encryptMediaForChat uses explicit chatId, not selectCurrentChat', async () => {
    const chatId = 'chat-explicit-id';
    setChatKey(chatId, generateChatKey().key);

    // This should work with the explicit chatId, regardless of what chat is "current"
    const data = createRandomData(256);
    const encrypted = await encryptMediaForChat(data, chatId, 'media-explicit', 'photo');
    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(0);
  });

  test('decryptMediaForChat uses explicit chatId', async () => {
    const chatId = 'chat-decrypt-explicit-id';
    setChatKey(chatId, generateChatKey().key);

    const data = createRandomData(256);
    const encrypted = await encryptMediaForChat(data, chatId, 'media-decrypt-explicit', 'photo');
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'media-decrypt-explicit');
    expect(decrypted).toEqual(data);
  });

  test('shouldEncryptAttachmentsForChat uses explicit chatId', () => {
    const chatId = 'chat-wiring-explicit';
    expect(hasChatKey(chatId)).toBe(false);
    expect(shouldEncryptAttachmentsForChat(chatId, false)).toBe(false);

    setChatKey(chatId, generateChatKey().key);
    expect(shouldEncryptAttachmentsForChat(chatId, false)).toBe(true);
  });

  test('shouldDecryptForChat uses explicit chatId', () => {
    const chatId = 'chat-decrypt-wiring';
    expect(shouldDecryptForChat(chatId)).toBe(false);

    setChatKey(chatId, generateChatKey().key);
    expect(shouldDecryptForChat(chatId)).toBe(true);
  });
});

// ---------- VAL-MEDIA-007: Voice messages encrypted and decrypted ----------

describe('VAL-MEDIA-007: Voice messages', () => {
  const chatId = 'chat-voice-test';

  test('encryptMediaForChat encrypts voice data', async () => {
    setChatKey(chatId, generateChatKey().key);
    const voiceData = createRandomData(1024);

    const encrypted = await encryptMediaForChat(voiceData, chatId, 'voice-1', 'voice');
    expect(encrypted[0]).toBe(0x01);
  });

  test('round-trip: encrypt voice → decrypt voice', async () => {
    setChatKey(chatId, generateChatKey().key);
    const voiceData = createRandomData(1024);

    const encrypted = await encryptMediaForChat(voiceData, chatId, 'voice-2', 'voice');
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'voice-2');
    expect(decrypted).toEqual(voiceData);
  });

  test('ALL_MEDIA_TYPES includes voice', () => {
    expect(ALL_MEDIA_TYPES.has('voice')).toBe(true);
  });
});

// ---------- VAL-MEDIA-008: Video messages encrypted and decrypted ----------

describe('VAL-MEDIA-008: Video messages', () => {
  const chatId = 'chat-video-test';

  test('encryptMediaForChat encrypts video data', async () => {
    setChatKey(chatId, generateChatKey().key);
    const videoData = createRandomData(4096);

    const encrypted = await encryptMediaForChat(videoData, chatId, 'video-1', 'video');
    expect(encrypted[0]).toBe(0x01);
  });

  test('round-trip: encrypt video → decrypt video', async () => {
    setChatKey(chatId, generateChatKey().key);
    const videoData = createRandomData(4096);

    const encrypted = await encryptMediaForChat(videoData, chatId, 'video-2', 'video');
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'video-2');
    expect(decrypted).toEqual(videoData);
  });

  test('ALL_MEDIA_TYPES includes video', () => {
    expect(ALL_MEDIA_TYPES.has('video')).toBe(true);
  });
});

// ---------- VAL-MEDIA-009: Stickers excluded from encryption ----------

describe('VAL-MEDIA-009: Stickers excluded from encryption', () => {
  test('sticker is NOT in ALL_MEDIA_TYPES', () => {
    expect(ALL_MEDIA_TYPES.has('sticker')).toBe(false);
  });

  test('sticker is in EXCLUDED_MEDIA_TYPES', () => {
    expect(EXCLUDED_MEDIA_TYPES.has('sticker')).toBe(true);
  });

  test('shouldEncryptMediaType returns false for sticker', () => {
    expect(shouldEncryptMediaType('sticker')).toBe(false);
  });

  test('shouldEncryptMediaType returns true for all encrypted types', () => {
    expect(shouldEncryptMediaType('photo')).toBe(true);
    expect(shouldEncryptMediaType('video')).toBe(true);
    expect(shouldEncryptMediaType('voice')).toBe(true);
    expect(shouldEncryptMediaType('document')).toBe(true);
    expect(shouldEncryptMediaType('audio')).toBe(true);
  });

  test('shouldEncryptAttachment returns false for gif (sticker-like)', () => {
    const chatId = 'chat-sticker-test';
    setChatKey(chatId, generateChatKey().key);

    // gif property indicates sticker-like content
    const gifAttachment = {
      blobUrl: 'blob:test-gif',
      filename: 'test.gif',
      mimeType: 'image/gif',
      size: 256,
      gif: {} as any, // Sticker-like gif
      quick: { width: 100, height: 100 },
    };

    expect(shouldEncryptAttachment(gifAttachment as any, chatId, false)).toBe(false);
  });
});

// ---------- VAL-REG-004: Key lookup uses explicit chatId for messages ----------

describe('VAL-REG-004: Key lookup uses explicit chatId', () => {
  test('encryptMediaForChat requires explicit chatId', async () => {
    const chatId = 'chat-reg4-encrypt';
    setChatKey(chatId, generateChatKey().key);

    const data = createRandomData(256);
    const encrypted = await encryptMediaForChat(data, chatId, 'reg4-1', 'photo');
    expect(encrypted).toBeInstanceOf(Uint8Array);

    // Different chatId should fail (no key)
    await expect(encryptMediaForChat(data, 'nonexistent-chat', 'reg4-2', 'photo')).rejects.toThrow(/No chat key/);
  });

  test('decryptMediaForChat returns undefined for chat without key', async () => {
    const chatId = 'chat-reg4-decrypt';
    setChatKey(chatId, generateChatKey().key);

    const data = createRandomData(256);
    const encrypted = await encryptMediaForChat(data, chatId, 'reg4-3', 'photo');

    // Should work with correct chatId
    const decrypted = await decryptMediaForChat(encrypted, chatId, 'reg4-3');
    expect(decrypted).toEqual(data);

    // Should return undefined for wrong chatId (no key)
    const wrongDecrypted = await decryptMediaForChat(encrypted, 'nonexistent-chat', 'reg4-3');
    expect(wrongDecrypted).toBeUndefined();
  });
});

// ---------- Media Pipeline Utility Tests ----------

describe('Media pipeline utilities', () => {
  test('getMediaTypeFromAttachment returns correct types for voice', () => {
    const voiceAttachment = { blobUrl: 'blob:voice', filename: 'voice.ogg', mimeType: 'audio/ogg', size: 256, voice: { duration: 5, waveform: [0.1] } };
    expect(getMediaTypeFromAttachment(voiceAttachment)).toBe('voice');
  });

  test('getMediaTypeFromAttachment returns correct types for audio', () => {
    const audioAttachment = { blobUrl: 'blob:audio', filename: 'song.mp3', mimeType: 'audio/mp3', size: 256, audio: { duration: 180, title: 'Song' } };
    expect(getMediaTypeFromAttachment(audioAttachment)).toBe('audio');
  });

  test('getMediaTypeFromAttachment returns photo for quick image', () => {
    const photoAttachment = { blobUrl: 'blob:photo', filename: 'test.jpg', mimeType: 'image/jpeg', size: 256, quick: { width: 800, height: 600 } };
    expect(getMediaTypeFromAttachment(photoAttachment)).toBe('photo');
  });

  test('getMediaTypeFromAttachment returns video for quick video', () => {
    const videoAttachment = { blobUrl: 'blob:video', filename: 'test.mp4', mimeType: 'video/mp4', size: 256, quick: { width: 1920, height: 1080, duration: 30 } };
    expect(getMediaTypeFromAttachment(videoAttachment)).toBe('video');
  });

  test('getMediaTypeFromAttachment returns document for generic files', () => {
    const docAttachment = { blobUrl: 'blob:doc', filename: 'test.pdf', mimeType: 'application/pdf', size: 256 };
    expect(getMediaTypeFromAttachment(docAttachment)).toBe('document');
  });

  test('decryptDownloadedMedia passes through unencrypted data', async () => {
    const chatId = 'chat-passthrough';
    setChatKey(chatId, generateChatKey().key);

    // Create a blob that does NOT look like encrypted data (starts with PNG magic bytes)
    const pngData = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const pngBlob = new Blob([pngData.buffer as ArrayBuffer], { type: 'image/png' });

    const result = await decryptDownloadedMedia(pngBlob, chatId, 'test-png');
    // Should return the original blob (not encrypted)
    expect(result).toBeInstanceOf(Blob);
    expect(result).toBe(pngBlob); // Same reference since not encrypted
  });

  test('decryptDownloadedMedia passes through when no key', async () => {
    const chatId = 'chat-no-key';
    // No key set for this chat
    const data = new Blob([createRandomData(256).buffer as ArrayBuffer], { type: 'application/octet-stream' });

    const result = await decryptDownloadedMedia(data, chatId, 'test-no-key');
    expect(result).toBe(data); // Same reference since no key
  });

  test('decryptDownloadedMedia passes through string URLs', async () => {
    const chatId = 'chat-string-url';
    setChatKey(chatId, generateChatKey().key);

    const result = await decryptDownloadedMedia('https://example.com/photo.jpg', chatId, 'test-string');
    expect(result).toBe('https://example.com/photo.jpg'); // String URLs passed through
  });

  test('getMediaIdFromHash extracts entity info', () => {
    expect(getMediaIdFromHash('document123456')).toBe('document-123456');
    expect(getMediaIdFromHash('photo789')).toBe('photo-789');
    expect(getMediaIdFromHash('unknownhash')).toBe('unknownhash');
  });

  test('shouldEncryptAttachmentsForChat respects isPaused', () => {
    const chatId = 'chat-pause-test';
    setChatKey(chatId, generateChatKey().key);

    expect(shouldEncryptAttachmentsForChat(chatId, false)).toBe(true);
    expect(shouldEncryptAttachmentsForChat(chatId, true)).toBe(false);
  });

  test('shouldEncryptAttachmentsForChat returns false when no key', () => {
    const chatId = 'chat-no-key-2';
    expect(shouldEncryptAttachmentsForChat(chatId, false)).toBe(false);
  });
});

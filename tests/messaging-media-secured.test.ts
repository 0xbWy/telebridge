/**
 * TeleBridge — Messaging Media Secured Tests
 *
 * Tests for:
 * - VAL-MSG-008: Inline photos encrypted before upload, receiver sees decrypted photo
 * - VAL-MSG-009: Photo attachments encrypted, receiver can view decrypted photo
 * - VAL-MSG-010: Videos encrypted, receiver can play decrypted video
 * - VAL-MSG-011: Voice messages encrypted, receiver can play decrypted audio
 * - VAL-MSG-012: Documents encrypted, receiver gets correct filename and content
 * - VAL-MSG-013: Send Secured produces tb1.a message, not decryptable with symmetric key
 * - VAL-MSG-014: Received secured messages decrypted with private key, secured badge shown
 * - VAL-MSG-015: Two messages on wire for secured (recipient + self)
 * - VAL-MSG-016: Only one message bubble shown per send (encrypt-to-self filtered)
 * - VAL-MSG-017: Message counter increments monotonically per chat (never stuck at 0)
 * - VAL-MSG-018: Key rotation triggered at message count threshold
 * - VAL-MSG-019: Key rotation triggered at time threshold
 */

import {
  setChatKey,
  hasChatKey,
  clearAllChatKeys,
  encryptMessage,
  decryptMessage,
  shouldRotateChatKey,
  rotateChatKey,
  getMessageCounter,
  isTeleBridgeMessage,
  shouldHideMessage,
} from '../src/telebridge/messages';

import {
  processOutgoingMessage,
  processIncomingMessage,
  processOutgoingSecuredMessage,
  processIncomingSecuredMessage,
  processIncomingSelfSecuredMessage,
  isEncryptToSelfDuplicate,
  checkKeyRotation,
  lockMessagePipeline,
  encryptMediaForChat,
  decryptMediaForChat,
  setRecipientX25519PublicKey,
  shouldTriggerKeyRotationByCount,
  shouldTriggerKeyRotationByTime,
  performKeyRotation,
  SecuredMessagePair,
} from '../src/telebridge/integration';

import {
  generateChatKey,
  RatchetState,
  DEFAULT_ROTATE_AFTER_MESSAGES,
  DEFAULT_ROTATE_AFTER_TIME_MS,
} from '../src/telebridge/crypto/symmetric';

import {
  generateIdentityKeypair,
  deriveX25519FromEd25519,
} from '../src/telebridge/crypto/identity';

import {
  encryptSecuredMessage,
  decryptSecuredMessageRecipient,
  decryptSecuredMessageSelf,
} from '../src/telebridge/crypto/asymmetric';

import {
  decodeProtocol,
  encodeProtocol,
  PROTOCOL_PREFIX,
} from '../src/telebridge/crypto/protocol';

import {
  encryptMedia,
  decryptMedia,
  ALL_MEDIA_TYPES,
  MediaType,
} from '../src/telebridge/crypto/media';

// ---------- Test Utilities ----------

function makeTestChatKey() {
  return generateChatKey();
}

function setupChatKey(chatId: string) {
  const result = makeTestChatKey();
  setChatKey(chatId, result.key);
  return result;
}

function createRandomData(size: number): Uint8Array {
  const data = new Uint8Array(size);
  const CHUNK = 65536;
  for (let offset = 0; offset < size; offset += CHUNK) {
    const end = Math.min(offset + CHUNK, size);
    crypto.getRandomValues(data.subarray(offset, end));
  }
  return data;
}

function cleanup() {
  clearAllChatKeys();
}

// ---------- VAL-MSG-008: Inline photos encrypted before upload ----------

describe('VAL-MSG-008: Inline photos encrypted before upload', () => {
  afterEach(cleanup);

  test('photo data is encrypted with chat key before upload', async () => {
    const chatId = 'test-photo-inline';
    const chatKey = setupChatKey(chatId);

    const photoData = createRandomData(50000); // 50KB photo
    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-inline-1', 'photo');

    expect(encrypted).toBeInstanceOf(Uint8Array);
    expect(encrypted.length).toBeGreaterThan(photoData.length); // Encrypted should be larger due to header + auth tag
    expect(encrypted[0]).toBe(0x01); // Version byte for single-piece encryption
  });

  test('receiver decrypts inline photo and sees original data', async () => {
    const chatId = 'test-photo-inline-decrypt';
    setupChatKey(chatId);

    const originalPhoto = createRandomData(50000);
    const encrypted = await encryptMediaForChat(originalPhoto, chatId, 'photo-inline-2', 'photo');

    const decrypted = await decryptMediaForChat(encrypted, chatId, 'photo-inline-2');

    expect(decrypted).toBeDefined();
    expect(decrypted!.length).toBe(originalPhoto.length);
    // Verify byte-for-byte match
    for (let i = 0; i < originalPhoto.length; i++) {
      expect(decrypted![i]).toBe(originalPhoto[i]);
    }
  });

  test('inline photo encryption uses explicit chatId (V1 Bug #4)', async () => {
    const chatId1 = 'test-photo-chat1';
    const chatId2 = 'test-photo-chat2';
    setupChatKey(chatId1);
    setupChatKey(chatId2);

    const photoData = createRandomData(10240);

    // Encrypt same image for different chats
    const enc1 = await encryptMediaForChat(photoData, chatId1, 'photo-shared', 'photo');
    const enc2 = await encryptMediaForChat(photoData, chatId2, 'photo-shared', 'photo');

    // Different chats should produce different encrypted outputs
    // (different keys → different ciphertext)
    expect(enc1).not.toEqual(enc2);

    // Each chat should decrypt correctly
    const dec1 = await decryptMediaForChat(enc1, chatId1, 'photo-shared');
    const dec2 = await decryptMediaForChat(enc2, chatId2, 'photo-shared');

    expect(dec1).toBeDefined();
    expect(dec2).toBeDefined();
    expect(new TextDecoder().decode(dec1!)).not.toBe(new TextDecoder().decode(enc2));
  });
});

// ---------- VAL-MSG-009: Photo attachments encrypted ----------

describe('VAL-MSG-009: Photo attachments encrypted', () => {
  afterEach(cleanup);

  test('photo attachment encrypts and decrypts correctly', async () => {
    const chatId = 'test-photo-attach';
    setupChatKey(chatId);

    const photoData = createRandomData(100000); // 100KB
    const encrypted = await encryptMediaForChat(photoData, chatId, 'photo-attach-1', 'photo');

    const decrypted = await decryptMediaForChat(encrypted, chatId, 'photo-attach-1');

    expect(decrypted).toBeDefined();
    expect(decrypted!.length).toBe(photoData.length);
    for (let i = 0; i < photoData.length; i++) {
      expect(decrypted![i]).toBe(photoData[i]);
    }
  });
});

// ---------- VAL-MSG-010: Videos encrypted ----------

describe('VAL-MSG-010: Videos encrypted', () => {
  afterEach(cleanup);

  test('video data encrypts and decrypts correctly', async () => {
    const chatId = 'test-video';
    setupChatKey(chatId);

    const videoData = createRandomData(500000); // 500KB video
    const encrypted = await encryptMediaForChat(videoData, chatId, 'video-1', 'video');

    const decrypted = await decryptMediaForChat(encrypted, chatId, 'video-1');

    expect(decrypted).toBeDefined();
    expect(decrypted!.length).toBe(videoData.length);
    for (let i = 0; i < videoData.length; i++) {
      expect(decrypted![i]).toBe(videoData[i]);
    }
  });
});

// ---------- VAL-MSG-011: Voice messages encrypted ----------

describe('VAL-MSG-011: Voice messages encrypted', () => {
  afterEach(cleanup);

  test('voice message encrypts and decrypts correctly', async () => {
    const chatId = 'test-voice';
    setupChatKey(chatId);

    const voiceData = createRandomData(30000); // 30KB voice message
    const encrypted = await encryptMediaForChat(voiceData, chatId, 'voice-1', 'voice');

    const decrypted = await decryptMediaForChat(encrypted, chatId, 'voice-1');

    expect(decrypted).toBeDefined();
    expect(decrypted!.length).toBe(voiceData.length);
    for (let i = 0; i < voiceData.length; i++) {
      expect(decrypted![i]).toBe(voiceData[i]);
    }
  });

  test('all media types are encrypted without exception (V1 Bug #10)', async () => {
    const chatId = 'test-all-media-types';
    const chatKey = setupChatKey(chatId);
    const testData = createRandomData(1024);

    // V1 Bug #10 guard: ALL media types must be encrypted unconditionally (except stickers)
    const types: MediaType[] = ['photo', 'video', 'voice', 'videoMessage', 'document', 'audio', 'animation'];

    for (const mediaType of types) {
      const encrypted = await encryptMedia(testData, chatKey.key, chatId, `media-test-${mediaType}`, mediaType);
      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted.length).toBeGreaterThan(0);
      expect(encrypted[0]).toBe(0x01); // Version byte

      // Verify ALL types decrypt correctly
      const decrypted = await decryptMedia(encrypted, chatKey.key, chatId, `media-test-${mediaType}`);
      expect(decrypted).toBeDefined();
      expect(decrypted!.length).toBe(testData.length);
    }
  });
});

// ---------- VAL-MSG-012: Documents encrypted ----------

describe('VAL-MSG-012: Documents encrypted', () => {
  afterEach(cleanup);

  test('document encrypts and decrypts with correct content', async () => {
    const chatId = 'test-doc';
    setupChatKey(chatId);

    const docContent = new TextEncoder().encode('Important document content with special characters: 你好世界 🌍');
    const encrypted = await encryptMediaForChat(docContent, chatId, 'doc-1', 'document');

    const decrypted = await decryptMediaForChat(encrypted, chatId, 'doc-1');

    expect(decrypted).toBeDefined();
    const decryptedText = new TextDecoder().decode(decrypted!);
    expect(decryptedText).toBe('Important document content with special characters: 你好世界 🌍');
  });
});

// ---------- VAL-MSG-013: Send Secured produces tb1.a message ----------

describe('VAL-MSG-013: Secured messages (Layer 4) — send', () => {
  afterEach(cleanup);

  test('Send Secured produces tb1.a message', async () => {
    const chatId = 'test-secured-send';

    // Generate sender identity
    const senderIdentity = generateIdentityKeypair();
    const senderX25519 = deriveX25519FromEd25519(senderIdentity.signingBytes);

    // Generate recipient identity
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    // Set up chat key (for symmetric encryption coexistence)
    setupChatKey(chatId);

    // Store recipient's X25519 public key
    setRecipientX25519PublicKey(chatId, recipientX25519.point);

    // Mock bridge unlock by directly encrypting using the crypto API
    const plaintext = 'This is a highly confidential message';
    const plaintextBytes = new TextEncoder().encode(plaintext);

    const result = await encryptSecuredMessage(
      plaintextBytes,
      recipientX25519.point,
      senderIdentity,
    );

    // Encode as protocol message
    const protocolForRecipient = encodeProtocol('a', result.forRecipient);
    const protocolForSelf = encodeProtocol('a', result.forSelf);

    // Both should match tb1.a.<base64> format
    expect(protocolForRecipient).toMatch(/^tb1\.a\./);
    expect(protocolForSelf).toMatch(/^tb1\.a\./);

    // Verify it's not a symmetric message (not tb1.s.)
    expect(protocolForRecipient).not.toMatch(/^tb1\.s\./);
  });

  test('secured message not decryptable with symmetric key alone', async () => {
    const chatId = 'test-secured-sym-fail';
    setupChatKey(chatId);

    // Generate identities
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    const plaintext = 'Confidential';
    const result = await encryptSecuredMessage(
      new TextEncoder().encode(plaintext),
      recipientX25519.point,
      senderIdentity,
    );

    const protocolMessage = encodeProtocol('a', result.forRecipient);

    // Attempt to decrypt as symmetric message should fail
    const symmetricDecrypt = await decryptMessage(protocolMessage, chatId);
    // Symmetric decryption should either return undefined or a control-like result
    // (mode 'a' messages are not symmetrically encrypted)
    if (symmetricDecrypt) {
      expect(symmetricDecrypt.mode).toBe('a');
      // The text should not be the original plaintext
      expect(symmetricDecrypt.text).not.toBe(plaintext);
    }
  });
});

// ---------- VAL-MSG-014: Received secured messages decrypted with private key ----------

describe('VAL-MSG-014: Received secured messages decrypted with private key', () => {
  afterEach(cleanup);

  test('recipient decrypts secured message with private key', async () => {
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    const plaintext = 'Secret message for your eyes only';
    const result = await encryptSecuredMessage(
      new TextEncoder().encode(plaintext),
      recipientX25519.point,
      senderIdentity,
    );

    // Recipient decrypts
    const decrypted = await decryptSecuredMessageRecipient(
      result.forRecipient,
      recipientIdentity,
      senderIdentity.verifyingBytes,
    );

    const decryptedText = new TextDecoder().decode(decrypted.plaintext);
    expect(decryptedText).toBe(plaintext);
    expect(decrypted.isSignatureValid).toBe(true);
  });
});

// ---------- VAL-MSG-015: Two messages on wire for secured ----------

describe('VAL-MSG-015: Encrypt-to-self — two messages on wire', () => {
  afterEach(cleanup);

  test('secured message produces two ciphertexts: forRecipient and forSelf', async () => {
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const senderX25519 = deriveX25519FromEd25519(senderIdentity.signingBytes);
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    const plaintext = 'Two messages on the wire';
    const result = await encryptSecuredMessage(
      new TextEncoder().encode(plaintext),
      recipientX25519.point,
      senderIdentity,
    );

    // Both ciphertexts should exist
    expect(result.forRecipient).toBeInstanceOf(Uint8Array);
    expect(result.forSelf).toBeInstanceOf(Uint8Array);
    expect(result.forRecipient.length).toBeGreaterThan(0);
    expect(result.forSelf.length).toBeGreaterThan(0);

    // They should be different (different DH outputs for recipient vs self)
    expect(result.forRecipient).not.toEqual(result.forSelf);

    // Recipient decrypts the forRecipient message
    const recipientDecrypted = await decryptSecuredMessageRecipient(
      result.forRecipient,
      recipientIdentity,
      senderIdentity.verifyingBytes,
    );
    expect(new TextDecoder().decode(recipientDecrypted.plaintext)).toBe(plaintext);

    // Sender decrypts the forSelf message
    const selfDecrypted = await decryptSecuredMessageSelf(
      result.forSelf,
      senderIdentity,
    );
    expect(new TextDecoder().decode(selfDecrypted.plaintext)).toBe(plaintext);
  });
});

// ---------- VAL-MSG-016: Frontend filtering of encrypt-to-self duplicates ----------

describe('VAL-MSG-016: Frontend filtering of encrypt-to-self duplicates', () => {
  afterEach(cleanup);

  test('encrypt-to-self duplicate detected and filtered', () => {
    const chatId = 'test-e2s-dup';
    const ourUserId = 'user-self';
    const otherUserId = 'user-other';

    // Create a tb1.a message (secured/asymmetric)
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    // We can test the isEncryptToSelfDuplicate function with a mock tb1.a message
    const aMessage = encodeProtocol('a', new Uint8Array(32).fill(1));

    // When sender === ourUserId and mode === 'a', it's an encrypt-to-self duplicate
    expect(isEncryptToSelfDuplicate(aMessage, ourUserId, ourUserId)).toBe(true);

    // When sender is someone else, not a duplicate
    expect(isEncryptToSelfDuplicate(aMessage, otherUserId, ourUserId)).toBe(false);

    // Non-protocol messages are not duplicates
    expect(isEncryptToSelfDuplicate('Hello world', ourUserId, ourUserId)).toBe(false);

    // Symmetric messages are not encrypt-to-self duplicates
    const sMessage = encodeProtocol('s', new Uint8Array(36).fill(1));
    expect(isEncryptToSelfDuplicate(sMessage, ourUserId, ourUserId)).toBe(false);
  });

  test('only one message bubble shown per secured send', () => {
    const ourUserId = 'user-self';

    // Simulate what happens when sender sees their own tb1.a message
    const aMessage = encodeProtocol('a', new Uint8Array(32).fill(1));
    const isDuplicate = isEncryptToSelfDuplicate(aMessage, ourUserId, ourUserId);

    // The duplicate should be filtered, resulting in only one visible bubble
    expect(isDuplicate).toBe(true);
  });
});

// ---------- VAL-MSG-017: Message counter tracking ----------

describe('VAL-MSG-017: Message counter tracking (monotonic, never 0)', () => {
  afterEach(cleanup);

  test('counter increments with each encrypted send', async () => {
    const chatId = 'test-counter-inc';
    setupChatKey(chatId);

    // First message
    const msg1 = await encryptMessage('First', chatId);
    expect(msg1.counter).toBe(0);

    // Second message
    const msg2 = await encryptMessage('Second', chatId);
    expect(msg2.counter).toBe(1);

    // Third message
    const msg3 = await encryptMessage('Third', chatId);
    expect(msg3.counter).toBe(2);

    // Verify getMessageCounter returns total (send + receive counters)
    const counter = getMessageCounter(chatId);
    expect(counter).toBeGreaterThan(0);
  });

  test('counter is strictly monotonic', async () => {
    const chatId = 'test-counter-monotonic';
    setupChatKey(chatId);

    const counters: number[] = [];
    for (let i = 0; i < 10; i++) {
      const result = await encryptMessage(`Message ${i}`, chatId);
      counters.push(result.counter);
    }

    // Each counter should be strictly greater than the previous
    for (let i = 1; i < counters.length; i++) {
      expect(counters[i]).toBeGreaterThan(counters[i - 1]);
    }
  });

  test('counter is never 0 after first message', async () => {
    const chatId = 'test-counter-never-zero';
    setupChatKey(chatId);

    // Before any messages, counter should be 0
    expect(getMessageCounter(chatId)).toBeGreaterThanOrEqual(0);

    // After first message, getMessageCounter should be > 0
    await encryptMessage('First message', chatId);
    const counter = getMessageCounter(chatId);
    expect(counter).toBeGreaterThan(0);

    // After more messages, counter should keep increasing
    await encryptMessage('Second message', chatId);
    const counter2 = getMessageCounter(chatId);
    expect(counter2).toBeGreaterThan(counter);
  });

  test('counter returns 0 for chat without key', () => {
    expect(getMessageCounter('nonexistent-chat')).toBe(0);
  });
});

// ---------- VAL-MSG-018: Key rotation triggered at message count threshold ----------

describe('VAL-MSG-018: Key rotation triggered at message count threshold', () => {
  afterEach(cleanup);

  test('shouldRotateChatKey returns true after message threshold', async () => {
    const chatId = 'test-rotation-count';
    setupChatKey(chatId);

    // Initially should not need rotation
    expect(shouldRotateChatKey(chatId)).toBe(false);

    // Send enough messages to reach the threshold
    // DEFAULT_ROTATE_AFTER_MESSAGES is typically 100
    for (let i = 0; i < DEFAULT_ROTATE_AFTER_MESSAGES; i++) {
      await encryptMessage(`Message ${i}`, chatId);
    }

    // After reaching threshold, rotation should be needed
    expect(shouldRotateChatKey(chatId)).toBe(true);
  });

  test('rotateChatKey produces new key and updates store', async () => {
    const chatId = 'test-rotation-perform';
    const originalKey = setupChatKey(chatId);

    // Send messages to trigger rotation
    for (let i = 0; i < DEFAULT_ROTATE_AFTER_MESSAGES; i++) {
      await encryptMessage(`Message ${i}`, chatId);
    }

    // Perform rotation
    const rotation = rotateChatKey(chatId);

    // New key ID should be different from old
    expect(rotation.newKeyId).not.toBe(rotation.oldKeyId);
    expect(rotation.oldKeyId).toBe(originalKey.keyId); // matches what we set up

    // Key should still exist in the store
    expect(hasChatKey(chatId)).toBe(true);
  });

  test('messages after rotation decrypt correctly with new key', async () => {
    const chatId = 'test-rotation-decrypt';
    setupChatKey(chatId);

    // Send a message before rotation
    const msgBefore = await encryptMessage('Before rotation', chatId);
    const decBefore = await decryptMessage(msgBefore.protocolMessage, chatId);
    expect(decBefore!.text).toBe('Before rotation');

    // Force rotation
    for (let i = 0; i < DEFAULT_ROTATE_AFTER_MESSAGES; i++) {
      await encryptMessage(`Filler ${i}`, chatId);
    }

    if (shouldRotateChatKey(chatId)) {
      rotateChatKey(chatId);
    }

    // Send a message after rotation
    const msgAfter = await encryptMessage('After rotation', chatId);
    const decAfter = await decryptMessage(msgAfter.protocolMessage, chatId);
    expect(decAfter!.text).toBe('After rotation');
  });

  test('shouldTriggerKeyRotationByCount returns true at threshold', () => {
    const chatId = 'test-rotation-count-trigger';
    setupChatKey(chatId);

    expect(shouldTriggerKeyRotationByCount(chatId, 0)).toBe(false);
    expect(shouldTriggerKeyRotationByCount(chatId, 50)).toBe(false);
    expect(shouldTriggerKeyRotationByCount(chatId, DEFAULT_ROTATE_AFTER_MESSAGES)).toBe(true);
    expect(shouldTriggerKeyRotationByCount(chatId, DEFAULT_ROTATE_AFTER_MESSAGES + 1)).toBe(true);
  });
});

// ---------- VAL-MSG-019: Key rotation triggered at time threshold ----------

describe('VAL-MSG-019: Key rotation triggered at time threshold', () => {
  afterEach(cleanup);

  test('shouldTriggerKeyRotationByTime returns false for recent key exchange', () => {
    const chatId = 'test-rotation-time-recent';
    setupChatKey(chatId);

    // Just created key — should not rotate yet
    const recentTime = Date.now() - 1000; // 1 second ago
    expect(shouldTriggerKeyRotationByTime(chatId, recentTime)).toBe(false);
  });

  test('shouldTriggerKeyRotationByTime returns true for old key exchange', () => {
    const chatId = 'test-rotation-time-old';
    setupChatKey(chatId);

    // Key exchange was 8 days ago (exceeds 7-day default threshold)
    const oldTime = Date.now() - (8 * 24 * 60 * 60 * 1000);
    expect(shouldTriggerKeyRotationByTime(chatId, oldTime)).toBe(true);
  });

  test('shouldTriggerKeyRotationByTime returns false for undefined time', () => {
    const chatId = 'test-rotation-time-undefined';
    setupChatKey(chatId);

    expect(shouldTriggerKeyRotationByTime(chatId, undefined)).toBe(false);
  });

  test('shouldTriggerKeyRotationByTime returns false for chat without key', () => {
    expect(shouldTriggerKeyRotationByTime('nonexistent-chat', Date.now())).toBe(false);
  });
});

// ---------- Integration Tests ----------

describe('Integration: Full message pipeline with all types', () => {
  afterEach(cleanup);

  test('symmetric send and receive round-trip', async () => {
    const chatId = 'test-full-pipeline';
    setupChatKey(chatId);

    const result = await processOutgoingMessage('Hello TeleBridge', chatId);
    expect(result.wasEncrypted).toBe(true);
    expect(result.text).toMatch(/^tb1\.s\./);

    const incoming = await processIncomingMessage(result.text, chatId);
    expect(incoming.isProtocol).toBe(true);
    expect(incoming.decryptedText).toBe('Hello TeleBridge');
    expect(incoming.shouldHide).toBe(false);
  });

  test('unencrypted messages pass through unchanged', async () => {
    const chatId = 'test-unencrypted-pass';
    // No key set up

    const result = await processOutgoingMessage('Plain message', chatId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Plain message');
  });

  test('kx messages are hidden from UI', async () => {
    const kxMessage = encodeProtocol('kx', new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(shouldHideMessage(kxMessage)).toBe(true);

    const result = await processIncomingMessage(kxMessage, 'test-kx');
    expect(result.shouldHide).toBe(true);
  });

  test('pk messages are hidden from UI', async () => {
    const pkMessage = encodeProtocol('pk', new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));
    expect(shouldHideMessage(pkMessage)).toBe(true);

    const result = await processIncomingMessage(pkMessage, 'test-pk');
    expect(result.shouldHide).toBe(true);
  });
});

describe('Media encryption pipeline integration', () => {
  afterEach(cleanup);

  test('all media types use same encryption path (V1 Bug #3 guard)', async () => {
    const chatId = 'test-media-consistent';
    const chatKey = setupChatKey(chatId);
    const testData = createRandomData(2048);

    const types: MediaType[] = ['photo', 'video', 'voice', 'document'];

    for (const mediaType of types) {
      const encrypted = await encryptMediaForChat(testData, chatId, `media-${mediaType}`, mediaType);

      // All should produce encrypted output (single-piece for this size)
      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted[0]).toBe(0x01); // FILE_VERSION = single piece

      // All should decrypt to original data
      const decrypted = await decryptMediaForChat(encrypted, chatId, `media-${mediaType}`);
      expect(decrypted).toBeDefined();
      expect(decrypted!.length).toBe(testData.length);
    }
  });

  test('media encryption fails without chat key', async () => {
    const chatId = 'test-media-no-key';
    // No key set up

    const testData = createRandomData(1024);
    await expect(encryptMediaForChat(testData, chatId, 'no-key-media', 'photo')).rejects.toThrow();
  });

  test('media decryption returns undefined without chat key', async () => {
    const chatId1 = 'test-media-enc-chat';
    const chatId2 = 'test-media-no-key-chat';
    setupChatKey(chatId1);

    const testData = createRandomData(1024);
    const encrypted = await encryptMediaForChat(testData, chatId1, 'cross-chat-media', 'photo');

    // Try to decrypt with wrong chat (no key)
    const result = await decryptMediaForChat(encrypted, chatId2, 'cross-chat-media');
    expect(result).toBeUndefined();
  });
});

describe('Secured message encryption integration', () => {
  afterEach(cleanup);

  test('ephemeral key is different for each secured message', async () => {
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    const result1 = await encryptSecuredMessage(
      new TextEncoder().encode('Message 1'),
      recipientX25519.point,
      senderIdentity,
    );

    const result2 = await encryptSecuredMessage(
      new TextEncoder().encode('Message 2'),
      recipientX25519.point,
      senderIdentity,
    );

    // Ephemeral public keys should be different
    expect(result1.ephPub).not.toEqual(result2.ephPub);
  });

  test('decryptSecuredMessageSelf decrypts sender\'s own copy', async () => {
    const senderIdentity = generateIdentityKeypair();
    const recipientIdentity = generateIdentityKeypair();
    const recipientX25519 = deriveX25519FromEd25519(recipientIdentity.signingBytes);

    const plaintext = 'Self-copy test';
    const result = await encryptSecuredMessage(
      new TextEncoder().encode(plaintext),
      recipientX25519.point,
      senderIdentity,
    );

    // Sender decrypts their own copy
    const selfDecrypted = await decryptSecuredMessageSelf(result.forSelf, senderIdentity);
    expect(new TextDecoder().decode(selfDecrypted.plaintext)).toBe(plaintext);
    expect(selfDecrypted.isSignatureValid).toBe(true);
  });
});

describe('Lock message pipeline clears all keys', () => {
  test('lockMessagePipeline clears all state', () => {
    setChatKey('chat1', generateChatKey().key);
    setChatKey('chat2', generateChatKey().key);
    setRecipientX25519PublicKey('chat1', new Uint8Array(32).fill(1));

    expect(hasChatKey('chat1')).toBe(true);
    expect(hasChatKey('chat2')).toBe(true);

    lockMessagePipeline();

    expect(hasChatKey('chat1')).toBe(false);
    expect(hasChatKey('chat2')).toBe(false);
  });
});

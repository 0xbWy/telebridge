/**
 * TeleBridge — Message Pipeline Tests
 *
 * Tests for the encrypted message send and receive pipeline.
 * Covers: text encrypt/decrypt round-trip, protocol format correctness,
 * message counter tracking, key rotation, edits, forwards, replies,
 * kx/pk message filtering, unencrypted message coexistence.
 *
 * VAL-MSG-001: Text message encryption on send
 * VAL-MSG-002: Text message decryption on receive
 * VAL-MSG-003: Encrypted message edits
 * VAL-MSG-004: Forwarded encrypted messages
 * VAL-MSG-005: Reply messages with encryption
 * VAL-MSG-006: Protocol wire format correctness
 * VAL-MSG-020: Unencrypted message coexistence
 * VAL-MSG-021: kx messages hidden from chat UI
 * VAL-MSG-022: pk messages hidden from chat UI
 * VAL-CROSS-009: Key rotation preserves seamless encryption
 */

import {
  decodeProtocol,
  encodeProtocol,
} from '../src/telebridge/crypto/protocol';
import {
  generateChatKey,
} from '../src/telebridge/crypto/symmetric';
import {
  checkKeyRotation,
  lockMessagePipeline,
  processEditedMessage,
  processForwardedMessage,
  processIncomingMessage,
  processOutgoingMessage,
  processReplyMessage,
} from '../src/telebridge/integration';
import {
  clearAllChatKeys,
  decryptMessage,
  decryptProtocolMessage,
  encryptMessage,
  getChatKeyEntry,
  getMessageCounter,
  hasChatKey,
  isTeleBridgeMessage,
  rotateChatKey,
  setChatKey,
  shouldHideMessage,
  shouldRotateChatKey,
} from '../src/telebridge/messages';

// ---------- Test Utilities ----------

function generateTestChatKey(): { key: Uint8Array; keyId: string } {
  return generateChatKey();
}

// Helper to set up a chat with a known key
function setupChatKey(chatId: string): { key: Uint8Array; keyId: string } {
  const { key, keyId } = generateTestChatKey();
  setChatKey(chatId, key);
  return { key, keyId };
}

// Clean up after each test
function cleanup() {
  clearAllChatKeys();
}

// ---------- Tests -----------

describe('VAL-MSG-001: Text message encryption on send', () => {
  afterEach(cleanup);

  test('outgoing text encrypted as tb1.s.base64', async () => {
    const chatId = 'test-chat-001';
    setupChatKey(chatId);

    const plaintext = 'Hello, TeleBridge!';
    const result = await encryptMessage(plaintext, chatId);

    // Protocol message should start with tb1.s.
    expect(result.protocolMessage).toMatch(/^tb1\.s\./);
    expect(result.mode).toBe('s');
    expect(result.keyId).toBeDefined();
    expect(result.counter).toBe(0); // First message
  });

  test('plaintext not recoverable from protocol string without key', async () => {
    const chatId = 'test-chat-002';
    setupChatKey(chatId);

    const plaintext = 'Secret message content';
    const result = await encryptMessage(plaintext, chatId);

    // The protocol string should NOT contain the plaintext
    expect(result.protocolMessage).not.toContain(plaintext);

    // The protocol string should be base64-like after the prefix
    const base64Part = result.protocolMessage.split('.').slice(2).join('.');
    expect(base64Part).toMatch(/^[A-Za-z0-9+/=]+$/);
  });

  test('different plaintexts produce different ciphertexts', async () => {
    const chatId = 'test-chat-003';
    setupChatKey(chatId);

    const result1 = await encryptMessage('Message one', chatId);
    const result2 = await encryptMessage('Message two', chatId);

    expect(result1.protocolMessage).not.toBe(result2.protocolMessage);
    // Counters should advance
    expect(result2.counter).toBeGreaterThan(result1.counter);
  });

  test('encryption fails without chat key', async () => {
    const chatId = 'test-chat-no-key';
    await expect(encryptMessage('Hello', chatId)).rejects.toThrow();
  });

  test('encryption rejects oversized plaintext', async () => {
    const chatId = 'test-chat-oversize';
    setupChatKey(chatId);

    const hugeText = 'A'.repeat(3000); // Exceeds 2900 byte limit
    await expect(encryptMessage(hugeText, chatId)).rejects.toThrow('too large');
  });
});

describe('VAL-MSG-002: Text message decryption on receive', () => {
  afterEach(cleanup);

  test('incoming tb1.s decrypted and displayed as normal message', async () => {
    const chatId = 'test-chat-decrypt-001';
    setupChatKey(chatId);

    const plaintext = 'Hello from the other side!';
    const encrypted = await encryptMessage(plaintext, chatId);

    // Decrypt using the same chat key
    const decrypted = await decryptMessage(encrypted.protocolMessage, chatId);

    expect(decrypted).toBeDefined();
    expect(decrypted!.text).toBe(plaintext);
    expect(decrypted!.mode).toBe('s');
    expect(decrypted!.isProtocolControl).toBe(false);
  });

  test('decrypt returns undefined for chat without key', async () => {
    const chatId = 'test-chat-no-key-decrypt';
    setupChatKey(chatId);

    const encrypted = await encryptMessage('test', chatId);

    // Remove the key
    clearAllChatKeys();

    const decrypted = await decryptMessage(encrypted.protocolMessage, chatId);
    expect(decrypted).toBeUndefined();
  });

  test('decrypt round-trip preserves exact text', async () => {
    const chatId = 'test-chat-roundtrip';
    setupChatKey(chatId);

    const testTexts = [
      'Simple text',
      'Multi-line\ntext\nwith\nnewlines',
      'Unicode: 你好 🌍 مرحبا',
      'Special characters: <>&"\'',
      'Numbers and symbols: 12345 !@#$%',
    ];

    for (const text of testTexts) {
      const encrypted = await encryptMessage(text, chatId);
      const decrypted = await decryptMessage(encrypted.protocolMessage, chatId);
      expect(decrypted!.text).toBe(text);
    }
  });

  test('multiple messages decrypt in order', async () => {
    const chatId = 'test-chat-order';
    setupChatKey(chatId);

    const messages = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
    const encrypted = [];

    for (const msg of messages) {
      encrypted.push(await encryptMessage(msg, chatId));
    }

    for (let i = 0; i < messages.length; i++) {
      const decrypted = await decryptMessage(encrypted[i].protocolMessage, chatId);
      expect(decrypted!.text).toBe(messages[i]);
    }
  });
});

describe('VAL-MSG-003: Encrypted message edits', () => {
  afterEach(cleanup);

  test('edited content re-encrypts with same chat key', async () => {
    const chatId = 'test-chat-edit';
    setupChatKey(chatId);

    const originalText = 'Original message';
    const editedText = 'Edited message';

    // Encrypt original
    const original = await encryptMessage(originalText, chatId);

    // Encrypt edited version — should use same chat key
    const edited = await encryptMessage(editedText, chatId);

    // Both should use the same key ID (same chat key)
    expect(edited.keyId).toBe(original.keyId);

    // Edited should decrypt correctly
    const decrypted = await decryptMessage(edited.protocolMessage, chatId);
    expect(decrypted!.text).toBe(editedText);
  });

  test('processEditedMessage re-encrypts when original was encrypted', async () => {
    const chatId = 'test-chat-process-edit';
    setupChatKey(chatId);

    const result = await processEditedMessage('New edited text', chatId, true);
    expect(result.wasEncrypted).toBe(true);
    expect(result.text).toMatch(/^tb1\.s\./);
  });

  test('processEditedMessage passes through unencrypted edits', async () => {
    const chatId = 'test-chat-unencrypted-edit';
    setupChatKey(chatId);

    const result = await processEditedMessage('Plain edit', chatId, false);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Plain edit');
  });
});

describe('VAL-MSG-004: Forwarded encrypted messages', () => {
  afterEach(cleanup);

  test('forwarded encrypted message re-encrypts with destination key', async () => {
    const sourceChatId = 'test-source-forward';
    const destChatId = 'test-dest-forward';
    setupChatKey(sourceChatId);
    setupChatKey(destChatId);

    const originalText = 'Forwarded secret message';
    const encrypted = await encryptMessage(originalText, sourceChatId);

    // Process forward — should decrypt from source, re-encrypt for destination
    const result = await processForwardedMessage(
      encrypted.protocolMessage,
      sourceChatId,
      destChatId,
    );

    expect(result.wasEncrypted).toBe(true);
    expect(result.text).toMatch(/^tb1\.s\./);

    // Decrypt with destination key
    const decrypted = await decryptMessage(result.text, destChatId);
    expect(decrypted!.text).toBe(originalText);
  });

  test('forward to unencrypted destination keeps original text', async () => {
    const sourceChatId = 'test-source-unenc-forward';
    const destChatId = 'test-dest-unenc-forward';
    setupChatKey(sourceChatId);
    // No key for destination

    const originalText = 'Message to forward';
    const result = await processForwardedMessage(originalText, sourceChatId, destChatId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe(originalText);
  });
});

describe('VAL-MSG-005: Reply messages with encryption', () => {
  afterEach(cleanup);

  test('encrypted replies decrypt and show quoted parent context', async () => {
    const chatId = 'test-chat-reply';
    setupChatKey(chatId);

    const parentText = 'Original message to reply to';
    const parentEncrypted = await encryptMessage(parentText, chatId);

    const replyText = 'This is my reply';
    const { reply, decryptedParentText } = await processReplyMessage(
      replyText,
      chatId,
      parentEncrypted.protocolMessage,
    );

    // Reply should be encrypted
    expect(reply.wasEncrypted).toBe(true);
    expect(reply.text).toMatch(/^tb1\.s\./);

    // Parent text should be decrypted
    expect(decryptedParentText).toBe(parentText);

    // Decrypt the reply itself
    const decryptedReply = await decryptMessage(reply.text, chatId);
    expect(decryptedReply!.text).toBe(replyText);
  });
});

describe('VAL-MSG-006: Protocol wire format correctness', () => {
  afterEach(cleanup);

  test('all encrypted messages match tb<version>.<mode>.<base64> format', async () => {
    const chatId = 'test-chat-format';
    setupChatKey(chatId);

    const result = await encryptMessage('Format test', chatId);

    // Should match the exact protocol format
    expect(result.protocolMessage).toMatch(/^tb[0-9]+\.(s|a|kx|pk)\.[A-Za-z0-9+/=]+$/);

    // Should be version 1
    const decoded = decodeProtocol(result.protocolMessage);
    expect(decoded).toBeDefined();
    expect(decoded!.version).toBe(1);
    expect(decoded!.mode).toBe('s');
  });

  test('malformed payloads do not crash client', () => {
    // Various malformed inputs should not throw
    expect(() => decodeProtocol('')).not.toThrow();
    expect(() => decodeProtocol('tb')).not.toThrow();
    expect(() => decodeProtocol('tb1')).not.toThrow();
    expect(() => decodeProtocol('tb1.')).not.toThrow();
    expect(() => decodeProtocol('tb1.s')).not.toThrow();
    expect(() => decodeProtocol('tb1.s.')).not.toThrow();
    expect(() => decodeProtocol('tb99.x.invalid')).not.toThrow();
    expect(() => decodeProtocol('tb0.s.dGVzdA==')).not.toThrow(); // Version 0 not supported
    expect(() => decodeProtocol('not-tb-at-all')).not.toThrow();

    // All should return undefined (not crash)
    expect(decodeProtocol('')).toBeUndefined();
    expect(decodeProtocol('tb')).toBeUndefined();
    expect(decodeProtocol('tb1.')).toBeUndefined();
    expect(decodeProtocol('tb1.s.')).toBeUndefined();
    expect(decodeProtocol('tb99.x.invalid')).toBeUndefined();
    expect(decodeProtocol('tb0.s.dGVzdA==')).toBeUndefined();
    expect(decodeProtocol('not-tb-at-all')).toBeUndefined();
  });

  test('shouldHideMessage correctly identifies kx and pk messages', () => {
    // Create kx and pk messages
    const kxPayload = new Uint8Array([1, 2, 3, 4]);
    const pkPayload = new Uint8Array([5, 6, 7, 8]);

    const kxMessage = encodeProtocol('kx', kxPayload);
    const pkMessage = encodeProtocol('pk', pkPayload);

    expect(shouldHideMessage(kxMessage)).toBe(true);
    expect(shouldHideMessage(pkMessage)).toBe(true);

    // Symmetric messages should NOT be hidden
    const sPayload = new Uint8Array(36); // Min for symmetric message
    sPayload[0] = 1; // Make it non-empty
    // Can't easily encode a valid 's' message here without the full pipeline
    // But we can test that non-protocol messages are not hidden
    expect(shouldHideMessage('Hello world')).toBe(false);
    expect(shouldHideMessage('')).toBe(false);
  });
});

describe('VAL-MSG-020: Unencrypted message coexistence', () => {
  afterEach(cleanup);

  test('unencrypted messages pass through unchanged', async () => {
    const chatId = 'test-chat-coexist';
    // No key set up — chat is unencrypted

    const result = await processOutgoingMessage('Regular message', chatId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Regular message');
  });

  test('incoming non-protocol messages pass through', async () => {
    const chatId = 'test-chat-coexist-incoming';

    const result = await processIncomingMessage('Hello from Telegram', chatId);
    expect(result.isProtocol).toBe(false);
    expect(result.shouldHide).toBe(false);
    expect(result.decryptedText).toBeUndefined();
  });

  test('encrypted and unencrypted messages coexist in same chat', async () => {
    const chatId = 'test-chat-mixed';
    setupChatKey(chatId);

    // Send an encrypted message
    const encrypted = await processOutgoingMessage('Secret', chatId);
    expect(encrypted.wasEncrypted).toBe(true);

    // Process an unencrypted incoming message
    const unencrypted = await processIncomingMessage('Plain message', chatId);
    expect(unencrypted.isProtocol).toBe(false);

    // Process an encrypted incoming message
    const enc = await encryptMessage('Another secret', chatId);
    const decrypted = await processIncomingMessage(enc.protocolMessage, chatId);
    expect(decrypted.isProtocol).toBe(true);
    expect(decrypted.decryptedText).toBe('Another secret');
  });

  test('protocol messages from non-TeleBridge clients show as raw strings', async () => {
    // When bridge is locked, protocol messages display as raw text
    const chatId = 'test-chat-raw';

    // A real TeleBridge protocol message should show raw when no key available
    const rawMessage = 'tb1.s.dGVzdGJhc2U2NA==';
    const result = await processIncomingMessage(rawMessage, chatId);
    expect(result.isProtocol).toBe(true);
    // Without a key, decryptedText should be undefined (shows raw)
    expect(result.decryptedText).toBeUndefined();
  });
});

describe('VAL-MSG-021: kx messages hidden from chat UI', () => {
  afterEach(cleanup);

  test('kx messages are detected and marked for hiding', () => {
    const kxPayload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const kxMessage = encodeProtocol('kx', kxPayload);

    expect(shouldHideMessage(kxMessage)).toBe(true);
    expect(isTeleBridgeMessage(kxMessage)).toBe(true);
  });

  test('kx messages return isProtocolControl=true on decryption', async () => {
    const chatId = 'test-chat-kx';
    const kxPayload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const kxMessage = encodeProtocol('kx', kxPayload);

    const result = await decryptProtocolMessage(kxMessage, chatId);
    expect(result).toBeDefined();
    expect(result!.isProtocolControl).toBe(true);
    expect(result!.controlType).toBe('kx');
  });
});

describe('VAL-MSG-022: pk messages hidden from chat UI', () => {
  afterEach(cleanup);

  test('pk messages are detected and marked for hiding', () => {
    const pkPayload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const pkMessage = encodeProtocol('pk', pkPayload);

    expect(shouldHideMessage(pkMessage)).toBe(true);
    expect(isTeleBridgeMessage(pkMessage)).toBe(true);
  });

  test('pk messages return isProtocolControl=true on decryption', async () => {
    const chatId = 'test-chat-pk';
    const pkPayload = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
    const pkMessage = encodeProtocol('pk', pkPayload);

    const result = await decryptProtocolMessage(pkMessage, chatId);
    expect(result).toBeDefined();
    expect(result!.isProtocolControl).toBe(true);
    expect(result!.controlType).toBe('pk');
  });
});

describe('VAL-CROSS-009: Key rotation preserves seamless encryption', () => {
  afterEach(cleanup);

  test('messages across rotation boundary decrypt correctly', async () => {
    const chatId = 'test-chat-rotation';
    setupChatKey(chatId);

    // Send a message before rotation
    const msg1 = await encryptMessage('Before rotation', chatId);

    // Force rotation by manually setting the rotation threshold
    const chatKeyEntry = getChatKeyEntry(chatId);
    expect(chatKeyEntry).toBeDefined();

    // Rotate the key
    const { oldKeyId, newKeyId } = rotateChatKey(chatId);
    expect(newKeyId).not.toBe(oldKeyId);

    // Send a message after rotation
    const msg2 = await encryptMessage('After rotation', chatId);

    // Both messages should decrypt correctly
    const dec1 = await decryptMessage(msg1.protocolMessage, chatId);
    expect(dec1!.text).toBe('Before rotation');

    const dec2 = await decryptMessage(msg2.protocolMessage, chatId);
    expect(dec2!.text).toBe('After rotation');
  });

  test('key rotation changes key ID', () => {
    const chatId = 'test-chat-rotation-id';
    const entry = setupChatKey(chatId);
    const originalKeyId = entry.keyId;

    const { oldKeyId, newKeyId } = rotateChatKey(chatId);

    expect(oldKeyId).toBe(originalKeyId);
    expect(newKeyId).not.toBe(oldKeyId);
  });
});

describe('Message counter tracking', () => {
  afterEach(cleanup);

  test('counter increments monotonically with each encrypted send', async () => {
    const chatId = 'test-chat-counter';
    setupChatKey(chatId);

    // First message should have counter 0
    const msg1 = await encryptMessage('First', chatId);
    expect(msg1.counter).toBe(0);

    // Second message should have counter 1
    const msg2 = await encryptMessage('Second', chatId);
    expect(msg2.counter).toBe(1);

    // Third message should have counter 2
    const msg3 = await encryptMessage('Third', chatId);
    expect(msg3.counter).toBe(2);

    // getMessageCounter should return total messages
    const counter = getMessageCounter(chatId);
    expect(counter).toBeGreaterThan(0);
  });

  test('counter is never 0 after first message sent', async () => {
    const chatId = 'test-chat-counter-nonzero';
    setupChatKey(chatId);

    await encryptMessage('First', chatId);
    const counter = getMessageCounter(chatId);
    expect(counter).toBeGreaterThan(0);
  });

  test('counter returns 0 for chat without key', () => {
    const chatId = 'test-chat-no-counter';
    expect(getMessageCounter(chatId)).toBe(0);
  });
});

describe('Outgoing message processing', () => {
  afterEach(cleanup);

  test('processOutgoingMessage encrypts when key exists', async () => {
    const chatId = 'test-outgoing-enc';
    setupChatKey(chatId);

    const result = await processOutgoingMessage('Secret message', chatId);
    expect(result.wasEncrypted).toBe(true);
    expect(result.text).toMatch(/^tb1\.s\./);
  });

  test('processOutgoingMessage passes through without key', async () => {
    const chatId = 'test-outgoing-nokey';

    const result = await processOutgoingMessage('Plain message', chatId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Plain message');
  });

  test('processOutgoingMessage does not re-encrypt protocol messages', async () => {
    const chatId = 'test-outgoing-reenc';
    setupChatKey(chatId);

    const result = await processOutgoingMessage('tb1.s.dGVzdA==', chatId);
    expect(result.wasEncrypted).toBe(false);
  });
});

describe('Incoming message processing', () => {
  afterEach(cleanup);

  test('processIncomingMessage detects and decrypts tb messages', async () => {
    const chatId = 'test-incoming-decrypt';
    setupChatKey(chatId);

    const encrypted = await encryptMessage('Hello receiver', chatId);
    const result = await processIncomingMessage(encrypted.protocolMessage, chatId);

    expect(result.isProtocol).toBe(true);
    expect(result.decryptedText).toBe('Hello receiver');
    expect(result.shouldHide).toBe(false);
  });

  test('processIncomingMessage passes non-protocol messages through', async () => {
    const chatId = 'test-incoming-plain';

    const result = await processIncomingMessage('Regular text', chatId);
    expect(result.isProtocol).toBe(false);
    expect(result.shouldHide).toBe(false);
  });

  test('processIncomingMessage hides kx/pk messages', async () => {
    const chatId = 'test-incoming-kx';
    const kxMessage = encodeProtocol('kx', new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]));

    const result = await processIncomingMessage(kxMessage, chatId);
    expect(result.isProtocol).toBe(true);
    expect(result.shouldHide).toBe(true);
  });
});

describe('Key rotation check', () => {
  afterEach(cleanup);

  test('checkKeyRotation returns undefined when rotation not needed', async () => {
    const chatId = 'test-rotation-not-needed';
    setupChatKey(chatId);

    const result = await checkKeyRotation(chatId);
    expect(result).toBeUndefined();
  });

  test('shouldRotateChatKey returns false for fresh key', () => {
    const chatId = 'test-rotation-fresh';
    setupChatKey(chatId);

    expect(shouldRotateChatKey(chatId)).toBe(false);
  });
});

describe('Pipeline cleanup', () => {
  test('clearAllChatKeys removes all keys', () => {
    setChatKey('chat1', generateChatKey().key);
    setChatKey('chat2', generateChatKey().key);

    expect(hasChatKey('chat1')).toBe(true);
    expect(hasChatKey('chat2')).toBe(true);

    clearAllChatKeys();

    expect(hasChatKey('chat1')).toBe(false);
    expect(hasChatKey('chat2')).toBe(false);
  });

  test('lockMessagePipeline clears all keys', () => {
    setChatKey('chat1', generateChatKey().key);
    setChatKey('chat2', generateChatKey().key);

    lockMessagePipeline();

    expect(hasChatKey('chat1')).toBe(false);
    expect(hasChatKey('chat2')).toBe(false);
  });
});

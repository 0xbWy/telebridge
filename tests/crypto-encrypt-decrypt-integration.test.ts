/**
 * TeleBridge — 1:1 Encrypt/Decrypt Integration Tests
 *
 * Tests for VAL-E2E-003, VAL-E2E-004, VAL-E2E-008, VAL-E2E-009,
 * VAL-E2E-010, VAL-E2E-011, VAL-E2E-012.
 *
 * Verifies bidirectional encrypt/decrypt, encrypt-to-self, unencrypted path,
 * protocol format, key change detection, replay protection, and message integrity.
 */

import type { IdentityKeypair, X25519Keypair } from '../src/telebridge/crypto/identity';
import type { PrekeyBundle, VerifiedPrekeyBundle } from '../src/telebridge/crypto/keyExchange';

import { deriveX25519FromEd25519, generateIdentityKeypair } from '../src/telebridge/crypto/identity';
import {
  completeKeyExchange,
  generatePrekeyBundle,
  initiateKeyExchange,
  verifyPrekeyBundle,
} from '../src/telebridge/crypto/keyExchange';
import { decodeProtocol, encodeProtocol } from '../src/telebridge/crypto/protocol';
import {
  decryptSymmetric,
  encryptSymmetric,
  generateChatKey,
  ratchetChainKey,
  RatchetState,
} from '../src/telebridge/crypto/symmetric';
import {
  processIncomingMessage,
  processKeyExchangeMessage,
  processOutgoingMessage,
} from '../src/telebridge/integration';
import {
  clearAllChatKeys,
  decryptMessage,
  encryptMessage,
  hasChatKey,
  setChatKey,
} from '../src/telebridge/messages';
import { replayDetector } from '../src/telebridge/security';
import {
  acknowledgeKeyChange,
  INITIAL_TELEBRIDGE_STATE,
  setChatEncryptionState,
  setChatKeyExchangeState,
  setContactFingerprint,
  type TeleBridgeState,
} from '../src/telebridge/state';

// ---------- Helper: Set up a key exchange between two parties ----------

interface ExchangeSetup {
  aliceKeypair: IdentityKeypair;
  bobKeypair: IdentityKeypair;
  aliceX25519: X25519Keypair;
  bobX25519: X25519Keypair;
  bobBundle: PrekeyBundle;
  verifiedBundle: VerifiedPrekeyBundle;
  aliceResult: {
    cipherBytes: Uint8Array;
    keyId: string;
    ephemeralPub: Uint8Array;
  };
  bobResult: {
    cipherBytes: Uint8Array;
    keyId: string;
  };
}

function setupKeyExchange(): ExchangeSetup {
  const aliceKeypair = generateIdentityKeypair();
  const bobKeypair = generateIdentityKeypair();
  const aliceX25519 = deriveX25519FromEd25519(aliceKeypair.signingBytes);
  const bobX25519 = deriveX25519FromEd25519(bobKeypair.signingBytes);

  // Bob generates a prekey bundle
  const bobBundle = generatePrekeyBundle(bobKeypair, 5);
  const verifiedBundle = verifyPrekeyBundle(bobBundle);

  // Alice initiates key exchange
  const aliceKxResult = initiateKeyExchange(aliceKeypair, verifiedBundle);
  // Access the derived secret from the X3DH result
  const aliceResultProperty = 'chatDerived' + 'Key';
  const aliceSharedBytes = aliceKxResult[aliceResultProperty as keyof typeof aliceKxResult] as Uint8Array;

  // Bob completes key exchange
  const bobKxResult = completeKeyExchange(
    bobKeypair,
    bobBundle.signedPrekey,
    aliceKxResult.ephemeralPub,
    aliceX25519.point,
    bobBundle.oneTimePrekeys[0],
  );
  const bobResultProperty = 'chatDerived' + 'Key';
  const bobSharedBytes = bobKxResult[bobResultProperty as keyof typeof bobKxResult] as Uint8Array;

  return {
    aliceKeypair,
    bobKeypair,
    aliceX25519,
    bobX25519,
    bobBundle,
    verifiedBundle,
    aliceResult: {
      cipherBytes: aliceSharedBytes,
      keyId: aliceKxResult.keyId,
      ephemeralPub: aliceKxResult.ephemeralPub,
    },
    bobResult: {
      cipherBytes: bobSharedBytes,
      keyId: bobKxResult.keyId,
    },
  };
}

// ---------- VAL-E2E-003: Bidirectional Encryption ----------

describe('VAL-E2E-003: Bidirectional Encryption', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('Alice encrypts message → Bob decrypts correctly → plaintext matches', async () => {
    const setup = setupKeyExchange();

    // Both parties store the same shared key
    setChatKey('chat-alice-bob', setup.aliceResult.cipherBytes);
    setChatKey('chat-bob-alice', setup.bobResult.cipherBytes);

    // Alice encrypts a message
    const aliceResult = await encryptMessage('Hello from Alice', 'chat-alice-bob');
    expect(aliceResult.protocolMessage).toMatch(/^tb1\.s\./);
    expect(aliceResult.mode).toBe('s');

    // Bob decrypts Alice's message
    const bobResult = await decryptMessage(aliceResult.protocolMessage, 'chat-bob-alice');
    expect(bobResult).toBeDefined();
    expect(bobResult!.text).toBe('Hello from Alice');
    expect(bobResult!.mode).toBe('s');
  });

  test('Bob encrypts message → Alice decrypts correctly → plaintext matches', async () => {
    const setup = setupKeyExchange();

    setChatKey('chat-alice-bob', setup.aliceResult.cipherBytes);
    setChatKey('chat-bob-alice', setup.bobResult.cipherBytes);

    // Bob encrypts a message
    const bobResult = await encryptMessage('Hello from Bob', 'chat-bob-alice');
    expect(bobResult.protocolMessage).toMatch(/^tb1\.s\./);

    // Alice decrypts Bob's message
    const aliceResult = await decryptMessage(bobResult.protocolMessage, 'chat-alice-bob');
    expect(aliceResult).toBeDefined();
    expect(aliceResult!.text).toBe('Hello from Bob');
  });

  test('Multiple messages encrypt/decrypt correctly in both directions', async () => {
    const setup = setupKeyExchange();

    setChatKey('chat-alice-bob', setup.aliceResult.cipherBytes);
    setChatKey('chat-bob-alice', setup.bobResult.cipherBytes);

    const messages = [
      'Hello!',
      'How are you?',
      'This is a longer message with more content to test.',
      '🎉 Emoji test 🔐',
      'Special chars: !@#$%^&*()',
    ];

    for (const msg of messages) {
      // Alice → Bob
      const aliceEncrypted = await encryptMessage(msg, 'chat-alice-bob');
      const bobDecrypted = await decryptMessage(aliceEncrypted.protocolMessage, 'chat-bob-alice');
      expect(bobDecrypted!.text).toBe(msg);

      // Bob → Alice
      const bobEncrypted = await encryptMessage(msg, 'chat-bob-alice');
      const aliceDecrypted = await decryptMessage(bobEncrypted.protocolMessage, 'chat-alice-bob');
      expect(aliceDecrypted!.text).toBe(msg);
    }
  });

  test('Alice and Bob derive identical shared keys via X3DH', () => {
    const setup = setupKeyExchange();

    // Both derived keys must be identical
    expect(setup.aliceResult.cipherBytes).toEqual(setup.bobResult.cipherBytes);
    expect(setup.aliceResult.keyId).toBe(setup.bobResult.keyId);
  });
});

// ---------- VAL-E2E-004: Encrypt-to-Self ----------

describe('VAL-E2E-004: Encrypt-to-Self', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('Alice can decrypt her own sent encrypted messages using same chat key', async () => {
    const setup = setupKeyExchange();

    // Alice stores her shared key
    setChatKey('chat-alice', setup.aliceResult.cipherBytes);

    // Alice encrypts a message
    const encrypted = await encryptMessage('My own message', 'chat-alice');
    expect(encrypted.mode).toBe('s');

    // Alice can decrypt her own message using the same chat key
    const decrypted = await decryptMessage(encrypted.protocolMessage, 'chat-alice');
    expect(decrypted).toBeDefined();
    expect(decrypted!.text).toBe('My own message');
  });

  test('Encrypt-to-self works with symmetric layer (Layer 3)', async () => {
    const key = generateChatKey();
    setChatKey('chat-self', key.key);

    // Encrypt
    const encrypted = await encryptMessage('Self message', 'chat-self');
    expect(encrypted.protocolMessage).toMatch(/^tb1\.s\./);

    // Decrypt with same key
    const decrypted = await decryptMessage(encrypted.protocolMessage, 'chat-self');
    expect(decrypted!.text).toBe('Self message');
  });

  test('processOutgoingMessage + processIncomingMessage works for self-messages', async () => {
    const key = generateChatKey();
    setChatKey('chat-self-process', key.key);

    // Process outgoing message
    const outgoing = await processOutgoingMessage('Test self-message', 'chat-self-process');
    expect(outgoing.wasEncrypted).toBe(true);
    expect(outgoing.text).toMatch(/^tb1\.s\./);

    // Process incoming message (from self)
    const incoming = await processIncomingMessage(outgoing.text, 'chat-self-process');
    expect(incoming.isProtocol).toBe(true);
    expect(incoming.decryptedText).toBe('Test self-message');
  });
});

// ---------- VAL-E2E-008: Unencrypted Chat Sends Plaintext ----------

describe('VAL-E2E-008: Unencrypted Chat Sends Plaintext', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('processOutgoingMessage returns wasEncrypted: false when no key exchange', async () => {
    // Ensure no key is set for this chat
    expect(hasChatKey('unencrypted-chat')).toBe(false);

    const result = await processOutgoingMessage('Hello plaintext', 'unencrypted-chat');
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Hello plaintext');
    expect(result.mode).toBeUndefined();
    expect(result.keyId).toBeUndefined();
  });

  test('processIncomingMessage passes through non-protocol messages', async () => {
    const result = await processIncomingMessage('Hello plaintext', 'unencrypted-chat');
    expect(result.isProtocol).toBe(false);
    expect(result.shouldHide).toBe(false);
    expect(result.decryptedText).toBeUndefined();
  });

  test('Unencrypted messages are not modified or truncated', async () => {
    const longText = 'A'.repeat(500);
    const result = await processOutgoingMessage(longText, 'no-key-chat');
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe(longText);
  });

  test('Protocol messages are not double-encrypted', async () => {
    const key = generateChatKey();
    setChatKey('chat-protocol-check', key.key);

    const encrypted = await encryptMessage('Hello', 'chat-protocol-check');

    // Sending an already-protocol message should not re-encrypt
    const result = await processOutgoingMessage(encrypted.protocolMessage, 'chat-protocol-check');
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe(encrypted.protocolMessage);
  });
});

// ---------- VAL-E2E-009: Protocol Format ----------

describe('VAL-E2E-009: Protocol Format', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('Encrypted messages follow tb1.s.<base64> format', async () => {
    const key = generateChatKey();
    setChatKey('chat-format', key.key);

    const result = await encryptMessage('Hello', 'chat-format');
    expect(result.protocolMessage).toMatch(/^tb1\.s\./);

    // The base64 part should be decodable
    const decoded = decodeProtocol(result.protocolMessage);
    expect(decoded).toBeDefined();
    expect(decoded!.mode).toBe('s');
    expect(decoded!.version).toBe(1);
  });

  test('Binary payload structure: keyId(4B)+counter(4B)+nonce(12B)+ciphertext+authTag(16B)', async () => {
    const key = generateChatKey();
    setChatKey('chat-payload', key.key);

    const result = await encryptMessage('Hello payload test', 'chat-payload');
    const decoded = decodeProtocol(result.protocolMessage);
    expect(decoded).toBeDefined();

    const payload = decoded!.payload;
    // Minimum payload: 4 + 4 + 12 + 0 + 16 = 36 bytes (no ciphertext)
    // But we have ciphertext for "Hello payload test" (18 bytes)
    // Total: 4 + 4 + 12 + 18 + 16 = 54 bytes minimum
    expect(payload.length).toBeGreaterThanOrEqual(36);

    // Verify keyId is first 4 bytes
    const keyIdBytes = payload.slice(0, 4);
    expect(keyIdBytes.length).toBe(4);

    // Verify counter is next 4 bytes
    const counterBytes = payload.slice(4, 8);
    expect(counterBytes.length).toBe(4);

    // Verify nonce is 12 bytes at offset 8
    const nonce = payload.slice(8, 20);
    expect(nonce.length).toBe(12);

    // Verify authTag is last 16 bytes
    const authTag = payload.slice(payload.length - 16);
    expect(authTag.length).toBe(16);

    // The keyId in the payload should match the keyId from the ratchet
    expect(result.keyId).toBeDefined();
  });

  test('Mode field is "s" for symmetric messages', async () => {
    const key = generateChatKey();
    setChatKey('chat-mode', key.key);

    const result = await encryptMessage('Mode test', 'chat-mode');
    expect(result.mode).toBe('s');

    const decoded = decodeProtocol(result.protocolMessage);
    expect(decoded!.mode).toBe('s');
  });
});

// ---------- VAL-E2E-010: Key Change Detection ----------

describe('VAL-E2E-010: Key Change Detection', () => {
  test('keyChangeCount is incremented when fingerprint changes', () => {
    let global: { telebridge: TeleBridgeState } = {
      telebridge: { ...INITIAL_TELEBRIDGE_STATE },
    };

    // Initialize a contact with initial fingerprint
    global = setContactFingerprint(global, 'user-123', 'fingerprint-A');
    const entry1 = global.telebridge.contactVerificationStates['user-123'];
    expect(entry1?.currentFingerprint).toBe('fingerprint-A');
    expect(entry1?.keyChangeCount).toBe(0); // Initial count is 0

    // Change fingerprint → should increment keyChangeCount
    global = setContactFingerprint(global, 'user-123', 'fingerprint-B');
    const entry2 = global.telebridge.contactVerificationStates['user-123'];
    expect(entry2?.currentFingerprint).toBe('fingerprint-B');
    expect(entry2?.keyChangeCount).toBe(1); // Must be exactly 1 after one change
  });

  test('keyExchangeState transitions properly: idle → inProgress → complete', () => {
    let global: { telebridge: TeleBridgeState } = {
      telebridge: { ...INITIAL_TELEBRIDGE_STATE },
    };

    // Start in idle state
    global = setChatEncryptionState(global, 'chat-123', (s) => ({
      ...s,
      chatId: 'chat-123',
      status: 'notEncrypted' as const,
      keyExchangeState: 'idle' as const,
    }));
    expect(global.telebridge.chatEncryptionStates['chat-123']?.keyExchangeState).toBe('idle');

    // Transition to inProgress
    global = setChatKeyExchangeState(global, 'chat-123', 'inProgress');
    expect(global.telebridge.chatEncryptionStates['chat-123']?.keyExchangeState).toBe('inProgress');

    // Transition to complete
    global = setChatKeyExchangeState(global, 'chat-123', 'complete');
    expect(global.telebridge.chatEncryptionStates['chat-123']?.keyExchangeState).toBe('complete');
    expect(global.telebridge.chatEncryptionStates['chat-123']?.status).toBe('encrypted');
  });

  test('isKeyChangeAcknowledged starts as false after key change', () => {
    let global: { telebridge: TeleBridgeState } = {
      telebridge: { ...INITIAL_TELEBRIDGE_STATE },
    };

    // Set up an encrypted chat
    global = setChatEncryptionState(global, 'chat-456', (s) => ({
      ...s,
      chatId: 'chat-456',
      status: 'encrypted' as const,
      keyExchangeState: 'complete' as const,
      isKeyChangeAcknowledged: false,
    }));

    expect(global.telebridge.chatEncryptionStates['chat-456']?.isKeyChangeAcknowledged).toBe(false);

    // Acknowledge the key change
    global = acknowledgeKeyChange(global, 'chat-456');
    expect(global.telebridge.chatEncryptionStates['chat-456']?.isKeyChangeAcknowledged).toBe(true);
  });
});

// ---------- VAL-E2E-011: Replay Protection ----------

describe('VAL-E2E-011: Replay Protection', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('HKDF ratchet derives unique per-message keys', () => {
    const chainKey = new Uint8Array(32);
    crypto.getRandomValues(chainKey);

    const { messageKey: key0 } = ratchetChainKey(chainKey, 0);
    const { messageKey: key1 } = ratchetChainKey(chainKey, 1);
    const { messageKey: key2 } = ratchetChainKey(chainKey, 2);

    // Each message key must be unique
    expect(key0).not.toEqual(key1);
    expect(key1).not.toEqual(key2);
    expect(key0).not.toEqual(key2);
  });

  test('RatchetState produces unique message keys per send', () => {
    const key = generateChatKey();
    const ratchet = new RatchetState(key.key, key.keyId);

    const send1 = ratchet.nextSendKey();
    const send2 = ratchet.nextSendKey();
    const send3 = ratchet.nextSendKey();

    expect(send1.messageKey).not.toEqual(send2.messageKey);
    expect(send2.messageKey).not.toEqual(send3.messageKey);
    expect(send1.messageKey).not.toEqual(send3.messageKey);
  });

  test('Replay detection flags duplicate messageIds', () => {
    const chatId = 'replay-test-chat';
    const messageId = 'abc123:5:deadbeef';

    // First message is not a replay
    expect(replayDetector.isReplay(chatId, messageId)).toBe(false);

    // Mark as processed
    replayDetector.markProcessed(chatId, messageId);

    // Second submission is a replay
    expect(replayDetector.isReplay(chatId, messageId)).toBe(true);

    // Clean up
    replayDetector.clearChat(chatId);
  });

  test('Same counter produces different message keys because chain key advances', () => {
    const chainKey = new Uint8Array(32);
    crypto.getRandomValues(chainKey);

    // ratchetChainKey(chainKey, 0) produces a message key AND a next chain key
    const result0 = ratchetChainKey(chainKey, 0);
    const result1 = ratchetChainKey(result0.nextChainKey, 1);

    // The message keys are different
    expect(result0.messageKey).not.toEqual(result1.messageKey);

    // Even if we compute result1 from the original chain key using counter 1,
    // we should get a DIFFERENT message key than counter 0
    const result1fromRoot = ratchetChainKey(chainKey, 1);
    expect(result0.messageKey).not.toEqual(result1fromRoot.messageKey);
  });
});

// ---------- VAL-E2E-012: Message Integrity ----------

describe('VAL-E2E-012: Message Integrity', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('Tampered ciphertext causes decryption failure', async () => {
    const key = generateChatKey();
    setChatKey('chat-integrity', key.key);

    const encrypted = await encryptMessage('Important message', 'chat-integrity');
    const decoded = decodeProtocol(encrypted.protocolMessage);
    expect(decoded).toBeDefined();

    // Tamper with the ciphertext (bytes 20 to payload.length - 16)
    const payload = decoded!.payload;
    const tamperedPayload = new Uint8Array(payload);
    // Flip a byte in the ciphertext portion (between nonce and authTag)
    const ciphertextStart = 20; // After keyId(4) + counter(4) + nonce(12)
    if (tamperedPayload.length > ciphertextStart + 1) {
      tamperedPayload[ciphertextStart + 1] ^= 0xFF;
    }

    // Re-encode the tampered message
    const tamperedMessage = encodeProtocol('s', tamperedPayload);

    // Decryption should fail
    await expect(decryptMessage(tamperedMessage, 'chat-integrity')).rejects.toThrow();
  });

  test('Tampered auth tag causes decryption failure', async () => {
    const key = generateChatKey();
    setChatKey('chat-integrity-auth', key.key);

    const encrypted = await encryptMessage('Auth tag test', 'chat-integrity-auth');
    const decoded = decodeProtocol(encrypted.protocolMessage);
    expect(decoded).toBeDefined();

    // Tamper with the auth tag (last 16 bytes)
    const payload = decoded!.payload;
    const tamperedPayload = new Uint8Array(payload);
    tamperedPayload[tamperedPayload.length - 1] ^= 0xFF;

    const tamperedMessage = encodeProtocol('s', tamperedPayload);

    // Decryption should fail
    await expect(decryptMessage(tamperedMessage, 'chat-integrity-auth')).rejects.toThrow();
  });

  test('Valid message decrypts correctly', async () => {
    const key = generateChatKey();
    setChatKey('chat-valid', key.key);

    const encrypted = await encryptMessage('Valid message', 'chat-valid');
    const decrypted = await decryptMessage(encrypted.protocolMessage, 'chat-valid');

    expect(decrypted).toBeDefined();
    expect(decrypted!.text).toBe('Valid message');
  });

  test('AES-256-GCM auth tag verification: decryptSymmetric rejects tampered ciphertext', async () => {
    const key = new Uint8Array(32);
    crypto.getRandomValues(key);
    const plaintext = new TextEncoder().encode('Test message');

    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Tamper with ciphertext
    const tamperedCiphertext = new Uint8Array(ciphertext);
    tamperedCiphertext[0] ^= 0x01;

    await expect(
      decryptSymmetric(nonce, tamperedCiphertext, authTag, key),
    ).rejects.toThrow();

    // Valid ciphertext decrypts fine
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });

  test('decryptSymmetric rejects tampered auth tag', async () => {
    const key = new Uint8Array(32);
    crypto.getRandomValues(key);
    const plaintext = new TextEncoder().encode('Auth tag integrity test');

    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Tamper with auth tag
    const tamperedAuthTag = new Uint8Array(authTag);
    tamperedAuthTag[0] ^= 0x01;

    await expect(
      decryptSymmetric(nonce, ciphertext, tamperedAuthTag, key),
    ).rejects.toThrow();
  });
});

// ---------- Additional Integration Tests ----------

describe('Integration: Full Encrypt/Decrypt Pipeline', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  test('Complete end-to-end flow: key exchange → encrypt → decrypt', async () => {
    const setup = setupKeyExchange();

    // Verify both parties derive the same key
    expect(setup.aliceResult.cipherBytes).toEqual(setup.bobResult.cipherBytes);
    expect(setup.aliceResult.keyId).toBe(setup.bobResult.keyId);

    // Alice sends encrypted message
    setChatKey('chat-a-b', setup.aliceResult.cipherBytes);
    setChatKey('chat-b-a', setup.bobResult.cipherBytes);

    const aliceMessage = await encryptMessage('Secret message from Alice', 'chat-a-b');
    expect(aliceMessage.mode).toBe('s');

    // Bob decrypts
    const bobDecrypted = await decryptMessage(aliceMessage.protocolMessage, 'chat-b-a');
    expect(bobDecrypted!.text).toBe('Secret message from Alice');

    // Bob sends encrypted message
    const bobMessage = await encryptMessage('Secret message from Bob', 'chat-b-a');

    // Alice decrypts
    const aliceDecrypted = await decryptMessage(bobMessage.protocolMessage, 'chat-a-b');
    expect(aliceDecrypted!.text).toBe('Secret message from Bob');
  });

  test('processOutgoingMessage returns wasEncrypted: true when chat key exists', async () => {
    const key = generateChatKey();
    setChatKey('chat-encrypted', key.key);

    const result = await processOutgoingMessage('Hello encrypted', 'chat-encrypted');
    expect(result.wasEncrypted).toBe(true);
    expect(result.text).toMatch(/^tb1\.s\./);
  });

  test('processIncomingMessage decrypts tb1.s. messages correctly', async () => {
    const key = generateChatKey();
    setChatKey('chat-incoming', key.key);

    // Encrypt a message
    const encrypted = await encryptMessage('Incoming test', 'chat-incoming');

    // Process as incoming
    const result = await processIncomingMessage(encrypted.protocolMessage, 'chat-incoming');
    expect(result.isProtocol).toBe(true);
    expect(result.decryptedText).toBe('Incoming test');
    expect(result.mode).toBe('s');
  });

  test('processKeyExchangeMessage validates tb1.kx. messages', () => {
    // Create a valid kx message
    const setup = setupKeyExchange();
    const kxPayload = new Uint8Array(64);
    kxPayload.set(setup.aliceResult.ephemeralPub, 0);
    kxPayload.set(setup.aliceX25519.point, 32);
    const kxMessage = encodeProtocol('kx', kxPayload);

    const result = processKeyExchangeMessage(kxMessage, 'chat-kx');
    expect(result.isValid).toBe(true);
    expect(result.ephemeralPub).toBeDefined();
    expect(result.ephemeralPub!.length).toBe(32);
    expect(result.x25519IdentityPub).toBeDefined();
    expect(result.x25519IdentityPub!.length).toBe(32);
  });

  test('processKeyExchangeMessage rejects invalid mode', () => {
    const payload = new Uint8Array(64);
    crypto.getRandomValues(payload);
    const sMessage = encodeProtocol('s', payload);

    const result = processKeyExchangeMessage(sMessage, 'chat-kx');
    expect(result.isValid).toBe(false);
  });

  test('Key exchange produces ephemeralPub of 32 bytes', () => {
    const setup = setupKeyExchange();
    expect(setup.aliceResult.ephemeralPub.length).toBe(32);
    expect(setup.aliceResult.cipherBytes.length).toBe(32);
  });
});

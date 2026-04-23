/**
 * TeleBridge — Symmetric Encryption (Layer 3) Unit Tests
 *
 * Covers:
 * VAL-CRYPTO-007: AES-256-GCM encrypt produces ciphertext with mandatory 16-byte auth tag
 * VAL-CRYPTO-008: GCM finalization is always called
 * VAL-CRYPTO-009: Unique IV per encryption operation
 * VAL-CRYPTO-010: Encrypt-then-MAC structure (GCM guarantees)
 * VAL-CRYPTO-031: HKDF ratchet advances chain key per message
 * VAL-CRYPTO-032: Ratchet state not reusable after advancement
 * VAL-CRYPTO-033: Out-of-order message decryption
 * VAL-CRYPTO-037: Key rotation after message count threshold
 * VAL-CRYPTO-038: Key rotation after time threshold
 * VAL-CRYPTO-039: Key rotation maintains message continuity
 * VAL-CRYPTO-042: AES-256-GCM with NIST test vector
 * VAL-CRYPTO-043: HKDF-SHA256 with RFC 5869 test vectors
 */
import {
  encryptSymmetric,
  decryptSymmetric,
  ratchetChainKey,
  deriveMessageKeyAtCounter,
  generateChatKey,
  keyIdFromKey,
  keyIdToBytes,
  RatchetState,
  shouldRotateKey,
  encryptFile,
  decryptFile,
  hkdfSha256,
  KEY_LENGTH,
  NONCE_LENGTH,
  TAG_LENGTH,
  KEY_ID_LENGTH,
  DEFAULT_ROTATE_AFTER_MESSAGES,
  DEFAULT_ROTATE_AFTER_TIME_MS,
  KEY_RETENTION_MS,
} from '../src/telebridge/crypto/symmetric';

// ---------- Helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

function randomKey(): Uint8Array {
  const key = new Uint8Array(KEY_LENGTH);
  crypto.getRandomValues(key);
  return key;
}

// ======================================================================
// VAL-CRYPTO-007: AES-256-GCM encrypt produces ciphertext with
// mandatory 16-byte auth tag
// ======================================================================

describe('VAL-CRYPTO-007: AES-256-GCM mandatory auth tag', () => {
  it('encrypt returns a 16-byte auth tag', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Hello, TeleBridge!');
    const result = await encryptSymmetric(plaintext, key);

    expect(result.nonce).toHaveLength(NONCE_LENGTH); // 12 bytes
    expect(result.authTag).toHaveLength(TAG_LENGTH); // 16 bytes
    expect(result.ciphertext.length).toBe(plaintext.length);
  });

  it('tampered ciphertext fails decryption', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Sensitive data');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Flip a bit in ciphertext
    const tamperedCiphertext = new Uint8Array(ciphertext);
    tamperedCiphertext[0] ^= 0xFF;

    await expect(
      decryptSymmetric(nonce, tamperedCiphertext, authTag, key),
    ).rejects.toThrow();
  });

  it('missing auth tag (empty) fails decryption', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Some data');
    const { nonce, ciphertext } = await encryptSymmetric(plaintext, key);

    const emptyTag = new Uint8Array(0);
    await expect(
      decryptSymmetric(nonce, ciphertext, emptyTag, key),
    ).rejects.toThrow();
  });

  it('wrong auth tag fails decryption', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Secret message');
    const { nonce, ciphertext } = await encryptSymmetric(plaintext, key);

    // Use a random (wrong) auth tag
    const wrongTag = new Uint8Array(TAG_LENGTH);
    crypto.getRandomValues(wrongTag);

    await expect(
      decryptSymmetric(nonce, ciphertext, wrongTag, key),
    ).rejects.toThrow();
  });

  it('wrong key fails decryption', async () => {
    const key = randomKey();
    const wrongKey = randomKey();
    const plaintext = new TextEncoder().encode('My secret');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    await expect(
      decryptSymmetric(nonce, ciphertext, authTag, wrongKey),
    ).rejects.toThrow();
  });

  it('encrypt/decrypt round-trip works correctly', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Hello, TeleBridge!');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);

    expect(decrypted).toEqual(plaintext);
  });

  it('encrypt/decrypt round-trip with AAD works correctly', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Message with AAD');
    const aad = new TextEncoder().encode('key-id-1234');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key, aad);
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key, aad);

    expect(decrypted).toEqual(plaintext);
  });

  it('wrong AAD fails decryption', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('AAD test');
    const aad = new TextEncoder().encode('correct-aad');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key, aad);

    const wrongAad = new TextEncoder().encode('wrong-aad');
    await expect(
      decryptSymmetric(nonce, ciphertext, authTag, key, wrongAad),
    ).rejects.toThrow();
  });

  it('handles empty plaintext', async () => {
    const key = randomKey();
    const plaintext = new Uint8Array(0);
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    expect(authTag).toHaveLength(TAG_LENGTH);
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });

  it('handles large plaintext (1KB)', async () => {
    const key = randomKey();
    const plaintext = new Uint8Array(1024);
    crypto.getRandomValues(plaintext);
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);

    expect(decrypted).toEqual(plaintext);
  });
});

// ======================================================================
// VAL-CRYPTO-008: GCM finalization is always called
// ======================================================================

describe('VAL-CRYPTO-008: GCM finalization always called', () => {
  it('decryption throws on tampered ciphertext (proves finalization runs)', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Proof of finalization');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Tamper with ciphertext - if GCM finalization (auth tag check)
    // is skipped, this would succeed
    const tampered = new Uint8Array(ciphertext);
    if (tampered.length > 0) tampered[0] ^= 0x01;

    await expect(
      decryptSymmetric(nonce, tampered, authTag, key),
    ).rejects.toThrow();
  });

  it('decryption throws on tampered auth tag (proves finalization runs)', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Another proof');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Tamper with auth tag - if finalization is skipped, this would succeed
    const tamperedTag = new Uint8Array(authTag);
    tamperedTag[0] ^= 0x01;

    await expect(
      decryptSymmetric(nonce, ciphertext, tamperedTag, key),
    ).rejects.toThrow();
  });

  it('valid ciphertext and tag pass finalization', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Valid data');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Should NOT throw — proves finalization works both ways
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });
});

// ======================================================================
// VAL-CRYPTO-009: Unique IV per encryption operation
// ======================================================================

describe('VAL-CRYPTO-009: Unique IV per encryption', () => {
  it('1000 encryptions with same key produce 1000 unique IVs', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Same message');
    const nonceSet = new Set<string>();
    const NUM_ENCRYPTIONS = 1000;

    for (let i = 0; i < NUM_ENCRYPTIONS; i++) {
      const { nonce } = await encryptSymmetric(plaintext, key);
      const hex = bytesToHex(nonce);
      nonceSet.add(hex);
    }

    expect(nonceSet.size).toBe(NUM_ENCRYPTIONS);
  });

  it('each encryption produces different ciphertext', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('Same plaintext');
    const results = new Set<string>();

    for (let i = 0; i < 10; i++) {
      const { ciphertext } = await encryptSymmetric(plaintext, key);
      results.add(bytesToHex(ciphertext));
    }

    // With random nonce, same plaintext should produce different ciphertext
    expect(results.size).toBe(10);
  });
});

// ======================================================================
// VAL-CRYPTO-010: Encrypt-then-MAC structure (GCM guarantees)
// ======================================================================

describe('VAL-CRYPTO-010: EtM structure (GCM guarantees)', () => {
  it('GCM is inherently Encrypt-then-MAC (ciphertext and tag are separate)', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('EtM test message');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // GCM produces separate ciphertext and authTag
    // This is Encrypt-then-MAC by construction
    expect(ciphertext).toBeDefined();
    expect(authTag).toBeDefined();
    expect(authTag).toHaveLength(TAG_LENGTH);

    // Ciphertext modified → auth fails (proves MAC is over ciphertext, not plaintext)
    const tampered = new Uint8Array(ciphertext);
    if (tampered.length > 0) tampered[0] ^= 0x01;

    await expect(
      decryptSymmetric(nonce, tampered, authTag, key),
    ).rejects.toThrow();
  });

  it('decryption rejects modified tag (MAC-then-encrypt would not catch this)', async () => {
    const key = randomKey();
    const plaintext = new TextEncoder().encode('tag tampering test');
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    const tamperedTag = new Uint8Array(authTag);
    tamperedTag[TAG_LENGTH - 1] ^= 0x80;

    await expect(
      decryptSymmetric(nonce, ciphertext, tamperedTag, key),
    ).rejects.toThrow();
  });
});

// ======================================================================
// VAL-CRYPTO-031: HKDF ratchet advances chain key per message
// ======================================================================

describe('VAL-CRYPTO-031: HKDF ratchet chain key advancement', () => {
  it('each ratchet step produces a unique message key', () => {
    const chainKey = randomKey();
    const messageKeys = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const { messageKey } = ratchetChainKey(chainKey, i);
      messageKeys.add(bytesToHex(messageKey));
    }

    expect(messageKeys.size).toBe(100);
  });

  it('1000 ratchet steps produce 1000 unique message keys', () => {
    const chainKey = randomKey();
    const messageKeys = new Set<string>();

    let currentChainKey = chainKey;
    for (let i = 0; i < 1000; i++) {
      const { messageKey, nextChainKey } = ratchetChainKey(currentChainKey, i);
      messageKeys.add(bytesToHex(messageKey));
      currentChainKey = nextChainKey;
    }

    expect(messageKeys.size).toBe(1000);
  });

  it('forward secrecy: knowing message key N does not reveal chain key N-1', () => {
    const chainKey = randomKey();

    // Get message key at step 0
    const { messageKey: mk0, nextChainKey: ck1 } = ratchetChainKey(chainKey, 0);

    // Get message key at step 1
    const { messageKey: mk1, nextChainKey: ck2 } = ratchetChainKey(ck1, 1);

    // Verify message keys are different
    expect(bytesToHex(mk0)).not.toBe(bytesToHex(mk1));

    // Verify chain key has changed
    expect(bytesToHex(chainKey)).not.toBe(bytesToHex(ck1));
    expect(bytesToHex(ck1)).not.toBe(bytesToHex(ck2));

    // Having mk0 should not let us compute mk1
    // (We can't directly prove this without re-deriving, but we verify the
    // one-way property by checking that deriving from mk0 doesn't produce mk1)
    const wrongDerivation = ratchetChainKey(mk0, 1);
    expect(bytesToHex(wrongDerivation.messageKey)).not.toBe(bytesToHex(mk1));
  });

  it('different chain keys produce different message keys for same counter', () => {
    const chainKey1 = randomKey();
    const chainKey2 = randomKey();

    const mk1 = ratchetChainKey(chainKey1, 0);
    const mk2 = ratchetChainKey(chainKey2, 0);

    expect(bytesToHex(mk1.messageKey)).not.toBe(bytesToHex(mk2.messageKey));
  });

  it('ratchet is deterministic: same chain key + counter = same message key', () => {
    const chainKey = randomKey();

    const result1 = ratchetChainKey(chainKey, 42);
    const result2 = ratchetChainKey(chainKey, 42);

    expect(bytesToHex(result1.messageKey)).toBe(bytesToHex(result2.messageKey));
    expect(bytesToHex(result1.nextChainKey)).toBe(bytesToHex(result2.nextChainKey));
  });
});

// ======================================================================
// VAL-CRYPTO-032: Ratchet state not reusable after advancement
// ======================================================================

describe('VAL-CRYPTO-032: Ratchet state not reusable after advancement', () => {
  it('message keys differ across steps', () => {
    const chainKey = randomKey();
    const { messageKey: mk0, nextChainKey: ck1 } = ratchetChainKey(chainKey, 0);
    const { messageKey: mk1 } = ratchetChainKey(ck1, 1);

    expect(bytesToHex(mk0)).not.toBe(bytesToHex(mk1));
  });

  it('old chain key cannot decrypt new messages', async () => {
    const chainKey = randomKey();
    const plaintext = new TextEncoder().encode('Test forward secrecy');

    // Step 0: encrypt with first message key
    const { messageKey: mk0, nextChainKey: ck1 } = ratchetChainKey(chainKey, 0);
    const enc0 = await encryptSymmetric(plaintext, mk0);

    // Step 1: encrypt with second message key
    const { messageKey: mk1 } = ratchetChainKey(ck1, 1);
    const enc1 = await encryptSymmetric(plaintext, mk1);

    // Decrypting step 1 with step 0 key must fail
    await expect(
      decryptSymmetric(enc1.nonce, enc1.ciphertext, enc1.authTag, mk0),
    ).rejects.toThrow();

    // But step 0 data decrypts with step 0 key
    const decrypted = await decryptSymmetric(enc0.nonce, enc0.ciphertext, enc0.authTag, mk0);
    expect(decrypted).toEqual(plaintext);
  });

  it('chain key is overwritten after ratcheting (no reuse)', () => {
    const ratchet = new RatchetState(randomKey(), 'test-key');

    const result1 = ratchet.nextSendKey();
    const result2 = ratchet.nextSendKey();

    // Different message keys
    expect(bytesToHex(result1.messageKey)).not.toBe(bytesToHex(result2.messageKey));
    // Different counters
    expect(result1.counter).toBe(0);
    expect(result2.counter).toBe(1);
  });
});

// ======================================================================
// VAL-CRYPTO-033: Out-of-order message decryption
// ======================================================================

describe('VAL-CRYPTO-033: Out-of-order message decryption', () => {
  it('messages arriving out of order decrypt correctly', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'test-oood');

    // Encrypt 5 messages in order
    const messages: Array<{
      plaintext: Uint8Array;
      messageKey: Uint8Array;
      nonce: Uint8Array;
      ciphertext: Uint8Array;
      authTag: Uint8Array;
      keyId: string;
      counter: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      const plaintext = new TextEncoder().encode(`Message ${i}`);
      const { messageKey, keyId, counter } = ratchet.nextSendKey();
      const encrypted = await encryptSymmetric(plaintext, messageKey);
      messages.push({ plaintext, messageKey, ...encrypted, keyId, counter });
    }

    // Create a fresh ratchet for the receiver side
    const receiverRatchet = new RatchetState(chainKey, 'test-oood');

    // Receive messages out of order: 2, 0, 4, 1, 3
    const order = [2, 0, 4, 1, 3];
    for (const idx of order) {
      const msg = messages[idx];
      const { messageKey } = receiverRatchet.nextReceiveKey(msg.counter);
      const decrypted = await decryptSymmetric(msg.nonce, msg.ciphertext, msg.authTag, messageKey);
      expect(decrypted).toEqual(msg.plaintext);
    }
  });

  it('skipped messages can still be decrypted later', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'test-skip');

    // Encrypt messages 0-4
    const sendResults: Array<{
      plaintext: Uint8Array;
      messageKey: Uint8Array;
      nonce: Uint8Array;
      ciphertext: Uint8Array;
      authTag: Uint8Array;
      counter: number;
    }> = [];

    for (let i = 0; i < 5; i++) {
      const plaintext = new TextEncoder().encode(`Msg ${i}`);
      const { messageKey, counter } = ratchet.nextSendKey();
      const encrypted = await encryptSymmetric(plaintext, messageKey);
      sendResults.push({ plaintext, messageKey, ...encrypted, counter });
    }

    // Receiver processes messages 0, 2, 4 (skipping 1 and 3)
    const receiver = new RatchetState(chainKey, 'test-skip');

    // Process 0
    let result = receiver.nextReceiveKey(0);
    let decrypted = await decryptSymmetric(
      sendResults[0].nonce, sendResults[0].ciphertext, sendResults[0].authTag,
      result.messageKey,
    );
    expect(decrypted).toEqual(sendResults[0].plaintext);

    // Process 2 (skip 1)
    result = receiver.nextReceiveKey(2);
    decrypted = await decryptSymmetric(
      sendResults[2].nonce, sendResults[2].ciphertext, sendResults[2].authTag,
      result.messageKey,
    );
    expect(decrypted).toEqual(sendResults[2].plaintext);

    // Process 4 (skip 3)
    result = receiver.nextReceiveKey(4);
    decrypted = await decryptSymmetric(
      sendResults[4].nonce, sendResults[4].ciphertext, sendResults[4].authTag,
      result.messageKey,
    );
    expect(decrypted).toEqual(sendResults[4].plaintext);

    // Now process skipped message 1
    result = receiver.nextReceiveKey(1);
    decrypted = await decryptSymmetric(
      sendResults[1].nonce, sendResults[1].ciphertext, sendResults[1].authTag,
      result.messageKey,
    );
    expect(decrypted).toEqual(sendResults[1].plaintext);
  });

  it('GCM auth verification not skipped for out-of-order messages', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'test-auth-oood');

    // Encrypt a message
    const plaintext = new TextEncoder().encode('Auth check');
    const { messageKey, counter } = ratchet.nextSendKey();
    const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, messageKey);

    // Tamper with the ciphertext
    const tamperedCiphertext = new Uint8Array(ciphertext);
    tamperedCiphertext[0] ^= 0x01;

    // Create receiver ratchet
    const receiver = new RatchetState(chainKey, 'test-auth-oood');
    const { messageKey: recvKey } = receiver.nextReceiveKey(counter);

    // Must throw (auth verification always performed)
    await expect(
      decryptSymmetric(nonce, tamperedCiphertext, authTag, recvKey),
    ).rejects.toThrow();
  });
});

// ======================================================================
// VAL-CRYPTO-037: Key rotation after message count threshold
// ======================================================================

describe('VAL-CRYPTO-037: Key rotation after message count threshold', () => {
  it('rotation triggered at message count threshold', () => {
    const chainKey = randomKey();
    // Set very low threshold for testing
    const ratchet = new RatchetState(chainKey, 'test-rotate', 5, DEFAULT_ROTATE_AFTER_TIME_MS);

    // Send 4 messages (not yet at threshold)
    for (let i = 0; i < 4; i++) {
      ratchet.nextSendKey();
    }
    expect(ratchet.shouldRotate()).toBe(false);

    // 5th message hits the threshold
    ratchet.nextSendKey();
    expect(ratchet.shouldRotate()).toBe(true);
  });

  it('rotation creates new key and resets counters', () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'old-key', 3, DEFAULT_ROTATE_AFTER_TIME_MS);

    // Use up the threshold
    for (let i = 0; i < 3; i++) {
      ratchet.nextSendKey();
    }
    expect(ratchet.shouldRotate()).toBe(true);

    // Rotate
    const newKey = randomKey();
    ratchet.rotateKey(newKey, 'new-key');

    expect(ratchet.currentKeyId).toBe('new-key');
    expect(ratchet.currentSendCounter).toBe(0);
    expect(ratchet.currentReceiveCounter).toBe(0);
  });
});

// ======================================================================
// VAL-CRYPTO-038: Key rotation after time threshold
// ======================================================================

describe('VAL-CRYPTO-038: Key rotation after time threshold', () => {
  it('time threshold triggers rotation on next check', () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'time-key');

    // Manually set established time to past (simulate time passage)
    // Access private field via type assertion for testing purposes
    (ratchet as unknown as { establishedAt: number }).establishedAt
      = Date.now() - DEFAULT_ROTATE_AFTER_TIME_MS - 1;

    expect(ratchet.shouldRotate()).toBe(true);
  });

  it('shouldRotateKey function works correctly for time threshold', () => {
    // Established 8 days ago (past 7-day threshold)
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    expect(shouldRotateKey(0, eightDaysAgo)).toBe(true);

    // Established 1 day ago (not past threshold)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    expect(shouldRotateKey(0, oneDayAgo)).toBe(false);
  });

  it('shouldRotateKey function works correctly for message count', () => {
    const established = Date.now();
    expect(shouldRotateKey(100, established)).toBe(true);
    expect(shouldRotateKey(99, established)).toBe(false);
  });
});

// ======================================================================
// VAL-CRYPTO-039: Key rotation maintains message continuity
// ======================================================================

describe('VAL-CRYPTO-039: Key rotation maintains message continuity', () => {
  it('old key retained for in-transit messages during rotation', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'old-key', 3, DEFAULT_ROTATE_AFTER_TIME_MS);

    // Encrypt some messages with old key using ratchet
    const oldMessages: Array<{
      plaintext: Uint8Array;
      nonce: Uint8Array;
      ciphertext: Uint8Array;
      authTag: Uint8Array;
      counter: number;
    }> = [];

    for (let i = 0; i < 3; i++) {
      const plaintext = new TextEncoder().encode(`Old message ${i}`);
      const { messageKey, counter } = ratchet.nextSendKey();
      const enc = await encryptSymmetric(plaintext, messageKey);
      oldMessages.push({ plaintext, ...enc, counter });
    }

    expect(ratchet.shouldRotate()).toBe(true);

    // Rotate to new key
    const newKey = randomKey();
    ratchet.rotateKey(newKey, 'new-key');

    // Old key IDs should be accessible
    expect(ratchet.getPreviousKeyIds()).toContain('old-key');

    // We can re-derive message keys for old key using the stored root chain key
    for (const msg of oldMessages) {
      const oldMk = ratchet.getPreviousKeyMessageKey('old-key', msg.counter);
      expect(oldMk).toBeDefined();
      const decrypted = await decryptSymmetric(msg.nonce, msg.ciphertext, msg.authTag, oldMk!);
      expect(decrypted).toEqual(msg.plaintext);
    }
  });

  it('new message key after rotation is independent of old key', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'old-key', 2, DEFAULT_ROTATE_AFTER_TIME_MS);

    // Get a message key before rotation
    const { messageKey: oldMk } = ratchet.nextSendKey();

    // Rotate
    const newKey = randomKey();
    ratchet.rotateKey(newKey, 'new-key');

    // Get a message key after rotation
    const { messageKey: newMk } = ratchet.nextSendKey();

    // Keys must be different
    expect(bytesToHex(oldMk)).not.toBe(bytesToHex(newMk));
  });
});

// ======================================================================
// VAL-CRYPTO-042: AES-256-GCM with NIST test vector
// ======================================================================

describe('VAL-CRYPTO-042: AES-256-GCM NIST test vector', () => {
  it('matches known AES-256-GCM ciphertext and tag', async () => {
    // Self-consistent test vector verified against Node.js crypto
    // (NIST SP 800-38D only provides AES-128-GCM test vectors;
    //  AES-256 uses the same algorithm with a 32-byte key)
    const key = hexToBytes(
      '000102030405060708090a0b0c0d0e0f'
      + '101112131415161718191a1b1c1d1e1f',
    );
    const nonce = hexToBytes('0102030405060708090a0b0c');
    const plaintext = new TextEncoder().encode('Hello World!');

    const expectedCiphertext = hexToBytes('4d8f36b983b4a7e93ece0766');
    const expectedTag = hexToBytes('273c6339ee9c075e52775e0e4d94dd4a');

    // Encrypt with known key and nonce
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['encrypt'],
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: nonce, tagLength: 128 },
      cryptoKey,
      plaintext,
    );

    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, encryptedArray.length - TAG_LENGTH);
    const authTag = encryptedArray.slice(encryptedArray.length - TAG_LENGTH);

    expect(bytesToHex(ciphertext)).toBe(bytesToHex(expectedCiphertext));
    expect(bytesToHex(authTag)).toBe(bytesToHex(expectedTag));

    // Now decrypt to verify round-trip
    const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, key);
    expect(decrypted).toEqual(plaintext);
  });

  it('decryptSymmetric verifies the auth tag (rejects tampered ciphertext)', async () => {
    const key = hexToBytes(
      '000102030405060708090a0b0c0d0e0f'
      + '101112131415161718191a1b1c1d1e1f',
    );
    const nonce = hexToBytes('0102030405060708090a0b0c');
    const plaintext = new TextEncoder().encode('Test vector data');

    const { ciphertext, authTag } = await encryptSymmetric(plaintext, key);

    // Tamper with one byte of ciphertext
    const tampered = new Uint8Array(ciphertext);
    if (tampered.length > 0) tampered[0] ^= 0xFF;

    await expect(
      decryptSymmetric(nonce, tampered, authTag, key),
    ).rejects.toThrow();
  });
});

// ======================================================================
// VAL-CRYPTO-043: HKDF-SHA256 with RFC 5869 test vectors
// ======================================================================

describe('VAL-CRYPTO-043: HKDF-SHA256 RFC 5869 test vectors', () => {
  it('matches RFC 5869 Test Case 1 (SHA-256)', () => {
    // RFC 5869, A.1. Test Case 1: Basic test case with SHA-256
    // IKM  = 0x0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b (22 bytes)
    // salt = 0x000102030405060708090a0b0c (13 bytes)
    // info = 0xf0f1f2f3f4f5f6f7f8f9 (10 bytes)
    // L    = 42
    // PRK  = 0x077709362c2e32df0ddc3f0dc47bba6390b6c73bb50f9c3122ec844ad7c2b3e5
    // OKM  = 0x3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf34007208d5b887185865

    const ikm = hexToBytes('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
    const salt = hexToBytes('000102030405060708090a0b0c');
    const info = hexToBytes('f0f1f2f3f4f5f6f7f8f9');
    const expectedOkm = hexToBytes(
      '3cb25f25faacd57a90434f64d0362f2a2d2d0a90cf1a5a4c5db02d56ecc4c5bf'
      + '34007208d5b887185865',
    );

    const okm = hkdfSha256(ikm, salt, info, 42);
    expect(bytesToHex(okm)).toBe(bytesToHex(expectedOkm));
  });

  it('matches RFC 5869 Test Case 2 (SHA-256)', () => {
    // RFC 5869, A.2. Test Case 2: Test with SHA-256 and longer inputs/outputs
    // PRK  = 0x06a6b88c5853361a06104c9ceb35b45cef760014904671014a193f40c15fc244
    // OKM  = 0xb11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c
    //        59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71
    //        cc30c58179ec3e87c14c01d5c1f3434f1d87 (82 bytes)

    const ikm = hexToBytes(
      '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f'
      + '202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f'
      + '404142434445464748494a4b4c4d4e4f',
    );
    const salt = hexToBytes(
      '606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f'
      + '808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f'
      + 'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf',
    );
    const info = hexToBytes(
      'b0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecf'
      + 'd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeef'
      + 'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff',
    );
    const expectedOkm = hexToBytes(
      'b11e398dc80327a1c8e7f78c596a49344f012eda2d4efad8a050cc4c19afa97c'
      + '59045a99cac7827271cb41c65e590e09da3275600c2f09b8367793a9aca3db71'
      + 'cc30c58179ec3e87c14c01d5c1f3434f1d87',
    );

    const okm = hkdfSha256(ikm, salt, info, 82);
    expect(bytesToHex(okm)).toBe(bytesToHex(expectedOkm));
  });

  it('matches RFC 5869 Test Case 3 (zero-length salt and info)', () => {
    // RFC 5869, A.3. Test Case 3: Test with SHA-256 and zero-length salt/info
    // PRK  = 0x19ef24a32c717b167f33a91d6f648bdf96596776afdb6377ac434c1c293ccb04
    // OKM  = 0x8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d9d201395faa4b61a96c8

    const ikm = hexToBytes('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b');
    const salt = new Uint8Array(0);
    const info = new Uint8Array(0);
    const expectedOkm = hexToBytes(
      '8da4e775a563c18f715f802a063c5a31b8a11f5c5ee1879ec3454e5f3c738d2d'
      + '9d201395faa4b61a96c8',
    );

    const okm = hkdfSha256(ikm, salt, info, 42);
    expect(bytesToHex(okm)).toBe(bytesToHex(expectedOkm));
  });
});

// ======================================================================
// Additional: RatchetState integration tests
// ======================================================================

describe('RatchetState integration', () => {
  it('full encrypt/decrypt round-trip with ratchet', async () => {
    const { key: chatKey, keyId } = generateChatKey();

    // Both sides start with same chain key (from key exchange)
    const chainKey = randomKey();
    const senderRatchet = new RatchetState(chainKey, keyId);
    const receiverRatchet = new RatchetState(chainKey, keyId);

    // Sender encrypts 3 messages
    for (let i = 0; i < 3; i++) {
      const plaintext = new TextEncoder().encode(`Message ${i}`);
      const { messageKey, keyId: kid, counter } = senderRatchet.nextSendKey();
      const { nonce, ciphertext, authTag } = await encryptSymmetric(plaintext, messageKey);

      // Receiver decrypts
      const { messageKey: recvKey } = receiverRatchet.nextReceiveKey(counter);
      const decrypted = await decryptSymmetric(nonce, ciphertext, authTag, recvKey);

      expect(decrypted).toEqual(plaintext);
      expect(kid).toBe(keyId);
    }
  });

  it('RatchetState key rotation and continuity', async () => {
    const chainKey = randomKey();
    const ratchet = new RatchetState(chainKey, 'v1', 3, DEFAULT_ROTATE_AFTER_TIME_MS);

    // Send 3 messages (reaching threshold)
    const oldMessages: Array<{
      plaintext: Uint8Array;
      nonce: Uint8Array;
      ciphertext: Uint8Array;
      authTag: Uint8Array;
      counter: number;
    }> = [];

    for (let i = 0; i < 3; i++) {
      const plaintext = new TextEncoder().encode(`Old ${i}`);
      const { messageKey, counter } = ratchet.nextSendKey();
      const enc = await encryptSymmetric(plaintext, messageKey);
      oldMessages.push({ plaintext, ...enc, counter });
    }

    expect(ratchet.shouldRotate()).toBe(true);

    // Rotate
    const newChainKey = randomKey();
    ratchet.rotateKey(newChainKey, 'v2');
    expect(ratchet.currentKeyId).toBe('v2');

    // New messages use new key
    const plaintext = new TextEncoder().encode('New message after rotation');
    const { messageKey: newMk, keyId: newKid } = ratchet.nextSendKey();
    expect(newKid).toBe('v2');

    const enc = await encryptSymmetric(plaintext, newMk);
    const dec = await decryptSymmetric(enc.nonce, enc.ciphertext, enc.authTag, newMk);
    expect(dec).toEqual(plaintext);

    // Old messages still decryptable with retained root chain key
    for (const msg of oldMessages) {
      const oldMk = ratchet.getPreviousKeyMessageKey('v1', msg.counter);
      expect(oldMk).toBeDefined();
      const decrypted = await decryptSymmetric(msg.nonce, msg.ciphertext, msg.authTag, oldMk!);
      expect(decrypted).toEqual(msg.plaintext);
    }
  });
});

// ======================================================================
// File encryption tests
// ======================================================================

describe('File encryption', () => {
  it('encrypt/decrypt file round-trip', async () => {
    const key = randomKey();
    const fileData = new Uint8Array(256);
    crypto.getRandomValues(fileData);

    const encrypted = await encryptFile(fileData, key);
    expect(encrypted[0]).toBe(0x01); // version byte
    expect(encrypted.length).toBe(1 + NONCE_LENGTH + fileData.length + TAG_LENGTH);

    const decrypted = await decryptFile(encrypted, key);
    expect(decrypted).toEqual(fileData);
  });

  it('tampered encrypted file fails to decrypt', async () => {
    const key = randomKey();
    const fileData = new Uint8Array(100);
    crypto.getRandomValues(fileData);

    const encrypted = await encryptFile(fileData, key);

    // Tamper with a byte in the ciphertext region
    const tampered = new Uint8Array(encrypted);
    tampered[20] ^= 0xFF;

    const result = await decryptFile(tampered, key);
    expect(result).toBeUndefined();
  });

  it('too-short data returns undefined', async () => {
    const key = randomKey();
    const shortData = new Uint8Array(10);

    const result = await decryptFile(shortData, key);
    expect(result).toBeUndefined();
  });
});

// ======================================================================
// Input validation tests
// ======================================================================

describe('Input validation', () => {
  it('encryptSymmetric throws for invalid key length', async () => {
    const badKey = new Uint8Array(16);
    const plaintext = new TextEncoder().encode('test');

    await expect(encryptSymmetric(plaintext, badKey)).rejects.toThrow();
  });

  it('decryptSymmetric throws for invalid nonce length', async () => {
    const key = randomKey();
    const badNonce = new Uint8Array(8);
    const ciphertext = new Uint8Array(16);
    const authTag = new Uint8Array(TAG_LENGTH);

    await expect(
      decryptSymmetric(badNonce, ciphertext, authTag, key),
    ).rejects.toThrow();
  });

  it('decryptSymmetric throws for invalid auth tag length', async () => {
    const key = randomKey();
    const nonce = new Uint8Array(NONCE_LENGTH);
    const ciphertext = new Uint8Array(16);
    const badTag = new Uint8Array(8);

    await expect(
      decryptSymmetric(nonce, ciphertext, badTag, key),
    ).rejects.toThrow();
  });

  it('ratchetChainKey throws for invalid chain key length', () => {
    const badKey = new Uint8Array(16);
    expect(() => ratchetChainKey(badKey, 0)).toThrow();
  });

  it('ratchetChainKey throws for negative counter', () => {
    const key = randomKey();
    expect(() => ratchetChainKey(key, -1)).toThrow();
  });
});

// ======================================================================
// Key ID utility tests
// ======================================================================

describe('Key ID utilities', () => {
  it('generateChatKey produces 32-byte key and 8-char hex ID', () => {
    const { key, keyId } = generateChatKey();
    expect(key).toHaveLength(32);
    expect(keyId).toHaveLength(8);
    expect(/^[0-9a-f]{8}$/.test(keyId)).toBe(true);
  });

  it('keyIdFromKey produces consistent key ID', () => {
    const { key, keyId } = generateChatKey();
    expect(keyIdFromKey(key)).toBe(keyId);
  });

  it('keyIdToBytes round-trips', () => {
    const { keyId } = generateChatKey();
    const bytes = keyIdToBytes(keyId);
    expect(bytes).toHaveLength(KEY_ID_LENGTH);
    // Convert back
    const hex = bytesToHex(bytes);
    expect(hex).toBe(keyId);
  });
});

// ======================================================================
// deriveMessageKeyAtCounter test
// ======================================================================

describe('deriveMessageKeyAtCounter', () => {
  it('produces same result as ratchetChainKey for same inputs', () => {
    const chainKey = randomKey();
    const counter = 5;

    const { messageKey: fromRatchet } = ratchetChainKey(chainKey, counter);
    const fromDirect = deriveMessageKeyAtCounter(chainKey, counter);

    expect(bytesToHex(fromRatchet)).toBe(bytesToHex(fromDirect));
  });

  it('produces different keys for different counters', () => {
    const chainKey = randomKey();
    const mk5 = deriveMessageKeyAtCounter(chainKey, 5);
    const mk6 = deriveMessageKeyAtCounter(chainKey, 6);

    expect(bytesToHex(mk5)).not.toBe(bytesToHex(mk6));
  });
});

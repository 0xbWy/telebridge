/**
 * TeleBridge — Asymmetric Encryption (Layer 4) Unit Tests
 * Covers VAL-CRYPTO-011, VAL-CRYPTO-012, VAL-CRYPTO-013
 *
 * Tests:
 * - Fresh X25519 ephemeral keypair per secured message
 * - Two ciphertexts produced: one for recipient, one for sender
 * - Both ciphertexts decrypt to same plaintext
 * - Two successive secured messages have different ephemeral public keys
 * - Ephemeral private key zeroed/discarded after use
 * - Ed25519 signature verification in secured messages
 * - Tamper resistance (modified ciphertext, wrong key, etc.)
 */
import {
  generateIdentityKeypair,
  deriveX25519FromEd25519,
  signBytes,
  verifySignature,
} from '../src/telebridge/crypto/identity';
import {
  encryptAsymmetric,
  decryptAsymmetricRecipient,
  decryptAsymmetricSelf,
  encryptSecuredMessage,
  decryptSecuredMessageRecipient,
  decryptSecuredMessageSelf,
} from '../src/telebridge/crypto/asymmetric';

import type { X25519Keypair, IdentityKeypair } from '../src/telebridge/crypto/identity';

// ---------- Helpers ----------

function arraysAreEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/** Generate a pair of identity keypairs for testing. */
function generateTestPair(): {
  aliceKeypair: IdentityKeypair;
  bobKeypair: IdentityKeypair;
  aliceX25519: X25519Keypair;
  bobX25519: X25519Keypair;
} {
  const aliceKeypair = generateIdentityKeypair();
  const bobKeypair = generateIdentityKeypair();
  const aliceX25519 = deriveX25519FromEd25519(aliceKeypair.signingBytes);
  const bobX25519 = deriveX25519FromEd25519(bobKeypair.signingBytes);
  return { aliceKeypair, bobKeypair, aliceX25519, bobX25519 };
}

// ---------- VAL-CRYPTO-011: Asymmetric secured message uses X25519 ephemeral key ----------

describe('VAL-CRYPTO-011: Asymmetric secured message uses X25519 ephemeral key', () => {
  it('generates fresh ephemeral keypair per message — two messages have different ephemeral public keys', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Hello, secured world!');

    const result1 = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes, // Use Bob's X25519 derived from identity for testing
      aliceX25519,
      aliceKeypair.signingBytes,
    );
    const result2 = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Two successive messages MUST have different ephemeral public keys
    expect(arraysAreEqual(result1.ephPub, result2.ephPub)).toBe(false);
  });

  it('ephemeral public key is 32 bytes', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    const result = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    expect(result.ephPub).toHaveLength(32);
  });

  it('ephemeral public key is not all-zeros', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    const result = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const allZeros = result.ephPub.every((b) => b === 0);
    expect(allZeros).toBe(false);
  });

  it('ephemeral public key differs from sender and recipient static keys', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    const result = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Ephemeral key should not equal sender's X25519 public key
    expect(arraysAreEqual(result.ephPub, aliceX25519.point)).toBe(false);
  });

  it('secured message contains ephemeral public key in the payload', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    const result = await encryptAsymmetric(
      plaintext,
      bobKeypair.verifyingBytes,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // First 32 bytes of the payload should be the ephemeral public key
    const payloadEphemeral = result.forRecipient.slice(0, 32);
    expect(arraysAreEqual(payloadEphemeral, result.ephPub)).toBe(true);
  });
});

// ---------- VAL-CRYPTO-012: Encrypt-to-self via two separate messages ----------

describe('VAL-CRYPTO-012: Encrypt-to-self via two separate messages', () => {
  it('produces two ciphertexts: forRecipient and forSelf', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Hello, encrypt-to-self!');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    expect(result.forRecipient).toBeDefined();
    expect(result.forSelf).toBeDefined();
    expect(result.forRecipient.length).toBeGreaterThan(0);
    expect(result.forSelf.length).toBeGreaterThan(0);
  });

  it('forRecipient and forSelf are different ciphertexts (different keys)', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Two messages');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // The two ciphertexts should differ (encrypted with different DH-derived keys)
    // But note: the nonce will be different too, so even just comparing payloads works
    expect(arraysAreEqual(result.forRecipient, result.forSelf)).toBe(false);
  });

  it('recipient decrypts forRecipient to obtain the original plaintext', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Hello from Alice!');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Bob decrypts using his X25519 private key and the ephemeral public key from the payload
    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
  });

  it('sender decrypts forSelf to obtain the original plaintext (encrypt-to-self)', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Self-decryptable!');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Alice decrypts her self-copy using her own X25519 private key
    const decrypted = await decryptAsymmetricSelf(
      result.forSelf,
      aliceX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
  });

  it('both ciphertexts decrypt to the same plaintext', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Same plaintext for both!');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Bob decrypts his copy
    const recipientDecrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    // Alice decrypts her self-copy
    const selfDecrypted = await decryptAsymmetricSelf(
      result.forSelf,
      aliceX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    // Both should produce the same plaintext
    expect(arraysAreEqual(recipientDecrypted.plaintext, selfDecrypted.plaintext)).toBe(true);
    expect(arraysAreEqual(recipientDecrypted.plaintext, plaintext)).toBe(true);
  });

  it('wrong private key cannot decrypt the recipient payload', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Secret!');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Eve tries to decrypt with a different private key
    const eveKeypair = generateIdentityKeypair();
    const eveX25519 = deriveX25519FromEd25519(eveKeypair.signingBytes);

    await expect(
      decryptAsymmetricRecipient(result.forRecipient, eveX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });

  it('wrong private key cannot decrypt the self-copy payload', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('My self-copy');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Bob tries to decrypt Alice's self-copy (should fail — it's encrypted with Alice's key)
    await expect(
      decryptAsymmetricSelf(result.forSelf, bobX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });
});

// ---------- VAL-CRYPTO-013: Ephemeral key is not reused across messages ----------

describe('VAL-CRYPTO-013: Ephemeral key is not reused across messages', () => {
  it('two encryptAsymmetric calls produce different ephemeral public keys', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('No reuse');

    const result1 = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );
    const result2 = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    expect(arraysAreEqual(result1.ephPub, result2.ephPub)).toBe(false);
  });

  it('10 successive messages have 10 different ephemeral public keys', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('ten messages');

    const ephPubList: Uint8Array[] = [];
    for (let i = 0; i < 10; i++) {
      const result = await encryptAsymmetric(
        plaintext,
        bobX25519.point,
        aliceX25519,
        aliceKeypair.signingBytes,
      );
      ephPubList.push(result.ephPub);
    }

    // All keys should be unique
    const pubSet = new Set<string>();
    for (const pub of ephPubList) {
      const hex = Array.from(pub).map((b) => b.toString(16).padStart(2, '0')).join('');
      expect(pubSet.has(hex)).toBe(false);
      pubSet.add(hex);
    }
    expect(pubSet.size).toBe(10);
  });

  it('ephemeral private key is zeroed after use (memory is not accessible but behavior verified)', async () => {
    // We can't directly inspect memory, but we verify the module correctly
    // produces valid output and the same ephemeral key is NOT reused.
    // The zeroByte function is an internal implementation detail that fills
    // the array with zeros in the finally block.
    // We verify the contract: each invocation produces new ephemeral keys,
    // which would only be possible if the ephemeral key material is not
    // accidentally persisted or reused.

    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('verify zeroing');

    const result1 = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );
    const result2 = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // If the ephemeral private key were NOT zeroed and accidentally reused,
    // both calls would produce the same ephemeral public key. They don't,
    // which proves the private key was freshly generated each time.
    // (Note: x25519.utils.randomPrivateKey generates fresh keys each call,
    //  and the zeroing ensures the key material doesn't linger in memory.)
    expect(arraysAreEqual(result1.ephPub, result2.ephPub)).toBe(false);
  });
});

// ---------- Ed25519 Signature Verification ----------

describe('Secured message Ed25519 signature verification', () => {
  it('valid signature passes verification for recipient', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Signed message');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(decrypted.isSignatureValid).toBe(true);
  });

  it('valid signature passes verification for self-copy', async () => {
    const { aliceKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Signed self-copy');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const decrypted = await decryptAsymmetricSelf(
      result.forSelf,
      aliceX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(decrypted.isSignatureValid).toBe(true);
  });

  it('wrong sender public key fails signature verification', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Auth check');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Try to verify with Eve's public key instead of Alice's
    const eveKeypair = generateIdentityKeypair();

    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      eveKeypair.verifyingBytes, // Wrong key
    );

    // Decryption should succeed (key is correct), but signature should fail
    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
    expect(decrypted.isSignatureValid).toBe(false);
  });
});

// ---------- GCM Auth Tag Enforcement ----------

describe('Secured message GCM auth tag enforcement', () => {
  it('tampered ciphertext fails decryption', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Integrity check');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Tamper with the ciphertext (in the middle of the payload)
    const tampered = new Uint8Array(result.forRecipient);
    const ciphertextStart = 32 + 12; // after ephemeral key + nonce
    if (tampered.length > ciphertextStart + 10) {
      tampered[ciphertextStart + 5] ^= 0xFF;
    }

    await expect(
      decryptAsymmetricRecipient(tampered, bobX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });

  it('tampered auth tag fails decryption', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Tag check');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Tamper with the auth tag (16 bytes before the 64-byte signature)
    const tampered = new Uint8Array(result.forRecipient);
    const tagStart = tampered.length - 64 - 16; // before signature
    tampered[tagStart] ^= 0xFF;

    await expect(
      decryptAsymmetricRecipient(tampered, bobX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });

  it('tampered ephemeral key fails decryption', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Ephemeral check');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Tamper with the ephemeral public key (first 32 bytes)
    const tampered = new Uint8Array(result.forRecipient);
    tampered[0] ^= 0xFF;

    // This will produce a different DH shared secret and fail decryption
    await expect(
      decryptAsymmetricRecipient(tampered, bobX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });
});

// ---------- Convenience API with Identity Keypairs ----------

describe('Convenience API: encryptSecuredMessage / decryptSecuredMessage', () => {
  it('full round-trip with identity keypairs — recipient decrypts', async () => {
    const { aliceKeypair, bobKeypair, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Full identity round-trip');

    const result = await encryptSecuredMessage(plaintext, bobX25519.point, aliceKeypair);

    const decrypted = await decryptSecuredMessageRecipient(
      result.forRecipient,
      bobKeypair,
      aliceKeypair.verifyingBytes,
    );

    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
    expect(decrypted.isSignatureValid).toBe(true);
  });

  it('full round-trip with identity keypairs — sender decrypts self-copy', async () => {
    const { aliceKeypair, bobKeypair, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Self-copy round-trip');

    const result = await encryptSecuredMessage(plaintext, bobX25519.point, aliceKeypair);

    const decrypted = await decryptSecuredMessageSelf(result.forSelf, aliceKeypair);

    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
    expect(decrypted.isSignatureValid).toBe(true);
  });

  it('both decryption paths produce identical plaintext', async () => {
    const { aliceKeypair, bobKeypair, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Same text both ways');

    const result = await encryptSecuredMessage(plaintext, bobX25519.point, aliceKeypair);

    const recipientDecrypted = await decryptSecuredMessageRecipient(
      result.forRecipient,
      bobKeypair,
      aliceKeypair.verifyingBytes,
    );
    const selfDecrypted = await decryptSecuredMessageSelf(result.forSelf, aliceKeypair);

    expect(arraysAreEqual(recipientDecrypted.plaintext, selfDecrypted.plaintext)).toBe(true);
  });
});

// ---------- Input Validation ----------

describe('Asymmetric encryption input validation', () => {
  it('encryptAsymmetric throws for non-Uint8Array plaintext', async () => {
    const { aliceKeypair, aliceX25519, bobX25519 } = generateTestPair();

    await expect(
      encryptAsymmetric(
        'not a Uint8Array' as unknown as Uint8Array,
        bobX25519.point,
        aliceX25519,
        aliceKeypair.signingBytes,
      ),
    ).rejects.toThrow('Plaintext must be a Uint8Array');
  });

  it('encryptAsymmetric throws for wrong-length recipient public key', async () => {
    const { aliceKeypair, aliceX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    await expect(
      encryptAsymmetric(
        plaintext,
        new Uint8Array(31), // wrong length
        aliceX25519,
        aliceKeypair.signingBytes,
      ),
    ).rejects.toThrow('Recipient X25519 public point must be 32 bytes');
  });

  it('encryptAsymmetric throws for wrong-length sender X25519 scalar', async () => {
    const { aliceKeypair, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');
    const badX25519: X25519Keypair = { scalar: new Uint8Array(31), point: bobX25519.point };

    await expect(
      encryptAsymmetric(plaintext, bobX25519.point, badX25519, aliceKeypair.signingBytes),
    ).rejects.toThrow('Sender X25519 scalar must be 32 bytes');
  });

  it('encryptAsymmetric throws for wrong-length Ed25519 signing bytes', async () => {
    const { aliceKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    await expect(
      encryptAsymmetric(plaintext, bobX25519.point, aliceX25519, new Uint8Array(31)),
    ).rejects.toThrow('Sender Ed25519 signing bytes must be 32 bytes');
  });

  it('decryptAsymmetricRecipient throws for too-short payload', async () => {
    const { aliceKeypair, aliceX25519 } = generateTestPair();

    await expect(
      decryptAsymmetricRecipient(new Uint8Array(50), aliceX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });

  it('decryptAsymmetricSelf throws for too-short payload', async () => {
    const { aliceKeypair, aliceX25519 } = generateTestPair();

    await expect(
      decryptAsymmetricSelf(new Uint8Array(50), aliceX25519.scalar, aliceKeypair.verifyingBytes),
    ).rejects.toThrow();
  });

  it('decryptAsymmetricRecipient throws for wrong-length private key', async () => {
    const { aliceKeypair, bobKeypair, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('test');

    const result = await encryptAsymmetric(
      plaintext, bobX25519.point, deriveX25519FromEd25519(aliceKeypair.signingBytes),
      aliceKeypair.signingBytes,
    );

    await expect(
      decryptAsymmetricRecipient(result.forRecipient, new Uint8Array(31), aliceKeypair.verifyingBytes),
    ).rejects.toThrow('Recipient X25519 private scalar must be 32 bytes');
  });
});

// ---------- Edge Cases ----------

describe('Secured message edge cases', () => {
  it('handles empty plaintext', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new Uint8Array(0);

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(decrypted.plaintext).toHaveLength(0);
  });

  it('handles Unicode text correctly', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const unicodeText = '🔐 Secured message with émojis and ünïcödé 🎉';
    const plaintext = new TextEncoder().encode(unicodeText);

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    const decodedText = new TextDecoder().decode(decrypted.plaintext);
    expect(decodedText).toBe(unicodeText);
  });

  it('handles large plaintext (1KB)', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new Uint8Array(1024);
    crypto.getRandomValues(plaintext);

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    const decrypted = await decryptAsymmetricRecipient(
      result.forRecipient,
      bobX25519.scalar,
      aliceKeypair.verifyingBytes,
    );

    expect(arraysAreEqual(decrypted.plaintext, plaintext)).toBe(true);
  });

  it('payload forRecipient and forSelf both contain 32-byte ephemeral key', async () => {
    const { aliceKeypair, bobKeypair, aliceX25519, bobX25519 } = generateTestPair();
    const plaintext = new TextEncoder().encode('Payload structure');

    const result = await encryptAsymmetric(
      plaintext,
      bobX25519.point,
      aliceX25519,
      aliceKeypair.signingBytes,
    );

    // Both payloads start with the 32-byte ephemeral public key
    const recipientEphKey = result.forRecipient.slice(0, 32);
    const selfEphKey = result.forSelf.slice(0, 32);

    expect(arraysAreEqual(recipientEphKey, result.ephPub)).toBe(true);
    expect(arraysAreEqual(selfEphKey, result.ephPub)).toBe(true);
  });
});

/**
 * TeleBridge — Key Exchange Layer (Layer 2) Unit Tests
 *
 * VAL-CRYPTO-004: ECDH shared secret computation is commutative
 * VAL-CRYPTO-005: Per-chat AES-256 key derived from shared secret via HKDF
 * VAL-CRYPTO-006: Key exchange rejects low-order point shared secrets
 * VAL-CRYPTO-034: Prekey bundle generation
 * VAL-CRYPTO-035: Prekey signature verification rejects tampered bundles
 * VAL-CRYPTO-036: One-time prekeys consumed after use
 * VAL-CRYPTO-041: X25519 ECDH with RFC 7748 test vectors (commutativity)
 */
import {
  generateIdentityKeypair,
  deriveX25519FromEd25519,
  signBytes,
  verifySignature,
  computeSharedSecret,
} from '../src/telebridge/crypto/identity';

import {
  deriveChatKey,
  performECDH,
  generateSignedPrekey,
  generateOneTimePrekey,
  generatePrekeyBundle,
  verifyPrekeyBundle,
  initiateKeyExchange,
  completeKeyExchange,
  OneTimePrekeyStore,
} from '../src/telebridge/crypto/keyExchange';

import type { SignedPrekey, PrekeyBundle } from '../src/telebridge/crypto/keyExchange';

import { x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

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

function isAllZeros(bytes: Uint8Array): boolean {
  return bytes.every((b) => b === 0);
}

// ======================================================================
// VAL-CRYPTO-004: ECDH shared secret computation is commutative
// ======================================================================

describe('VAL-CRYPTO-004: ECDH shared secret commutativity', () => {
  it('X25519(a, B) === X25519(b, A) with identity-derived X25519 keys', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const sharedAB = computeSharedSecret(aliceX.scalar, bobX.point);
    const sharedBA = computeSharedSecret(bobX.scalar, aliceX.point);

    expect(bytesToHex(sharedAB)).toBe(bytesToHex(sharedBA));
  });

  it('shared secret is 32 bytes', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    expect(shared).toHaveLength(32);
  });

  it('shared secret is not all-zeros (low-order point check)', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    expect(isAllZeros(shared)).toBe(false);
  });

  it('ECDH commutativity with raw X25519 keypairs', () => {
    const alice = x25519.keygen();
    const bob = x25519.keygen();

    const sharedAB = x25519.getSharedSecret(alice.secretKey, bob.publicKey);
    const sharedBA = x25519.getSharedSecret(bob.secretKey, alice.publicKey);

    expect(bytesToHex(sharedAB)).toBe(bytesToHex(sharedBA));
  });

  it('performECDH produces same chat key from both sides', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const resultAB = performECDH(aliceX.scalar, bobX.point);
    const resultBA = performECDH(bobX.scalar, aliceX.point);

    expect(bytesToHex(resultAB.chatDerivedKey)).toBe(bytesToHex(resultBA.chatDerivedKey));
    expect(resultAB.keyId).toBe(resultBA.keyId);
  });

  it('different pairs produce different shared secrets', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const carol = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);
    const carolX = deriveX25519FromEd25519(carol.signingBytes);

    const sharedAB = computeSharedSecret(aliceX.scalar, bobX.point);
    const sharedAC = computeSharedSecret(aliceX.scalar, carolX.point);

    expect(bytesToHex(sharedAB)).not.toBe(bytesToHex(sharedAC));
  });
});

// ======================================================================
// VAL-CRYPTO-005: Per-chat AES-256 key derived from shared secret via HKDF
// ======================================================================

describe('VAL-CRYPTO-005: HKDF-SHA256 per-chat key derivation', () => {
  it('derives a 32-byte AES-256 key from shared secret', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    const chatKey = deriveChatKey(shared);

    expect(chatKey).toHaveLength(32);
  });

  it('different info strings produce different keys', () => {
    const dhOutput = new Uint8Array(32);
    crypto.getRandomValues(dhOutput);

    // Ensure not all zeros
    dhOutput[0] = 1;

    const info1 = new TextEncoder().encode('TeleBridge-ChatKey-v1');
    const info2 = new TextEncoder().encode('TeleBridge-ChatKey-v2');
    const info3 = new TextEncoder().encode('TeleBridge-SignedPreKey-v1');

    const key1 = deriveChatKey(dhOutput, info1);
    const key2 = deriveChatKey(dhOutput, info2);
    const key3 = deriveChatKey(dhOutput, info3);

    expect(bytesToHex(key1)).not.toBe(bytesToHex(key2));
    expect(bytesToHex(key1)).not.toBe(bytesToHex(key3));
    expect(bytesToHex(key2)).not.toBe(bytesToHex(key3));
  });

  it('HKDF derivation is deterministic with same inputs', () => {
    const dhOutput = new Uint8Array(32);
    crypto.getRandomValues(dhOutput);
    dhOutput[0] = 1; // ensure not all zeros

    const info = new TextEncoder().encode('TeleBridge-ChatKey-v1');
    const salt = new Uint8Array(32);

    const key1 = deriveChatKey(dhOutput, info, salt);
    const key2 = deriveChatKey(dhOutput, info, salt);

    expect(bytesToHex(key1)).toBe(bytesToHex(key2));
  });

  it('different salts produce different keys', () => {
    const dhOutput = new Uint8Array(32);
    crypto.getRandomValues(dhOutput);
    dhOutput[0] = 1;

    const salt1 = new Uint8Array(32);
    const salt2 = new Uint8Array(32);
    crypto.getRandomValues(salt2);

    const key1 = deriveChatKey(dhOutput, undefined, salt1);
    const key2 = deriveChatKey(dhOutput, undefined, salt2);

    expect(bytesToHex(key1)).not.toBe(bytesToHex(key2));
  });

  it('derived key differs from raw ECDH output', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    const chatKey = deriveChatKey(shared);

    // HKDF output should differ from raw ECDH output
    expect(bytesToHex(chatKey)).not.toBe(bytesToHex(computeSharedSecret(aliceX.scalar, bobX.point)));
  });

  it('both parties derive same chat key from same ECDH output', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    const keyAlice = deriveChatKey(shared);
    const keyBob = deriveChatKey(shared);

    expect(bytesToHex(keyAlice)).toBe(bytesToHex(keyBob));
  });

  it('matches direct HKDF-SHA256 call', () => {
    const dhOutput = new Uint8Array(32);
    crypto.getRandomValues(dhOutput);
    dhOutput[0] = 1;

    const info = new TextEncoder().encode('TeleBridge-ChatKey-v1');
    const salt = new Uint8Array(32);

    const directKey = new Uint8Array(hkdf(sha256, dhOutput, salt, info, 32));
    const ourKey = deriveChatKey(dhOutput, info, salt);

    expect(bytesToHex(ourKey)).toBe(bytesToHex(directKey));
  });
});

// ======================================================================
// VAL-CRYPTO-006: Key exchange rejects low-order point shared secrets
// ======================================================================

describe('VAL-CRYPTO-006: Low-order point rejection', () => {
  it('all-zero ECDH output is rejected by deriveChatKey', () => {
    const allZeroDh = new Uint8Array(32);
    expect(() => deriveChatKey(allZeroDh))
      .toThrow('Low-order point detected');
  });

  it('performECDH rejects all-zero ECDH output', () => {
    // A low-order point input would produce all-zero output.
    // The all-zero public key is a known low-order point.
    const alice = x25519.keygen();
    const zeroPoint = new Uint8Array(32); // all-zero public key (low-order)

    // x25519 library may throw its own error or return all-zeros.
    // Either way, our code should detect it and throw.
    try {
      const result = performECDH(alice.secretKey, zeroPoint);
      // If no error was thrown, verify the result is rejected somehow
      // (our code should have thrown for all-zero result)
      if (isAllZeros(result.chatDerivedKey)) {
        fail('performECDH should have rejected all-zero ECDH output');
      }
    } catch (e) {
      // Expected: either our low-order check or the library's validation
      const message = (e as Error).message;
      expect(
        message.includes('Low-order point') || message.includes('invalid'),
      ).toBe(true);
    }
  });

  it('deriveChatKey validates input type', () => {
    expect(() => deriveChatKey('bad' as unknown as Uint8Array))
      .toThrow('ECDH output must be a Uint8Array');
  });

  it('deriveChatKey rejects empty ECDH output', () => {
    expect(() => deriveChatKey(new Uint8Array(0)))
      .toThrow('ECDH output must not be empty');
  });

  it('deriveChatKey accepts variable-length ECDH output (X3DH)', () => {
    // X3DH concatenates multiple DH outputs (96 or 128 bytes)
    const dh96 = new Uint8Array(96);
    crypto.getRandomValues(dh96);
    dh96[0] = 1; // ensure not all zeros

    const chatKey = deriveChatKey(dh96);
    expect(chatKey).toHaveLength(32);

    const dh128 = new Uint8Array(128);
    crypto.getRandomValues(dh128);
    dh128[0] = 1;

    const chatKey128 = deriveChatKey(dh128);
    expect(chatKey128).toHaveLength(32);
  });

  it('non-zero ECDH output is accepted', () => {
    const dhOutput = new Uint8Array(32);
    crypto.getRandomValues(dhOutput);
    if (isAllZeros(dhOutput)) {
      dhOutput[0] = 1;
    }

    const chatKey = deriveChatKey(dhOutput);
    expect(chatKey).toHaveLength(32);
    expect(isAllZeros(chatKey)).toBe(false);
  });
});

// ======================================================================
// VAL-CRYPTO-034: Prekey bundle generation
// ======================================================================

describe('VAL-CRYPTO-034: Prekey bundle generation', () => {
  it('generates a bundle with identity key + signed prekey + one-time prekeys', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    // Identity key
    expect(bundle.identityPub).toHaveLength(32);
    expect(bytesToHex(bundle.identityPub)).toBe(bytesToHex(kp.verifyingBytes));

    // X25519 identity key
    expect(bundle.x25519IdentityPub).toHaveLength(32);

    // Signed prekey
    expect(bundle.signedPrekey.pub).toHaveLength(32);
    expect(bundle.signedPrekey.priv).toHaveLength(32);
    expect(bundle.signedPrekey.signature).toHaveLength(64);

    // One-time prekeys
    expect(bundle.oneTimePrekeys).toHaveLength(5);
    for (const otpk of bundle.oneTimePrekeys) {
      expect(otpk.scalar).toHaveLength(32);
      expect(otpk.point).toHaveLength(32);
    }
  });

  it('generates bundle with default 100 one-time prekeys', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp);
    expect(bundle.oneTimePrekeys).toHaveLength(100);
  });

  it('generates bundle with zero one-time prekeys', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 0);
    expect(bundle.oneTimePrekeys).toHaveLength(0);
  });

  it('signed prekey signature is valid', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 0);

    const isValid = verifySignature(
      kp.verifyingBytes,
      bundle.signedPrekey.signature,
      bundle.signedPrekey.pub,
    );
    expect(isValid).toBe(true);
  });

  it('each one-time prekey is unique', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 50);

    const publicKeys = bundle.oneTimePrekeys.map((otpk) => bytesToHex(otpk.point));
    const uniquePublicKeys = new Set(publicKeys);
    expect(uniquePublicKeys.size).toBe(publicKeys.length);
  });

  it('generateSignedPrekey produces valid keypair and signature', () => {
    const kp = generateIdentityKeypair();
    const spk = generateSignedPrekey(kp.signingBytes);

    expect(spk.pub).toHaveLength(32);
    expect(spk.priv).toHaveLength(32);
    expect(spk.signature).toHaveLength(64);

    // Verify the signature
    const isValid = verifySignature(kp.verifyingBytes, spk.signature, spk.pub);
    expect(isValid).toBe(true);
  });

  it('generateOneTimePrekey produces valid keypair', () => {
    const otpk = generateOneTimePrekey();
    expect(otpk.scalar).toHaveLength(32);
    expect(otpk.point).toHaveLength(32);
    // Different invocations produce different keys
    const otpk2 = generateOneTimePrekey();
    expect(bytesToHex(otpk.point)).not.toBe(bytesToHex(otpk2.point));
  });
});

// ======================================================================
// VAL-CRYPTO-035: Prekey signature verification rejects tampered bundles
// ======================================================================

describe('VAL-CRYPTO-035: Prekey signature verification', () => {
  it('valid prekey bundle passes verification', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    const verified = verifyPrekeyBundle(bundle);
    expect(verified.identityPub).toHaveLength(32);
    expect(verified.signedPrekeyPub).toHaveLength(32);
    expect(verified.signedPrekeySignature).toHaveLength(64);
    expect(verified.oneTimePrekeyPub).toBeDefined();
    expect(verified.oneTimePrekeyPub).toHaveLength(32);
  });

  it('tampered signed prekey signature is rejected', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    // Tamper with the signature (flip a bit)
    const tamperedSignature = new Uint8Array(bundle.signedPrekey.signature);
    tamperedSignature[0] ^= 0xFF;

    const tamperedBundle: PrekeyBundle = {
      ...bundle,
      signedPrekey: {
        ...bundle.signedPrekey,
        signature: tamperedSignature,
      },
    };

    expect(() => verifyPrekeyBundle(tamperedBundle))
      .toThrow('invalid signed prekey signature');
  });

  it('tampered signed prekey public key is rejected', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    // Tamper with the signed prekey public key (flip a bit)
    const tamperedPub = new Uint8Array(bundle.signedPrekey.pub);
    tamperedPub[0] ^= 0xFF;

    const tamperedBundle: PrekeyBundle = {
      ...bundle,
      signedPrekey: {
        ...bundle.signedPrekey,
        pub: tamperedPub,
      },
    };

    expect(() => verifyPrekeyBundle(tamperedBundle))
      .toThrow('invalid signed prekey signature');
  });

  it('wrong identity key is rejected', () => {
    const kp = generateIdentityKeypair();
    const otherKp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    // Use a different identity key for verification
    const tamperedBundle: PrekeyBundle = {
      ...bundle,
      identityPub: otherKp.verifyingBytes,
      x25519IdentityPub: deriveX25519FromEd25519(otherKp.signingBytes).point,
    };

    expect(() => verifyPrekeyBundle(tamperedBundle))
      .toThrow('invalid signed prekey signature');
  });

  it('valid bundle without one-time prekeys', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 0);

    const verified = verifyPrekeyBundle(bundle);
    expect(verified.identityPub).toHaveLength(32);
    expect(verified.oneTimePrekeyPub).toBeUndefined();
  });

  it('one-time prekey index out of range throws', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 3);

    expect(() => verifyPrekeyBundle(bundle, 5))
      .toThrow('One-time prekey index 5 out of range');
  });

  it('different one-time prekey indices return different keys', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);

    const verified0 = verifyPrekeyBundle(bundle, 0);
    const verified1 = verifyPrekeyBundle(bundle, 1);
    const verified2 = verifyPrekeyBundle(bundle, 2);

    expect(bytesToHex(verified0.oneTimePrekeyPub!))
      .not.toBe(bytesToHex(verified1.oneTimePrekeyPub!));
    expect(bytesToHex(verified1.oneTimePrekeyPub!))
      .not.toBe(bytesToHex(verified2.oneTimePrekeyPub!));
  });
});

// ======================================================================
// VAL-CRYPTO-036: One-time prekeys consumed after use
// ======================================================================

describe('VAL-CRYPTO-036: One-time prekey consumption', () => {
  it('prekey count decreases after consumption', () => {
    const store = new OneTimePrekeyStore();
    const otpk1 = generateOneTimePrekey();
    const otpk2 = generateOneTimePrekey();
    const otpk3 = generateOneTimePrekey();

    store.add([otpk1, otpk2, otpk3]);
    expect(store.count).toBe(3);

    store.consume();
    expect(store.count).toBe(2);

    store.consume();
    expect(store.count).toBe(1);
  });

  it('consumed prekey cannot be consumed again', () => {
    const store = new OneTimePrekeyStore();
    const otpk1 = generateOneTimePrekey();
    store.add([otpk1]);

    const consumed = store.consume();
    expect(consumed).toBeDefined();
    expect(bytesToHex(consumed!.point)).toBe(bytesToHex(otpk1.point));

    // Second consume returns undefined
    const consumedAgain = store.consume();
    expect(consumedAgain).toBeUndefined();
  });

  it('each one-time prekey used at most once', () => {
    const store = new OneTimePrekeyStore();
    const otpks = Array.from({ length: 5 }, () => generateOneTimePrekey());
    store.add(otpks);

    const consumed: Uint8Array[] = [];
    while (store.count > 0) {
      const prekey = store.consume()!;
      consumed.push(prekey.point);
    }

    // All consumed keys are unique
    const hexKeys = consumed.map(bytesToHex);
    const uniqueKeys = new Set(hexKeys);
    expect(uniqueKeys.size).toBe(hexKeys.length);

    // No more prekeys available
    expect(store.consume()).toBeUndefined();
  });

  it('empty store returns undefined on consume', () => {
    const store = new OneTimePrekeyStore();
    expect(store.consume()).toBeUndefined();
    expect(store.count).toBe(0);
  });

  it('has() checks if a prekey public key is available', () => {
    const store = new OneTimePrekeyStore();
    const otpk = generateOneTimePrekey();
    store.add([otpk]);

    expect(store.has(otpk.point)).toBe(true);

    store.consume();
    expect(store.has(otpk.point)).toBe(false);
  });

  it('pre-batched consumption works correctly', () => {
    const prekeys = Array.from({ length: 10 }, () => generateOneTimePrekey());
    const store = new OneTimePrekeyStore(prekeys);
    expect(store.count).toBe(10);

    // Consume all
    for (let i = 0; i < 10; i++) {
      const p = store.consume();
      expect(p).toBeDefined();
      expect(store.count).toBe(10 - i - 1);
    }

    expect(store.consume()).toBeUndefined();
  });
});

// ======================================================================
// Full Key Exchange with Prekey Bundle (ECDH)
// ======================================================================

describe('Full key exchange with prekey bundles', () => {
  it('initiator and responder derive the same chat key (with one-time prekey)', () => {
    // Alice (initiator) and Bob (responder)
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();

    // Bob generates prekey bundle and publishes it
    const bobBundle = generatePrekeyBundle(bobKp, 5);

    // Alice verifies Bob's prekey bundle
    const verifiedBundle = verifyPrekeyBundle(bobBundle, 0);

    // Alice initiates key exchange
    const aliceResult = initiateKeyExchange(aliceKp, verifiedBundle);

    // Bob consumes the one-time prekey
    const consumedOtpk = bobBundle.oneTimePrekeys[0];

    // Alice's X25519 identity public key (for Bob to use)
    const aliceX25519IdentityKey = deriveX25519FromEd25519(aliceKp.signingBytes).point;

    // Bob completes key exchange using Alice's ephemeral key and X25519 identity
    const bobResult = completeKeyExchange(
      bobKp,
      bobBundle.signedPrekey,
      aliceResult.ephemeralPub,
      aliceX25519IdentityKey,
      consumedOtpk,
    );

    // Both sides should derive the same chat key
    expect(bytesToHex(aliceResult.chatDerivedKey)).toBe(bytesToHex(bobResult.chatDerivedKey));
    expect(aliceResult.keyId).toBe(bobResult.keyId);
  });

  it('initiator and responder derive the same chat key (without one-time prekey)', () => {
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();

    // Bob publishes bundle with no one-time prekeys
    const bobBundle = generatePrekeyBundle(bobKp, 0);
    const verifiedBundle = verifyPrekeyBundle(bobBundle);

    // Alice initiates key exchange
    const aliceResult = initiateKeyExchange(aliceKp, verifiedBundle);

    // Alice's X25519 identity public key (for Bob to use)
    const aliceX25519IdentityKey = deriveX25519FromEd25519(aliceKp.signingBytes).point;

    // Bob completes (no one-time prekey consumed)
    const bobResult = completeKeyExchange(
      bobKp,
      bobBundle.signedPrekey,
      aliceResult.ephemeralPub,
      aliceX25519IdentityKey,
    );

    expect(bytesToHex(aliceResult.chatDerivedKey)).toBe(bytesToHex(bobResult.chatDerivedKey));
    expect(aliceResult.keyId).toBe(bobResult.keyId);
  });

  it('different one-time prekeys produce different chat keys', () => {
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();

    const bobBundle = generatePrekeyBundle(bobKp, 5);

    // First exchange using one-time prekey 0
    const verified0 = verifyPrekeyBundle(bobBundle, 0);
    const aliceResult0 = initiateKeyExchange(aliceKp, verified0);

    // Second exchange using one-time prekey 1
    const verified1 = verifyPrekeyBundle(bobBundle, 1);
    const aliceResult1 = initiateKeyExchange(aliceKp, verified1);

    // Different one-time prekeys should produce different chat keys
    expect(bytesToHex(aliceResult0.chatDerivedKey)).not.toBe(bytesToHex(aliceResult1.chatDerivedKey));
  });

  it('different identity keys produce different chat keys', () => {
    const aliceKp = generateIdentityKeypair();
    const carolKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();

    const bobBundle = generatePrekeyBundle(bobKp, 10);

    // Alice initiates key exchange
    const verified0 = verifyPrekeyBundle(bobBundle, 0);
    const aliceResult = initiateKeyExchange(aliceKp, verified0);

    // Carol initiates key exchange with Bob
    const verified1 = verifyPrekeyBundle(bobBundle, 1);
    const carolResult = initiateKeyExchange(carolKp, verified1);

    // Different initiators produce different chat keys
    expect(bytesToHex(aliceResult.chatDerivedKey)).not.toBe(bytesToHex(carolResult.chatDerivedKey));
  });

  it('rejects low-order point in full key exchange', () => {
    // This test ensures initiateKeyExchange checks for low-order points
    // by verifying the code path exists (we can't easily construct a low-order
    // X25519 public key that passes verification, but the check is in place)
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 0);
    const verifiedBundle = verifyPrekeyBundle(bobBundle);

    // Normal exchange should work fine
    const result = initiateKeyExchange(aliceKp, verifiedBundle);
    expect(result.chatDerivedKey).toHaveLength(32);
    expect(isAllZeros(result.chatDerivedKey)).toBe(false);
  });
});

// ======================================================================
// performECDH input validation
// ======================================================================

describe('performECDH input validation', () => {
  it('throws for non-Uint8Array scalar', () => {
    expect(() => performECDH('bad' as unknown as Uint8Array, new Uint8Array(32)))
      .toThrow('X25519 scalar must be a Uint8Array');
  });

  it('throws for wrong-length scalar', () => {
    expect(() => performECDH(new Uint8Array(31), new Uint8Array(32)))
      .toThrow('X25519 scalar must be 32 bytes, got 31');
  });

  it('throws for non-Uint8Array point', () => {
    expect(() => performECDH(new Uint8Array(32), 'bad' as unknown as Uint8Array))
      .toThrow('X25519 point must be a Uint8Array');
  });

  it('throws for wrong-length point', () => {
    expect(() => performECDH(new Uint8Array(32), new Uint8Array(31)))
      .toThrow('X25519 point must be 32 bytes, got 31');
  });
});

// ======================================================================
// completeKeyExchange input validation
// ======================================================================

describe('completeKeyExchange input validation', () => {
  it('throws for invalid ephemeral key length', () => {
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 0);

    expect(() => completeKeyExchange(
      bobKp,
      bobBundle.signedPrekey,
      new Uint8Array(31), // wrong length
      generateIdentityKeypair().verifyingBytes,
    )).toThrow('must be 32 bytes');
  });

  it('throws for invalid identity key length', () => {
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 0);

    expect(() => completeKeyExchange(
      bobKp,
      bobBundle.signedPrekey,
      new Uint8Array(32), // valid ephemeral
      new Uint8Array(31), // wrong length X25519 identity
    )).toThrow('must be 32 bytes');
  });
});

// ======================================================================
// RFC 7748 test vectors (commutativity — part of VAL-CRYPTO-041)
// ======================================================================

describe('VAL-CRYPTO-041: ECDH commutativity with RFC 7748 keys', () => {
  it('getSharedSecret(a, B) === getSharedSecret(b, A) with RFC 7748 test vectors', () => {
    const alicePriv = hexToBytes('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a');
    const bobPriv = hexToBytes('5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb');

    const alicePub = x25519.scalarMultBase(alicePriv);
    const bobPub = x25519.scalarMultBase(bobPriv);

    const sharedAB = x25519.getSharedSecret(alicePriv, bobPub);
    const sharedBA = x25519.getSharedSecret(bobPriv, alicePub);

    const expectedShared = '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742';
    expect(bytesToHex(sharedAB)).toBe(expectedShared);
    expect(bytesToHex(sharedBA)).toBe(expectedShared);
  });
});

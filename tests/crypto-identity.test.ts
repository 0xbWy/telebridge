/**
 * TeleBridge — Identity Layer (Layer 1) Unit Tests
 *
 * VAL-CRYPTO-001: Ed25519 keypair generation produces valid keypair
 * VAL-CRYPTO-002: X25519 derivation from Ed25519 identity key
 * VAL-CRYPTO-003: Reject malformed or wrong-length keys
 * VAL-CRYPTO-040: Ed25519 sign/verify round-trip
 * VAL-CRYPTO-041: X25519 ECDH with RFC 7748 test vectors
 */
import {
  generateIdentityKeypair,
  generateIdentityKeypairFromSeed,
  deriveX25519FromEd25519,
  signBytes,
  verifySignature,
  computeSharedSecret,
} from '../src/telebridge/crypto/identity';

import { ed25519, x25519 } from '@noble/curves/ed25519.js';

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
// VAL-CRYPTO-001: Ed25519 keypair generation produces valid keypair
// ======================================================================

describe('VAL-CRYPTO-001: Ed25519 keypair generation', () => {
  it('generates a valid Ed25519 keypair with 32-byte keys', () => {
    const kp = generateIdentityKeypair();
    expect(kp.signingBytes).toHaveLength(32);
    expect(kp.verifyingBytes).toHaveLength(32);
  });

  it('produces different secret and public keys', () => {
    const kp = generateIdentityKeypair();
    expect(bytesToHex(kp.signingBytes)).not.toBe(bytesToHex(kp.verifyingBytes));
  });

  it('produces different keypairs across invocations', () => {
    const kp1 = generateIdentityKeypair();
    const kp2 = generateIdentityKeypair();
    expect(bytesToHex(kp1.signingBytes)).not.toBe(bytesToHex(kp2.signingBytes));
    expect(bytesToHex(kp1.verifyingBytes)).not.toBe(bytesToHex(kp2.verifyingBytes));
  });

  it('is deterministic from the same seed', () => {
    const seed = new Uint8Array(32);
    crypto.getRandomValues(seed);
    const kp1 = generateIdentityKeypairFromSeed(seed);
    const kp2 = generateIdentityKeypairFromSeed(seed);
    expect(bytesToHex(kp1.signingBytes)).toBe(bytesToHex(kp2.signingBytes));
    expect(bytesToHex(kp1.verifyingBytes)).toBe(bytesToHex(kp2.verifyingBytes));
  });

  it('different seeds produce different keypairs', () => {
    const seed1 = new Uint8Array(32).fill(1);
    const seed2 = new Uint8Array(32).fill(2);
    const kp1 = generateIdentityKeypairFromSeed(seed1);
    const kp2 = generateIdentityKeypairFromSeed(seed2);
    expect(bytesToHex(kp1.signingBytes)).not.toBe(bytesToHex(kp2.signingBytes));
    expect(bytesToHex(kp1.verifyingBytes)).not.toBe(bytesToHex(kp2.verifyingBytes));
  });

  it('generated keypair can sign and verify', () => {
    const kp = generateIdentityKeypair();
    const data = new TextEncoder().encode('TeleBridge identity test');
    const sig = signBytes(kp.signingBytes, data);
    expect(verifySignature(kp.verifyingBytes, sig, data)).toBe(true);
  });
});

// ======================================================================
// VAL-CRYPTO-002: X25519 derivation from Ed25519 identity key
// ======================================================================

describe('VAL-CRYPTO-002: X25519 derivation from Ed25519', () => {
  it('derives valid 32-byte X25519 keypair from Ed25519', () => {
    const kp = generateIdentityKeypair();
    const xkp = deriveX25519FromEd25519(kp.signingBytes);
    expect(xkp.scalar).toHaveLength(32);
    expect(xkp.point).toHaveLength(32);
  });

  it('derivation is deterministic', () => {
    const kp = generateIdentityKeypair();
    const x1 = deriveX25519FromEd25519(kp.signingBytes);
    const x2 = deriveX25519FromEd25519(kp.signingBytes);
    expect(bytesToHex(x1.scalar)).toBe(bytesToHex(x2.scalar));
    expect(bytesToHex(x1.point)).toBe(bytesToHex(x2.point));
  });

  it('X25519 derived key enables ECDH with matching shared secrets', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    // ECDH: both sides compute same shared secret
    const sharedAB = computeSharedSecret(aliceX.scalar, bobX.point);
    const sharedBA = computeSharedSecret(bobX.scalar, aliceX.point);

    expect(bytesToHex(sharedAB)).toBe(bytesToHex(sharedBA));
  });

  it('shared secret is 32 bytes and not all-zeros', () => {
    const alice = generateIdentityKeypair();
    const bob = generateIdentityKeypair();
    const aliceX = deriveX25519FromEd25519(alice.signingBytes);
    const bobX = deriveX25519FromEd25519(bob.signingBytes);

    const shared = computeSharedSecret(aliceX.scalar, bobX.point);
    expect(shared).toHaveLength(32);
    expect(isAllZeros(shared)).toBe(false);
  });

  it('different Ed25519 keys produce different X25519 public keys', () => {
    const kp1 = generateIdentityKeypair();
    const kp2 = generateIdentityKeypair();
    const x1 = deriveX25519FromEd25519(kp1.signingBytes);
    const x2 = deriveX25519FromEd25519(kp2.signingBytes);
    expect(bytesToHex(x1.point)).not.toBe(bytesToHex(x2.point));
  });
});

// ======================================================================
// VAL-CRYPTO-003: Reject malformed or wrong-length keys
// ======================================================================

describe('VAL-CRYPTO-003: Input validation', () => {
  describe('generateIdentityKeypairFromSeed', () => {
    it('throws for non-Uint8Array input', () => {
      expect(() => generateIdentityKeypairFromSeed('bad' as unknown as Uint8Array))
        .toThrow('Seed must be a Uint8Array');
    });

    it('throws for null input', () => {
      expect(() => generateIdentityKeypairFromSeed(null as unknown as Uint8Array))
        .toThrow('Seed must be a Uint8Array');
    });

    it('throws for undefined input', () => {
      expect(() => generateIdentityKeypairFromSeed(undefined as unknown as Uint8Array))
        .toThrow('Seed must be a Uint8Array');
    });

    it('throws for wrong length (31 bytes)', () => {
      expect(() => generateIdentityKeypairFromSeed(new Uint8Array(31)))
        .toThrow('Seed must be 32 bytes, got 31');
    });

    it('throws for wrong length (33 bytes)', () => {
      expect(() => generateIdentityKeypairFromSeed(new Uint8Array(33)))
        .toThrow('Seed must be 32 bytes, got 33');
    });

    it('throws for empty Uint8Array', () => {
      expect(() => generateIdentityKeypairFromSeed(new Uint8Array(0)))
        .toThrow('Seed must be 32 bytes, got 0');
    });
  });

  describe('deriveX25519FromEd25519', () => {
    it('throws for non-Uint8Array input', () => {
      expect(() => deriveX25519FromEd25519('bad' as unknown as Uint8Array))
        .toThrow('Ed25519 signing bytes must be a Uint8Array');
    });

    it('throws for null input', () => {
      expect(() => deriveX25519FromEd25519(null as unknown as Uint8Array))
        .toThrow('Ed25519 signing bytes must be a Uint8Array');
    });

    it('throws for undefined input', () => {
      expect(() => deriveX25519FromEd25519(undefined as unknown as Uint8Array))
        .toThrow('Ed25519 signing bytes must be a Uint8Array');
    });

    it('throws for wrong length (31 bytes)', () => {
      expect(() => deriveX25519FromEd25519(new Uint8Array(31)))
        .toThrow('Ed25519 signing bytes must be 32 bytes, got 31');
    });

    it('throws for wrong length (33 bytes)', () => {
      expect(() => deriveX25519FromEd25519(new Uint8Array(33)))
        .toThrow('Ed25519 signing bytes must be 32 bytes, got 33');
    });

    it('throws for empty Uint8Array', () => {
      expect(() => deriveX25519FromEd25519(new Uint8Array(0)))
        .toThrow('Ed25519 signing bytes must be 32 bytes, got 0');
    });
  });

  describe('signBytes', () => {
    it('throws for non-Uint8Array private key', () => {
      expect(() => signBytes('bad' as unknown as Uint8Array, new Uint8Array(1)))
        .toThrow('Signing bytes must be a Uint8Array');
    });

    it('throws for wrong-length private key', () => {
      expect(() => signBytes(new Uint8Array(31), new Uint8Array(1)))
        .toThrow('Signing bytes must be 32 bytes, got 31');
    });

    it('throws for non-Uint8Array data', () => {
      const kp = generateIdentityKeypair();
      expect(() => signBytes(kp.signingBytes, 'bad' as unknown as Uint8Array))
        .toThrow('Data to sign must be a Uint8Array');
    });
  });

  describe('verifySignature', () => {
    it('throws for non-Uint8Array public key', () => {
      expect(() => verifySignature('bad' as unknown as Uint8Array, new Uint8Array(64), new Uint8Array(1)))
        .toThrow('Verifying bytes must be a Uint8Array');
    });

    it('throws for wrong-length public key', () => {
      expect(() => verifySignature(new Uint8Array(31), new Uint8Array(64), new Uint8Array(1)))
        .toThrow('Verifying bytes must be 32 bytes, got 31');
    });

    it('throws for non-Uint8Array signature', () => {
      expect(() => verifySignature(new Uint8Array(32), 'bad' as unknown as Uint8Array, new Uint8Array(1)))
        .toThrow('Signature must be a Uint8Array');
    });

    it('throws for wrong-length signature', () => {
      expect(() => verifySignature(new Uint8Array(32), new Uint8Array(32), new Uint8Array(1)))
        .toThrow('Signature must be 64 bytes, got 32');
    });

    it('throws for non-Uint8Array data', () => {
      expect(() => verifySignature(new Uint8Array(32), new Uint8Array(64), 'bad' as unknown as Uint8Array))
        .toThrow('Data to verify must be a Uint8Array');
    });
  });

  describe('computeSharedSecret', () => {
    it('throws for non-Uint8Array private key', () => {
      expect(() => computeSharedSecret('bad' as unknown as Uint8Array, new Uint8Array(32)))
        .toThrow('X25519 scalar must be a Uint8Array');
    });

    it('throws for wrong-length private key', () => {
      expect(() => computeSharedSecret(new Uint8Array(31), new Uint8Array(32)))
        .toThrow('X25519 scalar must be 32 bytes, got 31');
    });

    it('throws for non-Uint8Array public key', () => {
      expect(() => computeSharedSecret(new Uint8Array(32), 'bad' as unknown as Uint8Array))
        .toThrow('X25519 point must be a Uint8Array');
    });

    it('throws for wrong-length public key', () => {
      expect(() => computeSharedSecret(new Uint8Array(32), new Uint8Array(31)))
        .toThrow('X25519 point must be 32 bytes, got 31');
    });
  });
});

// ======================================================================
// VAL-CRYPTO-040: Ed25519 sign/verify round-trip
// ======================================================================

describe('VAL-CRYPTO-040: Ed25519 sign/verify round-trip', () => {
  it('signs and verifies correctly', () => {
    const kp = generateIdentityKeypair();
    const data = new TextEncoder().encode('hello telebridge');
    const sig = signBytes(kp.signingBytes, data);
    expect(sig).toHaveLength(64);
    expect(verifySignature(kp.verifyingBytes, sig, data)).toBe(true);
  });

  it('rejects tampered data', () => {
    const kp = generateIdentityKeypair();
    const data = new TextEncoder().encode('hello telebridge');
    const sig = signBytes(kp.signingBytes, data);
    const tampered = new TextEncoder().encode('hello telebridgf');
    expect(verifySignature(kp.verifyingBytes, sig, tampered)).toBe(false);
  });

  it('rejects signature with wrong key', () => {
    const kp1 = generateIdentityKeypair();
    const kp2 = generateIdentityKeypair();
    const data = new TextEncoder().encode('hello');
    const sig = signBytes(kp1.signingBytes, data);
    expect(verifySignature(kp2.verifyingBytes, sig, data)).toBe(false);
  });

  it('signs empty data', () => {
    const kp = generateIdentityKeypair();
    const data = new Uint8Array(0);
    const sig = signBytes(kp.signingBytes, data);
    expect(sig).toHaveLength(64);
    expect(verifySignature(kp.verifyingBytes, sig, data)).toBe(true);
  });

  it('signs and verifies unicode data', () => {
    const kp = generateIdentityKeypair();
    const data = new TextEncoder().encode('🔐 TeleBridge E2E 加密');
    const sig = signBytes(kp.signingBytes, data);
    expect(verifySignature(kp.verifyingBytes, sig, data)).toBe(true);
  });

  it('signs and verifies large data', () => {
    const kp = generateIdentityKeypair();
    const data = new Uint8Array(10000);
    crypto.getRandomValues(data);
    const sig = signBytes(kp.signingBytes, data);
    expect(verifySignature(kp.verifyingBytes, sig, data)).toBe(true);
  });
});

// ======================================================================
// VAL-CRYPTO-041: X25519 ECDH with RFC 7748 test vectors
// ======================================================================

describe('VAL-CRYPTO-041: X25519 ECDH with RFC 7748 test vectors', () => {
  // RFC 7748 Section 5.2 test vectors (scalar multiplication)
  it('matches RFC 7748 scalar multiplication test vector 1', () => {
    // Input scalar
    const scalar = hexToBytes('a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4');
    // Input u-coordinate
    const u = hexToBytes('e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c');
    // Expected output
    const expectedOutput = 'c3da55379de9c6908e94ea4df28d084f32eccf03491c71f754b4075577a28552';

    const result = x25519.scalarMult(scalar, u);
    expect(bytesToHex(result)).toBe(expectedOutput);
  });

  it('matches RFC 7748 scalar multiplication test vector 2', () => {
    const scalar = hexToBytes('4b66e9d4d1b4673c5ad22691957d6af5c11b6421e0ea01d42ca4169e7918ba0d');
    const u = hexToBytes('e5210f12786811d3f4b7959d0538ae2c31dbe7106fc03c3efc4cd549c715a493');
    const expectedOutput = '95cbde9476e8907d7aade45cb4b873f88b595a68799fa152e6f8f7647aac7957';

    const result = x25519.scalarMult(scalar, u);
    expect(bytesToHex(result)).toBe(expectedOutput);
  });

  // RFC 7748 Section 6.1 Diffie-Hellman test vectors
  it('matches RFC 7748 DH test vector: Alice public key', () => {
    const alicePriv = hexToBytes('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a');
    const expectedAlicePub = '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a';

    const alicePub = x25519.scalarMultBase(alicePriv);
    expect(bytesToHex(alicePub)).toBe(expectedAlicePub);
  });

  it('matches RFC 7748 DH test vector: Bob public key', () => {
    const bobPriv = hexToBytes('5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb');
    const expectedBobPub = 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f';

    const bobPub = x25519.scalarMultBase(bobPriv);
    expect(bytesToHex(bobPub)).toBe(expectedBobPub);
  });

  it('matches RFC 7748 DH test vector: shared secret', () => {
    const alicePriv = hexToBytes('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a');
    const bobPriv = hexToBytes('5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb');
    const expectedShared = '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742';

    const alicePub = x25519.scalarMultBase(alicePriv);
    const bobPub = x25519.scalarMultBase(bobPriv);

    const sharedAB = x25519.scalarMult(alicePriv, bobPub);
    const sharedBA = x25519.scalarMult(bobPriv, alicePub);

    expect(bytesToHex(sharedAB)).toBe(expectedShared);
    expect(bytesToHex(sharedBA)).toBe(expectedShared);
  });

  // RFC 7748 Section 5.2 iterative test
  it('matches RFC 7748 iterative test (1 iteration)', () => {
    const k = new Uint8Array(32);
    k[0] = 9;
    const u = new Uint8Array(32);
    u[0] = 9;
    const expected = '422c8e7a6227d7bca1350b3e2bb7279f7897b87bb6854b783c60e80311ae3079';

    const result = x25519.scalarMult(k, u);
    expect(bytesToHex(result)).toBe(expected);
  });

  // Verify ECDH commutativity with random keys (generic)
  it('ECDH is commutative: getSharedSecret(a, B) === getSharedSecret(b, A)', () => {
    const alice = x25519.keygen();
    const bob = x25519.keygen();
    const sharedAB = x25519.getSharedSecret(alice.secretKey, bob.publicKey);
    const sharedBA = x25519.getSharedSecret(bob.secretKey, alice.publicKey);
    expect(bytesToHex(sharedAB)).toBe(bytesToHex(sharedBA));
  });
});

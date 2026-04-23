/**
 * TeleBridge — Identity Layer (Layer 1)
 * Ed25519 keypair generation, X25519 derivation, signing and verification.
 */
import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { sha512 } from '@noble/hashes/sha2.js';

/** Ed25519 identity keypair (32-byte secret, 32-byte public). */
export interface IdentityKeypair {
  /** Ed25519 32-byte signing bytes */
  readonly signingBytes: Uint8Array;
  /** Ed25519 32-byte verifying bytes */
  readonly verifyingBytes: Uint8Array;
}

/** X25519 keypair derived from Ed25519 (32-byte secret, 32-byte public). */
export interface X25519Keypair {
  /** X25519 32-byte scalar */
  readonly scalar: Uint8Array;
  /** X25519 32-byte point */
  readonly point: Uint8Array;
}

const KEY_LENGTH = 32;

/** Check if value is a Uint8Array-like typed array (handles cross-realm instances). */
function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

/**
 * Generate a new Ed25519 identity keypair.
 * Returns 32-byte private key and 32-byte public key.
 * Different invocations produce different keypairs.
 */
export function generateIdentityKeypair(): IdentityKeypair {
  const { secretKey: edSecret, publicKey: edPublic } = ed25519.keygen();

  return {
    signingBytes: edSecret,
    verifyingBytes: edPublic,
  };
}

/**
 * Generate a deterministic Ed25519 identity keypair from a 32-byte seed.
 * Same seed always produces the same keypair.
 */
export function generateIdentityKeypairFromSeed(seed: Uint8Array): IdentityKeypair {
  if (!isUint8Array(seed)) {
    throw new Error('Seed must be a Uint8Array');
  }
  if (seed.length !== KEY_LENGTH) {
    throw new Error(`Seed must be ${KEY_LENGTH} bytes, got ${seed.length}`);
  }

  const { secretKey: edSecret, publicKey: edPublic } = ed25519.keygen(seed);

  return {
    signingBytes: edSecret,
    verifyingBytes: edPublic,
  };
}

/**
 * Derive an X25519 keypair from an Ed25519 private key.
 * The Ed25519 private key is hashed and clamped to produce a valid X25519 private key.
 * This enables ECDH key exchange using the same identity key.
 */
export function deriveX25519FromEd25519(signingBytes: Uint8Array): X25519Keypair {
  if (!isUint8Array(signingBytes)) {
    throw new Error('Ed25519 signing bytes must be a Uint8Array');
  }
  if (signingBytes.length !== KEY_LENGTH) {
    throw new Error(`Ed25519 signing bytes must be ${KEY_LENGTH} bytes, got ${signingBytes.length}`);
  }

  // Standard Ed25519-to-Curve25519 conversion (per libsodium / Signal):
  // Hash Ed25519 signing bytes with SHA-512, take first 32 bytes, then clamp
  // for Montgomery ladder use. x25519.keygen() handles clamping internally.
  const hash = sha512(signingBytes);
  const x25519Seed = hash.slice(0, KEY_LENGTH);
  const { secretKey: xScalar, publicKey: xPoint } = x25519.keygen(x25519Seed);

  return {
    scalar: xScalar,
    point: xPoint,
  };
}

/**
 * Sign data with an Ed25519 private key.
 * Returns a 64-byte signature.
 */
export function signBytes(signingBytes: Uint8Array, data: Uint8Array): Uint8Array {
  if (!isUint8Array(signingBytes)) {
    throw new Error('Signing bytes must be a Uint8Array');
  }
  if (signingBytes.length !== KEY_LENGTH) {
    throw new Error(`Signing bytes must be ${KEY_LENGTH} bytes, got ${signingBytes.length}`);
  }
  if (!isUint8Array(data)) {
    throw new Error('Data to sign must be a Uint8Array');
  }

  return ed25519.sign(data, signingBytes);
}

/**
 * Verify an Ed25519 signature against a public key.
 * Returns true if the signature is valid, false otherwise.
 */
export function verifySignature(
  verifyingBytes: Uint8Array,
  signature: Uint8Array,
  data: Uint8Array,
): boolean {
  if (!isUint8Array(verifyingBytes)) {
    throw new Error('Verifying bytes must be a Uint8Array');
  }
  if (verifyingBytes.length !== KEY_LENGTH) {
    throw new Error(`Verifying bytes must be ${KEY_LENGTH} bytes, got ${verifyingBytes.length}`);
  }
  if (!isUint8Array(signature)) {
    throw new Error('Signature must be a Uint8Array');
  }
  if (signature.length !== 64) {
    throw new Error(`Signature must be 64 bytes, got ${signature.length}`);
  }
  if (!isUint8Array(data)) {
    throw new Error('Data to verify must be a Uint8Array');
  }

  try {
    return ed25519.verify(signature, data, verifyingBytes);
  } catch {
    return false;
  }
}

/**
 * Compute a shared secret using X25519 ECDH.
 * Both parties compute the same shared secret: X25519(a, B) === X25519(b, A).
 * Rejects low-order point inputs (all-zero shared secret).
 */
export function computeSharedSecret(
  scalar: Uint8Array,
  point: Uint8Array,
): Uint8Array {
  if (!isUint8Array(scalar)) {
    throw new Error('X25519 scalar must be a Uint8Array');
  }
  if (scalar.length !== KEY_LENGTH) {
    throw new Error(`X25519 scalar must be ${KEY_LENGTH} bytes, got ${scalar.length}`);
  }
  if (!isUint8Array(point)) {
    throw new Error('X25519 point must be a Uint8Array');
  }
  if (point.length !== KEY_LENGTH) {
    throw new Error(`X25519 point must be ${KEY_LENGTH} bytes, got ${point.length}`);
  }

  return x25519.getSharedSecret(scalar, point);
}

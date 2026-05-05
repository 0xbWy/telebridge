/**
 * TeleBridge — Key Exchange Layer (Layer 2)
 * X25519 ECDH key agreement, HKDF-SHA256 per-chat key derivation,
 * prekey bundles with signed prekeys and one-time prekeys.
 */
import { x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

import type { IdentityKeypair, X25519Keypair } from './identity';

import {
  deriveX25519FromEd25519,
  signBytes,
  verifySignature,
} from './identity';

// ---------- Constants ----------

const KEY_LENGTH = 32;
const _SIGNATURE_LENGTH = 64;

/** HKDF info string for per-chat key derivation. */
const CHAT_KEY_INFO = new TextEncoder().encode('TeleBridge-ChatKey-v1');

/** HKDF info string for signed prekey sub-key derivation. */
const _SIGNED_PREKEY_INFO = new TextEncoder().encode('TeleBridge-SignedPrekey-v1');

/**
 * HKDF info string for key rotation derivation.
 * Domain-separated from CHAT_KEY_INFO to ensure that
 * rotation ECDH output cannot be used as a chat key and vice versa.
 */
export const ROTATION_KEY_INFO = new TextEncoder().encode('TeleBridge-Rotation-v1');

// ---------- Low-order point protection ----------

/** All-zero 32-byte constant for comparison. */
const _ZERO_32 = new Uint8Array(KEY_LENGTH);

/**
 * Check if a DH output is all-zeros (indicating a low-order point attack).
 * Returns true if the DH output is all-zeros.
 */
function isAllZeros(bytes: Uint8Array): boolean {
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] !== 0) return false;
  }
  return true;
}

// ---------- HKDF Key Derivation ----------

/**
 * Derive a per-chat AES-256 key from ECDH output using HKDF-SHA256.
 * Uses TeleBridge-specific info string for domain separation.
 * Rejects low-order point (all-zero) output.
 *
 * @param dhOutput - Raw X25519 ECDH output (32 bytes for single DH,
 *   or concatenated DH outputs for X3DH: 96/128 bytes)
 * @param info - App-specific HKDF info string (defaults to CHAT_KEY_INFO)
 * @param salt - Optional salt (defaults to 32 zero bytes)
 * @returns 32-byte AES-256 derived key
 * @throws Error if ECDH output is all-zeros (low-order point)
 */
export function deriveChatKey(
  dhOutput: Uint8Array,
  info: Uint8Array = CHAT_KEY_INFO,
  salt: Uint8Array = new Uint8Array(KEY_LENGTH),
): Uint8Array {
  if (!(dhOutput instanceof Uint8Array)) {
    throw new Error('ECDH output must be a Uint8Array');
  }
  if (dhOutput.length === 0) {
    throw new Error('ECDH output must not be empty');
  }

  // Low-order point protection: reject all-zero output
  if (isAllZeros(dhOutput)) {
    throw new Error('Low-order point detected: ECDH output is all-zeros');
  }

  return new Uint8Array(hkdf(sha256, dhOutput, salt, info, KEY_LENGTH));
}

// ---------- ECDH Key Agreement ----------

/**
 * Result of a key exchange: the derived chat key and the key ID.
 */
export interface ChatKeyResult {
  /** Derive 32-byte AES-256 per-chat derived key. */
  readonly chatDerivedKey: Uint8Array;
  /** Short key identifier (hex of first 4 bytes of chatDerivedKey). */
  readonly keyId: string;
}

/**
 * Perform X25519 ECDH key agreement and derive a per-chat AES-256 key.
 * This is the core operation for establishing shared chat keys.
 *
 * Both parties call this with their own X25519 private key and the other's
 * X25519 public key, producing the same derived chat key (ECDH commutativity).
 *
 * @param myX25519Scalar - Our X25519 private scalar (32 bytes)
 * @param theirX25519Point - Their X25519 public point (32 bytes)
 * @param info - HKDF info string for domain separation
 * @throws Error on low-order point (all-zero ECDH output)
 */
export function performECDH(
  myX25519Scalar: Uint8Array,
  theirX25519Point: Uint8Array,
  info: Uint8Array = CHAT_KEY_INFO,
): ChatKeyResult {
  if (!(myX25519Scalar instanceof Uint8Array)) {
    throw new Error('X25519 scalar must be a Uint8Array');
  }
  if (myX25519Scalar.length !== KEY_LENGTH) {
    throw new Error(`X25519 scalar must be ${KEY_LENGTH} bytes, got ${myX25519Scalar.length}`);
  }
  if (!(theirX25519Point instanceof Uint8Array)) {
    throw new Error('X25519 point must be a Uint8Array');
  }
  if (theirX25519Point.length !== KEY_LENGTH) {
    throw new Error(`X25519 point must be ${KEY_LENGTH} bytes, got ${theirX25519Point.length}`);
  }

  // Raw X25519 Diffie-Hellman
  const ecdhResult = x25519.getSharedSecret(myX25519Scalar, theirX25519Point);

  // Low-order point protection — reject all-zero result
  if (isAllZeros(ecdhResult)) {
    throw new Error('Low-order point detected: ECDH produced all-zero result');
  }

  // Derive per-chat derived key via HKDF-SHA256 with app-specific info string
  const chatDerivedKey = deriveChatKey(ecdhResult, info);

  // Generate short key ID (first 4 bytes as hex)
  const keyId = Array.from(chatDerivedKey.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { chatDerivedKey, keyId };
}

// ---------- Prekey Bundles ----------

/**
 * A signed prekey: an X25519 keypair signed by the identity Ed25519 key.
 */
export interface SignedPrekey {
  /** X25519 public point (32 bytes). */
  readonly pub: Uint8Array;
  /** X25519 private scalar (32 bytes). */
  readonly priv: Uint8Array;
  /** Ed25519 signature over the public point (64 bytes). */
  readonly signature: Uint8Array;
}

/**
 * A prekey bundle for initial session establishment (Signal-style).
 * Contains identity key, signed prekey, and optional one-time prekeys.
 */
export interface PrekeyBundle {
  /** Ed25519 identity verifying bytes (32 bytes). */
  readonly identityPub: Uint8Array;
  /** X25519 identity pub derived from Ed25519 (32 bytes). */
  readonly x25519IdentityPub: Uint8Array;
  /** Signed prekey (medium-term, signed by identity). */
  readonly signedPrekey: SignedPrekey;
  /** One-time prekeys (consumed after use). */
  readonly oneTimePrekeys: X25519Keypair[];
}

/**
 * Generate a signed prekey: a fresh X25519 keypair signed by the identity key.
 */
export function generateSignedPrekey(identitySigningBytes: Uint8Array): SignedPrekey {
  if (!(identitySigningBytes instanceof Uint8Array)) {
    throw new Error('Identity signing bytes must be a Uint8Array');
  }
  if (identitySigningBytes.length !== KEY_LENGTH) {
    throw new Error(`Identity signing bytes must be ${KEY_LENGTH} bytes, got ${identitySigningBytes.length}`);
  }

  // Generate fresh X25519 keypair for the signed prekey
  const { secretKey: priv, publicKey: pub } = x25519.keygen();

  // Sign the prekey's public point with the Ed25519 identity key
  const signature = signBytes(identitySigningBytes, pub);

  return { pub, priv, signature };
}

/**
 * Generate a single one-time prekey (X25519 keypair).
 * One-time prekeys are consumed when used in a key exchange.
 */
export function generateOneTimePrekey(): X25519Keypair {
  const { secretKey: scalar, publicKey: point } = x25519.keygen();
  return { scalar, point };
}

/**
 * Generate a complete prekey bundle with identity key, signed prekey,
 * and the specified number of one-time prekeys.
 */
export function generatePrekeyBundle(
  identityKeypair: IdentityKeypair,
  numOneTimePrekeys: number = 100,
): PrekeyBundle {
  const x25519Identity = deriveX25519FromEd25519(identityKeypair.signingBytes);
  const signedPrekey = generateSignedPrekey(identityKeypair.signingBytes);
  const oneTimePrekeys: X25519Keypair[] = [];

  for (let i = 0; i < numOneTimePrekeys; i++) {
    oneTimePrekeys.push(generateOneTimePrekey());
  }

  return {
    identityPub: identityKeypair.verifyingBytes,
    x25519IdentityPub: x25519Identity.point,
    signedPrekey,
    oneTimePrekeys,
  };
}

// ---------- Prekey Bundle Verification ----------

/**
 * Result of verifying a prekey bundle.
 */
export interface VerifiedPrekeyBundle {
  /** Ed25519 identity verifying bytes. */
  readonly identityPub: Uint8Array;
  /** X25519 identity pub. */
  readonly x25519IdentityPub: Uint8Array;
  /** Verified signed prekey pub. */
  readonly signedPrekeyPub: Uint8Array;
  /** Signed prekey signature (verified). */
  readonly signedPrekeySignature: Uint8Array;
  /** Consumed one-time prekey pub (if available). */
  readonly oneTimePrekeyPub: Uint8Array | undefined;
}

/**
 * Verify a prekey bundle's signed prekey signature.
 * Returns the verified bundle if valid, or throws on invalid signature.
 *
 * @param bundle - Prekey bundle to verify
 * @param oneTimePrekeyIndex - Which one-time prekey to consume (default: 0)
 * @returns Verified prekey bundle with validated signature
 * @throws Error if signed prekey signature is invalid
 */
export function verifyPrekeyBundle(
  bundle: PrekeyBundle,
  oneTimePrekeyIndex: number = 0,
): VerifiedPrekeyBundle {
  // Verify the signed prekey signature
  const isValid = verifySignature(
    bundle.identityPub,
    bundle.signedPrekey.signature,
    bundle.signedPrekey.pub,
  );

  if (!isValid) {
    throw new Error('Prekey bundle verification failed: invalid signed prekey signature');
  }

  // Get one-time prekey if available
  let oneTimePrekeyPub: Uint8Array | undefined;
  if (bundle.oneTimePrekeys.length > 0) {
    if (oneTimePrekeyIndex >= bundle.oneTimePrekeys.length) {
      throw new Error(
        `One-time prekey index ${oneTimePrekeyIndex} out of range (have ${bundle.oneTimePrekeys.length})`,
      );
    }
    oneTimePrekeyPub = bundle.oneTimePrekeys[oneTimePrekeyIndex].point;
  }

  return {
    identityPub: bundle.identityPub,
    x25519IdentityPub: bundle.x25519IdentityPub,
    signedPrekeyPub: bundle.signedPrekey.pub,
    signedPrekeySignature: bundle.signedPrekey.signature,
    oneTimePrekeyPub,
  };
}

// ---------- One-Time Prekey Management ----------

/**
 * Manager for one-time prekeys. Tracks prekey usage and ensures each
 * prekey is consumed at most once.
 */
export class OneTimePrekeyStore {
  private available: X25519Keypair[] = [];

  constructor(prekeys: X25519Keypair[] = []) {
    this.available = [...prekeys];
  }

  /**
   * Get the number of available one-time prekeys.
   */
  get count(): number {
    return this.available.length;
  }

  /**
   * Add more one-time prekeys to the store.
   */
  add(prekeys: X25519Keypair[]): void {
    this.available.push(...prekeys);
  }

  /**
   * Consume a one-time prekey. Each prekey can only be consumed once.
   * @returns The consumed prekey, or undefined if none available
   */
  consume(): X25519Keypair | undefined {
    if (this.available.length === 0) return undefined;
    return this.available.shift();
  }

  /**
   * Check if a specific one-time prekey public key is available.
   */
  has(pubPoint: Uint8Array): boolean {
    return this.available.some((prekey) => {
      if (prekey.point.length !== pubPoint.length) return false;
      for (let i = 0; i < prekey.point.length; i++) {
        if (prekey.point[i] !== pubPoint[i]) return false;
      }
      return true;
    });
  }
}

// ---------- Full Key Exchange with Prekey Bundle ----------

/**
 * Result of completing a key exchange using a prekey bundle.
 */
export interface KeyExchangeWithBundleResult {
  /** Derived per-chat AES-256 derived key. */
  readonly chatDerivedKey: Uint8Array;
  /** Short key identifier. */
  readonly keyId: string;
  /** Our ephemeral X25519 public point (sent to the other party). */
  readonly ephemeralPub: Uint8Array;
}

/**
 * Initiate a key exchange using the responder's prekey bundle.
 * This is the initiator side (Alice) — generates ephemeral keypair,
 * performs DH computations, and derives the chat key.
 *
 * Triple DH (Signal X3DH simplified):
 *   DH1 = ECDH(ephemeral, signed_prekey)      // forward secrecy
 *   DH2 = ECDH(identity_x25519, signed_prekey) // authentication
 *   DH3 = ECDH(ephemeral, identity_x25519)     // authentication binding
 *   If one-time prekey available:
 *     DH4 = ECDH(ephemeral, one_time_prekey)    // one-time uniqueness
 *
 * Combined DH output = DH1 || DH2 || DH3 [|| DH4]
 * Chat derived key = HKDF-SHA256(combined_dh, zero_salt, CHAT_KEY_INFO)
 *
 * @param myIdentityKeypair - Our Ed25519 identity keypair
 * @param theirBundle - Verified prekey bundle from the responder
 * @returns Chat key result and our ephemeral public key
 */
export function initiateKeyExchange(
  myIdentityKeypair: IdentityKeypair,
  theirVerifiedBundle: VerifiedPrekeyBundle,
): KeyExchangeWithBundleResult {
  const myX25519 = deriveX25519FromEd25519(myIdentityKeypair.signingBytes);

  // Generate ephemeral X25519 keypair for forward secrecy
  const ephemeralKeypair = x25519.keygen();

  // DH1: ephemeral priv × their signed prekey pub
  const dh1 = x25519.getSharedSecret(ephemeralKeypair.secretKey, theirVerifiedBundle.signedPrekeyPub);

  // DH2: our identity X25519 priv × their signed prekey pub
  const dh2 = x25519.getSharedSecret(myX25519.scalar, theirVerifiedBundle.signedPrekeyPub);

  // DH3: ephemeral priv × their identity X25519 pub
  const dh3 = x25519.getSharedSecret(ephemeralKeypair.secretKey, theirVerifiedBundle.x25519IdentityPub);

  // Combine DH outputs
  const dhOutputs = [dh1, dh2, dh3];

  // DH4: if one-time prekey available
  if (theirVerifiedBundle.oneTimePrekeyPub) {
    const dh4 = x25519.getSharedSecret(ephemeralKeypair.secretKey, theirVerifiedBundle.oneTimePrekeyPub);
    dhOutputs.push(dh4);
  }

  // Concatenate all DH outputs
  const totalLength = dhOutputs.reduce((sum, arr) => sum + arr.length, 0);
  const combinedDh = new Uint8Array(totalLength);
  let offset = 0;
  for (const dh of dhOutputs) {
    combinedDh.set(dh, offset);
    offset += dh.length;
  }

  // Check for low-order point
  if (isAllZeros(combinedDh)) {
    throw new Error('Low-order point detected: ECDH produced all-zero result');
  }

  // Derive chat derived key via HKDF
  const chatDerivedKey = deriveChatKey(combinedDh);

  const keyId = Array.from(chatDerivedKey.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return {
    chatDerivedKey,
    keyId,
    ephemeralPub: ephemeralKeypair.publicKey,
  };
}

/**
 * Complete a key exchange as the responder (Bob).
 * Given the initiator's ephemeral public key and X25519 identity key,
 * computes the same combined DH output.
 *
 * @param myIdentityKeypair - Our Ed25519 identity keypair
 * @param mySignedPrekey - Our signed prekey (same as in the bundle we published)
 * @param theirEphemeralPub - Initiator's ephemeral X25519 pub point (32 bytes)
 * @param theirX25519IdentityPub - Initiator's X25519 identity pub point (32 bytes)
 * @param consumedOneTimePrekey - The one-time prekey we consumed (if any)
 * @returns Derived per-chat AES-256 key result
 */
export function completeKeyExchange(
  myIdentityKeypair: IdentityKeypair,
  mySignedPrekey: SignedPrekey,
  theirEphemeralPub: Uint8Array,
  theirX25519IdentityPub: Uint8Array,
  consumedOneTimePrekey?: X25519Keypair,
): ChatKeyResult {
  if (!(theirEphemeralPub instanceof Uint8Array) || theirEphemeralPub.length !== KEY_LENGTH) {
    throw new Error(`Their ephemeral pub must be ${KEY_LENGTH} bytes`);
  }
  if (!(theirX25519IdentityPub instanceof Uint8Array) || theirX25519IdentityPub.length !== KEY_LENGTH) {
    throw new Error(`Their X25519 identity pub must be ${KEY_LENGTH} bytes`);
  }

  const myX25519 = deriveX25519FromEd25519(myIdentityKeypair.signingBytes);

  // DH1: our signed prekey priv × their ephemeral pub (matches initiator DH1)
  const dh1 = x25519.getSharedSecret(mySignedPrekey.priv, theirEphemeralPub);

  // DH2: our signed prekey priv × their identity X25519 pub (matches initiator DH2)
  const dh2 = x25519.getSharedSecret(mySignedPrekey.priv, theirX25519IdentityPub);

  // DH3: our identity X25519 priv × their ephemeral pub (matches initiator DH3)
  const dh3 = x25519.getSharedSecret(myX25519.scalar, theirEphemeralPub);

  // Combine DH outputs
  const dhOutputs = [dh1, dh2, dh3];

  // DH4: if one-time prekey was used
  if (consumedOneTimePrekey) {
    const dh4 = x25519.getSharedSecret(consumedOneTimePrekey.scalar, theirEphemeralPub);
    dhOutputs.push(dh4);
  }

  // Concatenate all DH outputs
  const totalLength = dhOutputs.reduce((sum, arr) => sum + arr.length, 0);
  const combinedDh = new Uint8Array(totalLength);
  let offset = 0;
  for (const dh of dhOutputs) {
    combinedDh.set(dh, offset);
    offset += dh.length;
  }

  // Check for low-order point
  if (isAllZeros(combinedDh)) {
    throw new Error('Low-order point detected: ECDH produced all-zero result');
  }

  // Derive chat derived key via HKDF
  const chatDerivedKey = deriveChatKey(combinedDh);

  const keyId = Array.from(chatDerivedKey.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { chatDerivedKey, keyId };
}

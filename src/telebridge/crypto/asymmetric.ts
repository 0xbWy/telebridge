/**
 * TeleBridge — Asymmetric Secured Messages (Layer 4)
 * Per-message X25519 ephemeral keypair for forward secrecy,
 * encrypt-to-self via two separate messages,
 * ephemeral private key zeroed after use.
 *
 * Wire format for secured messages: tb1.a.<base64>
 * Binary payload: [ephemeralPub (32B)] [nonce (12B)] [ciphertext (var)] [authTag (16B)] [signature (64B)]
 *
 * V1 Bug Regression Guards:
 * - Ephemeral key NEVER reused across messages (guards against key reuse attacks)
 * - Ephemeral private key zeroed after use (no key material leakage)
 * - Two separate messages for encrypt-to-self (not one re-encrypted copy)
 */
import { x25519 } from '@noble/curves/ed25519.js';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

import { encryptSymmetric, decryptSymmetric } from './symmetric';
import { signBytes, verifySignature, deriveX25519FromEd25519 } from './identity';

import type { IdentityKeypair, X25519Keypair } from './identity';

// ---------- Constants ----------

/** X25519 key length in bytes. */
const KEY_LENGTH = 32;

/** GCM nonce length: 12 bytes. */
const NONCE_LENGTH = 12;

/** GCM auth tag length: 16 bytes (MANDATORY). */
const TAG_LENGTH = 16;

/** Ed25519 signature length: 64 bytes. */
const SIGNATURE_LENGTH = 64;

/** HKDF info string for asymmetric message key derivation. */
const SECURED_MESSAGE_INFO = new TextEncoder().encode('TeleBridge-Secured-v1');

/** HKDF info string for encrypt-to-self message key derivation. */
const SECURED_SELF_INFO = new TextEncoder().encode('TeleBridge-Secured-Self-v1');

/** Minimum payload size: ephemeralPub(32) + nonce(12) + authTag(16) + signature(64) = 124 bytes */
const MIN_PAYLOAD_SIZE = KEY_LENGTH + NONCE_LENGTH + TAG_LENGTH + SIGNATURE_LENGTH;

// ---------- Utility ----------

function isUint8Array(value: unknown): value is Uint8Array {
  return value instanceof Uint8Array
    || (ArrayBuffer.isView(value) && (value as Uint8Array).constructor?.name === 'Uint8Array');
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Derive a per-message encryption key from an ECDH DH output.
 * Uses HKDF-SHA256 with a dedicated info string for domain separation.
 *
 * @param dhOutput - Raw X25519 ECDH output (32 bytes)
 * @param info - HKDF info string (default: SECURED_MESSAGE_INFO)
 * @returns 32-byte AES-256 derived key
 */
function deriveMessageKeyFromECDH(
  dhOutput: Uint8Array,
  info: Uint8Array = SECURED_MESSAGE_INFO,
): Uint8Array {
  return new Uint8Array(hkdf(sha256, dhOutput, new Uint8Array(KEY_LENGTH), info, KEY_LENGTH));
}

// ---------- Zeroing Helper ----------

/**
 * Securely zero a Uint8Array by filling with zeros.
 * This prevents the ephemeral private key from remaining in memory.
 *
 * Note: JavaScript garbage collection and potential optimizations
 * may interfere, but this is a best-effort approach. The key material
 * is also dropped from scope immediately after use.
 */
function zeroBytes(bytes: Uint8Array): void {
  bytes.fill(0);
}

// ---------- Secured Message Result ----------

/**
 * Result of encrypting an asymmetric (secured) message.
 * Two ciphertexts are produced:
 *   - forRecipient: encrypted with recipient's X25519 public point
 *   - forSelf: encrypted with sender's own X25519 public point (encrypt-to-self)
 * Both decrypt to the same plaintext.
 * The ephemeral public point is included in both for the recipient to
 * perform their side of the DH computation.
 */
export interface SecuredMessageResult {
  /** Binary payload for recipient: [ephPub][nonce][ciphertext][authTag][signature] */
  readonly forRecipient: Uint8Array;
  /** Binary payload for sender's self-copy: [ephPub][nonce][ciphertext][authTag][signature] */
  readonly forSelf: Uint8Array;
  /** Ephemeral X25519 public point (32 bytes). Unique per message. */
  readonly ephPub: Uint8Array;
}

/**
 * Result of decrypting a secured message.
 */
export interface DecryptedSecuredMessage {
  /** Decrypted plaintext bytes. */
  readonly plaintext: Uint8Array;
  /** Sender's Ed25519 verifying bytes (32 bytes), from signature verification. */
  readonly senderEd25519Pub: Uint8Array;
  /** Whether the Ed25519 signature is valid. */
  readonly isSignatureValid: boolean;
}

// ---------- Encrypt Secured Message ----------

/**
 * Encrypt a message using Layer 4 asymmetric (secured) encryption.
 *
 * Generates a fresh X25519 ephemeral keypair per message for forward secrecy.
 * The ephemeral private scalar is zeroed immediately after use.
 *
 * Produces two ciphertexts:
 *   1. forRecipient: encrypted with the DH output from
 *      ECDH(ephemeralPriv, recipientX25519Pub) — the recipient
 *      will compute ECDH(recipientPriv, ephPub) to get the same derived key.
 *   2. forSelf: encrypted with the DH output from
 *      ECDH(ephemeralPriv, senderX25519Pub) — the sender
 *      will compute ECDH(senderPriv, ephPub) to decrypt their own copy.
 *
 * Both payloads include:
 *   [ephPub (32B)] [nonce (12B)] [ciphertext (var)] [authTag (16B)] [signature (64B)]
 *
 * @param plaintext - Data to encrypt
 * @param recipientX25519Pub - Recipient's X25519 public point (32 bytes)
 * @param senderX25519Pair - Sender's X25519 scalar+point (for encrypt-to-self)
 * @param senderEd25519Priv - Sender's Ed25519 signing bytes (for signing)
 * @returns Two payloads (forRecipient, forSelf) and the ephemeral public point
 */
export async function encryptAsymmetric(
  plaintext: Uint8Array,
  recipientX25519Pub: Uint8Array,
  senderX25519Pair: X25519Keypair,
  senderEd25519Priv: Uint8Array,
): Promise<SecuredMessageResult> {
  // Validate inputs
  if (!isUint8Array(plaintext)) {
    throw new Error('Plaintext must be a Uint8Array');
  }
  if (!isUint8Array(recipientX25519Pub) || recipientX25519Pub.length !== KEY_LENGTH) {
    throw new Error(`Recipient X25519 public point must be ${KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(senderX25519Pair.scalar) || senderX25519Pair.scalar.length !== KEY_LENGTH) {
    throw new Error(`Sender X25519 scalar must be ${KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(senderX25519Pair.point) || senderX25519Pair.point.length !== KEY_LENGTH) {
    throw new Error(`Sender X25519 point must be ${KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(senderEd25519Priv) || senderEd25519Priv.length !== KEY_LENGTH) {
    throw new Error(`Sender Ed25519 signing bytes must be ${KEY_LENGTH} bytes`);
  }

  // Generate fresh ephemeral X25519 keypair — UNIQUE per message
  const ephPair = x25519.keygen();
  const ephemeralPriv = ephPair.secretKey;
  const ephPub = ephPair.publicKey;

  try {
    // Sign the plaintext with the sender's Ed25519 identity
    const signature = signBytes(senderEd25519Priv, plaintext);

    // ---- Encrypt for recipient ----
    // DH output: ECDH(ephemeralPriv, recipientX25519Pub)
    const recipientDhOutput = x25519.getSharedSecret(ephemeralPriv, recipientX25519Pub);
    const recipientDerivedKey = deriveMessageKeyFromECDH(recipientDhOutput, SECURED_MESSAGE_INFO);

    const {
      nonce: recipientNonce,
      ciphertext: recipientCiphertext,
      authTag: recipientAuthTag,
    } = await encryptSymmetric(plaintext, recipientDerivedKey);

    // Build recipient payload: [ephPub (32B)][nonce (12B)][ciphertext (var)][authTag (16B)][signature (64B)]
    const forRecipient = concat(
      ephPub,               // 32B
      recipientNonce,       // 12B
      recipientCiphertext,   // var
      recipientAuthTag,     // 16B
      signature,            // 64B
    );

    // ---- Encrypt-to-self ----
    // DH output: ECDH(ephemeralPriv, senderX25519Pub)
    const selfDhOutput = x25519.getSharedSecret(ephemeralPriv, senderX25519Pair.point);
    const selfDerivedKey = deriveMessageKeyFromECDH(selfDhOutput, SECURED_SELF_INFO);

    const {
      nonce: selfNonce,
      ciphertext: selfCiphertext,
      authTag: selfAuthTag,
    } = await encryptSymmetric(plaintext, selfDerivedKey);

    // Build self-copy payload: [ephPub (32B)][nonce (12B)][ciphertext (var)][authTag (16B)][signature (64B)]
    const forSelf = concat(
      ephPub,            // 32B
      selfNonce,         // 12B
      selfCiphertext,    // var
      selfAuthTag,       // 16B
      signature,         // 64B
    );

    return {
      forRecipient,
      forSelf,
      ephPub: new Uint8Array(ephPub),
    };
  } finally {
    // CRITICAL: Zero the ephemeral private scalar to prevent key material leakage.
    // This runs even if an error occurs during encryption.
    zeroBytes(ephemeralPriv);
  }
}

// ---------- Decrypt Secured Message (Recipient Side) ----------

/**
 * Decrypt a secured message as the recipient.
 *
 * Extracts the ephemeral public point from the payload, computes the ECDH
 * DH output with the recipient's own X25519 private scalar, derives the
 * message key, and decrypts the ciphertext.
 *
 * Also verifies the Ed25519 signature if the sender's verifying bytes are provided.
 *
 * @param payload - Binary payload from the secured message
 * @param recipientX25519Priv - Recipient's X25519 private scalar (32 bytes)
 * @param senderEd25519Pub - Sender's Ed25519 verifying bytes (32 bytes) for signature verification
 * @returns Decrypted plaintext and signature verification result
 * @throws Error on invalid payload format, decryption failure, or auth tag mismatch
 */
export async function decryptAsymmetricRecipient(
  payload: Uint8Array,
  recipientX25519Priv: Uint8Array,
  senderEd25519Pub: Uint8Array,
): Promise<DecryptedSecuredMessage> {
  if (!isUint8Array(payload) || payload.length < MIN_PAYLOAD_SIZE) {
    throw new Error(`Payload must be at least ${MIN_PAYLOAD_SIZE} bytes, got ${payload.length}`);
  }
  if (!isUint8Array(recipientX25519Priv) || recipientX25519Priv.length !== KEY_LENGTH) {
    throw new Error(`Recipient X25519 private scalar must be ${KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(senderEd25519Pub) || senderEd25519Pub.length !== KEY_LENGTH) {
    throw new Error(`Sender Ed25519 verifying bytes must be ${KEY_LENGTH} bytes`);
  }

  // Parse payload
  const ephemeralPubKey = payload.slice(0, KEY_LENGTH);       // 32B
  const nonce = payload.slice(KEY_LENGTH, KEY_LENGTH + NONCE_LENGTH); // 12B
  const signature = payload.slice(payload.length - SIGNATURE_LENGTH);  // 64B
  const ciphertextEnd = payload.length - SIGNATURE_LENGTH - TAG_LENGTH;
  const ciphertext = payload.slice(KEY_LENGTH + NONCE_LENGTH, ciphertextEnd);

  const authTag = payload.slice(ciphertextEnd, payload.length - SIGNATURE_LENGTH); // 16B

  // Compute ECDH: recipientPriv × ephemeralPub → same DH output as sender computed
  const dhOutput = x25519.getSharedSecret(recipientX25519Priv, ephemeralPubKey);
  const derivedKey = deriveMessageKeyFromECDH(dhOutput, SECURED_MESSAGE_INFO);

  // Decrypt — GCM auth tag verification is ALWAYS performed (V1 Bug #7 guard)
  const plaintext = await decryptSymmetric(nonce, ciphertext, authTag, derivedKey);

  // Verify Ed25519 signature
  const isSignatureValid = verifySignature(senderEd25519Pub, signature, plaintext);

  return {
    plaintext,
    senderEd25519Pub,
    isSignatureValid,
  };
}

// ---------- Decrypt Secured Message (Self-Copy / Sender Side) ----------

/**
 * Decrypt a self-copy of a secured message (encrypt-to-self).
 *
 * The sender uses this to decrypt the copy they sent to themselves.
 * The DH output is computed as ECDH(senderPriv, ephemeralPub),
 * using the SECURED_SELF_INFO HKDF info string.
 *
 * @param payload - Binary payload from the self-copy message
 * @param senderX25519Priv - Sender's X25519 private scalar (32 bytes)
 * @param senderEd25519Pub - Sender's own Ed25519 verifying bytes (32 bytes) for signature verification
 * @returns Decrypted plaintext and signature verification result
 * @throws Error on invalid payload format, decryption failure, or auth tag mismatch
 */
export async function decryptAsymmetricSelf(
  payload: Uint8Array,
  senderX25519Priv: Uint8Array,
  senderEd25519Pub: Uint8Array,
): Promise<DecryptedSecuredMessage> {
  if (!isUint8Array(payload) || payload.length < MIN_PAYLOAD_SIZE) {
    throw new Error(`Payload must be at least ${MIN_PAYLOAD_SIZE} bytes, got ${payload.length}`);
  }
  if (!isUint8Array(senderX25519Priv) || senderX25519Priv.length !== KEY_LENGTH) {
    throw new Error(`Sender X25519 private scalar must be ${KEY_LENGTH} bytes`);
  }
  if (!isUint8Array(senderEd25519Pub) || senderEd25519Pub.length !== KEY_LENGTH) {
    throw new Error(`Sender Ed25519 verifying bytes must be ${KEY_LENGTH} bytes`);
  }

  // Parse payload (same format as recipient)
  const ephemeralPubKey = payload.slice(0, KEY_LENGTH);
  const nonce = payload.slice(KEY_LENGTH, KEY_LENGTH + NONCE_LENGTH);
  const signature = payload.slice(payload.length - SIGNATURE_LENGTH);
  const ciphertextEnd = payload.length - SIGNATURE_LENGTH - TAG_LENGTH;
  const ciphertext = payload.slice(KEY_LENGTH + NONCE_LENGTH, ciphertextEnd);
  const authTag = payload.slice(ciphertextEnd, payload.length - SIGNATURE_LENGTH);

  // Compute ECDH: senderPriv × ephemeralPub → self DH output
  const dhOutput = x25519.getSharedSecret(senderX25519Priv, ephemeralPubKey);
  const derivedKey = deriveMessageKeyFromECDH(dhOutput, SECURED_SELF_INFO);

  // Decrypt — mandatory GCM auth tag verification
  const plaintext = await decryptSymmetric(nonce, ciphertext, authTag, derivedKey);

  // Verify Ed25519 signature (should be valid since this is our own message)
  const isSignatureValid = verifySignature(senderEd25519Pub, signature, plaintext);

  return {
    plaintext,
    senderEd25519Pub,
    isSignatureValid,
  };
}

// ---------- Convenience: Full Identity-Based Encrypt ----------

/**
 * Encrypt a secured message using the sender's full identity keypair.
 * This is the primary API — it derives the X25519 keypair from Ed25519
 * automatically and calls encryptAsymmetric.
 *
 * @param plaintext - Data to encrypt
 * @param recipientX25519Pub - Recipient's X25519 public point (32 bytes)
 * @param senderIdentityKeypair - Sender's Ed25519 identity keypair
 * @returns Two payloads and the ephemeral public point
 */
export async function encryptSecuredMessage(
  plaintext: Uint8Array,
  recipientX25519Pub: Uint8Array,
  senderIdentityKeypair: IdentityKeypair,
): Promise<SecuredMessageResult> {
  const senderX25519 = deriveX25519FromEd25519(senderIdentityKeypair.signingBytes);

  return encryptAsymmetric(
    plaintext,
    recipientX25519Pub,
    senderX25519,
    senderIdentityKeypair.signingBytes,
  );
}

/**
 * Decrypt a secured message using the recipient's full identity keypair.
 * Derives the X25519 scalar from Ed25519 automatically.
 *
 * @param payload - Binary payload from the secured message
 * @param recipientIdentityKeypair - Recipient's Ed25519 identity keypair
 * @param senderEd25519Pub - Sender's Ed25519 verifying bytes (32 bytes)
 * @returns Decrypted plaintext and signature verification result
 */
export async function decryptSecuredMessageRecipient(
  payload: Uint8Array,
  recipientIdentityKeypair: IdentityKeypair,
  senderEd25519Pub: Uint8Array,
): Promise<DecryptedSecuredMessage> {
  const recipientX25519 = deriveX25519FromEd25519(recipientIdentityKeypair.signingBytes);

  return decryptAsymmetricRecipient(
    payload,
    recipientX25519.scalar,
    senderEd25519Pub,
  );
}

/**
 * Decrypt a self-copy secured message using the sender's full identity keypair.
 *
 * @param payload - Binary payload from the self-copy message
 * @param senderIdentityKeypair - Sender's Ed25519 identity keypair
 * @returns Decrypted plaintext and signature verification result
 */
export async function decryptSecuredMessageSelf(
  payload: Uint8Array,
  senderIdentityKeypair: IdentityKeypair,
): Promise<DecryptedSecuredMessage> {
  const senderX25519 = deriveX25519FromEd25519(senderIdentityKeypair.signingBytes);

  return decryptAsymmetricSelf(
    payload,
    senderX25519.scalar,
    senderIdentityKeypair.verifyingBytes,
  );
}

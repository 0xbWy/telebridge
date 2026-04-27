/**
 * TeleBridge — Password & Key Encryption (Argon2id)
 *
 * Argon2id password hashing with PBKDF2-SHA256 fallback for restricted
 * environments (e.g., CSP-restricted browsers).
 *
 * V1 Bug Regression Guards:
 * - #6: Argon2id used for password hashing (NOT bare SHA-256)
 * - #8: Password never stored in global/module-level variable
 *
 * Argon2id parameters meet minimum thresholds per VAL-CRYPTO-015:
 *   Memory: 64 MiB (65536 KiB)
 *   Time: 3 iterations
 *   Parallelism: 1
 */
// eslint-disable-next-line import-x/default
import argon2 from 'argon2-browser';

// ---------- Argon2id Constants (VAL-CRYPTO-015) ----------

/** Memory cost: 64 MiB = 65536 KiB. Minimum per spec. */
export const ARGON2_MEMORY = 65536;

/** Time cost: 3 iterations. Minimum per spec. */
export const ARGON2_TIME = 3;

/** Parallelism: 1 thread. Minimum per spec. */
export const ARGON2_PARALLELISM = 1;

/** Hash output length: 32 bytes (AES-256 key). */
export const ARGON2_HASH_LENGTH = 32;

/** PBKDF2 fallback iterations (OWASP 2023 recommendation for AES-256). */
const PBKDF2_ITERATIONS = 600000;

/** Argon2id type constant from argon2-browser. */
const ARGON2_TYPE_ARGON2ID = 1;

// ---------- Salt Generation ----------

/** Salt length: 16 bytes (128 bits) — minimum for password hashing. */
export const SALT_LENGTH = 16;

/**
 * Generate a cryptographically random salt for password hashing.
 * @returns 16-byte random salt
 */
export function generateSalt(): Uint8Array {
  const salt = new Uint8Array(SALT_LENGTH);
  crypto.getRandomValues(salt);
  return salt;
}

// ---------- Argon2id Availability Check ----------

/** Cached result of Argon2id availability check. */
let argon2AvailableCache: boolean | undefined;

/**
 * Check if Argon2id is available in the current environment.
 * Argon2id requires WASM support. In restricted environments
 * (e.g., CSP blocks WASM), this returns false and PBKDF2 is used.
 */
export async function isArgon2Available(): Promise<boolean> {
  if (argon2AvailableCache !== undefined) {
    return argon2AvailableCache;
  }

  try {
    await argon2.hash({
      pass: 'telebridge-argon2-check',
      salt: new Uint8Array(16),
      time: 1,
      mem: 1024,
      parallelism: 1,
      hashLen: 16,
      type: ARGON2_TYPE_ARGON2ID,
    });
    argon2AvailableCache = true;
    return true;
  } catch {
    argon2AvailableCache = false;
    return false;
  }
}

// ---------- Argon2id Password Key Derivation ----------

/**
 * Result from password hashing.
 * Includes the 32-byte derived key and the parameters used,
 * so parameters can be persisted alongside the encrypted output.
 */
export interface PasswordHashResult {
  /** 32-byte derived key (AES-256). */
  readonly derivedKey: Uint8Array;
  /** Salt used (16 bytes). */
  readonly salt: Uint8Array;
  /** KDF parameters — persisted with encrypted output. */
  readonly params: {
    readonly memory: number;
    readonly time: number;
    readonly parallelism: number;
    /** Whether Argon2id was used (true) or PBKDF2 fallback (false). */
    readonly argon2: boolean;
  };
}

/**
 * Derive a 32-byte AES-256 encryption key from a password using Argon2id
 * (primary) or PBKDF2-SHA256 (fallback).
 *
 * CRITICAL: This function does NOT store the password in any global or
 * module-level variable. The password string is scoped to this function
 * and is eligible for garbage collection after the call completes.
 * Guards V1 Bug #8.
 *
 * @param password - The user's bridge password (scoped local variable)
 * @param salt - Optional salt (generated if not provided)
 * @returns Derived key, salt, and parameters
 */
export async function deriveKeyFromPassword(
  password: string,
  salt?: Uint8Array,
): Promise<PasswordHashResult> {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  const actualSalt = salt ?? generateSalt();
  const argon2Available = await isArgon2Available();

  if (argon2Available) {
    return deriveKeyArgon2id(password, actualSalt);
  }

  // Fallback: PBKDF2-SHA256 with high iteration count
  return deriveKeyPBKDF2(password, actualSalt);
}

/**
 * Argon2id key derivation — the primary and recommended KDF.
 * NOT bare SHA-256. Guards V1 Bug #6.
 *
 * VAL-ERR-004: Argon2id OOM handled gracefully with error message.
 * If WASM allocation fails, throws Argon2idMemoryError with user-facing message.
 */
async function deriveKeyArgon2id(
  password: string,
  salt: Uint8Array,
): Promise<PasswordHashResult> {
  try {
    const result = await argon2.hash({
      pass: password,
      salt,
      time: ARGON2_TIME,
      mem: ARGON2_MEMORY,
      parallelism: ARGON2_PARALLELISM,
      hashLen: ARGON2_HASH_LENGTH,
      type: ARGON2_TYPE_ARGON2ID,
    });

    const derivedKey = new Uint8Array(result.hash);

    return {
      derivedKey,
      salt,
      params: {
        memory: ARGON2_MEMORY,
        time: ARGON2_TIME,
        parallelism: ARGON2_PARALLELISM,
        argon2: true,
      },
    };
  } catch (error) {
    // VAL-ERR-004: Catch OOM errors from Argon2id WASM and throw user-friendly error
    const errMsg = error instanceof Error ? error.message.toLowerCase() : '';
    if (errMsg.includes('out of memory') || errMsg.includes('oom')
        || errMsg.includes('memory') || errMsg.includes('wasm')
        || errMsg.includes('allocate') || errMsg.includes('buffer')) {
      throw new Error(
        'TeleBridge is unable to allocate the required memory for secure password hashing. '
        + 'Please close other tabs or applications and try again.',
      );
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * PBKDF2-SHA256 fallback for environments where Argon2id WASM fails.
 * Uses 600,000 iterations per OWASP 2023 recommendations.
 */
async function deriveKeyPBKDF2(
  password: string,
  salt: Uint8Array,
): Promise<PasswordHashResult> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  const keyBytes = new Uint8Array(await crypto.subtle.exportKey('raw', derivedKey));

  return {
    derivedKey: keyBytes,
    salt,
    params: {
      memory: 0,
      time: PBKDF2_ITERATIONS,
      parallelism: 1,
      argon2: false,
    },
  };
}

/**
 * Import a 32-byte raw key as an AES-GCM CryptoKey for Web Crypto API.
 */
export async function importAesKey(keyBytes: Uint8Array): Promise<CryptoKey> {
  if (!(keyBytes instanceof Uint8Array) || keyBytes.length !== 32) {
    throw new Error('Key bytes must be a 32-byte Uint8Array');
  }
  return crypto.subtle.importKey(
    'raw',
    keyBytes as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ---------- Password Verification ----------

/** Known value encrypted with the derived key to verify the password. */
const PASSWORD_VERIFIER_PLAINTEXT = new TextEncoder().encode('TeleBridge-Password-Verify-v1');

/**
 * Create a password verifier: encrypt a known value with the derived key.
 */
export async function createPasswordVerifier(
  derivedKey: Uint8Array,
): Promise<{ verifier: string; nonce: string }> {
  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);

  const cryptoKey = await importAesKey(derivedKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
    cryptoKey,
    PASSWORD_VERIFIER_PLAINTEXT as BufferSource,
  );

  return {
    verifier: arrayToBase64(new Uint8Array(encrypted)),
    nonce: arrayToBase64(nonce),
  };
}

/**
 * Verify a password by attempting to decrypt the stored verifier.
 */
export async function verifyPassword(
  password: string,
  salt: Uint8Array,
  verifierCiphertext: string,
  verifierNonce: string,
): Promise<boolean> {
  try {
    const { derivedKey } = await deriveKeyFromPassword(password, salt);
    const cryptoKey = await importAesKey(derivedKey);

    const ciphertext = base64ToArray(verifierCiphertext);
    const nonce = base64ToArray(verifierNonce);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
      cryptoKey,
      ciphertext as BufferSource,
    );

    return arraysEqual(new Uint8Array(decrypted), PASSWORD_VERIFIER_PLAINTEXT);
  } catch {
    return false;
  }
}

// ---------- Private Key Encryption/Decryption ----------

/**
 * Encrypt private key material with a derived key.
 * Uses AES-256-GCM with mandatory 16-byte auth tag.
 */
export async function encryptPrivateKey(
  privateKeyData: Uint8Array,
  derivedKey: Uint8Array,
): Promise<{ ciphertext: string; nonce: string }> {
  if (!(privateKeyData instanceof Uint8Array) || privateKeyData.length === 0) {
    throw new Error('Private key data must be a non-empty Uint8Array');
  }

  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);

  const cryptoKey = await importAesKey(derivedKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
    cryptoKey,
    privateKeyData as BufferSource,
  );

  return {
    ciphertext: arrayToBase64(new Uint8Array(encrypted)),
    nonce: arrayToBase64(nonce),
  };
}

/**
 * Decrypt private key material with a derived key.
 * Returns undefined on failure (wrong key, tampered data).
 * GCM auth tag verification is ALWAYS performed (V1 Bug #7 guard).
 */
export async function decryptPrivateKey(
  ciphertext: string,
  nonce: string,
  derivedKey: Uint8Array,
): Promise<Uint8Array | undefined> {
  try {
    const ciphertextBytes = base64ToArray(ciphertext);
    const nonceBytes = base64ToArray(nonce);

    const cryptoKey = await importAesKey(derivedKey);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonceBytes as BufferSource, tagLength: 128 },
      cryptoKey,
      ciphertextBytes as BufferSource,
    );

    return new Uint8Array(decrypted);
  } catch {
    return undefined;
  }
}

// ---------- Encrypt/Decrypt Key Blob ----------

/**
 * Encrypt an identity keypair into a single authenticated blob.
 * The blob is tamper-evident (AEAD) per VAL-CRYPTO-024.
 */
export async function encryptKeyBlob(
  ed25519PrivateKey: Uint8Array,
  x25519PrivateKey: Uint8Array,
  password: string,
): Promise<string> {
  if (!(ed25519PrivateKey instanceof Uint8Array) || ed25519PrivateKey.length !== 32) {
    throw new Error('Ed25519 private key must be 32 bytes');
  }
  if (!(x25519PrivateKey instanceof Uint8Array) || x25519PrivateKey.length !== 32) {
    throw new Error('X25519 private key must be 32 bytes');
  }

  const plaintext = new Uint8Array(64);
  plaintext.set(ed25519PrivateKey, 0);
  plaintext.set(x25519PrivateKey, 32);

  const { derivedKey, salt, params } = await deriveKeyFromPassword(password);

  const { verifier, nonce: verifierNonce } = await createPasswordVerifier(derivedKey);

  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);

  const cryptoKey = await importAesKey(derivedKey);

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
    cryptoKey,
    plaintext as BufferSource,
  );

  const blob = {
    v: 1,
    s: arrayToBase64(salt),
    n: arrayToBase64(nonce),
    c: arrayToBase64(new Uint8Array(encrypted)),
    p: { m: params.memory, t: params.time, l: params.parallelism, argon2: params.argon2 },
    vr: verifier,
    vn: verifierNonce,
  };

  return JSON.stringify(blob);
}

/**
 * Decrypt a key blob created by encryptKeyBlob.
 * Returns Ed25519 private key and X25519 private key, or undefined on failure.
 */
export async function decryptKeyBlob(
  blobJson: string,
  password: string,
): Promise<{ ed25519PrivateKey: Uint8Array; x25519PrivateKey: Uint8Array } | undefined> {
  try {
    const blob = JSON.parse(blobJson);
    if (blob.v !== 1) return undefined;

    const salt = base64ToArray(blob.s);
    const nonce = base64ToArray(blob.n);
    const ciphertext = base64ToArray(blob.c);

    const { derivedKey } = await deriveKeyFromPassword(password, salt);

    const passwordValid = await verifyPassword(password, salt, blob.vr, blob.vn);
    if (!passwordValid) return undefined;

    const cryptoKey = await importAesKey(derivedKey);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
      cryptoKey,
      ciphertext as BufferSource,
    );

    const plaintext = new Uint8Array(decrypted);
    if (plaintext.length !== 64) return undefined;

    return {
      ed25519PrivateKey: plaintext.slice(0, 32),
      x25519PrivateKey: plaintext.slice(32, 64),
    };
  } catch {
    return undefined;
  }
}

// ---------- Utility Functions ----------

function arrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

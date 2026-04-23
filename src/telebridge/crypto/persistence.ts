/**
 * TeleBridge — Key Persistence
 *
 * Encrypted key storage and management. Keys are NEVER written to disk
 * in plaintext. All persistence uses AEAD (AES-256-GCM) encrypted blobs.
 *
 * V1 Bug Regression Guards:
 * - #5: No plaintext keys written to disk (only encrypted blobs)
 * - #2: unlockBridge decrypts keys before use (never copies encrypted blobs without decrypting)
 * - #8: Password never stored in global/module-level variable
 *
 * Key lifecycle:
 *   1. User sets bridge password → Argon2id derives wrapping key
 *   2. Identity keys encrypted with wrapping key → stored in IndexedDB
 *   3. On app start: locked state → user enters password → unlockBridge()
 *   4. unlockBridge: derive key from password → decrypt stored blobs → populate in-memory keys
 *   5. Keys exist in memory ONLY while bridge is unlocked
 */

import {
  deriveKeyFromPassword,
  encryptKeyBlob,
  decryptKeyBlob,
  importAesKey,
} from './password';

import type { IdentityKeypair } from './identity';
import { deriveX25519FromEd25519 } from './identity';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

// ---------- Types ----------

/** Bridge lock state. */
export type BridgeState = 'locked' | 'unlocking' | 'unlocked' | 'error';

/** Identity keys stored in memory when bridge is unlocked. */
export interface UnlockedIdentity {
  /** Ed25519 keypair (32-byte signing, 32-byte verifying). */
  readonly ed25519: IdentityKeypair;
  /** X25519 keypair derived from Ed25519. */
  readonly x25519: ReturnType<typeof deriveX25519FromEd25519>;
}

/** Persisted (encrypted) key data stored in IndexedDB. */
export interface EncryptedKeyStore {
  /** Version of the key store format. */
  readonly v: number;
  /** Encrypted blob containing both Ed25519 and X25519 private keys. */
  readonly encryptedBlob: string;
  /** Base64-encoded salt used for Argon2id key derivation. */
  readonly salt: string;
  /** Password verifier (encrypted known plaintext with the derived key). */
  readonly verifier: string;
  /** Nonce for the password verifier. */
  readonly verifierNonce: string;
  /** Argon2id parameters used. */
  readonly params: {
    readonly m: number;  // memory (KiB)
    readonly t: number;  // time iterations
    readonly l: number;  // parallelism
    readonly argon2: boolean; // whether Argon2id was used
  };
  /** Ed25519 verifying bytes (public key) — stored in plaintext for lookup. */
  readonly ed25519PubBase64: string;
  /** X25519 point (public key) — stored in plaintext for key exchange. */
  readonly x25519PubBase64: string;
  /** Key store creation timestamp. */
  readonly createdAt: number;
}

/** Result of a successful unlockBridge call. */
export interface UnlockResult {
  /** Unlocked identity keys. */
  readonly identity: UnlockedIdentity;
  /** Derivation timestamp. */
  readonly unlockedAt: number;
}

// ---------- HKDF info strings for key store ----------

/** HKDF info for deriving the key-encryption key from the bridge password. */
const KEY_ENCRYPTION_KEY_INFO = new TextEncoder().encode('TeleBridge-KeyEncryption-v1');

// ---------- Module State ----------

/**
 * In-memory store for unlocked identity keys.
 * Keys exist here ONLY while the bridge is unlocked.
 * When the bridge is locked, this reference is set to undefined.
 *
 * GUARD: Password and decrypted key material are NEVER stored in global/module-level
 * variables. The `unlockedIdentity` variable holds decrypted keys only while
 * the bridge is unlocked, and is set to undefined on lock.
 */
let unlockedIdentity: UnlockedIdentity | undefined;

/**
 * Current bridge state. Starts 'locked' at app launch.
 */
let bridgeState: BridgeState = 'locked';

// ---------- Public API ----------

/**
 * Get the current bridge state.
 */
export function getBridgeState(): BridgeState {
  return bridgeState;
}

/**
 * Check if the bridge is currently unlocked with decrypted keys available.
 */
export function isBridgeUnlocked(): boolean {
  return bridgeState === 'unlocked' && unlockedIdentity !== undefined;
}

/**
 * Get the unlocked identity keys if the bridge is unlocked.
 * Returns undefined if the bridge is locked.
 *
 * GUARD (V1 Bug #2): This function decrypts keys before use — it only
 * returns keys that have been properly decrypted. The bridge unlock
 * process decrypts the key blob and stores the decrypted keys in memory.
 * It NEVER copies encrypted blobs without decrypting.
 */
export function getUnlockedIdentity(): UnlockedIdentity | undefined {
  if (!isBridgeUnlocked()) return undefined;
  return unlockedIdentity;
}

/**
 * Get the unlocked X25519 keypair for key exchange.
 * Returns undefined if the bridge is locked.
 *
 * GUARD (V1 Bug #2): The X25519 keys are derived from decrypted Ed25519
 * keys after unlockBridge has properly decrypted them.
 */
export function getUnlockedX25519(): ReturnType<typeof deriveX25519FromEd25519> | undefined {
  if (!isBridgeUnlocked()) return undefined;
  return unlockedIdentity?.x25519;
}

/**
 * Unlock the bridge with a password.
 *
 * This is the ONLY way to populate the in-memory keys:
 * 1. Derive wrapping key from password using Argon2id
 * 2. Verify the password against the stored verifier
 * 3. Decrypt the encrypted key blob
 * 4. Derive X25519 keypair from the decrypted Ed25519 private key
 * 5. Store the decrypted keys in memory
 *
 * GUARD (V1 Bug #2): Keys are ALWAYS decrypted before use.
 * The encrypted blob is NEVER copied to memory without decryption.
 * GUARD (V1 Bug #8): Password is a local parameter only, never stored globally.
 *
 * @param encryptedStore - The encrypted key store from IndexedDB
 * @param password - Bridge password (scoped local variable, NEVER stored globally)
 * @returns UnlockResult with decrypted identity keys
 * @throws Error if password is wrong, blob is tampered, or decryption fails
 */
export async function unlockBridge(
  encryptedStore: EncryptedKeyStore,
  password: string,
): Promise<UnlockResult> {
  if (bridgeState === 'unlocked') {
    throw new Error('Bridge is already unlocked. Lock it first before unlocking again.');
  }

  bridgeState = 'unlocking';

  try {
    // Step 1: Decode the salt and derive the key-encryption key
    const salt = base64ToArray(encryptedStore.salt);

    // Derive wrapping output from password using Argon2id
    // GUARD: Password is a local parameter (password), never assigned to a global variable
    const { derivedKey: wrappingOutput } = await deriveKeyFromPassword(password, salt);

    // Step 2: Verify the password before attempting decryption
    // This avoids unnecessary AES operations with a wrong input
    const passwordValid = await verifyPasswordAgainstStore(wrappingOutput, encryptedStore);
    if (!passwordValid) {
      bridgeState = 'locked';
      throw new Error('Wrong bridge password. Please try again.');
    }

    // Step 3: Decrypt the key blob
    // GUARD (V1 Bug #2): We decrypt the blob — NOT copy it encrypted.
    // The decryptKeyBlob function performs AEAD verification (V1 Bug #7 guard).
    const decrypted = await decryptKeyBlob(encryptedStore.encryptedBlob, password);
    if (!decrypted) {
      bridgeState = 'locked';
      throw new Error('Failed to decrypt key blob. Data may be corrupted.');
    }

    // Step 4: Reconstruct identity from decrypted keys
    const ed25519Keypair: IdentityKeypair = {
      signingBytes: decrypted.ed25519PrivateKey,
      verifyingBytes: base64ToArray(encryptedStore.ed25519PubBase64),
    };

    // Derive X25519 public key from the decrypted Ed25519 private key
    const x25519 = deriveX25519FromEd25519(decrypted.ed25519PrivateKey);

    // Verify the derived X25519 public key matches what's stored
    const storedX25519Pub = base64ToArray(encryptedStore.x25519PubBase64);
    const derivedX25519Pub = x25519.point;
    if (!arraysEqual(derivedX25519Pub, storedX25519Pub)) {
      bridgeState = 'locked';
      throw new Error('X25519 public key mismatch. Key blob may be corrupted.');
    }

    // Step 5: Store decrypted keys in memory
    const identity: UnlockedIdentity = {
      ed25519: ed25519Keypair,
      x25519: x25519,
    };

    unlockedIdentity = identity;
    bridgeState = 'unlocked';

    return {
      identity,
      unlockedAt: Date.now(),
    };
  } catch (error) {
    bridgeState = 'error';
    // Clear any partially-decrypted material
    unlockedIdentity = undefined;
    throw error;
  }
}

/**
 * Create an encrypted key store from a new identity keypair and password.
 *
 * This is the initial setup flow when the user first sets a bridge password.
 * Steps:
 * 1. Derive key-encryption key from password using Argon2id
 * 2. Encrypt the identity keys into an AEAD blob
 * 3. Create a password verifier
 * 4. Return the encrypted store for persistence to IndexedDB
 *
 * GUARD (V1 Bug #5): Only the encrypted blob is stored. The plaintext
 * private key is NEVER written to disk — it only exists in memory.
 * GUARD (V1 Bug #8): Password is a local parameter, not stored globally.
 *
 * @param identityKeypair - The user's Ed25519 identity keypair
 * @param password - Bridge password (scoped local variable)
 * @returns EncryptedKeyStore for persisting to IndexedDB
 */
export async function createEncryptedKeyStore(
  identityKeypair: IdentityKeypair,
  password: string,
): Promise<EncryptedKeyStore> {
  // Derive X25519 from Ed25519 for storage of the public key
  const x25519 = deriveX25519FromEd25519(identityKeypair.signingBytes);

  // Encrypt the private keys into a single AEAD blob
  // GUARD (V1 Bug #5): encryptKeyBlob uses AES-256-GCM with mandatory auth tags.
  // The blob is tamper-evident (AEAD protected) per VAL-CRYPTO-024.
  const encryptedBlob = await encryptKeyBlob(
    identityKeypair.signingBytes,
    x25519.scalar,
    password,
  );

  // Derive output for password verifier
  const salt = extractSaltFromBlob(encryptedBlob);
  const { derivedKey: wrappingOutput } = await deriveKeyFromPassword(password, salt);

  // Create password verifier for fast unlock validation
  const { verifier, nonce: verifierNonce } = await createVerifierFromKey(wrappingOutput);

  // Extract parameters from the blob
  const params = extractParamsFromBlob(encryptedBlob);

  return {
    v: 1,
    encryptedBlob,
    salt: arrayToBase64(salt),
    verifier,
    verifierNonce,
    params,
    ed25519PubBase64: arrayToBase64(identityKeypair.verifyingBytes),
    x25519PubBase64: arrayToBase64(x25519.point),
    createdAt: Date.now(),
  };
}

/**
 * Lock the bridge, clearing all in-memory decrypted keys.
 *
 * After calling this function, all decrypted key material is zeroed
 * and the reference is set to undefined. No plaintext keys remain in memory.
 *
 * GUARD (V1 Bug #5): After lock, no plaintext keys exist in this module.
 */
export function lockBridge(): void {
  if (unlockedIdentity) {
    // Best-effort zeroing of key material from memory
    zeroUint8Array(unlockedIdentity.ed25519.signingBytes);
    zeroUint8Array(unlockedIdentity.x25519.scalar);
  }
  unlockedIdentity = undefined;
  bridgeState = 'locked';
}

/**
 * Change the bridge password.
 *
 * Re-encrypts all stored keys with the new password. The old password
 * must be provided for verification.
 *
 * GUARD (V1 Bug #8): Passwords are local parameters, never stored globally.
 *
 * @param encryptedStore - Current encrypted key store
 * @param oldPassword - Current password for verification
 * @param newPassword - New password for re-encryption
 * @returns New encrypted key store with the new password
 * @throws Error if old password is incorrect
 */
export async function changeBridgePassword(
  encryptedStore: EncryptedKeyStore,
  oldPassword: string,
  newPassword: string,
): Promise<EncryptedKeyStore> {
  // Verify old password and decrypt keys
  const unlockResult = await unlockBridge(encryptedStore, oldPassword);

  try {
    // Re-encrypt with new password
    const newStore = await createEncryptedKeyStore(
      unlockResult.identity.ed25519,
      newPassword,
    );

    // Copy over the creation timestamp from the original store
    return {
      ...newStore,
      createdAt: encryptedStore.createdAt,
    };
  } finally {
    // Always lock the bridge after re-encryption
    lockBridge();
  }
}

/**
 * Verify a password against an encrypted key store without fully unlocking.
 *
 * Useful for checking if a password is correct before attempting the
 * more expensive full unlock operation.
 *
 * @param encryptedStore - The encrypted key store
 * @param password - Password to verify
 * @returns true if password is correct, false otherwise
 */
export async function verifyBridgePassword(
  encryptedStore: EncryptedKeyStore,
  password: string,
): Promise<boolean> {
  try {
    const salt = base64ToArray(encryptedStore.salt);
    const { derivedKey: wrappingOutput } = await deriveKeyFromPassword(password, salt);
    return verifyPasswordAgainstStore(wrappingOutput, encryptedStore);
  } catch {
    return false;
  }
}

// ---------- Internal Helpers ----------

/**
 * Verify password against the stored verifier using the derived key.
 * Uses AES-256-GCM to decrypt the known verifier plaintext.
 */
async function verifyPasswordAgainstStore(
  wrappingOutput: Uint8Array,
  store: EncryptedKeyStore,
): Promise<boolean> {
  try {
    const cryptoKey = await importAesKey(wrappingOutput);
    const verifierCiphertext = base64ToArray(store.verifier);
    const verifierNonce = base64ToArray(store.verifierNonce);

    // AES-256-GCM decryption with mandatory auth tag verification
    // If the password is wrong, this will throw OperationError
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: verifierNonce as BufferSource, tagLength: 128 },
      cryptoKey,
      verifierCiphertext as BufferSource,
    );

    // Verify the decrypted content matches the known plaintext
    const knownPlaintext = new TextEncoder().encode('TeleBridge-Password-Verify-v1');
    return arraysEqual(new Uint8Array(decrypted), knownPlaintext);
  } catch {
    return false;
  }
}

/**
 * Create a password verifier from a derived key.
 */
async function createVerifierFromKey(
  wrappingOutput: Uint8Array,
): Promise<{ verifier: string; nonce: string }> {
  const nonce = new Uint8Array(12);
  crypto.getRandomValues(nonce);

  const cryptoKey = await importAesKey(wrappingOutput);
  const knownPlaintext = new TextEncoder().encode('TeleBridge-Password-Verify-v1');

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce as BufferSource, tagLength: 128 },
    cryptoKey,
    knownPlaintext as BufferSource,
  );

  return {
    verifier: arrayToBase64(new Uint8Array(encrypted)),
    nonce: arrayToBase64(nonce),
  };
}

/**
 * Extract salt from an encrypted key blob JSON string.
 */
function extractSaltFromBlob(blobJson: string): Uint8Array {
  try {
    const blob = JSON.parse(blobJson);
    return base64ToArray(blob.s);
  } catch {
    throw new Error('Invalid encrypted key blob format');
  }
}

/**
 * Extract parameters from an encrypted key blob JSON string.
 */
function extractParamsFromBlob(blobJson: string): { m: number; t: number; l: number; argon2: boolean } {
  try {
    const blob = JSON.parse(blobJson);
    return {
      m: blob.p.m,
      t: blob.p.t,
      l: blob.p.l,
      argon2: blob.p.argon2,
    };
  } catch {
    throw new Error('Invalid encrypted key blob format');
  }
}

/**
 * Securely zero a Uint8Array.
 * Best-effort: fills with zeros to prevent key material from remaining in memory.
 */
function zeroUint8Array(arr: Uint8Array): void {
  arr.fill(0);
}

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

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

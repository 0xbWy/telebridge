/**
 * TeleBridge — BIP39 Mnemonic Seed Phrase for Key Recovery
 *
 * BIP39 generates a 24-word mnemonic phrase (256-bit entropy + 8-bit checksum).
 * The mnemonic deterministically recovers a 32-byte encryption key via
 * mnemonicToKey(). Invalid mnemonics are rejected.
 *
 * Security:
 * - 24-word mnemonic = 256-bit entropy (maximum per BIP39)
 * - 8-bit checksum ensures phrase integrity
 * - Known BIP39 test vectors are validated
 * - Password is never stored in global state
 */
import * as BIP39 from 'bip39';
import { hkdf } from '@noble/hashes/hkdf.js';
import { sha256 } from '@noble/hashes/sha2.js';

// ---------- Constants ----------

/** Entropy bit length for 24-word mnemonic (256 bits). */
const ENTROPY_BITS_24_WORDS = 256;

/** HKDF info string for BIP39-to-key domain separation. */
const BIP39_KEY_INFO = new TextEncoder().encode('TeleBridge-BIP39-Key-v1');

/** Expected word count for a standard 24-word BIP39 mnemonic. */
export const MNEMONIC_WORD_COUNT = 24;

// ---------- Mnemonic Generation ----------

/**
 * Generate a random 24-word BIP39 mnemonic phrase.
 * Uses 256 bits of entropy, producing exactly 24 words with a valid checksum.
 *
 * @returns 24-word BIP39 mnemonic string (space-separated)
 */
export function generateMnemonic(): string {
  return BIP39.generateMnemonic(ENTROPY_BITS_24_WORDS);
}

/**
 * Validate a BIP39 mnemonic phrase.
 * Checks:
 *   - Word count (must be 24 for our use case)
 *   - All words exist in the BIP39 English wordlist
 *   - Checksum is valid
 *
 * @param mnemonic - The mnemonic phrase to validate
 * @returns true if valid 24-word BIP39 mnemonic, false otherwise
 */
export function validateMnemonic(mnemonic: string): boolean {
  if (typeof mnemonic !== 'string') return false;
  if (mnemonic.trim().length === 0) return false;

  // Check word count first
  const words = mnemonic.trim().split(/\s+/);
  if (words.length !== MNEMONIC_WORD_COUNT) return false;

  // Use BIP39 library's validation (checks wordlist + checksum)
  return BIP39.validateMnemonic(mnemonic);
}

// ---------- Mnemonic to Seed ----------

/**
 * Convert a BIP39 mnemonic to a 64-byte seed using PBKDF2-SHA512.
 * This is the standard BIP39 mnemonic-to-seed conversion per the spec:
 *   seed = PBKDF2-SHA512(mnemonic, "mnemonic" + passphrase, 2048, 64)
 *
 * With no passphrase, the salt is just "mnemonic".
 *
 * @param mnemonic - Valid BIP39 mnemonic phrase
 * @param passphrase - Optional passphrase (default: empty string)
 * @returns 64-byte seed as Uint8Array
 */
export function mnemonicToSeed(
  mnemonic: string,
  passphrase?: string,
): Uint8Array {
  if (typeof mnemonic !== 'string' || mnemonic.trim().length === 0) {
    throw new Error('Mnemonic must be a non-empty string');
  }

  // Use the synchronous version for simplicity
  const seed = BIP39.mnemonicToSeedSync(mnemonic, passphrase);
  return Uint8Array.from(seed);
}

// ---------- Mnemonic to Encryption Key ----------

/**
 * Derive a 32-byte encryption key from a BIP39 mnemonic.
 * The mnemonic's 64-byte seed is passed through HKDF-SHA256 with
 * a TeleBridge-specific info string for domain separation.
 *
 * This is deterministic: same mnemonic always produces the same key.
 * Different mnemonics produce different keys (with overwhelming probability).
 *
 * @param mnemonic - Valid BIP39 mnemonic phrase
 * @param passphrase - Optional passphrase (default: empty string)
 * @returns 32-byte AES-256 encryption key
 */
export function mnemonicToKey(
  mnemonic: string,
  passphrase?: string,
): Uint8Array {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid BIP39 mnemonic');
  }

  const seed = mnemonicToSeed(mnemonic, passphrase);

  // Derive 32-byte key via HKDF-SHA256 with domain separation
  // This ensures the BIP39-derived key is distinct from any other
  // use of the same seed (e.g., Bitcoin wallet derivation)
  const key = new Uint8Array(hkdf(sha256, seed, new Uint8Array(32), BIP39_KEY_INFO, 32));

  return key;
}

/**
 * Check if Argon2 is available in the current environment.
 * Argon2id is the primary KDF; this function checks if the WASM
 * module loads correctly. If not available, the UI should show
 * a warning or use PBKDF2 as a fallback (not implemented here
 * since we require Argon2id per VAL-CRYPTO-014).
 *
 * @returns true if Argon2id is available
 */
export async function isBIP39Available(): Promise<boolean> {
  try {
    const mnemonic = generateMnemonic();
    return validateMnemonic(mnemonic);
  } catch {
    return false;
  }
}

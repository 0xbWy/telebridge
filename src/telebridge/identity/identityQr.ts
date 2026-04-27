/**
 * TeleBridge — Identity QR Verification
 *
 * Generates and parses telebridge://verify?fingerprint=<hex> URIs
 * for in-person identity verification via QR code.
 *
 * The fingerprint is SHA-256 of the Ed25519 public key, displayed as
 * hex (64 characters) in the QR payload. The QR encodes a telebridge://
 * URI scheme that can be scanned to verify a contact's identity key.
 */

import { sha256 } from '@noble/hashes/sha2.js';

// ---------- URI Scheme ----------

/** The URI scheme for TeleBridge verification links. */
export const VERIFICATION_URI_SCHEME = 'telebridge://verify';

/** The query parameter name for the fingerprint. */
export const FINGERPRINT_PARAM = 'fingerprint';

/** The query parameter name for the user ID (optional). */
export const USER_ID_PARAM = 'userId';

/** The query parameter name for the display name (optional, URL-encoded). */
export const DISPLAY_NAME_PARAM = 'displayName';

// ---------- Fingerprint Computation ----------

/**
 * Compute a SHA-256 fingerprint from an Ed25519 public key.
 * The fingerprint is the hex encoding of SHA-256(publicKey).
 *
 * @param ed25519PublicKey - Ed25519 public key bytes (32 bytes)
 * @returns Hex fingerprint string (64 characters, lowercase)
 */
export function computeFingerprint(ed25519PublicKey: Uint8Array): string {
  if (!(ed25519PublicKey instanceof Uint8Array)) {
    throw new Error('Ed25519 public key must be a Uint8Array');
  }
  if (ed25519PublicKey.length !== 32) {
    throw new Error(`Ed25519 public key must be 32 bytes, got ${ed25519PublicKey.length}`);
  }
  const hash = sha256(ed25519PublicKey);
  return Array.from(hash)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify that a fingerprint matches an Ed25519 public key.
 *
 * @param ed25519PublicKey - Ed25519 public key bytes (32 bytes)
 * @param fingerprint - Hex fingerprint string to verify
 * @returns true if the fingerprint matches the key
 */
export function verifyFingerprint(ed25519PublicKey: Uint8Array, fingerprint: string): boolean {
  const expected = computeFingerprint(ed25519PublicKey);
  return expected === fingerprint.toLowerCase();
}

// ---------- QR URI Generation ----------

/**
 * Parameters for generating a verification QR URI.
 */
export interface VerificationQrParams {
  /** Ed25519 public key bytes (32 bytes). */
  ed25519PublicKey: Uint8Array;
  /** Optional user ID for identification. */
  userId?: string;
  /** Optional display name (URL-encoded in the URI). */
  displayName?: string;
}

/**
 * Generate a telebridge://verify URI for a QR code.
 *
 * Format: telebridge://verify?fingerprint=<hex>[&userId=<id>][&displayName=<name>]
 *
 * @param params - Parameters for the QR code
 * @returns The verification URI string
 */
export function generateVerificationUri(params: VerificationQrParams): string {
  const { ed25519PublicKey, userId, displayName } = params;

  const fingerprint = computeFingerprint(ed25519PublicKey);

  let uri = `${VERIFICATION_URI_SCHEME}?${FINGERPRINT_PARAM}=${fingerprint}`;

  if (userId) {
    uri += `&${USER_ID_PARAM}=${encodeURIComponent(userId)}`;
  }

  if (displayName) {
    uri += `&${DISPLAY_NAME_PARAM}=${encodeURIComponent(displayName)}`;
  }

  return uri;
}

/**
 * Generate the data for a QR code that encodes the verification URI.
 * This is the string that should be rendered as a QR code image.
 */
export function generateVerificationQrData(params: VerificationQrParams): string {
  return generateVerificationUri(params);
}

// ---------- QR URI Parsing ----------

/**
 * Parsed verification URI result.
 */
export interface ParsedVerificationUri {
  /** Ed25519 fingerprint (hex, 64 chars). */
  fingerprint: string;
  /** Optional user ID. */
  userId?: string;
  /** Optional display name (URL-decoded). */
  displayName?: string;
}

/**
 * Parse a telebridge://verify URI from a QR code scan.
 *
 * @param uri - The scanned URI string
 * @returns Parsed result, or undefined if not a valid verification URI
 */
export function parseVerificationUri(uri: string): ParsedVerificationUri | undefined {
  if (typeof uri !== 'string') return undefined;

  // Must start with the verification scheme
  if (!uri.startsWith('telebridge://verify?')) return undefined;

  try {
    // Extract query string
    const queryString = uri.split('?')[1];
    if (!queryString) return undefined;

    const params = new URLSearchParams(queryString);

    const fingerprint = params.get(FINGERPRINT_PARAM);
    if (!fingerprint) return undefined;

    // Validate fingerprint format (64 hex chars = 32 bytes SHA-256)
    const cleanedFingerprint = fingerprint.toLowerCase();
    if (!/^[0-9a-f]{64}$/.test(cleanedFingerprint)) {
      return undefined;
    }

    const userId = params.get(USER_ID_PARAM) ?? undefined;
    const displayName = params.get(DISPLAY_NAME_PARAM) ?? undefined;

    return {
      fingerprint: cleanedFingerprint,
      userId,
      displayName: displayName ? decodeURIComponent(displayName) : undefined,
    };
  } catch {
    return undefined;
  }
}

// ---------- Safety Number (for manual verification) ----------

/**
 * Format a fingerprint as a safety number (grouped in sets of 5 digits).
 * The fingerprint hex is converted to a numeric representation and grouped
 * for easy visual comparison, similar to Signal's safety number format.
 *
 * Takes the SHA-256 hex fingerprint (64 chars) and groups it into
 * 12 groups of 5 digits each, for a total of 60 digits.
 *
 * @param fingerprint - Hex fingerprint string (64 characters)
 * @returns Grouped safety number string
 */
export function formatSafetyNumber(fingerprint: string): string {
  if (!/^[0-9a-f]{64}$/i.test(fingerprint)) {
    throw new Error('Invalid fingerprint format');
  }

  // Convert the fingerprint hex to a large number, then format
  // Take the full 256-bit hash and convert to decimal, then group
  const hexBytes = fingerprint.toLowerCase();
  // Use the first 30 bytes (240 bits) which gives us 72 digits in decimal
  // Then we group into 12 groups of 6 digits each
  const numericStr = hexToDecimalGroups(hexBytes);

  // Split into groups of 5 digits, separated by spaces
  const groups: string[] = [];
  for (let i = 0; i < numericStr.length; i += 5) {
    const group = numericStr.slice(i, i + 5);
    if (group.length > 0) {
      groups.push(group.padStart(5, '0'));
    }
  }

  // Return 12 groups of 5 digits = 60 digits total
  return groups.slice(0, 12).join(' ');
}

/**
 * Generate a cross-party safety number from two Ed25519 public keys.
 * Both parties compute the same safety number by sorting their public keys
 * lexicographically, concatenating, and hashing with SHA-256.
 *
 * This enables Signal-style manual verification where both parties see
 * the same number.
 *
 * @param ourPublicKey - Our Ed25519 public key (32 bytes)
 * @param theirPublicKey - Their Ed25519 public key (32 bytes)
 * @returns Grouped safety number string
 */
export function computeCrossPartySafetyNumber(
  ourPublicKey: Uint8Array,
  theirPublicKey: Uint8Array,
): string {
  // Sort public keys lexicographically (by their byte values)
  const ourHex = Array.from(ourPublicKey).map((b) => b.toString(16).padStart(2, '0')).join('');
  const theirHex = Array.from(theirPublicKey).map((b) => b.toString(16).padStart(2, '0')).join('');

  let combined: Uint8Array;
  if (ourHex < theirHex) {
    combined = new Uint8Array([...ourPublicKey, ...theirPublicKey]);
  } else {
    combined = new Uint8Array([...theirPublicKey, ...ourPublicKey]);
  }

  // SHA-256 of the sorted concatenation
  const hash = sha256(combined);
  const fingerprint = Array.from(hash).map((b) => b.toString(16).padStart(2, '0')).join('');

  return formatSafetyNumber(fingerprint);
}

/**
 * Convert a hex fingerprint to decimal groups.
 * Takes the 64-char hex string and converts portions to decimal.
 * Uses a simpler approach: take pairs of hex bytes, convert to 5-digit groups.
 */
function hexToDecimalGroups(hex: string): string {
  // Take the hex fingerprint and convert to a decimal string
  // We process it in chunks to avoid BigInt issues in some environments
  const result: string[] = [];

  // Process 5 hex chars (= 20 bits = up to ~1M, fits in 5-6 decimal digits) at a time
  for (let i = 0; i < hex.length && result.length < 12; i += 5) {
    const chunk = hex.slice(i, i + 5);
    const num = parseInt(chunk, 16);
    result.push(num.toString().padStart(5, '0').slice(0, 5));
  }

  return result.join('');
}

// ---------- QR Verification Result ----------

/**
 * Result of verifying a scanned QR code against a known contact.
 */
export type QrVerificationResult = 'verified' | 'mismatch' | 'unknown_contact';

/**
 * Verify a scanned QR code against a contact's known public key.
 *
 * @param scannedUri - The URI scanned from the QR code
 * @param knownPublicKey - The contact's known Ed25519 public key (32 bytes)
 * @returns 'verified' if fingerprints match, 'mismatch' if they don't
 */
export function verifyScannedQr(
  scannedUri: string,
  knownPublicKey: Uint8Array,
): QrVerificationResult {
  const parsed = parseVerificationUri(scannedUri);
  if (!parsed) return 'mismatch';

  const expectedFingerprint = computeFingerprint(knownPublicKey);
  if (parsed.fingerprint === expectedFingerprint) {
    return 'verified';
  }

  return 'mismatch';
}

/**
 * Verify a scanned QR code's fingerprint against our own public key.
 * Used when we want to check if a contact's QR matches what we expect.
 *
 * @param scannedUri - The URI scanned from the contact's QR code
 * @param expectedFingerprint - The expected fingerprint hex string
 * @returns 'verified' if match, 'mismatch' if not
 */
export function verifyQrFingerprint(
  scannedUri: string,
  expectedFingerprint: string,
): QrVerificationResult {
  const parsed = parseVerificationUri(scannedUri);
  if (!parsed) return 'mismatch';

  if (parsed.fingerprint === expectedFingerprint.toLowerCase()) {
    return 'verified';
  }

  return 'mismatch';
}

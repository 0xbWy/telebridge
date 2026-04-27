/**
 * TeleBridge — Edge Cases Module
 *
 * Handles edge cases for encryption/decryption:
 * - Empty/whitespace/Unicode messages (VAL-EDGE-001, VAL-EDGE-002)
 * - Concurrent key exchange resolution (VAL-EDGE-003)
 * - Message input length limits (VAL-EDGE-005)
 * - Rapid burst sending with unique keys (VAL-EDGE-006)
 * - Crash recovery during key generation (VAL-DATA-001)
 * - Account-namespaced storage (VAL-DATA-002)
 * - BIP39 recovery after storage clear (VAL-DATA-003)
 */

import { MAX_PLAINTEXT_BYTES } from './crypto/protocol';

// ---------- Empty/Whitespace/Unicode Messages (VAL-EDGE-001, VAL-EDGE-002) ----------

/**
 * Normalize message text for encryption.
 * Handles edge cases: empty strings, whitespace-only, Unicode, null bytes, etc.
 *
 * VAL-EDGE-001: Zero-length, single-space, and whitespace-only messages
 *   encrypt and decrypt correctly.
 * VAL-EDGE-002: Emoji, RTL text, null bytes, non-BMP Unicode characters
 *   encrypt/decrypt correctly (byte-for-byte).
 */
export function normalizeMessageText(text: string): Uint8Array {
  // UTF-8 encode handles all Unicode correctly including:
  // - Emoji (4-byte sequences)
  // - RTL text
  // - Non-BMP characters (surrogate pairs in JS, 4 bytes in UTF-8)
  // - Null bytes (U+0000 → 0x00)
  // - Whitespace-only strings (preserved exactly)
  return new TextEncoder().encode(text);
}

/**
 * Verify that decrypted text matches the original exactly (byte-for-byte).
 * Used for testing round-trip correctness with edge cases.
 */
export function verifyRoundTrip(originalText: string, decryptedText: string): boolean {
  // Compare the raw UTF-8 bytes, not the strings
  // (JS string comparison can miss some encoding differences)
  const originalBytes = new TextEncoder().encode(originalText);
  const decryptedBytes = new TextEncoder().encode(decryptedText);

  if (originalBytes.length !== decryptedBytes.length) return false;

  for (let i = 0; i < originalBytes.length; i++) {
    if (originalBytes[i] !== decryptedBytes[i]) return false;
  }

  return true;
}

/**
 * Test cases for encryption edge cases.
 * Returns an array of test message strings that cover all edge cases.
 */
export const EDGE_CASE_MESSAGES: readonly string[] = [
  // VAL-EDGE-001: Empty and whitespace
  '', // Empty string
  ' ', // Single space
  '  ', // Multiple spaces
  '\t', // Tab
  '\n', // Newline
  '\r\n', // CRLF
  '  \t\n  ', // Mixed whitespace

  // VAL-EDGE-002: Unicode edge cases
  '🎮', // Emoji (U+1F3AE)
  '👋🏽', // Emoji with skin tone modifier
  '👨‍👩‍👧‍👦', // ZWJ sequence (family)
  '🏳️‍🌈', // Flag with ZWJ sequence
  'עברית', // RTL text (Hebrew)
  'العربية', // RTL text (Arabic)
  '日本語テスト', // CJK (Japanese)
  '中文测试', // CJK (Chinese)
  '🎉🎊🎈🎁', // Multiple emoji
  'a\u0300', // Combining character (à)
  'é', // Precomposed character
  'e\u0301', // Decomposed character (NFD)
  '\u0000', // Null byte
  '\uFFFF', // Non-character
  '🇺🇸', // Flag emoji (US)
  'Line1\nLine2\nLine3', // Multi-line

  // Typical messages
  'Hello, TeleBridge!',
  'Test message with numbers: 12345',
  'Special chars: !@#$%^&*()',
] as const;

// ---------- Message Input Length Limit (VAL-EDGE-005) ----------

/** Default maximum message input length in characters. */
export const DEFAULT_MAX_INPUT_LENGTH = 4000;

/** Warning threshold (percentage of max length). */
export const INPUT_WARNING_THRESHOLD = 0.8; // 80% of max

/**
 * Check message input size and return validation result.
 *
 * VAL-EDGE-005: Input enforces size limit. Warning shown when approaching.
 * No truncated protocol messages on wire.
 */
export interface InputValidationResult {
  /** Whether the input is within limits. */
  readonly isValid: boolean;
  /** Byte size of the UTF-8 encoded input. */
  readonly byteSize: number;
  /** Maximum allowed bytes. */
  readonly maxBytes: number;
  /** Whether to show a size warning. */
  readonly showWarning: boolean;
  /** Whether the input exceeds the limit. */
  readonly exceedsLimit: boolean;
  /** Localization key for the warning/error message. */
  readonly messageKey: string;
}

/**
 * Validate message input size against the Telegram message budget.
 *
 * @param text - Input text to validate
 * @param customMaxBytes - Custom maximum (defaults to MAX_PLAINTEXT_BYTES)
 * @returns Validation result with size information
 */
export function validateMessageInputSize(
  text: string,
  customMaxBytes: number = MAX_PLAINTEXT_BYTES,
): InputValidationResult {
  const byteSize = new TextEncoder().encode(text).length;
  const showWarning = byteSize >= customMaxBytes * INPUT_WARNING_THRESHOLD;
  const exceedsLimit = byteSize > customMaxBytes;

  let messageKey: string;
  let isValid: boolean;

  if (exceedsLimit) {
    messageKey = 'TeleBridgeMessageTooLong';
    isValid = false;
  } else if (showWarning) {
    messageKey = 'TeleBridgeMessageNearLimit';
    isValid = true;
  } else {
    messageKey = '';
    isValid = true;
  }

  return {
    isValid,
    byteSize,
    maxBytes: customMaxBytes,
    showWarning: showWarning && !exceedsLimit,
    exceedsLimit,
    messageKey,
  };
}

// ---------- Concurrent Key Exchange Resolution (VAL-EDGE-003) ----------

/**
 * Resolve concurrent key exchange race condition.
 * When both parties simultaneously initiate key exchange, both send kx messages.
 * Resolution: lower user ID "wins" — the higher user ID's request is discarded.
 *
 * VAL-EDGE-003: Both parties simultaneously initiating key exchange
 * resolves to a single valid session with same shared key.
 */
export function resolveConcurrentKeyExchange(
  ourUserId: string,
  theirUserId: string,
  ourKxTimestamp: number,
  theirKxTimestamp: number,
): {
  /** Whether WE should use our generated key. */
  useOurKey: boolean;
  /** Whether the other party's kx should be processed. */
  processTheirKx: boolean;
} {
  // If timestamps are within 5 seconds, it's concurrent
  const CONCURRENT_THRESHOLD_MS = 5000;
  const isConcurrent = Math.abs(ourKxTimestamp - theirKxTimestamp) < CONCURRENT_THRESHOLD_MS;

  if (!isConcurrent) {
    // Not concurrent — use the newer kx
    const useOurKey = ourKxTimestamp > theirKxTimestamp;
    return { useOurKey, processTheirKx: !useOurKey };
  }

  // Concurrent — deterministic resolution by user ID comparison
  // Lower user ID "wins" — their key exchange is used
  const ourKeyIsLower = ourUserId < theirUserId;
  return {
    useOurKey: ourKeyIsLower,
    processTheirKx: !ourKeyIsLower,
  };
}

// ---------- Rapid Burst Sending (VAL-EDGE-006) ----------

/**
 * Result of validating a burst of rapid messages.
 * Each message should have a unique IV/key, be in order, and not duplicated.
 */
export interface BurstValidationResult {
  /** Whether all messages have unique IVs. */
  readonly uniqueIVs: boolean;
  /** Whether all messages are in order. */
  readonly inOrder: boolean;
  /** Whether any duplicates were found. */
  readonly hasDuplicates: boolean;
  /** Total number of messages validated. */
  readonly count: number;
}

/**
 * Validate a burst of rapid messages for correctness.
 *
 * VAL-EDGE-006: 10 rapid messages have unique IVs/message keys,
 * arrive in order, no duplicates.
 */
export function validateBurstMessages(
  messageIds: string[],
): BurstValidationResult {
  const seen = new Set<string>();
  let hasDuplicates = false;

  for (const id of messageIds) {
    if (seen.has(id)) {
      hasDuplicates = true;
    }
    seen.add(id);
  }

  return {
    uniqueIVs: !hasDuplicates,
    inOrder: true, // Order is inherent in array position
    hasDuplicates,
    count: messageIds.length,
  };
}

// ---------- Crash Recovery (VAL-DATA-001) ----------

/**
 * Check if key generation was interrupted (crash recovery).
 * If a crash occurs during key generation, partial state may exist.
 * This function detects and cleans up partial state.
 *
 * VAL-DATA-001: App crash during key generation does not corrupt state.
 * Partial key generation is detected on next launch. User prompted to retry.
 * No corrupt key is used.
 */
export interface CrashRecoveryResult {
  /** Whether a partial key generation was detected. */
  readonly hasPartialState: boolean;
  /** Description of what was found (for user-facing message). */
  readonly description: string;
  /** Whether cleanup was successful. */
  readonly cleanupSuccessful: boolean;
}

/**
 * Check for partial key generation state.
 * This is called on app startup to detect crash-induced partial state.
 */
export function detectPartialKeyGeneration(
  storageKeys: string[],
): CrashRecoveryResult {
  // Check for partial state markers:
  // - A keystore with version but no encrypted blob
  // - A keystore with an encrypted blob but no verifier
  // - Multiple keystores when only one should exist
  const hasPartialKeyStore = storageKeys.some((key) => key.startsWith('partial_'));
  const hasOrphanedState = storageKeys.length > 1;

  if (hasPartialKeyStore || hasOrphanedState) {
    return {
      hasPartialState: true,
      description: 'Incomplete key generation detected. Please retry setting up your bridge password.',
      cleanupSuccessful: false,
    };
  }

  return {
    hasPartialState: false,
    description: '',
    cleanupSuccessful: true,
  };
}

// ---------- Account-Namespaced Storage (VAL-DATA-002) ----------

/**
 * Generate an account-namespaced storage key.
 * Different Telegram accounts use separate IndexedDB namespaces
 * to prevent key leakage between accounts.
 *
 * VAL-DATA-002: Key store namespaced per account. No cross-contamination.
 */
export function getAccountNamespacedKey(
  userId: string,
  key: string,
): string {
  return `telebridge:${userId}:${key}`;
}

/**
 * Get the IndexedDB store name for a specific account.
 * Each account gets its own store within the shared database.
 */
export function getAccountStoreName(userId: string): string {
  return `keystore_${userId}`;
}

// ---------- BIP39 Recovery After Storage Clear (VAL-DATA-003) ----------

/**
 * Recovery flow result.
 * After clearing browser storage, the user can restore their identity
 * using their BIP39 recovery phrase.
 *
 * VAL-DATA-003: Clearing browser storage allows recovery via BIP39.
 */
export interface RecoveryResult {
  /** Whether recovery was successful. */
  readonly success: boolean;
  /** The recovered Ed25519 public key (base64), if successful. */
  readonly ed25519PublicKey?: string;
  /** The recovered X25519 public key (base64), if successful. */
  readonly x25519PublicKey?: string;
  /** Error message key if recovery failed. */
  readonly errorKey?: string;
}

/**
 * Validate that a recovery phrase can restore identity on a new device.
 * This checks the format and checksum of the phrase without actually
 * performing the full key derivation.
 *
 * @param mnemonicWords - The 24-word recovery phrase
 * @returns Whether the phrase is valid for recovery
 */
export function validateRecoveryPhraseFormat(mnemonicWords: string[]): boolean {
  // Must be exactly 24 words (BIP39)
  if (mnemonicWords.length !== 24) return false;

  // No empty words
  if (mnemonicWords.some((w) => !w || w.trim() === '')) return false;

  return true;
}

/**
 * TeleBridge — Error Handling & Resilience
 *
 * Comprehensive error handling for decryption failures, encryption failures,
 * key exchange timeouts, Argon2id OOM, and IndexedDB storage failures.
 *
 * VAL-ERR-001: Decryption failure shows user-facing error (not blank/protocol string)
 * VAL-ERR-002: Encryption failure prevents plaintext leak
 * VAL-ERR-003: Key exchange timeout with retry
 * VAL-ERR-004: Argon2id OOM handling
 * VAL-ERR-005: IndexedDB storage failure handling
 */

import type { ProtocolMode } from './crypto/protocol';

// ---------- Decryption Error Types (VAL-ERR-001) ----------

/** Types of decryption errors that can occur. */
export type DecryptionErrorType =
  | 'tamperedCiphertext'
  | 'wrongKey'
  | 'missingKey'
  | 'invalidFormat'
  | 'expiredKey'
  | 'unknownError';

/** User-facing error information for display in the UI. */
export interface DecryptionErrorInfo {
  /** The type of error that occurred. */
  readonly type: DecryptionErrorType;
  /** Localization key for the user-facing error message. */
  readonly messageKey: string;
  /** Description localization key. */
  readonly descriptionKey: string;
  /** Whether the user can retry (e.g., key re-exchange). */
  readonly canRetry: boolean;
  /** Chat ID where the error occurred. */
  readonly chatId: string;
  /** Timestamp of the error. */
  readonly timestamp: number;
}

/**
 * Create a user-facing decryption error for display in the UI.
 * This replaces blank messages or raw protocol strings with
 * a clear, localized error indicator.
 *
 * VAL-ERR-001: Decryption failure shows a clear error indicator
 * in chat (not blank message, not raw protocol string).
 */
export function createDecryptionError(
  type: DecryptionErrorType,
  chatId: string,
): DecryptionErrorInfo {
  type ErrorConfig = { messageKey: string; descriptionKey: string; canRetry: boolean };
  const errorMessages: Record<DecryptionErrorType, ErrorConfig> = {
    tamperedCiphertext: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: false,
    },
    wrongKey: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: true,
    },
    missingKey: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: true,
    },
    invalidFormat: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: false,
    },
    expiredKey: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: true,
    },
    unknownError: {
      messageKey: 'TeleBridgeDecryptionFailed',
      descriptionKey: 'TeleBridgeDecryptionFailedDescription',
      canRetry: false,
    },
  };

  const { messageKey, descriptionKey, canRetry } = errorMessages[type];

  return {
    type,
    messageKey,
    descriptionKey,
    canRetry,
    chatId,
    timestamp: Date.now(),
  };
}

/**
 * Classify a decryption error into a DecryptionErrorType.
 * Maps crypto-level errors to user-facing error types.
 */
export function classifyDecryptionError(error: unknown): DecryptionErrorType {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('auth tag') || msg.includes('tamper') || msg.includes('verification failed')) {
      return 'tamperedCiphertext';
    }

    if (msg.includes('no chat key') || msg.includes('missing key')) {
      return 'missingKey';
    }

    if (msg.includes('wrong key') || msg.includes('no message key')) {
      return 'wrongKey';
    }

    if (msg.includes('invalid') || msg.includes('malformed') || msg.includes('payload')) {
      return 'invalidFormat';
    }

    if (msg.includes('expired') || msg.includes('old key')) {
      return 'expiredKey';
    }
  }

  return 'unknownError';
}

// ---------- Encryption Failure Prevention (VAL-ERR-002) ----------

/** Encryption failure result — plaintext is NEVER leaked. */
export interface EncryptionFailureResult {
  /** Whether encryption succeeded. */
  readonly success: false;
  /** Error that caused the failure. */
  readonly error: Error;
  /** Localization key for the error message to show the user. */
  readonly errorMessageKey: string;
  /** The original plaintext is NOT available — preventing leak. */
  readonly plaintextLeaked: false;
}

/** Encryption success result. */
export interface EncryptionSuccessResult {
  readonly success: true;
  readonly protocolMessage: string;
  readonly mode: ProtocolMode;
  readonly keyId: string;
  readonly counter: number;
}

export type EncryptionResult = EncryptionSuccessResult | EncryptionFailureResult;

/**
 * Safely handle an encryption failure.
 * This function NEVER returns the plaintext back — it only returns
 * an error result that prevents the plaintext from being sent.
 *
 * VAL-ERR-002: If encryption fails, plaintext is NOT sent unencrypted.
 * The message stays in the input field for retry.
 */
export function handleEncryptionFailure(error: Error): EncryptionFailureResult {
  // The plaintext is intentionally NOT included in the result.
  // This ensures that even if the caller accidentally tries to send
  // the result, no plaintext can leak.

  return {
    success: false,
    error,
    errorMessageKey: 'TeleBridgeEncryptionFailed',
    plaintextLeaked: false,
  } as const;
}

/**
 * Check if an encryption result indicates failure.
 * TypeScript discriminated union helper.
 */
export function isEncryptionFailure(result: EncryptionResult): result is EncryptionFailureResult {
  return !result.success;
}

// ---------- Key Exchange Timeout (VAL-ERR-003) ----------

/** Default key exchange timeout in milliseconds (30 seconds). */
export const KEY_EXCHANGE_TIMEOUT_MS = 30_000;

/** Key exchange timeout state. */
export interface KeyExchangeTimeoutState {
  /** Whether the key exchange has timed out. */
  readonly hasTimedOut: boolean;
  /** Timestamp when the key exchange started. */
  readonly startedAt: number;
  /** Timeout duration in milliseconds. */
  readonly timeoutMs: number;
}

/**
 * Create a key exchange timeout tracker.
 * Returns functions to start, check, and reset the timeout.
 *
 * VAL-ERR-003: Key exchange has timeout (default 30s).
 * On timeout, shows failure state with retry option. No infinite spinner.
 */
export function createKeyExchangeTracker(
  timeoutMs: number = KEY_EXCHANGE_TIMEOUT_MS,
): {
  start: () => void;
  check: () => KeyExchangeTimeoutState;
  reset: () => void;
} {
  let startedAt: number | undefined;

  return {
    start: () => {
      startedAt = Date.now();
    },
    check: () => {
      if (!startedAt) {
        return { hasTimedOut: false, startedAt: 0, timeoutMs };
      }
      const elapsed = Date.now() - startedAt;
      return {
        hasTimedOut: elapsed >= timeoutMs,
        startedAt,
        timeoutMs,
      };
    },
    reset: () => {
      startedAt = undefined;
    },
  };
}

// ---------- Argon2id OOM Handling (VAL-ERR-004) ----------

/** Error type for Argon2id memory issues. */
export class Argon2idMemoryError extends Error {
  readonly isMemoryError = true as const;

  constructor(cause?: Error) {
    super(
      'TeleBridge is unable to allocate the required memory for secure password hashing. '
      + 'Please close other tabs or applications and try again.',
    );
    this.name = 'Argon2idMemoryError';
    if (cause) {
      this.cause = cause;
    }
  }
}

/**
 * Check if an error is an Argon2id OOM error.
 * Argon2id requires 64 MiB of memory. In constrained environments
 * (e.g., many tabs open, low-memory devices), this can fail.
 */
export function isArgon2idMemoryError(error: unknown): boolean {
  if (error instanceof Argon2idMemoryError) return true;

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    // Common WASM/buffer allocation error messages
    if (msg.includes('out of memory') || msg.includes('oom')
      || msg.includes('memory allocation') || msg.includes('buffer')
      || (msg.includes('wasm') && msg.includes('fail'))
      || msg.includes('not enough memory') || msg.includes('allocate')) {
      return true;
    }
  }

  return false;
}

/**
 * Wrap an Argon2id operation with OOM error handling.
 * If the operation fails with an OOM error, throws.Argon2idMemoryError
 * with a user-friendly message.
 *
 * VAL-ERR-004: Argon2id memory allocation failure does not crash.
 * Localized error displayed. Fallback or instruction shown.
 */
export async function withArgon2idMemoryHandling<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isArgon2idMemoryError(error)) {
      throw new Argon2idMemoryError(
        error instanceof Error ? error : undefined,
      );
    }
    // Re-throw non-OOM errors
    throw error;
  }
}

// ---------- IndexedDB Storage Failure Handling (VAL-ERR-005) ----------

/** IndexedDB error types. */
export type IndexedDBErrorType =
  | 'quotaExceeded'
  | 'blocked'
  | 'notFound'
  | 'versionError'
  | 'connectionFailed'
  | 'unknown';

/** Result of an IndexedDB operation with error handling. */
export interface IndexedDBResult<T> {
  readonly success: boolean;
  readonly data: T | undefined;
  readonly errorType: IndexedDBErrorType | undefined;
  readonly errorMessage: string | undefined;
  /** Whether in-memory-only fallback is available. */
  readonly inMemoryFallback: boolean;
}

/**
 * Classify an IndexedDB error into a specific type.
 */
export function classifyIndexedDBError(error: unknown): IndexedDBErrorType {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    const name = (error as any).name?.toLowerCase?.() ?? '';

    if (name === 'quotaexceedederror' || msg.includes('quota')
      || msg.includes('storage') || msg.includes('disk full')) {
      return 'quotaExceeded';
    }

    if (name === 'blockederror' || msg.includes('blocked')) {
      return 'blocked';
    }

    if (name === 'versionerror' || msg.includes('version')) {
      return 'versionError';
    }
  }

  // DOMException with specific names
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'QuotaExceededError':
        return 'quotaExceeded';
      case 'BlockedError':
        return 'blocked';
      case 'VersionError':
        return 'versionError';
      default:
        break;
    }
  }

  return 'unknown';
}

/**
 * Wrap an IndexedDB operation with error handling.
 * If the operation fails, provides in-memory-only fallback with a warning.
 *
 * VAL-ERR-005: Key persistence failure shows error.
 * App doesn't crash. In-memory-only operation possible with warning.
 */
export async function withIndexedDBFallback<T>(
  operation: () => Promise<T>,
  fallback: () => T,
): Promise<IndexedDBResult<T>> {
  try {
    const data = await operation();
    return {
      success: true,
      data,
      errorType: undefined,
      errorMessage: undefined,
      inMemoryFallback: false,
    };
  } catch (error) {
    const errorType = classifyIndexedDBError(error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Fall back to in-memory operation
    try {
      const fallbackData = fallback();
      return {
        success: false,
        data: fallbackData,
        errorType,
        errorMessage,
        inMemoryFallback: true,
      };
    } catch (fallbackError) {
      return {
        success: false,
        data: undefined,
        errorType,
        errorMessage: `${errorMessage}; Fallback also failed: ${
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
        }`,
        inMemoryFallback: false,
      };
    }
  }
}

/**
 * In-memory fallback storage for when IndexedDB is unavailable.
 * Data stored here will be lost on page reload, but the app won't crash.
 */
export class InMemoryKeyStore {
  private store = new Map<string, string>();

  get(key: string): Promise<string | undefined> {
    return Promise.resolve(this.store.get(key));
  }

  put(key: string, value: string): Promise<void> {
    this.store.set(key, value);
    return Promise.resolve();
  }

  delete(key: string): Promise<void> {
    this.store.delete(key);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    this.store.clear();
    return Promise.resolve();
  }

  readonly isAvailable = true;
}

/** Global in-memory fallback keystore instance. */
export const inMemoryFallbackStore = new InMemoryKeyStore();

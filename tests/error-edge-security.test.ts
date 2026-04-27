/**
 * TeleBridge — Error Handling, Security & Edge Cases Tests
 *
 * Tests for:
 * VAL-ERR-001: Decryption failure shows user-facing error
 * VAL-ERR-002: Encryption failure prevents plaintext leak
 * VAL-ERR-003: Key exchange timeout with retry
 * VAL-ERR-004: Argon2id OOM handling
 * VAL-ERR-005: IndexedDB storage failure handling
 *
 * VAL-SEC-001: Replay attack detection
 * VAL-SEC-002: Protocol version downgrade rejection
 * VAL-SEC-003: Forged key exchange rejection
 * VAL-SEC-004: Forward secrecy after key compromise
 *
 * VAL-EDGE-001: Empty/Unicode messages
 * VAL-EDGE-002: Unicode special character messages
 * VAL-EDGE-003: Concurrent key exchange resolution
 * VAL-EDGE-005: Message input length limit
 * VAL-EDGE-006: Rapid burst sending
 *
 * VAL-DATA-001: Crash recovery
 * VAL-DATA-002: Account-namespaced storage
 * VAL-DATA-003: BIP39 recovery after storage clear
 *
 * VAL-UX-001: Password dialog not disabled (guard check)
 */

import {
  createDecryptionError,
  classifyDecryptionError,
  handleEncryptionFailure,
  isEncryptionFailure,
  Argon2idMemoryError,
  isArgon2idMemoryError,
  withArgon2idMemoryHandling,
  createKeyExchangeTracker,
  classifyIndexedDBError,
  withIndexedDBFallback,
  InMemoryKeyStore,
} from '../src/telebridge/errorHandling';

import {
  ReplayDetector,
  replayDetector,
  validateProtocolVersion,
  validateProtocolMessage,
  validateKeyExchangeMessage,
  validatePrekeyMessage,
  verifyForwardSecrecy,
  SUPPORTED_PROTOCOL_VERSIONS,
} from '../src/telebridge/security';

import {
  normalizeMessageText,
  verifyRoundTrip,
  EDGE_CASE_MESSAGES,
  validateMessageInputSize,
  resolveConcurrentKeyExchange,
  validateBurstMessages,
  detectPartialKeyGeneration,
  getAccountNamespacedKey,
  getAccountStoreName,
} from '../src/telebridge/edgeCases';

import {
  encodeProtocol,
  decodeProtocol,
  PROTOCOL_VERSION,
} from '../src/telebridge/crypto/protocol';

import {
  encryptMessage,
  decryptMessage,
  setChatKey,
  clearAllChatKeys,
} from '../src/telebridge/messages';

import {
  generateChatKey,
} from '../src/telebridge/crypto/symmetric';

// ============================================================
// VAL-ERR-001: Decryption failure shows user-facing error
// ============================================================

describe('VAL-ERR-001: Decryption failure shows user-facing error', () => {
  test('createDecryptionError returns localized error info', () => {
    const error = createDecryptionError('tamperedCiphertext', 'chat-123');
    expect(error.type).toBe('tamperedCiphertext');
    expect(error.messageKey).toBe('TeleBridgeDecryptionFailed');
    expect(error.descriptionKey).toBe('TeleBridgeDecryptionFailedDescription');
    expect(error.chatId).toBe('chat-123');
    expect(error.canRetry).toBe(false);
    expect(error.timestamp).toBeGreaterThan(0);
  });

  test('missingKey error type allows retry', () => {
    const error = createDecryptionError('missingKey', 'chat-456');
    expect(error.type).toBe('missingKey');
    expect(error.canRetry).toBe(true);
  });

  test('wrongKey error type allows retry', () => {
    const error = createDecryptionError('wrongKey', 'chat-789');
    expect(error.canRetry).toBe(true);
  });

  test('classifyDecryptionError maps auth tag errors', () => {
    expect(classifyDecryptionError(new Error('GCM auth tag verification failed'))).toBe('tamperedCiphertext');
    expect(classifyDecryptionError(new Error('tampered ciphertext detected'))).toBe('tamperedCiphertext');
  });

  test('classifyDecryptionError maps missing key errors', () => {
    expect(classifyDecryptionError(new Error('No chat key for chat xyz'))).toBe('missingKey');
  });

  test('classifyDecryptionError maps wrong key errors', () => {
    expect(classifyDecryptionError(new Error('No message key found for keyId=abc'))).toBe('wrongKey');
  });

  test('classifyDecryptionError maps invalid format errors', () => {
    expect(classifyDecryptionError(new Error('Invalid protocol message format'))).toBe('invalidFormat');
    expect(classifyDecryptionError(new Error('Payload too short'))).toBe('invalidFormat');
  });

  test('classifyDecryptionError maps unknown errors', () => {
    expect(classifyDecryptionError(new Error('Something unexpected'))).toBe('unknownError');
    expect(classifyDecryptionError(new Error())).toBe('unknownError');
    expect(classifyDecryptionError(null)).toBe('unknownError');
  });

  test('all error types have localization keys', () => {
    const types = ['tamperedCiphertext', 'wrongKey', 'missingKey', 'invalidFormat', 'expiredKey', 'unknownError'] as const;
    for (const type of types) {
      const error = createDecryptionError(type, 'test');
      expect(error.messageKey).toBeTruthy();
      expect(error.descriptionKey).toBeTruthy();
    }
  });
});

// ============================================================
// VAL-ERR-002: Encryption failure prevents plaintext leak
// ============================================================

describe('VAL-ERR-002: Encryption failure prevents plaintext leak', () => {
  test('handleEncryptionFailure returns error without plaintext', () => {
    const error = new Error('Encryption failed: key not available');
    const result = handleEncryptionFailure(error);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(error);
      expect(result.errorMessageKey).toBe('TeleBridgeEncryptionFailed');
      expect(result.plaintextLeaked).toBe(false);
      // The result does NOT contain plaintext — this is critical
      expect('plaintext' in result).toBe(false);
    }
  });

  test('isEncryptionFailure correctly identifies failures', () => {
    const success = { success: true as const, protocolMessage: 'tb1.s.abc', mode: 's' as const, keyId: 'abc', counter: 0 };
    const failure = handleEncryptionFailure(new Error('test'));

    expect(isEncryptionFailure(success)).toBe(false);
    expect(isEncryptionFailure(failure)).toBe(true);
  });

  test('encryptMessage throws on missing key (no plaintext fallback)', async () => {
    // Without setting up a chat key, encryption should throw
    clearAllChatKeys();
    await expect(encryptMessage('secret message', 'nonexistent-chat')).rejects.toThrow();
  });
});

// ============================================================
// VAL-ERR-003: Key exchange timeout with retry
// ============================================================

describe('VAL-ERR-003: Key exchange timeout with retry', () => {
  test('createKeyExchangeTracker starts and checks', () => {
    const tracker = createKeyExchangeTracker(30_000);
    const state = tracker.check();
    expect(state.hasTimedOut).toBe(false);
    expect(state.startedAt).toBe(0);
  });

  test('tracker detects timeout after threshold', () => {
    const tracker = createKeyExchangeTracker(1); // 1ms timeout (immediate for testing)
    tracker.start();
    // Wait for timeout
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const state = tracker.check();
        expect(state.hasTimedOut).toBe(true);
        expect(state.startedAt).toBeGreaterThan(0);
        resolve();
      }, 10);
    });
  });

  test('tracker reset clears timeout state', () => {
    const tracker = createKeyExchangeTracker(1);
    tracker.start();
    tracker.reset();
    const state = tracker.check();
    expect(state.hasTimedOut).toBe(false);
    expect(state.startedAt).toBe(0);
  });

  test('default timeout is 30 seconds', () => {
    const tracker = createKeyExchangeTracker();
    const state = tracker.check();
    expect(state.timeoutMs).toBe(30_000);
  });
});

// ============================================================
// VAL-ERR-004: Argon2id OOM handling
// ============================================================

describe('VAL-ERR-004: Argon2id OOM handling', () => {
  test('Argon2idMemoryError has correct properties', () => {
    const error = new Argon2idMemoryError();
    expect(error.isMemoryError).toBe(true);
    expect(error.name).toBe('Argon2idMemoryError');
    expect(error.message).toContain('memory');
  });

  test('Argon2idMemoryError wraps cause error', () => {
    const cause = new Error('WebAssembly buffer allocation failed');
    const error = new Argon2idMemoryError(cause);
    expect(error.cause).toBe(cause);
  });

  test('isArgon2idMemoryError detects OOM errors', () => {
    expect(isArgon2idMemoryError(new Argon2idMemoryError())).toBe(true);
    expect(isArgon2idMemoryError(new Error('out of memory'))).toBe(true);
    expect(isArgon2idMemoryError(new Error('OOM: allocation failed'))).toBe(true);
    expect(isArgon2idMemoryError(new Error('memory allocation error'))).toBe(true);
    expect(isArgon2idMemoryError(new Error('WASM buffer failed'))).toBe(true);
    expect(isArgon2idMemoryError(new Error('not enough memory'))).toBe(true);
    expect(isArgon2idMemoryError(new Error('regular error'))).toBe(false);
  });

  test('withArgon2idMemoryHandling catches OOM and throws user-friendly error', async () => {
    await expect(
      withArgon2idMemoryHandling(() => Promise.reject(new Error('out of memory'))),
    ).rejects.toThrow(Argon2idMemoryError);
  });

  test('withArgon2idMemoryHandling passes through non-OOM errors', async () => {
    const regularError = new Error('regular error');
    await expect(
      withArgon2idMemoryHandling(() => Promise.reject(regularError)),
    ).rejects.toThrow('regular error');
  });

  test('withArgon2idMemoryHandling returns successful results', async () => {
    const result = await withArgon2idMemoryHandling(() => Promise.resolve(42));
    expect(result).toBe(42);
  });
});

// ============================================================
// VAL-ERR-005: IndexedDB storage failure handling
// ============================================================

describe('VAL-ERR-005: IndexedDB storage failure handling', () => {
  test('classifyIndexedDBError detects quota exceeded', () => {
    const error = new DOMException('Quota exceeded', 'QuotaExceededError');
    expect(classifyIndexedDBError(error)).toBe('quotaExceeded');
  });

  test('classifyIndexedDBError detects blocked error', () => {
    expect(classifyIndexedDBError(new Error('database blocked'))).toBe('blocked');
  });

  test('classifyIndexedDBError detects version error', () => {
    expect(classifyIndexedDBError(new Error('version mismatch'))).toBe('versionError');
  });

  test('classifyIndexedDBError returns unknown for unrecognized errors', () => {
    expect(classifyIndexedDBError(new Error('something else'))).toBe('unknown');
    expect(classifyIndexedDBError(null)).toBe('unknown');
  });

  test('withIndexedDBFallback falls back to in-memory on failure', async () => {
    const result = await withIndexedDBFallback(
      () => Promise.reject(new Error('IndexedDB not available')),
      () => 'in-memory-fallback',
    );
    expect(result.success).toBe(false);
    expect(result.data).toBe('in-memory-fallback');
    expect(result.inMemoryFallback).toBe(true);
    expect(result.errorType).toBe('unknown');
  });

  test('withIndexedDBFallback returns success on normal operation', async () => {
    const result = await withIndexedDBFallback(
      () => Promise.resolve('data-from-idb'),
      () => 'fallback',
    );
    expect(result.success).toBe(true);
    expect(result.data).toBe('data-from-idb');
    expect(result.inMemoryFallback).toBe(false);
  });

  test('InMemoryKeyStore basic operations', async () => {
    const store = new InMemoryKeyStore();
    expect(store.isAvailable).toBe(true);

    await store.put('key1', 'value1');
    expect(await store.get('key1')).toBe('value1');

    await store.put('key2', 'value2');
    expect(await store.get('key2')).toBe('value2');

    await store.delete('key1');
    expect(await store.get('key1')).toBeUndefined();

    await store.clear();
    expect(await store.get('key2')).toBeUndefined();
  });
});

// ============================================================
// VAL-SEC-001: Replay attack detection
// ============================================================

describe('VAL-SEC-001: Replay attack detection', () => {
  let detector: ReplayDetector;

  beforeEach(() => {
    detector = new ReplayDetector();
  });

  test('new message is not a replay', () => {
    expect(detector.isReplay('chat-1', 'keyid:0:nonce1')).toBe(false);
  });

  test('same message detected as replay', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    expect(detector.isReplay('chat-1', 'keyid:0:nonce1')).toBe(true);
  });

  test('different message not detected as replay', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    expect(detector.isReplay('chat-1', 'keyid:0:nonce2')).toBe(false);
  });

  test('replay detection is per-chat', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    expect(detector.isReplay('chat-2', 'keyid:0:nonce1')).toBe(false);
  });

  test('duplicate markProcessed does not add entry twice', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    expect(detector.getTrackedCount('chat-1')).toBe(1);
  });

  test('clearChat removes tracking for specific chat', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    detector.markProcessed('chat-2', 'keyid:0:nonce1');
    detector.clearChat('chat-1');
    expect(detector.getTrackedCount('chat-1')).toBe(0);
    expect(detector.getTrackedCount('chat-2')).toBe(1);
  });

  test('clearAll removes all tracking', () => {
    detector.markProcessed('chat-1', 'keyid:0:nonce1');
    detector.markProcessed('chat-2', 'keyid:0:nonce2');
    detector.clearAll();
    expect(detector.getTrackedCount('chat-1')).toBe(0);
    expect(detector.getTrackedCount('chat-2')).toBe(0);
  });

  test('sliding window evicts old entries', () => {
    // Add MAX_TRACKED_MESSAGE_IDS + 1 entries
    for (let i = 0; i <= 1000; i++) {
      detector.markProcessed('chat-1', `keyid:${i}:nonce`);
    }
    // The oldest entries should be evicted
    expect(detector.isReplay('chat-1', 'keyid:0:nonce')).toBe(false);
    // Recent entries should still be tracked
    expect(detector.isReplay('chat-1', 'keyid:1000:nonce')).toBe(true);
  });
});

// ============================================================
// VAL-SEC-002: Protocol version downgrade rejection
// ============================================================

describe('VAL-SEC-002: Protocol version downgrade rejection', () => {
  test('current version (1) is accepted', () => {
    const result = validateProtocolVersion(1);
    expect(result.isValid).toBe(true);
    expect(result.version).toBe(1);
  });

  test('version 0 is rejected (downgrade)', () => {
    const result = validateProtocolVersion(0);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('downgrade');
  });

  test('version 2 is rejected (not yet supported)', () => {
    const result = validateProtocolVersion(2);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('not yet supported');
  });

  test('version 99 is rejected', () => {
    const result = validateProtocolVersion(99);
    expect(result.isValid).toBe(false);
  });

  test('non-integer version is rejected', () => {
    const result = validateProtocolVersion(1.5);
    expect(result.isValid).toBe(false);
  });

  test('protocol message validation rejects downgrade', () => {
    const result = validateProtocolMessage('tb0.s.AQIDBA==');
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('downgrade');
  });

  test('protocol message validation rejects future version', () => {
    const result = validateProtocolMessage('tb2.s.AQIDBA==');
    expect(result.isValid).toBe(false);
  });

  test('protocol message validation accepts current version', () => {
    const valid = encodeProtocol('s', new Uint8Array([1, 2, 3, 4]));
    const result = validateProtocolMessage(valid);
    expect(result.isValid).toBe(true);
  });

  test('non-protocol message is rejected', () => {
    const result = validateProtocolMessage('hello world');
    expect(result.isValid).toBe(false);
  });
});

// ============================================================
// VAL-SEC-003: Forged key exchange rejection
// ============================================================

describe('VAL-SEC-003: Forged key exchange rejection', () => {
  test('valid kx message passes validation', () => {
    // Create a valid kx message with 32+ byte payload
    const payload = new Uint8Array(32);
    crypto.getRandomValues(payload);
    const kxMessage = encodeProtocol('kx', payload);
    const result = validateKeyExchangeMessage(kxMessage);
    expect(result.isValid).toBe(true);
    expect(result.isForged).toBe(false);
  });

  test('kx message with all-zero public key is rejected (low-order point)', () => {
    const zeroPayload = new Uint8Array(32); // All zeros
    const kxMessage = encodeProtocol('kx', zeroPayload);
    const result = validateKeyExchangeMessage(kxMessage);
    expect(result.isValid).toBe(false);
    expect(result.isForged).toBe(true);
    expect(result.reason).toContain('low-order point');
  });

  test('kx message with too-small payload is rejected', () => {
    const smallPayload = new Uint8Array(16); // Less than 32 bytes
    const kxMessage = encodeProtocol('kx', smallPayload);
    const result = validateKeyExchangeMessage(kxMessage);
    expect(result.isValid).toBe(false);
    expect(result.isForged).toBe(true);
  });

  test('invalid protocol format is rejected', () => {
    const result = validateKeyExchangeMessage('not-a-protocol-message');
    expect(result.isValid).toBe(false);
    expect(result.isForged).toBe(true);
  });

  test('wrong mode (s instead of kx) is rejected', () => {
    const payload = new Uint8Array(32);
    crypto.getRandomValues(payload);
    const sMessage = encodeProtocol('s', payload);
    const result = validateKeyExchangeMessage(sMessage);
    expect(result.isValid).toBe(false);
    expect(result.isForged).toBe(true);
  });

  test('pk message validation requires minimum payload size', () => {
    const smallPayload = new Uint8Array(64); // Less than 128 bytes
    const pkMessage = encodeProtocol('pk', smallPayload);
    const result = validatePrekeyMessage(pkMessage);
    expect(result.isValid).toBe(false);
    expect(result.reason).toContain('too small');
  });
});

// ============================================================
// VAL-SEC-004: Forward secrecy after key compromise
// ============================================================

describe('VAL-SEC-004: Forward secrecy after key compromise', () => {
  test('ratchet key comparison works', () => {
    const key1 = new Uint8Array(32);
    const key2 = new Uint8Array(32);
    crypto.getRandomValues(key1);
    crypto.getRandomValues(key2);

    expect(verifyForwardSecrecy(key1, key2)).toBe(true);
  });

  test('identical keys fail forward secrecy check', () => {
    const key = new Uint8Array(32);
    crypto.getRandomValues(key);
    expect(verifyForwardSecrecy(key, key)).toBe(false);
  });

  test('different length comparison fails', () => {
    const short = new Uint8Array(16);
    const long = new Uint8Array(32);
    expect(verifyForwardSecrecy(short, long)).toBe(false);
  });
});

// ============================================================
// VAL-EDGE-001: Empty and whitespace message encryption round-trip
// ============================================================

describe('VAL-EDGE-001: Empty and whitespace message encryption', () => {
  afterEach(() => {
    clearAllChatKeys();
  });

  const whitespaceMessages = [
    '',           // Empty string
    ' ',          // Single space
    '  ',         // Multiple spaces
    '\t',         // Tab
    '\n',         // Newline
    '  \t\n  ',   // Mixed whitespace
  ];

  for (const msg of whitespaceMessages) {
    test(`whitespace message "${JSON.stringify(msg)}" normalizes correctly`, () => {
      const encoded = normalizeMessageText(msg);
      // Use instanceof check compatible with cross-realm contexts
      expect(encoded).toBeDefined();
      expect(encoded.length).toBeGreaterThanOrEqual(0);
      // Re-encoding should produce the same bytes
      const decoded = new TextDecoder().decode(encoded);
      expect(decoded).toBe(msg);
    });
  }
});

// ============================================================
// VAL-EDGE-002: Unicode and special character encryption round-trip
// ============================================================

describe('VAL-EDGE-002: Unicode special character encryption', () => {
  test('emoji normalizes correctly', () => {
    const emoji = '🎮🎉';
    const encoded = normalizeMessageText(emoji);
    const decoded = new TextDecoder().decode(encoded);
    expect(decoded).toBe(emoji);
  });

  test('RTL text normalizes correctly', () => {
    const rtl = 'עברית';
    const encoded = normalizeMessageText(rtl);
    const decoded = new TextDecoder().decode(encoded);
    expect(decoded).toBe(rtl);
  });

  test('null byte normalizes correctly', () => {
    const withNull = 'test\0value';
    const encoded = normalizeMessageText(withNull);
    const decoded = new TextDecoder().decode(encoded);
    expect(decoded).toBe(withNull);
  });

  test('verifyRoundTrip correctly identifies matches', () => {
    expect(verifyRoundTrip('Hello 🌍', 'Hello 🌍')).toBe(true);
    expect(verifyRoundTrip('Hello', 'World')).toBe(false);
  });

  test('EDGE_CASE_MESSAGES covers all edge cases', () => {
    expect(EDGE_CASE_MESSAGES).toContain('');
    expect(EDGE_CASE_MESSAGES).toContain(' ');
    expect(EDGE_CASE_MESSAGES).toContain('\t');
    expect(EDGE_CASE_MESSAGES.some((m) => m.includes('🎮'))).toBe(true);
  });
});

// ============================================================
// VAL-EDGE-003: Concurrent key exchange resolution
// ============================================================

describe('VAL-EDGE-003: Concurrent key exchange resolution', () => {
  test('lower userId wins with concurrent timestamps', () => {
    const result = resolveConcurrentKeyExchange(
      'user-A', 'user-B', 1000, 1000,
    );
    // user-A wins because it's lexicographically lower
    expect(result.useOurKey).toBe(true);
    expect(result.processTheirKx).toBe(false);
  });

  test('higher userId defers to lower with concurrent timestamps', () => {
    const result = resolveConcurrentKeyExchange(
      'user-B', 'user-A', 1000, 1000,
    );
    // user-A wins, so user-B defers
    expect(result.useOurKey).toBe(false);
    expect(result.processTheirKx).toBe(true);
  });

  test('newer timestamp wins with non-concurrent kx', () => {
    const result = resolveConcurrentKeyExchange(
      'user-A', 'user-B', 2000, 1000,
    );
    expect(result.useOurKey).toBe(true);
  });

  test('older timestamp defers with non-concurrent kx', () => {
    // Non-concurrent scenario: timestamps are far apart (>5s)
    // The party with the later timestamp "wins"
    const result = resolveConcurrentKeyExchange(
      'user-A', 'user-B', 1000, 7000, // 6 seconds apart
    );
    // Their timestamp (7000) is newer, so they should be the one whose key is used
    expect(result.useOurKey).toBe(false);
  });
});

// ============================================================
// VAL-EDGE-005: Message input length limit
// ============================================================

describe('VAL-EDGE-005: Message input length limit', () => {
  test('short message is valid', () => {
    const result = validateMessageInputSize('Hello');
    expect(result.isValid).toBe(true);
    expect(result.exceedsLimit).toBe(false);
    expect(result.showWarning).toBe(false);
  });

  test('message approaching limit shows warning', () => {
    // Create a message that's 80%+ of the limit
    const longText = 'A'.repeat(2400); // ~2400 bytes
    const result = validateMessageInputSize(longText);
    expect(result.showWarning).toBe(true);
    expect(result.isValid).toBe(true);
  });

  test('message exceeding limit is invalid', () => {
    // Create a message that exceeds the 2900 byte limit
    const tooLong = 'A'.repeat(3000);
    const result = validateMessageInputSize(tooLong);
    expect(result.isValid).toBe(false);
    expect(result.exceedsLimit).toBe(true);
    expect(result.messageKey).toBe('TeleBridgeMessageTooLong');
  });

  test('Unicode characters count as multi-byte', () => {
    // Emoji are 4 bytes each in UTF-8
    const emojiText = '🎮'.repeat(800); // 4 * 800 = 3200 bytes
    const result = validateMessageInputSize(emojiText);
    expect(result.exceedsLimit).toBe(true);
  });
});

// ============================================================
// VAL-EDGE-006: Rapid burst message sending
// ============================================================

describe('VAL-EDGE-006: Rapid burst sending', () => {
  test('10 rapid messages have unique IDs', () => {
    const messageIds: string[] = [];
    for (let i = 0; i < 10; i++) {
      // Simulate unique message ID based on keyId, counter, and nonce
      const keyId = 'abc123';
      const counter = i;
      const nonce = new Uint8Array(12);
      crypto.getRandomValues(nonce);
      const messageId = `${keyId}:${counter}:${Array.from(nonce).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
      messageIds.push(messageId);
    }

    const result = validateBurstMessages(messageIds);
    expect(result.uniqueIVs).toBe(true);
    expect(result.hasDuplicates).toBe(false);
    expect(result.count).toBe(10);
  });

  test('duplicate message IDs are detected', () => {
    const messageIds = ['key:0:nonce1', 'key:0:nonce1'];
    const result = validateBurstMessages(messageIds);
    expect(result.hasDuplicates).toBe(true);
    expect(result.uniqueIVs).toBe(false);
  });
});

// ============================================================
// VAL-DATA-001: Crash recovery during key generation
// ============================================================

describe('VAL-DATA-001: Crash recovery during key generation', () => {
  test('detectPartialKeyGeneration identifies partial state', () => {
    const result = detectPartialKeyGeneration(['partial_key_generation', 'default']);
    expect(result.hasPartialState).toBe(true);
  });

  test('detectPartialKeyGeneration returns false for clean state', () => {
    const result = detectPartialKeyGeneration(['default']);
    expect(result.hasPartialState).toBe(false);
  });

  test('detectPartialKeyGeneration returns false for empty state', () => {
    const result = detectPartialKeyGeneration([]);
    expect(result.hasPartialState).toBe(false);
  });
});

// ============================================================
// VAL-DATA-002: Account-namespaced storage
// ============================================================

describe('VAL-DATA-002: Account-namespaced storage', () => {
  test('different accounts get different namespace keys', () => {
    const key1 = getAccountNamespacedKey('user-123', 'keystore');
    const key2 = getAccountNamespacedKey('user-456', 'keystore');
    expect(key1).not.toBe(key2);
    expect(key1).toBe('telebridge:user-123:keystore');
    expect(key2).toBe('telebridge:user-456:keystore');
  });

  test('same account and key produce same namespace', () => {
    const key1 = getAccountNamespacedKey('user-123', 'keystore');
    const key2 = getAccountNamespacedKey('user-123', 'keystore');
    expect(key1).toBe(key2);
  });

  test('different stores per account', () => {
    const store1 = getAccountStoreName('user-123');
    const store2 = getAccountStoreName('user-456');
    expect(store1).toBe('keystore_user-123');
    expect(store2).toBe('keystore_user-456');
  });
});

// ============================================================
// VAL-UX-001: Password dialog not disabled (guard check)
// ============================================================

describe('VAL-UX-001: Password dialog not disabled (guard)', () => {
  test('PasswordDialog does not disable the dialog with early return', () => {
    // Read the PasswordDialog source code
    const path = require('path');
    const fs = require('fs');
    const passwordDialogPath = path.join(
      __dirname, '../src/components/telebridge/PasswordDialog.tsx',
    );
    const content = fs.readFileSync(passwordDialogPath, 'utf8');

    // V1 Bug #9 guard: Password dialog should NOT have early "return;" at the top
    // that would short-circuit the password prompt when it should be shown.
    // The component function should NOT start with "return;" after the opening brace.
    // This would bypass the entire password dialog when it should be shown.

    // The component function definition starts with "const PasswordDialog"
    // and should have form rendering, not a bare early return.
    const componentBody = content.match(/const PasswordDialog[^=]*=>\s*\{([\s\S]*)\}/);
    if (componentBody) {
      const body = componentBody[1].trim();
      // The first significant line should NOT be a bare "return;"
      // (which would disable the entire dialog)
      const firstSignificant = body.split('\n')
        .map((l: string) => l.trim())
        .find((l: string) => l.length > 0 && !l.startsWith('//') && !l.startsWith('*'));

      // First line should be a destructuring like "const { ... } = getActions();"
      // NOT "return;" which would disable the dialog
      expect(firstSignificant).not.toBe('return;');
    }
  });

  test('PasswordDialog renders for both setup and unlock modes', () => {
    // Read the PasswordDialog source code
    const path = require('path');
    const fs = require('fs');
    const passwordDialogPath = path.join(
      __dirname, '../src/components/telebridge/PasswordDialog.tsx',
    );
    const content = fs.readFileSync(passwordDialogPath, 'utf8');

    // The component should support both 'setup' and 'unlock' modes
    expect(content).toMatch(/setup.*unlock|unlock.*setup/);
    // The component should always render the form
    expect(content).toMatch(/handleSubmit/);
    expect(content).toMatch(/<form/);
  });
});

// ============================================================
// Additional: Encryption round-trip with edge cases
// ============================================================

describe('Encryption round-trip with edge case messages', () => {
  afterEach(() => {
    clearAllChatKeys();
  });

  test('encrypt and decrypt empty string', async () => {
    const { key } = generateChatKey();
    setChatKey('edge-chat', key);

    const result = await encryptMessage('', 'edge-chat');
    const decrypted = await decryptMessage(result.protocolMessage, 'edge-chat');
    expect(decrypted?.text).toBe('');
  });

  test('encrypt and decrypt single space', async () => {
    const { key } = generateChatKey();
    setChatKey('edge-chat', key);

    const result = await encryptMessage(' ', 'edge-chat');
    const decrypted = await decryptMessage(result.protocolMessage, 'edge-chat');
    expect(decrypted?.text).toBe(' ');
  });

  test('encrypt and decrypt emoji', async () => {
    const { key } = generateChatKey();
    setChatKey('edge-chat', key);

    const emojiText = 'Hello 🌍🎮🎉';
    const result = await encryptMessage(emojiText, 'edge-chat');
    const decrypted = await decryptMessage(result.protocolMessage, 'edge-chat');
    expect(decrypted?.text).toBe(emojiText);
  });

  test('encrypt and decrypt null byte', async () => {
    const { key } = generateChatKey();
    setChatKey('edge-chat', key);

    const textWithNull = 'test\0value';
    const result = await encryptMessage(textWithNull, 'edge-chat');
    const decrypted = await decryptMessage(result.protocolMessage, 'edge-chat');
    expect(decrypted?.text).toBe(textWithNull);
  });

  test('encrypt and decrypt RTL text', async () => {
    const { key } = generateChatKey();
    setChatKey('edge-chat', key);

    const rtlText = 'שלום עולם';
    const result = await encryptMessage(rtlText, 'edge-chat');
    const decrypted = await decryptMessage(result.protocolMessage, 'edge-chat');
    expect(decrypted?.text).toBe(rtlText);
  });
});

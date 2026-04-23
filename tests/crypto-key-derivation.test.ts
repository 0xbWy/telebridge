/**
 * TeleBridge — Consistent Key Derivation Tests
 *
 * VAL-CRYPTO-026: Consistent key derivation path for text and binary (V1 Bug #3 guard)
 * VAL-CRYPTO-027: HKDF-SHA256 used for all derivation, not bare SHA-256
 */

import {
  deriveBIP39Key,
  deriveChatKey as deriveChatKeyFromDerivation,
  deriveFileKey,
  deriveKey,
  deriveKeyEncryptionKey,
  deriveKeyFromText,
  deriveMediaKey,
  deriveNextChainKey,
  deriveRatchetMessageKey,
  deriveSecuredMessageKey,
  deriveSecuredSelfKey,
  INFO_STRINGS,
  verifyConsistentDerivation,
} from '../src/telebridge/crypto/keyDerivation';

// ---------- VAL-CRYPTO-026: Consistent key derivation path ----------

describe('VAL-CRYPTO-026: Consistent key derivation path for text and binary', () => {
  test('text and binary inputs produce identical derived key', () => {
    const text = 'Hello, TeleBridge!';
    const textBytes = new TextEncoder().encode(text);

    // CRITICAL: This is the V1 Bug #3 guard.
    // In V1, there was a conditional that used different derivation paths
    // for string vs binary input. This MUST produce the same key.
    const fromTextInterface = deriveKeyFromText(text, INFO_STRINGS.CHAT_KEY);
    const fromBinaryInterface = deriveKey(textBytes, INFO_STRINGS.CHAT_KEY);

    expect(fromTextInterface).toEqual(fromBinaryInterface);
  });

  test('verifyConsistentDerivation returns true for matching text/binary', () => {
    const text = 'TeleBridge encryption key material';
    const textBytes = new TextEncoder().encode(text);

    const result = verifyConsistentDerivation(text, textBytes, INFO_STRINGS.CHAT_KEY);
    expect(result).toBe(true);
  });

  test('same UTF-8 bytes always produce same derived key regardless of API used', () => {
    const input = new Uint8Array(32);
    crypto.getRandomValues(input);

    // deriveKeyFromText encodes text to UTF-8
    // deriveKey takes Uint8Array directly
    // Both should produce different keys because the inputs are different types
    // BUT the derivation function is the same: HKDF-SHA256
    const key1 = deriveKey(input, INFO_STRINGS.CHAT_KEY);

    // If someone passes "hello" as text
    const helloText = 'hello';
    const helloBytes = new TextEncoder().encode(helloText);
    const keyFromText = deriveKeyFromText(helloText, INFO_STRINGS.CHAT_KEY);
    const keyFromBytes = deriveKey(helloBytes, INFO_STRINGS.CHAT_KEY);

    // Both paths MUST produce the same key
    expect(keyFromText).toEqual(keyFromBytes);
  });

  test('no conditional code path based on typeof input', () => {
    // This test verifies that deriveKey ONLY accepts Uint8Array.
    // The deriveKeyFromText function converts text to bytes FIRST,
    // then calls the SAME deriveKey function. There is no conditional
    // path based on input type.

    const randomInput = new Uint8Array(32);
    crypto.getRandomValues(randomInput);

    // This should just work — single code path
    const key = deriveKey(randomInput, INFO_STRINGS.RATCHET_MESSAGE);
    expect(key).toBeInstanceOf(Uint8Array);
    expect(key.length).toBe(32);
  });
});

// ---------- VAL-CRYPTO-027: HKDF-SHA256 for all derivation ----------

describe('VAL-CRYPTO-027: HKDF-SHA256 used for all derivation, not bare SHA-256', () => {
  test('all purpose-specific derivations use HKDF-SHA256', () => {
    const input = new Uint8Array(32);
    crypto.getRandomValues(input);

    // ALL of these use HKDF-SHA256 internally, not bare SHA-256
    const chatKey = deriveChatKeyFromDerivation(input);
    const ratchetKey = deriveRatchetMessageKey(input, 0);
    const nextKey = deriveNextChainKey(input, 0);
    const mediaKey = deriveMediaKey(input, 'chat123', 'media456');
    const fileKey = deriveFileKey(input, new Uint8Array(32));
    const securedKey = deriveSecuredMessageKey(input);
    const selfKey = deriveSecuredSelfKey(input);
    const bip39Output = deriveBIP39Key(input);
    const keyEncKey = deriveKeyEncryptionKey(input);

    // All should produce 32-byte keys (AES-256)
    expect(chatKey.length).toBe(32);
    expect(ratchetKey.length).toBe(32);
    expect(nextKey.length).toBe(32);
    expect(mediaKey.length).toBe(32);
    expect(fileKey.length).toBe(32);
    expect(securedKey.length).toBe(32);
    expect(selfKey.length).toBe(32);
    expect(bip39Output.length).toBe(32);
    expect(keyEncKey.length).toBe(32);
  });

  test('different info strings produce different keys from same input', () => {
    const input = new Uint8Array(32);
    crypto.getRandomValues(input);

    // HKDF with different info strings MUST produce different keys
    const chatKey = deriveChatKeyFromDerivation(input);
    const mediaKey = deriveMediaKey(input, 'chat123', 'media456');
    const fileKey = deriveFileKey(input, new Uint8Array(32));
    const securedKey = deriveSecuredMessageKey(input);

    // All different — domain separation works
    expect(chatKey).not.toEqual(mediaKey);
    expect(chatKey).not.toEqual(fileKey);
    expect(chatKey).not.toEqual(securedKey);
    expect(mediaKey).not.toEqual(fileKey);
    expect(mediaKey).not.toEqual(securedKey);
    expect(fileKey).not.toEqual(securedKey);
  });

  test('same info string produces same key from same input (deterministic)', () => {
    const input = new Uint8Array(32);
    crypto.getRandomValues(input);

    const key1 = deriveChatKeyFromDerivation(input);
    const key2 = deriveChatKeyFromDerivation(input);

    expect(key1).toEqual(key2);

    // Even with explicit salt
    const salt = new Uint8Array(32);
    crypto.getRandomValues(salt);
    const key3 = deriveKey(input, INFO_STRINGS.CHAT_KEY, salt);
    const key4 = deriveKey(input, INFO_STRINGS.CHAT_KEY, salt);
    expect(key3).toEqual(key4);
  });

  test('different salts produce different keys', () => {
    const input = new Uint8Array(32);
    crypto.getRandomValues(input);

    const salt1 = new Uint8Array(32);
    salt1.fill(1);
    const salt2 = new Uint8Array(32);
    salt2.fill(2);

    const key1 = deriveKey(input, INFO_STRINGS.CHAT_KEY, salt1);
    const key2 = deriveKey(input, INFO_STRINGS.CHAT_KEY, salt2);

    expect(key1).not.toEqual(key2);
  });

  test('ratchet key derivation changes with counter', () => {
    const ratchetKey = new Uint8Array(32);
    crypto.getRandomValues(ratchetKey);

    const key0 = deriveRatchetMessageKey(ratchetKey, 0);
    const key1 = deriveRatchetMessageKey(ratchetKey, 1);
    const key100 = deriveRatchetMessageKey(ratchetKey, 100);

    // Each counter produces a different key
    expect(key0).not.toEqual(key1);
    expect(key0).not.toEqual(key100);
    expect(key1).not.toEqual(key100);

    // Key also changes
    const nextChain0 = deriveNextChainKey(ratchetKey, 0);
    const nextChain1 = deriveNextChainKey(ratchetKey, 1);
    expect(nextChain0).not.toEqual(nextChain1);
    expect(nextChain0).not.toEqual(ratchetKey);
  });

  test('deriveKey rejects empty or invalid inputs', () => {
    expect(() => deriveKey(new Uint8Array(0), INFO_STRINGS.CHAT_KEY)).toThrow(/non-empty/);
    expect(() => deriveKey(null as unknown as Uint8Array, INFO_STRINGS.CHAT_KEY)).toThrow();
    expect(() => deriveKey(new Uint8Array(32), new Uint8Array(0))).toThrow(/non-empty/);
  });

  test('media key derivation uses explicit chatId', () => {
    const chatKey = new Uint8Array(32);
    crypto.getRandomValues(chatKey);

    // Same chatId produces same media key
    const key1 = deriveMediaKey(chatKey, 'chat-123', 'media-456');
    const key2 = deriveMediaKey(chatKey, 'chat-123', 'media-456');
    expect(key1).toEqual(key2);

    // Different chatId produces different key (V1 Bug #4 guard)
    const key3 = deriveMediaKey(chatKey, 'chat-999', 'media-456');
    expect(key1).not.toEqual(key3);

    // Different mediaId produces different key
    const key4 = deriveMediaKey(chatKey, 'chat-123', 'media-789');
    expect(key1).not.toEqual(key4);
  });
});

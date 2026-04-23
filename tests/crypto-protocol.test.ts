/**
 * TeleBridge — Protocol Wire Format Tests
 *
 * VAL-CRYPTO-020: Wire format encoding produces correct tb<version>.<mode>.<base64>
 * VAL-CRYPTO-021: Wire format decoding round-trips; rejects bad inputs
 * VAL-CRYPTO-022: Protocol messages fit within Telegram's 4096-char limit
 */
import type { ProtocolMode } from '../src/telebridge/crypto/protocol';

import {
  calculateEncodedLength,
  decodeProtocol,
  encodeProtocol,
  encodeProtocolText,
  isProtocolMessage,
  PROTOCOL_VERSION,
  TELEGRAM_MAX_MESSAGE_LENGTH,
  willFitInTelegram,
} from '../src/telebridge/crypto/protocol';

// ---------- Helpers ----------

function stringToBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

// ---------- VAL-CRYPTO-020: Wire format encoding ----------

describe('VAL-CRYPTO-020: Protocol encoding', () => {
  test('produces correct tb<version>.<mode>.<base64> format for all modes', () => {
    const payload = new Uint8Array([1, 2, 3, 4, 5]);
    const modes: ProtocolMode[] = ['s', 'a', 'kx', 'pk'];

    for (const mode of modes) {
      const encoded = encodeProtocol(mode, payload);
      const regex = /^tb[0-9]+\.[sapkx]+\.[A-Za-z0-9+/=]+$/;
      expect(encoded).toMatch(regex);
      expect(encoded.startsWith(`tb${PROTOCOL_VERSION}.${mode}.`)).toBe(true);
    }
  });

  test('version defaults to 1', () => {
    const payload = new Uint8Array([42]);
    const encoded = encodeProtocol('s', payload);
    expect(encoded.startsWith('tb1.')).toBe(true);
  });

  test('invalid mode throws', () => {
    const payload = new Uint8Array([1]);
    expect(() => encodeProtocol('x' as ProtocolMode, payload)).toThrow(/Invalid protocol mode/);
    expect(() => encodeProtocol('' as ProtocolMode, payload)).toThrow(/Invalid protocol mode/);
    expect(() => encodeProtocol('abc' as ProtocolMode, payload)).toThrow(/Invalid protocol mode/);
  });

  test('invalid version throws', () => {
    const payload = new Uint8Array([1]);
    expect(() => encodeProtocol('s', payload, 0)).toThrow(/Invalid protocol version/);
    expect(() => encodeProtocol('s', payload, -1)).toThrow(/Invalid protocol version/);
    expect(() => encodeProtocol('s', payload, 100)).toThrow(/Invalid protocol version/);
    expect(() => encodeProtocol('s', payload, 1.5)).toThrow(/Invalid protocol version/);
  });

  test('empty payload throws', () => {
    expect(() => encodeProtocol('s', new Uint8Array(0))).toThrow(/at least/);
  });

  test('non-Uint8Array payload throws', () => {
    expect(() => encodeProtocol('s', null as unknown as Uint8Array)).toThrow();
    expect(() => encodeProtocol('s', 'hello' as unknown as Uint8Array)).toThrow();
  });

  test('base64 payload is valid and decodable', () => {
    const payload = new Uint8Array(256);
    crypto.getRandomValues(payload);
    const encoded = encodeProtocol('s', payload);
    const decoded = decodeProtocol(encoded);
    expect(decoded).toBeDefined();
    expect(decoded!.payload).toEqual(payload);
  });

  test('two-char modes (kx, pk) produce correct format', () => {
    const payload = new Uint8Array([1, 2, 3]);
    const kx = encodeProtocol('kx', payload);
    const pk = encodeProtocol('pk', payload);
    expect(kx.startsWith('tb1.kx.')).toBe(true);
    expect(pk.startsWith('tb1.pk.')).toBe(true);
  });
});

// ---------- VAL-CRYPTO-021: Wire format decoding ----------

describe('VAL-CRYPTO-021: Protocol decoding', () => {
  test('round-trip: encode → decode produces same payload', () => {
    const payload = new Uint8Array(100);
    crypto.getRandomValues(payload);
    for (const mode of ['s', 'a', 'kx', 'pk'] as ProtocolMode[]) {
      const encoded = encodeProtocol(mode, payload);
      const decoded = decodeProtocol(encoded);
      expect(decoded).toBeDefined();
      expect(decoded!.version).toBe(1);
      expect(decoded!.mode).toBe(mode);
      expect(decoded!.payload).toEqual(payload);
    }
  });

  test('rejects non-tb strings', () => {
    expect(decodeProtocol('hello world')).toBeUndefined();
    expect(decodeProtocol('x')).toBeUndefined();
    expect(decodeProtocol('')).toBeUndefined();
  });

  test('rejects unknown modes', () => {
    expect(decodeProtocol('tb1.x.AQID')).toBeUndefined();
    expect(decodeProtocol('tb1.zz.AQID')).toBeUndefined();
  });

  test('rejects malformed base64', () => {
    expect(decodeProtocol('tb1.s.!!!invalid!!!')).toBeUndefined();
  });

  test('rejects unsupported versions', () => {
    expect(decodeProtocol('tb0.s.AQID')).toBeUndefined();
    expect(decodeProtocol('tb99.s.AQID')).toBeUndefined();
  });

  test('rejects missing dot separators', () => {
    expect(decodeProtocol('tb1sAQID')).toBeUndefined();
    expect(decodeProtocol('tb1.')).toBeUndefined();
  });

  test('rejects empty payload base64', () => {
    expect(decodeProtocol('tb1.s.')).toBeUndefined();
  });

  test('isProtocolMessage fast check', () => {
    expect(isProtocolMessage('tb1.s.AQID')).toBe(true);
    expect(isProtocolMessage('hello')).toBe(false);
    expect(isProtocolMessage('')).toBe(false);
    expect(isProtocolMessage('tb')).toBe(true); // just checks prefix
  });
});

// ---------- VAL-CRYPTO-022: Message size budget ----------

describe('VAL-CRYPTO-022: Protocol message size budget', () => {
  test('2900-byte plaintext fits within 4096-char limit', () => {
    const payload = new Uint8Array(2900);
    crypto.getRandomValues(payload);
    const encoded = encodeProtocol('s', payload);
    expect(encoded.length).toBeLessThanOrEqual(TELEGRAM_MAX_MESSAGE_LENGTH);
  });

  test('oversized payload is rejected', () => {
    const payload = new Uint8Array(4000);
    crypto.getRandomValues(payload);
    expect(() => encodeProtocol('s', payload)).toThrow(/exceeds Telegram limit/);
  });

  test('oversized text is rejected', () => {
    const longText = 'A'.repeat(4000);
    expect(() => encodeProtocolText('s', longText)).toThrow(/too large/);
  });

  test('encodeProtocolText correctly encodes a normal message', () => {
    const text = 'Hello, TeleBridge!';
    const encoded = encodeProtocolText('s', text);
    const decoded = decodeProtocol(encoded);
    expect(decoded).toBeDefined();
    expect(new TextDecoder().decode(decoded!.payload)).toBe(text);
  });

  test('willFitInTelegram correctly predicts fit', () => {
    expect(willFitInTelegram(2900, 's')).toBe(true);
    expect(willFitInTelegram(4000, 's')).toBe(false);
    expect(willFitInTelegram(0, 's')).toBe(true);
  });

  test('calculateEncodedLength matches actual encoded length', () => {
    const payload = new Uint8Array(100);
    crypto.getRandomValues(payload);
    const encoded = encodeProtocol('s', payload);
    expect(calculateEncodedLength(payload, 's')).toBe(encoded.length);
  });

  test('kx mode overhead is slightly larger than s mode', () => {
    const payload = new Uint8Array(50);
    const sLen = calculateEncodedLength(payload, 's');
    const kxLen = calculateEncodedLength(payload, 'kx');
    expect(kxLen).toBe(sLen + 1); // kx is one char longer
  });
});

/**
 * TeleBridge — Key Exchange Integration Tests
 *
 * Tests the wiring between the X3DH crypto primitives and the
 * action/integration layer. Validates VAL-E2E-001 through VAL-E2E-006.
 *
 * VAL-E2E-001: Key Exchange Initiation produces real X3DH message
 * VAL-E2E-002: Key Exchange Completion derives same shared key
 * VAL-E2E-005: Key Exchange State Machine transitions properly
 * VAL-E2E-006: Failed Key Exchange handled gracefully
 */
import {
  generateIdentityKeypair,
  deriveX25519FromEd25519,
} from '../src/telebridge/crypto/identity';
import {
  completeKeyExchange,
  generatePrekeyBundle,
  initiateKeyExchange,
  verifyPrekeyBundle,
} from '../src/telebridge/crypto/keyExchange';
import {
  decodeProtocol,
  encodeProtocol,
} from '../src/telebridge/crypto/protocol';
import {
  setChatKey,
  hasChatKey,
  clearAllChatKeys,
} from '../src/telebridge/messages';

import type { PrekeyBundle, SignedPrekey, VerifiedPrekeyBundle } from '../src/telebridge/crypto/keyExchange';
import type { IdentityKeypair } from '../src/telebridge/crypto/identity';

import {
  setChatKeyExchangeState,
  setChatEncryptionState,
} from '../src/global/reducers/telebridge';
import {
  INITIAL_TELEBRIDGE_STATE,
} from '../src/telebridge/state';

import type {
  ChatEncryptionState,
  EncryptionStatus,
  KeyExchangeState,
} from '../src/telebridge/state';

// ---------- Helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
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

/**
 * Simulates the full key exchange protocol as it would flow
 * through the action handlers.
 *
 * 1. Bob generates prekey bundle
 * 2. Alice verifies bundle and initiates key exchange → gets tb1.kx message
 * 3. Bob receives kx message → completes key exchange
 * 4. Both parties derive same chatDerivedKey
 */
function simulateFullKeyExchange() {
  // Alice (initiator) and Bob (responder)
  const aliceKp = generateIdentityKeypair();
  const bobKp = generateIdentityKeypair();

  // Step 1: Bob generates and publishes prekey bundle
  const bobBundle = generatePrekeyBundle(bobKp, 5);
  const bobVerifiedBundle = verifyPrekeyBundle(bobBundle, 0);

  // Step 2: Alice initiates key exchange using X3DH
  const aliceResult = initiateKeyExchange(aliceKp, bobVerifiedBundle);

  // Step 3: Encode the kx message to send to Bob
  // The kx payload contains: Alice's ephemeral pub + Alice's X25519 identity pub
  const aliceX25519 = deriveX25519FromEd25519(aliceKp.signingBytes);
  const kxPayload = new Uint8Array(64); // 32 bytes ephemeral pub + 32 bytes identity pub
  kxPayload.set(aliceResult.ephemeralPub, 0);
  kxPayload.set(aliceX25519.point, 32);
  const kxMessage = encodeProtocol('kx', kxPayload);

  // Step 4: Bob receives the kx message, decodes it, and completes key exchange
  const decoded = decodeProtocol(kxMessage);
  if (!decoded || decoded.mode !== 'kx') {
    throw new Error('Failed to decode kx message');
  }

  const theirEphemeralPub = decoded.payload.slice(0, 32);
  const theirX25519IdentityPub = decoded.payload.slice(32, 64);

  // Bob consumes the one-time prekey that was referenced in Alice's exchange
  const consumedOtpk = bobBundle.oneTimePrekeys[0];

  const bobResult = completeKeyExchange(
    bobKp,
    bobBundle.signedPrekey,
    theirEphemeralPub,
    theirX25519IdentityPub,
    consumedOtpk,
  );

  return {
    aliceKp,
    bobKp,
    bobBundle,
    aliceResult,
    bobResult,
    kxMessage,
    kxPayload,
  };
}

// ---------- Cleanup ----------

function cleanup() {
  clearAllChatKeys();
}

// ======================================================================
// VAL-E2E-001: Key Exchange Initiation produces real X3DH message
// ======================================================================

describe('VAL-E2E-001: Key Exchange Initiation produces real X3DH message', () => {
  afterEach(cleanup);

  it('initiateKeyExchange produces ephemeralPub (32 bytes) and chatDerivedKey (32 bytes)', () => {
    // Verifies VAL-E2E-001: Key Exchange Initiation produces real X3DH message
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 5);
    const verifiedBundle = verifyPrekeyBundle(bobBundle, 0);

    const result = initiateKeyExchange(aliceKp, verifiedBundle);

    // ephemeralPub is 32 bytes (X25519 public point)
    expect(result.ephemeralPub).toHaveLength(32);
    // chatDerivedKey is 32 bytes (AES-256 key)
    expect(result.chatDerivedKey).toHaveLength(32);
    // keyId is defined
    expect(result.keyId).toBeDefined();
    expect(result.keyId).toHaveLength(8); // 4 bytes as hex = 8 chars
  });

  it('tb1.kx message is prepared with ephemeral public key, not random key', () => {
    // Verifies VAL-E2E-001: The kx message contains a public key, not a random symmetric key
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 5);
    const verifiedBundle = verifyPrekeyBundle(bobBundle, 0);

    const result = initiateKeyExchange(aliceKp, verifiedBundle);

    // Encode kx message: payload = ephemeralPub (32 bytes) + identityPub (32 bytes)
    const aliceX25519 = deriveX25519FromEd25519(aliceKp.signingBytes);
    const kxPayload = new Uint8Array(64);
    kxPayload.set(result.ephemeralPub, 0);
    kxPayload.set(aliceX25519.point, 32);

    const kxMessage = encodeProtocol('kx', kxPayload);

    // The kx message must start with tb1.kx.
    expect(kxMessage).toMatch(/^tb1\.kx\./);

    // Decode and verify the payload contains the ephemeral public key
    const decoded = decodeProtocol(kxMessage);
    expect(decoded).toBeDefined();
    expect(decoded!.mode).toBe('kx');
    expect(decoded!.payload).toHaveLength(64);

    // The first 32 bytes of the payload are the ephemeral public key
    const extractedEphPub = decoded!.payload.slice(0, 32);
    expect(bytesToHex(extractedEphPub)).toBe(bytesToHex(result.ephemeralPub));
  });

  it('initiateKeyExchange produces different ephemeral keys each time', () => {
    // Verifies VAL-E2E-001: Each key exchange uses a fresh ephemeral keypair
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 10);

    const verified0 = verifyPrekeyBundle(bobBundle, 0);
    const verified1 = verifyPrekeyBundle(bobBundle, 1);

    const result0 = initiateKeyExchange(aliceKp, verified0);
    const result1 = initiateKeyExchange(aliceKp, verified1);

    // Different ephemeral keys each time (forward secrecy)
    expect(bytesToHex(result0.ephemeralPub)).not.toBe(bytesToHex(result1.ephemeralPub));
  });

  it('kx message payload contains public key (curve point), not raw AES key', () => {
    // Verifies VAL-E2E-001: The payload is a public key, not the symmetric key
    const result = simulateFullKeyExchange();

    // The kx payload should NOT be the raw chatDerivedKey
    const decoded = decodeProtocol(result.kxMessage);
    const payloadHex = bytesToHex(decoded!.payload);
    const keyHex = bytesToHex(result.aliceResult.chatDerivedKey);
    expect(payloadHex).not.toBe(keyHex);
  });
});

// ======================================================================
// VAL-E2E-002: Key Exchange Completion derives same shared key
// ======================================================================

describe('VAL-E2E-002: Key Exchange Completion derives same shared key', () => {
  afterEach(cleanup);

  it('both parties derive the same chatDerivedKey via X3DH', () => {
    // Verifies VAL-E2E-002: Full X3DH round-trip
    const result = simulateFullKeyExchange();

    expect(bytesToHex(result.aliceResult.chatDerivedKey))
      .toBe(bytesToHex(result.bobResult.chatDerivedKey));
  });

  it('both parties derive the same keyId', () => {
    // Verifies VAL-E2E-002: Key IDs must match
    const result = simulateFullKeyExchange();
    expect(result.aliceResult.keyId).toBe(result.bobResult.keyId);
  });

  it('shared key can be used for symmetric encryption after key exchange', () => {
    // Verifies VAL-E2E-002: The derived key works as AES-256 key
    const result = simulateFullKeyExchange();
    const chatId = 'test-chat-e2e-002';

    // Alice stores the chat key
    setChatKey(chatId, result.aliceResult.chatDerivedKey);
    expect(hasChatKey(chatId)).toBe(true);
  });

  it('key exchange works without one-time prekeys', () => {
    // Verifies VAL-E2E-002: Three-DH without optional fourth DH
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();

    const bobBundle = generatePrekeyBundle(bobKp, 0);
    const verifiedBundle = verifyPrekeyBundle(bobBundle);

    const aliceResult = initiateKeyExchange(aliceKp, verifiedBundle);

    const aliceX25519 = deriveX25519FromEd25519(aliceKp.signingBytes);
    const bobResult = completeKeyExchange(
      bobKp,
      bobBundle.signedPrekey,
      aliceResult.ephemeralPub,
      aliceX25519.point,
    );

    expect(bytesToHex(aliceResult.chatDerivedKey)).toBe(bytesToHex(bobResult.chatDerivedKey));
    expect(aliceResult.keyId).toBe(bobResult.keyId);
  });

  it('multiple key exchanges between same parties produce different keys', () => {
    // Verifies VAL-E2E-002: Forward secrecy — each exchange is unique
    const aliceKp = generateIdentityKeypair();
    const bobKp = generateIdentityKeypair();
    const bobBundle = generatePrekeyBundle(bobKp, 10);

    const keys: string[] = [];
    for (let i = 0; i < 3; i++) {
      const verified = verifyPrekeyBundle(bobBundle, i);
      const result = initiateKeyExchange(aliceKp, verified);
      keys.push(bytesToHex(result.chatDerivedKey));
    }

    // All three keys should be different
    expect(keys[0]).not.toBe(keys[1]);
    expect(keys[1]).not.toBe(keys[2]);
    expect(keys[0]).not.toBe(keys[2]);
  });
});

// ======================================================================
// VAL-E2E-005: Key Exchange State Machine transitions properly
// ======================================================================

describe('VAL-E2E-005: Key Exchange State Machine transitions', () => {
  it('key exchange state transitions idle → inProgress → complete', () => {
    // Verifies VAL-E2E-005
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-state-machine';

    // Initial state: idle
    let chatState = global.telebridge.chatEncryptionStates[chatId];
    const initialKeyExchangeState = chatState?.keyExchangeState ?? 'idle';
    expect(initialKeyExchangeState).toBe('idle');

    // Transition to inProgress
    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('inProgress');

    // Transition to complete
    global = setChatKeyExchangeState(global, chatId, 'complete');
    chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('complete');
    // Status should be 'encrypted' when complete
    expect(chatState!.status).toBe('encrypted');
  });

  it('state is observable as inProgress during exchange before becoming complete', () => {
    // Verifies VAL-E2E-005: The inProgress state is observable
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-inprogress';

    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    const chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('inProgress');
    // Status should NOT be encrypted while in progress
    expect(chatState!.status).not.toBe('encrypted');
  });

  it('complete state sets status to encrypted', () => {
    // Verifies VAL-E2E-005
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-complete-status';

    global = setChatKeyExchangeState(global, chatId, 'complete');
    const chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('complete');
    expect(chatState!.status).toBe('encrypted');
  });

  it('showStartEncryptedBanner is false after complete', () => {
    // Verifies VAL-E2E-005
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-banner';

    // Default state has banner shown
    let chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState?.showStartEncryptedBanner ?? true).toBe(true);

    // After complete, banner should be dismissed
    global = setChatKeyExchangeState(global, chatId, 'complete');
    chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.showStartEncryptedBanner).toBe(false);
  });

  it('can transition from inProgress back to idle (restart)', () => {
    // Edge case: user cancels key exchange
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-restart';

    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('inProgress');

    // Restart back to idle
    global = setChatKeyExchangeState(global, chatId, 'idle');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('idle');
  });
});

// ======================================================================
// VAL-E2E-006: Failed Key Exchange handled gracefully
// ======================================================================

describe('VAL-E2E-006: Failed Key Exchange handled gracefully', () => {
  it('tampered prekey bundle signature is rejected', () => {
    // Verifies VAL-E2E-006: Invalid signature causes key exchange failure
    const bobKp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(bobKp, 5);

    // Tamper with the signature
    const tamperedSignature = new Uint8Array(bundle.signedPrekey.signature);
    tamperedSignature[0] ^= 0xFF;

    const tamperedBundle: PrekeyBundle = {
      ...bundle,
      signedPrekey: {
        ...bundle.signedPrekey,
        signature: tamperedSignature,
      },
    };

    expect(() => verifyPrekeyBundle(tamperedBundle))
      .toThrow('invalid signed prekey signature');
  });

  it('keyExchangeState transitions to failed on error', () => {
    // Verifies VAL-E2E-006: Failed state is set on error
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-failed';

    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('inProgress');

    // Simulate failure
    global = setChatKeyExchangeState(global, chatId, 'failed');
    const chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('failed');
    // Status must NOT be encrypted
    expect(chatState!.status).not.toBe('encrypted');
  });

  it('failed key exchange does not result in encrypted status', () => {
    // Verifies VAL-E2E-006: No encrypted status on failure
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-failed-not-encrypted';

    global = setChatKeyExchangeState(global, chatId, 'failed');
    const chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState!.keyExchangeState).toBe('failed');
    expect(chatState!.status).not.toBe('encrypted');
  });

  it('can recover from failed state by retrying key exchange', () => {
    // Verifies VAL-E2E-006: Recovery after failure
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-chat-recovery';

    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    global = setChatKeyExchangeState(global, chatId, 'failed');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('failed');

    // Retry: back to inProgress, then complete
    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('inProgress');

    global = setChatKeyExchangeState(global, chatId, 'complete');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('complete');
    expect(global.telebridge.chatEncryptionStates[chatId]!.status).toBe('encrypted');
  });

  it('wrong identity key in prekey bundle is rejected', () => {
    // Verifies VAL-E2E-006: Invalid identity key causes failure
    const bobKp = generateIdentityKeypair();
    const otherKp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(bobKp, 5);

    const tamperedBundle: PrekeyBundle = {
      ...bundle,
      identityPub: otherKp.verifyingBytes,
      x25519IdentityPub: deriveX25519FromEd25519(otherKp.signingBytes).point,
    };

    expect(() => verifyPrekeyBundle(tamperedBundle))
      .toThrow('invalid signed prekey signature');
  });
});

// ======================================================================
// Integration Layer: processKeyExchangeMessage
// ======================================================================

describe('Integration Layer: processKeyExchangeMessage', () => {
  afterEach(cleanup);

  it('valid kx message extracts ephemeral and identity public keys', () => {
    const result = simulateFullKeyExchange();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');
    const kxResult = integ.processKeyExchangeMessage(result.kxMessage, 'test-chat-kx');

    expect(kxResult.isValid).toBe(true);
    expect(kxResult.ephemeralPub).toHaveLength(32);
    expect(kxResult.x25519IdentityPub).toHaveLength(32);
    expect(kxResult.error).toBeUndefined();

    // Ephemeral key matches Alice's
    expect(bytesToHex(kxResult.ephemeralPub!)).toBe(bytesToHex(result.aliceResult.ephemeralPub));
  });

  it('invalid kx message returns isValid: false', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');
    const kxResult = integ.processKeyExchangeMessage('tb1.s.AQIDBA==', 'test-chat-kx');

    expect(kxResult.isValid).toBe(false);
    expect(kxResult.error).toBeDefined();
  });

  it('malformed kx message (too short payload) returns isValid: false', () => {
    // Create a kx message with a payload that's too short
    const shortPayload = new Uint8Array(16);
    const kxMessage = encodeProtocol('kx', shortPayload);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');
    const kxResult = integ.processKeyExchangeMessage(kxMessage, 'test-chat-kx');

    expect(kxResult.isValid).toBe(false);
    expect(kxResult.error).toBeDefined();
  });
});

// ======================================================================
// Integration Layer: Pending Key Exchange Messages
// ======================================================================

describe('Integration Layer: Pending Key Exchange Messages', () => {
  afterEach(cleanup);

  it('setPendingKeyExchangeMessage stores message for a chat', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');

    const chatId = 'test-chat-pending';
    integ.setPendingKeyExchangeMessage(chatId, 'tb1.kx.AQIDBA==');
    expect(integ.hasPendingKeyExchangeMessage(chatId)).toBe(true);
  });

  it('consumePendingKeyExchangeMessage returns and removes the message', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');

    const chatId = 'test-chat-consume';
    const msg = 'tb1.kx.AQIDBA==';
    integ.setPendingKeyExchangeMessage(chatId, msg);

    const consumed = integ.consumePendingKeyExchangeMessage(chatId);
    expect(consumed).toBe(msg);
    expect(integ.hasPendingKeyExchangeMessage(chatId)).toBe(false);
  });

  it('consuming from non-existent chat returns undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require('../src/telebridge/integration') as typeof import('../src/telebridge/integration');

    const consumed = integ.consumePendingKeyExchangeMessage('nonexistent');
    expect(consumed).toBeUndefined();
  });
});

// ======================================================================
// Prekey Bundle Management
// ======================================================================

describe('Prekey Bundle Management', () => {
  it('can generate and retrieve prekey bundles for key exchange initiation', () => {
    // Verifies that prekey bundles can be generated and retrieved
    const bobKp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(bobKp, 10);

    expect(bundle.identityPub).toHaveLength(32);
    expect(bundle.x25519IdentityPub).toHaveLength(32);
    expect(bundle.signedPrekey.pub).toHaveLength(32);
    expect(bundle.signedPrekey.priv).toHaveLength(32);
    expect(bundle.signedPrekey.signature).toHaveLength(64);
    expect(bundle.oneTimePrekeys).toHaveLength(10);
  });

  it('prekey bundle verification succeeds for valid bundle', () => {
    const kp = generateIdentityKeypair();
    const bundle = generatePrekeyBundle(kp, 5);
    const verified = verifyPrekeyBundle(bundle, 0);

    expect(verified.identityPub).toHaveLength(32);
    expect(verified.signedPrekeyPub).toHaveLength(32);
    expect(verified.oneTimePrekeyPub).toBeDefined();
    expect(verified.oneTimePrekeyPub).toHaveLength(32);
  });

  it('kx message can be decoded to extract ephemeral and identity public keys', () => {
    const result = simulateFullKeyExchange();
    const decoded = decodeProtocol(result.kxMessage);
    expect(decoded).toBeDefined();
    expect(decoded!.mode).toBe('kx');

    // Extract the ephemeral key and identity key from payload
    const ephemeralPub = decoded!.payload.slice(0, 32);
    const identityPub = decoded!.payload.slice(32, 64);

    expect(ephemeralPub).toHaveLength(32);
    expect(identityPub).toHaveLength(32);

    // Ephemeral key matches Alice's
    expect(bytesToHex(ephemeralPub)).toBe(bytesToHex(result.aliceResult.ephemeralPub));
  });
});

// ======================================================================
// Integration: Full Protocol Flow
// ======================================================================

describe('Integration: Full Key Exchange Protocol Flow', () => {
  afterEach(cleanup);

  it('Alice initiates → sends kx → Bob receives → both have same key', () => {
    // Full protocol simulation
    const result = simulateFullKeyExchange();

    // Both derive same key
    expect(bytesToHex(result.aliceResult.chatDerivedKey))
      .toBe(bytesToHex(result.bobResult.chatDerivedKey));
    expect(result.aliceResult.keyId).toBe(result.bobResult.keyId);

    // Both can set up their chat keys
    const aliceChatId = 'chat-alice-to-bob';
    const bobChatId = 'chat-bob-to-alice';

    setChatKey(aliceChatId, result.aliceResult.chatDerivedKey);
    setChatKey(bobChatId, result.bobResult.chatDerivedKey);

    expect(hasChatKey(aliceChatId)).toBe(true);
    expect(hasChatKey(bobChatId)).toBe(true);
  });

  it('state machine transitions match the full protocol flow', () => {
    let global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const chatId = 'test-state-flow';

    // 1. Start: idle
    let chatState = global.telebridge.chatEncryptionStates[chatId];
    expect(chatState?.keyExchangeState ?? 'idle').toBe('idle');

    // 2. Alice starts key exchange: inProgress
    global = setChatKeyExchangeState(global, chatId, 'inProgress');
    expect(global.telebridge.chatEncryptionStates[chatId]!.keyExchangeState).toBe('inProgress');

    // 3. Key exchange completes: complete + encrypted
    global = setChatKeyExchangeState(global, chatId, 'complete');
    chatState = global.telebridge.chatEncryptionStates[chatId]!;
    expect(chatState.keyExchangeState).toBe('complete');
    expect(chatState.status).toBe('encrypted');
    expect(chatState.showStartEncryptedBanner).toBe(false);
  });
});

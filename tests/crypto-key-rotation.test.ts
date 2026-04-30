/**
 * TeleBridge — Key Rotation Tests
 *
 * Tests VAL-E2E-007: Key Rotation encrypts new key via ECDH.
 *
 * Verifies:
 * 1. Key rotation sends new public key (not raw symmetric key) in tb1.kx payload
 * 2. New symmetric key is encrypted via ECDH with recipient's public key
 * 3. Old key ID retained in previousKeys for grace period
 * 4. Messages encrypted with old key ID can still be decrypted during grace period
 */

import { x25519 } from '@noble/curves/ed25519.js';

import {
  deriveX25519FromEd25519,
  generateIdentityKeypair,
} from '../src/telebridge/crypto/identity';
import {
  completeKeyExchange,
  generatePrekeyBundle,
  initiateKeyExchange,
  performECDH,
  verifyPrekeyBundle,
} from '../src/telebridge/crypto/keyExchange';
import {
  decodeProtocol,
  encodeProtocol,
} from '../src/telebridge/crypto/protocol';
import {
  generateChatKey,
  RatchetState,
} from '../src/telebridge/crypto/symmetric';
import {
  performKeyRotation,
  processKeyExchangeMessage,
  processRotationKxDecryption,
  setRecipientX25519PublicKey,
} from '../src/telebridge/integration';
import {
  clearAllChatKeys,
  decryptMessage,
  encryptMessage,
  getChatKeyEntry,
  rotateChatKey,
  setChatKey,
} from '../src/telebridge/messages';

/** Rotation kx payload marker byte — distinguishes rotation kx from initial kx */
const ROTATION_KX_MARKER = 0x02;

// ---------- Helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Set up a key exchange between Alice and Bob, establishing shared chat keys.
 */
function setupKeyExchangeWithChatKeys() {
  const aliceKp = generateIdentityKeypair();
  const bobKp = generateIdentityKeypair();
  const aliceX25519 = deriveX25519FromEd25519(aliceKp.signingBytes);
  const bobX25519 = deriveX25519FromEd25519(bobKp.signingBytes);

  const bobBundle = generatePrekeyBundle(bobKp, 5);
  const verifiedBundle = verifyPrekeyBundle(bobBundle, 0);

  const aliceResult = initiateKeyExchange(aliceKp, verifiedBundle);
  const bobResult = completeKeyExchange(
    bobKp,
    bobBundle.signedPrekey,
    aliceResult.ephemeralPub,
    aliceX25519.point,
    bobBundle.oneTimePrekeys[0],
  );

  return {
    aliceKp,
    bobKp,
    aliceX25519,
    bobX25519,
    aliceResult,
    bobResult,
    bobBundle,
    verifiedBundle,
  };
}

// ======================================================================
// VAL-E2E-007: Key Rotation encrypts new key via ECDH
// ======================================================================

describe('VAL-E2E-007: Key Rotation via ECDH', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  // ---- Test 1: rotateChatKey retains old key in previousKeys ----

  it('rotateChatKey retains old key ID in previousKeys', () => {
    const key1 = generateChatKey();
    const ratchet = new RatchetState(key1.key, key1.keyId);

    const originalKeyId = ratchet.currentKeyId;

    // Generate a new key and rotate
    const key2 = generateChatKey();
    ratchet.rotateKey(key2.key, key2.keyId);

    // The old key should be in previous keys
    const previousKeyIds = ratchet.getPreviousKeyIds();
    expect(previousKeyIds).toContain(originalKeyId);

    // The current key should be the new key
    expect(ratchet.currentKeyId).toBe(key2.keyId);
  });

  // ---- Test 2: Key rotation produces different key ID ----

  it('key rotation via rotateChatKey produces different key ID', () => {
    const chatId = 'chat-rotation-keys';
    setChatKey(chatId, generateChatKey().key);

    const entry = getChatKeyEntry(chatId);
    const oldKeyId = entry!.keyId;

    // Rotate the key
    const { oldKeyId: rotatedOldKeyId, newKeyId, newKey } = rotateChatKey(chatId);

    // Old and new key IDs should be different
    expect(rotatedOldKeyId).toBe(oldKeyId);
    expect(newKeyId).not.toBe(oldKeyId);

    // newKey should be a 32-byte key
    expect(newKey).toHaveLength(32);

    // The current key should be the new key
    const newEntry = getChatKeyEntry(chatId);
    expect(newEntry!.keyId).toBe(newKeyId);
  });

  // ---- Test 3: ECDH commutativity for key rotation ----

  it('ECDH derivation produces the same key on both sides of key rotation', () => {
    const setup = setupKeyExchangeWithChatKeys();

    // Alice generates rotation ephemeral keypair
    const aliceEphKp = x25519.keygen();

    // Alice computes ECDH: herEphemeralPriv × Bob's X25519 public key
    const aliceRotationEcdh = performECDH(aliceEphKp.secretKey, setup.bobX25519.point);

    // Bob computes ECDH: hisIdentityPriv × Alice's ephemeral public key
    const bobRotationEcdh = performECDH(setup.bobX25519.scalar, aliceEphKp.publicKey);

    // Both must derive the same key (ECDH commutativity)
    expect(bytesToHex(aliceRotationEcdh.chatDerivedKey)).toBe(
      bytesToHex(bobRotationEcdh.chatDerivedKey),
    );
    expect(aliceRotationEcdh.keyId).toBe(bobRotationEcdh.keyId);
  });

  // ---- Test 4: performKeyRotation generates ECDH-encrypted kx payload ----

  it('performKeyRotation kx payload has rotation marker (0x02) and ephemeral public key', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-rotation-payload';

    // Store the shared key and set Bob's X25519 public key
    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    // Perform key rotation (async)
    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();
    expect(result!.kxMessage).toMatch(/^tb1\.kx\./);

    // Decode the kx message (kxMessage is defined because we set up recipient pubkey)
    const decoded = decodeProtocol(result!.kxMessage!);
    expect(decoded).toBeDefined();
    expect(decoded!.mode).toBe('kx');

    // The payload should start with the rotation marker byte (0x02)
    expect(decoded!.payload[0]).toBe(ROTATION_KX_MARKER);

    // Extract the ephemeral public key (bytes 5-37, after marker + keyId)
    const ephPub = decoded!.payload.slice(5, 37);
    expect(ephPub.length).toBe(32);

    // The ephemeral public key should not be all zeros
    let isAllZeros = true;
    for (let i = 0; i < 32; i++) {
      if (ephPub[i] !== 0) {
        isAllZeros = false;
        break;
      }
    }
    expect(isAllZeros).toBe(false);

    // The old key ID should be retained in previousKeys
    const entry = getChatKeyEntry(chatId);
    expect(entry).toBeDefined();
    expect(entry!.ratchet.getPreviousKeyIds()).toContain(result!.oldKeyId);
  });

  // ---- Test 5: performKeyRotation kx payload does NOT contain raw symmetric key ----

  it('performKeyRotation kx payload does NOT contain raw symmetric key in cleartext', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-rotation-no-cleartext';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();

    const decoded = decodeProtocol(result!.kxMessage!);
    expect(decoded).toBeDefined();

    const payload = decoded!.payload;

    // Get the current chat key (the new key after rotation)
    const newEntry = getChatKeyEntry(chatId);
    expect(newEntry).toBeDefined();

    // The payload raw bytes should NOT contain the raw new key in cleartext
    const rawKeyBytes = newEntry!.key;
    let rawKeyFound = false;
    for (let offset = 0; offset <= payload.length - 32; offset++) {
      let match = true;
      for (let i = 0; i < 32; i++) {
        if (payload[offset + i] !== rawKeyBytes[i]) {
          match = false;
          break;
        }
      }
      if (match) {
        rawKeyFound = true;
        break;
      }
    }
    expect(rawKeyFound).toBe(false);
  });

  // ---- Test 6: Old key retained for grace period decryption ----

  it('messages encrypted with old key can still be decrypted during grace period', async () => {
    const key1 = generateChatKey();
    const chatId = 'chat-grace-period';
    setChatKey(chatId, key1.key);

    // Encrypt a message with the original key
    const encrypted1 = await encryptMessage('Message with old key', chatId);
    expect(encrypted1.protocolMessage).toMatch(/^tb1\.s\./);

    const originalKeyId = encrypted1.keyId;

    // Rotate the key
    const { oldKeyId, newKeyId } = rotateChatKey(chatId);
    expect(oldKeyId).toBe(originalKeyId);
    expect(newKeyId).not.toBe(originalKeyId);

    // Encrypt a message with the new key
    const encrypted2 = await encryptMessage('Message with new key', chatId);

    // Decrypt the OLD message using previousKeys (grace period)
    const decryptedOld = await decryptMessage(encrypted1.protocolMessage, chatId);
    expect(decryptedOld).toBeDefined();
    expect(decryptedOld!.text).toBe('Message with old key');

    // Decrypt the NEW message
    const decryptedNew = await decryptMessage(encrypted2.protocolMessage, chatId);
    expect(decryptedNew).toBeDefined();
    expect(decryptedNew!.text).toBe('Message with new key');
  });

  // ---- Test 7: Multiple key rotations retain previous keys ----

  it('multiple key rotations retain previous keys until expiration', () => {
    const key1 = generateChatKey();
    const ratchet = new RatchetState(key1.key, key1.keyId);

    const key1Id = ratchet.currentKeyId;

    // Rotate to key2
    const key2 = generateChatKey();
    ratchet.rotateKey(key2.key, key2.keyId);
    const key2Id = ratchet.currentKeyId;

    expect(ratchet.getPreviousKeyIds()).toContain(key1Id);

    // Rotate to key3
    const key3 = generateChatKey();
    ratchet.rotateKey(key3.key, key3.keyId);

    const previousIds = ratchet.getPreviousKeyIds();
    expect(previousIds).toContain(key1Id);
    expect(previousIds).toContain(key2Id);
    expect(ratchet.currentKeyId).toBe(key3.keyId);
  });

  // ---- Test 8: RatchetState.getPreviousKeyMessageKey ----

  it('RatchetState.getPreviousKeyMessageKey derives correct key for old messages', () => {
    const key1 = generateChatKey();
    const ratchet = new RatchetState(key1.key, key1.keyId);

    const { messageKey: msgKey0, keyId: oldKeyId } = ratchet.nextSendKey();
    const { messageKey: msgKey1 } = ratchet.nextSendKey();

    // Rotate to a new key
    const key2 = generateChatKey();
    const oldKeyIdStr = oldKeyId;
    ratchet.rotateKey(key2.key, key2.keyId);

    // Old key should be in previous keys
    expect(ratchet.getPreviousKeyIds()).toContain(oldKeyIdStr);

    // Derive a message key for the old key at counter 0
    const oldMsgKey = ratchet.getPreviousKeyMessageKey(oldKeyIdStr, 0);
    expect(oldMsgKey).toBeDefined();
    expect(oldMsgKey).toEqual(msgKey0);

    // And for counter 1
    const oldMsgKey1 = ratchet.getPreviousKeyMessageKey(oldKeyIdStr, 1);
    expect(oldMsgKey1).toBeDefined();
    expect(oldMsgKey1).toEqual(msgKey1);
  });

  // ---- Test 9: Full round-trip: Alice rotates, Bob decrypts new key ----

  it('Bob can decrypt rotation kx message and derive the same new key', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const aliceChatId = 'chat-alice-rotation-rt';
    const bobChatId = 'chat-bob-rotation-rt';

    // Both parties store the initial shared key
    setChatKey(aliceChatId, setup.aliceResult.chatDerivedKey);
    setChatKey(bobChatId, setup.bobResult.chatDerivedKey);

    // Alice's side: set Bob's X25519 public key for rotation ECDH
    setRecipientX25519PublicKey(aliceChatId, setup.bobX25519.point);

    // Alice encrypts a message before rotation
    const _preRotationMsg = await encryptMessage('Before rotation', aliceChatId);

    // Alice performs key rotation
    const result = await performKeyRotation(aliceChatId);
    expect(result).toBeDefined();

    // The kxMessage should be a valid protocol message
    expect(result!.kxMessage).toMatch(/^tb1\.kx\./);

    // Decode the rotation kx message
    const kxDecoded = decodeProtocol(result!.kxMessage!);
    expect(kxDecoded).toBeDefined();
    expect(kxDecoded!.mode).toBe('kx');
    expect(kxDecoded!.payload[0]).toBe(ROTATION_KX_MARKER);

    // Process the rotation kx message on Bob's side
    const kxResult = processKeyExchangeMessage(result!.kxMessage!, bobChatId);
    expect(kxResult.isValid).toBe(true);
    expect(kxResult.ephemeralPub).toBeDefined();
    expect(kxResult.ephemeralPub!.length).toBe(32);

    // Bob decrypts the new key using his X25519 private key
    const bobDecryptResult = await processRotationKxDecryption(
      result!.kxMessage!,
      bobChatId,
      setup.bobX25519.scalar,
    );

    expect(bobDecryptResult.success).toBe(true);
    expect(bobDecryptResult.newKey).toBeDefined();
    expect(bobDecryptResult.newKey!.length).toBe(32);
    expect(bobDecryptResult.newKeyId).toBeDefined();

    // The new key on Bob's side should match the key stored on Alice's side
    const aliceNewEntry = getChatKeyEntry(aliceChatId);
    expect(aliceNewEntry).toBeDefined();
    expect(bytesToHex(bobDecryptResult.newKey!)).toBe(
      bytesToHex(aliceNewEntry!.key),
    );

    // Bob can encrypt with the new key
    const bobEncryptResult = await encryptMessage('After rotation from Bob', bobChatId);
    expect(bobEncryptResult.protocolMessage).toMatch(/^tb1\.s\./);

    // Alice can decrypt Bob's post-rotation message
    const aliceDecryptResult = await decryptMessage(bobEncryptResult.protocolMessage, aliceChatId);
    expect(aliceDecryptResult).toBeDefined();
    expect(aliceDecryptResult!.text).toBe('After rotation from Bob');
  });

  // ---- Test 10: Rotation kx payload structure validation ----

  it('rotation kx payload has correct structure: marker + keyId + ephPub + nonce + ciphertext + authTag', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-rotation-structure';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();

    const decoded = decodeProtocol(result!.kxMessage!);
    expect(decoded).toBeDefined();

    const payload = decoded!.payload;

    // Rotation marker (byte 0)
    expect(payload[0]).toBe(ROTATION_KX_MARKER);

    // Key ID (bytes 1-4)
    const keyIdBytes = payload.slice(1, 5);
    expect(keyIdBytes.length).toBe(4);
    const keyIdHex = Array.from(keyIdBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    expect(keyIdHex).toBe(result!.newKeyId);

    // Ephemeral pub (bytes 5-36)
    const ephPub = payload.slice(5, 37);
    expect(ephPub.length).toBe(32);

    // Nonce (bytes 37-48)
    const nonce = payload.slice(37, 49);
    expect(nonce.length).toBe(12);

    // Ciphertext + authTag
    expect(payload.length).toBe(1 + 4 + 32 + 12 + 32 + 16); // 97 bytes total
  });

  // ---- Test 11: processKeyExchangeMessage identifies rotation kx ----

  it('processKeyExchangeMessage identifies rotation kx messages with ephemeralPub and newKeyId', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-kx-identify';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();

    // processKeyExchangeMessage should recognize this as a valid kx message
    const kxResult = processKeyExchangeMessage(result!.kxMessage!, chatId);
    // For rotation kx messages, it returns a RotationKxResult
    expect(kxResult.isValid).toBe(true);
    expect(kxResult.ephemeralPub).toBeDefined();
    expect(kxResult.ephemeralPub!.length).toBe(32);
  });

  // ---- Test 12: Invalid rotation kx payloads are rejected ----

  it('rotation kx with too-short payload is rejected', () => {
    const shortPayload = new Uint8Array(50);
    shortPayload[0] = ROTATION_KX_MARKER;
    const kxMessage = encodeProtocol('kx', shortPayload);

    const result = processKeyExchangeMessage(kxMessage, 'test-chat');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  // ---- Test 13: All-zero ephemeral key in rotation kx is rejected ----

  it('rotation kx with all-zero ephemeral key is rejected', () => {
    const payload = new Uint8Array(97);
    payload[0] = ROTATION_KX_MARKER; // marker
    // keyId at bytes 1-4 (any value)
    // ephemeralPub at bytes 5-36: all zeros (should be rejected)
    const kxMessage = encodeProtocol('kx', payload);

    const result = processKeyExchangeMessage(kxMessage, 'test-chat');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('zero');
  });
});

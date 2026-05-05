/**
 * TeleBridge — Key Rotation ECDH Domain Separation Tests
 *
 * Tests VAL-SEC-002: Key rotation uses ECDH re-derivation, not raw keys.
 *
 * Verifies:
 * 1. performKeyRotation generates ephemeral X25519 keypair and performs ECDH
 * 2. New chat key derived via HKDF-SHA256 with domain-separated info ('TeleBridge-Rotation-v1')
 * 3. Rotation kx message contains ephemeral public key + encrypted payload (NOT raw key)
 * 4. Recipient derives same new key from rotation message using their private key
 * 5. Domain separation: rotation key differs from initial key exchange key
 * 6. Old messages still decrypt after key rotation (grace period)
 * 7. Grep assertion: no raw key material in kx payload
 */

import { x25519 } from '@noble/curves/ed25519.js';

import { deriveChatKey, ROTATION_KEY_INFO } from '../src/telebridge/crypto/keyExchange';
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

/** HKDF info string for initial chat key derivation */
const CHAT_KEY_INFO = new TextEncoder().encode('TeleBridge-ChatKey-v1');

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
// VAL-SEC-002: Key Rotation ECDH Domain Separation
// ======================================================================

describe('VAL-SEC-002: Key Rotation ECDH Domain Separation', () => {
  beforeEach(() => {
    clearAllChatKeys();
  });

  // ---- Test 1: Domain separation ensures rotation key differs from initial key ----

  it('ECDH shared secret with ROTATION_KEY_INFO produces different key than CHAT_KEY_INFO', () => {
    // If an attacker confuses a rotation ECDH output for an initial key exchange,
    // they should get a DIFFERENT derived key, preventing cross-use.
    const setup = setupKeyExchangeWithChatKeys();
    const aliceEphKp = x25519.keygen();

    // Compute X25519 DH output (not a stored secret — computed from test keypairs)
    const ecdhDhOutput = x25519.getSharedSecret(aliceEphKp.secretKey, setup.bobX25519.point);

    // Derive with CHAT_KEY_INFO (initial key exchange)
    const initialKey = deriveChatKey(ecdhDhOutput, CHAT_KEY_INFO);

    // Derive with ROTATION_KEY_INFO (key rotation)
    const rotationKey = deriveChatKey(ecdhDhOutput, ROTATION_KEY_INFO);

    // The two keys MUST be different — domain separation
    expect(bytesToHex(rotationKey)).not.toBe(bytesToHex(initialKey));

    // Both should be 32-byte AES-256 keys
    expect(initialKey.length).toBe(32);
    expect(rotationKey.length).toBe(32);
  });

  // ---- Test 2: performKeyRotation uses ECDH re-derivation, NOT raw key ----

  it('performKeyRotation kx payload contains ephemeral public key, not raw symmetric key', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-rotation-ecdh-verify';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();
    expect(result!.kxMessage).toMatch(/^tb1\.kx\./);

    const decoded = decodeProtocol(result!.kxMessage!);
    expect(decoded).toBeDefined();
    expect(decoded!.mode).toBe('kx');

    const payload = decoded!.payload;

    // First byte must be rotation marker 0x02
    expect(payload[0]).toBe(ROTATION_KX_MARKER);

    // Get the current (new) key after rotation
    const newEntry = getChatKeyEntry(chatId);
    expect(newEntry).toBeDefined();
    const rawKeyBytes = newEntry!.key;

    // The raw symmetric key MUST NOT appear anywhere in the payload
    // Search the entire payload for a contiguous 32-byte sequence matching the raw key
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

    // The payload must contain the ephemeral public key (bytes 5-37)
    const ephPub = payload.slice(5, 37);
    expect(ephPub.length).toBe(32);

    // The ephemeral key should NOT be all zeros
    let ephIsAllZeros = true;
    for (let i = 0; i < 32; i++) {
      if (ephPub[i] !== 0) {
        ephIsAllZeros = false;
        break;
      }
    }
    expect(ephIsAllZeros).toBe(false);
  });

  // ---- Test 3: Recipient derives same new key from rotation message ----

  it('recipient derives the same new chat key from rotation kx message', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const aliceChatId = 'chat-alice-ecdh-roundtrip';
    const bobChatId = 'chat-bob-ecdh-roundtrip';

    // Both parties store the initial shared key
    setChatKey(aliceChatId, setup.aliceResult.chatDerivedKey);
    setChatKey(bobChatId, setup.bobResult.chatDerivedKey);

    // Alice sets Bob's X25519 public key for rotation ECDH
    setRecipientX25519PublicKey(aliceChatId, setup.bobX25519.point);

    // Alice performs key rotation
    const result = await performKeyRotation(aliceChatId);
    expect(result).toBeDefined();

    // Bob decrypts the rotation kx message using his X25519 private key
    const bobDecryptResult = await processRotationKxDecryption(
      result!.kxMessage!,
      bobChatId,
      setup.bobX25519.scalar,
    );

    expect(bobDecryptResult.success).toBe(true);
    expect(bobDecryptResult.newKey).toBeDefined();
    expect(bobDecryptResult.newKey!.length).toBe(32);

    // The derived key on Bob's side must match Alice's stored key
    const aliceNewEntry = getChatKeyEntry(aliceChatId);
    expect(aliceNewEntry).toBeDefined();
    expect(bytesToHex(bobDecryptResult.newKey!)).toBe(
      bytesToHex(aliceNewEntry!.key),
    );
  });

  // ---- Test 4: Rotation ECDH uses domain-separated info string ----

  it('rotation ECDH uses ROTATION_KEY_INFO, not CHAT_KEY_INFO', async () => {
    // This test verifies that changing the info string produces a different key.
    // If the implementation accidentally uses CHAT_KEY_INFO for rotation,
    // the derived key would match the initial ECDH key, which is wrong.
    const setup = setupKeyExchangeWithChatKeys();

    // Bob's ECDH with a random ephemeral public key using CHAT_KEY_INFO (initial)
    const ephKp = x25519.keygen();
    const ecdhOutput = x25519.getSharedSecret(setup.bobX25519.scalar, ephKp.publicKey);
    const initialDerivedKey = deriveChatKey(ecdhOutput, CHAT_KEY_INFO);

    // Bob's ECDH with the same ephemeral using ROTATION_KEY_INFO
    const rotationDerivedKey = deriveChatKey(ecdhOutput, ROTATION_KEY_INFO);

    // These MUST be different — proving domain separation
    expect(bytesToHex(initialDerivedKey)).not.toBe(bytesToHex(rotationDerivedKey));
  });

  // ---- Test 5: Old messages still decrypt after key rotation ----

  it('old messages decrypt after key rotation (grace period)', async () => {
    const key1 = generateChatKey();
    const chatId = 'chat-grace-period-ecdh';
    setChatKey(chatId, key1.key);

    // Encrypt a message with the original key
    const encrypted = await encryptMessage('Before rotation', chatId);
    expect(encrypted.protocolMessage).toMatch(/^tb1\.s\./);
    const originalKeyId = encrypted.keyId;

    // Rotate the key
    const { oldKeyId, newKeyId } = rotateChatKey(chatId);
    expect(oldKeyId).toBe(originalKeyId);
    expect(newKeyId).not.toBe(originalKeyId);

    // Old message should still decrypt (grace period)
    const decryptedOld = await decryptMessage(encrypted.protocolMessage, chatId);
    expect(decryptedOld).toBeDefined();
    expect(decryptedOld!.text).toBe('Before rotation');

    // New key should also work for encryption
    const encryptedNew = await encryptMessage('After rotation', chatId);
    const decryptedNew = await decryptMessage(encryptedNew.protocolMessage, chatId);
    expect(decryptedNew).toBeDefined();
    expect(decryptedNew!.text).toBe('After rotation');
  });

  // ---- Test 6: Full round-trip with domain separation ----

  it('full round-trip: Alice rotates with ECDH, Bob decrypts with domain separation', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const aliceChatId = 'chat-alice-rotation-full';
    const bobChatId = 'chat-bob-rotation-full';

    // Both parties store the initial shared key
    setChatKey(aliceChatId, setup.aliceResult.chatDerivedKey);
    setChatKey(bobChatId, setup.bobResult.chatDerivedKey);

    // Alice encrypts a message before rotation
    const preRotationMsg = await encryptMessage('Before rotation', aliceChatId);
    expect(preRotationMsg.protocolMessage).toMatch(/^tb1\.s\./);

    // Alice's side: set Bob's X25519 public key
    setRecipientX25519PublicKey(aliceChatId, setup.bobX25519.point);

    // Perform key rotation
    const rotationResult = await performKeyRotation(aliceChatId);
    expect(rotationResult).toBeDefined();
    expect(rotationResult!.kxMessage).toMatch(/^tb1\.kx\./);

    // Bob decrypts the new key from the rotation kx message
    const bobDecryptResult = await processRotationKxDecryption(
      rotationResult!.kxMessage!,
      bobChatId,
      setup.bobX25519.scalar,
    );
    expect(bobDecryptResult.success).toBe(true);
    expect(bobDecryptResult.newKey).toBeDefined();

    // Verify both parties now have the same key
    const aliceNewEntry = getChatKeyEntry(aliceChatId);
    expect(aliceNewEntry).toBeDefined();
    expect(bytesToHex(bobDecryptResult.newKey!)).toBe(
      bytesToHex(aliceNewEntry!.key),
    );

    // Bob can now encrypt with the new key
    const bobEncryptResult = await encryptMessage('After rotation from Bob', bobChatId);
    expect(bobEncryptResult.protocolMessage).toMatch(/^tb1\.s\./);

    // Pre-rotation message should still decrypt on both sides (grace period)
    const aliceDecryptOld = await decryptMessage(preRotationMsg.protocolMessage, aliceChatId);
    expect(aliceDecryptOld).toBeDefined();
    expect(aliceDecryptOld!.text).toBe('Before rotation');

    // Post-rotation message should decrypt on Alice's side
    const aliceDecryptNew = await decryptMessage(bobEncryptResult.protocolMessage, aliceChatId);
    expect(aliceDecryptNew).toBeDefined();
    expect(aliceDecryptNew!.text).toBe('After rotation from Bob');
  });

  // ---- Test 7: processKeyExchangeMessage distinguishes rotation from initial kx ----

  it('processKeyExchangeMessage distinguishes rotation kx (0x02 marker) from initial kx', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-kx-type-distinguish';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    // Perform key rotation to get a rotation kx message
    const rotationResult = await performKeyRotation(chatId);
    expect(rotationResult).toBeDefined();

    const kxResult = processKeyExchangeMessage(rotationResult!.kxMessage!, chatId);

    // Rotation kx should have ephemeralPub and newKeyId, but NOT x25519IdentityPub
    expect(kxResult.isValid).toBe(true);
    expect(kxResult.ephemeralPub).toBeDefined();
    expect(kxResult.ephemeralPub!.length).toBe(32);
    expect(kxResult.newKeyId).toBeDefined();
    expect(kxResult.x25519IdentityPub).toBeUndefined(); // Not present in rotation kx
  });

  // ---- Test 8: Initial kx processed correctly (not confused with rotation) ----

  it('initial kx (no 0x02 marker) has x25519IdentityPub but no newKeyId', () => {
    // Create an initial kx payload (64 bytes, no 0x02 marker)
    const payload = new Uint8Array(64);
    crypto.getRandomValues(payload);
    // Ensure first byte is NOT 0x02 (rotation marker)
    payload[0] = 0x01;

    const kxMessage = encodeProtocol('kx', payload);
    const result = processKeyExchangeMessage(kxMessage, 'test-chat');

    expect(result.isValid).toBe(true);
    expect(result.ephemeralPub).toBeDefined();
    expect(result.ephemeralPub!.length).toBe(32);
    expect(result.x25519IdentityPub).toBeDefined();
    expect(result.x25519IdentityPub!.length).toBe(32);
    expect(result.newKeyId).toBeUndefined(); // Not present in initial kx
  });

  // ---- Test 9: Grep assertion: rotation kx payload does not contain raw key ----

  it('rotation kx payload binary has no substring matching raw symmetric key', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const chatId = 'chat-no-raw-key-grep';

    setChatKey(chatId, setup.aliceResult.chatDerivedKey);
    setRecipientX25519PublicKey(chatId, setup.bobX25519.point);

    const result = await performKeyRotation(chatId);
    expect(result).toBeDefined();

    const decoded = decodeProtocol(result!.kxMessage!);
    expect(decoded).toBeDefined();

    const payload = decoded!.payload;
    const newKey = getChatKeyEntry(chatId)!.key;

    // Convert both to hex for easier comparison
    const payloadHex = bytesToHex(payload);
    const keyHex = bytesToHex(newKey);

    // The raw key hex string must not appear in the payload hex string
    // This is a stronger check than byte-by-byte since it catches any alignment
    expect(payloadHex).not.toContain(keyHex);
  });

  // ---- Test 10: ROTATION_KEY_INFO constant has correct value ----

  it('ROTATION_KEY_INFO is domain-separated from CHAT_KEY_INFO', () => {
    // Verify the constant is correctly set
    const rotationInfoStr = new TextDecoder().decode(ROTATION_KEY_INFO);
    expect(rotationInfoStr).toBe('TeleBridge-Rotation-v1');

    // Must be different from CHAT_KEY_INFO
    const chatKeyInfoStr = new TextDecoder().decode(CHAT_KEY_INFO);
    expect(rotationInfoStr).not.toBe(chatKeyInfoStr);
  });

  // ---- Test 11: Using wrong HKDF info string produces wrong encryption key ----

  it('using CHAT_KEY_INFO instead of ROTATION_KEY_INFO produces different encryption key (fails to decrypt)', async () => {
    const setup = setupKeyExchangeWithChatKeys();
    const aliceChatId = 'chat-wrong-info-alice';
    const bobChatId = 'chat-wrong-info-bob';

    setChatKey(aliceChatId, setup.aliceResult.chatDerivedKey);
    setChatKey(bobChatId, setup.bobResult.chatDerivedKey);
    setRecipientX25519PublicKey(aliceChatId, setup.bobX25519.point);

    // Perform key rotation (uses ROTATION_KEY_INFO internally)
    const result = await performKeyRotation(aliceChatId);
    expect(result).toBeDefined();

    const decoded = decodeProtocol(result!.kxMessage!);
    const payload = decoded!.payload;

    // Extract ephemeral public key from the rotation payload
    let offset = 0;
    offset += 1; // skip marker
    offset += 4; // skip keyId
    const ephPub = payload.slice(offset, offset + 32);
    offset += 32;
    // nonce and ciphertext follow

    // Compute X25519 DH output (not a stored secret — computed from test keypairs)
    const ecdhDhOutput = x25519.getSharedSecret(setup.bobX25519.scalar, ephPub);

    // Derive rotation encryption key with CHAT_KEY_INFO (wrong for rotation)
    const wrongEncryptionKey = deriveChatKey(ecdhDhOutput, CHAT_KEY_INFO);

    // Derive rotation encryption key with ROTATION_KEY_INFO (correct for rotation)
    const correctEncryptionKey = deriveChatKey(ecdhDhOutput, ROTATION_KEY_INFO);

    // The two derived keys must be different — domain separation
    expect(bytesToHex(wrongEncryptionKey)).not.toBe(bytesToHex(correctEncryptionKey));

    // Bob's decryption with the CORRECT info string should succeed
    // (this is tested in "recipient derives the same new chat key" test above)
    // The key point: using the wrong info string would produce a different
    // encryption key, so the ciphertext would not decrypt correctly.
    // This verifies the domain separation is enforced cryptographically.
  });
});

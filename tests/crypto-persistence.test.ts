/**
 * TeleBridge — Key Persistence Tests
 *
 * VAL-CRYPTO-023: No plaintext keys written to disk (V1 Bug #5 guard)
 * VAL-CRYPTO-024: Encrypted key blob is tamper-evident (AEAD)
 * VAL-CRYPTO-025: unlockBridge decrypts keys before use (V1 Bug #2 guard)
 */
import type { EncryptedKeyStore } from '../src/telebridge/crypto/persistence';

import {
  deriveX25519FromEd25519,
  generateIdentityKeypair,
} from '../src/telebridge/crypto/identity';
import {
  decryptKeyBlob,
  encryptKeyBlob,
} from '../src/telebridge/crypto/password';
import {
  changeBridgePassword,
  createEncryptedKeyStore,
  getBridgeState,
  getUnlockedIdentity,
  getUnlockedX25519,
  isBridgeUnlocked,
  lockBridge,
  unlockBridge,
  verifyBridgePassword,
} from '../src/telebridge/crypto/persistence';

// ---------- Setup / Cleanup ----------

// The persistence module uses module-level state. Reset between tests.
beforeEach(() => {
  lockBridge();
});

// ---------- Helpers ----------

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ---------- VAL-CRYPTO-023: No plaintext keys written to disk ----------

describe('VAL-CRYPTO-023: No plaintext keys written to disk', () => {
  test('createEncryptedKeyStore returns only encrypted data', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'test-bridge-password-2024';
    const store = await createEncryptedKeyStore(keypair, password);

    // The store has encryptedBlob, NOT plaintext keys
    expect(store.encryptedBlob).toBeTruthy();
    expect(typeof store.encryptedBlob).toBe('string');

    // Public keys ARE stored in plaintext (they're not secret)
    expect(store.ed25519PubBase64).toBeTruthy();
    expect(store.x25519PubBase64).toBeTruthy();

    // Private key material is NOT stored in plaintext anywhere in the store
    // The encryptedBlob is JSON containing encrypted data only
    const blobObj = JSON.parse(store.encryptedBlob);
    expect(blobObj.c).toBeTruthy(); // ciphertext (encrypted)
    expect(blobObj.n).toBeTruthy(); // nonce
    expect(blobObj.s).toBeTruthy(); // salt
    // No plaintext private key field exists
    expect(blobObj.privateKey).toBeUndefined();
    expect(blobObj.signingBytes).toBeUndefined();
  });

  test('encryptKeyBlob produces AEAD-protected output', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'test-password-argon2id';

    const blob = await encryptKeyBlob(
      keypair.signingBytes,
      x25519.scalar,
      password,
    );

    // Blob is a JSON string
    expect(typeof blob).toBe('string');
    const parsed = JSON.parse(blob);

    // It contains version, salt, nonce, ciphertext, params
    expect(parsed.v).toBe(1);
    expect(parsed.s).toBeTruthy(); // salt
    expect(parsed.n).toBeTruthy(); // nonce
    expect(parsed.c).toBeTruthy(); // ciphertext (encrypted with AES-256-GCM)
    expect(parsed.p).toBeTruthy(); // parameters
  });

  test('persistence round-trip: encrypt → create store → unlock → verify keys', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'round-trip-password';

    const store = await createEncryptedKeyStore(keypair, password);

    // Lock state initially
    expect(isBridgeUnlocked()).toBe(false);

    // Unlock with correct password
    const result = await unlockBridge(store, password);
    expect(result.identity).toBeDefined();
    expect(result.identity.ed25519.signingBytes).toBeInstanceOf(Uint8Array);
    expect(result.identity.ed25519.verifyingBytes).toBeInstanceOf(Uint8Array);
    expect(result.identity.x25519).toBeDefined();

    // Verify the unlocked keys match the original
    expect(arraysEqual(result.identity.ed25519.verifyingBytes, keypair.verifyingBytes)).toBe(true);
    expect(arraysEqual(result.identity.x25519.point, x25519.point)).toBe(true);

    // Bridge is now unlocked
    expect(isBridgeUnlocked()).toBe(true);
    expect(getBridgeState()).toBe('unlocked');

    // Clean up
    lockBridge();
    expect(isBridgeUnlocked()).toBe(false);
    expect(getBridgeState()).toBe('locked');
  });
});

// ---------- VAL-CRYPTO-024: Encrypted key blob is tamper-evident (AEAD) ----------

describe('VAL-CRYPTO-024: Encrypted key blob tamper-evident', () => {
  test('single-byte modification to ciphertext causes load failure', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'tamper-test-password';

    const blob = await encryptKeyBlob(
      keypair.signingBytes,
      x25519.scalar,
      password,
    );

    // Tamper with the ciphertext
    const parsed = JSON.parse(blob);
    const ciphertext = atob(parsed.c);
    const tamperedCiphertext = ciphertext.slice(0, -2) + String.fromCharCode(
      ciphertext.charCodeAt(ciphertext.length - 1) ^ 0xFF,
    );
    parsed.c = btoa(tamperedCiphertext);
    const tamperedBlob = JSON.stringify(parsed);

    // Decrypt should fail (AEAD verification fails on tampered data)
    const result = await decryptKeyBlob(tamperedBlob, password);
    expect(result).toBeUndefined();
  });

  test('single-byte modification to nonce causes load failure', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'nonce-tamper-test';

    const blob = await encryptKeyBlob(
      keypair.signingBytes,
      x25519.scalar,
      password,
    );

    // Tamper with the nonce
    const parsed = JSON.parse(blob);
    const nonce = atob(parsed.n);
    const tamperedNonce = String.fromCharCode(nonce.charCodeAt(0) ^ 0xFF) + nonce.slice(1);
    parsed.n = btoa(tamperedNonce);
    const tamperedBlob = JSON.stringify(parsed);

    const result = await decryptKeyBlob(tamperedBlob, password);
    expect(result).toBeUndefined();
  });

  test('single-byte modification to salt causes load failure', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'salt-tamper-test';

    const blob = await encryptKeyBlob(
      keypair.signingBytes,
      x25519.scalar,
      password,
    );

    // Tamper with the salt
    const parsed = JSON.parse(blob);
    const salt = atob(parsed.s);
    const tamperedSalt = String.fromCharCode(salt.charCodeAt(0) ^ 0xFF) + salt.slice(1);
    parsed.s = btoa(tamperedSalt);
    const tamperedBlob = JSON.stringify(parsed);

    const result = await decryptKeyBlob(tamperedBlob, password);
    expect(result).toBeUndefined();
  });

  test('encrypted store blob is tamper-evident via AEAD', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'store-tamper-test';
    const store = await createEncryptedKeyStore(keypair, password);

    // Parse the store and tamper with the encryptedBlob
    const parsedBlob = JSON.parse(store.encryptedBlob);
    const ciphertext = atob(parsedBlob.c);
    const tamperedCiphertext = String.fromCharCode(ciphertext.charCodeAt(0) ^ 0x01) + ciphertext.slice(1);
    parsedBlob.c = btoa(tamperedCiphertext);

    const tamperedStore: EncryptedKeyStore = {
      ...store,
      encryptedBlob: JSON.stringify(parsedBlob),
    };

    // unlockBridge should fail (AEAD verification)
    await expect(unlockBridge(tamperedStore, password)).rejects.toThrow();
  });

  test('wrong password fails to decrypt key blob', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'correct-password';

    const blob = await encryptKeyBlob(
      keypair.signingBytes,
      x25519.scalar,
      password,
    );

    // Wrong password should fail
    const result = await decryptKeyBlob(blob, 'wrong-password');
    expect(result).toBeUndefined();
  });
});

// ---------- VAL-CRYPTO-025: unlockBridge decrypts keys before use ----------

describe('VAL-CRYPTO-025: unlockBridge decrypts keys before use', () => {
  test('unlockBridge with correct password populates usable decrypted keys', async () => {
    const keypair = generateIdentityKeypair();
    const x25519 = deriveX25519FromEd25519(keypair.signingBytes);
    const password = 'test-unlock-password';
    const store = await createEncryptedKeyStore(keypair, password);

    // Before unlock: no decrypted keys available
    expect(getUnlockedIdentity()).toBeUndefined();
    expect(getUnlockedX25519()).toBeUndefined();

    // Unlock with correct password
    const result = await unlockBridge(store, password);

    // Decrypted keys are now available
    expect(getUnlockedIdentity()).toBeDefined();
    expect(getUnlockedX25519()).toBeDefined();

    // Keys match the original
    expect(arraysEqual(result.identity.ed25519.verifyingBytes, keypair.verifyingBytes)).toBe(true);
    expect(arraysEqual(result.identity.x25519.point, x25519.point)).toBe(true);

    // The decrypted identity can sign and verify
    const { signBytes, verifySignature } = await import('../src/telebridge/crypto/identity');
    const data = new TextEncoder().encode('test message');
    const signature = signBytes(result.identity.ed25519.signingBytes, data);
    expect(verifySignature(keypair.verifyingBytes, signature, data)).toBe(true);

    // Clean up
    lockBridge();
    expect(getUnlockedIdentity()).toBeUndefined();
  });

  test('wrong password throws error (V1 Bug #2 guard)', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'correct-password';
    const store = await createEncryptedKeyStore(keypair, password);

    // Wrong password should throw
    await expect(unlockBridge(store, 'wrong-password')).rejects.toThrow(/wrong/i);

    // Bridge should be left in error/locked state
    expect(isBridgeUnlocked()).toBe(false);
  });

  test('bridge state transitions: locked → unlocking → unlocked → locked', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'state-test-password';
    const store = await createEncryptedKeyStore(keypair, password);

    expect(getBridgeState()).toBe('locked');

    const result = await unlockBridge(store, password);
    expect(getBridgeState()).toBe('unlocked');
    expect(result.identity).toBeDefined();

    lockBridge();
    expect(getBridgeState()).toBe('locked');
    expect(getUnlockedIdentity()).toBeUndefined();
  });

  test('verifyBridgePassword checks password without unlocking', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'verify-test-password';
    const store = await createEncryptedKeyStore(keypair, password);

    const correct = await verifyBridgePassword(store, password);
    expect(correct).toBe(true);

    const wrong = await verifyBridgePassword(store, 'wrong-password');
    expect(wrong).toBe(false);

    // Bridge should still be locked after verification
    expect(getBridgeState()).toBe('locked');
  });

  test('changeBridgePassword re-encrypts with new password', async () => {
    const keypair = generateIdentityKeypair();
    const oldPassword = 'old-password-2024';
    const newPassword = 'new-password-2024';

    const store = await createEncryptedKeyStore(keypair, oldPassword);
    const newStore = await changeBridgePassword(store, oldPassword, newPassword);

    // New store should have different encrypted blob and salt
    expect(newStore.encryptedBlob).not.toBe(store.encryptedBlob);
    expect(newStore.salt).not.toBe(store.salt);

    // Old password should NOT work with new store
    await expect(unlockBridge(newStore, oldPassword)).rejects.toThrow();

    // Lock before trying with correct password
    lockBridge();

    // New password should work
    const result = await unlockBridge(newStore, newPassword);
    expect(result.identity).toBeDefined();

    // Keys should still match
    expect(arraysEqual(result.identity.ed25519.verifyingBytes, keypair.verifyingBytes)).toBe(true);

    lockBridge();
  }, 30000); // Argon2id is slow in test env

  test('bridge cannot be unlocked twice without locking first', async () => {
    const keypair = generateIdentityKeypair();
    const password = 'double-unlock-test';
    const store = await createEncryptedKeyStore(keypair, password);

    await unlockBridge(store, password);

    // Second unlock should throw
    await expect(unlockBridge(store, password)).rejects.toThrow(/already unlocked/);

    lockBridge();
  });
});

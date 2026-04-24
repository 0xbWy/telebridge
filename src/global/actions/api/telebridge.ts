/**
 * TeleBridge — Global State Actions
 *
 * Actions for bridge password management, unlock, lock, and identity.
 * Password is NEVER passed through global state (V1 Bug #8 guard).
 */

import type { ActionReturnType } from '../../types';

import {
  generateMnemonic,
} from '../../../telebridge/crypto/bip39';
import {
  deriveX25519FromEd25519,
  generateIdentityKeypair,
} from '../../../telebridge/crypto/identity';
import type { EncryptedKeyStore } from '../../../telebridge/crypto/persistence';
import {
  createEncryptedKeyStore,
  unlockBridge,
} from '../../../telebridge/crypto/persistence';
import {
  addActionHandler, setGlobal,
} from '../../index';
import {
  setBridgeError,
  setBridgeIdentity,
  setBridgeLocked,
  setBridgePasswordSet,
  setBridgeUnlocked,
  setBridgeUnlocking,
  setRecoveryPhraseVerified,
} from '../../reducers/telebridge';

// ---------- Action Types ----------

declare global {
  interface ActionPayloads {
    telebridgeSetPassword: { password: string };
    telebridgeUnlock: { password: string };
    telebridgeLock: undefined;
    telebridgeInitIdentity: undefined;
    telebridgeClearError: undefined;
    telebridgeSetRecoveryVerified: { verified: boolean };
  }
}

// ---------- Bridge Password Setup ----------

addActionHandler('telebridgeSetPassword', async (global, actions, payload): Promise<void> => {
  const { password } = payload;
  if (!password || password.length < 8) {
    global = setBridgeError(global, 'TeleBridgePasswordTooShort');
    setGlobal(global);
    return;
  }

  try {
    // 1. Generate identity keypair
    const identityKeypair = generateIdentityKeypair();
    const x25519Keypair = deriveX25519FromEd25519(identityKeypair.signingBytes);

    // 2. Create encrypted key store (Argon2id derivation happens inside)
    const keyStore = await createEncryptedKeyStore(identityKeypair, password);

    // 3. Persist the key store to IndexedDB
    const db = await openBridgeDb();
    await dbPut(db, 'keystore', keyStore, 'default');

    // 4. Update global state (no password stored!)
    global = setBridgePasswordSet(global);
    global = setBridgeIdentity(
      global,
      arrayToBase64(identityKeypair.verifyingBytes),
      arrayToBase64(x25519Keypair.point),
    );
    setGlobal(global);

    // 5. Store mnemonic temporarily for recovery phrase display
    const mnemonic = generateMnemonic();
    window.sessionStorage.setItem('telebridge_mnemonic', mnemonic);
    window.sessionStorage.setItem('telebridge_recovery_shown', 'false');
  } catch {
    global = setBridgeError(global, 'TeleBridgeWrongPassword');
    setGlobal(global);
  }
});

// ---------- Bridge Unlock ----------

addActionHandler('telebridgeUnlock', async (global, actions, payload): Promise<void> => {
  const { password } = payload;

  // Set unlocking state to show spinner
  global = setBridgeUnlocking(global);
  setGlobal(global);

  try {
    const db = await openBridgeDb();
    const keyStore = await dbGet(db, 'keystore', 'default') as EncryptedKeyStore | undefined;

    if (!keyStore) {
      global = setBridgeError(global, 'TeleBridgeWrongPassword');
      setGlobal(global);
      return;
    }

    const result = await unlockBridge(keyStore, password);

    if (!result) {
      global = setBridgeError(global, 'TeleBridgeWrongPassword');
      setGlobal(global);
      return;
    }

    // Success — bridge unlocked
    global = setBridgeUnlocked(global);
    global = setBridgeIdentity(
      global,
      arrayToBase64(result.identity.ed25519.verifyingBytes),
      arrayToBase64(result.identity.x25519.point),
    );
    setGlobal(global);
  } catch {
    global = setBridgeError(global, 'TeleBridgeWrongPassword');
    setGlobal(global);
  }
});

// ---------- Bridge Lock ----------

addActionHandler('telebridgeLock', (global): ActionReturnType => {
  return setBridgeLocked(global);
});

// ---------- Initialize Identity ----------

addActionHandler('telebridgeInitIdentity', (global): ActionReturnType => {
  try {
    const identityKeypair = generateIdentityKeypair();
    const x25519Keypair = deriveX25519FromEd25519(identityKeypair.signingBytes);

    global = setBridgeIdentity(
      global,
      arrayToBase64(identityKeypair.verifyingBytes),
      arrayToBase64(x25519Keypair.point),
    );
    setGlobal(global);
  } catch {
    global = setBridgeError(global, 'TeleBridgeWrongPassword');
    setGlobal(global);
  }
});

// ---------- Clear Error ----------

addActionHandler('telebridgeClearError', (global): ActionReturnType => {
  return setBridgeError(global, '');
});

// ---------- Set Recovery Verified ----------

addActionHandler('telebridgeSetRecoveryVerified', (global, actions, payload): ActionReturnType => {
  const { verified } = payload;
  return setRecoveryPhraseVerified(global, verified);
});

// ---------- Helper: IndexedDB ----------

const BRIDGE_DB_NAME = 'telebridge-keys';
const BRIDGE_DB_VERSION = 1;

function openBridgeDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(BRIDGE_DB_NAME, BRIDGE_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('keystore')) {
        db.createObjectStore('keystore');
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to open TeleBridge key database'));
    };
  });
}

function dbPut(
  db: IDBDatabase,
  storeName: string,
  value: unknown,
  key: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function dbGet(db: IDBDatabase, storeName: string, key: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ---------- Utility ----------

function arrayToBase64(arr: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < arr.length; i++) {
    binary += String.fromCharCode(arr[i]);
  }
  return btoa(binary);
}

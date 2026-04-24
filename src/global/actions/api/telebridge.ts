/**
 * TeleBridge — Global State Actions
 *
 * Actions for bridge password management, unlock, lock, identity,
 * key exchange, and per-chat encryption state.
 * Password is NEVER passed through global state (V1 Bug #8 guard).
 */

import type { EncryptedKeyStore } from '../../../telebridge/crypto/persistence';
import type { EncryptionStatus } from '../../../telebridge/state';
import type { ActionReturnType } from '../../types';

import {
  generateMnemonic,
} from '../../../telebridge/crypto/bip39';
import {
  deriveX25519FromEd25519,
  generateIdentityKeypair,
} from '../../../telebridge/crypto/identity';
import {
  createEncryptedKeyStore,
  unlockBridge,
} from '../../../telebridge/crypto/persistence';
import {
  addActionHandler, getGlobal, setGlobal,
} from '../../index';
import {
  acknowledgeKeyChange,
  dismissStartEncryptedBanner,
  setBridgeError,
  setBridgeIdentity,
  setBridgeLocked,
  setBridgePasswordSet,
  setBridgeUnlocked,
  setBridgeUnlocking,
  setChatEncryptionStatus as setChatEncryptionStatusReducer,
  setChatKeyExchangeState,
  setDefaultEncryptNewChats,
  setRecoveryPhraseVerified,
  setTofuAutoAccepted,
  setTofuAutoAcceptEnabled,
} from '../../reducers/telebridge';

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

// ---------- Key Exchange ----------

addActionHandler('telebridgeStartKeyExchange', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;
  global = setChatKeyExchangeState(global, chatId, 'inProgress');
  setGlobal(global);

  // Simulate key exchange completion after a short delay
  // In a real implementation, this would send a tb1.kx.<base64> message via Telegram
  // and wait for the handshake response
  setTimeout(() => {
    const currentGlobal = getGlobal();
    global = setChatKeyExchangeState(currentGlobal, chatId, 'complete');
    setGlobal(global);
  }, 2000);

  return global;
});

// ---------- Chat Encryption Status ----------

addActionHandler('telebridgeSetChatEncryptionStatus', (global, actions, payload): ActionReturnType => {
  const { chatId, status } = payload;
  return setChatEncryptionStatusReducer(global, chatId, status as EncryptionStatus);
});

// ---------- Key Change ----------

addActionHandler('telebridgeAcknowledgeKeyChange', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;
  return acknowledgeKeyChange(global, chatId);
});

// ---------- Banner ----------

addActionHandler('telebridgeDismissBanner', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;
  return dismissStartEncryptedBanner(global, chatId);
});

// ---------- Settings ----------

addActionHandler('telebridgeSetDefaultEncrypt', (global, actions, payload): ActionReturnType => {
  const { enabled } = payload;
  return setDefaultEncryptNewChats(global, enabled);
});

addActionHandler('telebridgeSetTofuAutoAccept', (global, actions, payload): ActionReturnType => {
  const { enabled } = payload;
  return setTofuAutoAcceptEnabled(global, enabled);
});

// ---------- TOFU ----------

addActionHandler('telebridgeTofuAutoAccept', (global, actions, payload): ActionReturnType => {
  const { chatId, contactName } = payload;
  return setTofuAutoAccepted(global, chatId, contactName);
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

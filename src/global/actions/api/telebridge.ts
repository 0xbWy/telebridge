/**
 * TeleBridge — Global State Actions
 *
 * Actions for bridge password management, unlock, lock, identity,
 * key exchange, and per-chat encryption state.
 * Password is NEVER passed through global state (V1 Bug #8 guard).
 */

import type { EncryptedKeyStore } from '../../../telebridge/crypto/persistence';
import type { EncryptionStatus, KeyExchangeState } from '../../../telebridge/state';
import type { ActionReturnType } from '../../types';

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
  setChatEncryptionState,
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

    // Mnemonic is passed directly from the component to avoid async race
    // conditions. It is NOT stored in sessionStorage (fixes race bug).
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
  // Clear in-memory chat keys when locking
  // V1 Bug #5: no plaintext keys in memory when locked
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const integ = require('../../../telebridge/integration') as typeof import('../../../telebridge/integration');
  integ.lockMessagePipeline();
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

// ---------- Startup: Probe IndexedDB for Existing Keystore ----------

addActionHandler('telebridgeInitStartup', async (global): Promise<void> => {
  // On app start, probe IndexedDB to check if a keystore already exists.
  // This restores hasPassword state when the cache is loaded from IndexedDB,
  // so the user doesn't see the password setup flow again after reload.
  // Skip probing if cache already has hasPassword set (from reduceGlobal persistence).
  if (global.telebridge?.hasPassword) {
    return;
  }

  try {
    const db = await openBridgeDb();
    const keyStore = await dbGet(db, 'keystore', 'default') as EncryptedKeyStore | undefined;

    if (keyStore) {
      // Keystore exists — user has previously set a password.
      // Restore hasPassword and public key identity from the stored keystore.
      global = getGlobal(); // Re-read in case state changed during async
      global = setBridgePasswordSet(global);
      global = setBridgeIdentity(global, keyStore.ed25519PubBase64, keyStore.x25519PubBase64);
      // Bridge stays locked until user enters password
      global = setBridgeLocked(global);
      setGlobal(global);
    }
  } catch {
    // If IndexedDB probe fails, leave state as-is (hasPassword: false).
    // User will see the setup flow, which is safer than assuming no password.
  }
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

  // In a real implementation, this would:
  // 1. Generate an ephemeral X25519 keypair
  // 2. Send a tb1.kx.<base64> message containing our ephemeral public key
  // 3. Wait for the other party's response
  // 4. Derive the shared chat key via ECDH
  //
  // For now, generate a random chat key and mark the exchange as complete
  // This allows the messaging pipeline to function for testing and development
  setTimeout(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const sym = require(
      '../../../telebridge/crypto/symmetric',
    ) as typeof import('../../../telebridge/crypto/symmetric');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const msg = require('../../../telebridge/messages') as typeof import('../../../telebridge/messages');

    const { key } = sym.generateChatKey();
    msg.setChatKey(chatId, key);

    global = getGlobal();
    global = setChatKeyExchangeState(global, chatId, 'complete');
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

// ---------- Chat Key Management ----------

addActionHandler('telebridgeEstablishChatKey', (global, actions, payload): ActionReturnType => {
  const { chatId, keyBase64 } = payload;

  // Store the key in the in-memory messages module
  // Key lookup is always by explicit chatId (V1 Bug #4 guard)
  const keyBytes = base64ToArray(keyBase64);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const msgModule = require('../../../telebridge/messages') as typeof import('../../../telebridge/messages');
  msgModule.setChatKey(chatId, keyBytes);

  // Update the chat encryption state to reflect the new key
  global = setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    status: 'encrypted' as EncryptionStatus,
    keyExchangeState: 'complete' as KeyExchangeState,
    showStartEncryptedBanner: false,
    lastKeyExchangeAt: Date.now(),
    messageCount: 0,
  }));

  return global;
});

addActionHandler('telebridgeIncrementMessageCount', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;

  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    messageCount: (chatState.messageCount ?? 0) + 1,
  }));
});

addActionHandler('telebridgeRotateChatKey', (global, actions, payload): ActionReturnType => {
  const { chatId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const integration = require('../../../telebridge/integration') as typeof import('../../../telebridge/integration');

  const rotation = integration.checkKeyRotation(chatId);
  if (rotation) {
    // Key was rotated — send a kx message to the other party
    // TODO: Send key exchange message via Telegram
    // For now, update the state to reflect the rotation
    global = getGlobal();
    global = setChatEncryptionState(global, chatId, (chatState) => ({
      ...chatState,
      messageCount: 0,
      lastKeyExchangeAt: Date.now(),
    }));
    setGlobal(global);
    return global;
  }

  return global;
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

function base64ToArray(base64: string): Uint8Array {
  const binary = atob(base64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    arr[i] = binary.charCodeAt(i);
  }
  return arr;
}

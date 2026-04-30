/**
 * TeleBridge — Global State Actions
 *
 * Actions for bridge password management, unlock, lock, identity,
 * key exchange, and per-chat encryption state.
 * Password is NEVER passed through global state (V1 Bug #8 guard).
 */

import type { EncryptedKeyStore } from '../../../telebridge/crypto/persistence';
import type {
  ContactVerificationEntry, EncryptionStatus, GroupEncryptionStatus, KeyExchangeState,
} from '../../../telebridge/state';
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
  clearTelebridgeStores,
  getPrekeyBundle,
  setPrekeyBundle,
  setRecipientPubBase64,
} from '../../../telebridge/stores';
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
  setContactFingerprint,
  setContactVerification,
  setContactVerificationStatus,
  setDefaultEncryptNewChats,
  setGroupEncryptionStatus as setGroupEncryptionStatusReducer,
  setGroupKeyChangeWarning,
  setIsGroupChat,
  setRecoveryPhraseVerified,
  setReducedSecurity,
  setTofuAutoAccepted,
  setTofuAutoAcceptEnabled,
  updateTeleBridgeState,
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

  // Clear action-level stores (prekeyBundleStore, recipientX25519PubStore in stores.ts)
  clearActionLevelStores();

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

/**
 * Clear module-level stores containing private key material.
 * Called by telebridgeLock action before lockMessagePipeline()
 * to clear stores that are defined in the stores module.
 *
 * This is a security requirement: private key material must not remain
 * in memory when the bridge is locked.
 */
export function clearActionLevelStores(): void {
  clearTelebridgeStores();
}

addActionHandler('telebridgeStartKeyExchange', (global, actions, payload): ActionReturnType => {
  const { chatId, recipientPrekeyBundleBase64 } = payload as {
    chatId: string;
    recipientPrekeyBundleBase64?: string;
  };

  // Transition to inProgress immediately
  global = setChatKeyExchangeState(global, chatId, 'inProgress');
  setGlobal(global);

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const persistence = require(
      '../../../telebridge/crypto/persistence',
    ) as typeof import('../../../telebridge/crypto/persistence');

    // Bridge must be unlocked to access identity keys
    const identity = persistence.getUnlockedIdentity();
    if (!identity) {
      global = getGlobal();
      global = setChatKeyExchangeState(global, chatId, 'failed');
      global = setBridgeError(global, 'TeleBridgeBridgeLocked');
      setGlobal(global);
      return global;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const kx = require(
      '../../../telebridge/crypto/keyExchange',
    ) as typeof import('../../../telebridge/crypto/keyExchange');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const protocol = require(
      '../../../telebridge/crypto/protocol',
    ) as typeof import('../../../telebridge/crypto/protocol');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const msgs = require('../../../telebridge/messages') as typeof import('../../../telebridge/messages');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require(
      '../../../telebridge/integration',
    ) as typeof import('../../../telebridge/integration');

    // Step 1: Get the recipient's prekey bundle
    let verifiedBundle: import('../../../telebridge/crypto/keyExchange').VerifiedPrekeyBundle;
    if (recipientPrekeyBundleBase64) {
      // Decode the recipient's prekey bundle from base64
      const bundleJson = atob(recipientPrekeyBundleBase64);
      const bundle: import('../../../telebridge/crypto/keyExchange').PrekeyBundle = JSON.parse(bundleJson);

      // Reconstruct binary fields from base64 within the JSON
      const reconstructedBundle: import('../../../telebridge/crypto/keyExchange').PrekeyBundle = {
        identityPub: base64ToArray(bundle.identityPub as unknown as string),
        x25519IdentityPub: base64ToArray(bundle.x25519IdentityPub as unknown as string),
        signedPrekey: {
          pub: base64ToArray((bundle.signedPrekey as any).pub as string),
          priv: base64ToArray((bundle.signedPrekey as any).priv as string),
          signature: base64ToArray((bundle.signedPrekey as any).signature as string),
        },
        oneTimePrekeys: (bundle.oneTimePrekeys as any[]).map((otpk: any) => ({
          scalar: base64ToArray(otpk.scalar as string),
          point: base64ToArray(otpk.point as string),
        })),
      };

      verifiedBundle = kx.verifyPrekeyBundle(reconstructedBundle);
    } else {
      // Without a provided bundle, we cannot perform real X3DH.
      // This path is used during development/testing when no bundle is available.
      global = getGlobal();
      global = setChatKeyExchangeState(global, chatId, 'failed');
      global = setBridgeError(global, 'TeleBridgeNoPrekeyBundle');
      setGlobal(global);
      return global;
    }

    // Step 2: Perform X3DH key exchange using initiateKeyExchange()
    const result = kx.initiateKeyExchange(identity.ed25519, verifiedBundle);

    // Step 3: Store the derived chat key
    msgs.setChatKey(chatId, result.chatDerivedKey);

    // Step 4: Store recipient's X25519 public key for future use (secured messages)
    setRecipientPubBase64(chatId, arrayToBase64(verifiedBundle.x25519IdentityPub));
    integ.setRecipientX25519PublicKey(chatId, verifiedBundle.x25519IdentityPub);

    // Step 5: Prepare tb1.kx message with ephemeral public key + our X25519 identity pub
    const myX25519 = identity.x25519;
    const kxPayload = new Uint8Array(64); // 32 bytes ephemeral + 32 bytes X25519 identity
    kxPayload.set(result.ephemeralPub, 0);
    kxPayload.set(myX25519.point, 32);
    const kxMessage = protocol.encodeProtocol('kx', kxPayload);

    // Step 6: Update chat encryption state to complete
    global = getGlobal();
    global = setChatEncryptionState(global, chatId, (chatState) => ({
      ...chatState,
      status: 'encrypted' as EncryptionStatus,
      keyExchangeState: 'complete' as KeyExchangeState,
      showStartEncryptedBanner: false,
      lastKeyExchangeAt: Date.now(),
      messageCount: 0,
    }));
    setGlobal(global);

    // The kxMessage should be sent via the Telegram transport.
    // This is handled by the calling code (e.g., Composer.tsx or a key exchange UI component)
    // which reads the pending kx message from state or a return value.
    // For now, we store it as a pending outgoing message that the transport layer will pick up.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pendingKx = require('../../../telebridge/integration') as typeof import('../../../telebridge/integration');
    pendingKx.setPendingKeyExchangeMessage(chatId, kxMessage);
  } catch (error) {
    // Key exchange failed — transition to 'failed' state
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Key exchange failed:', error);
    global = getGlobal();
    global = setChatKeyExchangeState(global, chatId, 'failed');
    setGlobal(global);
  }

  return global;
});

// ---------- Complete Key Exchange (Responder) ----------

addActionHandler('telebridgeCompleteKeyExchange', (global, actions, payload): ActionReturnType => {
  const { chatId, kxMessage } = payload as {
    chatId: string;
    kxMessage: string;
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const persistence = require(
      '../../../telebridge/crypto/persistence',
    ) as typeof import('../../../telebridge/crypto/persistence');

    // Bridge must be unlocked to access identity keys
    const identity = persistence.getUnlockedIdentity();
    if (!identity) {
      global = setChatKeyExchangeState(global, chatId, 'failed');
      global = setBridgeError(global, 'TeleBridgeBridgeLocked');
      return global;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const kx = require(
      '../../../telebridge/crypto/keyExchange',
    ) as typeof import('../../../telebridge/crypto/keyExchange');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const protocol = require(
      '../../../telebridge/crypto/protocol',
    ) as typeof import('../../../telebridge/crypto/protocol');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const msgs = require('../../../telebridge/messages') as typeof import('../../../telebridge/messages');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const integ = require(
      '../../../telebridge/integration',
    ) as typeof import('../../../telebridge/integration');

    // Decode the kx message
    const decoded = protocol.decodeProtocol(kxMessage);
    if (!decoded || decoded.mode !== 'kx') {
      throw new Error('Invalid key exchange message format');
    }

    // Extract ephemeral public key and X25519 identity pub from payload
    if (decoded.payload.length < 64) {
      throw new Error('Key exchange payload too short: expected 64 bytes');
    }

    const theirEphemeralPub = decoded.payload.slice(0, 32);
    const theirX25519IdentityPub = decoded.payload.slice(32, 64);

    // Look up our own signed prekey for this chat
    // If we have a prekey bundle store entry, use it; otherwise FAIL
    // (Do NOT generate ad-hoc unverifiable prekeys — this is a security requirement)
    const storedData = getPrekeyBundle(chatId);
    let signedPrekey: import('../../../telebridge/crypto/keyExchange').SignedPrekey;
    let consumedOtpk: import('../../../telebridge/crypto/identity').X25519Keypair | undefined;

    if (storedData) {
      signedPrekey = storedData.bundle.signedPrekey;
      // Consume the first available one-time prekey
      const otpkEntry = storedData.consumedOneTimePrekeys.entries().next();
      if (!otpkEntry.done) {
        consumedOtpk = otpkEntry.value[1];
      }
    } else {
      // No stored prekey bundle — fail rather than generate unverifiable ad-hoc prekeys.
      // The responder must have called telebridgeGeneratePrekeyBundle before
      // the initiator can start a key exchange with them.
      global = setChatKeyExchangeState(global, chatId, 'failed');
      global = setBridgeError(global, 'TeleBridgeNoPrekeyBundle');
      return global;
    }

    // Complete the key exchange using X3DH
    const result = kx.completeKeyExchange(
      identity.ed25519,
      signedPrekey,
      theirEphemeralPub,
      theirX25519IdentityPub,
      consumedOtpk,
    );

    // Store the derived chat key
    msgs.setChatKey(chatId, result.chatDerivedKey);

    // Store the initiator's X25519 public key for future use
    integ.setRecipientX25519PublicKey(chatId, theirX25519IdentityPub);

    // Update chat encryption state to complete
    global = setChatEncryptionState(global, chatId, (chatState) => ({
      ...chatState,
      status: 'encrypted' as EncryptionStatus,
      keyExchangeState: 'complete' as KeyExchangeState,
      showStartEncryptedBanner: false,
      lastKeyExchangeAt: Date.now(),
      messageCount: 0,
    }));
  } catch (error) {
    // Key exchange completion failed
    // eslint-disable-next-line no-console
    console.error('[TeleBridge] Key exchange completion failed:', error);
    global = setChatKeyExchangeState(global, chatId, 'failed');
  }

  return global;
});

// ---------- Prekey Bundle Generation ----------

addActionHandler('telebridgeGeneratePrekeyBundle', (global, actions, payload): ActionReturnType => {
  const { chatId, numOneTimePrekeys } = payload as {
    chatId: string;
    numOneTimePrekeys?: number;
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const persistence = require(
      '../../../telebridge/crypto/persistence',
    ) as typeof import('../../../telebridge/crypto/persistence');

    const identity = persistence.getUnlockedIdentity();
    if (!identity) {
      return global;
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const kx = require(
      '../../../telebridge/crypto/keyExchange',
    ) as typeof import('../../../telebridge/crypto/keyExchange');

    // Generate the prekey bundle
    const bundle = kx.generatePrekeyBundle(identity.ed25519, numOneTimePrekeys ?? 5);

    // Store the signed prekey and one-time prekeys for later use in key exchange completion
    const consumedOneTimePrekeys = new Map<number, import('../../../telebridge/crypto/identity').X25519Keypair>();
    bundle.oneTimePrekeys.forEach((otpk: import('../../../telebridge/crypto/identity').X25519Keypair, i: number) => {
      consumedOneTimePrekeys.set(i, otpk);
    });
    setPrekeyBundle(chatId, bundle, consumedOneTimePrekeys);
  } catch {
    // Silently fail — the prekey bundle is not required for basic operation
  }

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

addActionHandler('telebridgeRotateChatKey', async (global, actions, payload): Promise<void> => {
  const { chatId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const integration = require('../../../telebridge/integration') as typeof import('../../../telebridge/integration');

  const rotation = await integration.checkKeyRotation(chatId);
  if (rotation) {
    // Key was rotated — send a kx message to the other party
    if (rotation.kxMessage) {
      // Store the kx message for transport to send
      integration.setPendingKeyExchangeMessage(chatId, rotation.kxMessage);
    }
    // Update the state to reflect the rotation
    global = getGlobal();
    global = setChatEncryptionState(global, chatId, (chatState) => ({
      ...chatState,
      messageCount: 0,
      lastKeyExchangeAt: Date.now(),
    }));
    setGlobal(global);
  }
});

// ---------- Group Encryption Actions ----------

addActionHandler('telebridgeInitGroupEncryption', (global, actions, payload): ActionReturnType => {
  const { chatId, memberIds } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // Initialize group encryption state
  groupState.initGroupEncryptionState(chatId, memberIds);

  // Mark as group chat in global state
  global = setIsGroupChat(global, chatId, true);

  // Set initial group encryption status
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = setGroupEncryptionStatusReducer(global, chatId, status as GroupEncryptionStatus);

  return global;
});

addActionHandler('telebridgeGenerateGroupSenderKey', (global, actions, payload): ActionReturnType => {
  const { chatId, memberId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const persistence = require(
    '../../../telebridge/crypto/persistence',
  ) as typeof import('../../../telebridge/crypto/persistence');

  // Get identity key for uniqueness
  const identity = persistence.getUnlockedIdentity();
  const identitySigningKey = identity?.ed25519.signingBytes;

  // Generate own sender key for this group
  groupState.generateGroupSenderKey(chatId, memberId, identitySigningKey);

  // Update group encryption status
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = getGlobal();
  global = setGroupEncryptionStatusReducer(global, chatId, status as GroupEncryptionStatus);

  return global;
});

addActionHandler('telebridgeDistributeGroupSenderKey', (global, actions, payload): ActionReturnType => {
  const { chatId, memberId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const senderKey = require(
    '../../../telebridge/group/senderKey',
  ) as typeof import('../../../telebridge/group/senderKey');

  // Get our own sender key for this group
  const ownKey = groupState.getOwnGroupSenderKey(chatId, memberId);
  if (!ownKey) {
    // No own key — must generate first
    return global;
  }

  // Create a distributed version (without signing key) for sharing
  const distKey = senderKey.createDistributedSenderKey(ownKey);

  // Serialize for transport via 1-on-1 encrypted channel
  senderKey.serializeSenderKey(distKey);

  // In a real implementation, we would encrypt this with the pairwise chat key
  // and send it as a tb1.kx.<base64> message to each member.
  // For now, we just mark the distribution as done in the group state.
  // TODO: Send serialized.payload to each member via pairwise channel

  // Update status
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = getGlobal();
  global = setGroupEncryptionStatusReducer(
    global, chatId, status as GroupEncryptionStatus,
  );

  return global;
});

addActionHandler('telebridgeStoreGroupSenderKey', (global, actions, payload): ActionReturnType => {
  const { chatId, senderMemberId, keyPayloadBase64 } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const senderKey = require(
    '../../../telebridge/group/senderKey',
  ) as typeof import('../../../telebridge/group/senderKey');

  // Decode the key payload from base64
  const payloadBytes = base64ToArray(keyPayloadBase64);

  // Deserialize the distributed sender key
  const distKey = senderKey.deserializeSenderKey(payloadBytes);

  // Verify the key ID
  if (!senderKey.verifySenderKeyId(distKey)) {
    // Invalid key — don't store
    return global;
  }

  // Store in the group state
  groupState.storeDistributedSenderKey(distKey);

  // Update encryption status
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = getGlobal();
  global = setGroupEncryptionStatusReducer(
    global, chatId, status as GroupEncryptionStatus,
  );

  // Mark pairwise key as complete for this member
  groupState.setGroupPairwiseKeyComplete(chatId, senderMemberId);

  return global;
});

addActionHandler('telebridgeGroupMemberJoin', (global, actions, payload): ActionReturnType => {
  const { chatId, memberId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // Add the new member to the group state
  groupState.addGroupMember(chatId, memberId);

  // The new member cannot decrypt pre-join messages because they
  // won't have the old Sender Keys — this is by design (forward secrecy).

  // Update encryption status
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = getGlobal();
  global = setGroupEncryptionStatusReducer(
    global, chatId, status as GroupEncryptionStatus,
  );

  return global;
});

addActionHandler('telebridgeGroupMemberLeave', (global, actions, payload): ActionReturnType => {
  const { chatId, memberId } = payload;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const groupState = require(
    '../../../telebridge/group/groupState',
  ) as typeof import('../../../telebridge/group/groupState');

  // Start re-keying — all remaining members must regenerate Sender Keys
  groupState.startGroupRekeying(chatId);

  // Remove the departed member from the group state
  groupState.removeGroupMember(chatId, memberId);

  // Update encryption status to transitional
  global = getGlobal();
  global = setGroupEncryptionStatusReducer(
    global, chatId, 'transitional' as GroupEncryptionStatus,
  );

  // In a real implementation, we would:
  // 1. Regenerate our own Sender Key for this group
  // 2. Distribute the new key to remaining members via pairwise channels
  // 3. Old Sender Keys are deleted — departed member cannot decrypt new messages

  // For now, update status to reflect the re-keying
  const status = groupState.getGroupEncryptionStatus(chatId);
  global = setGroupEncryptionStatusReducer(
    global, chatId, status as GroupEncryptionStatus,
  );

  return global;
});

addActionHandler('telebridgeSetGroupEncryptionStatus', (global, actions, payload): ActionReturnType => {
  const { chatId, status } = payload;
  return setGroupEncryptionStatusReducer(
    global, chatId, status as GroupEncryptionStatus,
  );
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

// ---------- Identity QR Verification ----------

addActionHandler('telebridgeGenerateIdentityQr', (global): ActionReturnType => {
  const state = global.telebridge;
  if (!state?.ed25519PublicKey) return global;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { computeFingerprint, generateVerificationUri } = require(
    '../../../telebridge/identity/identityQr',
  ) as typeof import('../../../telebridge/identity/identityQr');

  const publicKeyBytes = base64ToArray(state.ed25519PublicKey);
  const fingerprint = computeFingerprint(publicKeyBytes);
  const userId = global.currentUserId?.toString() ?? '';

  const verificationUri = generateVerificationUri({
    ed25519PublicKey: publicKeyBytes,
    userId,
  });

  // Store the fingerprint in global state for quick access
  return updateTeleBridgeState(global, (s) => ({
    ...s,
    identityFingerprint: fingerprint,
    identityVerificationUri: verificationUri,
  }));
});

addActionHandler('telebridgeVerifyContactQr', (global, actions, payload): ActionReturnType => {
  const { userId, scannedUri } = payload as { userId: string; scannedUri: string };

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { parseVerificationUri, verifyQrFingerprint } = require(
    '../../../telebridge/identity/identityQr',
  ) as typeof import('../../../telebridge/identity/identityQr');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { processContactKeyChange } = require(
    '../../../telebridge/identity/contactVerification',
  ) as typeof import('../../../telebridge/identity/contactVerification');

  const parsed = parseVerificationUri(scannedUri);
  if (!parsed) {
    // Invalid QR code — not a TeleBridge verification URI
    return setContactVerificationStatus(global, userId, 'unverified');
  }

  const contactState = global.telebridge?.contactVerificationStates[userId];
  const currentFingerprint = contactState?.currentFingerprint;
  const result = verifyQrFingerprint(scannedUri, currentFingerprint ?? '');

  if (result === 'verified') {
    // Fingerprint matches — mark contact as verified
    global = setContactVerificationStatus(global, userId, 'verified');
  } else {
    // Fingerprint mismatch — mark as unverified and trigger key change detection
    global = setContactVerificationStatus(global, userId, 'unverified');

    // Process key change for all chats shared with this contact
    if (currentFingerprint && parsed.fingerprint !== currentFingerprint) {
      const keyChangeResult = processContactKeyChange(userId, parsed.fingerprint, 'qr_scan');
      if (keyChangeResult.isKeyChange) {
        // Update fingerprint in global state
        global = setContactFingerprint(global, userId, parsed.fingerprint);

        // Set key change warnings in all encrypted chats with this contact

        const contactChats = Object.entries(global.telebridge?.chatEncryptionStates ?? {})
          .filter(([, chatState]) => chatState.keyExchangeState === 'complete')
          .map(([chatId]) => chatId);

        for (const chatId of contactChats) {
          const existingUsers = global.telebridge?.chatEncryptionStates[chatId]?.groupKeyChangeUserIds ?? [];
          const updatedUsers = existingUsers.includes(userId)
            ? existingUsers
            : [...existingUsers, userId];
          global = setGroupKeyChangeWarning(global, chatId, true, updatedUsers);
        }
      }
    }
  }

  return global;
});

addActionHandler('telebridgeVerifyContactManual', (global, actions, payload): ActionReturnType => {
  const { userId } = payload as { userId: string };
  return setContactVerificationStatus(global, userId, 'verified');
});

addActionHandler('telebridgeUnverifyContact', (global, actions, payload): ActionReturnType => {
  const { userId } = payload as { userId: string };
  return setContactVerificationStatus(global, userId, 'unverified');
});

// ---------- Contact Initialization ----------

addActionHandler('telebridgeInitContact', (global, actions, payload): ActionReturnType => {
  const { userId, fingerprint } = payload as { userId: string; fingerprint: string };

  const existing = global.telebridge?.contactVerificationStates[userId];
  if (existing) {
    // Contact already known — check for key change
    if (existing.currentFingerprint && existing.currentFingerprint !== fingerprint) {
      // Key change detected
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { processContactKeyChange } = require(
        '../../../telebridge/identity/contactVerification',
      ) as typeof import('../../../telebridge/identity/contactVerification');

      const result = processContactKeyChange(userId, fingerprint, 'key_exchange');

      global = setContactFingerprint(global, userId, fingerprint);
      global = setContactVerificationStatus(global, userId, result.newStatus);

      if (result.isKeyChange) {
        // Set key change warning for all chats with this contact
        const contactChats = Object.entries(global.telebridge?.chatEncryptionStates ?? {})
          .filter(([, chatState]) => chatState.keyExchangeState === 'complete')
          .map(([chatId]) => chatId);

        for (const chatId of contactChats) {
          const existingUsers = global.telebridge?.chatEncryptionStates[chatId]?.groupKeyChangeUserIds ?? [];
          const updatedUsers = existingUsers.includes(userId)
            ? existingUsers
            : [...existingUsers, userId];
          global = setGroupKeyChangeWarning(global, chatId, true, updatedUsers);
        }
      }
    }
    // Same key — no change needed
    return global;
  }

  // New contact — initialize as unknown (TOFU)
  const entry: ContactVerificationEntry = {
    userId,
    verificationStatus: 'unknown',
    currentFingerprint: fingerprint,
    keyChangeCount: 0,
    isTofuAccepted: true,
  };

  return setContactVerification(global, userId, entry);
});

// ---------- Group Key Change ----------

addActionHandler('telebridgeSetGroupKeyChangeWarning', (global, actions, payload): ActionReturnType => {
  const { chatId, hasWarning, changedUserIds } = payload as {
    chatId: string;
    hasWarning: boolean;
    changedUserIds: string[];
  };
  return setGroupKeyChangeWarning(global, chatId, hasWarning, changedUserIds);
});

addActionHandler('telebridgeClearGroupKeyChangeWarning', (global, actions, payload): ActionReturnType => {
  const { chatId, userId } = payload as { chatId: string; userId: string };
  const existingUsers = global.telebridge?.chatEncryptionStates[chatId]?.groupKeyChangeUserIds ?? [];
  const updatedUsers = existingUsers.filter((id) => id !== userId);
  return setGroupKeyChangeWarning(global, chatId, updatedUsers.length > 0, updatedUsers);
});

addActionHandler('telebridgeSetReducedSecurity', (global, actions, payload): ActionReturnType => {
  const { chatId, hasReducedSecurity } = payload as {
    chatId: string;
    hasReducedSecurity: boolean;
  };
  return setReducedSecurity(global, chatId, hasReducedSecurity);
});

addActionHandler('telebridgeDemoteContactOnKeyChange', (global, actions, payload): ActionReturnType => {
  const { userId, chatId, newFingerprint } = payload as {
    userId: string;
    chatId: string;
    newFingerprint: string;
  };

  // Demote contact status to unverified
  global = setContactVerificationStatus(global, userId, 'unverified');
  global = setContactFingerprint(global, userId, newFingerprint);

  // Set group key change warning (non-dismissible)
  const existingUsers = global.telebridge?.chatEncryptionStates[chatId]?.groupKeyChangeUserIds ?? [];
  const updatedUsers = existingUsers.includes(userId)
    ? existingUsers
    : [...existingUsers, userId];
  global = setGroupKeyChangeWarning(global, chatId, true, updatedUsers);

  // Process the key change in the contact verification module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { processContactKeyChange } = require(
    '../../../telebridge/identity/contactVerification',
  ) as typeof import('../../../telebridge/identity/contactVerification');
  processContactKeyChange(userId, newFingerprint, 'key_change');

  return global;
});

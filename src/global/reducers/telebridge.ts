/**
 * TeleBridge — Reducers
 *
 * Pure state update functions for the TeleBridge global state slice.
 */

import type {
  BridgeState, ChatEncryptionState, ContactVerificationEntry, ContactVerificationStatus,
  EncryptionStatus, GroupEncryptionStatus, KeyExchangeState, TeleBridgeState,
} from '../../telebridge/state';

import { INITIAL_TELEBRIDGE_STATE } from '../../telebridge/state';

export function updateTeleBridgeState(
  global: any,
  updater: (bridge: TeleBridgeState) => TeleBridgeState,
): any {
  const state = global.telebridge ?? INITIAL_TELEBRIDGE_STATE;
  return {
    ...global,
    telebridge: updater(state),
  };
}

export function setBridgeUnlocked(global: any): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    bridgeState: 'unlocked' as BridgeState,
    errorKey: undefined,
  }));
}

export function setBridgeLocked(global: any): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    bridgeState: 'locked' as BridgeState,
    errorKey: undefined,
  }));
}

export function setBridgeUnlocking(global: any): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    bridgeState: 'unlocking' as BridgeState,
  }));
}

export function setBridgeError(global: any, errorKey: string): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    bridgeState: errorKey ? 'error' as BridgeState : state.bridgeState,
    errorKey: errorKey || undefined,
  }));
}

export function setBridgePasswordSet(global: any): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    hasPassword: true,
    bridgeState: 'unlocked' as BridgeState,
    errorKey: undefined,
  }));
}

export function setBridgeIdentity(global: any, ed25519PublicKey: string, x25519PublicKey: string): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    ed25519PublicKey,
    x25519PublicKey,
  }));
}

export function setRecoveryPhraseVerified(global: any, verified: boolean): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    isRecoveryPhraseVerified: verified,
  }));
}

export function setChatEncryptionState(
  global: any,
  chatId: string,
  updater: (chatState: ChatEncryptionState) => ChatEncryptionState,
): any {
  return updateTeleBridgeState(global, (state) => {
    const existing = state.chatEncryptionStates[chatId] ?? {
      chatId,
      status: 'notEncrypted' as EncryptionStatus,
      keyExchangeState: 'idle' as KeyExchangeState,
      showStartEncryptedBanner: true,
    };
    return {
      ...state,
      chatEncryptionStates: {
        ...state.chatEncryptionStates,
        [chatId]: updater(existing),
      },
    };
  });
}

export function setChatEncryptionStatus(
  global: any,
  chatId: string,
  status: EncryptionStatus,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    status,
  }));
}

export function setChatEncryptionPaused(
  global: any,
  chatId: string,
  isPaused: boolean,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    isPaused,
    status: isPaused
      ? 'paused' as EncryptionStatus
      : chatState.keyExchangeState === 'complete'
        ? 'encrypted' as EncryptionStatus
        : 'notEncrypted' as EncryptionStatus,
  }));
}

export function setChatKeyExchangeState(
  global: any,
  chatId: string,
  keyExchangeState: KeyExchangeState,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    keyExchangeState,
    ...(keyExchangeState === 'complete' ? { showStartEncryptedBanner: false } : {}),
    ...(keyExchangeState === 'complete' ? { status: 'encrypted' as EncryptionStatus } : {}),
  }));
}

export function setChatSafetyNumber(
  global: any,
  chatId: string,
  safetyNumber: string,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    safetyNumber,
  }));
}

export function acknowledgeKeyChange(
  global: any,
  chatId: string,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    isKeyChangeAcknowledged: true,
  }));
}

export function setTofuAutoAccepted(
  global: any,
  chatId: string,
  contactName: string,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    tofuAutoAccepted: {
      contactName,
      timestamp: Date.now(),
    },
  }));
}

export function dismissStartEncryptedBanner(
  global: any,
  chatId: string,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    showStartEncryptedBanner: false,
  }));
}

export function setDefaultEncryptNewChats(global: any, enabled: boolean): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    defaultEncryptNewChats: enabled,
  }));
}

export function setTofuAutoAcceptEnabled(global: any, enabled: boolean): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    tofuAutoAcceptEnabled: enabled,
  }));
}

export function setGroupEncryptionStatus(
  global: any,
  chatId: string,
  groupStatus: GroupEncryptionStatus,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    isGroupChat: true,
    groupEncryptionStatus: groupStatus,
  }));
}

export function setIsGroupChat(
  global: any,
  chatId: string,
  isGroup: boolean,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    isGroupChat: isGroup,
  }));
}

// ---------- Contact Verification Reducers ----------

export function setContactVerification(
  global: any,
  userId: string,
  entry: ContactVerificationEntry,
): any {
  return updateTeleBridgeState(global, (state) => ({
    ...state,
    contactVerificationStates: {
      ...state.contactVerificationStates,
      [userId]: entry,
    },
  }));
}

export function setContactVerificationStatus(
  global: any,
  userId: string,
  verificationStatus: ContactVerificationStatus,
): any {
  const state = global.telebridge ?? INITIAL_TELEBRIDGE_STATE;
  const existing = state.contactVerificationStates[userId];

  const entry: ContactVerificationEntry = existing
    ? { ...existing, verificationStatus }
    : {
      userId,
      verificationStatus,
      keyChangeCount: 0,
      isTofuAccepted: false,
    };

  return updateTeleBridgeState(global, (s) => ({
    ...s,
    contactVerificationStates: {
      ...s.contactVerificationStates,
      [userId]: entry,
    },
  }));
}

export function setContactFingerprint(
  global: any,
  userId: string,
  fingerprint: string,
): any {
  const state = global.telebridge ?? INITIAL_TELEBRIDGE_STATE;
  const existing = state.contactVerificationStates[userId];

  // If the existing entry has a different fingerprint, increment keyChangeCount
  const isKeyChange = existing?.currentFingerprint && existing.currentFingerprint !== fingerprint;
  const newKeyChangeCount = isKeyChange
    ? (existing?.keyChangeCount ?? 0) + 1
    : (existing?.keyChangeCount ?? 0);

  const entry: ContactVerificationEntry = existing
    ? { ...existing, currentFingerprint: fingerprint, keyChangeCount: newKeyChangeCount }
    : {
      userId,
      verificationStatus: 'unknown' as ContactVerificationStatus,
      currentFingerprint: fingerprint,
      keyChangeCount: 0,
      isTofuAccepted: true,
    };

  return updateTeleBridgeState(global, (s) => ({
    ...s,
    contactVerificationStates: {
      ...s.contactVerificationStates,
      [userId]: entry,
    },
  }));
}

// ---------- Group Key Change Warning Reducers ----------

export function setGroupKeyChangeWarning(
  global: any,
  chatId: string,
  hasWarning: boolean,
  changedUserIds: string[],
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    hasGroupKeyChangeWarning: hasWarning,
    groupKeyChangeUserIds: changedUserIds,
  }));
}

export function setReducedSecurity(
  global: any,
  chatId: string,
  hasReducedSecurity: boolean,
): any {
  return setChatEncryptionState(global, chatId, (chatState) => ({
    ...chatState,
    hasReducedSecurity,
  }));
}

/**
 * TeleBridge — Reducers
 *
 * Pure state update functions for the TeleBridge global state slice.
 */

import type {
  BridgeState, ChatEncryptionState, EncryptionStatus, GroupEncryptionStatus, KeyExchangeState, TeleBridgeState,
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

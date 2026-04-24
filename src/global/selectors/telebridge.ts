/**
 * TeleBridge — Selectors
 *
 * Pure functions to select from TeleBridge global state.
 */

import type { BridgeState, ChatEncryptionState, EncryptionStatus, TeleBridgeState } from '../../telebridge/state';

import { INITIAL_TELEBRIDGE_STATE } from '../../telebridge/state';

export function selectTeleBridgeState(global: { telebridge?: TeleBridgeState }): TeleBridgeState {
  return global.telebridge ?? INITIAL_TELEBRIDGE_STATE;
}

export function selectIsBridgeUnlocked(global: { telebridge?: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).bridgeState === 'unlocked';
}

export function selectHasBridgePassword(global: { telebridge?: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).hasPassword;
}

export function selectBridgeState(global: { telebridge?: TeleBridgeState }): BridgeState {
  return selectTeleBridgeState(global).bridgeState;
}

export function selectTeleBridgeIdentity(global: { telebridge?: TeleBridgeState }): {
  ed25519PublicKey?: string;
  x25519PublicKey?: string;
} {
  const state = selectTeleBridgeState(global);
  return {
    ed25519PublicKey: state.ed25519PublicKey,
    x25519PublicKey: state.x25519PublicKey,
  };
}

export function selectTeleBridgeError(global: { telebridge?: TeleBridgeState }): string | undefined {
  return selectTeleBridgeState(global).errorKey;
}

export function selectIsRecoveryPhraseVerified(global: { telebridge?: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).isRecoveryPhraseVerified ?? false;
}

export function selectChatEncryptionState(
  global: { telebridge?: TeleBridgeState },
  chatId: string,
): ChatEncryptionState | undefined {
  return selectTeleBridgeState(global).chatEncryptionStates[chatId];
}

export function selectChatEncryptionStatus(
  global: { telebridge?: TeleBridgeState },
  chatId: string,
): EncryptionStatus {
  const state = selectChatEncryptionState(global, chatId);
  return state?.status ?? 'notEncrypted';
}

export function selectIsKeyExchangeInProgress(
  global: { telebridge?: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  return state?.keyExchangeState === 'inProgress';
}

export function selectHasEstablishedChatKey(
  global: { telebridge?: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  if (!state) return false;
  return state.keyExchangeState === 'complete'
    && (state.status === 'encrypted' || state.status === 'verified' || state.status === 'secured');
}

export function selectShouldShowStartEncryptedBanner(
  global: { telebridge?: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  return state?.showStartEncryptedBanner ?? true;
}

export function selectDefaultEncryptNewChats(global: { telebridge?: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).defaultEncryptNewChats ?? false;
}

export function selectTofuAutoAcceptEnabled(global: { telebridge?: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).tofuAutoAcceptEnabled ?? true;
}

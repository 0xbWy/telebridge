/**
 * TeleBridge — Selectors
 *
 * Pure functions to select from TeleBridge global state.
 */

import type { BridgeState, TeleBridgeState } from '../../telebridge/state';

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

/**
 * TeleBridge — Reducers
 *
 * Pure state update functions for the TeleBridge global state slice.
 */

import type { BridgeState, TeleBridgeState } from '../../telebridge/state';

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

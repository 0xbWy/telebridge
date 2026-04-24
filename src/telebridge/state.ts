/**
 * TeleBridge — State Management
 *
 * Global state slice for TeleBridge encryption.
 * Password is NEVER stored in global state (V1 Bug #8 guard).
 */

// ---------- Bridge State Types ----------

export type BridgeState = 'locked' | 'unlocking' | 'unlocked' | 'error';

export interface TeleBridgeState {
  /** Whether the bridge has a password set (persisted). */
  hasPassword: boolean;
  /** Current bridge lock state. */
  bridgeState: BridgeState;
  /** Ed25519 public key (base64), persistable. */
  ed25519PublicKey?: string;
  /** X25519 public key (base64), persistable. */
  x25519PublicKey?: string;
  /** Error message key for UI display. */
  errorKey?: string;
  /** Whether recovery phrase has been verified. */
  isRecoveryPhraseVerified?: boolean;
}

export const INITIAL_TELEBRIDGE_STATE: TeleBridgeState = {
  hasPassword: false,
  bridgeState: 'locked',
};

// ---------- Selectors ----------

export function selectTeleBridgeState(global: { telebridge: TeleBridgeState }): TeleBridgeState {
  return global.telebridge ?? INITIAL_TELEBRIDGE_STATE;
}

export function selectIsBridgeUnlocked(global: { telebridge: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).bridgeState === 'unlocked';
}

export function selectHasBridgePassword(global: { telebridge: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).hasPassword;
}

export function selectBridgeState(global: { telebridge: TeleBridgeState }): BridgeState {
  return selectTeleBridgeState(global).bridgeState;
}

export function selectTeleBridgeIdentity(global: { telebridge: TeleBridgeState }): {
  ed25519PublicKey?: string;
  x25519PublicKey?: string;
} {
  const state = selectTeleBridgeState(global);
  return {
    ed25519PublicKey: state.ed25519PublicKey,
    x25519PublicKey: state.x25519PublicKey,
  };
}

export function selectTeleBridgeError(global: { telebridge: TeleBridgeState }): string | undefined {
  return selectTeleBridgeState(global).errorKey;
}

export function selectIsRecoveryPhraseVerified(global: { telebridge: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).isRecoveryPhraseVerified ?? false;
}

// ---------- Reducers ----------

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
    bridgeState: 'error' as BridgeState,
    errorKey,
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

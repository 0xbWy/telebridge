/**
 * TeleBridge — State Management
 *
 * Global state slice for TeleBridge encryption.
 * Password is NEVER stored in global state (V1 Bug #8 guard).
 */

// ---------- Encryption State Types ----------

/** Per-chat encryption status (5 states for the indicator emoji). */
export type EncryptionStatus = 'encrypted' | 'notEncrypted' | 'verified' | 'keyChanged' | 'secured';

/** Group encryption status — reflects the overall state of encryption in a group. */
export type GroupEncryptionStatus = 'locked' | 'warning' | 'transitional' | 'notEncrypted';

/** Key exchange states for a chat. */
export type KeyExchangeState = 'idle' | 'inProgress' | 'complete' | 'failed';

/** Per-chat encryption metadata. */
export interface ChatEncryptionState {
  /** Chat ID this state belongs to. */
  chatId: string;
  /** Current encryption status indicator. */
  status: EncryptionStatus;
  /** Key exchange state for this chat. */
  keyExchangeState: KeyExchangeState;
  /** Safety number (grouped numeric fingerprint). */
  safetyNumber?: string;
  /** Whether key change has been acknowledged by user. */
  isKeyChangeAcknowledged?: boolean;
  /** TOFU auto-accepted key info. */
  tofuAutoAccepted?: {
    contactName: string;
    timestamp: number;
  };
  /** Whether "Start Encrypted Chat" banner should be shown. */
  showStartEncryptedBanner?: boolean;
  /** Timestamp of last key exchange. */
  lastKeyExchangeAt?: number;
  /** Number of messages sent with current key. */
  messageCount?: number;
  /** Whether this is a group chat with encryption. */
  isGroupChat?: boolean;
  /** Group encryption status (for group chats). */
  groupEncryptionStatus?: GroupEncryptionStatus;
}

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
  /** Per-chat encryption states, indexed by chatId. */
  chatEncryptionStates: Record<string, ChatEncryptionState>;
  /** Whether to encrypt new chats by default. */
  defaultEncryptNewChats?: boolean;
  /** Whether TOFU auto-accept is enabled (default: true). */
  tofuAutoAcceptEnabled?: boolean;
  /** Key rotation threshold: number of messages. */
  keyRotationMessages?: number;
  /** Key rotation threshold: number of days. */
  keyRotationDays?: number;
}

export const INITIAL_TELEBRIDGE_STATE: TeleBridgeState = {
  hasPassword: false,
  bridgeState: 'locked',
  chatEncryptionStates: {},
  tofuAutoAcceptEnabled: true,
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

export function selectChatEncryptionState(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): ChatEncryptionState | undefined {
  return selectTeleBridgeState(global).chatEncryptionStates[chatId];
}

export function selectChatEncryptionStatus(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): EncryptionStatus {
  const state = selectChatEncryptionState(global, chatId);
  return state?.status ?? 'notEncrypted';
}

export function selectIsKeyExchangeInProgress(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  return state?.keyExchangeState === 'inProgress';
}

export function selectHasEstablishedChatKey(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  if (!state) return false;
  return state.keyExchangeState === 'complete'
    && (state.status === 'encrypted' || state.status === 'verified' || state.status === 'secured');
}

export function selectGroupEncryptionStatus(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): GroupEncryptionStatus | undefined {
  return selectChatEncryptionState(global, chatId)?.groupEncryptionStatus;
}

export function selectIsGroupChat(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): boolean {
  return selectChatEncryptionState(global, chatId)?.isGroupChat ?? false;
}

export function selectShouldShowStartEncryptedBanner(
  global: { telebridge: TeleBridgeState },
  chatId: string,
): boolean {
  const state = selectChatEncryptionState(global, chatId);
  return state?.showStartEncryptedBanner ?? true;
}

export function selectDefaultEncryptNewChats(global: { telebridge: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).defaultEncryptNewChats ?? false;
}

export function selectTofuAutoAcceptEnabled(global: { telebridge: TeleBridgeState }): boolean {
  return selectTeleBridgeState(global).tofuAutoAcceptEnabled ?? true;
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

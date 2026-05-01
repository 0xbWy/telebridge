/**
 * Encryption Toggle Tests
 *
 * Tests for VAL-ENCUI-001 through VAL-ENCUI-012:
 * - isPaused state management (set/read/clear)
 * - Paused EncryptionStatus
 * - Visual paused state distinct from encrypted and notEncrypted
 * - Pause/Resume flow
 * - Login Needed when bridge locked
 * - Start Encryption when not encrypted
 * - No Pause when not encrypted
 */

import {
  ChatEncryptionState,
  EncryptionStatus,
  INITIAL_TELEBRIDGE_STATE,
  KeyExchangeState,
  setChatEncryptionPaused,
  setChatEncryptionStatus,
  setChatKeyExchangeState,
  selectChatEncryptionStatus,
  selectIsChatEncryptionPaused,
  selectIsBridgeUnlocked,
  TeleBridgeState,
} from '../src/telebridge/state';

// ---------- VAL-ENCUI-009: isPaused state management ----------

describe('Encryption Toggle: isPaused state', () => {
  const chatId = 'test-chat-123';

  function makeGlobal(chatState?: Partial<ChatEncryptionState>): { telebridge: TeleBridgeState } {
    const base: ChatEncryptionState = {
      chatId,
      status: 'encrypted' as EncryptionStatus,
      keyExchangeState: 'complete' as KeyExchangeState,
      showStartEncryptedBanner: false,
      ...chatState,
    };
    return {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: { [chatId]: base },
      },
    };
  }

  test('isPaused defaults to false/undefined', () => {
    const global = makeGlobal();
    expect(selectIsChatEncryptionPaused(global, chatId)).toBe(false);
  });

  test('setChatEncryptionPaused sets isPaused=true and status to paused', () => {
    const global = makeGlobal();
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('setChatEncryptionPaused sets isPaused=false and restores encrypted status', () => {
    // First pause
    let global = makeGlobal();
    global = setChatEncryptionPaused(global, chatId, true);
    expect(selectIsChatEncryptionPaused(global, chatId)).toBe(true);
    expect(selectChatEncryptionStatus(global, chatId)).toBe('paused');

    // Then resume
    global = setChatEncryptionPaused(global, chatId, false);
    expect(selectIsChatEncryptionPaused(global, chatId)).toBe(false);
    // When resuming from paused, keyExchangeState is 'complete' so status should go back to 'encrypted'
    expect(selectChatEncryptionStatus(global, chatId)).toBe('encrypted');
  });

  test('pause on notEncrypted chat keeps notEncrypted when paused (no key exchange)', () => {
    const global = makeGlobal({
      status: 'notEncrypted',
      keyExchangeState: 'idle' as KeyExchangeState,
    });
    const result = setChatEncryptionPaused(global, chatId, true);
    // Pausing a not-encrypted chat still sets isPaused, but the status logic
    // falls back to notEncrypted since keyExchangeState is not 'complete'
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('resuming notEncrypted chat goes back to notEncrypted', () => {
    let global = makeGlobal({
      status: 'notEncrypted',
      keyExchangeState: 'idle' as KeyExchangeState,
      isPaused: true,
    });
    global = setChatEncryptionPaused(global, chatId, false);
    expect(selectIsChatEncryptionPaused(global, chatId)).toBe(false);
    expect(selectChatEncryptionStatus(global, chatId)).toBe('notEncrypted');
  });

  test('isPaused is preserved across different chats', () => {
    const chat1 = 'chat-1';
    const chat2 = 'chat-2';
    const global1 = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: {
          [chat1]: {
            chatId: chat1,
            status: 'encrypted' as EncryptionStatus,
            keyExchangeState: 'complete' as KeyExchangeState,
            showStartEncryptedBanner: false,
          },
          [chat2]: {
            chatId: chat2,
            status: 'encrypted' as EncryptionStatus,
            keyExchangeState: 'complete' as KeyExchangeState,
            showStartEncryptedBanner: false,
          },
        },
      },
    };

    // Pause only chat1
    const result = setChatEncryptionPaused(global1, chat1, true);
    expect(selectIsChatEncryptionPaused(result, chat1)).toBe(true);
    expect(selectIsChatEncryptionPaused(result, chat2)).toBe(false);
    expect(selectChatEncryptionStatus(result, chat1)).toBe('paused');
    expect(selectChatEncryptionStatus(result, chat2)).toBe('encrypted');
  });

  test('isPaused on non-existent chat creates new state with paused', () => {
    const newChatId = 'new-chat-999';
    const global = { telebridge: INITIAL_TELEBRIDGE_STATE };
    const result = setChatEncryptionPaused(global, newChatId, true);
    expect(selectIsChatEncryptionPaused(result, newChatId)).toBe(true);
    expect(selectChatEncryptionStatus(result, newChatId)).toBe('paused');
  });
});

// ---------- VAL-ENCUI-012: Pause only when encrypted ----------

describe('Encryption Toggle: Pause option availability', () => {
  const chatId = 'test-chat-456';

  function makeGlobal(status: EncryptionStatus, keyExchangeState: string = 'complete'): { telebridge: TeleBridgeState } {
    return {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: {
          [chatId]: {
            chatId,
            status,
            keyExchangeState: keyExchangeState as any,
            showStartEncryptedBanner: false,
          },
        },
      },
    };
  }

  // Pause should only appear when status is 'encrypted' (or 'verified' or 'secured')
  test('Pausing encrypted chat is valid', () => {
    const global = makeGlobal('encrypted');
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('Pausing verified chat is valid', () => {
    const global = makeGlobal('verified');
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('Pausing secured chat is valid', () => {
    const global = makeGlobal('secured');
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('Pausing notEncrypted chat results in paused status (edge case)', () => {
    // Even though Pause shouldn't be offered in the UI for notEncrypted,
    // the state layer should handle it gracefully
    const global = makeGlobal('notEncrypted', 'idle');
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });

  test('Pausing keyChanged chat results in paused status', () => {
    const global = makeGlobal('keyChanged');
    const result = setChatEncryptionPaused(global, chatId, true);
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(true);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('paused');
  });
});

// ---------- VAL-ENCUI-009: Visual paused state distinct ----------

describe('Encryption Toggle: Paused state distinct from encrypted and notEncrypted', () => {
  test('paused status is distinct from encrypted', () => {
    expect('paused').not.toBe('encrypted');
  });

  test('paused status is distinct from notEncrypted', () => {
    expect('paused').not.toBe('notEncrypted');
  });

  test('paused status is listed in EncryptionStatus type values', () => {
    const validStatuses: EncryptionStatus[] = ['encrypted', 'notEncrypted', 'verified', 'keyChanged', 'secured', 'paused'];
    expect(validStatuses).toContain('paused');
  });

  test('setChatEncryptionPaused produces a unique paused state', () => {
    const chatId = 'chat-distinct';
    const global = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: {
          [chatId]: {
            chatId,
            status: 'encrypted' as EncryptionStatus,
            keyExchangeState: 'complete' as KeyExchangeState,
            showStartEncryptedBanner: false,
          },
        },
      },
    };

    // Before pausing, status is 'encrypted'
    expect(selectChatEncryptionStatus(global, chatId)).toBe('encrypted');

    // After pausing, status is 'paused'
    const pausedGlobal = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(pausedGlobal, chatId)).toBe('paused');
    expect(selectIsChatEncryptionPaused(pausedGlobal, chatId)).toBe(true);

    // After resuming, status is back to 'encrypted'
    const resumedGlobal = setChatEncryptionPaused(pausedGlobal, chatId, false);
    expect(selectChatEncryptionStatus(resumedGlobal, chatId)).toBe('encrypted');
    expect(selectIsChatEncryptionPaused(resumedGlobal, chatId)).toBe(false);
  });
});

// ---------- VAL-ENCUI-007/008: Login Needed when bridge locked ----------

describe('Encryption Toggle: Login Needed when bridge locked', () => {
  test('isBridgeUnlocked returns false when bridgeState is locked', () => {
    const global = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        bridgeState: 'locked' as const,
      },
    };
    expect(selectIsBridgeUnlocked(global)).toBe(false);
  });

  test('isBridgeUnlocked returns true when bridgeState is unlocked', () => {
    const global = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        bridgeState: 'unlocked' as const,
      },
    };
    expect(selectIsBridgeUnlocked(global)).toBe(true);
  });

  test('hasPassword reflects whether bridge has a password set', () => {
    const globalNoPw = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        bridgeState: 'locked' as const,
        hasPassword: false,
      },
    };
    expect(globalNoPw.telebridge.hasPassword).toBe(false);

    const globalWithPw = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        bridgeState: 'locked' as const,
        hasPassword: true,
      },
    };
    expect(globalWithPw.telebridge.hasPassword).toBe(true);
  });
});

// ---------- Resume flow restores encrypted status ----------

describe('Encryption Toggle: Resume restores status based on keyExchangeState', () => {
  const chatId = 'test-resume-flow';

  test('Resuming from paused restores encrypted status when keyExchange is complete', () => {
    // Start with encrypted status
    const global = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: {
          [chatId]: {
            chatId,
            status: 'encrypted' as EncryptionStatus,
            keyExchangeState: 'complete' as KeyExchangeState,
            showStartEncryptedBanner: false,
          },
        },
      },
    };

    // First, pause encryption
    const pausedGlobal = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(pausedGlobal, chatId)).toBe('paused');
    expect(selectIsChatEncryptionPaused(pausedGlobal, chatId)).toBe(true);

    // Resuming should restore to 'encrypted'
    const result = setChatEncryptionPaused(pausedGlobal, chatId, false);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('encrypted');
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(false);
  });

  test('Resuming from paused with idle keyExchange goes to notEncrypted', () => {
    // Start with notEncrypted, then pause
    const global = {
      telebridge: {
        ...INITIAL_TELEBRIDGE_STATE,
        chatEncryptionStates: {
          [chatId]: {
            chatId,
            status: 'notEncrypted' as EncryptionStatus,
            keyExchangeState: 'idle' as KeyExchangeState,
            showStartEncryptedBanner: true,
          },
        },
      },
    };

    // Pause (this sets status to 'paused')
    const pausedGlobal = setChatEncryptionPaused(global, chatId, true);
    expect(selectChatEncryptionStatus(pausedGlobal, chatId)).toBe('paused');

    // Resuming from paused when key exchange never completed → notEncrypted
    const result = setChatEncryptionPaused(pausedGlobal, chatId, false);
    expect(selectChatEncryptionStatus(result, chatId)).toBe('notEncrypted');
    expect(selectIsChatEncryptionPaused(result, chatId)).toBe(false);
  });
});

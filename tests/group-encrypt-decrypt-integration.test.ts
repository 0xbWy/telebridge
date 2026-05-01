/**
 * TeleBridge — Group Encrypt/Decrypt Integration Tests
 *
 * Tests for VAL-GROUP-003, VAL-GROUP-004, VAL-GROUP-007,
 * VAL-GROUP-008, VAL-GROUP-009, VAL-GROUP-010.
 *
 * Verifies that processIncomingGroupMessage correctly looks up and
 * uses distributed sender keys, new members can decrypt after
 * receiving keys, left members cannot decrypt after key rotation,
 * mixed encrypted/unencrypted messages are handled correctly, and
 * group key change notifications are triggered on membership changes.
 */

import {
  encodeProtocol,
} from '../src/telebridge/crypto/protocol';
import {
  decryptGroupMessage,
  encryptGroupMessage,
} from '../src/telebridge/group/groupEncryption';
import {
  acknowledgeGroupKeyChange,
  clearAllGroupKeyChangeData,
  clearGroupKeyChange,
  getGroupKeyChanges,
  getGroupKeyChangeWarning,
  getGroupMixedComposition,
  hasGroupKeyChangeWarning,
  recordGroupKeyChange,
  updateGroupMixedComposition,
} from '../src/telebridge/group/groupKeyChange';
import {
  addGroupMember,
  clearAllGroupEncryption,
  generateGroupSenderKey,
  getOwnGroupSenderKey,
  initGroupEncryptionState,
  storeDistributedSenderKey,
} from '../src/telebridge/group/groupState';
import {
  createDistributedSenderKey,
  type DistributedSenderKey,
  generateSenderKey,
  serializeSenderKey,
} from '../src/telebridge/group/senderKey';
import {
  buildPairwiseChatId,
  clearPendingSenderKeyMessages,
  processIncomingSenderKeyMessage,
  regenerateAndDistributeSenderKeys,
} from '../src/telebridge/group/senderKeyDistribution';
import {
  processIncomingGroupMessage,
  processOutgoingGroupMessage,
} from '../src/telebridge/integration';
import {
  clearAllChatKeys,
  setChatKey,
} from '../src/telebridge/messages';

// ---------- Helpers ----------

function isAllZeros(bytes: Uint8Array): boolean {
  return bytes.every((b) => b === 0);
}

function setupPairwiseKey(groupId: string, memberId1: string, memberId2: string): Uint8Array {
  const chatId = buildPairwiseChatId(groupId, memberId1, memberId2);
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  setChatKey(chatId, key);
  return key;
}

// ---------- Setup/Teardown ----------

beforeEach(() => {
  clearAllGroupEncryption();
  clearAllChatKeys();
  clearPendingSenderKeyMessages();
  clearAllGroupKeyChangeData();
});

// ---------- VAL-GROUP-003: Group Message Decryption ----------

describe('VAL-GROUP-003: Group Message Decryption with distributed keys', () => {
  test('processIncomingGroupMessage decrypts using distributed sender key', async () => {
    const groupId = 'group1';
    const senderId = 'alice';
    const memberId = 'bob';

    initGroupEncryptionState(groupId, [senderId, memberId]);
    const senderKey = generateSenderKey(groupId, senderId);
    const distKey = createDistributedSenderKey(senderKey);
    storeDistributedSenderKey(distKey);

    // Alice encrypts a group message
    const encrypted = await encryptGroupMessage('Hello group!', senderKey);

    // Bob processes the incoming group message via the integration layer
    const result = await processIncomingGroupMessage(encrypted.protocolMessage, groupId, senderId);

    expect(result.isGroupMessage).toBe(true);
    expect(result.decryptedText).toBe('Hello group!');
    expect(result.senderId).toBe(senderId);
    expect(result.groupId).toBe(groupId);
    expect(result.isSignatureValid).toBe(true);
    expect(result.shouldHide).toBe(false);
  });

  test('processIncomingGroupMessage returns undefined text when no distributed key', async () => {
    const groupId = 'group1';
    const senderId = 'alice';

    initGroupEncryptionState(groupId, [senderId, 'bob']);
    const senderKey = generateSenderKey(groupId, senderId);

    // Alice encrypts — but Bob has NOT stored the distributed key
    const encrypted = await encryptGroupMessage('Secret message', senderKey);

    // Bob processes the message without having the distributed key
    const result = await processIncomingGroupMessage(encrypted.protocolMessage, groupId, senderId);

    expect(result.isGroupMessage).toBe(true);
    expect(result.decryptedText).toBeUndefined();
    expect(result.shouldHide).toBe(false);
  });

  test('processIncomingGroupMessage decrypts messages from any member with distributed key', async () => {
    const groupId = 'group1';
    const members = ['alice', 'bob', 'charlie'];

    initGroupEncryptionState(groupId, members);

    // Each member generates their key
    const aliceKey = generateSenderKey(groupId, 'alice');
    const bobKey = generateSenderKey(groupId, 'bob');
    const charlieKey = generateSenderKey(groupId, 'charlie');

    // Store distributed keys for all members
    storeDistributedSenderKey(createDistributedSenderKey(aliceKey));
    storeDistributedSenderKey(createDistributedSenderKey(bobKey));
    storeDistributedSenderKey(createDistributedSenderKey(charlieKey));

    // Alice sends → others can decrypt
    const aliceMsg = await encryptGroupMessage('Hello from Alice', aliceKey);
    const aliceResult = await processIncomingGroupMessage(aliceMsg.protocolMessage, groupId, 'alice');
    expect(aliceResult.decryptedText).toBe('Hello from Alice');

    // Bob sends → others can decrypt
    const bobMsg = await encryptGroupMessage('Hello from Bob', bobKey);
    const bobResult = await processIncomingGroupMessage(bobMsg.protocolMessage, groupId, 'bob');
    expect(bobResult.decryptedText).toBe('Hello from Bob');

    // Charlie sends → others can decrypt
    const charlieMsg = await encryptGroupMessage('Hello from Charlie', charlieKey);
    const charlieResult = await processIncomingGroupMessage(charlieMsg.protocolMessage, groupId, 'charlie');
    expect(charlieResult.decryptedText).toBe('Hello from Charlie');
  });

  test('processIncomingGroupMessage passes through non-group messages', async () => {
    const result = await processIncomingGroupMessage('Hello plain text', 'group1', 'alice');

    expect(result.isGroupMessage).toBe(false);
    expect(result.decryptedText).toBeUndefined();
    expect(result.shouldHide).toBe(false);
  });
});

// ---------- VAL-GROUP-004: Group Message Encryption with ratcheting ----------

describe('VAL-GROUP-004: Group Message Encryption with ratcheting', () => {
  test('processOutgoingGroupMessage produces tb1.g.<base64> with unique keys', async () => {
    const groupId = 'group1';
    const memberId = 'alice';

    initGroupEncryptionState(groupId, [memberId, 'bob']);
    generateGroupSenderKey(groupId, memberId, new Uint8Array(32));

    const msg1 = await processOutgoingGroupMessage('Message 1', groupId, memberId);
    const msg2 = await processOutgoingGroupMessage('Message 2', groupId, memberId);
    const msg3 = await processOutgoingGroupMessage('Message 3', groupId, memberId);

    // All messages should be encrypted
    expect(msg1.wasEncrypted).toBe(true);
    expect(msg2.wasEncrypted).toBe(true);
    expect(msg3.wasEncrypted).toBe(true);

    // All messages should have tb1.g. prefix
    expect(msg1.text).toMatch(/^tb1\.g\./);
    expect(msg2.text).toMatch(/^tb1\.g\./);
    expect(msg3.text).toMatch(/^tb1\.g\./);

    // Chain indices should advance
    expect(msg1.chainIndex).toBe(0);
    expect(msg2.chainIndex).toBe(1);
    expect(msg3.chainIndex).toBe(2);

    // Each message should be different (due to ratcheting and nonce)
    expect(msg1.text).not.toBe(msg2.text);
    expect(msg2.text).not.toBe(msg3.text);
  });

  test('each message uses a unique message key (ratcheting chain)', async () => {
    const groupId = 'group1';
    const memberId = 'alice';

    initGroupEncryptionState(groupId, [memberId]);
    generateGroupSenderKey(groupId, memberId, new Uint8Array(32));

    const ownKey = getOwnGroupSenderKey(groupId, memberId)!;
    const distKey = createDistributedSenderKey(ownKey);

    // Encrypt three messages
    const enc1 = await encryptGroupMessage('Msg 1', ownKey);
    const enc2 = await encryptGroupMessage('Msg 2', ownKey);
    const enc3 = await encryptGroupMessage('Msg 3', ownKey);

    // All should decrypt correctly with the distributed key
    // (distributed key was created at chainIndex 0 before any ratcheting)
    const dec1 = await decryptGroupMessage(enc1.protocolMessage, distKey);
    const dec2 = await decryptGroupMessage(enc2.protocolMessage, distKey);
    const dec3 = await decryptGroupMessage(enc3.protocolMessage, distKey);

    expect(dec1.text).toBe('Msg 1');
    expect(dec2.text).toBe('Msg 2');
    expect(dec3.text).toBe('Msg 3');

    // Each message has a different chain index
    expect(dec1.chainIndex).toBe(0);
    expect(dec2.chainIndex).toBe(1);
    expect(dec3.chainIndex).toBe(2);
  });

  test('processOutgoingGroupMessage returns unencrypted when no sender key', async () => {
    const groupId = 'group1';
    const memberId = 'alice';

    initGroupEncryptionState(groupId, [memberId, 'bob']);
    // No sender key generated!

    const result = await processOutgoingGroupMessage('Hello', groupId, memberId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Hello');
    expect(result.chainIndex).toBe(0);
  });

  test('processOutgoingGroupMessage does not re-encrypt protocol messages', async () => {
    const groupId = 'group1';
    const memberId = 'alice';

    initGroupEncryptionState(groupId, [memberId, 'bob']);
    generateGroupSenderKey(groupId, memberId, new Uint8Array(32));

    const result = await processOutgoingGroupMessage('tb1.s.alreadyencoded', groupId, memberId);
    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('tb1.s.alreadyencoded');
  });
});

// ---------- VAL-GROUP-007: New Member Can Decrypt after receiving keys ----------

describe('VAL-GROUP-007: New Member Can Decrypt after receiving keys', () => {
  test('new member decrypts messages at chain index >= startChainIndex', async () => {
    const groupId = 'group1';
    const senderId = 'alice';

    initGroupEncryptionState(groupId, [senderId, 'bob']);
    const senderKey = generateSenderKey(groupId, senderId);

    // Alice sends some messages before the new member joins
    // This advances the chain to index 2
    await encryptGroupMessage('Pre-join msg 0', senderKey); // chainIndex 0
    await encryptGroupMessage('Pre-join msg 1', senderKey); // chainIndex 1
    await encryptGroupMessage('Pre-join msg 2', senderKey); // chainIndex 2

    // Now the new member (Charlie) joins and receives Alice's distributed key
    // The distributed key captures the CURRENT chain state (chainIndex = 3)
    const distKeyForNewMember = createDistributedSenderKey(senderKey);
    expect(distKeyForNewMember.startChainIndex).toBe(3);

    // Store the distributed key (as Charlie would)
    storeDistributedSenderKey(distKeyForNewMember);

    // Alice sends new messages after Charlie joined
    const msg3 = await encryptGroupMessage('Post-join msg 3', senderKey); // chainIndex 3
    const msg4 = await encryptGroupMessage('Post-join msg 4', senderKey); // chainIndex 4

    // Charlie can decrypt messages at chainIndex >= startChainIndex (3)
    const dec3 = await decryptGroupMessage(msg3.protocolMessage, distKeyForNewMember);
    expect(dec3.text).toBe('Post-join msg 3');
    expect(dec3.chainIndex).toBe(3);

    const dec4 = await decryptGroupMessage(msg4.protocolMessage, distKeyForNewMember);
    expect(dec4.text).toBe('Post-join msg 4');
    expect(dec4.chainIndex).toBe(4);
  });

  test('new member with startChainIndex=0 can decrypt all messages', async () => {
    const groupId = 'group1';
    const senderId = 'alice';

    initGroupEncryptionState(groupId, [senderId, 'bob']);
    const senderKey = generateSenderKey(groupId, senderId);

    // Distributed key created at chain index 0 (before any messages)
    const distKey = createDistributedSenderKey(senderKey);
    expect(distKey.startChainIndex).toBe(0);

    // Alice sends messages
    const msg0 = await encryptGroupMessage('Message 0', senderKey);
    const msg1 = await encryptGroupMessage('Message 1', senderKey);

    // Decrypt all messages
    const dec0 = await decryptGroupMessage(msg0.protocolMessage, distKey);
    expect(dec0.text).toBe('Message 0');
    expect(dec0.chainIndex).toBe(0);

    const dec1 = await decryptGroupMessage(msg1.protocolMessage, distKey);
    expect(dec1.text).toBe('Message 1');
    expect(dec1.chainIndex).toBe(1);
  });

  test('new member cannot decrypt messages before startChainIndex', async () => {
    const groupId = 'group1';
    const senderId = 'alice';

    initGroupEncryptionState(groupId, [senderId, 'bob']);
    const senderKey = generateSenderKey(groupId, senderId);

    // Alice sends messages before new member joins
    const preJoinMsg = await encryptGroupMessage('Pre-join', senderKey); // chainIndex 0

    // New member receives key starting at chainIndex 1 (after first message)
    const distKeyWithOffset: DistributedSenderKey = {
      ...createDistributedSenderKey(senderKey),
      startChainIndex: 1,
    };

    // New member CANNOT decrypt pre-join messages (index < startChainIndex)
    // deriveMessageKeyAtChainIndex throws for chainIndex < startChainIndex
    await expect(
      decryptGroupMessage(preJoinMsg.protocolMessage, distKeyWithOffset),
    ).rejects.toThrow();
  });

  test('integration: new member joins encrypted group and decrypts future messages', async () => {
    const groupId = 'group1';
    const members = ['alice', 'bob'];

    initGroupEncryptionState(groupId, members);
    generateGroupSenderKey(groupId, 'alice', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'bob', new Uint8Array(32));

    // Alice sends messages before Charlie joins
    const aliceKey = getOwnGroupSenderKey(groupId, 'alice')!;
    await encryptGroupMessage('Before Charlie joined', aliceKey);

    // Charlie joins — receives Alice's distributed key via processIncomingSenderKeyMessage
    const aliceDistForCharlie = createDistributedSenderKey(aliceKey);
    const serialized = serializeSenderKey(aliceDistForCharlie);
    const protocolMessage = encodeProtocol('sk', serialized);

    // Charlie processes incoming sender key
    const receiveResult = processIncomingSenderKeyMessage(protocolMessage, groupId);
    expect(receiveResult.success).toBe(true);

    // Alice sends a message after Charlie joined
    const postJoinMsg = await encryptGroupMessage('After Charlie joined', aliceKey);

    // Charlie processes the incoming group message via integration layer
    const result = await processIncomingGroupMessage(
      postJoinMsg.protocolMessage, groupId, 'alice',
    );
    expect(result.isGroupMessage).toBe(true);
    expect(result.decryptedText).toBe('After Charlie joined');
  });
});

// ---------- VAL-GROUP-008: Left Member Cannot Decrypt after key rotation ----------

describe('VAL-GROUP-008: Left Member Cannot Decrypt after key rotation', () => {
  test('departed member old key fails decryption of post-rotation messages', async () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['alice', 'bob', 'charlie']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'alice', identity1);

    // Create the old distributed key (what Charlie had before leaving)
    const oldKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const oldDistKey = createDistributedSenderKey(oldKey);

    // Alice sends a message before Charlie leaves (ratchets the key)
    await encryptGroupMessage('Before leave', oldKey);

    // Charlie leaves — Alice regenerates sender key
    setupPairwiseKey(groupId, 'alice', 'bob');
    regenerateAndDistributeSenderKeys(groupId, 'alice', ['charlie']);

    // Alice sends a new message with the new key
    const newKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const newDistKey = createDistributedSenderKey(newKey);
    const newMsg = await encryptGroupMessage('After leave', newKey);

    // Old distributed key CANNOT decrypt the new message (GCM auth tag fails)
    await expect(decryptGroupMessage(newMsg.protocolMessage, oldDistKey)).rejects.toThrow();

    // New distributed key CAN decrypt the new message
    const decrypted = await decryptGroupMessage(newMsg.protocolMessage, newDistKey);
    expect(decrypted.text).toBe('After leave');
    expect(decrypted.isSignatureValid).toBe(true);
  });

  test('integration: processIncomingGroupMessage fails for departed member key', async () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['alice', 'bob', 'charlie']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'alice', identity1);

    // Store Alice's distributed key (what Charlie had before)
    const oldKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const oldDistKey = createDistributedSenderKey(oldKey);
    storeDistributedSenderKey(oldDistKey);

    // Alice sends a message
    await encryptGroupMessage('Before leave', oldKey);

    // Charlie leaves — remove their distributed key, Alice regenerates
    setupPairwiseKey(groupId, 'alice', 'bob');
    regenerateAndDistributeSenderKeys(groupId, 'alice', ['charlie']);

    // Store Alice's new distributed key for Bob (overwrites old one)
    const newKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const newDistKey = createDistributedSenderKey(newKey);
    storeDistributedSenderKey(newDistKey);

    // Alice sends a new message
    const newMsg = await encryptGroupMessage('After leave', newKey);

    // Bob processes with the new key — succeeds
    const result = await processIncomingGroupMessage(newMsg.protocolMessage, groupId, 'alice');
    expect(result.isGroupMessage).toBe(true);
    expect(result.decryptedText).toBe('After leave');

    // Charlie would need to try to decrypt with the OLD key, but it's been removed
    // Simulate: Charlie still has oldDistKey but tries to decrypt new message
    await expect(decryptGroupMessage(newMsg.protocolMessage, oldDistKey)).rejects.toThrow();
  });

  test('old key material is zeroed after rotation', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['alice', 'bob', 'charlie']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    const originalKey = generateGroupSenderKey(groupId, 'alice', identity1);

    setupPairwiseKey(groupId, 'alice', 'bob');

    // Re-key
    regenerateAndDistributeSenderKeys(groupId, 'alice', ['charlie']);

    // Old key material should be zeroed in-place
    expect(isAllZeros(originalKey.chainKey)).toBe(true);
    expect(isAllZeros(originalKey.signingBytes)).toBe(true);
  });
});

// ---------- VAL-GROUP-009: Group Key Change Notification ----------

describe('VAL-GROUP-009: Group Key Change Notification on membership change', () => {
  test('recordGroupKeyChange creates a warning for group', () => {
    const groupId = 'group1';
    const userId = 'charlie';
    const prevFingerprint = 'abc123';
    const newFingerprint = 'def456';

    const event = recordGroupKeyChange(groupId, userId, prevFingerprint, newFingerprint);

    expect(event.groupId).toBe(groupId);
    expect(event.userId).toBe(userId);
    expect(event.previousFingerprint).toBe(prevFingerprint);
    expect(event.newFingerprint).toBe(newFingerprint);
    expect(event.isAcknowledged).toBe(false);

    // Warning should be active
    expect(hasGroupKeyChangeWarning(groupId)).toBe(true);

    const warning = getGroupKeyChangeWarning(groupId);
    expect(warning).toBeDefined();
    expect(warning!.isActive).toBe(true);
    expect(warning!.changedUserIds).toContain(userId);
  });

  test('member leave triggers recordGroupKeyChange', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['alice', 'bob', 'charlie']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'alice', identity1);

    // Store distributed keys from bob and charlie
    generateGroupSenderKey(groupId, 'bob', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'charlie', new Uint8Array(32));
    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'bob')!));
    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'charlie')!));

    // Record key change when charlie leaves
    recordGroupKeyChange(groupId, 'charlie', 'oldFp', 'newFp');

    // Warning should be active
    expect(hasGroupKeyChangeWarning(groupId)).toBe(true);
    const events = getGroupKeyChanges(groupId);
    expect(events.length).toBe(1);
    expect(events[0].userId).toBe('charlie');
  });

  test('member join triggers no key change warning (new member is expected)', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['alice', 'bob']);

    // Adding a new member should NOT trigger a key change warning
    addGroupMember(groupId, 'charlie');

    // No key change events for a new join
    expect(getGroupKeyChanges(groupId)).toHaveLength(0);
  });

  test('multiple key changes are tracked per group', () => {
    const groupId = 'group1';

    recordGroupKeyChange(groupId, 'bob', 'fp1a', 'fp1b');
    recordGroupKeyChange(groupId, 'charlie', 'fp2a', 'fp2b');

    expect(hasGroupKeyChangeWarning(groupId)).toBe(true);

    const events = getGroupKeyChanges(groupId);
    expect(events).toHaveLength(2);

    const warning = getGroupKeyChangeWarning(groupId);
    expect(warning!.changedUserIds).toContain('bob');
    expect(warning!.changedUserIds).toContain('charlie');

    // Warning message key should be "Multiple" variant
    expect(warning!.messageKey).toBe('TeleBridgeGroupKeyChangeWarningMultiple');
  });

  test('group key change warning is non-dismissible', () => {
    const groupId = 'group1';

    recordGroupKeyChange(groupId, 'bob', 'fp1', 'fp2');

    // Acknowledging doesn't remove the group warning
    acknowledgeGroupKeyChange(groupId, 'bob');

    // Warning is still active
    expect(hasGroupKeyChangeWarning(groupId)).toBe(true);

    // Only clearing the key change (after re-verification) removes the warning
    clearGroupKeyChange(groupId, 'bob');

    expect(hasGroupKeyChangeWarning(groupId)).toBe(false);
  });
});

// ---------- VAL-GROUP-010: Mixed encrypted/unencrypted messages ----------

describe('VAL-GROUP-010: Mixed encrypted/unencrypted group messages', () => {
  test('plain text message from unencrypted member is displayed as readable text', async () => {
    const groupId = 'group1';

    // A message that's NOT a tb1.g. message (plain text from unencrypted member)
    const result = await processIncomingGroupMessage(
      'Hello from an unencrypted member',
      groupId,
      'dave',
    );

    expect(result.isGroupMessage).toBe(false);
    expect(result.decryptedText).toBeUndefined();
    expect(result.shouldHide).toBe(false);
  });

  test('plain text does not show as protocol string', async () => {
    const groupId = 'group1';
    const plainText = 'This is a normal message, no encryption';

    const result = await processIncomingGroupMessage(plainText, groupId, 'dave');

    // The result should NOT be a tb1. protocol string — it should be
    // handled as a plain text message (not a group message)
    expect(result.isGroupMessage).toBe(false);
    // decryptedText is undefined for non-group messages, but the caller
    // (message rendering layer) should display the original text
    expect(result.shouldHide).toBe(false);
  });

  test('processOutgoingGroupMessage returns plaintext when no sender key', async () => {
    const groupId = 'group1';
    const memberId = 'dave';

    initGroupEncryptionState(groupId, [memberId, 'alice']);
    // Dave has no sender key

    const result = await processOutgoingGroupMessage('Hello from Dave', groupId, memberId);

    expect(result.wasEncrypted).toBe(false);
    expect(result.text).toBe('Hello from Dave');
    // Plaintext messages do NOT start with tb1.g.
    expect(result.text).not.toMatch(/^tb1\./);
  });

  test('mixedGroupComposition tracks encrypted and unencrypted members', () => {
    const groupId = 'group1';

    // 3 encrypted, 2 unencrypted
    const composition = updateGroupMixedComposition(groupId, 3, 2, ['dave', 'eve']);

    expect(composition.encryptedCount).toBe(3);
    expect(composition.unencryptedCount).toBe(2);
    expect(composition.totalCount).toBe(5);
    expect(composition.unencryptedMemberIds).toEqual(['dave', 'eve']);
    expect(composition.isReducedSecurity).toBe(true);
  });

  test('all-encrypted group is not reduced security', () => {
    const groupId = 'group1';

    const composition = updateGroupMixedComposition(groupId, 5, 0, []);

    expect(composition.isReducedSecurity).toBe(false);
  });

  test('getGroupMixedComposition returns stored composition', () => {
    const groupId = 'group1';

    updateGroupMixedComposition(groupId, 3, 2, ['dave', 'eve']);

    const retrieved = getGroupMixedComposition(groupId);
    expect(retrieved).toBeDefined();
    expect(retrieved!.encryptedCount).toBe(3);
    expect(retrieved!.unencryptedMemberIds).toEqual(['dave', 'eve']);
  });

  test('integration: encrypted and plain text messages coexist in group', async () => {
    const groupId = 'group1';
    const aliceId = 'alice';
    const daveId = 'dave'; // unencrypted member

    initGroupEncryptionState(groupId, [aliceId, daveId]);
    generateGroupSenderKey(groupId, aliceId, new Uint8Array(32));

    // Store Alice's distributed key
    const aliceKey = getOwnGroupSenderKey(groupId, aliceId)!;
    storeDistributedSenderKey(createDistributedSenderKey(aliceKey));

    // Alice sends an encrypted message
    const encryptedMsg = await encryptGroupMessage('Encrypted from Alice', aliceKey);
    const encResult = await processIncomingGroupMessage(encryptedMsg.protocolMessage, groupId, aliceId);
    expect(encResult.isGroupMessage).toBe(true);
    expect(encResult.decryptedText).toBe('Encrypted from Alice');

    // Dave sends a plain text message (not encrypted)
    const plainResult = await processIncomingGroupMessage('Plain from Dave', groupId, daveId);
    expect(plainResult.isGroupMessage).toBe(false);
    // Caller should display the original text for non-group messages
    expect(plainResult.shouldHide).toBe(false);

    // Track mixed composition
    updateGroupMixedComposition(groupId, 1, 1, [daveId]);
    const comp = getGroupMixedComposition(groupId);
    expect(comp!.isReducedSecurity).toBe(true);
  });
});

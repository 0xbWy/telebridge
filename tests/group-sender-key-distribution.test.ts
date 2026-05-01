/**
 * TeleBridge — Group Sender Key Distribution Integration Tests
 *
 * VAL-GROUP-001: Sender Key Distribution via pairwise channels
 * VAL-GROUP-002: Store Received Sender Keys
 * VAL-GROUP-005: Member Join triggers key distribution
 * VAL-GROUP-006: Member Leave triggers re-key and redistribution
 *
 * These tests verify that the integration layer (NOT the crypto primitives)
 * correctly wires up sender key distribution through the 1:1 encrypted
 * channels and handles incoming/outgoing tb1.sk messages.
 */

import {
  generateSenderKey,
  createDistributedSenderKey,
  serializeSenderKey,
  deserializeSenderKey,
  verifySenderKeyId,
  regenerateSenderKey,
  zeroSenderKey,
  zeroDistributedSenderKey,
  type SenderKey,
  type DistributedSenderKey,
} from '../src/telebridge/group/senderKey';

import {
  encryptGroupMessage,
  decryptGroupMessage,
  isGroupMessage,
} from '../src/telebridge/group/groupEncryption';

import {
  groupSenderKeyStore,
  initGroupEncryptionState,
  getGroupEncryptionState,
  getGroupEncryptionStatus,
  getGroupMemberStates,
  getGroupMemberStatus,
  addGroupMember,
  removeGroupMember,
  setGroupPairwiseKeyComplete,
  startGroupRekeying,
  completeGroupRekeying,
  clearGroupEncryption,
  clearAllGroupEncryption,
  storeDistributedSenderKey,
  getDistributedSenderKey,
  hasDistributedSenderKey,
  getAllDistributedSenderKeys,
  generateGroupSenderKey,
  getOwnGroupSenderKey,
  type GroupEncryptionStatus,
} from '../src/telebridge/group/groupState';

import {
  encodeProtocol,
  decodeProtocol,
} from '../src/telebridge/crypto/protocol';

import {
  setChatKey,
  clearAllChatKeys,
} from '../src/telebridge/messages';

import {
  distributeSenderKeyToMembers,
  processIncomingSenderKeyMessage,
  regenerateAndDistributeSenderKeys,
  distributeKeysForNewMember,
  clearPendingSenderKeyMessages,
  getPendingSenderKeyMessages,
  buildPairwiseChatId,
} from '../src/telebridge/group/senderKeyDistribution';

// ---------- Helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isAllZeros(bytes: Uint8Array): boolean {
  return bytes.every((b) => b === 0);
}

/**
 * Set up a pairwise chat key between two members in a group.
 * Uses the same format as buildPairwiseChatId to ensure
 * the distribution function can find it.
 */
function setupPairwiseKey(groupId: string, memberId1: string, memberId2: string): Uint8Array {
  const chatId = buildPairwiseChatId(groupId, memberId1, memberId2);
  const key = new Uint8Array(32);
  crypto.getRandomValues(key);
  setChatKey(chatId, key);
  return key;
}

// ---------- VAL-GROUP-001: Sender Key Distribution via Pairwise Channels ----------

describe('VAL-GROUP-001: Sender Key Distribution via pairwise channels', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
    clearAllChatKeys();
    clearPendingSenderKeyMessages();
  });

  test('distributeSenderKeyToMembers creates tb1.sk messages for each member', () => {
    // Setup: 3-member group with our own sender key
    const groupId = 'group1';
    const myMemberId = 'user1';
    const memberIds = ['user1', 'user2', 'user3'];

    initGroupEncryptionState(groupId, memberIds);

    // Generate our own sender key with identity
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);
    const ownKey = generateGroupSenderKey(groupId, myMemberId, identityKey);
    expect(ownKey).toBeDefined();

    // Set up pairwise chat keys for user2 and user3
    setupPairwiseKey(groupId, myMemberId, 'user2');
    setupPairwiseKey(groupId, myMemberId, 'user3');

    // Distribute our sender key to other members
    const result = distributeSenderKeyToMembers(groupId, myMemberId, memberIds);

    // Should have pending messages for user2 and user3 (not user1 = self)
    expect(result).toBeDefined();
    expect(result.distributedTo).toContain('user2');
    expect(result.distributedTo).toContain('user3');
    expect(result.distributedTo).not.toContain(myMemberId);
    expect(result.protocolMessages).toHaveLength(2);

    // Each protocol message should start with tb1.sk.
    for (const msg of result.protocolMessages) {
      expect(msg.message).toMatch(/^tb1\.sk\./);
      expect(msg.recipientId).toBeDefined();
      expect(msg.recipientId).not.toBe(myMemberId);
    }
  });

  test('distribution creates protocol messages with valid sender key payloads', () => {
    const groupId = 'group1';
    const myMemberId = 'user1';
    const memberIds = ['user1', 'user2'];

    initGroupEncryptionState(groupId, memberIds);

    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);
    generateGroupSenderKey(groupId, myMemberId, identityKey);

    // Set up pairwise chat key
    setupPairwiseKey(groupId, myMemberId, 'user2');

    const result = distributeSenderKeyToMembers(groupId, myMemberId, memberIds);

    // The protocol message should be decodable as a valid 'sk' mode
    for (const msg of result.protocolMessages) {
      const decoded = decodeProtocol(msg.message);
      expect(decoded).toBeDefined();
      expect(decoded!.mode).toBe('sk');

      // The payload should be a valid serialized sender key
      const distKey = deserializeSenderKey(decoded!.payload);
      expect(distKey).toBeDefined();
      expect(distKey.groupId).toBe(groupId);
      expect(distKey.memberId).toBe(myMemberId);
      expect(verifySenderKeyId(distKey)).toBe(true);
    }
  });

  test('distribution skips members without pairwise keys', () => {
    const groupId = 'group1';
    const myMemberId = 'user1';
    const memberIds = ['user1', 'user2', 'user3'];

    initGroupEncryptionState(groupId, memberIds);

    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);
    generateGroupSenderKey(groupId, myMemberId, identityKey);

    // Only set up pairwise key for user2
    setupPairwiseKey(groupId, myMemberId, 'user2');

    const result = distributeSenderKeyToMembers(groupId, myMemberId, memberIds);

    // Should only distribute to user2
    expect(result.distributedTo).toContain('user2');
    expect(result.distributedTo).not.toContain('user3');
    expect(result.skippedMembers).toContain('user3');
  });

  test('distribution fails if no own sender key', () => {
    const groupId = 'group1';
    const myMemberId = 'user1';
    const memberIds = ['user1', 'user2'];

    initGroupEncryptionState(groupId, memberIds);
    // No own key generated!

    const result = distributeSenderKeyToMembers(groupId, myMemberId, memberIds);
    expect(result.distributedTo).toHaveLength(0);
    expect(result.protocolMessages).toHaveLength(0);
  });

  test('distribution uses explicit pairwiseChatIds when provided', () => {
    const groupId = 'group1';
    const myMemberId = 'user1';
    const memberIds = ['user1', 'user2'];

    initGroupEncryptionState(groupId, memberIds);

    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);
    generateGroupSenderKey(groupId, myMemberId, identityKey);

    // Set up chat key with a custom ID (simulating 1:1 Telegram chat ID)
    const customChatId = 'telegram_chat_12345';
    const chatKey = new Uint8Array(32);
    crypto.getRandomValues(chatKey);
    setChatKey(customChatId, chatKey);

    // Provide explicit pairwiseChatIds mapping
    const pairwiseChatIds = new Map<string, string>();
    pairwiseChatIds.set('user2', customChatId);

    const result = distributeSenderKeyToMembers(groupId, myMemberId, memberIds, pairwiseChatIds);
    expect(result.distributedTo).toContain('user2');
    expect(result.protocolMessages).toHaveLength(1);
  });
});

// ---------- VAL-GROUP-002: Store Received Sender Keys ----------

describe('VAL-GROUP-002: Store Received Sender Keys', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
    clearAllChatKeys();
    clearPendingSenderKeyMessages();
  });

  test('processIncomingSenderKeyMessage stores the distributed key', () => {
    const groupId = 'group1';
    const senderMemberId = 'user2';
    const myMemberId = 'user1';

    initGroupEncryptionState(groupId, [myMemberId, senderMemberId]);

    // sender creates and serializes their key
    const senderKey = generateSenderKey(groupId, senderMemberId);
    const distKey = createDistributedSenderKey(senderKey);
    const serialized = serializeSenderKey(distKey);

    // Encode as tb1.sk.<base64>
    const protocolMessage = encodeProtocol('sk', serialized);

    // Process the incoming sender key message
    const result = processIncomingSenderKeyMessage(protocolMessage, groupId);

    expect(result.success).toBe(true);
    expect(result.groupId).toBe(groupId);
    expect(result.memberId).toBe(senderMemberId);

    // Key should now be stored
    const stored = getDistributedSenderKey(groupId, senderMemberId);
    expect(stored).toBeDefined();
    expect(stored!.memberId).toBe(senderMemberId);
    expect(stored!.groupId).toBe(groupId);
    expect(verifySenderKeyId(stored!)).toBe(true);
  });

  test('processIncomingSenderKeyMessage rejects invalid protocol messages', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1']);

    const result = processIncomingSenderKeyMessage('not a protocol message', groupId);
    expect(result.success).toBe(false);
  });

  test('processIncomingSenderKeyMessage rejects wrong mode', () => {
    const groupId = 'group1';
    const result = processIncomingSenderKeyMessage('tb1.s.AQIDBA==', groupId);
    expect(result.success).toBe(false);
  });

  test('processIncomingSenderKeyMessage rejects invalid sender key (keyId mismatch)', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    // Create a sender key with tampered keyId
    const senderKey = generateSenderKey(groupId, 'user2');
    const distKey = createDistributedSenderKey(senderKey);
    const tamperedKey: DistributedSenderKey = {
      ...distKey,
      keyId: 'deadbeef', // Wrong keyId
    };
    const serialized = serializeSenderKey(tamperedKey);
    const protocolMessage = encodeProtocol('sk', serialized);

    const result = processIncomingSenderKeyMessage(protocolMessage, groupId);
    expect(result.success).toBe(false);
  });

  test('processIncomingSenderKeyMessage rejects group ID mismatch', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    const senderKey = generateSenderKey('wronggroup', 'user2');
    const distKey = createDistributedSenderKey(senderKey);
    const serialized = serializeSenderKey(distKey);
    const protocolMessage = encodeProtocol('sk', serialized);

    const result = processIncomingSenderKeyMessage(protocolMessage, groupId);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Group ID mismatch');
  });

  test('stored sender key enables group message decryption', async () => {
    const groupId = 'group1';
    const senderMemberId = 'user2';
    const myMemberId = 'user1';

    initGroupEncryptionState(groupId, [myMemberId, senderMemberId]);

    // sender creates their key and distributes it
    const senderKey = generateSenderKey(groupId, senderMemberId);
    const distKey = createDistributedSenderKey(senderKey);
    const serialized = serializeSenderKey(distKey);
    const protocolMessage = encodeProtocol('sk', serialized);

    // Process incoming sender key
    processIncomingSenderKeyMessage(protocolMessage, groupId);

    // Now sender encrypts a group message
    const encrypted = await encryptGroupMessage('Hello group!', senderKey);

    // We can decrypt using the stored distributed key
    const storedKey = getDistributedSenderKey(groupId, senderMemberId);
    expect(storedKey).toBeDefined();

    const decrypted = await decryptGroupMessage(encrypted.protocolMessage, storedKey!);
    expect(decrypted.text).toBe('Hello group!');
    expect(decrypted.isSignatureValid).toBe(true);
  });

  test('member state transitions to encrypted after receiving key', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    expect(getGroupMemberStatus(groupId, 'user2')).toBe('missing');

    const senderKey = generateSenderKey(groupId, 'user2');
    const distKey = createDistributedSenderKey(senderKey);
    const serialized = serializeSenderKey(distKey);
    const protocolMessage = encodeProtocol('sk', serialized);

    processIncomingSenderKeyMessage(protocolMessage, groupId);

    const memberStates = getGroupMemberStates(groupId);
    expect(memberStates.user2.status).toBe('encrypted');
    expect(memberStates.user2.hasDistributedKey).toBe(true);
  });
});

// ---------- VAL-GROUP-005: Member Join Triggers Key Distribution ----------

describe('VAL-GROUP-005: Member Join triggers key distribution', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
    clearAllChatKeys();
    clearPendingSenderKeyMessages();
  });

  test('new member receives all existing members\' sender keys on join', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    // user1 and user2 generate sender keys
    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    const identity2 = new Uint8Array(32);
    crypto.getRandomValues(identity2);
    generateGroupSenderKey(groupId, 'user1', identity1);
    generateGroupSenderKey(groupId, 'user2', identity2);

    // New member user3 joins
    const result = distributeKeysForNewMember(groupId, 'user3', ['user1', 'user2']);

    // Both existing members should distribute to user3
    expect(result.distributedFrom).toHaveLength(2);
    expect(result.distributedFrom).toContain('user1');
    expect(result.distributedFrom).toContain('user2');
    expect(result.protocolMessages.length).toBeGreaterThan(0);

    // All protocol messages should target user3
    for (const msg of result.protocolMessages) {
      expect(msg.recipientId).toBe('user3');
      expect(msg.message).toMatch(/^tb1\.sk\./);
    }
  });

  test('new member can decrypt future messages after receiving keys', async () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'user1', identity1);

    // user1 sends a message before user3 joins (ratchets key forward)
    const user1Key = getOwnGroupSenderKey(groupId, 'user1')!;
    await encryptGroupMessage('Before join', user1Key);

    // user3 joins — receives user1's sender key
    // The distributed key captures the current chain state (startChainIndex = 1)
    const distKeyForNewMember = createDistributedSenderKey(user1Key);
    storeDistributedSenderKey(distKeyForNewMember);

    // user3 can decrypt future messages from user1 (chain index >= startChainIndex)
    const futureMsg = await encryptGroupMessage('After join', user1Key);
    const decrypted = await decryptGroupMessage(futureMsg.protocolMessage, distKeyForNewMember);
    expect(decrypted.text).toBe('After join');
  });

  test('new member is added to group state', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2']);

    generateGroupSenderKey(groupId, 'user1', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'user2', new Uint8Array(32));

    distributeKeysForNewMember(groupId, 'user3', ['user1', 'user2']);

    const memberStates = getGroupMemberStates(groupId);
    expect(memberStates.user3).toBeDefined();
    expect(memberStates.user3.memberId).toBe('user3');
  });
});

// ---------- VAL-GROUP-006: Member Leave Triggers Re-key ----------

describe('VAL-GROUP-006: Member Leave triggers re-key and redistribution', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
    clearAllChatKeys();
    clearPendingSenderKeyMessages();
  });

  test('member leave triggers re-key: old keys zeroed, new keys generated', () => {
    const groupId = 'group1';
    const memberIds = ['user1', 'user2', 'user3'];
    initGroupEncryptionState(groupId, memberIds);

    // Generate sender keys for all
    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'user1', identity1);
    generateGroupSenderKey(groupId, 'user2', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'user3', new Uint8Array(32));

    // Store distributed keys from user2 and user3
    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'user2')!));
    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'user3')!));

    // Set up pairwise key for remaining member (user2)
    setupPairwiseKey(groupId, 'user1', 'user2');

    // Re-key triggered by user3 leaving
    const result = regenerateAndDistributeSenderKeys(
      groupId, 'user1', ['user3'], // user3 leaves
    );

    expect(result.oldKeysZeroed).toBe(true);
    expect(result.newKeyGenerated).toBe(true);
    expect(result.distributedTo.length).toBeGreaterThan(0);

    // Old user3 distributed key should be removed
    expect(hasDistributedSenderKey(groupId, 'user3')).toBe(false);

    // New key should have different keyId
    const newKey = getOwnGroupSenderKey(groupId, 'user1');
    expect(newKey).toBeDefined();
    expect(newKey!.keyId).not.toBe(result.oldKeyId);
  });

  test('group status transitions: locked → transitional → locked during re-key', () => {
    const groupId = 'group1';
    const memberIds = ['user1', 'user2', 'user3'];
    initGroupEncryptionState(groupId, memberIds);

    // Generate and distribute all keys → locked
    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'user1', identity1);
    generateGroupSenderKey(groupId, 'user2', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'user3', new Uint8Array(32));

    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'user2')!));
    storeDistributedSenderKey(createDistributedSenderKey(getOwnGroupSenderKey(groupId, 'user3')!));

    expect(getGroupEncryptionStatus(groupId)).toBe('locked');

    // Member leaves → start rekeying → transitional
    startGroupRekeying(groupId);
    expect(getGroupEncryptionStatus(groupId)).toBe('transitional');

    // Set up pairwise key and remove member
    setupPairwiseKey(groupId, 'user1', 'user2');
    removeGroupMember(groupId, 'user3');
    regenerateAndDistributeSenderKeys(groupId, 'user1', ['user3']);

    // Complete rekeying → back to locked or warning
    completeGroupRekeying(groupId);

    const finalStatus = getGroupEncryptionStatus(groupId);
    expect(['locked', 'warning']).toContain(finalStatus);
  });

  test('departed member cannot decrypt new messages after re-key', async () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2', 'user3']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    generateGroupSenderKey(groupId, 'user1', identity1);

    // Create the old distributed key (what user3 had before leaving)
    const oldKey = getOwnGroupSenderKey(groupId, 'user1')!;
    const oldDistKey = createDistributedSenderKey(oldKey);

    // user1 sends a message before user3 leaves (ratchets the key)
    await encryptGroupMessage('Before leave', oldKey);

    // user3 leaves — user1 regenerates sender key
    setupPairwiseKey(groupId, 'user1', 'user2');
    regenerateAndDistributeSenderKeys(groupId, 'user1', ['user3']);

    // user1 sends a new message with the new key
    const newKey = getOwnGroupSenderKey(groupId, 'user1')!;
    const newDistKey = createDistributedSenderKey(newKey);
    const newMsg = await encryptGroupMessage('After leave', newKey);

    // Old distributed key fails decryption (different chain key)
    await expect(decryptGroupMessage(newMsg.protocolMessage, oldDistKey)).rejects.toThrow();

    // New distributed key succeeds
    const decrypted = await decryptGroupMessage(newMsg.protocolMessage, newDistKey);
    expect(decrypted.text).toBe('After leave');
  });

  test('regenerateAndDistributeSenderKeys zeros old key material', () => {
    const groupId = 'group1';
    initGroupEncryptionState(groupId, ['user1', 'user2', 'user3']);

    const identity1 = new Uint8Array(32);
    crypto.getRandomValues(identity1);
    const originalKey = generateGroupSenderKey(groupId, 'user1', identity1);

    // Set up pairwise key
    setupPairwiseKey(groupId, 'user1', 'user2');

    // Re-key
    const result = regenerateAndDistributeSenderKeys(groupId, 'user1', ['user3']);
    expect(result.oldKeysZeroed).toBe(true);

    // Old key material should be zeroed (the original key object's chainKey is zeroed in-place)
    expect(isAllZeros(originalKey.chainKey)).toBe(true);
    expect(isAllZeros(originalKey.signingBytes)).toBe(true);
  });
});

// ---------- Integration: Full Distribution Flow ----------

describe('Full sender key distribution flow', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
    clearAllChatKeys();
    clearPendingSenderKeyMessages();
  });

  test('complete flow: init → generate → distribute → receive → decrypt', async () => {
    const groupId = 'group1';
    const members = ['alice', 'bob', 'charlie'];

    // 1. Initialize group
    initGroupEncryptionState(groupId, members);

    // 2. Each member generates their sender key
    const aliceId = new Uint8Array(32);
    crypto.getRandomValues(aliceId);
    generateGroupSenderKey(groupId, 'alice', aliceId);
    generateGroupSenderKey(groupId, 'bob', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'charlie', new Uint8Array(32));

    // 3. Set up pairwise keys (simulating existing 1:1 key exchanges)
    setupPairwiseKey(groupId, 'alice', 'bob');
    setupPairwiseKey(groupId, 'alice', 'charlie');

    // 4. Alice distributes her key to bob and charlie
    const aliceResult = distributeSenderKeyToMembers(groupId, 'alice', members);
    expect(aliceResult.distributedTo).toHaveLength(2);

    // 5. Simulate bob and charlie receiving alice's key
    for (const msg of aliceResult.protocolMessages) {
      const received = processIncomingSenderKeyMessage(msg.message, groupId);
      expect(received.success).toBe(true);
    }

    // 6. Alice can now encrypt group messages
    const aliceKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const encrypted = await encryptGroupMessage('Hello everyone!', aliceKey);

    // 7. Bob and Charlie can decrypt using the stored distributed key
    const aliceDistKey = getDistributedSenderKey(groupId, 'alice');
    expect(aliceDistKey).toBeDefined();

    const decrypted = await decryptGroupMessage(encrypted.protocolMessage, aliceDistKey!);
    expect(decrypted.text).toBe('Hello everyone!');
    expect(decrypted.isSignatureValid).toBe(true);
  });

  test('full group flow: all members exchange keys and all can decrypt', async () => {
    const groupId = 'group1';
    const members = ['alice', 'bob', 'charlie'];

    initGroupEncryptionState(groupId, members);

    // Everyone generates their sender key
    generateGroupSenderKey(groupId, 'alice', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'bob', new Uint8Array(32));
    generateGroupSenderKey(groupId, 'charlie', new Uint8Array(32));

    // Set up all pairwise keys
    setupPairwiseKey(groupId, 'alice', 'bob');
    setupPairwiseKey(groupId, 'alice', 'charlie');
    setupPairwiseKey(groupId, 'bob', 'charlie');

    // Each member distributes their key
    const aliceResult = distributeSenderKeyToMembers(groupId, 'alice', members);
    const bobResult = distributeSenderKeyToMembers(groupId, 'bob', members);
    const charlieResult = distributeSenderKeyToMembers(groupId, 'charlie', members);

    // Process incoming sender keys (simulating receipt)
    const allMessages = [
      ...aliceResult.protocolMessages,
      ...bobResult.protocolMessages,
      ...charlieResult.protocolMessages,
    ];

    for (const msg of allMessages) {
      processIncomingSenderKeyMessage(msg.message, groupId);
    }

    // Now all members should have each other's distributed keys
    expect(getDistributedSenderKey(groupId, 'alice')).toBeDefined();
    expect(getDistributedSenderKey(groupId, 'bob')).toBeDefined();
    expect(getDistributedSenderKey(groupId, 'charlie')).toBeDefined();

    // Each member can encrypt and all others can decrypt
    const aliceKey = getOwnGroupSenderKey(groupId, 'alice')!;
    const msg = await encryptGroupMessage('Hello from Alice!', aliceKey);

    const aliceDist = getDistributedSenderKey(groupId, 'alice')!;
    const decrypted = await decryptGroupMessage(msg.protocolMessage, aliceDist);
    expect(decrypted.text).toBe('Hello from Alice!');
    expect(decrypted.isSignatureValid).toBe(true);
  });
});

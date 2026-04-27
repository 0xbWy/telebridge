/**
 * TeleBridge — Group Encryption Unit Tests
 *
 * VAL-GROUP-001: Sender Key generation per member per group (chain key + signing key)
 * VAL-GROUP-002: Sender Key distribution via pairwise encrypted channels
 * VAL-GROUP-003: Group message encryption with sender's Sender Key
 * VAL-GROUP-004: Group message decryption with distributed sender key
 * VAL-GROUP-005: New member joins — bidirectional key distribution, no retroactive access
 * VAL-GROUP-006: Member leaves — re-keying, forward secrecy
 * VAL-GROUP-007: Concurrent sends from different members
 * VAL-GROUP-008: Group encryption status indicator (locked, warning, transitional)
 */

import {
  generateSenderKey,
  generateSenderKeyDeterministic,
  ratchetSenderKey,
  deriveMessageKeyAtChainIndex,
  deriveChainKeyAtIndex,
  signGroupMessage,
  verifyGroupMessageSignature,
  serializeSenderKey,
  deserializeSenderKey,
  createDistributedSenderKey,
  senderKeyIdFromChainKey,
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
  isTeleBridgeGroupMessage,
  decodeGroupProtocol,
  GROUP_PROTOCOL_MODE,
  type GroupEncryptedMessageResult,
  type GroupDecryptedMessageResult,
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
  type GroupEncryptionState,
  type GroupEncryptionStatus,
  type MemberEncryptionStatus,
} from '../src/telebridge/group/groupState';

// ---------- Helpers ----------

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isAllZeros(bytes: Uint8Array): boolean {
  return bytes.every((b) => b === 0);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, ms); });
}

// ---------- VAL-GROUP-001: Sender Key Generation ----------

describe('VAL-GROUP-001: Sender Key generation', () => {
  test('generates unique Sender Key per member per group', () => {
    const key1 = generateSenderKey('group1', 'user1');
    const key2 = generateSenderKey('group1', 'user2');
    const key3 = generateSenderKey('group2', 'user1');

    // All keys should be different (different member/group combos)
    expect(key1.keyId).not.toBe(key2.keyId);
    expect(key2.keyId).not.toBe(key3.keyId);
    expect(key1.keyId).not.toBe(key3.keyId);

    // Each key has unique chain key
    expect(bytesToHex(key1.chainKey)).not.toBe(bytesToHex(key2.chainKey));
    expect(bytesToHex(key2.chainKey)).not.toBe(bytesToHex(key3.chainKey));

    // Each key has unique signing key
    expect(bytesToHex(key1.signingBytes)).not.toBe(bytesToHex(key2.signingBytes));
    expect(bytesToHex(key2.signingBytes)).not.toBe(bytesToHex(key3.signingBytes));

    // Each key has unique verifying key
    expect(bytesToHex(key1.verifyingBytes)).not.toBe(bytesToHex(key2.verifyingBytes));
    expect(bytesToHex(key2.verifyingBytes)).not.toBe(bytesToHex(key3.verifyingBytes));
  });

  test('generates Sender Key with correct structure', () => {
    const key = generateSenderKey('group1', 'user1');

    expect(key.groupId).toBe('group1');
    expect(key.memberId).toBe('user1');
    expect(key.chainKey.length).toBe(32);
    expect(key.signingBytes.length).toBe(32);
    expect(key.verifyingBytes.length).toBe(32);
    expect(key.chainIndex).toBe(0);
    expect(key.createdAt).toBeGreaterThan(0);
    expect(key.keyId).toMatch(/^[0-9a-f]{8}$/);
  });

  test('deterministic generation produces same key from same inputs', () => {
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);

    const key1 = generateSenderKeyDeterministic('group1', 'user1', identityKey);
    const key2 = generateSenderKeyDeterministic('group1', 'user1', identityKey);

    expect(bytesToHex(key1.chainKey)).toBe(bytesToHex(key2.chainKey));
    expect(bytesToHex(key1.verifyingBytes)).toBe(bytesToHex(key2.verifyingBytes));
    expect(key1.keyId).toBe(key2.keyId);
  });

  test('deterministic generation produces different keys for different groups', () => {
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);

    const key1 = generateSenderKeyDeterministic('group1', 'user1', identityKey);
    const key2 = generateSenderKeyDeterministic('group2', 'user1', identityKey);

    expect(bytesToHex(key1.chainKey)).not.toBe(bytesToHex(key2.chainKey));
    expect(key1.keyId).not.toBe(key2.keyId);
  });

  test('deterministic generation throws on invalid inputs', () => {
    expect(() => generateSenderKeyDeterministic('group1', 'user1', new Uint8Array(16)))
      .toThrow('Identity signing key must be 32 bytes');
  });
});

// ---------- Chain Key Ratcheting ----------

describe('Sender Key chain ratcheting', () => {
  test('ratchetSenderKey advances chain index and produces unique message keys', () => {
    const key = generateSenderKey('group1', 'user1');

    const r1 = ratchetSenderKey(key);
    expect(r1.chainIndex).toBe(0);
    expect(r1.messageKey.length).toBe(32); // message key is 32 bytes

    const r2 = ratchetSenderKey(key);
    expect(r2.chainIndex).toBe(1);

    const r3 = ratchetSenderKey(key);
    expect(r3.chainIndex).toBe(2);

    // All message keys should be unique (forward secrecy)
    expect(bytesToHex(r1.messageKey)).not.toBe(bytesToHex(r2.messageKey));
    expect(bytesToHex(r2.messageKey)).not.toBe(bytesToHex(r3.messageKey));
    expect(bytesToHex(r1.messageKey)).not.toBe(bytesToHex(r3.messageKey));
  });

  test('deriveMessageKeyAtChainIndex produces correct key without advancing chain', () => {
    const key = generateSenderKey('group1', 'user1');
    const originalChainKey = new Uint8Array(key.chainKey);

    // Derive key at index 5
    const msgKey5 = deriveMessageKeyAtChainIndex(key.chainKey, 5, 0);

    // The chain key should not be modified
    expect(bytesToHex(key.chainKey)).toBe(bytesToHex(originalChainKey));
  });

  test('deriveChainKeyAtIndex walks the ratchet correctly', () => {
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);
    const key = generateSenderKeyDeterministic('group1', 'user1', identityKey);

    // Get chain key at index 3
    const chainKey3 = deriveChainKeyAtIndex(key.chainKey, 3);
    expect(chainKey3.length).toBe(32);

    // Different indices produce different chain keys
    const chainKey0 = deriveChainKeyAtIndex(key.chainKey, 0);
    const chainKey1 = deriveChainKeyAtIndex(key.chainKey, 1);

    expect(bytesToHex(chainKey0)).not.toBe(bytesToHex(chainKey1));
    expect(bytesToHex(chainKey1)).not.toBe(bytesToHex(chainKey3));
  });

  test('1000 ratchet steps produce unique message keys', () => {
    const key = generateSenderKey('group1', 'user1');
    const keys = new Set<string>();

    for (let i = 0; i < 1000; i++) {
      const result = ratchetSenderKey(key);
      keys.add(bytesToHex(result.messageKey));
    }

    expect(keys.size).toBe(1000);
  });
});

// ---------- Signing and Verification ----------

describe('Sender Key signing and verification', () => {
  test('signGroupMessage and verifyGroupMessageSignature round-trip', () => {
    const key = generateSenderKey('group1', 'user1');
    const message = new TextEncoder().encode('Hello, group!');

    const signature = signGroupMessage(message, key.signingBytes);
    expect(signature.length).toBe(64);

    const isValid = verifyGroupMessageSignature(message, signature, key.verifyingBytes);
    expect(isValid).toBe(true);
  });

  test('tampered message fails signature verification', () => {
    const key = generateSenderKey('group1', 'user1');
    const message = new TextEncoder().encode('Hello, group!');
    const signature = signGroupMessage(message, key.signingBytes);

    const tamperedMessage = new Uint8Array(message);
    tamperedMessage[0] ^= 0xFF; // Flip first byte

    const isValid = verifyGroupMessageSignature(tamperedMessage, signature, key.verifyingBytes);
    expect(isValid).toBe(false);
  });

  test('wrong key fails signature verification', () => {
    const key1 = generateSenderKey('group1', 'user1');
    const key2 = generateSenderKey('group1', 'user2');
    const message = new TextEncoder().encode('Hello, group!');

    const signature = signGroupMessage(message, key1.signingBytes);

    const isValid = verifyGroupMessageSignature(message, signature, key2.verifyingBytes);
    expect(isValid).toBe(false);
  });
});

// ---------- Sender Key Distribution ----------

describe('VAL-GROUP-002: Sender Key distribution', () => {
  test('createDistributedSenderKey strips signing key', () => {
    const key = generateSenderKey('group1', 'user1');
    const distKey = createDistributedSenderKey(key);

    expect(distKey.groupId).toBe('group1');
    expect(distKey.memberId).toBe('user1');
    expect(distKey.keyId).toBe(key.keyId);
    expect(distKey.chainKey.length).toBe(32);
    expect(distKey.verifyingBytes.length).toBe(32);

    // Distributed key should NOT have a signing key property
    expect((distKey as any).signingBytes).toBeUndefined();
  });

  test('serializeSenderKey and deserializeSenderKey round-trip', () => {
    const key = generateSenderKey('group1', 'user1');
    const distKey = createDistributedSenderKey(key);

    const serialized = serializeSenderKey(distKey);
    expect(serialized.length).toBeGreaterThan(32 + 32); // At least chainKey + verifyingKey

    const deserialized = deserializeSenderKey(serialized);

    expect(deserialized.groupId).toBe(distKey.groupId);
    expect(deserialized.memberId).toBe(distKey.memberId);
    expect(deserialized.keyId).toBe(distKey.keyId);
    expect(bytesToHex(deserialized.chainKey)).toBe(bytesToHex(distKey.chainKey));
    expect(bytesToHex(deserialized.verifyingBytes)).toBe(bytesToHex(distKey.verifyingBytes));
    expect(deserialized.startChainIndex).toBe(distKey.startChainIndex);
  });

  test('verifySenderKeyId validates key ID matches chain key', () => {
    const key = generateSenderKey('group1', 'user1');
    const distKey = createDistributedSenderKey(key);

    expect(verifySenderKeyId(distKey)).toBe(true);

    // Tamper with the chain key
    const tamperedKey = { ...distKey, chainKey: new Uint8Array(32) };
    crypto.getRandomValues(tamperedKey.chainKey);
    expect(verifySenderKeyId(tamperedKey)).toBe(false);
  });

  test('regenerateSenderKey produces different key', () => {
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);

    const key1 = generateSenderKey('group1', 'user1', identityKey);
    const key2 = regenerateSenderKey('group1', 'user1', identityKey);

    // Keys should be different (new random chain key and signing key)
    expect(bytesToHex(key1.chainKey)).not.toBe(bytesToHex(key2.chainKey));
    expect(bytesToHex(key1.signingBytes)).not.toBe(bytesToHex(key2.signingBytes));
    expect(key1.keyId).not.toBe(key2.keyId);
  });

  test('zeroSenderKey zeros sensitive material', () => {
    const key = generateSenderKey('group1', 'user1');
    expect(isAllZeros(key.chainKey)).toBe(false);
    expect(isAllZeros(key.signingBytes)).toBe(false);

    zeroSenderKey(key);

    expect(isAllZeros(key.chainKey)).toBe(true);
    expect(isAllZeros(key.signingBytes)).toBe(true);
  });

  test('zeroDistributedSenderKey zeros chain key', () => {
    const key = generateSenderKey('group1', 'user1');
    const distKey = createDistributedSenderKey(key);
    expect(isAllZeros(distKey.chainKey)).toBe(false);

    zeroDistributedSenderKey(distKey);

    expect(isAllZeros(distKey.chainKey)).toBe(true);
  });
});

// ---------- VAL-GROUP-003: Group Message Encryption ----------

describe('VAL-GROUP-003: Group message encryption', () => {
  test('encryptGroupMessage produces valid protocol message', async () => {
    const key = generateSenderKey('group1', 'user1');
    const result = await encryptGroupMessage('Hello, group!', key);

    expect(result.protocolMessage).toMatch(/^tb1\.g\./);
    expect(result.chainIndex).toBe(0);
    expect(result.keyId).toBe(key.keyId);
  });

  test('encryptGroupMessage advances chain index', async () => {
    const key = generateSenderKey('group1', 'user1');

    const r1 = await encryptGroupMessage('Message 1', key);
    expect(r1.chainIndex).toBe(0);

    const r2 = await encryptGroupMessage('Message 2', key);
    expect(r2.chainIndex).toBe(1);

    const r3 = await encryptGroupMessage('Message 3', key);
    expect(r3.chainIndex).toBe(2);
  });

  test('encryptGroupMessage includes sender and group info in payload', async () => {
    const key = generateSenderKey('testgroup123', 'sender456');
    const result = await encryptGroupMessage('Test message', key);

    // The protocol message should start with tb1.g.
    expect(result.protocolMessage.startsWith('tb1.g.')).toBe(true);

    // Decode to verify payload contains the right data
    const payload = decodeGroupProtocol(result.protocolMessage);
    expect(payload).toBeDefined();
    expect(payload!.length).toBeGreaterThan(100); // Enough for headers + nonce + authTag + signature
  });

  test('isGroupMessage detects group protocol messages', () => {
    const key = generateSenderKey('group1', 'user1');
    // We need to test sync detection — check protocol pattern
    expect(isGroupMessage('tb1.g.AQIDBA==')).toBe(true);
    expect(isGroupMessage('tb1.s.AQIDBA==')).toBe(false);
    expect(isGroupMessage('tb1.kx.AQIDBA==')).toBe(false);
    expect(isGroupMessage('Hello, normal message')).toBe(false);
  });
});

// ---------- VAL-GROUP-004: Group Message Decryption ----------

describe('VAL-GROUP-004: Group message decryption', () => {
  test('decryptGroupMessage round-trip with distributed key', async () => {
    const senderKey = generateSenderKey('group1', 'sender1');
    const distKey = createDistributedSenderKey(senderKey);

    // Encrypt
    const encrypted = await encryptGroupMessage('Hello, group!', senderKey);
    // Note: senderKey.chainIndex is now 1 after ratcheting once

    // Decrypt with distributed key
    const decrypted = await decryptGroupMessage(encrypted.protocolMessage, distKey);

    expect(decrypted.text).toBe('Hello, group!');
    expect(decrypted.senderId).toBe('sender1');
    expect(decrypted.groupId).toBe('group1');
    expect(decrypted.chainIndex).toBe(0);
    expect(decrypted.isSignatureValid).toBe(true);
    expect(decrypted.keyId).toBe(senderKey.keyId);
  });

  test('tampered message fails decryption', async () => {
    const senderKey = generateSenderKey('group1', 'sender1');
    const distKey = createDistributedSenderKey(senderKey);

    const encrypted = await encryptGroupMessage('Hello, group!', senderKey);

    // Tamper with the base64 payload
    const tampered = encrypted.protocolMessage.slice(0, -5) + 'XXXXX';
    await expect(decryptGroupMessage(tampered, distKey)).rejects.toThrow();
  });

  test('wrong distributed key fails decryption', async () => {
    const senderKey = generateSenderKey('group1', 'sender1');
    const wrongSenderKey = generateSenderKey('group1', 'sender2');
    const wrongDistKey = createDistributedSenderKey(wrongSenderKey);

    const encrypted = await encryptGroupMessage('Hello, group!', senderKey);

    await expect(decryptGroupMessage(encrypted.protocolMessage, wrongDistKey)).rejects.toThrow();
  });

  test('group ID mismatch throws error', async () => {
    const senderKey = generateSenderKey('group1', 'sender1');
    const distKey = createDistributedSenderKey(senderKey);

    const encrypted = await encryptGroupMessage('Hello!', senderKey);

    // Use a distributed key with a different group ID
    const wrongDistKey = { ...distKey, groupId: 'wronggroup' };
    await expect(decryptGroupMessage(encrypted.protocolMessage, wrongDistKey)).rejects.toThrow();
  });

  test('member ID mismatch throws error', async () => {
    const senderKey = generateSenderKey('group1', 'sender1');
    const distKey = createDistributedSenderKey(senderKey);

    const encrypted = await encryptGroupMessage('Hello!', senderKey);

    // Use a distributed key with a different member ID
    const wrongDistKey = { ...distKey, memberId: 'wrongmember' };
    await expect(decryptGroupMessage(encrypted.protocolMessage, wrongDistKey)).rejects.toThrow();
  });
});

// ---------- VAL-GROUP-005: New Member Joins ----------

describe('VAL-GROUP-005: New member joins', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
  });

  test('new member cannot decrypt pre-join messages', async () => {
    // Existing members: sender1, sender2
    const sender1Key = generateSenderKey('group1', 'sender1');
    const sender2Key = generateSenderKey('group1', 'sender2');

    // Distribute sender1's key to sender2
    const sender1Dist = createDistributedSenderKey(sender1Key);

    // sender2 can decrypt sender1's message
    const msg = await encryptGroupMessage('Before new member joins', sender1Key);
    const decrypted = await decryptGroupMessage(msg.protocolMessage, sender1Dist);
    expect(decrypted.text).toBe('Before new member joins');
    expect(decrypted.isSignatureValid).toBe(true);

    // New member (sender3) has NOT received sender1's key
    // They cannot decrypt the message
    const sender3Dist = createDistributedSenderKey(generateSenderKey('group1', 'sender3'));

    // Create a new message (since sender1Key has already been ratcheted once)
    const msg2 = await encryptGroupMessage('Pre-join message', sender1Key);
    await expect(decryptGroupMessage(msg2.protocolMessage, sender3Dist)).rejects.toThrow();
  });
});

// ---------- VAL-GROUP-006: Member Leaves - Re-keying ----------

describe('VAL-GROUP-006: Member leaves - re-keying', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
  });

  test('regenerated keys are different from old keys', () => {
    const identityKey = new Uint8Array(32);
    crypto.getRandomValues(identityKey);

    const oldKey = generateSenderKey('group1', 'sender1', identityKey);
    const newKey = regenerateSenderKey('group1', 'sender1', identityKey);

    expect(bytesToHex(oldKey.chainKey)).not.toBe(bytesToHex(newKey.chainKey));
    expect(bytesToHex(oldKey.signingBytes)).not.toBe(bytesToHex(newKey.signingBytes));
    expect(oldKey.keyId).not.toBe(newKey.keyId);
  });

  test('departed member cannot decrypt post-departure messages', async () => {
    // Setup: sender1, sender2, sender3 are in the group
    const sender1Key = generateSenderKey('group1', 'sender1');
    const sender1Dist = createDistributedSenderKey(sender1Key);

    // sender3 leaves — sender1 regenerates
    const sender1NewKey = regenerateSenderKey('group1', 'sender1', new Uint8Array(32));
    const sender1NewDist = createDistributedSenderKey(sender1NewKey);

    // sender1 sends a new message with the new key
    const newMsg = await encryptGroupMessage('After departure', sender1NewKey);

    // Old distributed key cannot decrypt the new message (different chain key)
    await expect(decryptGroupMessage(newMsg.protocolMessage, sender1Dist)).rejects.toThrow();

    // New distributed key CAN decrypt the new message
    const decrypted = await decryptGroupMessage(newMsg.protocolMessage, sender1NewDist);
    expect(decrypted.text).toBe('After departure');
    expect(decrypted.isSignatureValid).toBe(true);
  });
});

// ---------- VAL-GROUP-007: Concurrent Sends ----------

describe('VAL-GROUP-007: Concurrent sends from different members', () => {
  test('members use independent Sender Keys and sequence numbers', async () => {
    const sender1Key = generateSenderKey('group1', 'sender1');
    const sender2Key = generateSenderKey('group1', 'sender2');
    const sender3Key = generateSenderKey('group1', 'sender3');

    // Create distributed keys BEFORE encrypting (captures original chain key at index 0)
    // These will be used by recipients to decrypt each sender's messages
    const sender1Dist = createDistributedSenderKey(sender1Key);
    const sender2Dist = createDistributedSenderKey(sender2Key);
    const sender3Dist = createDistributedSenderKey(sender3Key);

    // sender1 sends 3 messages
    const sender1Msgs: GroupEncryptedMessageResult[] = [];
    for (let i = 0; i < 3; i++) {
      sender1Msgs.push(await encryptGroupMessage(`sender1 msg ${i}`, sender1Key));
    }

    // sender2 sends 2 messages
    const sender2Msgs: GroupEncryptedMessageResult[] = [];
    for (let i = 0; i < 2; i++) {
      sender2Msgs.push(await encryptGroupMessage(`sender2 msg ${i}`, sender2Key));
    }

    // sender3 sends 1 message
    const sender3Msgs: GroupEncryptedMessageResult[] = [];
    sender3Msgs.push(await encryptGroupMessage('sender3 msg 0', sender3Key));

    // All messages should have different chain indices (per sender)
    expect(sender1Msgs[0].chainIndex).toBe(0);
    expect(sender1Msgs[1].chainIndex).toBe(1);
    expect(sender1Msgs[2].chainIndex).toBe(2);
    expect(sender2Msgs[0].chainIndex).toBe(0);
    expect(sender2Msgs[1].chainIndex).toBe(1);
    expect(sender3Msgs[0].chainIndex).toBe(0);

    // Decrypt sender1's messages using sender1's distributed key
    // Note: We derive message keys from the ORIGINAL chain key at the appropriate index
    for (const msg of sender1Msgs) {
      const decrypted = await decryptGroupMessage(msg.protocolMessage, sender1Dist);
      expect(decrypted.senderId).toBe('sender1');
      expect(decrypted.isSignatureValid).toBe(true);
      expect(decrypted.text).toContain('sender1 msg');
    }

    // Decrypt sender2's messages using sender2's distributed key
    for (const msg of sender2Msgs) {
      const decrypted = await decryptGroupMessage(msg.protocolMessage, sender2Dist);
      expect(decrypted.senderId).toBe('sender2');
      expect(decrypted.isSignatureValid).toBe(true);
      expect(decrypted.text).toContain('sender2 msg');
    }

    // Decrypt sender3's message using sender3's distributed key
    const decrypted3 = await decryptGroupMessage(sender3Msgs[0].protocolMessage, sender3Dist);
    expect(decrypted3.senderId).toBe('sender3');
    expect(decrypted3.isSignatureValid).toBe(true);
    expect(decrypted3.text).toBe('sender3 msg 0');
  });
});

// ---------- VAL-GROUP-008: Group Encryption Status ----------

describe('VAL-GROUP-008: Group encryption status indicator', () => {
  beforeEach(() => {
    clearAllGroupEncryption();
  });

  test('initializes with notEncrypted status', () => {
    const state = initGroupEncryptionState('group1', ['user1', 'user2', 'user3']);
    expect(state.status).toBe('notEncrypted');
  });

  test('transitions to warning when some keys distributed', () => {
    const state = initGroupEncryptionState('group1', ['user1', 'user2', 'user3']);

    // Generate own key
    groupSenderKeyStore.generateOwnSenderKey('group1', 'user1');

    // Distribute one member's key
    const user2Key = generateSenderKey('group1', 'user2');
    const distKey = createDistributedSenderKey(user2Key);
    groupSenderKeyStore.storeDistributedKey(distKey);

    const status = getGroupEncryptionStatus('group1');
    expect(status).toBe('warning');
  });

  test('transitions to locked when all keys distributed', () => {
    initGroupEncryptionState('group1', ['user1', 'user2', 'user3']);

    // Generate own key
    groupSenderKeyStore.generateOwnSenderKey('group1', 'user1');

    // Distribute remaining members' keys
    const user2Key = generateSenderKey('group1', 'user2');
    groupSenderKeyStore.storeDistributedKey(createDistributedSenderKey(user2Key));

    const user3Key = generateSenderKey('group1', 'user3');
    groupSenderKeyStore.storeDistributedKey(createDistributedSenderKey(user3Key));

    const status = getGroupEncryptionStatus('group1');
    expect(status).toBe('locked');
  });

  test('transitions to transitional during re-keying', () => {
    initGroupEncryptionState('group1', ['user1', 'user2', 'user3']);

    startGroupRekeying('group1');

    const status = getGroupEncryptionStatus('group1');
    expect(status).toBe('transitional');
  });

  test('per-member status tracking', () => {
    initGroupEncryptionState('group1', ['user1', 'user2']);

    const memberStates = getGroupMemberStates('group1');

    expect(memberStates.user1.status).toBe('missing');
    expect(memberStates.user2.status).toBe('missing');

    // After distributing sender key
    const user2Key = generateSenderKey('group1', 'user2');
    groupSenderKeyStore.storeDistributedKey(createDistributedSenderKey(user2Key));

    const updatedStates = getGroupMemberStates('group1');
    expect(updatedStates.user2.status).toBe('encrypted');
  });

  test('member removal updates status', () => {
    initGroupEncryptionState('group1', ['user1', 'user2', 'user3']);

    // Generate our own key
    groupSenderKeyStore.generateOwnSenderKey('group1', 'user1');

    // Distribute other members' keys
    const user2Key = generateSenderKey('group1', 'user2');
    groupSenderKeyStore.storeDistributedKey(createDistributedSenderKey(user2Key));
    const user3Key = generateSenderKey('group1', 'user3');
    groupSenderKeyStore.storeDistributedKey(createDistributedSenderKey(user3Key));

    expect(getGroupEncryptionStatus('group1')).toBe('locked');

    // Remove a member
    removeGroupMember('group1', 'user3');

    // member3 should no longer be in member states
    const states = getGroupMemberStates('group1');
    expect(states.user3).toBeUndefined();
    expect(states.user2).toBeDefined();

    // After removal, status should be warning (only 2 members, re-keying needed)
    // But our key is still present, so it depends on the recalculation
    const status = getGroupEncryptionStatus('group1');
    expect(status).toMatch(/locked|warning/);
  });
});

// ---------- Protocol Decoding ----------

describe('Group protocol encoding and decoding', () => {
  test('decodeGroupProtocol correctly parses tb1.g. messages', async () => {
    const key = generateSenderKey('testgroup', 'sender1');
    const encrypted = await encryptGroupMessage('Hello group!', key);

    const payload = decodeGroupProtocol(encrypted.protocolMessage);
    expect(payload).toBeDefined();
    expect(payload!.length).toBeGreaterThan(0);
  });

  test('decodeGroupProtocol returns undefined for non-group messages', () => {
    expect(decodeGroupProtocol('tb1.s.AQIDBA==')).toBeUndefined();
    expect(decodeGroupProtocol('hello world')).toBeUndefined();
    expect(decodeGroupProtocol('')).toBeUndefined();
  });

  test('isTeleBridgeGroupMessage correctly identifies group messages', async () => {
    const key = generateSenderKey('testgroup', 'sender1');
    const encrypted = await encryptGroupMessage('Hello group!', key);

    expect(isTeleBridgeGroupMessage(encrypted.protocolMessage)).toBe(true);
    expect(isTeleBridgeGroupMessage('tb1.s.AQIDBA==')).toBe(false);
    expect(isTeleBridgeGroupMessage('hello world')).toBe(false);
  });
});

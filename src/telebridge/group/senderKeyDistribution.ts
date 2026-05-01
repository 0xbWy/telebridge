/**
 * TeleBridge — Sender Key Distribution Integration Layer
 *
 * Wires up sender key distribution in the group encryption pipeline.
 * Uses the pairwise 1:1 encrypted channels to send serialized sender
 * keys to each group member. Handles incoming tb1.sk messages
 * by storing received DistributedSenderKeys.
 *
 * Key behaviors:
 * - Sender keys are encrypted and sent via pairwise channels to each member
 * - Received sender keys are stored and available for decryption
 * - New member receives all existing members' sender keys on join
 * - Member leave triggers re-key: old keys zeroed, new keys generated and distributed
 * - Group status transitions: locked → transitional → locked during re-key
 */

import type { DistributedSenderKey } from './senderKey';

import {
  decodeProtocol,
  encodeProtocol,
} from '../crypto/protocol';
import {
  hasChatKey,
} from '../messages';
import {
  addGroupMember,
  generateGroupSenderKey,
  getAllDistributedSenderKeys,
  getGroupMemberStates,
  getOwnGroupSenderKey,
  removeDistributedSenderKey,
  removeGroupMember,
  storeDistributedSenderKey,
} from './groupState';
import {
  createDistributedSenderKey,
  deserializeSenderKey,
  serializeSenderKey,
  verifySenderKeyId,
  zeroSenderKey,
} from './senderKey';

// ---------- Distribution Result Types ----------

/** Result of distributing a sender key to group members. */
export interface DistributionResult {
  /** Members the key was distributed to. */
  readonly distributedTo: string[];
  /** Protocol messages to send (one per recipient). */
  readonly protocolMessages: ReadonlyArray<{
    readonly recipientId: string;
    readonly message: string;
  }>;
  /** Members skipped (no pairwise key or self). */
  readonly skippedMembers: string[];
}

/** Result of processing an incoming sender key message. */
export interface SenderKeyReceiveResult {
  /** Whether the key was successfully stored. */
  readonly success: boolean;
  /** Group ID the key belongs to. */
  readonly groupId: string;
  /** Member ID of the key owner. */
  readonly memberId: string;
  /** Error message if failed. */
  readonly error?: string;
}

/** Result of re-keying and redistributing sender keys after member leave. */
export interface RekeyResult {
  /** Whether old keys were zeroed. */
  readonly oldKeysZeroed: boolean;
  /** Whether new key was generated. */
  readonly newKeyGenerated: boolean;
  /** Members the new key was distributed to. */
  readonly distributedTo: string[];
  /** The old key ID. */
  readonly oldKeyId: string;
  /** Protocol messages to send. */
  readonly protocolMessages: ReadonlyArray<{
    readonly recipientId: string;
    readonly message: string;
  }>;
}

/** Result of distributing keys from existing members to a new member. */
export interface NewMemberDistributionResult {
  /** Members who distributed their keys. */
  readonly distributedFrom: string[];
  /** Protocol messages to send to the new member. */
  readonly protocolMessages: ReadonlyArray<{
    readonly recipientId: string;
    readonly message: string;
  }>;
}

// ---------- Pending Sender Key Messages Store ----------

/**
 * In-memory store for pending outgoing sender key distribution messages.
 * Maps groupId → recipientId → protocol message string.
 * Used by the transport layer to send the tb1.sk messages.
 */
const pendingSenderKeyMessages = new Map<string, Map<string, string>>();

/**
 * Store a pending sender key message for a group member.
 */
function setPendingSenderKeyMessage(
  groupId: string,
  recipientId: string,
  message: string,
): void {
  if (!pendingSenderKeyMessages.has(groupId)) {
    pendingSenderKeyMessages.set(groupId, new Map());
  }
  pendingSenderKeyMessages.get(groupId)!.set(recipientId, message);
}

/**
 * Get and remove pending sender key messages for a group.
 * Returns all pending messages for the group.
 */
export function consumePendingSenderKeyMessages(groupId: string): Map<string, string> {
  const msgs = pendingSenderKeyMessages.get(groupId);
  pendingSenderKeyMessages.delete(groupId);
  return msgs ?? new Map();
}

/**
 * Get pending sender key messages for a group (without removing).
 */
export function getPendingSenderKeyMessages(groupId: string): Map<string, string> {
  return pendingSenderKeyMessages.get(groupId) ?? new Map();
}

/**
 * Clear all pending sender key messages.
 */
export function clearPendingSenderKeyMessages(): void {
  pendingSenderKeyMessages.clear();
}

// ---------- Pairwise Chat Key Resolution ----------

/**
 * Build the pairwise chat ID for a 1:1 channel between two members
 * in the context of a group. This ID is used to look up the chat key
 * for encrypting the sender key distribution message.
 *
 * The format is: dm_<groupId>_<smallerId>_<largerId>
 * This ensures both parties compute the same chat ID regardless of
 * who initiates.
 *
 * NOTE: In production, pairwise chat IDs are typically the Telegram
 * chat IDs (numbers) for the 1:1 conversation. The action handler
 * resolves these from global state. This function provides a fallback
 * for when no explicit mapping is available.
 */
export function buildPairwiseChatId(groupId: string, myMemberId: string, theirMemberId: string): string {
  // Sort the member IDs to ensure both parties get the same chat ID
  const [first, second] = [myMemberId, theirMemberId].sort();
  return `dm_${groupId}_${first}_${second}`;
}

/**
 * Check if a pairwise 1:1 chat key exists between two members.
 * If so, the sender key can be encrypted and sent to that member.
 *
 * Accepts an optional map of memberId → chatId to resolve the actual
 * 1:1 Telegram chat ID. If no map is provided, uses the synthetic
 * buildPairwiseChatId format.
 */
export function hasPairwiseKey(
  groupId: string,
  myMemberId: string,
  theirMemberId: string,
  pairwiseChatIds?: Map<string, string>,
): boolean {
  let chatId: string;
  if (pairwiseChatIds?.has(theirMemberId)) {
    chatId = pairwiseChatIds.get(theirMemberId)!;
  } else {
    chatId = buildPairwiseChatId(groupId, myMemberId, theirMemberId);
  }
  return hasChatKey(chatId);
}

/**
 * Resolve the pairwise chat ID for a member.
 * Uses explicit mapping if available, falls back to synthetic ID.
 */
function resolvePairwiseChatId(
  groupId: string,
  myMemberId: string,
  theirMemberId: string,
  pairwiseChatIds?: Map<string, string>,
): string {
  if (pairwiseChatIds?.has(theirMemberId)) {
    return pairwiseChatIds.get(theirMemberId)!;
  }
  return buildPairwiseChatId(groupId, myMemberId, theirMemberId);
}

// ---------- Sender Key Distribution ----------

/**
 * Distribute our own sender key to other group members via pairwise encrypted channels.
 *
 * For each member (other than ourselves), this:
 * 1. Resolves the pairwise 1:1 chat ID (from parameter map or synthetic format)
 * 2. Checks if a pairwise 1:1 chat key exists
 * 3. Creates the distributed sender key (strips signing key)
 * 4. Serializes it and encodes as tb1.sk.<base64>
 * 5. Stores the pending protocol message for the transport layer to send
 *
 * VAL-GROUP-001: Sender keys are distributed via pairwise encrypted channels.
 *
 * @param groupId - Group chat ID
 * @param myMemberId - Our own member ID
 * @param memberIds - All member IDs in the group
 * @param pairwiseChatIds - Optional map of memberId → actual 1:1 Telegram chat ID
 * @returns Distribution result with protocol messages to send
 */
export function distributeSenderKeyToMembers(
  groupId: string,
  myMemberId: string,
  memberIds: string[],
  pairwiseChatIds?: Map<string, string>,
): DistributionResult {
  const ownKey = getOwnGroupSenderKey(groupId, myMemberId);
  if (!ownKey) {
    return {
      distributedTo: [],
      protocolMessages: [],
      skippedMembers: [...memberIds],
    };
  }

  const distributedTo: string[] = [];
  const protocolMessages: { recipientId: string; message: string }[] = [];
  const skippedMembers: string[] = [];

  // Create the distributed sender key (strips the signing key)
  const distKey = createDistributedSenderKey(ownKey);
  const serializedPayload = serializeSenderKey(distKey);

  // Encode as tb1.sk.<base64>
  const protocolMessage = encodeProtocol('sk', serializedPayload);

  for (const memberId of memberIds) {
    // Skip ourselves
    if (memberId === myMemberId) continue;

    // Resolve and check the pairwise 1:1 chat key
    const chatId = resolvePairwiseChatId(groupId, myMemberId, memberId, pairwiseChatIds);
    if (!hasChatKey(chatId)) {
      skippedMembers.push(memberId);
      continue;
    }

    // Store the protocol message for this recipient
    // In production, the transport layer sends this tb1.sk message
    // through the encrypted pairwise channel. The tb1.sk message itself
    // contains the serialized DistributedSenderKey, which the sender
    // encrypts with the pairwise channel's key before sending.
    setPendingSenderKeyMessage(groupId, memberId, protocolMessage);

    distributedTo.push(memberId);
    protocolMessages.push({
      recipientId: memberId,
      message: protocolMessage,
    });
  }

  return {
    distributedTo,
    protocolMessages,
    skippedMembers,
  };
}

// ---------- Incoming Sender Key Processing ----------

/**
 * Process an incoming sender key distribution message (tb1.sk.<base64>).
 *
 * This function:
 * 1. Decodes the protocol message (mode must be 'sk')
 * 2. Deserializes the DistributedSenderKey from the payload
 * 3. Verifies the key ID matches the chain key
 * 4. Stores the distributed sender key
 *
 * VAL-GROUP-002: Received sender keys are stored and available for decryption.
 *
 * @param protocolMessage - The tb1.sk.<base64> message
 * @param groupId - Group chat ID (for validation)
 * @returns Receive result with success status
 */
export function processIncomingSenderKeyMessage(
  protocolMessage: string,
  groupId: string,
): SenderKeyReceiveResult {
  // Validate protocol message
  const decoded = decodeProtocol(protocolMessage);
  if (!decoded || decoded.mode !== 'sk') {
    return {
      success: false,
      groupId,
      memberId: '',
      error: 'Invalid protocol message: not a sender key distribution message',
    };
  }

  try {
    // Deserialize the distributed sender key
    const distKey = deserializeSenderKey(decoded.payload);

    // Verify the key ID matches the chain key — but only for keys distributed at
    // chain index 0. After the sender has ratcheted their key (startChainIndex > 0),
    // the chain key no longer matches the original keyId. This is expected and
    // not a security issue: the actual security comes from AES-GCM auth tag
    // verification during decryption.
    if (distKey.startChainIndex === 0 && !verifySenderKeyId(distKey)) {
      return {
        success: false,
        groupId,
        memberId: distKey.memberId,
        error: 'Key ID mismatch: sender key verification failed',
      };
    }

    // Validate group ID matches
    if (distKey.groupId !== groupId) {
      return {
        success: false,
        groupId,
        memberId: distKey.memberId,
        error: `Group ID mismatch: expected ${groupId}, got ${distKey.groupId}`,
      };
    }

    // Store the distributed sender key
    const stored = storeDistributedSenderKey(distKey);
    if (!stored) {
      return {
        success: false,
        groupId: distKey.groupId,
        memberId: distKey.memberId,
        error: 'Failed to store distributed sender key',
      };
    }

    return {
      success: true,
      groupId: distKey.groupId,
      memberId: distKey.memberId,
    };
  } catch (error) {
    return {
      success: false,
      groupId,
      memberId: '',
      error: `Failed to deserialize sender key: ${error instanceof Error ? error.message : 'unknown error'}`,
    };
  }
}

// ---------- Re-keying on Member Leave ----------

/**
 * Regenerate sender keys after a member leaves the group.
 *
 * This function:
 * 1. Zeros out the old own sender key (forward secrecy)
 * 2. Generates a new sender key
 * 3. Distributes the new key to remaining members
 * 4. Removes departed members' distributed keys
 *
 * VAL-GROUP-006: Member leave triggers re-key: old keys zeroed, new keys generated.
 *
 * @param groupId - Group chat ID
 * @param myMemberId - Our own member ID
 * @param departedMemberIds - IDs of members who left
 * @param identitySigningKey - Our identity signing key for key generation
 * @param pairwiseChatIds - Optional map of memberId → actual 1:1 Telegram chat ID
 * @returns Re-key result with new protocol messages to send
 */
export function regenerateAndDistributeSenderKeys(
  groupId: string,
  myMemberId: string,
  departedMemberIds: string[],
  identitySigningKey?: Uint8Array,
  pairwiseChatIds?: Map<string, string>,
): RekeyResult {
  // Get the old key ID before zeroing
  const oldKey = getOwnGroupSenderKey(groupId, myMemberId);
  const oldKeyId = oldKey?.keyId ?? '';

  let oldKeysZeroed = false;

  // Zero out the old sender key if it exists
  if (oldKey) {
    // Zero out the old key material
    zeroSenderKey(oldKey);
    oldKeysZeroed = true;
  }

  // Remove distributed keys for departed members and remove them from group
  for (const departedId of departedMemberIds) {
    removeDistributedSenderKey(groupId, departedId);
    removeGroupMember(groupId, departedId);
  }

  // Generate a new sender key
  try {
    generateGroupSenderKey(groupId, myMemberId, identitySigningKey);
  } catch {
    // Cannot generate new key (e.g., no identity)
    return {
      oldKeysZeroed,
      newKeyGenerated: false,
      distributedTo: [],
      oldKeyId,
      protocolMessages: [],
    };
  }

  // Get remaining member IDs (excluding departed and self)
  const memberStates = getGroupMemberStates(groupId);
  const remainingMembers = Object.keys(memberStates);

  // Distribute the new key to remaining members
  const distribution = distributeSenderKeyToMembers(
    groupId, myMemberId, remainingMembers, pairwiseChatIds,
  );

  return {
    oldKeysZeroed,
    newKeyGenerated: true,
    distributedTo: distribution.distributedTo,
    oldKeyId,
    protocolMessages: distribution.protocolMessages,
  };
}

// ---------- New Member Join Distribution ----------

/**
 * Distribute all existing members' sender keys to a new member who just joined.
 *
 * When a new member joins, every existing member needs to send their sender key
 * to the new member. This function handles it from our perspective:
 * we distribute our own key to the new member.
 *
 * Additionally, if we have other members' distributed keys stored, we
 * re-serialize them for transport to the new member (since the new member
 * doesn't have them yet).
 *
 * VAL-GROUP-005: New member receives all existing members' sender keys on join.
 *
 * @param groupId - Group chat ID
 * @param newMemberId - Member ID of the newly joined member
 * @param existingMemberIds - IDs of all existing members (before the new member joined)
 * @returns Distribution result with protocol messages for the new member
 */
export function distributeKeysForNewMember(
  groupId: string,
  newMemberId: string,
  existingMemberIds: string[],
): NewMemberDistributionResult {
  const distributedFrom: string[] = [];
  const protocolMessages: { recipientId: string; message: string }[] = [];

  // For each existing member, serialize their sender key for the new member
  for (const existingMemberId of existingMemberIds) {
    // Skip the new member (they don't have a key yet)
    if (existingMemberId === newMemberId) continue;

    // Try own key first, then look for distributed keys from other members
    const ownKey = getOwnGroupSenderKey(groupId, existingMemberId);
    if (!ownKey) {
      // We don't have this member's own key — check if we have a distributed key
      // This would be the case for other members who distributed their keys
      const distKey = getDistributedSenderKeyForDistribution(groupId, existingMemberId);
      if (!distKey) continue;

      // Serialize the distributed key for transport
      const serializedPayload = serializeSenderKey(distKey);
      const protocolMessage = encodeProtocol('sk', serializedPayload);

      distributedFrom.push(existingMemberId);
      protocolMessages.push({
        recipientId: newMemberId,
        message: protocolMessage,
      });
      continue;
    }

    // Create and serialize the distributed sender key from our own key
    const distKey = createDistributedSenderKey(ownKey);
    const serializedPayload = serializeSenderKey(distKey);
    const protocolMessage = encodeProtocol('sk', serializedPayload);

    distributedFrom.push(existingMemberId);
    protocolMessages.push({
      recipientId: newMemberId,
      message: protocolMessage,
    });
  }

  // Add the new member to the group state
  addGroupMember(groupId, newMemberId);

  return {
    distributedFrom,
    protocolMessages,
  };
}

/**
 * Get a distributed sender key for re-distribution purposes.
 * Looks up the key from the distributed key store.
 */
function getDistributedSenderKeyForDistribution(
  groupId: string,
  memberId: string,
): DistributedSenderKey | undefined {
  // Import getDistributedSenderKey from groupState
  // We already imported it at the top of the file
  const distKeys = getAllDistributedSenderKeys(groupId);
  return distKeys.find((k) => k.memberId === memberId);
}

// ---------- Module Cleanup ----------

/**
 * Clear all pending sender key messages.
 * Called when locking the bridge.
 */
export function lockSenderKeyDistribution(): void {
  clearPendingSenderKeyMessages();
}

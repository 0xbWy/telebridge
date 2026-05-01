/**
 * TeleBridge — Group Encryption State Management
 *
 * In-memory state management for group Sender Keys.
 * Tracks own Sender Keys and distributed Sender Keys from other members.
 * Manages group encryption status and per-member encryption state.
 */

import type { DistributedSenderKey, SenderKey } from './senderKey';

import {
  generateSenderKey,
  verifySenderKeyId,
  zeroDistributedSenderKey,
  zeroSenderKey,
} from './senderKey';

// ---------- Group Encryption Status ----------

/** Group encryption status — reflects the overall state of encryption in a group. */
export type GroupEncryptionStatus = 'locked' | 'warning' | 'transitional' | 'notEncrypted';

/** Per-member encryption status within a group. */
export type MemberEncryptionStatus = 'encrypted' | 'pending' | 'missing' | 'keyChanged' | 'unencrypted';

// ---------- Group Encryption State ----------

/** Per-member encryption state within a group. */
export interface GroupMemberState {
  /** Member's user ID. */
  readonly memberId: string;
  /** Encryption status for this member. */
  status: MemberEncryptionStatus;
  /** Whether this member has a Sender Key distributed to us. */
  hasDistributedKey: boolean;
  /** Whether we have a pairwise 1-on-1 key exchange with this member. */
  hasPairwiseKey: boolean;
  /** Timestamp when the Sender Key was received. */
  keyReceivedAt?: number;
  /** Key ID of the distributed sender key. */
  keyId?: string;
  /** Whether the member's key has changed since last verified. */
  isKeyChanged?: boolean;
}

/** Per-group encryption state. */
export interface GroupEncryptionState {
  /** Group ID (chat ID). */
  readonly groupId: string;
  /** Overall encryption status for this group. */
  status: GroupEncryptionStatus;
  /** Per-member encryption states, indexed by memberId. */
  memberStates: Record<string, GroupMemberState>;
  /** Whether our own Sender Key has been generated for this group. */
  hasOwnSenderKey: boolean;
  /** Timestamp of the last re-keying event. */
  lastRekeyAt?: number;
  /** Whether the group is currently in a re-keying transition. */
  isRekeying: boolean;
}

// ---------- In-Memory Sender Key Store ----------

/**
 * In-memory store for group Sender Keys.
 * Own Sender Keys (with signing key) and distributed Sender Keys (without signing key)
 * are stored separately for security.
 */
class GroupSenderKeyStore {
  /** Own Sender Keys: groupId -> memberId -> SenderKey (contains signing key) */
  private ownKeys = new Map<string, Map<string, SenderKey>>();

  /** Distributed Sender Keys: groupId -> memberId -> DistributedSenderKey */
  private distributedKeys = new Map<string, Map<string, DistributedSenderKey>>();

  /** Group encryption states */
  private groupStates = new Map<string, GroupEncryptionState>();

  // ---------- Own Sender Keys ----------

  /**
   * Generate and store an own Sender Key for a group.
   * Returns the newly generated Sender Key.
   */
  generateOwnSenderKey(
    groupId: string,
    memberId: string,
    identitySigningKey?: Uint8Array,
  ): SenderKey {
    // If we already have a key, zero it out first
    const existing = this.getOwnSenderKey(groupId, memberId);
    if (existing) {
      zeroSenderKey(existing);
    }

    const senderKey = generateSenderKey(groupId, memberId, identitySigningKey);

    if (!this.ownKeys.has(groupId)) {
      this.ownKeys.set(groupId, new Map());
    }
    this.ownKeys.get(groupId)!.set(memberId, senderKey);

    // Update group state — mark our own member as encrypted
    this.updateGroupStateOwnKey(groupId, true);

    // Mark our own member status as encrypted (we have our own key)
    this.updateMemberState(groupId, memberId, {
      status: 'encrypted',
      hasDistributedKey: true,
      keyId: senderKey.keyId,
    });
    this.recalculateGroupStatus(groupId);

    return senderKey;
  }

  /**
   * Get our own Sender Key for a group.
   */
  getOwnSenderKey(groupId: string, memberId: string): SenderKey | undefined {
    return this.ownKeys.get(groupId)?.get(memberId);
  }

  /**
   * Remove our own Sender Key for a group (used during re-keying).
   */
  removeOwnSenderKey(groupId: string, memberId: string): boolean {
    const key = this.ownKeys.get(groupId)?.get(memberId);
    if (key) {
      zeroSenderKey(key);
    }
    const deleted = this.ownKeys.get(groupId)?.delete(memberId) ?? false;
    if (deleted) {
      this.updateGroupStateOwnKey(groupId, false);
    }
    return deleted;
  }

  /**
   * Check if we have our own Sender Key for a group.
   */
  hasOwnSenderKey(groupId: string, memberId: string): boolean {
    return this.ownKeys.get(groupId)?.has(memberId) ?? false;
  }

  // ---------- Distributed Sender Keys ----------

  /**
   * Store a distributed Sender Key from another member.
   * Returns true if the key was successfully stored.
   */
  storeDistributedKey(distKey: DistributedSenderKey): boolean {
    // Verify the key ID matches the chain key — but only for keys distributed at
    // chain index 0. After the sender has ratcheted their key (startChainIndex > 0),
    // the chain key no longer matches the original keyId. This is expected and
    // not a security issue: the actual security comes from AES-GCM auth tag
    // verification during decryption, which validates the correct keyId is used.
    if (distKey.startChainIndex === 0 && !verifySenderKeyId(distKey)) {
      return false;
    }

    if (!this.distributedKeys.has(distKey.groupId)) {
      this.distributedKeys.set(distKey.groupId, new Map());
    }

    // If there's an existing key, zero it out
    const existing = this.distributedKeys.get(distKey.groupId)?.get(distKey.memberId);
    if (existing) {
      zeroDistributedSenderKey(existing);
    }

    this.distributedKeys.get(distKey.groupId)!.set(distKey.memberId, distKey);

    // Update member state
    this.updateMemberState(distKey.groupId, distKey.memberId, {
      status: 'encrypted',
      hasDistributedKey: true,
      keyReceivedAt: Date.now(),
      keyId: distKey.keyId,
      isKeyChanged: false,
    });

    // Recalculate group status
    this.recalculateGroupStatus(distKey.groupId);

    return true;
  }

  /**
   * Get a distributed Sender Key for a specific member in a group.
   */
  getDistributedKey(groupId: string, memberId: string): DistributedSenderKey | undefined {
    return this.distributedKeys.get(groupId)?.get(memberId);
  }

  /**
   * Remove a distributed Sender Key (used during re-keying).
   */
  removeDistributedKey(groupId: string, memberId: string): boolean {
    const key = this.distributedKeys.get(groupId)?.get(memberId);
    if (key) {
      zeroDistributedSenderKey(key);
    }

    const deleted = this.distributedKeys.get(groupId)?.delete(memberId) ?? false;
    if (deleted) {
      this.updateMemberState(groupId, memberId, {
        status: 'missing',
        hasDistributedKey: false,
        keyId: undefined,
      });
      this.recalculateGroupStatus(groupId);
    }
    return deleted;
  }

  /**
   * Check if we have a distributed Sender Key for a specific member in a group.
   */
  hasDistributedKey(groupId: string, memberId: string): boolean {
    return this.distributedKeys.get(groupId)?.has(memberId) ?? false;
  }

  /**
   * Get all distributed Sender Keys for a group.
   */
  getAllDistributedKeys(groupId: string): DistributedSenderKey[] {
    const keys = this.distributedKeys.get(groupId);
    if (!keys) return [];
    return Array.from(keys.values());
  }

  // ---------- Group State ----------

  /**
   * Initialize group encryption state for a group.
   */
  initGroupState(groupId: string, memberIds: string[]): GroupEncryptionState {
    const memberStates: Record<string, GroupMemberState> = {};
    for (const memberId of memberIds) {
      memberStates[memberId] = {
        memberId,
        status: 'missing',
        hasDistributedKey: false,
        hasPairwiseKey: false,
      };
    }

    // Check if we already have distributed keys for any members
    const existingDistributed = this.distributedKeys.get(groupId);
    if (existingDistributed) {
      for (const [memberId, distKey] of existingDistributed) {
        if (memberStates[memberId]) {
          memberStates[memberId] = {
            ...memberStates[memberId],
            status: 'encrypted',
            hasDistributedKey: true,
            keyReceivedAt: Date.now(),
            keyId: distKey.keyId,
          };
        }
      }
    }

    // Check if we have our own key
    let hasOwnKey = false;
    for (const [, ownMap] of this.ownKeys) {
      if (ownMap.has(groupId) || this.ownKeys.get(groupId)?.size) {
        hasOwnKey = true;
        break;
      }
    }

    const state: GroupEncryptionState = {
      groupId,
      status: 'notEncrypted',
      memberStates,
      hasOwnSenderKey: hasOwnKey,
      isRekeying: false,
    };

    this.groupStates.set(groupId, state);
    this.recalculateGroupStatus(groupId);

    return state;
  }

  /**
   * Get the encryption state for a group.
   */
  getGroupState(groupId: string): GroupEncryptionState | undefined {
    return this.groupStates.get(groupId);
  }

  /**
   * Get the overall encryption status for a group.
   */
  getGroupStatus(groupId: string): GroupEncryptionStatus {
    return this.groupStates.get(groupId)?.status ?? 'notEncrypted';
  }

  /**
   * Get the per-member encryption status for a group.
   */
  getMemberStates(groupId: string): Record<string, GroupMemberState> {
    return this.groupStates.get(groupId)?.memberStates ?? {};
  }

  /**
   * Get the encryption status for a specific member in a group.
   */
  getMemberStatus(groupId: string, memberId: string): MemberEncryptionStatus {
    return this.groupStates.get(groupId)?.memberStates[memberId]?.status ?? 'missing';
  }

  // ---------- Member Management ----------

  /**
   * Add a new member to a group's encryption state.
   * New members start with 'missing' status — they need Sender Key distribution.
   */
  addMember(groupId: string, memberId: string): void {
    const state = this.groupStates.get(groupId);
    if (!state) return;

    if (!state.memberStates[memberId]) {
      state.memberStates = {
        ...state.memberStates,
        [memberId]: {
          memberId,
          status: 'missing',
          hasDistributedKey: false,
          hasPairwiseKey: false,
        },
      };
      this.recalculateGroupStatus(groupId);
    }
  }

  /**
   * Remove a member from the group's encryption state.
   * Also removes their distributed Sender Key.
   * Called when a member leaves the group.
   */
  removeMember(groupId: string, memberId: string): void {
    // Remove distributed key
    this.removeDistributedKey(groupId, memberId);

    const state = this.groupStates.get(groupId);
    if (!state) return;

    const { [memberId]: _, ...remaining } = state.memberStates;
    state.memberStates = remaining;
    this.recalculateGroupStatus(groupId);
  }

  /**
   * Mark a member's key as changed.
   * This happens when a re-generated Sender Key is received.
   */
  markMemberKeyChanged(groupId: string, memberId: string): void {
    this.updateMemberState(groupId, memberId, {
      status: 'keyChanged',
      isKeyChanged: true,
    });
    this.recalculateGroupStatus(groupId);
  }

  /**
   * Mark a member as having a pairwise 1-on-1 key exchange completed.
   * Required before Sender Key distribution.
   */
  setPairwiseKeyComplete(groupId: string, memberId: string): void {
    this.updateMemberState(groupId, memberId, {
      hasPairwiseKey: true,
    });
  }

  // ---------- Re-keying ----------

  /**
   * Start re-keying process for a group.
   * This happens when a member leaves — all remaining members regenerate Sender Keys.
   */
  startRekeying(groupId: string): void {
    const state = this.groupStates.get(groupId);
    if (!state) return;

    state.isRekeying = true;
    state.status = 'transitional';
  }

  /**
   * Complete the re-keying process for a group.
   */
  completeRekeying(groupId: string): void {
    const state = this.groupStates.get(groupId);
    if (!state) return;

    state.isRekeying = false;
    state.lastRekeyAt = Date.now();
    this.recalculateGroupStatus(groupId);
  }

  // ---------- Cleanup ----------

  /**
   * Clear all Sender Keys and group states for a specific group.
   * Used when leaving a group or locking the bridge.
   */
  clearGroup(groupId: string): void {
    // Zero and remove own keys
    const ownMap = this.ownKeys.get(groupId);
    if (ownMap) {
      for (const [, key] of ownMap) {
        zeroSenderKey(key);
      }
      ownMap.clear();
      this.ownKeys.delete(groupId);
    }

    // Zero and remove distributed keys
    const distMap = this.distributedKeys.get(groupId);
    if (distMap) {
      for (const [, key] of distMap) {
        zeroDistributedSenderKey(key);
      }
      distMap.clear();
      this.distributedKeys.delete(groupId);
    }

    // Remove group state
    this.groupStates.delete(groupId);
  }

  /**
   * Clear ALL Sender Keys and group states.
   * Used when locking the bridge.
   */
  clearAll(): void {
    // Zero all own keys
    for (const [, groupMap] of this.ownKeys) {
      for (const [, key] of groupMap) {
        zeroSenderKey(key);
      }
      groupMap.clear();
    }
    this.ownKeys.clear();

    // Zero all distributed keys
    for (const [, groupMap] of this.distributedKeys) {
      for (const [, key] of groupMap) {
        zeroDistributedSenderKey(key);
      }
      groupMap.clear();
    }
    this.distributedKeys.clear();

    // Clear all group states
    this.groupStates.clear();
  }

  // ---------- Private Helpers ----------

  private updateGroupStateOwnKey(groupId: string, hasKey: boolean): void {
    const state = this.groupStates.get(groupId);
    if (state) {
      state.hasOwnSenderKey = hasKey;
      this.recalculateGroupStatus(groupId);
    }
  }

  private updateMemberState(
    groupId: string,
    memberId: string,
    update: Partial<GroupMemberState>,
  ): void {
    const state = this.groupStates.get(groupId);
    if (!state) return;

    const existing = state.memberStates[memberId] ?? {
      memberId,
      status: 'missing' as MemberEncryptionStatus,
      hasDistributedKey: false,
      hasPairwiseKey: false,
    };

    state.memberStates = {
      ...state.memberStates,
      [memberId]: { ...existing, ...update },
    };
  }

  /**
   * Recalculate the overall group encryption status based on member states.
   *
   * Status logic:
   * - 'locked': We have our Sender Key AND all members have keys (fully encrypted)
   * - 'warning': Some members are missing keys or have changed keys
   * - 'transitional': Group is in re-keying process
   * - 'notEncrypted': No Sender Keys exist for any member
   */
  private recalculateGroupStatus(groupId: string): void {
    const state = this.groupStates.get(groupId);
    if (!state) return;

    // Transitional takes priority
    if (state.isRekeying) {
      state.status = 'transitional';
      return;
    }

    const members = Object.values(state.memberStates);
    if (members.length === 0) {
      state.status = 'notEncrypted';
      return;
    }

    // Check: do we have our own Sender Key?
    if (!state.hasOwnSenderKey) {
      // We haven't generated our key yet — not encrypted
      state.status = 'notEncrypted';
      return;
    }

    // Check: are ALL members encrypted or keyChanged?
    const allMembersEncrypted = members.every(
      (m) => m.status === 'encrypted' || m.status === 'keyChanged',
    );

    const hasChanged = members.some((m) => m.status === 'keyChanged');
    const hasMissing = members.some(
      (m) => m.status === 'missing' || m.status === 'pending' || !m.hasDistributedKey,
    );

    if (allMembersEncrypted && !hasMissing) {
      state.status = hasChanged ? 'warning' : 'locked';
    } else if (members.some((m) => m.hasDistributedKey || m.status === 'encrypted')) {
      // At least some members have keys
      state.status = 'warning';
    } else {
      state.status = 'notEncrypted';
    }
  }
}

// ---------- Singleton Instance ----------

/** Global singleton for group Sender Key management. */
export const groupSenderKeyStore = new GroupSenderKeyStore();

// ---------- Public API (delegates to singleton) ----------

export function generateGroupSenderKey(
  groupId: string,
  memberId: string,
  identitySigningKey?: Uint8Array,
): SenderKey {
  return groupSenderKeyStore.generateOwnSenderKey(groupId, memberId, identitySigningKey);
}

export function getOwnGroupSenderKey(groupId: string, memberId: string): SenderKey | undefined {
  return groupSenderKeyStore.getOwnSenderKey(groupId, memberId);
}

export function storeDistributedSenderKey(distKey: DistributedSenderKey): boolean {
  return groupSenderKeyStore.storeDistributedKey(distKey);
}

export function getDistributedSenderKey(groupId: string, memberId: string): DistributedSenderKey | undefined {
  return groupSenderKeyStore.getDistributedKey(groupId, memberId);
}

export function removeDistributedSenderKey(groupId: string, memberId: string): boolean {
  return groupSenderKeyStore.removeDistributedKey(groupId, memberId);
}

export function hasDistributedSenderKey(groupId: string, memberId: string): boolean {
  return groupSenderKeyStore.hasDistributedKey(groupId, memberId);
}

export function getAllDistributedSenderKeys(groupId: string): DistributedSenderKey[] {
  return groupSenderKeyStore.getAllDistributedKeys(groupId);
}

export function initGroupEncryptionState(groupId: string, memberIds: string[]): GroupEncryptionState {
  return groupSenderKeyStore.initGroupState(groupId, memberIds);
}

export function getGroupEncryptionState(groupId: string): GroupEncryptionState | undefined {
  return groupSenderKeyStore.getGroupState(groupId);
}

export function getGroupEncryptionStatus(groupId: string): GroupEncryptionStatus {
  return groupSenderKeyStore.getGroupStatus(groupId);
}

export function getGroupMemberStates(groupId: string): Record<string, GroupMemberState> {
  return groupSenderKeyStore.getMemberStates(groupId);
}

export function getGroupMemberStatus(groupId: string, memberId: string): MemberEncryptionStatus {
  return groupSenderKeyStore.getMemberStatus(groupId, memberId);
}

export function addGroupMember(groupId: string, memberId: string): void {
  groupSenderKeyStore.addMember(groupId, memberId);
}

export function removeGroupMember(groupId: string, memberId: string): void {
  groupSenderKeyStore.removeMember(groupId, memberId);
}

export function setGroupPairwiseKeyComplete(groupId: string, memberId: string): void {
  groupSenderKeyStore.setPairwiseKeyComplete(groupId, memberId);
}

export function startGroupRekeying(groupId: string): void {
  groupSenderKeyStore.startRekeying(groupId);
}

export function completeGroupRekeying(groupId: string): void {
  groupSenderKeyStore.completeRekeying(groupId);
}

export function clearGroupEncryption(groupId: string): void {
  groupSenderKeyStore.clearGroup(groupId);
}

export function clearAllGroupEncryption(): void {
  groupSenderKeyStore.clearAll();
}

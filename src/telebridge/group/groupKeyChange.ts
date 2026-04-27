/**
 * TeleBridge — Group Key Change Detection
 *
 * Detects key changes for contacts in group chats and triggers:
 * - Non-dismissible warning banners in group chats
 * - Verification status demotion (verified → unverified)
 * - Per-member key change indicators on messages
 *
 * Also handles:
 * - Mixed encrypted/unencrypted member handling with reduced-security warnings
 * - Fallback for unencrypted groups (no Sender Key operations, no encryption UI)
 */

import type { GroupEncryptionStatus } from './groupState';

// ---------- Key Change Detection Types ----------

/** Key change event for a group member. */
export interface GroupKeyChangeEvent {
  /** Group ID where the key change was detected. */
  groupId: string;
  /** User ID of the contact whose key changed. */
  userId: string;
  /** Previous fingerprint. */
  previousFingerprint: string;
  /** New fingerprint. */
  newFingerprint: string;
  /** Timestamp of the key change. */
  timestamp: number;
  /** Whether the warning has been acknowledged. */
  isAcknowledged: boolean;
}

/** Non-dismissible warning for a group chat. */
export interface GroupKeyChangeWarning {
  /** Group ID. */
  groupId: string;
  /** User IDs of contacts whose keys changed. */
  changedUserIds: string[];
  /** Whether the warning is active. */
  isActive: boolean;
  /** Warning message key for localization. */
  messageKey: string;
  /** Timestamp when the warning was first shown. */
  firstShownAt: number;
}

/** Mixed member composition for a group. */
export interface MixedMemberComposition {
  /** Group ID. */
  groupId: string;
  /** Number of members with encryption. */
  encryptedCount: number;
  /** Number of members without encryption. */
  unencryptedCount: number;
  /** Total member count. */
  totalCount: number;
  /** User IDs of unencrypted members. */
  unencryptedMemberIds: string[];
  /** Whether the group has reduced security. */
  isReducedSecurity: boolean;
}

/** Reduced security warning for groups with mixed encryption. */
export interface ReducedSecurityWarning {
  /** Group ID. */
  groupId: string;
  /** Warning message key. */
  messageKey: string;
  /** Whether the warning is active. */
  isActive: boolean;
}

// ---------- Key Change Detection Store ----------

class GroupKeyChangeStore {
  /** Active key change events, keyed by groupId -> userId. */
  private keyChanges = new Map<string, Map<string, GroupKeyChangeEvent>>();

  /** Active non-dismissible warnings, keyed by groupId. */
  private warnings = new Map<string, GroupKeyChangeWarning>();

  /** Mixed member compositions, keyed by groupId. */
  private mixedCompositions = new Map<string, MixedMemberComposition>();

  /** Reduced security warnings, keyed by groupId. */
  private reducedSecurityWarnings = new Map<string, ReducedSecurityWarning>();

  /**
   * Record a key change for a contact in a group.
   * Creates a non-dismissible warning automatically.
   */
  recordKeyChange(
    groupId: string,
    userId: string,
    previousFingerprint: string,
    newFingerprint: string,
  ): GroupKeyChangeEvent {
    if (!this.keyChanges.has(groupId)) {
      this.keyChanges.set(groupId, new Map());
    }

    const event: GroupKeyChangeEvent = {
      groupId,
      userId,
      previousFingerprint,
      newFingerprint,
      timestamp: Date.now(),
      isAcknowledged: false,
    };

    this.keyChanges.get(groupId)!.set(userId, event);

    // Update or create the non-dismissible warning
    this.updateWarning(groupId);

    return event;
  }

  /**
   * Get all key change events for a group.
   */
  getKeyChanges(groupId: string): GroupKeyChangeEvent[] {
    const groupChanges = this.keyChanges.get(groupId);
    if (!groupChanges) return [];
    return Array.from(groupChanges.values());
  }

  /**
   * Get key change event for a specific user in a group.
   */
  getKeyChange(groupId: string, userId: string): GroupKeyChangeEvent | undefined {
    return this.keyChanges.get(groupId)?.get(userId);
  }

  /**
   * Acknowledge a key change for a user in a group.
   * Note: This does NOT dismiss the group warning — group warnings are non-dismissible.
   * It only marks the individual event as acknowledged.
   */
  acknowledgeKeyChange(groupId: string, userId: string): void {
    const event = this.keyChanges.get(groupId)?.get(userId);
    if (event) {
      event.isAcknowledged = true;
    }
    // Do NOT remove the group warning — group warnings are non-dismissible
    // until the contact is re-verified
  }

  /**
   * Clear key change for a user (after re-verification).
   */
  clearKeyChange(groupId: string, userId: string): void {
    const groupChanges = this.keyChanges.get(groupId);
    if (groupChanges) {
      groupChanges.delete(userId);
      if (groupChanges.size === 0) {
        this.keyChanges.delete(groupId);
        this.warnings.delete(groupId);
      } else {
        this.updateWarning(groupId);
      }
    }
  }

  /**
   * Get the active warning for a group.
   * Group key change warnings are NON-DISMISSIBLE.
   */
  getWarning(groupId: string): GroupKeyChangeWarning | undefined {
    return this.warnings.get(groupId);
  }

  /**
   * Check if a group has an active key change warning.
   */
  hasWarning(groupId: string): boolean {
    const warning = this.warnings.get(groupId);
    return warning?.isActive ?? false;
  }

  /**
   * Update the non-dismissible warning for a group.
   * Called after key change events are added or removed.
   */
  private updateWarning(groupId: string): void {
    const groupChanges = this.keyChanges.get(groupId);
    if (!groupChanges || groupChanges.size === 0) {
      this.warnings.delete(groupId);
      return;
    }

    const changedUserIds = Array.from(groupChanges.keys());

    // Determine the appropriate message key based on number of changed contacts
    const messageKey = changedUserIds.length === 1
      ? 'TeleBridgeGroupKeyChangeWarning'
      : 'TeleBridgeGroupKeyChangeWarningMultiple';

    const existing = this.warnings.get(groupId);

    this.warnings.set(groupId, {
      groupId,
      changedUserIds,
      isActive: true,
      messageKey,
      firstShownAt: existing?.firstShownAt ?? Date.now(),
    });
  }

  // ---------- Mixed Member Handling ----------

  /**
   * Update the mixed member composition for a group.
   */
  updateMixedComposition(
    groupId: string,
    encryptedCount: number,
    unencryptedCount: number,
    unencryptedMemberIds: string[],
  ): MixedMemberComposition {
    const totalCount = encryptedCount + unencryptedCount;
    const isReducedSecurity = unencryptedCount > 0 && encryptedCount > 0;

    const composition: MixedMemberComposition = {
      groupId,
      encryptedCount,
      unencryptedCount,
      totalCount,
      unencryptedMemberIds,
      isReducedSecurity,
    };

    this.mixedCompositions.set(groupId, composition);

    // Update reduced security warning
    if (isReducedSecurity) {
      this.reducedSecurityWarnings.set(groupId, {
        groupId,
        messageKey: 'TeleBridgeGroupReducedSecurity',
        isActive: true,
      });
    } else {
      this.reducedSecurityWarnings.delete(groupId);
    }

    return composition;
  }

  /**
   * Get the mixed member composition for a group.
   */
  getMixedComposition(groupId: string): MixedMemberComposition | undefined {
    return this.mixedCompositions.get(groupId);
  }

  /**
   * Get the reduced security warning for a group.
   */
  getReducedSecurityWarning(groupId: string): ReducedSecurityWarning | undefined {
    return this.reducedSecurityWarnings.get(groupId);
  }

  /**
   * Check if a group has reduced security.
   */
  isReducedSecurity(groupId: string): boolean {
    return this.reducedSecurityWarnings.has(groupId);
  }

  // ---------- Unencrypted Group Fallback ----------

  /**
   * Determine whether a group should show any encryption UI artifacts.
   * Unencrypted groups (no Sender Key operations initiated) should show
   * no encryption indicators, no lock icons, and no Sender Key operations.
   *
   * @param groupEncryptionStatus - The group's encryption status
   * @returns true if the group should show NO encryption artifacts
   */
  shouldHideEncryptionArtifacts(groupEncryptionStatus: GroupEncryptionStatus): boolean {
    return groupEncryptionStatus === 'notEncrypted';
  }

  /**
   * Determine if a group's encryption status means it's fully
   * unencrypted and should have no Sender Key operations.
   */
  isUnencryptedGroup(groupEncryptionStatus: GroupEncryptionStatus): boolean {
    return groupEncryptionStatus === 'notEncrypted';
  }

  // ---------- Cleanup ----------

  /**
   * Clear all key changes and warnings for a specific group.
   */
  clearGroup(groupId: string): void {
    this.keyChanges.delete(groupId);
    this.warnings.delete(groupId);
    this.mixedCompositions.delete(groupId);
    this.reducedSecurityWarnings.delete(groupId);
  }

  /**
   * Clear all data.
   */
  clearAll(): void {
    this.keyChanges.clear();
    this.warnings.clear();
    this.mixedCompositions.clear();
    this.reducedSecurityWarnings.clear();
  }
}

// ---------- Singleton ----------

export const groupKeyChangeStore = new GroupKeyChangeStore();

// ---------- Public API ----------

export function recordGroupKeyChange(
  groupId: string,
  userId: string,
  previousFingerprint: string,
  newFingerprint: string,
): GroupKeyChangeEvent {
  return groupKeyChangeStore.recordKeyChange(groupId, userId, previousFingerprint, newFingerprint);
}

export function getGroupKeyChanges(groupId: string): GroupKeyChangeEvent[] {
  return groupKeyChangeStore.getKeyChanges(groupId);
}

export function getGroupKeyChange(groupId: string, userId: string): GroupKeyChangeEvent | undefined {
  return groupKeyChangeStore.getKeyChange(groupId, userId);
}

export function acknowledgeGroupKeyChange(groupId: string, userId: string): void {
  groupKeyChangeStore.acknowledgeKeyChange(groupId, userId);
}

export function clearGroupKeyChange(groupId: string, userId: string): void {
  groupKeyChangeStore.clearKeyChange(groupId, userId);
}

export function getGroupKeyChangeWarning(groupId: string): GroupKeyChangeWarning | undefined {
  return groupKeyChangeStore.getWarning(groupId);
}

export function hasGroupKeyChangeWarning(groupId: string): boolean {
  return groupKeyChangeStore.hasWarning(groupId);
}

export function updateGroupMixedComposition(
  groupId: string,
  encryptedCount: number,
  unencryptedCount: number,
  unencryptedMemberIds: string[],
): MixedMemberComposition {
  return groupKeyChangeStore.updateMixedComposition(groupId, encryptedCount, unencryptedCount, unencryptedMemberIds);
}

export function getGroupMixedComposition(groupId: string): MixedMemberComposition | undefined {
  return groupKeyChangeStore.getMixedComposition(groupId);
}

export function getGroupReducedSecurityWarning(groupId: string): ReducedSecurityWarning | undefined {
  return groupKeyChangeStore.getReducedSecurityWarning(groupId);
}

export function isGroupReducedSecurity(groupId: string): boolean {
  return groupKeyChangeStore.isReducedSecurity(groupId);
}

export function shouldHideEncryptionArtifacts(groupEncryptionStatus: GroupEncryptionStatus): boolean {
  return groupKeyChangeStore.shouldHideEncryptionArtifacts(groupEncryptionStatus);
}

export function isUnencryptedGroup(groupEncryptionStatus: GroupEncryptionStatus): boolean {
  return groupKeyChangeStore.isUnencryptedGroup(groupEncryptionStatus);
}

export function clearGroupKeyChangeData(groupId: string): void {
  groupKeyChangeStore.clearGroup(groupId);
}

export function clearAllGroupKeyChangeData(): void {
  groupKeyChangeStore.clearAll();
}

/**
 * TeleBridge — Contact Verification State
 *
 * Manages contact verification states (verified, unverified, unknown),
 * key history tracking, and key change detection for both 1:1 and group chats.
 *
 * Verification states:
 * - 'verified': Contact's key has been verified in person (via QR) or manually (safety number)
 * - 'unverified': Contact's key has changed since last verification
 * - 'unknown': No verification has been performed (TOFU auto-accepted)
 */

import { computeFingerprint, type QrVerificationResult, verifyQrFingerprint } from './identityQr';

// ---------- Types ----------

/** Verification status of a contact's key. */
export type ContactVerificationStatus = 'verified' | 'unverified' | 'unknown';

/** Key change event in a contact's key history. */
export interface KeyHistoryEntry {
  /** Ed25519 public key fingerprint (hex, 64 chars). */
  fingerprint: string;
  /** Timestamp when this key was first seen. */
  firstSeenAt: number;
  /** Timestamp when this key was last active. */
  lastSeenAt: number;
  /** How the key was seen (e.g., 'qr_scan', 'key_exchange', 'key_change'). */
  seenVia: string;
  /** Whether this key has been verified. */
  isVerified: boolean;
  /** Whether this key is the current active key. */
  isCurrent: boolean;
}

/** A contact's verification state. */
export interface ContactVerificationState {
  /** User ID of the contact. */
  readonly userId: string;
  /** Current verification status. */
  status: ContactVerificationStatus;
  /** Current key fingerprint. */
  currentFingerprint?: string;
  /** Whether this contact was auto-accepted via TOFU. */
  isTofuAccepted: boolean;
  /** Timestamp of last verification. */
  lastVerifiedAt?: number;
  /** History of key changes. */
  keyHistory: KeyHistoryEntry[];
  /** Number of key changes (convenience counter). */
  keyChangeCount: number;
}

/** Result of processing a key change for a contact. */
export interface KeyChangeResult {
  /** The contact's new verification status. */
  newStatus: ContactVerificationStatus;
  /** Whether this was actually a key change (different fingerprint). */
  isKeyChange: boolean;
  /** The previous fingerprint, if it changed. */
  previousFingerprint?: string;
  /** The new fingerprint. */
  newFingerprint?: string;
}

// ---------- In-Memory Contact Store ----------

class ContactVerificationStore {
  /** Contact verification states, indexed by userId. */
  private contacts = new Map<string, ContactVerificationState>();

  /**
   * Initialize or update a contact's verification state.
   * Called when we first learn about a contact's key.
   */
  initContact(userId: string, fingerprint: string, via: string = 'key_exchange'): ContactVerificationState {
    const existing = this.contacts.get(userId);

    if (existing) {
      // Contact already known — check for key change
      if (existing.currentFingerprint && existing.currentFingerprint !== fingerprint) {
        // Key has changed!
        return this.processKeyChange(userId, fingerprint, via).newStatus === existing.status
          ? existing
          : this.getContact(userId)!;
      }

      // Same key — update lastSeenAt
      existing.keyHistory = existing.keyHistory.map((entry) =>
        entry.isCurrent
          ? { ...entry, lastSeenAt: Date.now() }
          : entry,
      );

      return existing;
    }

    // New contact — start as unknown (TOFU)
    const now = Date.now();
    const state: ContactVerificationState = {
      userId,
      status: 'unknown',
      currentFingerprint: fingerprint,
      isTofuAccepted: true, // Default TOFU
      keyHistory: [{
        fingerprint,
        firstSeenAt: now,
        lastSeenAt: now,
        seenVia: via,
        isVerified: false,
        isCurrent: true,
      }],
      keyChangeCount: 0,
    };

    this.contacts.set(userId, state);
    return state;
  }

  /**
   * Process a key change for a contact.
   * Moves the contact to 'unverified' if they were verified,
   * and updates key history.
   */
  processKeyChange(userId: string, newFingerprint: string, via: string = 'key_change'): KeyChangeResult {
    const existing = this.contacts.get(userId);

    if (!existing) {
      // New contact — not a key change, just initial contact
      this.initContact(userId, newFingerprint, via);
      return {
        newStatus: 'unknown',
        isKeyChange: false,
        newFingerprint,
      };
    }

    if (existing.currentFingerprint === newFingerprint) {
      // Same key — not a change
      return {
        newStatus: existing.status,
        isKeyChange: false,
        newFingerprint,
      };
    }

    const previousFingerprint = existing.currentFingerprint;
    const now = Date.now();

    // Demote verified contacts to unverified on key change
    const newStatus: ContactVerificationStatus = existing.status === 'verified' ? 'unverified' : 'unverified';

    // Mark old entries as not current
    const updatedHistory = existing.keyHistory.map((entry) => ({
      ...entry,
      isCurrent: false,
    }));

    // Add new key entry
    updatedHistory.push({
      fingerprint: newFingerprint,
      firstSeenAt: now,
      lastSeenAt: now,
      seenVia: via,
      isVerified: false,
      isCurrent: true,
    });

    // Update state
    const newState: ContactVerificationState = {
      ...existing,
      status: newStatus,
      currentFingerprint: newFingerprint,
      isTofuAccepted: false, // Key change resets TOFU trust
      keyHistory: updatedHistory,
      keyChangeCount: existing.keyChangeCount + 1,
    };

    this.contacts.set(userId, newState);

    return {
      newStatus,
      isKeyChange: true,
      previousFingerprint,
      newFingerprint,
    };
  }

  /**
   * Mark a contact as verified (e.g., after QR scan or safety number match).
   */
  verifyContact(userId: string): ContactVerificationState | undefined {
    const existing = this.contacts.get(userId);
    if (!existing) return undefined;

    const now = Date.now();
    const newState: ContactVerificationState = {
      ...existing,
      status: 'verified',
      lastVerifiedAt: now,
      isTofuAccepted: false, // Manual verification overrides TOFU
    };

    // Mark current key as verified in history
    newState.keyHistory = newState.keyHistory.map((entry) =>
      entry.isCurrent
        ? { ...entry, isVerified: true }
        : entry,
    );

    this.contacts.set(userId, newState);
    return newState;
  }

  /**
   * Mark a contact as unverified (e.g., after a key change or manual action).
   */
  unverifyContact(userId: string): ContactVerificationState | undefined {
    const existing = this.contacts.get(userId);
    if (!existing) return undefined;

    const newState: ContactVerificationState = {
      ...existing,
      status: 'unverified',
    };

    this.contacts.set(userId, newState);
    return newState;
  }

  /**
   * Get a contact's verification state.
   */
  getContact(userId: string): ContactVerificationState | undefined {
    return this.contacts.get(userId);
  }

  /**
   * Get all contacts.
   */
  getAllContacts(): ContactVerificationState[] {
    return Array.from(this.contacts.values());
  }

  /**
   * Get contacts by verification status.
   */
  getContactsByStatus(status: ContactVerificationStatus): ContactVerificationState[] {
    return this.getAllContacts().filter((c) => c.status === status);
  }

  /**
   * Get verified contacts.
   */
  getVerifiedContacts(): ContactVerificationState[] {
    return this.getContactsByStatus('verified');
  }

  /**
   * Get unverified contacts.
   */
  getUnverifiedContacts(): ContactVerificationState[] {
    return this.getContactsByStatus('unverified');
  }

  /**
   * Get unknown contacts (TOFU auto-accepted).
   */
  getUnknownContacts(): ContactVerificationState[] {
    return this.getContactsByStatus('unknown');
  }

  /**
   * Get key history for a contact.
   */
  getKeyHistory(userId: string): KeyHistoryEntry[] {
    return this.contacts.get(userId)?.keyHistory ?? [];
  }

  /**
   * Verify a scanned QR code and update contact verification state.
   */
  verifyContactFromQr(userId: string, scannedUri: string): QrVerificationResult {
    const contact = this.contacts.get(userId);
    if (!contact || !contact.currentFingerprint) return 'unknown_contact';

    const result = verifyQrFingerprint(scannedUri, contact.currentFingerprint);

    if (result === 'verified') {
      this.verifyContact(userId);
    } else if (result === 'mismatch') {
      // Key mismatch — the scanned QR has a different fingerprint
      // This could mean the contact has a new key, or someone is impersonating
      this.unverifyContact(userId);
    }

    return result;
  }

  /**
   * Remove a contact's verification state.
   */
  removeContact(userId: string): boolean {
    return this.contacts.delete(userId);
  }

  /**
   * Clear all contact verification states.
   */
  clearAll(): void {
    this.contacts.clear();
  }
}

// ---------- Singleton ----------

export const contactVerificationStore = new ContactVerificationStore();

// ---------- Public API ----------

export function initContact(userId: string, fingerprint: string, via?: string): ContactVerificationState {
  return contactVerificationStore.initContact(userId, fingerprint, via);
}

export function processContactKeyChange(userId: string, newFingerprint: string, via?: string): KeyChangeResult {
  return contactVerificationStore.processKeyChange(userId, newFingerprint, via);
}

export function verifyContact(userId: string): ContactVerificationState | undefined {
  return contactVerificationStore.verifyContact(userId);
}

export function unverifyContact(userId: string): ContactVerificationState | undefined {
  return contactVerificationStore.unverifyContact(userId);
}

export function getContactVerification(userId: string): ContactVerificationState | undefined {
  return contactVerificationStore.getContact(userId);
}

export function getAllContacts(): ContactVerificationState[] {
  return contactVerificationStore.getAllContacts();
}

export function getVerifiedContacts(): ContactVerificationState[] {
  return contactVerificationStore.getVerifiedContacts();
}

export function getUnverifiedContacts(): ContactVerificationState[] {
  return contactVerificationStore.getUnverifiedContacts();
}

export function getUnknownContacts(): ContactVerificationState[] {
  return contactVerificationStore.getUnknownContacts();
}

export function getContactKeyHistory(userId: string): KeyHistoryEntry[] {
  return contactVerificationStore.getKeyHistory(userId);
}

export function verifyContactFromQr(userId: string, scannedUri: string): QrVerificationResult {
  return contactVerificationStore.verifyContactFromQr(userId, scannedUri);
}

export function removeContact(userId: string): boolean {
  return contactVerificationStore.removeContact(userId);
}

export function clearAllContactVerification(): void {
  contactVerificationStore.clearAll();
}

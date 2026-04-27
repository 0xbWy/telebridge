/**
 * TeleBridge — Identity QR Verification & Contact Management Tests
 *
 * Tests for:
 * - Identity QR generation and parsing (VAL-GROUP-010)
 * - QR verification flow (VAL-GROUP-009)
 * - Contact verification state transitions (VAL-GROUP-011)
 * - Key change detection and demotion (VAL-GROUP-012, VAL-CROSS-013)
 * - Mixed member handling (VAL-GROUP-014)
 * - Unencrypted group fallback (VAL-GROUP-013)
 */
import {
  computeFingerprint,
  generateVerificationUri,
  parseVerificationUri,
  formatSafetyNumber,
  computeCrossPartySafetyNumber,
  verifyScannedQr,
  verifyQrFingerprint,
  VERIFICATION_URI_SCHEME,
} from '../src/telebridge/identity/identityQr';

import {
  initContact,
  processContactKeyChange,
  verifyContact,
  unverifyContact,
  getContactVerification,
  getVerifiedContacts,
  getUnverifiedContacts,
  getUnknownContacts,
  getContactKeyHistory,
  verifyContactFromQr,
  clearAllContactVerification,
} from '../src/telebridge/identity/contactVerification';

import {
  recordGroupKeyChange,
  getGroupKeyChanges,
  getGroupKeyChangeWarning,
  hasGroupKeyChangeWarning,
  acknowledgeGroupKeyChange,
  clearGroupKeyChange,
  updateGroupMixedComposition,
  getGroupMixedComposition,
  getGroupReducedSecurityWarning,
  isGroupReducedSecurity,
  shouldHideEncryptionArtifacts,
  isUnencryptedGroup,
  clearAllGroupKeyChangeData,
} from '../src/telebridge/group/groupKeyChange';

import {
  generateIdentityKeypair,
} from '../src/telebridge/crypto/identity';

// ---------- Identity QR (VAL-GROUP-010) ----------

describe('Identity QR Verification', () => {
  describe('computeFingerprint', () => {
    it('computes SHA-256 fingerprint from Ed25519 public key', () => {
      const keypair = generateIdentityKeypair();
      const fingerprint = computeFingerprint(keypair.verifyingBytes);

      // SHA-256 of 32 bytes produces 64 hex chars
      expect(fingerprint).toHaveLength(64);
      expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces deterministic fingerprint for same key', () => {
      const keypair = generateIdentityKeypair();
      const fp1 = computeFingerprint(keypair.verifyingBytes);
      const fp2 = computeFingerprint(keypair.verifyingBytes);
      expect(fp1).toBe(fp2);
    });

    it('produces different fingerprints for different keys', () => {
      const keypair1 = generateIdentityKeypair();
      const keypair2 = generateIdentityKeypair();
      const fp1 = computeFingerprint(keypair1.verifyingBytes);
      const fp2 = computeFingerprint(keypair2.verifyingBytes);
      expect(fp1).not.toBe(fp2);
    });

    it('rejects wrong-length keys', () => {
      expect(() => computeFingerprint(new Uint8Array(16))).toThrow('32 bytes');
      expect(() => computeFingerprint(new Uint8Array(64))).toThrow('32 bytes');
    });

    it('rejects non-Uint8Array inputs', () => {
      expect(() => computeFingerprint('not an array' as any)).toThrow('Uint8Array');
    });
  });

  describe('generateVerificationUri', () => {
    it('generates telebridge://verify URI with fingerprint', () => {
      const keypair = generateIdentityKeypair();
      const fingerprint = computeFingerprint(keypair.verifyingBytes);
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
      });

      expect(uri).toContain('telebridge://verify?');
      expect(uri).toContain(`fingerprint=${fingerprint}`);
    });

    it('includes userId when provided', () => {
      const keypair = generateIdentityKeypair();
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        userId: '12345',
      });

      expect(uri).toContain('userId=12345');
    });

    it('includes displayName when provided', () => {
      const keypair = generateIdentityKeypair();
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        displayName: 'Alice',
      });

      expect(uri).toContain('displayName=Alice');
    });

    it('URL-encodes special characters in displayName', () => {
      const keypair = generateIdentityKeypair();
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        displayName: 'Alice & Bob',
      });

      expect(uri).toContain('displayName=Alice%20%26%20Bob');
    });
  });

  describe('parseVerificationUri', () => {
    it('parses valid telebridge://verify URI', () => {
      const keypair = generateIdentityKeypair();
      const fingerprint = computeFingerprint(keypair.verifyingBytes);
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        userId: '12345',
      });

      const parsed = parseVerificationUri(uri);
      expect(parsed).toBeDefined();
      expect(parsed!.fingerprint).toBe(fingerprint);
      expect(parsed!.userId).toBe('12345');
    });

    it('rejects non-telebridge URIs', () => {
      expect(parseVerificationUri('https://example.com')).toBeUndefined();
      expect(parseVerificationUri('tg://resolve?domain=test')).toBeUndefined();
    });

    it('rejects URIs without fingerprint parameter', () => {
      expect(parseVerificationUri('telebridge://verify?userId=123')).toBeUndefined();
    });

    it('rejects URIs with malformed fingerprint', () => {
      expect(parseVerificationUri('telebridge://verify?fingerprint=abc')).toBeUndefined();
      expect(parseVerificationUri('telebridge://verify?fingerprint=12345')).toBeUndefined();
    });

    it('round-trips with generateVerificationUri', () => {
      const keypair = generateIdentityKeypair();
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        userId: 'test-user',
        displayName: 'Test User',
      });

      const parsed = parseVerificationUri(uri);
      expect(parsed).toBeDefined();
      expect(parsed!.fingerprint).toHaveLength(64);
    });
  });

  describe('formatSafetyNumber', () => {
    it('formats fingerprint as grouped numeric string', () => {
      const keypair = generateIdentityKeypair();
      const fingerprint = computeFingerprint(keypair.verifyingBytes);
      const safetyNumber = formatSafetyNumber(fingerprint);

      // Should be grouped by spaces
      expect(safetyNumber).toContain(' ');
      // Should not be empty
      expect(safetyNumber.length).toBeGreaterThan(0);
    });

    it('rejects invalid fingerprint format', () => {
      expect(() => formatSafetyNumber('invalid')).toThrow('Invalid fingerprint');
      expect(() => formatSafetyNumber('')).toThrow('Invalid fingerprint');
    });
  });

  describe('computeCrossPartySafetyNumber', () => {
    it('produces the same number regardless of key order', () => {
      const keypair1 = generateIdentityKeypair();
      const keypair2 = generateIdentityKeypair();

      const number1 = computeCrossPartySafetyNumber(keypair1.verifyingBytes, keypair2.verifyingBytes);
      const number2 = computeCrossPartySafetyNumber(keypair2.verifyingBytes, keypair1.verifyingBytes);

      expect(number1).toBe(number2);
    });

    it('produces different numbers for different key pairs', () => {
      const keypair1 = generateIdentityKeypair();
      const keypair2 = generateIdentityKeypair();
      const keypair3 = generateIdentityKeypair();

      const number12 = computeCrossPartySafetyNumber(keypair1.verifyingBytes, keypair2.verifyingBytes);
      const number13 = computeCrossPartySafetyNumber(keypair1.verifyingBytes, keypair3.verifyingBytes);

      expect(number12).not.toBe(number13);
    });
  });

  describe('verifyScannedQr', () => {
    it('returns "verified" when fingerprints match', () => {
      const keypair = generateIdentityKeypair();
      const uri = generateVerificationUri({ ed25519PublicKey: keypair.verifyingBytes });
      const result = verifyScannedQr(uri, keypair.verifyingBytes);
      expect(result).toBe('verified');
    });

    it('returns "mismatch" when fingerprints differ', () => {
      const keypair1 = generateIdentityKeypair();
      const keypair2 = generateIdentityKeypair();
      const uri = generateVerificationUri({ ed25519PublicKey: keypair2.verifyingBytes });
      const result = verifyScannedQr(uri, keypair1.verifyingBytes);
      expect(result).toBe('mismatch');
    });
  });
});

// ---------- Contact Management (VAL-GROUP-011) ----------

describe('Contact Verification Management', () => {
  beforeEach(() => {
    clearAllContactVerification();
  });

  describe('initContact', () => {
    it('initializes a contact with unknown status (TOFU)', () => {
      const contact = initContact('user-1', 'abc123def456');
      expect(contact.userId).toBe('user-1');
      expect(contact.status).toBe('unknown');
      expect(contact.currentFingerprint).toBe('abc123def456');
      expect(contact.isTofuAccepted).toBe(true);
      expect(contact.keyChangeCount).toBe(0);
    });

    it('updates lastSeenAt for existing contact with same fingerprint', () => {
      initContact('user-1', 'abc123def456');
      const contact = initContact('user-1', 'abc123def456');
      expect(contact.status).toBe('unknown');
      expect(contact.keyChangeCount).toBe(0);
    });
  });

  describe('processContactKeyChange', () => {
    it('detects key change and demotes to unverified', () => {
      initContact('user-1', 'fingerprint-old');
      const result = processContactKeyChange('user-1', 'fingerprint-new', 'key_change');

      expect(result.isKeyChange).toBe(true);
      expect(result.newStatus).toBe('unverified');
      expect(result.previousFingerprint).toBe('fingerprint-old');
      expect(result.newFingerprint).toBe('fingerprint-new');

      const contact = getContactVerification('user-1')!;
      expect(contact.status).toBe('unverified');
      expect(contact.currentFingerprint).toBe('fingerprint-new');
      expect(contact.keyChangeCount).toBe(1);
    });

    it('demotes verified contact to unverified on key change', () => {
      initContact('user-1', 'fingerprint-old');
      verifyContact('user-1');

      const contactBefore = getContactVerification('user-1')!;
      expect(contactBefore.status).toBe('verified');

      processContactKeyChange('user-1', 'fingerprint-new', 'key_change');
      const contactAfter = getContactVerification('user-1')!;
      expect(contactAfter.status).toBe('unverified');
    });

    it('is not a key change if fingerprints match', () => {
      initContact('user-1', 'fingerprint-same');
      const result = processContactKeyChange('user-1', 'fingerprint-same', 'key_exchange');
      expect(result.isKeyChange).toBe(false);
    });

    it('tracks key history', () => {
      initContact('user-1', 'fingerprint-v1');
      processContactKeyChange('user-1', 'fingerprint-v2', 'key_change');

      const history = getContactKeyHistory('user-1');
      expect(history).toHaveLength(2);
      expect(history[0].fingerprint).toBe('fingerprint-v1');
      expect(history[0].isCurrent).toBe(false);
      expect(history[1].fingerprint).toBe('fingerprint-v2');
      expect(history[1].isCurrent).toBe(true);
    });
  });

  describe('verification badges', () => {
    it('tracks verified contacts', () => {
      initContact('user-1', 'fp1');
      initContact('user-2', 'fp2');
      verifyContact('user-1');

      const verified = getVerifiedContacts();
      expect(verified).toHaveLength(1);
      expect(verified[0].userId).toBe('user-1');
      expect(verified[0].status).toBe('verified');
    });

    it('tracks unverified contacts', () => {
      initContact('user-1', 'fp1');
      initContact('user-2', 'fp2');
      unverifyContact('user-1');

      const unverified = getUnverifiedContacts();
      expect(unverified.length).toBeGreaterThanOrEqual(1);
      expect(unverified.some((c) => c.userId === 'user-1')).toBe(true);
    });

    it('tracks unknown (TOFU) contacts', () => {
      initContact('user-3', 'fp3');

      const unknown = getUnknownContacts();
      expect(unknown).toHaveLength(1);
      expect(unknown[0].userId).toBe('user-3');
      expect(unknown[0].status).toBe('unknown');
    });
  });

  describe('verifyContactFromQr', () => {
    it('marks contact as verified when QR matches', () => {
      const keypair = generateIdentityKeypair();
      const fingerprint = computeFingerprint(keypair.verifyingBytes);

      initContact('user-1', fingerprint);
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair.verifyingBytes,
        userId: 'user-1',
      });

      const result = verifyContactFromQr('user-1', uri);
      expect(result).toBe('verified');

      const contact = getContactVerification('user-1')!;
      expect(contact.status).toBe('verified');
    });

    it('marks contact as unverified when QR does not match', () => {
      const keypair1 = generateIdentityKeypair();
      const keypair2 = generateIdentityKeypair();
      const fingerprint1 = computeFingerprint(keypair1.verifyingBytes);

      initContact('user-1', fingerprint1);
      const uri = generateVerificationUri({
        ed25519PublicKey: keypair2.verifyingBytes,
        userId: 'user-1',
      });

      const result = verifyContactFromQr('user-1', uri);
      expect(result).toBe('mismatch');

      const contact = getContactVerification('user-1')!;
      expect(contact.status).toBe('unverified');
    });
  });
});

// ---------- Group Key Change Detection (VAL-GROUP-012) ----------

describe('Group Key Change Detection', () => {
  beforeEach(() => {
    clearAllGroupKeyChangeData();
  });

  it('records a key change and creates a non-dismissible warning', () => {
    const event = recordGroupKeyChange('group-1', 'user-1', 'old-fp', 'new-fp');
    expect(event.groupId).toBe('group-1');
    expect(event.userId).toBe('user-1');
    expect(event.isAcknowledged).toBe(false);

    const warning = getGroupKeyChangeWarning('group-1');
    expect(warning).toBeDefined();
    expect(warning!.isActive).toBe(true);
    expect(warning!.changedUserIds).toContain('user-1');

    expect(hasGroupKeyChangeWarning('group-1')).toBe(true);
  });

  it('creates multi-user warning for multiple key changes', () => {
    recordGroupKeyChange('group-1', 'user-1', 'fp-old-1', 'fp-new-1');
    recordGroupKeyChange('group-1', 'user-2', 'fp-old-2', 'fp-new-2');

    const warning = getGroupKeyChangeWarning('group-1')!;
    expect(warning.changedUserIds).toContain('user-1');
    expect(warning.changedUserIds).toContain('user-2');
    expect(warning.messageKey).toBe('TeleBridgeGroupKeyChangeWarningMultiple');
  });

  it('single key change uses singular message key', () => {
    recordGroupKeyChange('group-1', 'user-1', 'fp-old', 'fp-new');

    const warning = getGroupKeyChangeWarning('group-1')!;
    expect(warning.messageKey).toBe('TeleBridgeGroupKeyChangeWarning');
  });

  it('acknowledging does not dismiss group warning (non-dismissible)', () => {
    recordGroupKeyChange('group-1', 'user-1', 'fp-old', 'fp-new');
    acknowledgeGroupKeyChange('group-1', 'user-1');

    // Warning should still be active
    expect(hasGroupKeyChangeWarning('group-1')).toBe(true);
  });

  it('clearing key change (after re-verification) removes warning when empty', () => {
    recordGroupKeyChange('group-1', 'user-1', 'fp-old', 'fp-new');
    clearGroupKeyChange('group-1', 'user-1');

    expect(hasGroupKeyChangeWarning('group-1')).toBe(false);
  });
});

// ---------- Mixed Member Handling (VAL-GROUP-014) ----------

describe('Mixed Member Handling', () => {
  beforeEach(() => {
    clearAllGroupKeyChangeData();
  });

  it('detects reduced security when group has mixed members', () => {
    const composition = updateGroupMixedComposition('group-1', 5, 3, ['user-7', 'user-8', 'user-9']);

    expect(composition.isReducedSecurity).toBe(true);
    expect(composition.encryptedCount).toBe(5);
    expect(composition.unencryptedCount).toBe(3);
    expect(composition.totalCount).toBe(8);
    expect(composition.unencryptedMemberIds).toEqual(['user-7', 'user-8', 'user-9']);

    expect(isGroupReducedSecurity('group-1')).toBe(true);

    const warning = getGroupReducedSecurityWarning('group-1');
    expect(warning).toBeDefined();
    expect(warning!.isActive).toBe(true);
    expect(warning!.messageKey).toBe('TeleBridgeGroupReducedSecurity');
  });

  it('no reduced security when all members are encrypted', () => {
    const composition = updateGroupMixedComposition('group-2', 8, 0, []);

    expect(composition.isReducedSecurity).toBe(false);
    expect(isGroupReducedSecurity('group-2')).toBe(false);
  });

  it('no reduced security when all members are unencrypted', () => {
    const composition = updateGroupMixedComposition('group-3', 0, 5, ['u1', 'u2', 'u3', 'u4', 'u5']);

    expect(composition.isReducedSecurity).toBe(false);
    expect(isGroupReducedSecurity('group-3')).toBe(false);
  });

  it('updates composition when membership changes', () => {
    updateGroupMixedComposition('group-1', 5, 3, ['u7', 'u8', 'u9']);
    const composition = updateGroupMixedComposition('group-1', 7, 1, ['u8']);

    expect(composition.encryptedCount).toBe(7);
    expect(composition.unencryptedCount).toBe(1);
    expect(composition.unencryptedMemberIds).toEqual(['u8']);
  });
});

// ---------- Unencrypted Group Fallback (VAL-GROUP-013) ----------

describe('Unencrypted Group Fallback', () => {
  it('hides encryption artifacts for notEncrypted groups', () => {
    expect(shouldHideEncryptionArtifacts('notEncrypted')).toBe(true);
  });

  it('shows encryption artifacts for encrypted groups', () => {
    expect(shouldHideEncryptionArtifacts('locked')).toBe(false);
    expect(shouldHideEncryptionArtifacts('warning')).toBe(false);
    expect(shouldHideEncryptionArtifacts('transitional')).toBe(false);
  });

  it('identifies unencrypted groups correctly', () => {
    expect(isUnencryptedGroup('notEncrypted')).toBe(true);
    expect(isUnencryptedGroup('locked')).toBe(false);
    expect(isUnencryptedGroup('warning')).toBe(false);
    expect(isUnencryptedGroup('transitional')).toBe(false);
  });
});

/**
 * TeleBridge — Contact Verification List
 *
 * Shows contacts with their verification badges (verified/unverified/unknown)
 * and key history. Part of Settings > TeleBridge > Contacts.
 * VAL-GROUP-011, VAL-CROSS-013.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ContactVerificationEntry } from '../../telebridge/state';

import {
  selectAllVerifiedContacts,
  selectAllUnverifiedContacts,
  selectAllUnknownContacts,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import buildClassName from '../../util/buildClassName';

import styles from './ContactList.module.scss';

interface OwnProps {
  className?: string;
}

interface StateProps {
  verifiedContacts: ContactVerificationEntry[];
  unverifiedContacts: ContactVerificationEntry[];
  unknownContacts: ContactVerificationEntry[];
  isBridgeUnlocked: boolean;
}

const VERIFICATION_BADGE: Record<string, { emoji: string; label: string; className: string }> = {
  verified: { emoji: '✅', label: 'TeleBridgeVerified', className: styles.badgeVerified },
  unverified: { emoji: '⚠️', label: 'TeleBridgeUnverified', className: styles.badgeUnverified },
  unknown: { emoji: '❓', label: 'TeleBridgeVerificationUnknown', className: styles.badgeUnknown },
};

const ContactList = ({
  verifiedContacts,
  unverifiedContacts,
  unknownContacts,
  isBridgeUnlocked,
  className,
}: OwnProps & StateProps) => {
  const { telebridgeVerifyContactManual, telebridgeUnverifyContact } = getActions();
  const lang = useLang();

  const handleVerify = useLastCallback((userId: string) => {
    telebridgeVerifyContactManual({ userId });
  });

  const handleUnverify = useLastCallback((userId: string) => {
    telebridgeUnverifyContact({ userId });
  });

  if (!isBridgeUnlocked) {
    return (
      <div className={buildClassName(styles.container, className)}>
        <div className={styles.locked}>
          {lang('TeleBridgeBridgeLockedMessage')}
        </div>
      </div>
    );
  }

  const allContacts = [
    ...verifiedContacts.map((c) => ({ ...c, status: 'verified' as const })),
    ...unverifiedContacts.map((c) => ({ ...c, status: 'unverified' as const })),
    ...unknownContacts.map((c) => ({ ...c, status: 'unknown' as const })),
  ].sort((a, b) => a.userId.localeCompare(b.userId));

  if (allContacts.length === 0) {
    return (
      <div className={buildClassName(styles.container, className)}>
        <div className={styles.empty}>
          {lang('TeleBridgeNoVerifiedContacts')}
        </div>
      </div>
    );
  }

  return (
    <div className={buildClassName(styles.container, className)}>
      {/* Verified section */}
      {verifiedContacts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{lang('TeleBridgeVerifiedContacts')}</div>
          {verifiedContacts.map((contact) => (
            <ContactRow
              key={contact.userId}
              contact={contact}
              status="verified"
              onVerify={handleVerify}
              onUnverify={handleUnverify}
            />
          ))}
        </div>
      )}

      {/* Unverified section */}
      {unverifiedContacts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{lang('TeleBridgeUnverifiedContacts')}</div>
          {unverifiedContacts.map((contact) => (
            <ContactRow
              key={contact.userId}
              contact={contact}
              status="unverified"
              onVerify={handleVerify}
              onUnverify={handleUnverify}
            />
          ))}
        </div>
      )}

      {/* Unknown (TOFU) section */}
      {unknownContacts.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>{lang('TeleBridgeUnknownContacts')}</div>
          {unknownContacts.map((contact) => (
            <ContactRow
              key={contact.userId}
              contact={contact}
              status="unknown"
              onVerify={handleVerify}
              onUnverify={handleUnverify}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ContactRowProps {
  contact: ContactVerificationEntry;
  status: 'verified' | 'unverified' | 'unknown';
  onVerify: (userId: string) => void;
  onUnverify: (userId: string) => void;
}

const ContactRow = memo(({ contact, status, onVerify, onUnverify }: ContactRowProps) => {
  const lang = useLang();
  const badge = VERIFICATION_BADGE[status];
  const fingerprintDisplay = contact.currentFingerprint
    ? formatFingerprintShort(contact.currentFingerprint)
    : undefined;

  return (
    <div className={styles.contactRow} role="listitem">
      <span className={buildClassName(styles.badge, badge.className)} role="img" aria-label={lang(badge.label)}>
        {badge.emoji}
      </span>
      <div className={styles.contactInfo}>
        <div className={styles.contactId}>{contact.userId}</div>
        {fingerprintDisplay && (
          <div className={styles.fingerprint}>{fingerprintDisplay}</div>
        )}
        <div className={styles.meta}>
          {contact.keyChangeCount > 0 && (
            <span className={styles.keyChangeCount}>
              {lang('TeleBridgeContactKeyChanged')} ({contact.keyChangeCount})
            </span>
          )}
          {contact.isTofuAccepted && status === 'unknown' && (
            <span className={styles.tofuLabel}>{lang('TeleBridgeContactAutoAccepted')}</span>
          )}
          {contact.lastVerifiedAt && status === 'verified' && (
            <span className={styles.verifiedAt}>
              {lang('TeleBridgeContactVerifiedAt')}: {new Date(contact.lastVerifiedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        {status !== 'verified' && (
          <button
            type="button"
            className={buildClassName(styles.actionButton, styles.verifyButton)}
            onClick={() => onVerify(contact.userId)}
            aria-label={lang('TeleBridgeVerifyIdentity')}
          >
            {lang('TeleBridgeVerifyIdentity')}
          </button>
        )}
        {status === 'verified' && (
          <button
            type="button"
            className={buildClassName(styles.actionButton, styles.unverifyButton)}
            onClick={() => onUnverify(contact.userId)}
            aria-label={lang('TeleBridgeUnverified')}
          >
            {lang('TeleBridgeUnverified')}
          </button>
        )}
      </div>
    </div>
  );
});

function formatFingerprintShort(fingerprint: string): string {
  if (fingerprint.length <= 16) return fingerprint.toUpperCase();
  return `${fingerprint.slice(0, 8).toUpperCase()}…${fingerprint.slice(-8).toUpperCase()}`;
}

export default memo(withGlobal<OwnProps>(
  (global): StateProps => ({
    verifiedContacts: selectAllVerifiedContacts(global),
    unverifiedContacts: selectAllUnverifiedContacts(global),
    unknownContacts: selectAllUnknownContacts(global),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
  }),
)(ContactList));

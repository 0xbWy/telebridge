/**
 * TeleBridge — Identity QR Viewer
 *
 * Displays the user's identity QR code encoding
 * telebridge://verify?fingerprint=<hex> for in-person verification.
 * VAL-GROUP-010.
 */
import { memo, useEffect, useState } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import {
  selectIsBridgeUnlocked,
  selectTeleBridgeIdentity,
} from '../../global/selectors/telebridge';
import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './IdentityQr.module.scss';

interface OwnProps {
  className?: string;
}

interface StateProps {
  ed25519PublicKey?: string;
  identityFingerprint?: string;
  identityVerificationUri?: string;
  isBridgeUnlocked: boolean;
  currentUserId?: string;
}

const IdentityQr = ({
  ed25519PublicKey,
  identityFingerprint,
  identityVerificationUri,
  isBridgeUnlocked,
  currentUserId,
  className,
}: OwnProps & StateProps) => {
  const { telebridgeGenerateIdentityQr } = getActions();
  const lang = useLang();

  const [copied, setCopied] = useState(false);

  // Generate the verification URI when we have the key
  useEffect(() => {
    if (isBridgeUnlocked && ed25519PublicKey && !identityVerificationUri) {
      telebridgeGenerateIdentityQr();
    }
  }, [isBridgeUnlocked, ed25519PublicKey, identityVerificationUri]);

  const handleCopyFingerprint = useLastCallback(() => {
    if (identityFingerprint) {
      navigator.clipboard.writeText(identityFingerprint).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // Clipboard API not available
      });
    }
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

  if (!identityFingerprint) {
    return (
      <div className={buildClassName(styles.container, className)}>
        <div className={styles.placeholder}>
          {lang('TeleBridgeGenerateIdentity')}
        </div>
      </div>
    );
  }

  // Format fingerprint in groups for display
  const formattedFingerprint = formatFingerprint(identityFingerprint);

  return (
    <div className={buildClassName(styles.container, className)}>
      <div className={styles.title}>{lang('TeleBridgeIdentityQR')}</div>
      <div className={styles.description}>
        {lang('TeleBridgeIdentityQRDescription')}
      </div>

      {identityVerificationUri && (
        <div className={styles.qrContainer} data-qr-content={identityVerificationUri}>
          <div className={styles.qrPlaceholder}>
            {/* QR code would be rendered here by a library like qr-code-styling */}
            {/* For now, display the URI and fingerprint */}
            <div className={styles.qrData}>{identityVerificationUri}</div>
          </div>
        </div>
      )}

      <div className={styles.fingerprintSection}>
        <div className={styles.fingerprintLabel}>
          {lang('TeleBridgeIdentityFingerprint')}
        </div>
        <div className={styles.fingerprintValue} title={identityFingerprint}>
          {formattedFingerprint}
        </div>
        <button
          type="button"
          className={styles.copyButton}
          onClick={handleCopyFingerprint}
          aria-label={lang('TeleBridgeCopyFingerprint')}
        >
          {copied ? lang('TeleBridgeFingerprintCopied') : lang('TeleBridgeCopyFingerprint')}
        </button>
      </div>
    </div>
  );
};

/**
 * Format a hex fingerprint into groups of 8 characters
 * separated by spaces for readability.
 */
function formatFingerprint(fingerprint: string): string {
  const groups: string[] = [];
  for (let i = 0; i < fingerprint.length; i += 8) {
    groups.push(fingerprint.slice(i, i + 8).toUpperCase());
  }
  return groups.join(' ');
}

export default memo(withGlobal<OwnProps>(
  (global): StateProps => {
    const identity = selectTeleBridgeIdentity(global);
    return {
      ed25519PublicKey: identity.ed25519PublicKey,
      identityFingerprint: global.telebridge?.identityFingerprint,
      identityVerificationUri: global.telebridge?.identityVerificationUri,
      isBridgeUnlocked: selectIsBridgeUnlocked(global),
      currentUserId: global.currentUserId?.toString(),
    };
  },
)(IdentityQr));

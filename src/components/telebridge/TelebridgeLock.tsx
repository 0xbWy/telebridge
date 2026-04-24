/**
 * TeleBridge — Per-chat Encryption Lock Indicator
 *
 * Displays one of 5 encryption states:
 * 🔒 encrypted, 🔓 not encrypted, ✅ verified, ⚠️ key changed, 🔐 secured
 */
import { memo } from '../../lib/teact/teact';
import { withGlobal } from '../../global';

import type { EncryptionStatus } from '../../telebridge/state';

import {
  selectChatEncryptionStatus,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';

import styles from './TelebridgeLock.module.scss';

interface OwnProps {
  chatId: string;
  className?: string;
}

interface StateProps {
  encryptionStatus: EncryptionStatus;
  isBridgeUnlocked: boolean;
}

const STATUS_CONFIG: Record<EncryptionStatus, {
  emoji: string;
  langKey: any;
  tooltipKey: any;
}> = {
  encrypted: {
    emoji: '🔒', langKey: 'TeleBridgeEncrypted' as const,
    tooltipKey: 'TeleBridgeEncryptedTooltip' as const,
  },
  notEncrypted: {
    emoji: '🔓', langKey: 'TeleBridgeNotEncrypted' as const,
    tooltipKey: 'TeleBridgeNotEncryptedTooltip' as const,
  },
  verified: {
    emoji: '✅', langKey: 'TeleBridgeVerified' as const,
    tooltipKey: 'TeleBridgeVerifiedTooltip' as const,
  },
  keyChanged: {
    emoji: '⚠️', langKey: 'TeleBridgeKeyChanged' as const,
    tooltipKey: 'TeleBridgeKeyChangedTooltip' as const,
  },
  secured: {
    emoji: '🔐', langKey: 'TeleBridgeSecured' as const,
    tooltipKey: 'TeleBridgeSecuredTooltip' as const,
  },
};

const TelebridgeLock = ({ chatId, className, encryptionStatus, isBridgeUnlocked }: OwnProps & StateProps) => {
  const lang = useLang();

  // If bridge is locked, always show locked state
  const status: EncryptionStatus = isBridgeUnlocked ? encryptionStatus : 'encrypted';
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={className ? `${styles.lockIndicator} ${className}` : styles.lockIndicator}
      role="img"
      aria-label={lang(config.langKey)}
      title={lang(config.tooltipKey)}
      data-encryption-status={status}
    >
      <span className={styles.emoji}>{config.emoji}</span>
      <span className={styles.label}>{lang(config.langKey)}</span>
    </span>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    encryptionStatus: selectChatEncryptionStatus(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
  }),
)(TelebridgeLock));

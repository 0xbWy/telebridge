/**
 * TeleBridge — Per-chat Encryption Lock Indicator
 *
 * Displays one of 6 encryption states:
 * 🔒 encrypted, 🔓 not encrypted, ✅ verified, ⚠️ key changed, 🔐 secured, ⏸ paused
 *
 * Clickable icon that opens a dropdown menu with context-appropriate options.
 */
import { memo, useCallback } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { EncryptionStatus } from '../../telebridge/state';

import {
  selectChatEncryptionStatus,
  selectHasBridgePassword,
  selectIsBridgeUnlocked,
  selectIsChatEncryptionPaused,
} from '../../global/selectors/telebridge';

import useFlag from '../../hooks/useFlag';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import DropdownMenu from '../ui/DropdownMenu';
import MenuItem from '../ui/MenuItem';

import styles from './TelebridgeLock.module.scss';

interface OwnProps {
  chatId: string;
  className?: string;
}

interface StateProps {
  encryptionStatus: EncryptionStatus;
  isBridgeUnlocked: boolean;
  isPaused: boolean;
  hasPassword: boolean;
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
  paused: {
    emoji: '⏸', langKey: 'TeleBridgeEncryptionPaused' as const,
    tooltipKey: 'TeleBridgeEncryptionPausedTooltip' as const,
  },
};

const TelebridgeLock = ({
  chatId,
  className,
  encryptionStatus,
  isBridgeUnlocked,
  isPaused,
  hasPassword,
}: OwnProps & StateProps) => {
  const lang = useLang();
  const { telebridgeSetChatEncryptionPaused, telebridgeStartKeyExchange } = getActions();
  const [isMenuOpen, openMenu, closeMenu] = useFlag(false);

  // If bridge is locked, always show locked state
  const status: EncryptionStatus = isBridgeUnlocked ? encryptionStatus : 'encrypted';
  const config = STATUS_CONFIG[status];

  const handlePauseEncryption = useLastCallback(() => {
    telebridgeSetChatEncryptionPaused({ chatId, isPaused: true });
    closeMenu();
  });

  const handleResumeEncryption = useLastCallback(() => {
    telebridgeSetChatEncryptionPaused({ chatId, isPaused: false });
    closeMenu();
  });

  const handleStartEncryption = useLastCallback(() => {
    telebridgeStartKeyExchange({ chatId });
    closeMenu();
  });

  const handleKeyDown = useLastCallback((e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openMenu();
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });

  const handleMenuClose = useLastCallback(() => {
    closeMenu();
  });

  const handleMenuOpen = useLastCallback(() => {
    openMenu();
  });

  // Build menu items based on state
  const renderMenuItems = useCallback(() => {
    if (!isBridgeUnlocked) {
      // Bridge is locked — show login needed
      return (
        <>
          <MenuItem
            icon="lock"
            disabled
            ariaLabel={lang('TeleBridgeLoginNeeded')}
          >
            {lang('TeleBridgeLoginNeeded')}
          </MenuItem>
          <div className={styles.menuDescription}>
            {hasPassword
              ? lang('TeleBridgeLoginNeededUnlock')
              : lang('TeleBridgeLoginNeededDescription')}
          </div>
        </>
      );
    }

    // Bridge is unlocked — show appropriate options based on encryption status
    if (isPaused) {
      // VAL-ENCUI-004: When encryption is paused, show "Resume Encryption"
      return (
        <>
          <MenuItem
            icon="play"
            onClick={handleResumeEncryption}
            ariaLabel={lang('TeleBridgeResumeEncryption')}
          >
            {lang('TeleBridgeResumeEncryption')}
          </MenuItem>
          <div className={styles.menuDescription}>
            {lang('TeleBridgeResumeEncryptionDescription')}
          </div>
        </>
      );
    }

    if (status === 'encrypted' || status === 'verified' || status === 'secured') {
      // VAL-ENCUI-002: When encrypted, show "Pause Encryption"
      return (
        <>
          <MenuItem
            icon="pause"
            onClick={handlePauseEncryption}
            ariaLabel={lang('TeleBridgePauseEncryption')}
          >
            {lang('TeleBridgePauseEncryption')}
          </MenuItem>
          <div className={styles.menuDescription}>
            {lang('TeleBridgePauseEncryptionDescription')}
          </div>
        </>
      );
    }

    if (status === 'notEncrypted') {
      // VAL-ENCUI-011: When not encrypted, show "Start Encryption"
      // VAL-ENCUI-012: No "Pause Encryption" when not encrypted
      return (
        <>
          <MenuItem
            icon="lock"
            onClick={handleStartEncryption}
            ariaLabel={lang('TeleBridgeStartEncryptionMenu')}
          >
            {lang('TeleBridgeStartEncryptionMenu')}
          </MenuItem>
          <div className={styles.menuDescription}>
            {lang('TeleBridgeStartEncryptionMenuDescription')}
          </div>
        </>
      );
    }

    // keyChanged state — show verification option
    return (
      <>
        <MenuItem
          icon="lock"
          disabled
          ariaLabel={lang('TeleBridgeKeyChanged')}
        >
          {lang('TeleBridgeKeyChanged')}
        </MenuItem>
      </>
    );
  }, [
    isBridgeUnlocked, isPaused, status, hasPassword,
    handlePauseEncryption, handleResumeEncryption, handleStartEncryption, lang,
  ]);

  return (
    <DropdownMenu
      className={className ? `${styles.lockIndicator} ${className}` : styles.lockIndicator}
      trigger={({
        onTrigger,
        isOpen: isTriggerOpen,
      }: {
        onTrigger: () => void;
        isOpen?: boolean;
      }) => (
        <span
          className={buildTriggerClassName(status, isTriggerOpen ?? isMenuOpen)}
          role="button"
          tabIndex={0}
          aria-label={lang(config.langKey)}
          title={lang(config.tooltipKey)}
          data-encryption-status={status}
          onClick={onTrigger}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.emoji}>{config.emoji}</span>
          <span className={styles.label}>{lang(config.langKey)}</span>
        </span>
      )}
      positionY="bottom"
      positionX="right"
      onOpen={handleMenuOpen}
      onClose={handleMenuClose}
    >
      {renderMenuItems()}
    </DropdownMenu>
  );
};

function buildTriggerClassName(status: EncryptionStatus, isOpen: boolean): string {
  const classList = [styles.trigger];
  if (isOpen) classList.push(styles.active);
  if (status === 'paused') classList.push(styles.paused);
  return classList.join(' ');
}

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    encryptionStatus: selectChatEncryptionStatus(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
    isPaused: selectIsChatEncryptionPaused(global, chatId),
    hasPassword: selectHasBridgePassword(global),
  }),
)(TelebridgeLock));

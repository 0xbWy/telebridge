/**
 * TeleBridge — TOFU Auto-Accept Info Banner
 *
 * Informational banner shown when a new key is auto-accepted via TOFU.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ChatEncryptionState } from '../../telebridge/state';

import { selectChat } from '../../global/selectors';
import {
  selectChatEncryptionState,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './TofuBanner.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  chatEncryptionState?: ChatEncryptionState;
  isBridgeUnlocked: boolean;
  chatName?: string;
}

const TofuBanner = ({ chatId, chatEncryptionState, isBridgeUnlocked, chatName }: OwnProps & StateProps) => {
  const { telebridgeAcknowledgeKeyChange } = getActions();
  const lang = useLang();

  const handleDismiss = useLastCallback(() => {
    telebridgeAcknowledgeKeyChange({ chatId });
  });

  if (!isBridgeUnlocked || !chatEncryptionState?.tofuAutoAccepted) {
    return undefined;
  }

  const displayName = chatName ?? lang('TeleBridgeEncrypted');

  return (
    <div className={styles.banner} role="status" aria-label={lang('TeleBridgeTofuAutoAccepted')}>
      <div className={styles.icon}>ℹ️</div>
      <div className={styles.content}>
        <div className={styles.title}>{lang('TeleBridgeTofuAutoAccepted')}</div>
        <div className={styles.description}>
          {lang('TeleBridgeTofuInfo', { name: displayName })}
        </div>
        <button
          type="button"
          className={styles.verifyLink}
          onClick={handleDismiss}
          aria-label={lang('TeleBridgeVerifySafetyNumber')}
        >
          {lang('TeleBridgeVerifySafetyNumber')}
        </button>
      </div>
      <button
        type="button"
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label={lang('TeleBridgeClose')}
      >
        <i className="icon-close" />
      </button>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    chatEncryptionState: selectChatEncryptionState(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
    chatName: selectChat(global, chatId)?.title,
  }),
)(TofuBanner));

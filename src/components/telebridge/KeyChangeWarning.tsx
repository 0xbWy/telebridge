/**
 * TeleBridge — Key Change Warning Banner
 *
 * Signal-style warning shown when a contact's key changes.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { ChatEncryptionState } from '../../telebridge/state';

import { selectChat } from '../../global/selectors';
import {
  selectChatEncryptionState,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';
import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './KeyChangeWarning.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  chatEncryptionState?: ChatEncryptionState;
  isBridgeUnlocked: boolean;
  chatName?: string;
}

const KeyChangeWarning = ({ chatId, chatEncryptionState, isBridgeUnlocked, chatName }: OwnProps & StateProps) => {
  const { telebridgeAcknowledgeKeyChange } = getActions();
  const lang = useLang();

  const handleVerify = useLastCallback(() => {
    // Navigate to safety number verification — for now, acknowledge
    telebridgeAcknowledgeKeyChange({ chatId });
  });

  const handleDismiss = useLastCallback(() => {
    telebridgeAcknowledgeKeyChange({ chatId });
  });

  if (!isBridgeUnlocked || !chatEncryptionState) {
    return undefined;
  }

  // Only show for keyChanged status that hasn't been acknowledged
  if (chatEncryptionState.status !== 'keyChanged' || chatEncryptionState.isKeyChangeAcknowledged) {
    return undefined;
  }

  const displayName = chatName ?? (lang('TeleBridgeEncrypted'));

  return (
    <div className={styles.warning} role="alert" aria-label={lang('TeleBridgeKeyChangeWarning')}>
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <div className={styles.title}>{lang('TeleBridgeKeyChangeWarning')}</div>
        <div className={styles.description}>
          {lang('TeleBridgeKeyChangeWarningDescription', { name: displayName })}
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={buildClassName(styles.button, styles.verifyButton)}
          onClick={handleVerify}
          aria-label={lang('TeleBridgeVerifyContact')}
        >
          {lang('TeleBridgeVerifyContact')}
        </button>
        <button
          type="button"
          className={buildClassName(styles.button, styles.dismissButton)}
          onClick={handleDismiss}
          aria-label={lang('TeleBridgeDismiss')}
        >
          {lang('TeleBridgeDismiss')}
        </button>
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    chatEncryptionState: selectChatEncryptionState(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
    chatName: selectChat(global, chatId)?.title,
  }),
)(KeyChangeWarning));

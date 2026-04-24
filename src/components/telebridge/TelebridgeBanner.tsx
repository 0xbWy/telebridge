/**
 * TeleBridge — Start Encrypted Chat Banner
 *
 * Shown in unencrypted chats to allow starting key exchange.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import {
  selectIsBridgeUnlocked,
  selectIsKeyExchangeInProgress,
  selectShouldShowStartEncryptedBanner,
} from '../../global/selectors/telebridge';
import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './TelebridgeBanner.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  isBridgeUnlocked: boolean;
  showBanner: boolean;
  isKeyExchangeInProgress: boolean;
}

const TelebridgeBanner = ({ chatId, isBridgeUnlocked, showBanner, isKeyExchangeInProgress }: OwnProps & StateProps) => {
  const { telebridgeStartKeyExchange, telebridgeDismissBanner } = getActions();
  const lang = useLang();

  const handleStartEncryption = useLastCallback(() => {
    telebridgeStartKeyExchange({ chatId });
  });

  const handleDismiss = useLastCallback(() => {
    telebridgeDismissBanner({ chatId });
  });

  if (!isBridgeUnlocked || !showBanner) {
    return undefined;
  }

  return (
    <div className={styles.banner} role="status" aria-label={lang('TeleBridgeStartEncryptedChat')}>
      <div className={styles.icon}>🔓</div>
      <div className={styles.content}>
        <div className={styles.title}>{lang('TeleBridgeStartEncryptedChat')}</div>
        <div className={styles.description}>{lang('TeleBridgeStartEncryptedChatDescription')}</div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={buildClassName(styles.button, styles.startButton)}
          onClick={handleStartEncryption}
          disabled={isKeyExchangeInProgress}
          aria-label={lang('TeleBridgeStartKeyExchange')}
        >
          {isKeyExchangeInProgress ? lang('TeleBridgeKeyExchangeInProgress') : lang('TeleBridgeStartKeyExchange')}
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
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
    showBanner: selectShouldShowStartEncryptedBanner(global, chatId),
    isKeyExchangeInProgress: selectIsKeyExchangeInProgress(global, chatId),
  }),
)(TelebridgeBanner));

/**
 * TeleBridge — Key Exchange Status Indicator
 *
 * Shows in-progress, complete, or failed key exchange status.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import type { KeyExchangeState } from '../../telebridge/state';

import { selectChat } from '../../global/selectors';
import {
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';
import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './KeyExchangeStatus.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  keyExchangeState: KeyExchangeState;
  isBridgeUnlocked: boolean;
  chatName?: string;
}

const KeyExchangeStatus = ({ chatId, keyExchangeState, isBridgeUnlocked, chatName }: OwnProps & StateProps) => {
  const { telebridgeStartKeyExchange } = getActions();
  const lang = useLang();

  const handleRetry = useLastCallback(() => {
    telebridgeStartKeyExchange({ chatId });
  });

  if (!isBridgeUnlocked || keyExchangeState === 'idle') {
    return undefined;
  }

  if (keyExchangeState === 'inProgress') {
    return (
      <div
        className={buildClassName(styles.status, styles.inProgress)}
        role="status"
        aria-label={lang('TeleBridgeKeyExchangeInProgress')}
      >
        <span className={styles.spinner} aria-hidden="true" />
        <span className={styles.text}>{lang('TeleBridgeKeyExchangeInProgress')}</span>
      </div>
    );
  }

  if (keyExchangeState === 'complete') {
    return (
      <div
        className={buildClassName(styles.status, styles.complete)}
        role="status"
        aria-label={lang('TeleBridgeKeyExchangeComplete')}
      >
        <span className={styles.checkmark} aria-hidden="true">✅</span>
        <span className={styles.text}>{lang('TeleBridgeKeyExchangeComplete')}</span>
      </div>
    );
  }

  if (keyExchangeState === 'failed') {
    return (
      <div className={buildClassName(styles.status, styles.failed)} role="alert">
        <span className={styles.warning} aria-hidden="true">⚠️</span>
        <span className={styles.text}>{lang('TeleBridgeKeyExchangeFailed')}</span>
        <button
          type="button"
          className={styles.retryButton}
          onClick={handleRetry}
          aria-label={lang('TeleBridgeKeyExchangeRetrying')}
        >
          {lang('TeleBridgeStartKeyExchange')}
        </button>
      </div>
    );
  }

  return undefined;
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => {
    const chatEncryptionState = global.telebridge?.chatEncryptionStates?.[chatId];
    const chat = selectChat(global, chatId);

    return {
      keyExchangeState: chatEncryptionState?.keyExchangeState ?? 'idle',
      isBridgeUnlocked: selectIsBridgeUnlocked(global),
      chatName: chat?.title,
    };
  },
)(KeyExchangeStatus));

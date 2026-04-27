/**
 * TeleBridge — Group Key Change Warning Banner
 *
 * Non-dismissible warning shown in group chats when a contact's
 * encryption key has changed. The warning remains until the contact
 * is re-verified. VAL-GROUP-012, VAL-CROSS-013.
 */
import { memo } from '../../lib/teact/teact';
import { getActions, withGlobal } from '../../global';

import {
  selectGroupKeyChangeUserIds,
  selectHasGroupKeyChangeWarning,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './GroupKeyChangeWarning.module.scss';

interface OwnProps {
  chatId: string;
}

interface StateProps {
  hasWarning: boolean;
  changedUserIds: string[];
  isBridgeUnlocked: boolean;
}

const GroupKeyChangeWarning = ({ chatId, hasWarning, changedUserIds, isBridgeUnlocked }: OwnProps & StateProps) => {
  const { telebridgeVerifyContactManual } = getActions();
  const lang = useLang();

  const handleVerify = useLastCallback((userId: string) => {
    telebridgeVerifyContactManual({ userId });
  });

  if (!isBridgeUnlocked || !hasWarning || changedUserIds.length === 0) {
    return undefined;
  }

  const isMultiple = changedUserIds.length > 1;
  const title = isMultiple
    ? lang('TeleBridgeGroupKeyChangeWarningMultiple')
    : lang('TeleBridgeKeyChangeWarning');

  const description = lang(
    'TeleBridgeGroupKeyChangeWarningDescription',
  );

  return (
    <div className={styles.warning} role="alert" aria-live="assertive">
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.nonDismissable}>
          {lang('TeleBridgeGroupKeyChangeNonDismissable')}
        </div>
        {changedUserIds.length > 0 && (
          <div className={styles.userList}>
            {changedUserIds.map((userId) => (
              <div key={userId} className={styles.userRow}>
                <span className={styles.userId}>{userId}</span>
                <button
                  type="button"
                  className={styles.verifyButton}
                  onClick={() => handleVerify(userId)}
                  aria-label={lang('TeleBridgeVerifyIdentity')}
                >
                  {lang('TeleBridgeReVerify')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    hasWarning: selectHasGroupKeyChangeWarning(global, chatId),
    changedUserIds: selectGroupKeyChangeUserIds(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
  }),
)(GroupKeyChangeWarning));

/**
 * TeleBridge — Reduced Security Warning
 *
 * Warning displayed in group chats with mixed encrypted/unencrypted members.
 * Informative (can be dismissed) but shows unencrypted member info.
 * VAL-GROUP-014.
 */
import { memo } from '../../lib/teact/teact';
import { withGlobal } from '../../global';

import {
  selectHasReducedSecurity,
  selectIsBridgeUnlocked,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';

import buildClassName from '../../util/buildClassName';

import styles from './ReducedSecurityWarning.module.scss';

interface OwnProps {
  chatId: string;
  unencryptedMemberIds?: string[];
  className?: string;
}

interface StateProps {
  hasReducedSecurity: boolean;
  isBridgeUnlocked: boolean;
}

const ReducedSecurityWarning = ({
  chatId,
  unencryptedMemberIds,
  hasReducedSecurity,
  isBridgeUnlocked,
  className,
}: OwnProps & StateProps) => {
  const lang = useLang();

  if (!isBridgeUnlocked || !hasReducedSecurity) {
    return undefined;
  }

  return (
    <div className={buildClassName(styles.warning, className)} role="alert">
      <div className={styles.icon}>⚠️</div>
      <div className={styles.content}>
        <div className={styles.title}>{lang('TeleBridgeGroupReducedSecurity')}</div>
        <div className={styles.description}>
          {lang('TeleBridgeGroupReducedSecurityDescription')}
        </div>
        {unencryptedMemberIds && unencryptedMemberIds.length > 0 && (
          <div className={styles.memberList}>
            <div className={styles.memberLabel}>{lang('TeleBridgeGroupUnencryptedMembers')}:</div>
            {unencryptedMemberIds.map((memberId) => (
              <div key={memberId} className={styles.memberId}>{memberId}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    hasReducedSecurity: selectHasReducedSecurity(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
  }),
)(ReducedSecurityWarning));

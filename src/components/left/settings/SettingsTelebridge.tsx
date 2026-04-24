import { memo, useState } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { BridgeState } from '../../../telebridge/state';

import {
  selectBridgeState,
  selectHasBridgePassword,
  selectIsBridgeUnlocked,
  selectIsRecoveryPhraseVerified,
  selectTeleBridgeError,
  selectTeleBridgeIdentity,
} from '../../../global/selectors/telebridge';

import useHistoryBack from '../../../hooks/useHistoryBack';
import useLang from '../../../hooks/useLang';
import useLastCallback from '../../../hooks/useLastCallback';

import PasswordDialog from '../../telebridge/PasswordDialog';
import RecoveryPhrase from '../../telebridge/RecoveryPhrase';
import RecoveryVerification from '../../telebridge/RecoveryVerification';
import ListItem from '../../ui/ListItem';

import styles from './SettingsTelebridge.module.scss';

type OwnProps = {
  isActive?: boolean;
  onReset: () => void;
  onScreenSelect?: (screen: number) => void;
};

type StateProps = {
  bridgeState: BridgeState;
  hasPassword: boolean;
  isUnlocked: boolean;
  identity: {
    ed25519PublicKey?: string;
    x25519PublicKey?: string;
  };
  errorKey?: string;
  isRecoveryPhraseVerified: boolean;
};

type SetupStep = 'password' | 'recovery' | 'verification' | 'complete';

const SettingsTelebridge = ({
  isActive,
  bridgeState,
  hasPassword,
  isUnlocked,
  identity,
  errorKey,
  onReset,
}: OwnProps & StateProps) => {
  const {
    telebridgeSetPassword,
    telebridgeUnlock,
    telebridgeLock,
    telebridgeInitIdentity,
  } = getActions();

  const lang = useLang();
  const [setupStep, setSetupStep] = useState<SetupStep>('password');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useHistoryBack({
    isActive,
    onBack: onReset,
  });

  const handleSetPassword = useLastCallback((password: string) => {
    setIsLoading(true);
    // Get mnemonic from sessionStorage (set by telebridgeSetPassword action)
    telebridgeSetPassword({ password });
    setMnemonic(sessionStorage.getItem('telebridge_mnemonic') ?? '');
    setSetupStep('recovery');
    setIsLoading(false);
  });

  const handleUnlock = useLastCallback((password: string) => {
    telebridgeUnlock({ password });
  });

  const handleLock = useLastCallback(() => {
    telebridgeLock();
  });

  const handleInitIdentity = useLastCallback(() => {
    telebridgeInitIdentity();
  });

  const handleRecoveryNext = useLastCallback(() => {
    setSetupStep('verification');
  });

  const handleVerificationComplete = useLastCallback(() => {
    setSetupStep('complete');
  });

  const handleVerificationSkip = useLastCallback(() => {
    setSetupStep('complete');
  });

  // No password set — show password setup flow
  if (!hasPassword) {
    if (setupStep === 'recovery' && mnemonic) {
      return (
        <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
          <RecoveryPhrase mnemonic={mnemonic} onNext={handleRecoveryNext} />
        </div>
      );
    }

    if (setupStep === 'verification' && mnemonic) {
      return (
        <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
          <RecoveryVerification
            mnemonic={mnemonic}
            onComplete={handleVerificationComplete}
            onSkip={handleVerificationSkip}
          />
        </div>
      );
    }

    if (setupStep === 'complete') {
      return (
        <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
          <div className={styles.heading}>
            <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsTitle')}</h3>
            <div className={styles.lockStatus}>
              <span className={styles.lockIcon}>🔓</span>
              <span>{lang('TeleBridgeEncryptionUnlocked')}</span>
            </div>
            {identity.ed25519PublicKey && (
              <div className={styles.keyFingerprint}>
                <strong>
                  {lang('TeleBridgeIdentityFingerprint')}
                  :
                </strong>
                <br />
                {identity.ed25519PublicKey.slice(0, 32)}
                ...
              </div>
            )}
          </div>
          <div className="settings-main-menu">
            <ListItem icon="lock" narrow onClick={handleLock}>
              {lang('TeleBridgeLock')}
            </ListItem>
          </div>
        </div>
      );
    }

    // Default: show password setup
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <PasswordDialog
          mode="setup"
          isLoading={isLoading}
          onSubmit={handleSetPassword}
        />
      </div>
    );
  }

  // Password set but bridge is locked — show unlock form
  if (!isUnlocked) {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsTitle')}</h3>
        </div>
        <PasswordDialog
          mode="unlock"
          errorKey={bridgeState === 'error' ? errorKey : undefined}
          isLoading={bridgeState === 'unlocking'}
          onSubmit={handleUnlock}
        />
      </div>
    );
  }

  // Bridge is unlocked — show settings with all sections
  return (
    <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
      <div className={styles.heading}>
        <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsTitle')}</h3>
        <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsSubtitle')}</p>
      </div>

      {/* Identity Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsIdentity')}</div>
      <div className={styles.identitySection}>
        <div className={styles.lockStatus}>
          <span className={styles.lockIcon}>🔓</span>
          <span>{lang('TeleBridgeEncryptionUnlocked')}</span>
        </div>
        {identity.ed25519PublicKey ? (
          <div className={styles.keyFingerprint} role="text" aria-label={lang('TeleBridgeIdentityFingerprint')}>
            <strong>
              {lang('TeleBridgeIdentityFingerprint')}
              :
            </strong>
            <br />
            {identity.ed25519PublicKey.slice(0, 32)}
            ...
          </div>
        ) : (
          <button
            className={styles.startButton}
            onClick={handleInitIdentity}
            type="button"
            aria-label={lang('TeleBridgeGenerateIdentity')}
          >
            {lang('TeleBridgeGenerateIdentity')}
          </button>
        )}
      </div>

      {/* Password Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsPassword')}</div>
      <div className={styles.passwordSection}>
        <div className={styles.lockStatus}>
          <span className={styles.lockIcon}>🔓</span>
          <span>{lang('TeleBridgePasswordSetSuccess')}</span>
        </div>
        <button
          className={styles.dangerButton}
          onClick={handleLock}
          type="button"
          aria-label={lang('TeleBridgeLock')}
        >
          {lang('TeleBridgeLock')}
        </button>
      </div>

      {/* Other Sections (stubs) */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsContacts')}</div>
      <div className={styles.emptyState}>
        {lang('TeleBridgeSettingsSubtitle')}
      </div>

      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsChats')}</div>
      <div className={styles.emptyState}>
        {lang('TeleBridgeSettingsSubtitle')}
      </div>

      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsSecurity')}</div>
      <div className={styles.emptyState}>
        {lang('TeleBridgeSettingsSubtitle')}
      </div>

      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsAbout')}</div>
      <div className={styles.emptyState}>
        {lang('TeleBridgeSettingsSubtitle')}
      </div>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global): StateProps => ({
    bridgeState: selectBridgeState(global),
    hasPassword: selectHasBridgePassword(global),
    isUnlocked: selectIsBridgeUnlocked(global),
    identity: selectTeleBridgeIdentity(global),
    errorKey: selectTeleBridgeError(global),
    isRecoveryPhraseVerified: selectIsRecoveryPhraseVerified(global),
  }),
)(SettingsTelebridge));

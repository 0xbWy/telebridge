import { memo, useState } from '../../../lib/teact/teact';
import { getActions, withGlobal } from '../../../global';

import type { BridgeState } from '../../../telebridge/state';

import {
  selectBridgeState,
  selectDefaultEncryptNewChats,
  selectHasBridgePassword,
  selectIsBridgeUnlocked,
  selectIsRecoveryPhraseVerified,
  selectTeleBridgeError,
  selectTeleBridgeIdentity,
  selectTofuAutoAcceptEnabled,
} from '../../../global/selectors/telebridge';
import {
  generateMnemonic,
} from '../../../telebridge/crypto/bip39';

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
  defaultEncryptNewChats: boolean;
  tofuAutoAcceptEnabled: boolean;
};

type SetupStep = 'password' | 'recovery' | 'verification' | 'complete';
type SettingsSection = 'main' | 'identity' | 'password' | 'contacts' | 'chats' | 'security' | 'about';

const SettingsTelebridge = ({
  isActive,
  bridgeState,
  hasPassword,
  isUnlocked,
  identity,
  errorKey,
  defaultEncryptNewChats,
  tofuAutoAcceptEnabled,
  onReset,
}: OwnProps & StateProps) => {
  const {
    telebridgeSetPassword,
    telebridgeUnlock,
    telebridgeLock,
    telebridgeInitIdentity,
    telebridgeSetDefaultEncrypt,
    telebridgeSetTofuAutoAccept,
  } = getActions();

  const lang = useLang();
  const [setupStep, setSetupStep] = useState<SetupStep>('password');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');

  useHistoryBack({
    isActive,
    onBack: activeSection !== 'main' ? () => setActiveSection('main') : onReset,
  });

  const handleSetPassword = useLastCallback((password: string) => {
    setIsLoading(true);
    // Generate mnemonic BEFORE dispatching the async action to avoid the race condition
    // where sessionStorage is read before the async action writes to it.
    // The mnemonic is passed directly to the component state, not via sessionStorage.
    const generatedMnemonic = generateMnemonic();
    setMnemonic(generatedMnemonic);
    telebridgeSetPassword({ password });
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

  const handleToggleDefaultEncrypt = useLastCallback(() => {
    telebridgeSetDefaultEncrypt({ enabled: !defaultEncryptNewChats });
  });

  const handleToggleTofuAutoAccept = useLastCallback(() => {
    telebridgeSetTofuAutoAccept({ enabled: !tofuAutoAcceptEnabled });
  });

  const handleShowRecoveryPhrase = useLastCallback(() => {
    setActiveSection('password');
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

  // Sub-sections
  if (activeSection === 'identity') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsIdentity')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsIdentityDescription')}</p>
        </div>
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
              <br />
              <br />
              <strong>X25519:</strong>
              <br />
              {identity.x25519PublicKey?.slice(0, 32)}
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
      </div>
    );
  }

  if (activeSection === 'password') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsPassword')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeSetPasswordDescription')}</p>
        </div>
        <div className={styles.passwordSection}>
          <div className={styles.lockStatus}>
            <span className={styles.lockIcon}>🔓</span>
            <span>{lang('TeleBridgePasswordSetSuccess')}</span>
          </div>
          <div className="settings-main-menu">
            <ListItem icon="lock" narrow onClick={handleShowRecoveryPhrase}>
              {lang('TeleBridgeShowRecoveryPhrase')}
            </ListItem>
            <ListItem icon="lock" narrow onClick={handleLock}>
              {lang('TeleBridgeLock')}
            </ListItem>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'contacts') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsContacts')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsContactsDescription')}</p>
        </div>
        <div className={styles.emptyState}>
          {lang('TeleBridgeVerifiedContacts')}
          <br />
          <span className={styles.secondaryText}>{lang('TeleBridgeNoVerifiedContacts')}</span>
        </div>
      </div>
    );
  }

  if (activeSection === 'chats') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsChats')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsChatsDescription')}</p>
        </div>
        <div className="settings-main-menu">
          <ListItem icon="lock" narrow onClick={handleToggleDefaultEncrypt}>
            {lang('TeleBridgeDefaultEncryption')}
          </ListItem>
          <div className={styles.toggleDescription}>
            {lang('TeleBridgeDefaultEncryptionDescription')}
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'security') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsSecurity')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsSecurityDescription')}</p>
        </div>
        <div className="settings-main-menu">
          <ListItem icon="key" narrow onClick={handleToggleTofuAutoAccept}>
            {lang('TeleBridgeAutoAcceptKeys')}
          </ListItem>
          <div className={styles.toggleDescription}>
            {lang('TeleBridgeAutoAcceptKeysDescription')}
          </div>
          <ListItem icon="lock-badge" narrow>
            {lang('TeleBridgeSecurityLog')}
          </ListItem>
        </div>
      </div>
    );
  }

  if (activeSection === 'about') {
    return (
      <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
        <div className={styles.heading}>
          <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsAbout')}</h3>
          <p className={styles.headingSubtitle}>{lang('TeleBridgeAboutDescription')}</p>
        </div>
        <div className={styles.aboutSection}>
          <p className={styles.aboutText}>{lang('TeleBridgeAboutDescription')}</p>
          <div className={styles.versionInfo}>
            {lang('TeleBridgeVersion')}
            :
            {' '}
            1.0.0
          </div>
        </div>
      </div>
    );
  }

  // Main settings screen — all 6 sections linked
  return (
    <div className={`settings-content custom-scroll ${styles.telebridgeSettings}`}>
      <div className={styles.heading}>
        <h3 className={styles.headingTitle}>{lang('TeleBridgeSettingsTitle')}</h3>
        <p className={styles.headingSubtitle}>{lang('TeleBridgeSettingsSubtitle')}</p>
      </div>

      {/* Identity Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsIdentity')}</div>
      <div className="settings-main-menu">
        <ListItem icon="key" narrow onClick={() => setActiveSection('identity')}>
          {lang('TeleBridgeSettingsIdentity')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsIdentityDescription')}</span>
        </ListItem>
      </div>

      {/* Password Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsPassword')}</div>
      <div className="settings-main-menu">
        <ListItem icon="lock" narrow onClick={() => setActiveSection('password')}>
          {lang('TeleBridgeSettingsPassword')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsPasswordDescription')}</span>
        </ListItem>
      </div>

      {/* Contacts Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsContacts')}</div>
      <div className="settings-main-menu">
        <ListItem icon="user" narrow onClick={() => setActiveSection('contacts')}>
          {lang('TeleBridgeSettingsContacts')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsContactsDescription')}</span>
        </ListItem>
      </div>

      {/* Chats Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsChats')}</div>
      <div className="settings-main-menu">
        <ListItem icon="message" narrow onClick={() => setActiveSection('chats')}>
          {lang('TeleBridgeSettingsChats')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsChatsDescription')}</span>
        </ListItem>
      </div>

      {/* Security Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsSecurity')}</div>
      <div className="settings-main-menu">
        <ListItem icon="lock-badge" narrow onClick={() => setActiveSection('security')}>
          {lang('TeleBridgeSettingsSecurity')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsSecurityDescription')}</span>
        </ListItem>
      </div>

      {/* About Section */}
      <div className={styles.sectionTitle}>{lang('TeleBridgeSettingsAbout')}</div>
      <div className="settings-main-menu">
        <ListItem icon="info" narrow onClick={() => setActiveSection('about')}>
          {lang('TeleBridgeSettingsAbout')}
          <span className={styles.sectionDescription}>{lang('TeleBridgeSettingsAboutDescription')}</span>
        </ListItem>
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
    defaultEncryptNewChats: selectDefaultEncryptNewChats(global),
    tofuAutoAcceptEnabled: selectTofuAutoAcceptEnabled(global),
  }),
)(SettingsTelebridge));

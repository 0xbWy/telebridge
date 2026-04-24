import { memo, useState } from '../../lib/teact/teact';
import { getActions } from '../../global';

import buildClassName from '../../util/buildClassName';

import useFlag from '../../hooks/useFlag';
import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './PasswordDialog.module.scss';

interface OwnProps {
  mode: 'setup' | 'unlock';
  errorKey?: string;
  isLoading?: boolean;
  onSubmit: (password: string) => void;
}

const MIN_PASSWORD_LENGTH = 8;

const PasswordDialog = ({ mode, errorKey, isLoading, onSubmit }: OwnProps) => {
  const { telebridgeClearError } = getActions();
  const lang = useLang();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, showPassword, hidePassword] = useFlag(false);
  const [isConfirmVisible, showConfirm, hideConfirm] = useFlag(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const handleChange = useLastCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLocalError(undefined);
    if (errorKey) {
      telebridgeClearError();
    }
  });

  const handleConfirmChange = useLastCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setLocalError(undefined);
  });

  const handleSubmit = useLastCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'setup') {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setLocalError('TeleBridgePasswordTooShort');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('TeleBridgePasswordMismatch');
        return;
      }
    }

    onSubmit(password);
  });

  const titleKey = mode === 'unlock' ? 'TeleBridgeUnlockBridge' as const : 'TeleBridgeSetPassword' as const;
  const descriptionKey = mode === 'unlock'
    ? 'TeleBridgeUnlockDescription' as const
    : 'TeleBridgeSetPasswordDescription' as const;
  const submitKey = mode === 'unlock'
    ? 'TeleBridgeEnterPassword' as const
    : 'TeleBridgeSetPassword' as const;

  const displayError = localError ?? errorKey;

  return (
    <div className={styles.PasswordDialog} role="dialog" aria-label={lang(titleKey)}>
      <h2 className={styles.title}>{lang(titleKey)}</h2>
      <p className={styles.description}>{lang(descriptionKey)}</p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            className={buildClassName(styles.input, displayError ? 'error' : undefined)}
            type={isPasswordVisible ? 'text' : 'password'}
            value={password}
            onChange={handleChange}
            placeholder={lang('TeleBridgeEnterPassword')}
            autoComplete={mode === 'unlock' ? 'current-password' : 'new-password'}
            minLength={MIN_PASSWORD_LENGTH}
            aria-label={lang('TeleBridgeEnterPassword')}
            disabled={isLoading}
          />
          <button
            type="button"
            className={styles.toggleButton}
            onClick={isPasswordVisible ? hidePassword : showPassword}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            <i className={isPasswordVisible ? 'icon-eye-closed' : 'icon-eye'} />
          </button>
        </div>

        {mode === 'setup' && (
          <div className={styles.inputGroup}>
            <input
              className={buildClassName(
                styles.input,
                localError === 'TeleBridgePasswordMismatch'
                  ? 'error'
                  : undefined,
              )}
              type={isConfirmVisible ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmChange}
              placeholder={lang('TeleBridgeConfirmPassword')}
              autoComplete="new-password"
              aria-label={lang('TeleBridgeConfirmPassword')}
              disabled={isLoading}
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={isConfirmVisible ? hideConfirm : showConfirm}
              aria-label={isConfirmVisible ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              <i className={isConfirmVisible ? 'icon-eye-closed' : 'icon-eye'} />
            </button>
          </div>
        )}

        <div className={styles.error} role="alert">
          {displayError ? lang(displayError as any) : ''}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !password || (mode === 'setup' && !confirmPassword)}
        >
          {isLoading ? lang('TeleBridgeUnlocking') : lang(submitKey)}
        </button>
      </form>
    </div>
  );
};

export default memo(PasswordDialog);

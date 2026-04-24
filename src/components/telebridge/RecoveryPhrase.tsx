import { memo, useState } from '../../lib/teact/teact';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './RecoveryPhrase.module.scss';

interface OwnProps {
  mnemonic: string;
  onNext: () => void;
}

const RecoveryPhrase = ({ mnemonic, onNext }: OwnProps) => {
  const lang = useLang();
  const [isCopied, setIsCopied] = useState(false);

  const words = mnemonic.trim().split(/\s+/);

  const handleCopy = useLastCallback(() => {
    navigator.clipboard.writeText(mnemonic).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }).catch(() => {
      // Fallback for environments where clipboard API is unavailable
      const textArea = document.createElement('textarea');
      textArea.value = mnemonic;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  });

  return (
    <div className={styles.recoveryPhrase} role="region" aria-label={lang('TeleBridgeRecoveryPhrase')}>
      <h2 className={styles.title}>{lang('TeleBridgeRecoveryPhrase')}</h2>
      <p className={styles.description}>{lang('TeleBridgeRecoveryPhraseDescription')}</p>

      <div className={styles.warning} role="alert">
        <span className={styles.warningIcon}>⚠️</span>
        <span>{lang('TeleBridgeRecoveryPhraseWarning')}</span>
      </div>

      <div className={styles.wordGrid} role="list" aria-label="Recovery phrase words">
        {words.map((word, index) => (
          <div
            key={index}
            className={styles.wordItem}
            role="listitem"
          >
            <span className={styles.wordNumber}>
              {index + 1}
              .
            </span>
            <span className={styles.wordText}>{word}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label={lang('TeleBridgeCopyRecoveryPhrase')}
      >
        <i className="icon-copy" />
        {isCopied ? lang('TeleBridgeRecoveryPhraseCopied') : lang('TeleBridgeCopyRecoveryPhrase')}
      </button>

      {isCopied && (
        <div className={styles.copiedMessage} role="status">
          <i className="icon-check" />
          {lang('TeleBridgeRecoveryPhraseCopied')}
        </div>
      )}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.nextButton}
          onClick={onNext}
          aria-label={lang('TeleBridgeContinue')}
        >
          {lang('TeleBridgeContinue')}
        </button>
      </div>
    </div>
  );
};

export default memo(RecoveryPhrase);

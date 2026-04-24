import { memo, useMemo, useState } from '../../lib/teact/teact';
import { getActions } from '../../global';

import buildClassName from '../../util/buildClassName';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './RecoveryVerification.module.scss';

interface OwnProps {
  mnemonic: string;
  onComplete: () => void;
  onSkip: () => void;
}

const VERIFICATION_ROUNDS = 3;

type WordState = 'idle' | 'correct' | 'incorrect';

const RecoveryVerification = ({ mnemonic, onComplete, onSkip }: OwnProps) => {
  const { telebridgeSetRecoveryVerified } = getActions();
  const lang = useLang();

  const words = useMemo(() => mnemonic.trim().split(/\s+/), [mnemonic]);
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | undefined>(undefined);
  const [wordState, setWordState] = useState<WordState>('idle');
  const [isConfirmSkip, setIsConfirmSkip] = useState(false);

  // Generate challenge: pick a random position and 4 random words
  const challenge = useMemo(() => {
    const position = Math.floor(Math.random() * words.length);
    const correctWord = words[position];

    // Pick 3 distractors that are different from the correct word
    const distractors: string[] = [];
    const shuffled = [...words].filter((w) => w !== correctWord);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    for (let i = 0; i < Math.min(3, shuffled.length); i++) {
      distractors.push(shuffled[i]);
    }

    // Shuffle options
    const options = [correctWord, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return { position: position + 1, correctWord, options };
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [words, currentRound]);

  const handleWordSelect = useLastCallback((word: string) => {
    if (wordState !== 'idle') return;

    setSelectedWord(word);

    if (word === challenge.correctWord) {
      setWordState('correct');
      setTimeout(() => {
        if (currentRound + 1 >= VERIFICATION_ROUNDS) {
          telebridgeSetRecoveryVerified({ verified: true });
          onComplete();
        } else {
          setCurrentRound((prev) => prev + 1);
          setSelectedWord(undefined);
          setWordState('idle');
        }
      }, 800);
    } else {
      setWordState('incorrect');
      setTimeout(() => {
        setSelectedWord(undefined);
        setWordState('idle');
      }, 1200);
    }
  });

  const handleSkip = useLastCallback(() => {
    if (!isConfirmSkip) {
      setIsConfirmSkip(true);
      return;
    }
    onSkip();
  });

  return (
    <div className={styles.verification} role="region" aria-label={lang('TeleBridgeVerifyRecoveryPhrase')}>
      <h2 className={styles.title}>{lang('TeleBridgeVerifyRecoveryPhrase')}</h2>
      <p className={styles.description}>{lang('TeleBridgeVerifyRecoveryDescription')}</p>

      <div
        className={styles.progress}
        role="progressbar"
        aria-valuenow={currentRound}
        aria-valuemax={VERIFICATION_ROUNDS}
      >
        {Array.from({ length: VERIFICATION_ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={buildClassName(
              styles.progressDot,
              i < currentRound && styles.completed,
              i === currentRound && styles.current,
            )}
          />
        ))}
      </div>

      <p className={styles.question}>
        {lang('TeleBridgeVerifyRecoveryWord', { position: challenge.position })}
      </p>

      <div className={styles.optionsGrid} role="group">
        {challenge.options.map((word) => (
          <button
            key={word}
            type="button"
            className={buildClassName(
              styles.optionButton,
              wordState !== 'idle'
              && word === challenge.correctWord
              && styles.correct,
              wordState !== 'idle'
              && word === selectedWord
              && word !== challenge.correctWord
              && styles.incorrect,
            )}
            onClick={() => handleWordSelect(word)}
            disabled={wordState !== 'idle'}
            aria-label={word}
          >
            {word}
          </button>
        ))}
      </div>

      <div
        className={buildClassName(
          styles.feedback,
          wordState === 'correct' && styles.correct,
          wordState === 'incorrect' && styles.incorrect,
        )}
        role="status"
      >
        {wordState === 'correct' && lang('TeleBridgeVerifyRecoveryCorrect')}
        {wordState === 'incorrect' && lang('TeleBridgeVerifyRecoveryIncorrect')}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.skipButton}
          onClick={handleSkip}
          aria-label={lang('TeleBridgeSkipVerification')}
        >
          {isConfirmSkip ? lang('TeleBridgeSkipVerificationConfirm') : lang('TeleBridgeSkipVerification')}
        </button>
      </div>
    </div>
  );
};

export default memo(RecoveryVerification);

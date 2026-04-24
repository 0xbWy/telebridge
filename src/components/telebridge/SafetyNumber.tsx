/**
 * TeleBridge — Safety Number Display
 *
 * Shows grouped numeric fingerprint for manual verification.
 */
import { memo, useMemo } from '../../lib/teact/teact';
import { withGlobal } from '../../global';

import type { ChatEncryptionState } from '../../telebridge/state';

import { selectChat } from '../../global/selectors';
import {
  selectChatEncryptionState,
  selectIsBridgeUnlocked,
  selectTeleBridgeIdentity,
} from '../../global/selectors/telebridge';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import styles from './SafetyNumber.module.scss';

interface OwnProps {
  chatId: string;
  className?: string;
}

interface StateProps {
  chatEncryptionState?: ChatEncryptionState;
  isBridgeUnlocked: boolean;
  chatName?: string;
  identity: {
    ed25519PublicKey?: string;
    x25519PublicKey?: string;
  };
}

/**
 * Format a base64 public key into grouped numeric safety number.
 * Takes first 30 bytes (60 hex chars), converts to 12 groups of 5 digits.
 */
function formatSafetyNumber(publicKey?: string): string {
  if (!publicKey) return '—';

  // Decode base64 and take first 30 bytes
  try {
    const binary = atob(publicKey);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    // Convert to hex and take first 60 hex chars (30 bytes)
    let hex = '';
    for (let i = 0; i < Math.min(bytes.length, 30); i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }

    // Convert hex pairs to 5-digit groups
    const numbers: string[] = [];
    for (let i = 0; i < hex.length; i += 5) {
      const chunk = hex.slice(i, i + 5);
      const num = parseInt(chunk, 16);
      numbers.push(num.toString().padStart(5, '0'));
    }

    // Format as grouped pairs: XXXXX XXXXX  XXXXX XXXXX
    const groups: string[] = [];
    for (let i = 0; i < numbers.length; i += 2) {
      const pair = numbers[i + 1] !== undefined
        ? `${numbers[i]} ${numbers[i + 1]}`
        : numbers[i];
      groups.push(pair);
    }

    return groups.join('\n');
  } catch {
    // Fallback: just show shortened hash
    return publicKey.slice(0, 32);
  }
}

const SafetyNumber = ({
  chatId, className, chatEncryptionState, isBridgeUnlocked, chatName, identity,
}: OwnProps & StateProps) => {
  const lang = useLang();

  const safetyNumber = useMemo(() => {
    if (chatEncryptionState?.safetyNumber) {
      return chatEncryptionState.safetyNumber;
    }
    // Generate from identity key as fallback
    return formatSafetyNumber(identity.ed25519PublicKey);
  }, [chatEncryptionState?.safetyNumber, identity.ed25519PublicKey]);

  const handleCopy = useLastCallback(() => {
    navigator.clipboard.writeText(safetyNumber.replace(/\n/g, ' ')).catch(() => {
      // Fallback for clipboard API failure
    });
  });

  if (!isBridgeUnlocked) {
    return undefined;
  }

  const displayName = chatName ?? lang('TeleBridgeEncrypted');

  return (
    <div
      className={className ? `${styles.safetyNumber} ${className}` : styles.safetyNumber}
      role="region"
      aria-label={lang('TeleBridgeSafetyNumber')}
    >
      <h3 className={styles.title}>{lang('TeleBridgeSafetyNumber')}</h3>
      <p className={styles.description}>
        {lang('TeleBridgeSafetyNumberDescription', { name: displayName })}
      </p>

      <div className={styles.numberDisplay} role="text" aria-label={safetyNumber}>
        {safetyNumber.split('\n').map((line, i) => (
          <div key={i} className={styles.numberLine}>{line}</div>
        ))}
      </div>

      <button
        type="button"
        className={styles.copyButton}
        onClick={handleCopy}
        aria-label={lang('TeleBridgeCopyRecoveryPhrase')}
      >
        <i className="icon-copy" />
        {lang('TeleBridgeCopyRecoveryPhrase')}
      </button>
    </div>
  );
};

export default memo(withGlobal<OwnProps>(
  (global, { chatId }): StateProps => ({
    chatEncryptionState: selectChatEncryptionState(global, chatId),
    isBridgeUnlocked: selectIsBridgeUnlocked(global),
    chatName: selectChat(global, chatId)?.title,
    identity: selectTeleBridgeIdentity(global),
  }),
)(SafetyNumber));

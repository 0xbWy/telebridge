/**
 * TeleBridge — Decryption Hook for Message Rendering
 *
 * React/Teact hook that decrypts tb-prefixed messages inline
 * during message rendering. Used in MessageText component.
 *
 * V1 Bug Regression Guards:
 * - #4: Key lookup by explicit chatId, NOT selectCurrentChat()
 * - Protocol control messages (kx, pk) return empty/hidden indicator
 *
 * VAL-ERR-001: Decryption failure shows user-facing error (localized, not blank).
 * When decryption fails, the hook returns a localized error key instead of
 * showing the raw protocol string or a blank message.
 */

import { useEffect, useRef, useState } from '../lib/teact/teact';

import type { InboundMessageResult } from './integration';

import {
  isEncryptToSelfDuplicate,
  processIncomingMessage,
} from './integration';
import { isTeleBridgeMessage, shouldHideMessage } from './messages';

/**
 * Hook to decrypt a TeleBridge protocol message inline.
 *
 * Returns:
 * - decryptedText: the plaintext to display (or undefined if not decrypted)
 * - isProtocol: whether this is a protocol message
 * - shouldHide: whether this message should be hidden from the chat UI
 * - isSecured: whether this is a Layer 4 secured message
 * - isDecrypting: whether decryption is in progress
 * - decryptionErrorKey: localization key for error display (VAL-ERR-001)
 *
 * @param text - Raw message text
 * @param chatId - Chat ID for key lookup
 * @param senderId - Sender's user ID (for encrypt-to-self filtering)
 * @param ourUserId - Our own user ID (for encrypt-to-self filtering)
 */
export function useTelebridgeDecryption(
  text: string | undefined,
  chatId: string,
  senderId?: string,
  ourUserId?: string,
): {
  decryptedText: string | undefined;
  isProtocol: boolean;
  shouldHide: boolean;
  isSecured: boolean;
  isDecrypting: boolean;
  decryptionErrorKey: string | undefined;
} {
  const [result, setResult] = useState<InboundMessageResult | undefined>(undefined);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const currentTextRef = useRef<string | undefined>(text);

  useEffect(() => {
    currentTextRef.current = text;

    if (!text || !isTeleBridgeMessage(text)) {
      setResult(undefined);
      setIsDecrypting(false);
      return;
    }

    // Check if this is an encrypt-to-self duplicate
    if (senderId && ourUserId && isEncryptToSelfDuplicate(text, senderId, ourUserId)) {
      setResult({
        isProtocol: true,
        shouldHide: true,
        decryptedText: undefined,
        mode: undefined,
        isSecured: true,
        keyId: undefined,
      });
      return;
    }

    // Check if this message should be hidden (kx, pk)
    if (shouldHideMessage(text)) {
      setResult({
        isProtocol: true,
        shouldHide: true,
        decryptedText: undefined,
        mode: undefined,
        isSecured: false,
        keyId: undefined,
      });
      return;
    }

    // Attempt decryption
    setIsDecrypting(true);

    let cancelled = false;

    processIncomingMessage(text, chatId, senderId, ourUserId).then((decResult) => {
      if (cancelled) return;
      if (currentTextRef.current !== text) return; // text changed
      setResult(decResult);
      setIsDecrypting(false);
    }).catch(() => {
      if (cancelled) return;
      setResult({
        isProtocol: true,
        shouldHide: false,
        decryptedText: undefined,
        mode: undefined,
        isSecured: false,
        keyId: undefined,
        decryptionError: {
          type: 'unknownError',
          messageKey: 'TeleBridgeDecryptionFailed',
          descriptionKey: 'TeleBridgeDecryptionFailedDescription',
          canRetry: false,
          chatId,
          timestamp: Date.now(),
        },
      });
      setIsDecrypting(false);
    });

    return () => {
      cancelled = true;
    };
  }, [text, chatId, senderId, ourUserId]);

  if (!text) {
    return {
      decryptedText: undefined, isProtocol: false, shouldHide: false,
      isSecured: false, isDecrypting: false, decryptionErrorKey: undefined,
    };
  }

  if (!isTeleBridgeMessage(text)) {
    return {
      decryptedText: undefined, isProtocol: false, shouldHide: false,
      isSecured: false, isDecrypting: false, decryptionErrorKey: undefined,
    };
  }

  // VAL-ERR-001: If decryption failed, return the localized error key
  // instead of showing blank message or raw protocol string
  const decryptionErrorKey = result?.decryptionError?.messageKey;

  return {
    decryptedText: result?.decryptedText,
    isProtocol: result?.isProtocol ?? true,
    shouldHide: result?.shouldHide ?? false,
    isSecured: result?.isSecured ?? false,
    isDecrypting,
    decryptionErrorKey,
  };
}

/**
 * Synchronous check: should this message be hidden from the chat list?
 * Used for quick filtering before attempting decryption.
 *
 * @param text - Message text
 * @returns true if the message is a kx/pk protocol message
 */
export function shouldHideTeleBridgeMessage(text: string): boolean {
  return shouldHideMessage(text);
}

/**
 * Check if a message is an encrypt-to-self duplicate that should be filtered from the chat UI.
 * Used by Message and MessageText components to hide self-copies of secured messages.
 */
export { isEncryptToSelfDuplicate };

/**
 * TeleBridge — Decryption Hook for Message Rendering
 *
 * React/Teact hook that decrypts tb-prefixed messages inline
 * during message rendering. Used in MessageText component.
 *
 * V1 Bug Regression Guards:
 * - #4: Key lookup by explicit chatId, NOT selectCurrentChat()
 * - Protocol control messages (kx, pk) return empty/hidden indicator
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

    processIncomingMessage(text, chatId, senderId).then((decResult) => {
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
      });
      setIsDecrypting(false);
    });

    return () => {
      cancelled = true;
    };
  }, [text, chatId, senderId, ourUserId]);

  if (!text) {
    return { decryptedText: undefined, isProtocol: false, shouldHide: false, isSecured: false, isDecrypting: false };
  }

  if (!isTeleBridgeMessage(text)) {
    return { decryptedText: undefined, isProtocol: false, shouldHide: false, isSecured: false, isDecrypting: false };
  }

  return {
    decryptedText: result?.decryptedText,
    isProtocol: result?.isProtocol ?? true,
    shouldHide: result?.shouldHide ?? false,
    isSecured: result?.isSecured ?? false,
    isDecrypting,
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

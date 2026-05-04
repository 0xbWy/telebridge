import {
  memo, useMemo, useRef,
} from '../../lib/teact/teact';

import type { ApiFormattedText, ApiMessage, ApiStory } from '../../api/types';
import type { ObserveFn } from '../../hooks/useIntersectionObserver';
import type { ThreadId } from '../../types';
import type { RegularLangKey } from '../../types/language';
import { ApiMessageEntityTypes } from '../../api/types';

import { extractMessageText, stripCustomEmoji } from '../../global/helpers';
import trimText from '../../util/trimText';
import {
  shouldHideTeleBridgeMessage,
  useTelebridgeDecryption,
} from '../../telebridge/hooks';
import { insertTextEntity, renderTextWithEntities } from './helpers/renderTextWithEntities';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';
import useSyncEffect from '../../hooks/useSyncEffect';
import useUniqueId from '../../hooks/useUniqueId';

import TypingWrapper from './TypingWrapper';

interface OwnProps {
  messageOrStory: ApiMessage | ApiStory;
  threadId?: ThreadId;
  forcedText?: ApiFormattedText;
  isForAnimation?: boolean;
  emojiSize?: number;
  highlight?: string;
  asPreview?: boolean;
  truncateLength?: number;
  isProtected?: boolean;
  observeIntersectionForLoading?: ObserveFn;
  observeIntersectionForPlaying?: ObserveFn;
  withTranslucentThumbs?: boolean;
  shouldRenderAsHtml?: boolean;
  inChatList?: boolean;
  forcePlayback?: boolean;
  focusedQuote?: string;
  focusedQuoteOffset?: number;
  isInSelectMode?: boolean;
  canBeEmpty?: boolean;
  maxTimestamp?: number;
  shouldAnimateTyping?: boolean;
  canAnimateTextStreaming?: boolean;
  /** Chat ID for TeleBridge decryption key lookup */
  chatId?: string;
  /** Sender ID for TeleBridge encrypt-to-self duplicate filtering */
  senderId?: string;
  /** Our user ID for TeleBridge encrypt-to-self duplicate filtering */
  ourUserId?: string;
}

const MIN_CUSTOM_EMOJIS_FOR_SHARED_CANVAS = 3;

function MessageText({
  messageOrStory,
  forcedText,
  isForAnimation,
  emojiSize,
  highlight,
  asPreview,
  truncateLength,
  isProtected,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  withTranslucentThumbs,
  shouldRenderAsHtml,
  inChatList,
  forcePlayback,
  focusedQuote,
  focusedQuoteOffset,
  isInSelectMode,
  canBeEmpty,
  maxTimestamp,
  threadId,
  shouldAnimateTyping,
  canAnimateTextStreaming,
  chatId,
  senderId,
  ourUserId,
}: OwnProps) {
  const sharedCanvasRef = useRef<HTMLCanvasElement>();
  const sharedCanvasHqRef = useRef<HTMLCanvasElement>();

  const textCacheBusterRef = useRef(0);

  const lang = useLang();

  const formattedText = forcedText || extractMessageText(messageOrStory, inChatList);
  const adaptedFormattedText = isForAnimation && formattedText ? stripCustomEmoji(formattedText) : formattedText;
  const { text: rawText, entities: rawEntities } = adaptedFormattedText || {};

  // TeleBridge: Decrypt encrypted messages inline
  const telebridgeChatId = chatId ?? ('chatId' in messageOrStory ? messageOrStory.chatId : undefined);

  // Synchronous check: protocol messages (kx, pk, sk) should be hidden from chat UI
  const isProtocolHidden = rawText ? shouldHideTeleBridgeMessage(rawText) : false;

  const {
    decryptedText: telebridgeDecryptedText,
    isSecured: telebridgeIsSecured,
    decryptionErrorKey: telebridgeErrorKey,
  } = useTelebridgeDecryption(
    rawText,
    telebridgeChatId ?? '',
    senderId,
    ourUserId,
  );

  // Determine display text and entities based on TeleBridge decryption result
  // When we decrypt successfully, original entities are invalid (they applied to encrypted text)
  let displayText = rawText;
  let displayEntities = rawEntities;

  if (rawText) {
    if (telebridgeDecryptedText !== undefined) {
      // Successfully decrypted — use plaintext, original entities are no longer valid
      displayText = telebridgeDecryptedText;
      displayEntities = undefined;
    } else if (telebridgeErrorKey) {
      // Decryption failed — show localized error message, no entities
      // telebridgeErrorKey is a LangPair key but typed as string; cast is safe
      displayText = lang(telebridgeErrorKey as RegularLangKey);
      displayEntities = undefined;
    } else if (rawText.startsWith('tb1.') && telebridgeChatId) {
      // Encrypted message still decrypting or no key available — show placeholder
      displayText = lang('TeleBridgeEncryptedMessage');
      displayEntities = undefined;
    }
  }

  // Per-message encryption indicator:
  // 🔐 for secured (Layer 4), 🔒 for symmetric (Layer 3), nothing for plaintext
  const telebridgeMode = telebridgeDecryptedText !== undefined
    ? (telebridgeIsSecured ? 'secured' : 'symmetric')
    : 'none';

  const text = displayText;
  const entities = displayEntities;

  const entitiesWithFocusedQuote = useMemo(() => {
    if (!text || !focusedQuote) return entities;

    const offsetIndex = text.indexOf(focusedQuote, focusedQuoteOffset);
    const index = offsetIndex >= 0 ? offsetIndex : text.indexOf(focusedQuote); // Fallback to first occurrence
    const lendth = focusedQuote.length;
    if (index >= 0) {
      return insertTextEntity(entities || [], {
        offset: index,
        length: lendth,
        type: ApiMessageEntityTypes.QuoteFocus,
      });
    }

    return entities;
  }, [text, entities, focusedQuote, focusedQuoteOffset]);

  const containerId = useUniqueId();

  useSyncEffect(() => {
    textCacheBusterRef.current += 1;
  }, [text, entitiesWithFocusedQuote]);

  const withSharedCanvas = useMemo(() => {
    const hasSpoilers = entitiesWithFocusedQuote?.some((e) => e.type === ApiMessageEntityTypes.Spoiler);
    if (hasSpoilers) {
      return false;
    }

    const customEmojisCount = entitiesWithFocusedQuote
      ?.filter((e) => e.type === ApiMessageEntityTypes.CustomEmoji).length || 0;
    return customEmojisCount >= MIN_CUSTOM_EMOJIS_FOR_SHARED_CANVAS;
  }, [entitiesWithFocusedQuote]) || 0;

  const renderText = useLastCallback((t: ApiFormattedText) => {
    return renderTextWithEntities({
      text: t.text,
      entities: t.entities,
      highlight,
      emojiSize,
      shouldRenderAsHtml,
      containerId,
      asPreview,
      isProtected,
      observeIntersectionForLoading,
      observeIntersectionForPlaying,
      withTranslucentThumbs,
      sharedCanvasRef,
      sharedCanvasHqRef,
      cacheBuster: textCacheBusterRef.current.toString(),
      forcePlayback,
      isInSelectMode,
      maxTimestamp,
      chatId: 'chatId' in messageOrStory ? messageOrStory.chatId : undefined,
      messageId: messageOrStory.id,
      threadId,
    });
  });

  // TeleBridge: protocol messages (kx/pk/sk) render as zero-height hidden elements
  // IMPORTANT: This return must come AFTER all hooks to avoid React rules-of-hooks violations
  if (isProtocolHidden) {
    return <div className="telebridge-protocol-hidden" />;
  }

  if (!text && !canBeEmpty) {
    return <span className="content-unsupported">{lang('MessageUnsupported')}</span>;
  }

  const textToRender: ApiFormattedText = {
    text: trimText(text || '', truncateLength),
    entities: entitiesWithFocusedQuote,
  };

  // Render encryption indicator prefix for decrypted messages
  const encryptionIndicator = telebridgeMode === 'secured'
    ? '\u{1F510} ' // 🔐 secured
    : telebridgeMode === 'symmetric'
      ? '\u{1F512} ' // 🔒 symmetric
      : ''; // plaintext — no indicator

  return (
    <>
      {encryptionIndicator && (
        <span className="telebridge-encryption-indicator">{encryptionIndicator}</span>
      )}
      {[
        withSharedCanvas && <canvas key="shared-canvas" ref={sharedCanvasRef} className="shared-canvas" />,
        withSharedCanvas && <canvas key="shared-canvas-hq" ref={sharedCanvasHqRef} className="shared-canvas" />,
        shouldAnimateTyping ? (
          <TypingWrapper
            key="typing-wrapper"
            formattedText={textToRender}
            renderText={renderText}
            shouldAnimateMask={canAnimateTextStreaming}
          />
        ) : renderText(textToRender),
      ].flat().filter(Boolean)}
    </>
  );
}

export default memo(MessageText);

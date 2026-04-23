"use strict";
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["src_components_common_FullNameTitle_tsx-src_hooks_useInfiniteScroll_ts-src_util_resetScroll_t-63da42"],{

/***/ "./src/components/common/FakeIcon.tsx"
/*!********************************************!*\
  !*** ./src/components/common/FakeIcon.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _FakeIcon_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FakeIcon.scss */ "./src/components/common/FakeIcon.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const FakeIcon = ({
  fakeType
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
    className: "FakeIcon",
    children: lang(fakeType === 'fake' ? 'FakeMessage' : 'ScamMessage')
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(FakeIcon));

/***/ },

/***/ "./src/components/common/FullNameTitle.tsx"
/*!*************************************************!*\
  !*** ./src/components/common/FullNameTitle.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config */ "./src/config.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../util/clipboard */ "./src/util/clipboard.ts");
/* harmony import */ var _util_stopEvent__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../util/stopEvent */ "./src/util/stopEvent.ts");
/* harmony import */ var _helpers_renderText__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_Transition__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../ui/Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _CustomEmoji__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _FakeIcon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./FakeIcon */ "./src/components/common/FakeIcon.tsx");
/* harmony import */ var _gift_GiftEffectWrapper__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./gift/GiftEffectWrapper */ "./src/components/common/gift/GiftEffectWrapper.tsx");
/* harmony import */ var _icons_StarIcon__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./icons/StarIcon */ "./src/components/common/icons/StarIcon.tsx");
/* harmony import */ var _VerifiedIcon__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./VerifiedIcon */ "./src/components/common/VerifiedIcon.tsx");
/* harmony import */ var _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./FullNameTitle.module.scss */ "./src/components/common/FullNameTitle.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





















const FullNameTitle = ({
  className,
  style,
  peer,
  noVerified,
  noFake,
  withEmojiStatus,
  emojiStatusSize,
  isSavedMessages,
  isSavedDialog,
  noLoopLimit,
  canCopyTitle,
  iconElement,
  isMonoforum,
  monoforumBadgeClassName,
  withStatusTextColor,
  onEmojiStatusClick,
  observeIntersection
}) => {
  const {
    showNotification
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const realPeer = 'id' in peer ? peer : undefined;
  const customPeer = 'isCustomPeer' in peer ? peer : undefined;
  const isUser = realPeer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_4__.isApiPeerUser)(realPeer);
  const title = realPeer && (isUser ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_3__.getUserFullName)(realPeer) : (0,_global_helpers__WEBPACK_IMPORTED_MODULE_3__.getChatTitle)(oldLang, realPeer));
  const isPremium = isUser && realPeer.isPremium || customPeer?.isPremium;
  const canShowEmojiStatus = withEmojiStatus && !isSavedMessages;
  const emojiStatus = realPeer?.emojiStatus || (customPeer?.emojiStatusId ? {
    type: 'regular',
    documentId: customPeer.emojiStatusId
  } : undefined);
  const handleTitleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(e => {
    if (!title || !canCopyTitle) {
      return;
    }
    (0,_util_stopEvent__WEBPACK_IMPORTED_MODULE_8__["default"])(e);
    (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_7__.copyTextToClipboard)(title);
    showNotification({
      message: `${isUser ? 'User' : 'Chat'} name was copied`
    });
  });
  const specialTitle = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (customPeer) {
      return (0,_helpers_renderText__WEBPACK_IMPORTED_MODULE_9__["default"])(customPeer.title || oldLang(customPeer.titleKey));
    }
    if (isSavedMessages) {
      return oldLang(isSavedDialog ? 'MyNotes' : 'SavedMessages');
    }
    if ((0,_global_helpers__WEBPACK_IMPORTED_MODULE_3__.isAnonymousForwardsChat)(realPeer.id)) {
      return oldLang('AnonymousForward');
    }
    if ((0,_global_helpers__WEBPACK_IMPORTED_MODULE_3__.isChatWithRepliesBot)(realPeer.id)) {
      return oldLang('RepliesTitle');
    }
    if ((0,_global_helpers__WEBPACK_IMPORTED_MODULE_3__.isChatWithVerificationCodesBot)(realPeer.id)) {
      return oldLang('VerifyCodesNotifications');
    }
    return undefined;
  }, [customPeer, isSavedDialog, isSavedMessages, oldLang, realPeer]);
  const botVerificationIconId = realPeer?.botVerificationIconId;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])('title', _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].root, className),
    style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_6__["default"])(emojiStatusSize ? `--_status-size: ${emojiStatusSize}px` : undefined, style),
    children: [botVerificationIconId && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_CustomEmoji__WEBPACK_IMPORTED_MODULE_14__["default"], {
      documentId: botVerificationIconId,
      size: emojiStatusSize,
      loopLimit: !noLoopLimit ? _config__WEBPACK_IMPORTED_MODULE_2__.EMOJI_STATUS_LOOP_LIMIT : undefined,
      observeIntersectionForLoading: observeIntersection
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("h3", {
      dir: "auto",
      role: "button",
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])('fullName', _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].fullName, canCopyTitle && _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].canCopy),
      onClick: handleTitleClick,
      children: specialTitle || (0,_helpers_renderText__WEBPACK_IMPORTED_MODULE_9__["default"])(title || '')
    }), !iconElement && peer && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.Fragment, {
      children: [!noVerified && peer?.isVerified && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_VerifiedIcon__WEBPACK_IMPORTED_MODULE_18__["default"], {}), !noFake && peer?.fakeType && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_FakeIcon__WEBPACK_IMPORTED_MODULE_15__["default"], {
        fakeType: peer.fakeType
      }), canShowEmojiStatus && emojiStatus && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_ui_Transition__WEBPACK_IMPORTED_MODULE_13__["default"], {
        className: _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].statusTransition,
        slideClassName: _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].statusTransitionSlide,
        activeKey: Number(emojiStatus.documentId),
        name: "slideFade",
        direction: -1,
        shouldCleanup: true,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_gift_GiftEffectWrapper__WEBPACK_IMPORTED_MODULE_16__["default"], {
          withSparkles: emojiStatus.type === 'collectible',
          sparklesClassName: "statusSparkles",
          sparklesColor: emojiStatus.type === 'collectible' && !withStatusTextColor ? emojiStatus.textColor : undefined,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_CustomEmoji__WEBPACK_IMPORTED_MODULE_14__["default"], {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])('no-selection', !withStatusTextColor && _FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].statusPrimaryColor),
            documentId: emojiStatus.documentId,
            size: emojiStatusSize,
            loopLimit: !noLoopLimit ? _config__WEBPACK_IMPORTED_MODULE_2__.EMOJI_STATUS_LOOP_LIMIT : undefined,
            observeIntersectionForLoading: observeIntersection,
            onClick: onEmojiStatusClick
          })
        })
      }), canShowEmojiStatus && !emojiStatus && isPremium && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_icons_StarIcon__WEBPACK_IMPORTED_MODULE_17__["default"], {}), isMonoforum && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])(_FullNameTitle_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].monoforumBadge, monoforumBadgeClassName),
        children: lang('MonoforumBadge')
      })]
    }), iconElement]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(FullNameTitle));

/***/ },

/***/ "./src/components/common/VerifiedIcon.tsx"
/*!************************************************!*\
  !*** ./src/components/common/VerifiedIcon.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _VerifiedIcon_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VerifiedIcon.scss */ "./src/components/common/VerifiedIcon.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


const VerifiedIcon = () => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("svg", {
    className: "VerifiedIcon",
    viewBox: "0 0 24 24",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M12.3 2.9c.1.1.2.1.3.2.7.6 1.3 1.1 2 1.7.3.2.6.4.9.4.9.1 1.7.2 2.6.2.5 0 .6.1.7.7.1.9.1 1.8.2 2.6 0 .4.2.7.4 1 .6.7 1.1 1.3 1.7 2 .3.4.3.5 0 .8-.5.6-1.1 1.3-1.6 1.9-.3.3-.5.7-.5 1.2-.1.8-.2 1.7-.2 2.5 0 .4-.2.5-.6.6-.8 0-1.6.1-2.5.2-.5 0-1 .2-1.4.5-.6.5-1.3 1.1-1.9 1.6-.3.3-.5.3-.8 0-.7-.6-1.4-1.2-2-1.8-.3-.2-.6-.4-.9-.4-.9-.1-1.8-.2-2.7-.2-.4 0-.5-.2-.6-.5 0-.9-.1-1.7-.2-2.6 0-.4-.2-.8-.4-1.1-.6-.6-1.1-1.3-1.6-2-.4-.4-.3-.5 0-1 .6-.6 1.1-1.3 1.7-1.9.3-.3.4-.6.4-1 0-.8.1-1.6.2-2.5 0-.5.1-.6.6-.6.9-.1 1.7-.1 2.6-.2.4 0 .7-.2 1-.4.7-.6 1.4-1.2 2.1-1.7.1-.2.3-.3.5-.2z",
      style: "fill: var(--color-fill)"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("path", {
      d: "M16.4 10.1l-.2.2-5.4 5.4c-.1.1-.2.2-.4 0l-2.6-2.6c-.2-.2-.1-.3 0-.4.2-.2.5-.6.7-.6.3 0 .5.4.7.6l1.1 1.1c.2.2.3.2.5 0l4.3-4.3c.2-.2.4-.3.6 0 .1.2.3.3.4.5.2 0 .3.1.3.1z",
      style: "fill: var(--color-checkmark)"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VerifiedIcon);

/***/ },

/***/ "./src/components/common/gift/GiftEffectWrapper.tsx"
/*!**********************************************************!*\
  !*** ./src/components/common/gift/GiftEffectWrapper.tsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _Sparkles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _GiftEffectWrapper_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GiftEffectWrapper.module.scss */ "./src/components/common/gift/GiftEffectWrapper.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const GiftEffectWrapper = ({
  children,
  ref,
  className,
  style,
  withSparkles,
  sparklesClassName,
  sparklesColor,
  glowColor,
  onClick
}) => {
  let containerRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    ref: containerRef,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_GiftEffectWrapper_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].root, className),
    style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(glowColor && `--glow-color: ${glowColor}`, style),
    onClick: onClick,
    children: [withSparkles && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Sparkles__WEBPACK_IMPORTED_MODULE_3__["default"], {
      preset: "button",
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_GiftEffectWrapper_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].sparkles, sparklesClassName),
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(sparklesColor && `color: ${sparklesColor}`)
    }), children]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(GiftEffectWrapper));

/***/ },

/***/ "./src/hooks/useInfiniteScroll.ts"
/*!****************************************!*\
  !*** ./src/hooks/useInfiniteScroll.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types */ "./src/types/index.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _useForceUpdate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useForceUpdate */ "./src/hooks/useForceUpdate.ts");
/* harmony import */ var _useLastCallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./usePreviousDeprecated */ "./src/hooks/usePreviousDeprecated.ts");






const DEFAULT_LIST_SLICE = 30;
const useInfiniteScroll = (loadMoreBackwards, listIds, isDisabled = false, listSlice = DEFAULT_LIST_SLICE) => {
  const requestParamsRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const currentStateRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (!currentStateRef.current && listIds && !isDisabled) {
    const {
      newViewportIds,
      newIsOnTop,
      fromOffset
    } = getViewportSlice(listIds, _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards, listSlice, listIds[0]);
    currentStateRef.current = {
      viewportIds: newViewportIds,
      isOnTop: newIsOnTop,
      offset: fromOffset
    };
  }
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_3__["default"])();
  if (isDisabled) {
    requestParamsRef.current = {};
  }
  const prevListIds = (0,_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_5__["default"])(listIds);
  const prevIsDisabled = (0,_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_5__["default"])(isDisabled);
  if (listIds && !isDisabled && (listIds !== prevListIds || isDisabled !== prevIsDisabled)) {
    const {
      viewportIds,
      isOnTop
    } = currentStateRef.current || {};
    const currentMiddleId = viewportIds && !isOnTop ? viewportIds[Math.round(viewportIds.length / 2)] : undefined;
    const defaultOffsetId = currentMiddleId && listIds.includes(currentMiddleId) ? currentMiddleId : listIds[0];
    const {
      offsetId = defaultOffsetId,
      direction = _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards
    } = requestParamsRef.current || {};
    const {
      newViewportIds,
      newIsOnTop,
      fromOffset
    } = getViewportSlice(listIds, direction, listSlice, offsetId);
    requestParamsRef.current = {};
    if (!viewportIds || !(0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.areSortedArraysEqual)(viewportIds, newViewportIds)) {
      currentStateRef.current = {
        viewportIds: newViewportIds,
        isOnTop: newIsOnTop,
        offset: fromOffset
      };
    }
  } else if (!listIds) {
    currentStateRef.current = undefined;
  }
  const getMore = (0,_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(({
    direction,
    noScroll
  }) => {
    const {
      viewportIds
    } = currentStateRef.current || {};
    const offsetId = viewportIds ? direction === _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Backwards ? viewportIds[viewportIds.length - 1] : viewportIds[0] : undefined;
    if (!listIds) {
      if (loadMoreBackwards) {
        loadMoreBackwards({
          offsetId
        });
      }
      return;
    }
    const {
      newViewportIds,
      areSomeLocal,
      areAllLocal,
      newIsOnTop,
      fromOffset
    } = getViewportSlice(listIds, direction, listSlice, offsetId);
    if (areSomeLocal && !(viewportIds && (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.areSortedArraysEqual)(viewportIds, newViewportIds))) {
      currentStateRef.current = {
        viewportIds: newViewportIds,
        isOnTop: newIsOnTop,
        offset: fromOffset
      };
      forceUpdate();
    }
    if (!areAllLocal && loadMoreBackwards) {
      if (!noScroll) {
        requestParamsRef.current = {
          ...requestParamsRef.current,
          direction,
          offsetId
        };
      }
      loadMoreBackwards({
        offsetId
      });
    }
  });
  return isDisabled ? [listIds] : [currentStateRef.current?.viewportIds, getMore, currentStateRef.current?.offset];
};
function getViewportSlice(sourceIds, direction, listSlice, offsetId) {
  const {
    length
  } = sourceIds;
  const index = offsetId ? sourceIds.indexOf(offsetId) : 0;
  const isForwards = direction === _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards;
  const indexForDirection = isForwards ? index : index + 1 || length;
  const from = Math.max(0, indexForDirection - listSlice);
  const to = indexForDirection + listSlice - 1;
  const newViewportIds = sourceIds.slice(Math.max(0, from), to + 1);
  let areSomeLocal;
  let areAllLocal;
  switch (direction) {
    case _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards:
      areSomeLocal = indexForDirection >= 0;
      areAllLocal = from >= 0;
      break;
    case _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Backwards:
      areSomeLocal = indexForDirection < length;
      areAllLocal = to <= length - 1;
      break;
  }
  return {
    newViewportIds,
    areSomeLocal,
    areAllLocal,
    newIsOnTop: newViewportIds[0] === sourceIds[0],
    fromOffset: from
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useInfiniteScroll);

/***/ },

/***/ "./src/util/resetScroll.ts"
/*!*********************************!*\
  !*** ./src/util/resetScroll.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   stopScrollInertia: () => (/* binding */ stopScrollInertia)
/* harmony export */ });
/* harmony import */ var _browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _forceReflow__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./forceReflow */ "./src/util/forceReflow.ts");


const resetScroll = (container, scrollTop) => {
  if (_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_0__.IS_IOS) {
    container.style.overflow = 'hidden';
  }
  if (scrollTop !== undefined) {
    container.scrollTop = scrollTop;
  }
  if (_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_0__.IS_IOS) {
    container.style.overflow = '';
  }
};
function stopScrollInertia(element) {
  element.style.display = 'none';
  (0,_forceReflow__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  element.style.display = '';
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (resetScroll);

/***/ },

/***/ "./src/components/common/FakeIcon.scss"
/*!*********************************************!*\
  !*** ./src/components/common/FakeIcon.scss ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/common/FullNameTitle.module.scss"
/*!*********************************************************!*\
  !*** ./src/components/common/FullNameTitle.module.scss ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"QljEeKI5","statusTransition":"KBZgFSv7","fullName":"AS54Cntu","canCopy":"vr53L_9p","statusTransitionSlide":"xmVxyvNy","monoforumBadge":"Sdwfc851","statusPrimaryColor":"z1sLOAjr"});

/***/ },

/***/ "./src/components/common/VerifiedIcon.scss"
/*!*************************************************!*\
  !*** ./src/components/common/VerifiedIcon.scss ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/common/gift/GiftEffectWrapper.module.scss"
/*!******************************************************************!*\
  !*** ./src/components/common/gift/GiftEffectWrapper.module.scss ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Z9JWyzAs","sparkles":"fQBp2vKr"});

/***/ },

/***/ "./src/lib/fastBlur.js"
/*!*****************************!*\
  !*** ./src/lib/fastBlur.js ***!
  \*****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ boxBlurCanvasRGB)
/* harmony export */ });
/*
Superfast Blur - a fast Box Blur For Canvas

Version:     0.5
Author:        Mario Klingemann
Contact:     mario@quasimondo.com
Website:    http://www.quasimondo.com/BoxBlurForCanvas
Twitter:    @quasimondo

In case you find this class useful - especially in commercial projects -
I am not totally unhappy for a small donation to my PayPal account
mario@quasimondo.de

Or support me on flattr:
https://flattr.com/thing/140066/Superfast-Blur-a-pretty-fast-Box-Blur-Effect-for-CanvasJavascript

Copyright (c) 2011 Mario Klingemann

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

// eslint-disable-next-line @stylistic/max-len
const mul_table = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133, 249, 117, 221, 209, 197, 187, 177, 169, 5, 153, 73, 139, 133, 127, 243, 233, 223, 107, 103, 99, 191, 23, 177, 171, 165, 159, 77, 149, 9, 139, 135, 131, 253, 245, 119, 231, 224, 109, 211, 103, 25, 195, 189, 23, 45, 175, 171, 83, 81, 79, 155, 151, 147, 9, 141, 137, 67, 131, 129, 251, 123, 30, 235, 115, 113, 221, 217, 53, 13, 51, 50, 49, 193, 189, 185, 91, 179, 175, 43, 169, 83, 163, 5, 79, 155, 19, 75, 147, 145, 143, 35, 69, 17, 67, 33, 65, 255, 251, 247, 243, 239, 59, 29, 229, 113, 111, 219, 27, 213, 105, 207, 51, 201, 199, 49, 193, 191, 47, 93, 183, 181, 179, 11, 87, 43, 85, 167, 165, 163, 161, 159, 157, 155, 77, 19, 75, 37, 73, 145, 143, 141, 35, 138, 137, 135, 67, 33, 131, 129, 255, 63, 250, 247, 61, 121, 239, 237, 117, 29, 229, 227, 225, 111, 55, 109, 216, 213, 211, 209, 207, 205, 203, 201, 199, 197, 195, 193, 48, 190, 47, 93, 185, 183, 181, 179, 178, 176, 175, 173, 171, 85, 21, 167, 165, 41, 163, 161, 5, 79, 157, 78, 154, 153, 19, 75, 149, 74, 147, 73, 144, 143, 71, 141, 140, 139, 137, 17, 135, 134, 133, 66, 131, 65, 129, 1];
// eslint-disable-next-line @stylistic/max-len
const shg_table = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20, 15, 20, 19, 20, 20, 20, 21, 21, 21, 20, 20, 20, 21, 18, 21, 21, 21, 21, 20, 21, 17, 21, 21, 21, 22, 22, 21, 22, 22, 21, 22, 21, 19, 22, 22, 19, 20, 22, 22, 21, 21, 21, 22, 22, 22, 18, 22, 22, 21, 22, 22, 23, 22, 20, 23, 22, 22, 23, 23, 21, 19, 21, 21, 21, 23, 23, 23, 22, 23, 23, 21, 23, 22, 23, 18, 22, 23, 20, 22, 23, 23, 23, 21, 22, 20, 22, 21, 22, 24, 24, 24, 24, 24, 22, 21, 24, 23, 23, 24, 21, 24, 23, 24, 22, 24, 24, 22, 24, 24, 22, 23, 24, 24, 24, 20, 23, 22, 23, 24, 24, 24, 24, 24, 24, 24, 23, 21, 23, 22, 23, 24, 24, 24, 22, 24, 24, 24, 23, 22, 24, 24, 25, 23, 25, 25, 23, 24, 25, 25, 24, 22, 25, 25, 25, 24, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 23, 25, 23, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 24, 22, 25, 25, 23, 25, 25, 20, 24, 25, 24, 25, 25, 22, 24, 25, 24, 25, 24, 25, 25, 24, 25, 25, 25, 25, 22, 25, 25, 25, 24, 25, 24, 25, 18];
function boxBlurCanvasRGB(context, top_x, top_y, width, height, radius, iterations) {
  if (Number.isNaN(radius) || radius < 1) return;
  radius |= 0;
  if (Number.isNaN(iterations)) iterations = 1;
  iterations |= 0;
  if (iterations > 3) iterations = 3;
  if (iterations < 1) iterations = 1;
  const imageData = context.getImageData(top_x, top_y, width, height);
  const pixels = imageData.data;
  let rsum;
  let gsum;
  let bsum;
  let x;
  let y;
  let i;
  let p;
  let p1;
  let p2;
  let yp;
  let yi;
  let yw;
  let wm = width - 1;
  let hm = height - 1;
  let rad1 = radius + 1;
  let r = [];
  let g = [];
  let b = [];
  let mul_sum = mul_table[radius];
  let shg_sum = shg_table[radius];
  let vmin = [];
  let vmax = [];
  while (iterations-- > 0) {
    yw = yi = 0;
    for (y = 0; y < height; y++) {
      rsum = pixels[yw] * rad1;
      gsum = pixels[yw + 1] * rad1;
      bsum = pixels[yw + 2] * rad1;
      for (i = 1; i <= radius; i++) {
        p = yw + ((i > wm ? wm : i) << 2);
        rsum += pixels[p++];
        gsum += pixels[p++];
        bsum += pixels[p++];
      }
      for (x = 0; x < width; x++) {
        r[yi] = rsum;
        g[yi] = gsum;
        b[yi] = bsum;
        if (y == 0) {
          vmin[x] = ((p = x + rad1) < wm ? p : wm) << 2;
          vmax[x] = (p = x - radius) > 0 ? p << 2 : 0;
        }
        p1 = yw + vmin[x];
        p2 = yw + vmax[x];
        rsum += pixels[p1++] - pixels[p2++];
        gsum += pixels[p1++] - pixels[p2++];
        bsum += pixels[p1++] - pixels[p2++];
        yi++;
      }
      yw += width << 2;
    }
    for (x = 0; x < width; x++) {
      yp = x;
      rsum = r[yp] * rad1;
      gsum = g[yp] * rad1;
      bsum = b[yp] * rad1;
      for (i = 1; i <= radius; i++) {
        yp += i > hm ? 0 : width;
        rsum += r[yp];
        gsum += g[yp];
        bsum += b[yp];
      }
      yi = x << 2;
      for (y = 0; y < height; y++) {
        pixels[yi] = rsum * mul_sum >>> shg_sum;
        pixels[yi + 1] = gsum * mul_sum >>> shg_sum;
        pixels[yi + 2] = bsum * mul_sum >>> shg_sum;
        if (x == 0) {
          vmin[y] = ((p = y + rad1) < hm ? p : hm) * width;
          vmax[y] = (p = y - radius) > 0 ? p * width : 0;
        }
        p1 = x + vmin[y];
        p2 = x + vmax[y];
        rsum += r[p1] - r[p2];
        gsum += g[p1] - g[p2];
        bsum += b[p1] - b[p2];
        yi += width << 2;
      }
    }
  }
  context.putImageData(imageData, top_x, top_y);
}

/***/ }

}]);
//# sourceMappingURL=src_components_common_FullNameTitle_tsx-src_hooks_useInfiniteScroll_ts-src_util_resetScroll_t-63da42.b91c528c89636eae15c6.js.map
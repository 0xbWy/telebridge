"use strict";
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["src_components_common_AnimatedIconFromSticker_tsx-src_components_common_BadgeButton_tsx-src_c-a52457"],{

/***/ "./src/components/common/AnimatedIconFromSticker.tsx"
/*!***********************************************************!*\
  !*** ./src/components/common/AnimatedIconFromSticker.tsx ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _AnimatedIconWithPreview__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AnimatedIconWithPreview */ "./src/components/common/AnimatedIconWithPreview.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






function AnimatedIconFromSticker(props) {
  const {
    sticker,
    noLoad,
    forcePreview,
    ...otherProps
  } = props;
  const thumbDataUri = sticker?.thumbnail?.dataUri;
  const localMediaHash = sticker && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getStickerMediaHash)(sticker, 'full');
  const previewBlobUrl = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_3__["default"])(sticker ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getStickerMediaHash)(sticker, 'preview') : undefined, noLoad && !forcePreview, _api_types__WEBPACK_IMPORTED_MODULE_1__.ApiMediaFormat.BlobUrl);
  const tgsUrl = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_3__["default"])(localMediaHash, noLoad);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_AnimatedIconWithPreview__WEBPACK_IMPORTED_MODULE_4__["default"], {
    tgsUrl: tgsUrl,
    previewUrl: previewBlobUrl,
    thumbDataUri: thumbDataUri,
    ...otherProps
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(AnimatedIconFromSticker));

/***/ },

/***/ "./src/components/common/AvatarList.tsx"
/*!**********************************************!*\
  !*** ./src/components/common/AvatarList.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _Avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _AvatarList_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AvatarList.module.scss */ "./src/components/common/AvatarList.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const DEFAULT_LIMIT = 3;
const AvatarList = ({
  peers,
  size,
  className,
  limit = DEFAULT_LIMIT,
  badgeText
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const pxSize = typeof size === 'number' ? size : _Avatar__WEBPACK_IMPORTED_MODULE_3__.AVATAR_SIZES[size];
  const renderingBadgeText = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (badgeText) return badgeText;
    if (!peers?.length || peers.length <= limit) return undefined;
    return `+${peers.length - limit}`;
  }, [badgeText, peers, limit]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(className, _AvatarList_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].root),
    style: `--_size: ${pxSize}px;`,
    dir: lang.isRtl ? 'rtl' : 'ltr',
    children: [peers?.slice(0, limit).map(peer => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Avatar__WEBPACK_IMPORTED_MODULE_3__["default"], {
      size: size,
      peer: peer,
      className: _AvatarList_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].avatar
    })), renderingBadgeText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: _AvatarList_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].badge,
      children: renderingBadgeText
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(AvatarList));

/***/ },

/***/ "./src/components/common/BadgeButton.tsx"
/*!***********************************************!*\
  !*** ./src/components/common/BadgeButton.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _BadgeButton_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BadgeButton.module.scss */ "./src/components/common/BadgeButton.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const BadgeButton = ({
  children,
  className,
  isPlain,
  inline,
  onClick,
  onMouseDown
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])(_BadgeButton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].root, isPlain && _BadgeButton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].plain, onClick && _BadgeButton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].clickable, inline && _BadgeButton_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].inline, className),
    onClick: onClick,
    onMouseDown: onMouseDown,
    children: children
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BadgeButton);

/***/ },

/***/ "./src/components/common/MediaSpoiler.tsx"
/*!************************************************!*\
  !*** ./src/components/common/MediaSpoiler.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useCanvasBlur__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useCanvasBlur */ "./src/hooks/useCanvasBlur.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useShowTransitionDeprecated */ "./src/hooks/useShowTransitionDeprecated.ts");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./MediaSpoiler.module.scss */ "./src/components/common/MediaSpoiler.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const BLUR_RADIUS = 25;
const ANIMATION_DURATION = 500;
const MediaSpoiler = ({
  isVisible,
  withAnimation,
  thumbDataUri,
  isNsfw,
  className,
  width,
  height
}) => {
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const {
    shouldRender,
    transitionClassNames
  } = (0,_hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_6__["default"])(isVisible, undefined, true, withAnimation ? false : undefined, undefined, ANIMATION_DURATION);
  const canvasRef = (0,_hooks_useCanvasBlur__WEBPACK_IMPORTED_MODULE_3__["default"])(thumbDataUri, !shouldRender, undefined, BLUR_RADIUS, width, height);
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    if (!ref.current) return;
    const el = ref.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const shiftX = x - rect.width / 2;
    const shiftY = y - rect.height / 2;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      el.setAttribute('style', `--click-shift-x: ${shiftX}px; --click-shift-y: ${shiftY}px`);
    });
  });
  if (!shouldRender) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].root, transitionClassNames, className, withAnimation && _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].maskAnimation),
    ref: ref,
    onClick: withAnimation ? handleClick : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("canvas", {
      ref: canvasRef,
      className: _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].canvas,
      width: width,
      height: height
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].dots
    }), isNsfw && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
      className: _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].nsfw,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
        name: "eye-crossed-outline",
        className: _MediaSpoiler_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].nsfwIcon
      }), lang('MediaSpoilerSensitive')]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(MediaSpoiler));

/***/ },

/***/ "./src/components/common/MiniTable.tsx"
/*!*********************************************!*\
  !*** ./src/components/common/MiniTable.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _MiniTable_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./MiniTable.module.scss */ "./src/components/common/MiniTable.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const MiniTable = ({
  data,
  style,
  className,
  valueClassName,
  keyClassName
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MiniTable_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].root, className),
    style: style,
    children: data.map(([key, value]) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MiniTable_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].key, keyClassName),
        children: key
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MiniTable_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].value, valueClassName),
        children: value
      })]
    }))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(MiniTable));

/***/ },

/***/ "./src/components/common/PasswordForm.tsx"
/*!************************************************!*\
  !*** ./src/components/common/PasswordForm.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config */ "./src/config.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_stopEvent__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../util/stopEvent */ "./src/util/stopEvent.ts");
/* harmony import */ var _hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/schedulers/useTimeout */ "./src/hooks/schedulers/useTimeout.ts");
/* harmony import */ var _hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useAppLayout */ "./src/hooks/useAppLayout.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");













const PasswordForm = ({
  isLoading = false,
  isPasswordVisible,
  error,
  hint,
  placeholder,
  submitLabel,
  description,
  shouldShowSubmit,
  shouldResetValue,
  shouldDisablePasswordManager = false,
  noRipple = false,
  onClearError,
  onChangePasswordVisibility,
  onInputChange,
  onSubmit
}) => {
  const inputRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const {
    isMobile
  } = (0,_hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const [password, setPassword] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [canSubmit, setCanSubmit] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const focusDelayTimeoutMs = isMobile ? 550 : 400;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (shouldResetValue) {
      setPassword('');
    }
  }, [shouldResetValue]);
  (0,_hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_7__["default"])(() => {
    if (!_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_TOUCH_ENV) {
      inputRef.current.focus();
    }
  }, focusDelayTimeoutMs);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (error) {
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__.requestMutation)(() => {
        inputRef.current.focus();
        inputRef.current.select();
      });
    }
  }, [error]);
  function onPasswordChange(e) {
    if (error) {
      onClearError();
    }
    const {
      target
    } = e;
    setPassword(target.value);
    setCanSubmit(target.value.length >= _config__WEBPACK_IMPORTED_MODULE_1__.MIN_PASSWORD_LENGTH);
    if (onInputChange) {
      onInputChange(target.value);
    }
  }
  function togglePasswordVisibility() {
    onChangePasswordVisibility(!isPasswordVisible);
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    if (canSubmit) {
      onSubmit(password);
    }
  }
  function renderFakeInput() {
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
      type: "password",
      id: "prevent_autofill",
      autoComplete: "off",
      className: "visually-hidden",
      tabIndex: -2
    });
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("form", {
    action: "",
    onSubmit: onSubmit ? handleSubmit : _util_stopEvent__WEBPACK_IMPORTED_MODULE_6__["default"],
    autoComplete: "off",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])('input-group password-input', password && 'touched', error && 'error'),
      dir: lang.isRtl ? 'rtl' : undefined,
      children: [shouldDisablePasswordManager && renderFakeInput(), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("input", {
        ref: inputRef,
        className: "form-control",
        type: isPasswordVisible ? 'text' : 'password',
        id: "sign-in-password",
        value: password || '',
        autoComplete: shouldDisablePasswordManager ? 'one-time-code' : 'current-password',
        spellCheck: _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_TAURI ? false : undefined,
        onChange: onPasswordChange,
        maxLength: 256,
        dir: "auto"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("label", {
        children: error || hint || placeholder || lang('PasswordFormPlaceholder')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
        className: "div-button toggle-password",
        onClick: togglePasswordVisibility,
        role: "button",
        tabIndex: 0,
        title: lang('AriaPasswordToggle'),
        "aria-label": lang('AriaPasswordToggle'),
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
          name: isPasswordVisible ? 'eye' : 'eye-crossed'
        })
      })]
    }), description && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("p", {
      className: "description",
      children: description
    }), onSubmit && (canSubmit || shouldShowSubmit) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
      type: "submit",
      ripple: !noRipple,
      isLoading: isLoading,
      disabled: !canSubmit,
      children: submitLabel || lang('PasswordFormSubmit')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PasswordForm));

/***/ },

/***/ "./src/components/common/PeerChip.tsx"
/*!********************************************!*\
  !*** ./src/components/common/PeerChip.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_usePeerColor__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/usePeerColor */ "./src/hooks/usePeerColor.ts");
/* harmony import */ var _Avatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _FullNameTitle__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./FullNameTitle */ "./src/components/common/FullNameTitle.tsx");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PeerChip.module.scss */ "./src/components/common/PeerChip.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const CHIP_SIZE_SMALL = 1.875 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM;
const CHIP_SIZE_MEDIUM = 2 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM;
const PeerChip = ({
  icon,
  title,
  size = 'medium',
  isMinimized,
  canClose,
  isCloseNonDestructive,
  clickArg,
  peer,
  mockPeer,
  customPeer,
  className,
  itemClassName,
  isSavedMessages,
  withPeerColors,
  withEmojiStatus,
  theme,
  onClick
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const apiPeer = mockPeer || peer;
  const anyPeer = customPeer || apiPeer;
  const {
    className: peerColorClass,
    style: peerColorStyle
  } = (0,_hooks_usePeerColor__WEBPACK_IMPORTED_MODULE_8__["default"])({
    peer: anyPeer,
    theme
  });
  const chat = apiPeer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.isApiPeerChat)(apiPeer) ? apiPeer : undefined;
  let iconElement;
  let titleElement;
  let titleText;
  if (icon && title) {
    iconElement = (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].iconWrapper,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
        name: icon,
        style: _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].icon
      })
    });
    titleElement = title;
  } else if (anyPeer) {
    iconElement = (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Avatar__WEBPACK_IMPORTED_MODULE_9__["default"], {
      className: _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].avatar,
      peer: anyPeer,
      size: "small",
      isSavedMessages: isSavedMessages
    });
    titleText = (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, anyPeer) || title;
    titleElement = title || (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_FullNameTitle__WEBPACK_IMPORTED_MODULE_10__["default"], {
      peer: anyPeer,
      isSavedMessages: isSavedMessages,
      withEmojiStatus: withEmojiStatus
    });
  }
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].root, size === 'small' && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].small, (chat?.isForum || customPeer?.isAvatarSquare) && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].squareAvatar, isMinimized && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].minimized, canClose && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].closeable, isCloseNonDestructive && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].nonDestructive, !onClick && _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].notClickable, withPeerColors && peerColorClass, className);
  const chipSize = size === 'small' ? CHIP_SIZE_SMALL : CHIP_SIZE_MEDIUM;
  const style = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_5__["default"])(`--chip-size: ${chipSize}px`, withPeerColors && peerColorStyle);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    className: fullClassName,
    style: style,
    onClick: () => onClick?.(clickArg),
    title: isMinimized ? titleText : undefined,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [iconElement, !isMinimized && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].name, itemClassName),
      dir: "auto",
      children: titleElement
    }), canClose && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: _PeerChip_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].remove,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
        name: "close"
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  peerId,
  forceShowSelf
}) => {
  const theme = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectTheme)(global);
  if (!peerId) {
    return {
      peer: undefined,
      isSavedMessages: undefined,
      theme
    };
  }
  const peer = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, peerId);
  const user = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectUser)(global, peerId);
  const isSavedMessages = !forceShowSelf && user && user.isSelf;
  return {
    peer,
    isSavedMessages,
    theme
  };
})(PeerChip)));

/***/ },

/***/ "./src/components/common/PinMessageModal.async.tsx"
/*!*********************************************************!*\
  !*** ./src/components/common/PinMessageModal.async.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_moduleLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/moduleLoader */ "./src/util/moduleLoader.ts");
/* harmony import */ var _hooks_useModuleLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useModuleLoader */ "./src/hooks/useModuleLoader.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const PinMessageModalAsync = props => {
  const {
    isOpen
  } = props;
  const PinMessageModal = (0,_hooks_useModuleLoader__WEBPACK_IMPORTED_MODULE_1__["default"])(_util_moduleLoader__WEBPACK_IMPORTED_MODULE_0__.Bundles.Extra, 'PinMessageModal', !isOpen);
  return PinMessageModal ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(PinMessageModal, {
    ...props
  }) : undefined;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PinMessageModalAsync);

/***/ },

/***/ "./src/components/common/PremiumProgress.tsx"
/*!***************************************************!*\
  !*** ./src/components/common/PremiumProgress.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_animations_useTransitionActiveKey__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/animations/useTransitionActiveKey */ "./src/hooks/animations/useTransitionActiveKey.ts");
/* harmony import */ var _hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useForceUpdate */ "./src/hooks/useForceUpdate.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/usePrevious */ "./src/hooks/usePrevious.ts");
/* harmony import */ var _hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useResizeObserver */ "./src/hooks/useResizeObserver.ts");
/* harmony import */ var _hooks_useSyncEffect__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useSyncEffect */ "./src/hooks/useSyncEffect.ts");
/* harmony import */ var _ui_Transition__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ui/Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./PremiumProgress.module.scss */ "./src/components/common/PremiumProgress.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const PremiumProgress = ({
  leftText,
  rightText,
  floatingBadgeText,
  floatingBadgeIcon,
  progress = 0,
  isPrimary,
  isNegative,
  isInverted,
  shouldSkipGradient,
  animationDirection = 'none',
  className
}) => {
  const floatingBadgeContentRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const parentContainerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [shiftX, setShiftX] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [beakPosition, setBeakPosition] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [badgeWidth, setBadgeWidth] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const prevBadgeWidth = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__["default"])(badgeWidth);
  const [positiveProgress, setPositiveProgress] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(isNegative ? 0 : progress);
  const [negativeProgress, setNegativeProgress] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(isNegative ? progress : 0);
  const [badgeProgress, setBadgeProgress] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(progress);
  const [layerProgress, setLayerProgress] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [showLayer, setShowLayer] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [disableMainProgressTransition, setDisableMainProgressTransition] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [disableLayerProgressTransition, setDisableLayerProgressTransition] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [hideMainLayer, setHideMainLayer] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isCycling, setIsCycling] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const badgeActiveKey = (0,_hooks_animations_useTransitionActiveKey__WEBPACK_IMPORTED_MODULE_4__.useTransitionActiveKey)([floatingBadgeText, floatingBadgeIcon]);
  const shouldAnimateCaptionsRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const prevLeftText = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__["default"])(leftText);
  const prevRightText = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__["default"])(rightText);
  const prevIsNegative = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__["default"])(isNegative);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const BEAK_WIDTH_PX = 28;
  const PROGRESS_BORDER_RADIUS_PX = _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
  const CORNER_BEAK_THRESHOLD = BEAK_WIDTH_PX / 2 + PROGRESS_BORDER_RADIUS_PX;
  const BADGE_HORIZONTAL_PADDING_PX = 0.75 * 2 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
  const LAYER_PROGRESS_TRANSITION_MS = 400;
  const FULL_CYCLE_TRANSITION_MS = LAYER_PROGRESS_TRANSITION_MS * 2;
  const APPLY_TRANSITION_DELAY_MS = 50;
  const updateBadgePosition = () => {
    if (floatingBadgeContentRef.current && parentContainerRef.current) {
      const parentWidth = parentContainerRef.current.offsetWidth;
      const halfBadgeWidth = badgeWidth / 2;
      const minBadgeShift = halfBadgeWidth;
      const maxBadgeShift = parentWidth - halfBadgeWidth;
      const halfBeakWidth = BEAK_WIDTH_PX / 2;
      const effectiveProgress = isInverted || isNegative ? 1 - badgeProgress : badgeProgress;
      const currentShift = effectiveProgress * parentWidth;
      let safeShift = Math.max(minBadgeShift, Math.min(currentShift, maxBadgeShift));
      if (currentShift < CORNER_BEAK_THRESHOLD) {
        safeShift = currentShift + halfBadgeWidth;
      }
      if (currentShift > parentWidth - CORNER_BEAK_THRESHOLD) {
        safeShift = currentShift - halfBadgeWidth;
      }
      const beakOffsetFromCenter = currentShift - safeShift;
      const newBeakPositionPx = halfBadgeWidth + beakOffsetFromCenter - halfBeakWidth;
      setShiftX(safeShift / parentWidth);
      setBeakPosition(newBeakPositionPx);
    }
  };
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(updateBadgePosition, [badgeProgress, badgeWidth, isNegative, isInverted, CORNER_BEAK_THRESHOLD]);
  (0,_hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_8__["default"])(parentContainerRef, updateBadgePosition);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const width = floatingBadgeContentRef?.current?.clientWidth || 0;
    setBadgeWidth(width + BADGE_HORIZONTAL_PADDING_PX);
  }, [floatingBadgeText, floatingBadgeIcon, BADGE_HORIZONTAL_PADDING_PX]);
  const forceUpdate = (0,_hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_hooks_useSyncEffect__WEBPACK_IMPORTED_MODULE_9__["default"])(() => {
    let timeoutId;
    const isNegativeTransition = prevIsNegative !== undefined && prevIsNegative !== isNegative;
    const shouldAnimateCaptions = (prevLeftText || prevRightText) && (isNegativeTransition || isCycling);
    if (shouldAnimateCaptions && !shouldAnimateCaptionsRef.current) {
      shouldAnimateCaptionsRef.current = true;
      const timeoutMs = isCycling ? LAYER_PROGRESS_TRANSITION_MS * 2 : LAYER_PROGRESS_TRANSITION_MS;
      timeoutId = window.setTimeout(() => {
        shouldAnimateCaptionsRef.current = false;
        forceUpdate();
      }, timeoutMs);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        shouldAnimateCaptionsRef.current = false;
      }
    };
  }, [leftText, prevLeftText, rightText, prevRightText, prevIsNegative, isNegative, animationDirection, isCycling]);
  const shouldAnimateCaptions = shouldAnimateCaptionsRef.current;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isNegative) {
      setPositiveProgress(0);
      setNegativeProgress(progress);
    } else {
      setNegativeProgress(0);
      setPositiveProgress(progress);
    }
    setBadgeProgress(progress);
  }, [progress, isNegative]);
  const hasFloatingBadge = Boolean(floatingBadgeIcon || floatingBadgeText);
  const displayLeftText = shouldAnimateCaptions ? prevLeftText : leftText;
  const displayRightText = shouldAnimateCaptions ? prevRightText : rightText;
  const prevProgress = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_7__["default"])(progress);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const timers = [];
    if (animationDirection === 'none' || prevProgress === undefined) {
      return;
    }
    const targetProgress = progress;
    const setMainProgress = value => {
      if (isNegative) {
        setNegativeProgress(value);
      } else {
        setPositiveProgress(value);
      }
    };
    if (animationDirection === 'forward' || animationDirection === 'backward') {
      const isForward = animationDirection === 'forward';
      setIsCycling(true);
      setMainProgress(isForward ? 1 : 0);
      setDisableLayerProgressTransition(true);
      setLayerProgress(isForward ? 0 : 1);
      timers.push(window.setTimeout(() => {
        setDisableLayerProgressTransition(false);
        setShowLayer(true);
        setLayerProgress(targetProgress);
        if (isForward) {
          setDisableMainProgressTransition(true);
          setMainProgress(0);
        }
      }, LAYER_PROGRESS_TRANSITION_MS));
      timers.push(window.setTimeout(() => {
        setDisableMainProgressTransition(true);
        setDisableLayerProgressTransition(true);
        setHideMainLayer(false);
        setMainProgress(targetProgress);
        setShowLayer(false);
        timers.push(window.setTimeout(() => {
          setDisableMainProgressTransition(false);
          setDisableLayerProgressTransition(false);
          setIsCycling(false);
        }, APPLY_TRANSITION_DELAY_MS));
      }, FULL_CYCLE_TRANSITION_MS));
    }
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [progress, animationDirection, isNegative, prevProgress, FULL_CYCLE_TRANSITION_MS]);
  const renderProgressLayer = (isPositive, currentProgress, layerClassName, disableTransition) => {
    const typeClass = isPositive ? _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].positiveProgress : _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].negativeProgress;
    const progressVar = '--layer-progress';
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(typeClass, layerClassName, disableTransition && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].noTransition),
      style: `${progressVar}: ${currentProgress}`,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
        className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].left,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
          children: displayLeftText
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
        className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].right,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
          children: displayRightText
        })
      })]
    });
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    ref: parentContainerRef,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].root, hasFloatingBadge && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].withBadge, isPrimary && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].primary, isNegative && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].negative, isInverted && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].inverted, shouldSkipGradient && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].noGradient, shouldAnimateCaptions && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].transitioning, isCycling && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].cycling, className),
    style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(`--positive-progress: ${positiveProgress}`, `--negative-progress: ${negativeProgress}`, `--layer-progress: ${layerProgress}`, `--shift-x: ${shiftX}`, `--cycling-animation-badge-position: ${FULL_CYCLE_TRANSITION_MS}ms`, `--cycling-animation-progress: ${LAYER_PROGRESS_TRANSITION_MS}ms`),
    children: [hasFloatingBadge && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].badgeContainer,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
        className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadgeWrapper,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
          className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadge, (!prevBadgeWidth || prevBadgeWidth === 0) && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].noTransition),
          style: `width: ${badgeWidth}px;`,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_ui_Transition__WEBPACK_IMPORTED_MODULE_10__["default"], {
            activeKey: badgeActiveKey,
            name: "fade",
            shouldCleanup: true,
            children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
              ref: floatingBadgeContentRef,
              className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadgeContent,
              children: [floatingBadgeIcon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_11__["default"], {
                name: floatingBadgeIcon,
                className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadgeIcon
              }), floatingBadgeText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
                className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadgeValue,
                dir: lang.isRtl ? 'rtl' : undefined,
                children: floatingBadgeText
              })]
            })
          })
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
          className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].floatingBadgeTriangle,
          style: `left: ${beakPosition}px`,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("svg", {
            width: "28",
            height: "28",
            viewBox: "0 0 28 28",
            fill: "none",
            children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("path", {
              d: "m 28,4 v 9 c 0.0089,7.283278 -3.302215,5.319646 -6.750951,8.589815 l -5.8284,5.82843 c -0.781,0.78105 -2.0474,0.78104 -2.8284,0 L 6.7638083,21.589815 C 2.8288652,17.959047 0.04527024,20.332086 0,13 V 4 C 0,4 0.00150581,0.97697493 3,1 5.3786658,1.018266 22.594519,0.9142007 25,1 c 2.992326,0.1067311 3,3 3,3 z",
              fill: "currentColor"
            })
          })
        })]
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].left,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
        children: displayLeftText
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].right,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
        children: displayRightText
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
      className: _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].progressWrapper,
      children: [renderProgressLayer(true, positiveProgress, (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(hideMainLayer && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].hidden), disableMainProgressTransition), renderProgressLayer(false, negativeProgress, (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(hideMainLayer && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].hidden), disableMainProgressTransition), renderProgressLayer(!isNegative, layerProgress, (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(isNegative ? _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].negativeLayer : _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].positiveLayer, showLayer && _PremiumProgress_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].show), disableLayerProgressTransition)]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PremiumProgress));

/***/ },

/***/ "./src/components/common/gift/GiftRibbon.tsx"
/*!***************************************************!*\
  !*** ./src/components/common/gift/GiftRibbon.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hooks/useUniqueId */ "./src/hooks/useUniqueId.ts");
/* harmony import */ var _GiftRibbon_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./GiftRibbon.module.scss */ "./src/components/common/gift/GiftRibbon.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const COLORS = {
  red: [['#FF5B54', '#ED1C26'], ['#653633', '#532224']],
  blue: [['#6ED2FF', '#34A4FC'], ['#344F5A', '#152E42']],
  purple: [['#E367D7', '#757BF6'], ['#E367D7', '#757BF6']],
  green: [['#52D553', '#4BB121'], ['#52D553', '#4BB121']],
  orange: [['#D48F23', '#BE7E15'], ['#D48F23', '#BE7E15']]
};
const COLOR_KEYS = new Set(Object.keys(COLORS));
const DEFAULT_SIZE = 56;
const TEXT_OFFSET_RATIO = 6 / DEFAULT_SIZE;
const GiftRibbon = ({
  text,
  color,
  size = DEFAULT_SIZE,
  className,
  textClassName,
  theme
}) => {
  const randomId = (0,_hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const validSvgRandomId = `svg-${randomId}`; // ID must start with a letter

  const colorKey = COLOR_KEYS.has(color) ? color : undefined;
  const isDarkTheme = theme === 'dark';
  const gradientColor = Array.isArray(color) ? color : colorKey ? COLORS[colorKey][isDarkTheme ? 1 : 0] : undefined;
  const startColor = gradientColor ? gradientColor[0] : color;
  const endColor = gradientColor ? gradientColor[1] : color;
  const textOffset = Math.round(size * TEXT_OFFSET_RATIO);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_GiftRibbon_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].root, className),
    style: `width: ${size}px; height: ${size}px`,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("svg", {
      className: _GiftRibbon_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].ribbon,
      width: size,
      height: size,
      viewBox: "0 0 56 56",
      fill: "none",
      "aria-hidden": "true",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("path", {
        d: "M52.4851 26.4853L29.5145 3.51472C27.2641 1.26428 24.2119 0 21.0293 0H2.82824C1.04643 0 0.154103 2.15429 1.41403 3.41422L52.5856 54.5858C53.8455 55.8457 55.9998 54.9534 55.9998 53.1716V34.9706C55.9998 31.788 54.7355 28.7357 52.4851 26.4853Z",
        fill: `url(#${validSvgRandomId})`
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("defs", {
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("linearGradient", {
          id: validSvgRandomId,
          x1: "27.9998",
          y1: "1",
          x2: "27.9998",
          y2: "55",
          gradientUnits: "userSpaceOnUse",
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("stop", {
            "stop-color": startColor
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("stop", {
            offset: "1",
            "stop-color": endColor
          })]
        })
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_GiftRibbon_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].text, textClassName),
      style: `transform: translate(-50%, -50%) translate(${textOffset}px, ${-textOffset}px) rotate(45deg)`,
      children: text
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => {
  return {
    theme: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectTheme)(global)
  };
})(GiftRibbon)));

/***/ },

/***/ "./src/components/common/helpers/gifts.ts"
/*!************************************************!*\
  !*** ./src/components/common/helpers/gifts.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBidAuctionPosition: () => (/* binding */ getBidAuctionPosition),
/* harmony export */   getGiftAttributes: () => (/* binding */ getGiftAttributes),
/* harmony export */   getGiftRarityTitle: () => (/* binding */ getGiftRarityTitle),
/* harmony export */   getRandomGiftPreviewAttributes: () => (/* binding */ getRandomGiftPreviewAttributes),
/* harmony export */   getStickerFromGift: () => (/* binding */ getStickerFromGift),
/* harmony export */   getTotalGiftAvailability: () => (/* binding */ getTotalGiftAvailability),
/* harmony export */   preloadGiftAttributeStickers: () => (/* binding */ preloadGiftAttributeStickers)
/* harmony export */ });
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_mediaLoader__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/mediaLoader */ "./src/util/mediaLoader.ts");
/* harmony import */ var _util_textFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/textFormat */ "./src/util/textFormat.ts");




function getStickerFromGift(gift) {
  if (gift.type === 'starGift') {
    return gift.sticker;
  }
  return gift.attributes.find(attr => attr.type === 'model')?.sticker;
}
function getTotalGiftAvailability(gift) {
  if (gift.type === 'starGift') {
    return gift.availabilityTotal;
  }
  return gift.totalCount;
}
function getGiftAttributes(gift) {
  if (gift.type !== 'starGiftUnique') return undefined;
  return getGiftAttributesFromList(gift.attributes);
}
function getGiftAttributesFromList(attributes) {
  const model = attributes.find(attr => attr.type === 'model');
  const backdrop = attributes.find(attr => attr.type === 'backdrop');
  const pattern = attributes.find(attr => attr.type === 'pattern');
  const originalDetails = attributes.find(attr => attr.type === 'originalDetails');
  return {
    model,
    originalDetails,
    pattern,
    backdrop
  };
}
function getRandomGiftPreviewAttributes(list, previousSelection) {
  const models = list.filter(attr => attr.type === 'model' && attr.name !== previousSelection?.model.name);
  const patterns = list.filter(attr => attr.type === 'pattern' && attr.name !== previousSelection?.pattern.name);
  const backdrops = list.filter(attr => attr.type === 'backdrop' && attr.name !== previousSelection?.backdrop.name);
  if (!models.length || !patterns.length || !backdrops.length) {
    // Fallback: re-filter without exclusions if any category is empty
    const fallbackModels = models.length ? models : list.filter(attr => attr.type === 'model');
    const fallbackPatterns = patterns.length ? patterns : list.filter(attr => attr.type === 'pattern');
    const fallbackBackdrops = backdrops.length ? backdrops : list.filter(attr => attr.type === 'backdrop');
    return {
      model: fallbackModels[Math.floor(Math.random() * fallbackModels.length)],
      pattern: fallbackPatterns[Math.floor(Math.random() * fallbackPatterns.length)],
      backdrop: fallbackBackdrops[Math.floor(Math.random() * fallbackBackdrops.length)]
    };
  }
  const randomModel = models[Math.floor(Math.random() * models.length)];
  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
  const randomBackdrop = backdrops[Math.floor(Math.random() * backdrops.length)];
  return {
    model: randomModel,
    pattern: randomPattern,
    backdrop: randomBackdrop
  };
}
function preloadGiftAttributeStickers(attributes) {
  const patternStickers = attributes.filter(attr => attr.type === 'pattern').map(attr => attr.sticker);
  const modelStickers = attributes.filter(attr => attr.type === 'model').map(attr => attr.sticker);
  const mediaHashes = [...patternStickers, ...modelStickers].map(sticker => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getStickerMediaHash)(sticker, 'full'));
  mediaHashes.forEach(hash => {
    (0,_util_mediaLoader__WEBPACK_IMPORTED_MODULE_2__.fetch)(hash, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMediaFormat.BlobUrl);
  });
}
function getBidAuctionPosition(bidAmount, bidDate, bidLevels) {
  if (!bidLevels.length) return 1;
  for (const level of bidLevels) {
    if (level.amount < bidAmount || level.amount === bidAmount && level.date >= bidDate) {
      return level.pos;
    }
  }
  return bidLevels[bidLevels.length - 1].pos + 1;
}
function getGiftRarityTitle(lang, rarity) {
  switch (rarity.type) {
    case 'uncommon':
      return lang('GiftRarityUncommon');
    case 'rare':
      return lang('GiftRarityRare');
    case 'epic':
      return lang('GiftRarityEpic');
    case 'legendary':
      return lang('GiftRarityLegendary');
    case 'regular':
      return (0,_util_textFormat__WEBPACK_IMPORTED_MODULE_3__.formatPercent)(rarity.rarityPercent);
    default:
      return undefined;
  }
}

/***/ },

/***/ "./src/components/common/helpers/renderMessageText.ts"
/*!************************************************************!*\
  !*** ./src/components/common/helpers/renderMessageText.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderMessageSummary: () => (/* binding */ renderMessageSummary),
/* harmony export */   renderMessageText: () => (/* binding */ renderMessageText)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../global/helpers/messageSummary */ "./src/global/helpers/messageSummary.ts");
/* harmony import */ var _util_keys_messageKey__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/keys/messageKey */ "./src/util/keys/messageKey.ts");
/* harmony import */ var _util_localization__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/localization */ "./src/util/localization/index.ts");
/* harmony import */ var _util_trimText__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../util/trimText */ "./src/util/trimText.ts");
/* harmony import */ var _renderText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _renderTextWithEntities__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./renderTextWithEntities */ "./src/components/common/helpers/renderTextWithEntities.tsx");









function renderMessageText({
  message,
  highlight,
  emojiSize,
  asPreview,
  truncateLength,
  isProtected,
  forcePlayback,
  shouldRenderAsHtml,
  isForMediaViewer,
  threadId,
  maxTimestamp
}) {
  const {
    text,
    entities
  } = message.content.text || {};
  if (!text) {
    const contentNotSupportedText = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getMessageTextWithFallback)((0,_util_localization__WEBPACK_IMPORTED_MODULE_5__.getTranslationFn)(), message)?.text;
    return contentNotSupportedText ? [(0,_util_trimText__WEBPACK_IMPORTED_MODULE_6__["default"])(contentNotSupportedText, truncateLength)] : undefined;
  }
  const messageKey = (0,_util_keys_messageKey__WEBPACK_IMPORTED_MODULE_4__.getMessageKey)(message);
  return (0,_renderTextWithEntities__WEBPACK_IMPORTED_MODULE_8__.renderTextWithEntities)({
    text: (0,_util_trimText__WEBPACK_IMPORTED_MODULE_6__["default"])(text, truncateLength),
    entities,
    highlight,
    emojiSize,
    shouldRenderAsHtml,
    containerId: `${isForMediaViewer ? 'mv-' : ''}${messageKey}`,
    asPreview,
    isProtected,
    forcePlayback,
    messageId: 'id' in message ? message.id : undefined,
    chatId: message.chatId,
    threadId,
    maxTimestamp
  });
}

// TODO Use Message Summary component instead
function renderMessageSummary(lang, message, noEmoji = false, highlight, truncateLength = _global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_3__.TRUNCATED_SUMMARY_LENGTH) {
  const {
    entities
  } = message.content.text || {};
  const global = (0,_global__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
  const statefulContent = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getMessageStatefulContent)(global, message);
  const hasSpoilers = entities?.some(e => e.type === _api_types__WEBPACK_IMPORTED_MODULE_1__.ApiMessageEntityTypes.Spoiler);
  const hasCustomEmoji = entities?.some(e => e.type === _api_types__WEBPACK_IMPORTED_MODULE_1__.ApiMessageEntityTypes.CustomEmoji);
  if (!hasSpoilers && !hasCustomEmoji) {
    const text = (0,_util_trimText__WEBPACK_IMPORTED_MODULE_6__["default"])((0,_global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_3__.getMessageSummaryText)(lang, message, statefulContent, noEmoji), truncateLength);
    if (highlight) {
      return (0,_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])(text, ['emoji', 'highlight'], {
        highlight
      });
    } else {
      return (0,_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])(text);
    }
  }
  const emoji = !noEmoji && (0,_global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_3__.getMessageSummaryEmoji)(message);
  const emojiWithSpace = emoji ? `${emoji} ` : '';
  const text = renderMessageText({
    message,
    highlight,
    asPreview: true,
    truncateLength
  });
  const description = (0,_global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_3__.getMessageSummaryDescription)(lang, message, statefulContent, text);
  return [...(0,_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])(emojiWithSpace), ...(Array.isArray(description) ? description : [description])].filter(Boolean);
}

/***/ },

/***/ "./src/components/common/helpers/sortChatIds.ts"
/*!******************************************************!*\
  !*** ./src/components/common/helpers/sortChatIds.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ sortChatIds)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/iteratees */ "./src/util/iteratees.ts");



const VERIFIED_PRIORITY_BASE = 3e9;
const PINNED_PRIORITY_BASE = 3e8;
function sortChatIds(chatIds, shouldPrioritizeVerified = false, priorityIds, currentUserId) {
  // Avoid calling sort on every global change
  const global = (0,_global__WEBPACK_IMPORTED_MODULE_0__.getGlobal)();
  return (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.orderBy)(chatIds, id => {
    if (id === currentUserId) {
      return Infinity;
    }
    const chat = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_1__.selectChat)(global, id);
    if (!chat) {
      return 0;
    }
    let priority = 0;
    const lastMessage = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_1__.selectChatLastMessage)(global, id);
    if (lastMessage) {
      priority += lastMessage.date;
    }
    if (shouldPrioritizeVerified && chat.isVerified) {
      priority += VERIFIED_PRIORITY_BASE; // ~100 years in seconds
    }
    if (priorityIds && priorityIds.includes(id)) {
      priority = Date.now() + PINNED_PRIORITY_BASE + (priorityIds.length - priorityIds.indexOf(id));
    }
    return priority;
  }, 'desc');
}

/***/ },

/***/ "./src/components/common/pickers/PeerPicker.tsx"
/*!******************************************************!*\
  !*** ./src/components/common/pickers/PeerPicker.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../config */ "./src/config.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_focusNoScroll__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../util/focusNoScroll */ "./src/util/focusNoScroll.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _util_memo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../util/memo */ "./src/util/memo.ts");
/* harmony import */ var _hooks_useInfiniteScroll__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useInfiniteScroll */ "./src/hooks/useInfiniteScroll.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_Checkbox__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../ui/Checkbox */ "./src/components/ui/Checkbox.tsx");
/* harmony import */ var _ui_InfiniteScroll__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../ui/InfiniteScroll */ "./src/components/ui/InfiniteScroll.tsx");
/* harmony import */ var _ui_InputText__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../ui/InputText */ "./src/components/ui/InputText.tsx");
/* harmony import */ var _ui_Loading__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../ui/Loading */ "./src/components/ui/Loading.tsx");
/* harmony import */ var _ui_Radio__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../ui/Radio */ "./src/components/ui/Radio.tsx");
/* harmony import */ var _Avatar__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _FullNameTitle__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../FullNameTitle */ "./src/components/common/FullNameTitle.tsx");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _PeerChip__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../PeerChip */ "./src/components/common/PeerChip.tsx");
/* harmony import */ var _PickerItem__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./PickerItem */ "./src/components/common/pickers/PickerItem.tsx");
/* harmony import */ var _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./PickerStyles.module.scss */ "./src/components/common/pickers/PickerStyles.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



























const MAX_FULL_ITEMS = 10;
const ALWAYS_FULL_ITEMS_COUNT = 5;
const ITEM_CLASS_NAME = 'PeerPickerItem';
const PeerPicker = ({
  className,
  categories,
  itemIds: itemIdsProp,
  sections,
  categoryPlaceholderKey,
  filterValue,
  filterPlaceholder,
  notFoundText,
  searchInputId,
  itemClassName,
  isLoading,
  noScrollRestore,
  isSearchable,
  lockedUnselectedSubtitle,
  forceShowSelf,
  isViewOnly,
  itemInputType,
  withStatus,
  withPeerTypes,
  withPeerUsernames,
  withDefaultPadding,
  onFilterChange,
  onDisabledClick,
  onLoadMore,
  ...optionalProps
}) => {
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const itemIds = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (itemIdsProp) return itemIdsProp;
    return sections.flatMap(section => section.ids);
  }, [itemIdsProp, sections]);
  const allowMultiple = optionalProps.allowMultiple;
  const lockedSelectedIds = allowMultiple ? optionalProps.lockedSelectedIds : undefined;
  const lockedUnselectedIds = allowMultiple ? optionalProps.lockedUnselectedIds : undefined;
  const selectedCategories = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (allowMultiple) {
      return optionalProps.selectedCategories;
    }
    return optionalProps.selectedCategory ? [optionalProps.selectedCategory] : _util_memo__WEBPACK_IMPORTED_MODULE_10__.MEMO_EMPTY_ARRAY;
  }, [allowMultiple, optionalProps.selectedCategory, optionalProps.selectedCategories]);
  const selectedIds = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (allowMultiple) {
      return optionalProps.selectedIds;
    }
    return optionalProps.selectedId ? [optionalProps.selectedId] : _util_memo__WEBPACK_IMPORTED_MODULE_10__.MEMO_EMPTY_ARRAY;
  }, [allowMultiple, optionalProps.selectedId, optionalProps.selectedIds]);
  const inputRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const shouldMinimize = selectedIds.length > MAX_FULL_ITEMS;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isSearchable) return undefined;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__.requestMeasure)(() => {
      (0,_util_focusNoScroll__WEBPACK_IMPORTED_MODULE_8__["default"])(inputRef.current);
    });
  }, [isSearchable]);
  const lockedSelectedIdsSet = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new Set(lockedSelectedIds), [lockedSelectedIds]);
  const lockedUnselectedIdsSet = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => new Set(lockedUnselectedIds), [lockedUnselectedIds]);
  const unlockedSelectedIds = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return selectedIds.filter(id => !lockedSelectedIdsSet.has(id));
  }, [lockedSelectedIdsSet, selectedIds]);
  const categoriesByType = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!categories) return {};
    return (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_9__.buildCollectionByKey)(categories, 'type');
  }, [categories]);
  const sortedItemIds = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (filterValue) {
      return itemIds;
    }
    const lockedSelectedBucket = [];
    const unlockedBucket = [];
    const lockedUnselectableBucket = [];
    itemIds.forEach(id => {
      if (lockedSelectedIdsSet.has(id)) {
        lockedSelectedBucket.push(id);
      } else if (lockedUnselectedIdsSet.has(id)) {
        lockedUnselectableBucket.push(id);
      } else {
        unlockedBucket.push(id);
      }
    });
    return lockedSelectedBucket.concat(unlockedBucket, lockedUnselectableBucket);
  }, [filterValue, itemIds, lockedSelectedIdsSet, lockedUnselectedIdsSet]);
  const handleItemClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_13__["default"])(id => {
    if (lockedSelectedIdsSet.has(id)) {
      onDisabledClick?.(id, true);
      return;
    }
    if (lockedUnselectedIdsSet.has(id)) {
      onDisabledClick?.(id, false);
      return;
    }
    if (allowMultiple && categoriesByType[id]) {
      const categoryType = categoriesByType[id].type;
      const newSelectedCategories = selectedCategories?.slice() || [];
      if (newSelectedCategories.includes(categoryType)) {
        newSelectedCategories.splice(newSelectedCategories.indexOf(categoryType), 1);
      } else {
        newSelectedCategories.push(categoryType);
      }
      optionalProps.onSelectedCategoriesChange?.(newSelectedCategories);
      return;
    }
    if (allowMultiple) {
      const newSelectedIds = selectedIds.slice();
      if (newSelectedIds.includes(id)) {
        newSelectedIds.splice(newSelectedIds.indexOf(id), 1);
      } else {
        newSelectedIds.push(id);
      }
      optionalProps.onSelectedIdsChange?.(newSelectedIds);
      return;
    }
    if (categoriesByType[id]) {
      optionalProps.onSelectedCategoryChange?.(categoriesByType[id].type);
      return;
    }
    optionalProps.onSelectedIdChange?.(id);
  });
  const handleFilterChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_13__["default"])(e => {
    const {
      value
    } = e.currentTarget;
    onFilterChange?.(value);
  });
  const [viewportIds, getMore] = (0,_hooks_useInfiniteScroll__WEBPACK_IMPORTED_MODULE_11__["default"])(onLoadMore, sortedItemIds, Boolean(filterValue));
  const renderItem = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)((id, isCategory) => {
    const global = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    const category = isCategory ? categoriesByType[id] : undefined;
    const peer = !isCategory ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_6__.selectPeer)(global, id) : undefined;
    const peerOrCategory = peer || category;
    if (!peerOrCategory) {
      if (_config__WEBPACK_IMPORTED_MODULE_2__.DEBUG) {
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsxs)("div", {
          children: ["No peer or category with ID", id]
        }, id);
      }
      return undefined;
    }
    const isSelf = peer && !(0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__.isApiPeerChat)(peer) ? peer.isSelf && !forceShowSelf : undefined;
    const isAlwaysUnselected = lockedUnselectedIdsSet.has(id);
    const isAlwaysSelected = lockedSelectedIdsSet.has(id);
    const isLocked = isAlwaysUnselected || isAlwaysSelected;
    const isChecked = category ? selectedCategories?.includes(category.type) : selectedIds.includes(id);
    function getInputElement() {
      if (isLocked) return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_22__["default"], {
        name: "lock-badge"
      });
      if (itemInputType === 'radio') {
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_ui_Radio__WEBPACK_IMPORTED_MODULE_19__["default"], {
          checked: isChecked,
          disabled: isLocked,
          onlyInput: true
        });
      }
      if (itemInputType === 'checkbox') {
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_ui_Checkbox__WEBPACK_IMPORTED_MODULE_15__["default"], {
          checked: isChecked,
          disabled: isLocked,
          onlyInput: true
        });
      }
      return undefined;
    }
    function getSubtitle() {
      if (isAlwaysUnselected) return [lockedUnselectedSubtitle];
      if (!peer) return undefined;
      if (withPeerUsernames) {
        const username = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getMainUsername)(peer);
        if (username) {
          return [`@${username}`];
        }
      }
      if (withStatus) {
        if ((0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__.isApiPeerChat)(peer)) {
          return [(0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getGroupStatus)(lang, peer)];
        }
        const userStatus = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_6__.selectUserStatus)(global, peer.id);
        return [(0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getUserStatus)(oldLang, peer, userStatus), (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isUserOnline)(peer, userStatus, true) && _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].onlineStatus)];
      }
      if (withPeerTypes) {
        const langKey = (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__.getPeerTypeKey)(peer);
        return langKey && [oldLang(langKey)];
      }
      return undefined;
    }
    const [subtitle, subtitleClassName] = getSubtitle() || [];
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_PickerItem__WEBPACK_IMPORTED_MODULE_24__["default"], {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_7__["default"])(ITEM_CLASS_NAME, itemClassName),
      title: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_FullNameTitle__WEBPACK_IMPORTED_MODULE_21__["default"], {
        peer: peerOrCategory
      }),
      avatarElement: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_Avatar__WEBPACK_IMPORTED_MODULE_20__["default"], {
        peer: peer || category,
        isSavedMessages: isSelf,
        size: "medium"
      }),
      subtitle: subtitle,
      subtitleClassName: subtitleClassName,
      disabled: isLocked,
      inactive: isViewOnly,
      ripple: true,
      inputElement: getInputElement(),
      inputPosition: "end",
      onClick: () => handleItemClick(id),
      onDisabledClick: onDisabledClick && (() => onDisabledClick(id, isAlwaysSelected))
    }, id);
  }, [categoriesByType, forceShowSelf, isViewOnly, itemClassName, itemInputType, oldLang, lockedSelectedIdsSet, lockedUnselectedIdsSet, lockedUnselectedSubtitle, onDisabledClick, selectedCategories, selectedIds, withPeerTypes, withStatus, withPeerUsernames, lang]);
  const beforeChildren = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!categories?.length) return undefined;
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsxs)("div", {
      children: [categoryPlaceholderKey && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)("div", {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].pickerCategoryTitle,
        children: oldLang(categoryPlaceholderKey)
      }), categories?.map(category => renderItem(category.type, true)), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)("div", {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].pickerCategoryTitle,
        children: oldLang('FilterChats')
      })]
    }, "categories");
  }, [categories, categoryPlaceholderKey, oldLang, renderItem]);
  const renderItems = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!sections) {
      return viewportIds?.map(id => renderItem(id));
    }
    const result = [];
    sections.forEach(section => {
      if (section.ids.length === 0) return;
      result.push((0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)("div", {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].sectionHeader,
        children: section.title
      }, section.key));
      section.ids.forEach(id => {
        result.push(renderItem(id));
      });
    });
    return result;
  }, [sections, viewportIds, renderItem]);
  const hasContent = sections ? sections.some(s => s.ids.length > 0) : Boolean(viewportIds?.length);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_7__["default"])(_PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].container, className),
    children: [isSearchable && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_7__["default"])(_PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].header, 'custom-scroll'),
      dir: oldLang.isRtl ? 'rtl' : undefined,
      children: [selectedCategories?.map(category => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_PeerChip__WEBPACK_IMPORTED_MODULE_23__["default"], {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].peerChip,
        customPeer: categoriesByType[category],
        onClick: handleItemClick,
        clickArg: category,
        canClose: true
      })), lockedSelectedIds?.map((id, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_PeerChip__WEBPACK_IMPORTED_MODULE_23__["default"], {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].peerChip,
        peerId: id,
        isMinimized: shouldMinimize && i < selectedIds.length - ALWAYS_FULL_ITEMS_COUNT,
        forceShowSelf: forceShowSelf,
        onClick: handleItemClick,
        clickArg: id
      })), unlockedSelectedIds.map((id, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_PeerChip__WEBPACK_IMPORTED_MODULE_23__["default"], {
        className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].peerChip,
        peerId: id,
        isMinimized: shouldMinimize && i + (lockedSelectedIds?.length || 0) < selectedIds.length - ALWAYS_FULL_ITEMS_COUNT,
        canClose: true,
        onClick: handleItemClick,
        clickArg: id
      })), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_ui_InputText__WEBPACK_IMPORTED_MODULE_17__["default"], {
        id: searchInputId,
        ref: inputRef,
        value: filterValue,
        onChange: handleFilterChange,
        placeholder: filterPlaceholder || oldLang('SelectChat')
      })]
    }), hasContent ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_ui_InfiniteScroll__WEBPACK_IMPORTED_MODULE_16__["default"], {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_7__["default"])(_PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].pickerList, withDefaultPadding && _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].padded, 'custom-scroll'),
      items: viewportIds,
      itemSelector: `.${ITEM_CLASS_NAME}`,
      beforeChildren: beforeChildren,
      onLoadMore: getMore,
      noScrollRestore: noScrollRestore,
      children: renderItems()
    }) : !isLoading && viewportIds && !viewportIds.length ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)("p", {
      className: _PickerStyles_module_scss__WEBPACK_IMPORTED_MODULE_25__["default"].noResults,
      children: notFoundText || 'Sorry, nothing found.'
    }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_26__.jsx)(_ui_Loading__WEBPACK_IMPORTED_MODULE_18__["default"], {})]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PeerPicker));

/***/ },

/***/ "./src/components/common/pickers/PickerItem.tsx"
/*!******************************************************!*\
  !*** ./src/components/common/pickers/PickerItem.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _ui_RippleEffect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/RippleEffect */ "./src/components/ui/RippleEffect.tsx");
/* harmony import */ var _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PickerItem.module.scss */ "./src/components/common/pickers/PickerItem.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const PickerItem = ({
  title,
  subtitle,
  avatarElement,
  inputElement,
  inputPosition = 'start',
  disabled,
  inactive,
  ripple,
  className,
  titleClassName,
  subtitleClassName,
  style,
  onClick,
  onDisabledClick
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const isClickable = !inactive && !disabled;
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    if (inactive) return;
    if (disabled) {
      onDisabledClick?.();
      return;
    }
    onClick?.();
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].root, subtitle && _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].multiline, disabled && _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].disabled, isClickable && _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].clickable, avatarElement && _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].withAvatar, className),
    onClick: handleClick,
    style: style,
    dir: lang.isRtl ? 'rtl' : undefined,
    role: isClickable ? 'button' : undefined,
    tabIndex: isClickable ? 0 : undefined,
    children: [!disabled && !inactive && ripple && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui_RippleEffect__WEBPACK_IMPORTED_MODULE_4__["default"], {}), Boolean(inputElement) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].input, inputPosition === 'end' ? _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].endInput : _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].startInput),
      children: inputElement
    }), Boolean(avatarElement) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].avatarElement,
      children: avatarElement
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].title, titleClassName),
      children: title
    }), Boolean(subtitle) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].subtitle, subtitleClassName),
      children: subtitle
    }), !inputElement && _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_0__.IS_IOS && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: _PickerItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].separator
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PickerItem);

/***/ },

/***/ "./src/components/common/profile/RadialPatternBackground.tsx"
/*!*******************************************************************!*\
  !*** ./src/components/common/profile/RadialPatternBackground.tsx ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_colors_ts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/colors.ts */ "./src/util/colors.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../util/files */ "./src/util/files.ts");
/* harmony import */ var _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useAsync__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../hooks/useAsync */ "./src/hooks/useAsync.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useResizeObserver */ "./src/hooks/useResizeObserver.ts");
/* harmony import */ var _hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/window/useDevicePixelRatio */ "./src/hooks/window/useDevicePixelRatio.ts");
/* harmony import */ var _RadialPatternBackground_module_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./RadialPatternBackground.module.scss */ "./src/components/common/profile/RadialPatternBackground.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");















const BASE_RING_ITEM_COUNT = 8;
const RING_INCREMENT = 0.5;
const DEFAULT_CENTER_EMPTINESS = 0.1;
const DEFAULT_MAX_RADIUS = 0.42;
const MIN_SIZE = 4 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_7__.REM;
const DARK_LUMA_THRESHOLD = 255 * 0.2;
const DEFAULT_PATTERN_SIZE = 20;
const DEFAULT_RINGS_COUNT = 3;
const DEFAULT_OVAL_FACTOR = 1.4;
const RadialPatternBackground = ({
  backgroundColors,
  patternIcon,
  patternUrl,
  patternColor,
  patternSize = DEFAULT_PATTERN_SIZE,
  centerEmptiness = DEFAULT_CENTER_EMPTINESS,
  ringsCount = DEFAULT_RINGS_COUNT,
  ovalFactor = DEFAULT_OVAL_FACTOR,
  maxRadius = DEFAULT_MAX_RADIUS,
  withLinearGradient,
  clearBottomSector,
  className,
  canvasClassName,
  yPosition,
  withAdaptiveHeight
}) => {
  const containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const canvasRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [getContainerSize, setContainerSize] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useSignal)({
    width: 0,
    height: 0
  });
  const dpr = (0,_hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const previewMediaHash = patternIcon && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getStickerMediaHash)(patternIcon, 'preview');
  const previewUrl = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_10__["default"])(previewMediaHash);
  const imageUrl = previewUrl || patternUrl;
  const {
    result: emojiImage
  } = (0,_hooks_useAsync__WEBPACK_IMPORTED_MODULE_8__["default"])(() => imageUrl ? (0,_util_files__WEBPACK_IMPORTED_MODULE_6__.preloadImage)(imageUrl) : Promise.resolve(undefined), [imageUrl]);
  const patternPositions = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const coordinates = [];
    for (let ring = 1; ring <= ringsCount; ring++) {
      const ringItemCount = Math.floor(BASE_RING_ITEM_COUNT * (1 + (ring - 1) * RING_INCREMENT));
      const ringProgress = ring / ringsCount;
      const ringRadius = centerEmptiness + (maxRadius - centerEmptiness) * ringProgress;
      const angleShift = ring % 2 === 0 ? Math.PI / ringItemCount : 0;
      for (let i = 0; i < ringItemCount; i++) {
        const angle = i / ringItemCount * Math.PI * 2 + angleShift;
        if (clearBottomSector && angle > Math.PI * 0.45 && angle < Math.PI * 0.55) {
          continue;
        }
        const xOffset = ringRadius * Math.cos(angle) * ovalFactor;
        const yOffset = ringRadius * Math.sin(angle);
        const sizeFactor = 1.65 - ringProgress + Math.random() / ringsCount;
        coordinates.push({
          x: xOffset,
          y: yOffset,
          sizeFactor
        });
      }
    }
    return coordinates;
  }, [centerEmptiness, clearBottomSector, maxRadius, ovalFactor, ringsCount]);
  (0,_hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_11__["default"])(containerRef, entry => {
    setContainerSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const container = containerRef.current;
    if (container) {
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      });
    }
  }, [setContainerSize]);
  const draw = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => {
    const canvas = canvasRef.current;
    if (!canvas || !emojiImage) return;
    const ctx = canvas.getContext('2d');
    const {
      width,
      height
    } = canvas;
    if (!width || !height) return;
    const centerX = width / 2;
    const centerY = withAdaptiveHeight ? height / 2 : yPosition !== undefined ? yPosition * dpr : width / 2;
    ctx.clearRect(0, 0, width, height);
    patternPositions.forEach(({
      x,
      y,
      sizeFactor
    }) => {
      const renderX = x * Math.max(width, MIN_SIZE * dpr) + centerX;
      const renderY = y * Math.max(withAdaptiveHeight ? height : width, MIN_SIZE * dpr) + centerY;
      const size = patternSize * dpr * sizeFactor;
      ctx.drawImage(emojiImage, renderX - size / 2, renderY - size / 2, size, size);
    });
    if (patternColor) {
      ctx.fillStyle = patternColor;
    } else {
      const baseColor = backgroundColors?.[1] ?? backgroundColors?.[0] ?? '#000000';
      const isDark = (0,_util_colors_ts__WEBPACK_IMPORTED_MODULE_5__.getColorLuma)((0,_util_colors_ts__WEBPACK_IMPORTED_MODULE_5__.hex2rgb)(baseColor)) < DARK_LUMA_THRESHOLD;
      ctx.fillStyle = (0,_util_colors_ts__WEBPACK_IMPORTED_MODULE_5__.adjustHsv)(baseColor, 0.5, isDark ? 0.28 : -0.28);
    }
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillRect(0, 0, width, height);
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * maxRadius);
    radialGradient.addColorStop(0, 'rgb(255 255 255 / 0.4)');
    radialGradient.addColorStop(1, 'rgb(255 255 255 / 0.9)');

    // Scale around the gradient center
    ctx.translate(centerX, centerY);
    ctx.scale(1, 1 / ovalFactor);
    ctx.translate(-centerX, -centerY);

    // Alpha mask
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = radialGradient;
    // The higher the ovalFactor, the more we need to extend vertically
    const fillHeight = height * ovalFactor;
    ctx.fillRect(0, -fillHeight, width, fillHeight * 2);
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    draw();
  }, [emojiImage, patternPositions, yPosition, ovalFactor, patternColor]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const {
      width,
      height
    } = getContainerSize();
    const canvas = canvasRef.current;
    if (!width || !height || !canvas) {
      return;
    }
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      draw();
    });
  }, [getContainerSize, dpr]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
    ref: containerRef,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_RadialPatternBackground_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].root, withLinearGradient && Boolean(backgroundColors?.length) && _RadialPatternBackground_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].withLinearGradient, className),
    style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_4__["default"])(backgroundColors && `--_bg-light: ${backgroundColors[0]}`, backgroundColors && `--_bg-dark: ${backgroundColors[1] ?? backgroundColors[0]}`, yPosition !== undefined && `--_y-shift: ${yPosition}px`),
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("canvas", {
      ref: canvasRef,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_RadialPatternBackground_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].canvas, emojiImage && _RadialPatternBackground_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].showing, canvasClassName),
      "aria-hidden": "true"
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RadialPatternBackground));

/***/ },

/***/ "./src/components/common/reactions/CustomEmojiEffect.tsx"
/*!***************************************************************!*\
  !*** ./src/components/common/reactions/CustomEmojiEffect.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _CustomEmoji__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _CustomEmojiEffect_module_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CustomEmojiEffect.module.scss */ "./src/components/common/reactions/CustomEmojiEffect.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const EFFECT_AMOUNT = 7;
const CustomEmojiEffect = ({
  reaction,
  isLottie,
  className,
  particleSize,
  onEnded
}) => {
  const stickerHash = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getStickerHashById)(reaction.documentId, true);
  const previewMediaData = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_5__["default"])(!isLottie ? stickerHash : undefined);
  const paths = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_OFFSET_PATH_SUPPORTED) return [];
    return Array.from({
      length: EFFECT_AMOUNT
    }).map(() => generateRandomDropPath(particleSize));
  }, [particleSize]);
  if (!previewMediaData && !isLottie) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_CustomEmojiEffect_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].root, className),
    style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_4__["default"])(Boolean(particleSize) && `--particle-size: ${particleSize}px`),
    children: paths.map((path, i) => {
      const style = `--offset-path: path('${path}');`;
      if (isLottie) {
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_CustomEmoji__WEBPACK_IMPORTED_MODULE_6__["default"], {
          documentId: reaction.documentId,
          className: _CustomEmojiEffect_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].particle,
          style: style,
          withSharedAnimation: true,
          size: particleSize,
          onAnimationEnd: i === 0 ? onEnded : undefined
        });
      }
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
        src: previewMediaData,
        alt: "",
        className: _CustomEmojiEffect_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].particle,
        style: style,
        draggable: false,
        onAnimationEnd: i === 0 ? onEnded : undefined
      });
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CustomEmojiEffect));
function generateRandomDropPath(particleSize = 20) {
  const x = (particleSize / 2 + Math.random() * particleSize * 3) * (Math.random() > 0.5 ? 1 : -1);
  const y = particleSize + Math.random() * particleSize * 4;
  return `M 0 0 C 0 0 ${x} ${-y - particleSize} ${x} ${y}`;
}

/***/ },

/***/ "./src/components/common/reactions/PaidReactionEmoji.tsx"
/*!***************************************************************!*\
  !*** ./src/components/common/reactions/PaidReactionEmoji.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/animatedAssets */ "./src/components/common/helpers/animatedAssets.ts");
/* harmony import */ var _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../hooks/useEffectWithPrevDeps */ "./src/hooks/useEffectWithPrevDeps.ts");
/* harmony import */ var _hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useIntersectionObserver */ "./src/hooks/useIntersectionObserver.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _AnimatedIcon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../AnimatedIcon */ "./src/components/common/AnimatedIcon.tsx");
/* harmony import */ var _icons_StarIcon__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../icons/StarIcon */ "./src/components/common/icons/StarIcon.tsx");
/* harmony import */ var _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ReactionAnimatedEmoji.module.scss */ "./src/components/common/reactions/ReactionAnimatedEmoji.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");
















const ICON_SIZE = 1.5 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_7__.REM;
const EFFECT_SIZE = 6.5 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_7__.REM;
const MAX_EFFECT_COUNT = _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_IOS || _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_ANDROID ? 2 : 5;
const QUALITY = _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_IOS || _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_ANDROID ? 2 : 3;
const PaidReactionEmoji = ({
  containerId,
  reaction,
  className,
  size = ICON_SIZE,
  effectSize = EFFECT_SIZE,
  activeReactions,
  localAmount,
  withEffects,
  observeIntersection
}) => {
  const {
    stopActiveReaction
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const effectRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [effectsIds, setEffectsIds] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const isIntersecting = (0,_hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_9__.useIsIntersecting)(ref, observeIntersection);
  const activeReaction = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => activeReactions?.find(active => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isSameReaction)(active, reaction)), [activeReactions, reaction]);
  const shouldPlayEffect = Boolean(withEffects && activeReaction);
  const canAddMoreEffects = effectsIds.length < MAX_EFFECT_COUNT;
  (0,_hooks_useEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__["default"])(([prevLocalAmount]) => {
    if (!shouldPlayEffect) {
      setEffectsIds([]);
      return;
    }
    if (!localAmount || localAmount <= (prevLocalAmount || 0)) {
      return;
    }
    if (canAddMoreEffects) {
      setEffectsIds(prev => [...prev, Date.now()]);
    }
  }, [localAmount, canAddMoreEffects, shouldPlayEffect]);
  const {
    shouldRender: shouldRenderEffect
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_11__["default"])({
    ref: effectRef,
    noMountTransition: true,
    isOpen: shouldPlayEffect,
    className: 'slow',
    withShouldRender: true
  });
  const handleEnded = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_10__["default"])(() => {
    const newEffectsIds = effectsIds.slice(1);
    setEffectsIds(newEffectsIds);
    if (!newEffectsIds.length) {
      stopActiveReaction({
        containerId,
        reaction
      });
    }
  });
  const rootClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])(_ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_14__["default"].root, shouldRenderEffect && _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_14__["default"].animating, className);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("div", {
    className: rootClassName,
    ref: ref,
    teactFastList: true,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_icons_StarIcon__WEBPACK_IMPORTED_MODULE_13__["default"], {
      type: "gold",
      size: "adaptive",
      style: `width: ${size}px; height: ${size}px`
    }, "icon"), shouldRenderEffect && effectsIds.map(id => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_AnimatedIcon__WEBPACK_IMPORTED_MODULE_12__["default"], {
      ref: effectRef,
      className: _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_14__["default"].effect,
      size: effectSize,
      tgsUrl: _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_6__.LOCAL_TGS_URLS.StarReactionEffect,
      play: isIntersecting,
      noLoop: true,
      forceAlways: true,
      nonInteractive: true,
      quality: QUALITY,
      onEnded: handleEnded
    }, id))]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  containerId
}) => {
  const {
    activeReactions
  } = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectTabState)(global);
  const withEffects = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPerformanceSettingsValue)(global, 'reactionEffects');
  return {
    activeReactions: activeReactions?.[containerId],
    withEffects
  };
})(PaidReactionEmoji)));

/***/ },

/***/ "./src/components/common/reactions/ReactionAnimatedEmoji.tsx"
/*!*******************************************************************!*\
  !*** ./src/components/common/reactions/ReactionAnimatedEmoji.tsx ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/math */ "./src/util/math.ts");
/* harmony import */ var _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../hooks/useIntersectionObserver */ "./src/hooks/useIntersectionObserver.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useShowTransitionDeprecated */ "./src/hooks/useShowTransitionDeprecated.ts");
/* harmony import */ var _hooks_useCustomEmoji__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../hooks/useCustomEmoji */ "./src/components/common/hooks/useCustomEmoji.ts");
/* harmony import */ var _AnimatedSticker__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../AnimatedSticker */ "./src/components/common/AnimatedSticker.tsx");
/* harmony import */ var _CustomEmoji__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _CustomEmojiEffect__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./CustomEmojiEffect */ "./src/components/common/reactions/CustomEmojiEffect.tsx");
/* harmony import */ var _ReactionStaticEmoji__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ReactionStaticEmoji */ "./src/components/common/reactions/ReactionStaticEmoji.tsx");
/* harmony import */ var _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./ReactionAnimatedEmoji.module.scss */ "./src/components/common/reactions/ReactionAnimatedEmoji.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



















const ICON_SIZE = 1.5 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM;
const CENTER_ICON_MULTIPLIER = 1.9;
const EFFECT_SIZE = 6.5 * _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM;
const CUSTOM_EMOJI_EFFECT_MULTIPLIER = 0.5;
const MIN_PARTICLE_SIZE = _helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM;
const ReactionAnimatedEmoji = ({
  containerId,
  reaction,
  className,
  size = ICON_SIZE,
  effectSize = EFFECT_SIZE,
  activeReactions,
  availableReactions,
  genericEffects,
  withEffects,
  withEffectOnly,
  shouldPause,
  shouldLoop,
  loopLimit,
  observeIntersection
}) => {
  const {
    stopActiveReaction
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const isCustom = reaction.type === 'custom';
  const availableReaction = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => availableReactions?.find(r => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isSameReaction)(r.reaction, reaction)), [availableReactions, reaction]);
  const centerIconId = availableReaction?.centerIcon?.id;
  const {
    customEmoji
  } = (0,_hooks_useCustomEmoji__WEBPACK_IMPORTED_MODULE_12__["default"])(isCustom ? reaction.documentId : undefined);
  const assignedEffectId = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!isCustom) return availableReaction?.aroundAnimation?.id;
    if (!customEmoji) return undefined;
    const assignedId = availableReactions?.find(available => available.reaction.emoticon === customEmoji.emoji)?.aroundAnimation?.id;
    return assignedId;
  }, [availableReaction, availableReactions, customEmoji, isCustom]);
  const effectId = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (assignedEffectId) {
      return assignedEffectId;
    }
    if (!genericEffects?.stickers) {
      return undefined;
    }
    const {
      stickers
    } = genericEffects;
    const randomIndex = Math.floor(Math.random() * stickers.length);
    return stickers[randomIndex].id;
  }, [assignedEffectId, genericEffects]);
  const isIntersecting = (0,_hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_8__.useIsIntersecting)(ref, observeIntersection);
  const mediaHashCenterIcon = centerIconId && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getStickerHashById)(centerIconId);
  const mediaHashEffect = effectId && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getStickerHashById)(effectId);
  const mediaDataCenterIcon = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_10__["default"])(mediaHashCenterIcon);
  const mediaDataEffect = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_10__["default"])(mediaHashEffect);
  const activeReaction = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => activeReactions?.find(active => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isSameReaction)(active, reaction)), [activeReactions, reaction]);
  const shouldPlayEffect = Boolean(withEffects && activeReaction && (isCustom || mediaDataCenterIcon) && mediaDataEffect);
  const shouldPlayCenter = isIntersecting && (shouldPlayEffect && !withEffectOnly || shouldLoop);
  const {
    shouldRender: shouldRenderEffect,
    transitionClassNames: animationClassNames
  } = (0,_hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_11__["default"])(shouldPlayEffect, undefined, true, 'slow');
  const {
    shouldRender: shouldRenderCenter,
    transitionClassNames: centerAnimationClassNames
  } = (0,_hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_11__["default"])(shouldPlayCenter, undefined, true, 'slow');
  const handleEnded = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => {
    stopActiveReaction({
      containerId,
      reaction
    });
  });
  const [isAnimationLoaded, markAnimationLoaded, unmarkAnimationLoaded] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const shouldShowStatic = !isCustom && (!shouldPlayCenter || !isAnimationLoaded);
  const {
    shouldRender: shouldRenderStatic,
    transitionClassNames: staticClassNames
  } = (0,_hooks_useShowTransitionDeprecated__WEBPACK_IMPORTED_MODULE_11__["default"])(shouldShowStatic, undefined, true);
  const rootClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].root, shouldRenderEffect && _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].animating, withEffectOnly && _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].withEffectOnly, className);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: rootClassName,
    ref: ref,
    children: [!withEffectOnly && shouldRenderStatic && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_ReactionStaticEmoji__WEBPACK_IMPORTED_MODULE_16__["default"], {
      className: staticClassNames,
      reaction: reaction,
      availableReactions: availableReactions,
      size: size,
      observeIntersection: observeIntersection
    }), !withEffectOnly && isCustom && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_CustomEmoji__WEBPACK_IMPORTED_MODULE_14__["default"], {
      documentId: reaction.documentId,
      className: _ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].customEmoji,
      size: size,
      noPlay: shouldPause,
      noVideoOnMobile: true,
      loopLimit: loopLimit,
      observeIntersectionForPlaying: observeIntersection,
      forceAlways: true
    }), shouldRenderCenter && !isCustom && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_13__["default"], {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].animatedIcon, centerAnimationClassNames),
      size: (0,_util_math__WEBPACK_IMPORTED_MODULE_5__.roundToNearestEven)(size * CENTER_ICON_MULTIPLIER),
      tgsUrl: mediaDataCenterIcon,
      play: isIntersecting && !shouldPause,
      noLoop: !shouldLoop,
      onLoad: markAnimationLoaded,
      onEnded: unmarkAnimationLoaded,
      forceAlways: true
    }, `${centerIconId}-${size}`), shouldRenderEffect && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.Fragment, {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_13__["default"], {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_ReactionAnimatedEmoji_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].effect, animationClassNames),
        size: effectSize,
        tgsUrl: mediaDataEffect,
        play: isIntersecting,
        noLoop: true,
        onEnded: handleEnded,
        forceAlways: true
      }, `${effectId}-${effectSize}`), isCustom && !assignedEffectId && isIntersecting && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_CustomEmojiEffect__WEBPACK_IMPORTED_MODULE_15__["default"], {
        reaction: reaction,
        className: animationClassNames,
        particleSize: Math.max(size * CUSTOM_EMOJI_EFFECT_MULTIPLIER, MIN_PARTICLE_SIZE),
        onEnded: handleEnded
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  containerId
}) => {
  const {
    genericEmojiEffects,
    reactions
  } = global;
  const {
    activeReactions
  } = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectTabState)(global);
  const withEffects = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPerformanceSettingsValue)(global, 'reactionEffects');
  return {
    activeReactions: activeReactions?.[containerId],
    availableReactions: reactions.availableReactions,
    genericEffects: genericEmojiEffects,
    withEffects
  };
})(ReactionAnimatedEmoji)));

/***/ },

/***/ "./src/components/common/reactions/ReactionStaticEmoji.tsx"
/*!*****************************************************************!*\
  !*** ./src/components/common/reactions/ReactionStaticEmoji.tsx ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_media_useThumbnail__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/media/useThumbnail */ "./src/hooks/media/useThumbnail.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _hooks_useMediaTransition__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../hooks/useMediaTransition */ "./src/hooks/useMediaTransition.ts");
/* harmony import */ var _CustomEmoji__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ReactionStaticEmoji_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ReactionStaticEmoji.scss */ "./src/components/common/reactions/ReactionStaticEmoji.scss");
/* harmony import */ var _assets_blank_png__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../assets/blank.png */ "./src/assets/blank.png");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const ReactionStaticEmoji = ({
  reaction,
  availableReactions,
  className,
  size,
  withIconHeart,
  observeIntersection
}) => {
  const availableReaction = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => availableReactions?.find(available => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.isSameReaction)(available.reaction, reaction)), [availableReactions, reaction]);
  const staticIcon = availableReaction?.staticIcon;
  const staticIconId = staticIcon?.id;
  const mediaHash = staticIconId ? `document${staticIconId}` : undefined;
  const cacheBuster = availableReaction?.isLocalCache ? 0 : 1;
  const mediaData = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__["default"])(mediaHash, false, undefined, undefined, cacheBuster);
  const thumbDataUri = (0,_hooks_media_useThumbnail__WEBPACK_IMPORTED_MODULE_3__["default"])(staticIcon?.thumbnail);
  const {
    ref: thumbRef
  } = (0,_hooks_useMediaTransition__WEBPACK_IMPORTED_MODULE_5__["default"])({
    hasMediaData: Boolean(thumbDataUri && !mediaData)
  });
  const {
    ref: mediaRef
  } = (0,_hooks_useMediaTransition__WEBPACK_IMPORTED_MODULE_5__["default"])({
    hasMediaData: Boolean(mediaData)
  });
  const shouldApplySizeFix = reaction.type === 'emoji' && reaction.emoticon === '🦄';
  const shouldReplaceWithHeartIcon = withIconHeart && reaction.type === 'emoji' && reaction.emoticon === '❤';
  if (reaction.type === 'custom') {
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_CustomEmoji__WEBPACK_IMPORTED_MODULE_6__["default"], {
      documentId: reaction.documentId,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('ReactionStaticEmoji', className),
      size: size,
      observeIntersectionForPlaying: observeIntersection
    });
  }
  if (shouldReplaceWithHeartIcon) {
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
      name: "heart",
      className: "ReactionStaticEmoji",
      style: `font-size: ${size}px; width: ${size}px`
    });
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('ReactionStaticEmoji', className),
    style: size ? `width: ${size}px; height: ${size}px` : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("img", {
      ref: thumbRef,
      className: "thumb",
      src: thumbDataUri,
      alt: "",
      draggable: false
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("img", {
      ref: mediaRef,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('media', shouldApplySizeFix && 'with-unicorn-fix'),
      src: mediaData || _assets_blank_png__WEBPACK_IMPORTED_MODULE_9__,
      alt: availableReaction?.title,
      draggable: false
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReactionStaticEmoji));

/***/ },

/***/ "./src/components/middle/composer/helpers/renderKeyboardButtonText.tsx"
/*!*****************************************************************************!*\
  !*** ./src/components/middle/composer/helpers/renderKeyboardButtonText.tsx ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ renderKeyboardButtonText)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../config */ "./src/config.ts");
/* harmony import */ var _util_replaceWithTeact__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/replaceWithTeact */ "./src/util/replaceWithTeact.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





function renderKeyboardButtonText(lang, button) {
  if (button.type === 'receipt') {
    return lang('PaymentReceipt');
  }
  if (button.type === 'buy') {
    return (0,_util_replaceWithTeact__WEBPACK_IMPORTED_MODULE_1__.replaceWithTeact)(button.text, _config__WEBPACK_IMPORTED_MODULE_0__.STARS_ICON_PLACEHOLDER, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
      name: "star"
    }));
  }
  return (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_2__["default"])(button.text);
}

/***/ },

/***/ "./src/components/middle/helpers/messageListReflow.ts"
/*!************************************************************!*\
  !*** ./src/components/middle/helpers/messageListReflow.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requestAfterMessageListReflow: () => (/* binding */ requestAfterMessageListReflow),
/* harmony export */   requestMessageListReflow: () => (/* binding */ requestMessageListReflow)
/* harmony export */ });
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");

let afterReflowCallbacks = [];

// For children effects that need to run after the message list reflow
function requestAfterMessageListReflow(cb) {
  afterReflowCallbacks.push(cb);
}
function requestMessageListReflow(cb) {
  (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_0__.requestForcedReflow)(() => {
    const mutationFn = cb();
    const callbacks = afterReflowCallbacks;
    afterReflowCallbacks = [];
    for (const afterCb of callbacks) {
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_0__.requestForcedReflow)(afterCb);
    }
    return mutationFn;
  });
}

/***/ },

/***/ "./src/components/middle/message/ActionMessage.tsx"
/*!*********************************************************!*\
  !*** ./src/components/middle/message/ActionMessage.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../types */ "./src/types/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../config */ "./src/config.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_helpers_replies__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../global/helpers/replies */ "./src/global/helpers/replies.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _global_selectors_threads__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../global/selectors/threads */ "./src/global/selectors/threads.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_keys_messageKey__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../util/keys/messageKey */ "./src/util/keys/messageKey.ts");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _util_visibility_isElementInViewport__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../util/visibility/isElementInViewport */ "./src/util/visibility/isElementInViewport.ts");
/* harmony import */ var _helpers_preventMessageInputBlur__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../helpers/preventMessageInputBlur */ "./src/components/middle/helpers/preventMessageInputBlur.ts");
/* harmony import */ var _hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../hooks/useAppLayout */ "./src/hooks/useAppLayout.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useEnsureMessage__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../hooks/useEnsureMessage */ "./src/hooks/useEnsureMessage.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../../hooks/useIntersectionObserver */ "./src/hooks/useIntersectionObserver.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _hooks_useFluidBackgroundFilter__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./hooks/useFluidBackgroundFilter */ "./src/components/middle/message/hooks/useFluidBackgroundFilter.tsx");
/* harmony import */ var _hooks_useFocusMessageListElement__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./hooks/useFocusMessageListElement */ "./src/components/middle/message/hooks/useFocusMessageListElement.ts");
/* harmony import */ var _ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../../ui/ConfirmDialog */ "./src/components/ui/ConfirmDialog.tsx");
/* harmony import */ var _ActionMessageText__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./ActionMessageText */ "./src/components/middle/message/ActionMessageText.tsx");
/* harmony import */ var _actions_ChannelPhoto__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./actions/ChannelPhoto */ "./src/components/middle/message/actions/ChannelPhoto.tsx");
/* harmony import */ var _actions_Gift__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./actions/Gift */ "./src/components/middle/message/actions/Gift.tsx");
/* harmony import */ var _actions_GiveawayPrize__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./actions/GiveawayPrize */ "./src/components/middle/message/actions/GiveawayPrize.tsx");
/* harmony import */ var _actions_NoForwardsRequest__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./actions/NoForwardsRequest */ "./src/components/middle/message/actions/NoForwardsRequest.tsx");
/* harmony import */ var _actions_StarGift__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./actions/StarGift */ "./src/components/middle/message/actions/StarGift.tsx");
/* harmony import */ var _actions_StarGiftPurchaseOffer__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./actions/StarGiftPurchaseOffer */ "./src/components/middle/message/actions/StarGiftPurchaseOffer.tsx");
/* harmony import */ var _actions_StarGiftUnique__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./actions/StarGiftUnique */ "./src/components/middle/message/actions/StarGiftUnique.tsx");
/* harmony import */ var _actions_SuggestedPhoto__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./actions/SuggestedPhoto */ "./src/components/middle/message/actions/SuggestedPhoto.tsx");
/* harmony import */ var _actions_SuggestedPostApproval__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./actions/SuggestedPostApproval */ "./src/components/middle/message/actions/SuggestedPostApproval.tsx");
/* harmony import */ var _actions_SuggestedPostBalanceTooLow__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./actions/SuggestedPostBalanceTooLow */ "./src/components/middle/message/actions/SuggestedPostBalanceTooLow.tsx");
/* harmony import */ var _actions_SuggestedPostRejected__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./actions/SuggestedPostRejected */ "./src/components/middle/message/actions/SuggestedPostRejected.tsx");
/* harmony import */ var _ContextMenuContainer__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./ContextMenuContainer */ "./src/components/middle/message/ContextMenuContainer.tsx");
/* harmony import */ var _InlineButtons__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./InlineButtons */ "./src/components/middle/message/InlineButtons.tsx");
/* harmony import */ var _reactions_Reactions__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./reactions/Reactions */ "./src/components/middle/message/reactions/Reactions.tsx");
/* harmony import */ var _SimilarChannels__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./SimilarChannels */ "./src/components/middle/message/SimilarChannels.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














































const SINGLE_LINE_ACTIONS = new Set(['pinMessage', 'chatEditPhoto', 'chatDeletePhoto', 'todoCompletions', 'todoAppendTasks', 'pollAppendAnswer', 'pollDeleteAnswer', 'unsupported']);
const HIDDEN_TEXT_ACTIONS = new Set(['giftCode', 'prizeStars', 'suggestProfilePhoto', 'suggestedPostApproval', 'starGiftPurchaseOffer', 'noForwardsRequest']);
const ActionMessage = ({
  message,
  threadId,
  sender,
  currentUserId,
  appearanceOrder,
  isJustAdded,
  isLastInList,
  memoFirstUnreadIdRef,
  getIsMessageListReady,
  isInsideTopic,
  isFocused,
  focusDirection,
  noFocusHighlight,
  replyMessage,
  actionMessageBg,
  isCurrentUserPremium,
  isInSelectMode,
  hasUnreadReaction,
  hasUnreadPollVote,
  isResizingContainer,
  scrollTargetPosition,
  isAccountFrozen,
  noForwardsRequestExpirePeriod,
  observeIntersectionForBottom,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  onMessageUnmount
}) => {
  const {
    requestConfetti,
    openMediaViewer,
    getReceipt,
    checkGiftCode,
    openPrizeStarsTransactionFromGiveaway,
    openPremiumModal,
    openStarsTransactionFromGift,
    openGiftInfoModalFromMessage,
    toggleChannelRecommendations,
    animateUnreadReaction,
    markMentionsRead,
    markPollVotesRead,
    focusMessage,
    openGiftOfferAcceptModal,
    declineStarGiftOffer,
    showNotification,
    toggleNoForwards
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    id,
    chatId
  } = message;
  const action = message.content.action;
  const isLocal = (0,_util_keys_messageKey__WEBPACK_IMPORTED_MODULE_13__.isLocalMessageId)(id);
  const isTextHidden = HIDDEN_TEXT_ACTIONS.has(action.type);
  const isSingleLine = SINGLE_LINE_ACTIONS.has(action.type);
  const isFluidMultiline = _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_11__.IS_FLUID_BACKGROUND_SUPPORTED && !isSingleLine;
  const isClickableText = action.type === 'suggestedPostSuccess';
  const isNarrowMessage = action.type === 'starGiftPurchaseOfferDeclined';
  const messageReplyInfo = (0,_global_helpers_replies__WEBPACK_IMPORTED_MODULE_7__.getMessageReplyInfo)(message);
  const {
    replyToMsgId,
    replyToPeerId
  } = messageReplyInfo || {};
  const withServiceReactions = Boolean(message.areReactionsPossible && message?.reactions?.results?.length);
  const hasGiftOfferExpired = action.type === 'starGiftPurchaseOffer' && action.expiresAt <= (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_14__.getServerTime)();
  const shouldRenderGiftOfferButtons = action.type === 'starGiftPurchaseOffer' && !message.isOutgoing && !action.isAccepted && !action.isDeclined && !hasGiftOfferExpired;
  const hasNoForwardsRequestExpired = action.type === 'noForwardsRequest' && message.date + noForwardsRequestExpirePeriod <= (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_14__.getServerTime)();
  const shouldRenderNoForwardsButtons = action.type === 'noForwardsRequest' && !message.isOutgoing && !action.isExpired && !hasNoForwardsRequestExpired;
  const shouldRenderInlineButtons = shouldRenderGiftOfferButtons || shouldRenderNoForwardsButtons;
  const shouldSkipRender = isInsideTopic && action.type === 'topicCreate';
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_22__["default"])();
  const {
    isTouchScreen
  } = (0,_hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_17__["default"])();
  const giftOfferInlineButtons = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [[{
    type: 'giftOffer',
    buttonType: 'reject',
    text: lang('GiftOfferReject')
  }, {
    type: 'giftOffer',
    buttonType: 'accept',
    text: lang('GiftOfferAccept')
  }]], [lang]);
  const noForwardsInlineButtons = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [[{
    type: 'noForwardsRequest',
    buttonType: 'reject',
    text: lang('NoForwardsRequestReject')
  }, {
    type: 'noForwardsRequest',
    buttonType: 'accept',
    text: lang('NoForwardsRequestAccept')
  }]], [lang]);
  const [isRejectOfferDialogOpen, openRejectOfferDialog, closeRejectOfferDialog] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_20__["default"])(false);
  const handleInlineButtonClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__["default"])(button => {
    if (button.type === 'giftOffer') {
      if (button.buttonType === 'accept') {
        if (action.type === 'starGiftPurchaseOffer') {
          openGiftOfferAcceptModal({
            peerId: chatId,
            messageId: id,
            gift: action.gift,
            price: action.price
          });
        }
      } else if (button.buttonType === 'reject') {
        openRejectOfferDialog();
      }
    } else if (button.type === 'noForwardsRequest') {
      if (action.type === 'noForwardsRequest') {
        const isAccept = button.buttonType === 'accept';
        toggleNoForwards({
          userId: chatId,
          isEnabled: isAccept ? action.newValue : action.prevValue,
          requestMsgId: id
        });
      }
    }
  });
  const handleRejectOfferConfirm = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__["default"])(() => {
    closeRejectOfferDialog();
    declineStarGiftOffer({
      messageId: id
    });
  });
  const handleRejectOfferClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__["default"])(() => {
    closeRejectOfferDialog();
  });
  (0,_hooks_useIntersectionObserver__WEBPACK_IMPORTED_MODULE_21__.useOnIntersect)(ref, !shouldSkipRender ? observeIntersectionForBottom : undefined);
  (0,_hooks_useEnsureMessage__WEBPACK_IMPORTED_MODULE_19__["default"])(replyToPeerId || chatId, replyToMsgId, replyMessage, id);
  (0,_hooks_useFocusMessageListElement__WEBPACK_IMPORTED_MODULE_26__["default"])({
    elementRef: ref,
    isFocused,
    focusDirection,
    noFocusHighlight,
    isResizingContainer,
    isJustAdded,
    scrollTargetPosition
  });
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_18__["default"])(ref, isTouchScreen && isInSelectMode || isAccountFrozen, !_util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_10__.IS_TAURI, _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_11__.IS_ANDROID, getIsMessageListReady);
  const isContextMenuShown = contextMenuAnchor !== undefined;
  const handleMouseDown = e => {
    (0,_helpers_preventMessageInputBlur__WEBPACK_IMPORTED_MODULE_16__.preventMessageInputBlur)(e);
    handleBeforeContextMenu(e);
  };
  const noAppearanceAnimation = appearanceOrder <= 0;
  const [isShown, markShown] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_20__["default"])(noAppearanceAnimation);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (noAppearanceAnimation) {
      return;
    }

    // Message appearance animation works only if this timeout is not cleared
    setTimeout(markShown, appearanceOrder * _config__WEBPACK_IMPORTED_MODULE_4__.MESSAGE_APPEARANCE_DELAY);
  }, [appearanceOrder, noAppearanceAnimation]);
  const {
    ref: refWithTransition
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_24__["default"])({
    isOpen: isShown,
    noOpenTransition: noAppearanceAnimation,
    noCloseTransition: true,
    className: false,
    ref
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useUnmountCleanup)(() => {
    onMessageUnmount?.(id);
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const bottomMarker = ref.current;
    if (!bottomMarker || !(0,_util_visibility_isElementInViewport__WEBPACK_IMPORTED_MODULE_15__.isElementInViewport)(bottomMarker)) return;
    if (hasUnreadReaction) {
      animateUnreadReaction({
        chatId,
        messageIds: [id]
      });
    }
    if (hasUnreadPollVote) {
      markPollVotesRead({
        chatId,
        messageIds: [id]
      });
    }
    if (message.hasUnreadMention) {
      markMentionsRead({
        chatId,
        messageIds: [id]
      });
    }
  }, [hasUnreadReaction, hasUnreadPollVote, chatId, id, animateUnreadReaction, markPollVotesRead, message.hasUnreadMention]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (action.type !== 'giftPremium') return;
    if (memoFirstUnreadIdRef?.current && id >= memoFirstUnreadIdRef.current || isLocal) {
      requestConfetti({});
    }
  }, [action.type, id, isLocal, memoFirstUnreadIdRef]);
  const fluidBackgroundStyle = (0,_hooks_useFluidBackgroundFilter__WEBPACK_IMPORTED_MODULE_25__["default"])(isFluidMultiline ? actionMessageBg : undefined);
  const handleKeyDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__["default"])(e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_23__["default"])(() => {
    switch (action.type) {
      case 'paymentSent':
      case 'paymentRefunded':
        {
          getReceipt({
            chatId: message.chatId,
            messageId: message.id
          });
          break;
        }
      case 'chatEditPhoto':
        {
          openMediaViewer({
            chatId: message.chatId,
            messageId: message.id,
            threadId,
            origin: _types__WEBPACK_IMPORTED_MODULE_3__.MediaViewerOrigin.ChannelAvatar
          });
          break;
        }
      case 'giftCode':
        {
          checkGiftCode({
            slug: action.slug,
            message: {
              chatId: message.chatId,
              messageId: message.id
            }
          });
          break;
        }
      case 'prizeStars':
        {
          openPrizeStarsTransactionFromGiveaway({
            chatId: message.chatId,
            messageId: message.id
          });
          break;
        }
      case 'giftPremium':
        {
          openPremiumModal({
            isGift: true,
            fromUserId: sender?.id,
            toUserId: sender && sender.id === currentUserId ? chatId : currentUserId,
            daysAmount: action.days
          });
          break;
        }
      case 'giftTon':
      case 'giftStars':
        {
          openStarsTransactionFromGift({
            chatId: message.chatId,
            messageId: message.id
          });
          break;
        }
      case 'starGift':
        {
          openGiftInfoModalFromMessage({
            chatId: message.chatId,
            messageId: message.id
          });
          break;
        }
      case 'starGiftUnique':
        {
          if (action.gift.isBurned) {
            showNotification({
              message: lang('ActionStarGiftUniqueBurnedError')
            });
            break;
          }
          openGiftInfoModalFromMessage({
            chatId: message.chatId,
            messageId: message.id
          });
          break;
        }
      case 'starGiftPurchaseOffer':
        {
          if (shouldRenderGiftOfferButtons) {
            openGiftOfferAcceptModal({
              peerId: chatId,
              messageId: id,
              gift: action.gift,
              price: action.price
            });
          }
          break;
        }
      case 'channelJoined':
        {
          toggleChannelRecommendations({
            chatId
          });
          break;
        }
      case 'suggestedPostApproval':
        {
          const replyInfo = (0,_global_helpers_replies__WEBPACK_IMPORTED_MODULE_7__.getMessageReplyInfo)(message);
          if (replyInfo?.type === 'message' && replyInfo.replyToMsgId) {
            focusMessage({
              chatId: message.chatId,
              threadId,
              messageId: replyInfo.replyToMsgId
            });
          }
          break;
        }
      case 'suggestedPostSuccess':
        {
          const replyInfo = (0,_global_helpers_replies__WEBPACK_IMPORTED_MODULE_7__.getMessageReplyInfo)(message);
          if (replyInfo?.type === 'message' && replyInfo.replyToMsgId) {
            focusMessage({
              chatId: message.chatId,
              threadId,
              messageId: replyInfo.replyToMsgId
            });
          }
          break;
        }
    }
  });
  const fullContent = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    switch (action.type) {
      case 'chatEditPhoto':
        {
          if (!action.photo) return undefined;
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_ChannelPhoto__WEBPACK_IMPORTED_MODULE_29__["default"], {
            action: action,
            observeIntersection: observeIntersectionForLoading,
            onClick: handleClick
          });
        }
      case 'suggestProfilePhoto':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_SuggestedPhoto__WEBPACK_IMPORTED_MODULE_36__["default"], {
          message: message,
          action: action,
          observeIntersection: observeIntersectionForLoading
        });
      case 'prizeStars':
      case 'giftCode':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_GiveawayPrize__WEBPACK_IMPORTED_MODULE_31__["default"], {
          action: action,
          sender: sender,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          onClick: handleClick
        });
      case 'giftPremium':
      case 'giftTon':
      case 'giftStars':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_Gift__WEBPACK_IMPORTED_MODULE_30__["default"], {
          action: action,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          onClick: handleClick
        });
      case 'starGift':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_StarGift__WEBPACK_IMPORTED_MODULE_33__["default"], {
          action: action,
          message: message,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          onClick: handleClick
        });
      case 'starGiftUnique':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_StarGiftUnique__WEBPACK_IMPORTED_MODULE_35__["default"], {
          action: action,
          message: message,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          onClick: handleClick
        });
      case 'starGiftPurchaseOffer':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_StarGiftPurchaseOffer__WEBPACK_IMPORTED_MODULE_34__["default"], {
          action: action,
          message: message,
          hasButtons: shouldRenderGiftOfferButtons,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          onClick: shouldRenderGiftOfferButtons ? handleClick : undefined
        });
      case 'channelJoined':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_SimilarChannels__WEBPACK_IMPORTED_MODULE_43__["default"], {
          chatId: message.chatId
        });
      case 'noForwardsRequest':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_NoForwardsRequest__WEBPACK_IMPORTED_MODULE_32__["default"], {
          message: message
        });
      case 'suggestedPostApproval':
        if (action.isBalanceTooLow) {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_SuggestedPostBalanceTooLow__WEBPACK_IMPORTED_MODULE_38__["default"], {
            message: message,
            action: action,
            onClick: handleClick
          });
        }
        return action.isRejected ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_SuggestedPostRejected__WEBPACK_IMPORTED_MODULE_39__["default"], {
          message: message,
          action: action,
          onClick: handleClick
        }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_actions_SuggestedPostApproval__WEBPACK_IMPORTED_MODULE_37__["default"], {
          message: message,
          action: action,
          onClick: handleClick
        });
      default:
        return undefined;
    }
  }, [action, message, observeIntersectionForLoading, sender, observeIntersectionForPlaying, shouldRenderGiftOfferButtons]);
  if (isInsideTopic && action.type === 'topicCreate' || action.type === 'phoneCall') {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsxs)("div", {
    ref: refWithTransition,
    id: (0,_global_helpers__WEBPACK_IMPORTED_MODULE_5__.getMessageHtmlId)(id),
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_12__["default"])('ActionMessage', 'message-list-item', _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].root, isSingleLine && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].singleLine, isFluidMultiline && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].fluidMultiline, fullContent && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].hasFullContent, isFocused && !noFocusHighlight && 'focused', isContextMenuShown && 'has-menu-open', isLastInList && 'last-in-list'),
    "data-message-id": message.id,
    "data-is-pinned": message.isPinned || undefined,
    "data-has-unread-mention": message.hasUnreadMention || undefined,
    "data-has-unread-poll-vote": hasUnreadPollVote || undefined,
    "data-has-unread-reaction": hasUnreadReaction || undefined,
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
    children: [!isTextHidden && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.Fragment, {
      children: [isFluidMultiline && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_12__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].inlineWrapper, isClickableText && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].hoverable, isNarrowMessage && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].narrowWrapper),
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)("span", {
          className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].fluidBackground,
          style: fluidBackgroundStyle,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_ActionMessageText__WEBPACK_IMPORTED_MODULE_28__["default"], {
            message: message,
            isInsideTopic: isInsideTopic
          })
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_12__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].inlineWrapper, isClickableText && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].hoverable, isNarrowMessage && _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].narrowWrapper),
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)("span", {
          className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].textContent,
          role: "button",
          tabIndex: 0,
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_ActionMessageText__WEBPACK_IMPORTED_MODULE_28__["default"], {
            message: message,
            isInsideTopic: isInsideTopic
          })
        })
      })]
    }), (fullContent || shouldRenderInlineButtons) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].contentWrapper,
      children: [fullContent, shouldRenderGiftOfferButtons && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_InlineButtons__WEBPACK_IMPORTED_MODULE_41__["default"], {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].inlineButtons,
        inlineButtons: giftOfferInlineButtons,
        onClick: handleInlineButtonClick
      }), shouldRenderNoForwardsButtons && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_InlineButtons__WEBPACK_IMPORTED_MODULE_41__["default"], {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].inlineButtons,
        inlineButtons: noForwardsInlineButtons,
        onClick: handleInlineButtonClick
      })]
    }), contextMenuAnchor && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_ContextMenuContainer__WEBPACK_IMPORTED_MODULE_40__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      message: message,
      messageListType: "thread",
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_44__["default"].contextContainer,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide
    }), withServiceReactions && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_reactions_Reactions__WEBPACK_IMPORTED_MODULE_42__["default"], {
      isOutside: true,
      message: message,
      threadId: threadId,
      observeIntersection: observeIntersectionForPlaying,
      isCurrentUserPremium: isCurrentUserPremium,
      isAccountFrozen: isAccountFrozen
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_45__.jsx)(_ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_27__["default"], {
      isOpen: isRejectOfferDialogOpen,
      title: lang('GiftOfferRejectTitle'),
      textParts: lang('GiftOfferRejectText', {
        user: sender ? (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_6__.getPeerTitle)(lang, sender) : lang('ActionFallbackSomeone')
      }, {
        withNodes: true,
        withMarkdown: true
      }),
      confirmLabel: lang('GiftOfferReject'),
      confirmIsDestructive: true,
      confirmHandler: handleRejectOfferConfirm,
      onClose: handleRejectOfferClose
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message,
  threadId
}) => {
  const tabState = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectTabState)(global);
  const chat = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectChat)(global, message.chatId);
  const sender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectSender)(global, message);
  const isInsideTopic = chat?.isForum && threadId !== _api_types__WEBPACK_IMPORTED_MODULE_2__.MAIN_THREAD_ID;
  const {
    replyToMsgId,
    replyToPeerId
  } = (0,_global_helpers_replies__WEBPACK_IMPORTED_MODULE_7__.getMessageReplyInfo)(message) || {};
  const replyMessage = replyToMsgId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectChatMessage)(global, replyToPeerId || message.chatId, replyToMsgId) : undefined;
  const isFocused = threadId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectIsMessageFocused)(global, message, threadId) : false;
  const {
    direction: focusDirection,
    noHighlight: noFocusHighlight,
    isResizingContainer,
    scrollTargetPosition
  } = isFocused && tabState.focusedMessage || {};
  const isCurrentUserPremium = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectIsCurrentUserPremium)(global);
  const readState = (0,_global_selectors_threads__WEBPACK_IMPORTED_MODULE_9__.selectThreadReadState)(global, message.chatId, threadId);
  const hasUnreadReaction = readState?.unreadReactions?.includes(message.id);
  const hasUnreadPollVote = readState?.unreadPollVotes?.includes(message.id);
  const isAccountFrozen = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectIsCurrentUserFrozen)(global);
  return {
    sender,
    currentUserId: global.currentUserId,
    isCurrentUserPremium,
    isFocused,
    focusDirection,
    noFocusHighlight,
    isInsideTopic,
    replyMessage,
    isInSelectMode: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectIsInSelectMode)(global),
    actionMessageBg: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_8__.selectActionMessageBg)(global),
    hasUnreadReaction,
    hasUnreadPollVote,
    isResizingContainer,
    scrollTargetPosition,
    isAccountFrozen,
    noForwardsRequestExpirePeriod: global.appConfig.noForwardsRequestExpirePeriod
  };
})(ActionMessage)));

/***/ },

/***/ "./src/components/middle/message/ContextMenuContainer.tsx"
/*!****************************************************************!*\
  !*** ./src/components/middle/message/ContextMenuContainer.tsx ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../config */ "./src/config.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _global_selectors_media__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../global/selectors/media */ "./src/global/selectors/media.ts");
/* harmony import */ var _global_selectors_threads__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../global/selectors/threads */ "./src/global/selectors/threads.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../util/clipboard */ "./src/util/clipboard.ts");
/* harmony import */ var _util_entities_ids__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../util/entities/ids */ "./src/util/entities/ids.ts");
/* harmony import */ var _util_keys_translationKey__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../util/keys/translationKey */ "./src/util/keys/translationKey.ts");
/* harmony import */ var _helpers_getSelectionAsFormattedText__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helpers/getSelectionAsFormattedText */ "./src/components/middle/message/helpers/getSelectionAsFormattedText.ts");
/* harmony import */ var _helpers_isSelectionRangeInsideMessage__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./helpers/isSelectionRangeInsideMessage */ "./src/components/middle/message/helpers/isSelectionRangeInsideMessage.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _hooks_useSchedule__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../hooks/useSchedule */ "./src/hooks/useSchedule.tsx");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _common_PinMessageModal_async__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../common/PinMessageModal.async */ "./src/components/common/PinMessageModal.async.tsx");
/* harmony import */ var _ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../ui/ConfirmDialog */ "./src/components/ui/ConfirmDialog.tsx");
/* harmony import */ var _MessageContextMenu__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./MessageContextMenu */ "./src/components/middle/message/MessageContextMenu.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");
























const selection = window.getSelection();
const UNQUOTABLE_OFFSET = -1;
const ContextMenuContainer = ({
  threadId,
  availableReactions,
  topReactions,
  defaultTagReactions,
  isOpen,
  messageListType,
  message,
  customEmojiSetsInfo,
  customEmojiSets,
  album,
  poll,
  webPage,
  story,
  anchor,
  targetHref,
  noOptions,
  canSendNow,
  hasFullInfo,
  canReschedule,
  canReply,
  canPin,
  repliesThreadInfo,
  canUnpin,
  canDelete,
  canShowReactionsCount,
  chat,
  canReport,
  canShowReactionList,
  canEdit,
  canAppendTodoList,
  enabledReactions,
  reactionsLimit,
  isPrivate,
  isCurrentUserPremium,
  canForward,
  canBuyPremium,
  canFaveSticker,
  canUnfaveSticker,
  canCopy,
  canCopyLink,
  canSelect,
  canDownload,
  canSaveGif,
  canRevote,
  canClosePoll,
  canPlayAnimatedEmojis,
  canLoadReadDate,
  shouldRenderShowWhen,
  activeDownloads,
  noReplies,
  canShowSeenBy,
  canScheduleUntilOnline,
  canTranslate,
  isMessageTranslated,
  canShowOriginal,
  canSelectLanguage,
  currentTranslationTone,
  translationRequestLanguage,
  isReactionPickerOpen,
  isInSavedMessages,
  canReplyInChat,
  isWithPaidReaction,
  userFullName,
  canGift,
  className,
  savedDialogId,
  noForwardsMyEnabled,
  noForwardsPeerEnabled,
  onClose,
  onCloseAnimationEnd
}) => {
  const {
    openThread,
    updateDraftReplyInfo,
    setEditingId,
    pinMessage,
    openForwardMenu,
    openReplyMenu,
    faveSticker,
    unfaveSticker,
    toggleMessageSelection,
    sendScheduledMessages,
    rescheduleMessage,
    downloadMedia,
    cancelMediaDownload,
    loadSeenBy,
    openSeenByModal,
    openReactorListModal,
    loadFullChat,
    loadReactors,
    copyMessagesByIds,
    saveGif,
    loadStickers,
    cancelPollVote,
    closePoll,
    toggleReaction,
    requestMessageTranslation,
    showOriginalMessage,
    openChatLanguageModal,
    openMessageReactionPicker,
    openPremiumModal,
    loadOutboxReadDate,
    copyMessageLink,
    openDeleteMessageModal,
    addLocalPaidReaction,
    openPaidReactionModal,
    reportMessages,
    openTodoListModal,
    showNotification,
    setSettingOption
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_17__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_15__["default"])();
  const noForwardsNotice = noForwardsPeerEnabled ? lang('ContextMenuNoForwardsPeer', {
    name: userFullName
  }) : noForwardsMyEnabled ? lang('ContextMenuNoForwardsYou') : undefined;
  const {
    ref: containerRef
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_19__["default"])({
    isOpen,
    onCloseAnimationEnd,
    className: false
  });
  const [isMenuOpen, setIsMenuOpen] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [isPinModalOpen, setIsPinModalOpen] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isClosePollDialogOpen, openClosePollDialog, closeClosePollDialog] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const [selectionQuoteOffset, setSelectionQuoteOffset] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(UNQUOTABLE_OFFSET);
  const [requestCalendar, calendar] = (0,_hooks_useSchedule__WEBPACK_IMPORTED_MODULE_18__["default"])(canScheduleUntilOnline, onClose, message.date, message.scheduleRepeatPeriod);

  // `undefined` indicates that emoji are present and loading
  const hasCustomEmoji = customEmojiSetsInfo === undefined || Boolean(customEmojiSetsInfo.length);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (canShowSeenBy && isOpen) {
      loadSeenBy({
        chatId: message.chatId,
        messageId: message.id
      });
    }
  }, [loadSeenBy, isOpen, message.chatId, message.id, canShowSeenBy]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (canLoadReadDate && isOpen) {
      loadOutboxReadDate({
        chatId: message.chatId,
        messageId: message.id
      });
    }
  }, [canLoadReadDate, isOpen, message.chatId, message.id, message.readDate]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (canShowReactionsCount && isOpen) {
      loadReactors({
        chatId: message.chatId,
        messageId: message.id
      });
    }
  }, [canShowReactionsCount, isOpen, loadReactors, message.chatId, message.id]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (customEmojiSetsInfo?.length && customEmojiSets?.length !== customEmojiSetsInfo.length) {
      customEmojiSetsInfo.forEach(set => {
        loadStickers({
          stickerSetInfo: set
        });
      });
    }
  }, [customEmojiSetsInfo, customEmojiSets, loadStickers]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!hasFullInfo && !isPrivate && isOpen) {
      loadFullChat({
        chatId: message.chatId
      });
    }
  }, [hasFullInfo, isOpen, isPrivate, loadFullChat, message.chatId]);
  const seenByRecentPeers = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // No need for expensive global updates on chats or users, so we avoid them
    const chatsById = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)().chats.byId;
    const usersById = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)().users.byId;
    if (message.reactions?.recentReactions?.length) {
      const uniqueReactors = new Set(message.reactions?.recentReactions?.map(({
        peerId
      }) => usersById[peerId] || chatsById[peerId]));
      return Array.from(uniqueReactors).filter(Boolean).slice(0, _config__WEBPACK_IMPORTED_MODULE_3__.PREVIEW_AVATAR_COUNT);
    }
    if (!message.seenByDates) {
      return undefined;
    }
    return Object.keys(message.seenByDates).slice(0, _config__WEBPACK_IMPORTED_MODULE_3__.PREVIEW_AVATAR_COUNT).map(id => usersById[id] || chatsById[id]).filter(Boolean);
  }, [message.reactions?.recentReactions, message.seenByDates]);
  const isDownloading = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const global = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    if (album) {
      return album.messages.some(msg => {
        const downloadableMedia = (0,_global_selectors_media__WEBPACK_IMPORTED_MODULE_6__.selectMessageDownloadableMedia)(global, msg);
        if (!downloadableMedia) return false;
        return (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getIsDownloading)(activeDownloads, downloadableMedia);
      });
    }
    const downloadableMedia = (0,_global_selectors_media__WEBPACK_IMPORTED_MODULE_6__.selectMessageDownloadableMedia)(global, message);
    if (!downloadableMedia) return false;
    return (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getIsDownloading)(activeDownloads, downloadableMedia);
  }, [activeDownloads, album, message]);
  const selectionRange = canReply && selection?.rangeCount ? selection.getRangeAt(0) : undefined;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isMessageTranslated) {
      setSelectionQuoteOffset(UNQUOTABLE_OFFSET);
      return;
    }
    const isMessageTextSelected = selectionRange && !selectionRange.collapsed && Boolean(message.content.text?.text) && (0,_helpers_isSelectionRangeInsideMessage__WEBPACK_IMPORTED_MODULE_13__.isSelectionRangeInsideMessage)(selectionRange);
    if (!isMessageTextSelected) {
      setSelectionQuoteOffset(UNQUOTABLE_OFFSET);
      return;
    }
    const selectionText = (0,_helpers_getSelectionAsFormattedText__WEBPACK_IMPORTED_MODULE_12__.getSelectionAsFormattedText)(selectionRange);
    const messageText = message.content.text.text.replace(/\u00A0/g, ' ');
    const canQuote = selectionText.text.trim().length > 0 && messageText.includes(selectionText.text);
    if (!canQuote) {
      setSelectionQuoteOffset(UNQUOTABLE_OFFSET);
      return;
    }
    setSelectionQuoteOffset(selectionRange.startOffset);
  }, [selectionRange, selectionRange?.collapsed, selectionRange?.startOffset, selectionRange?.endOffset, isMessageTranslated, message.content.text]);
  const closeMenu = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    setIsMenuOpen(false);
    onClose();
  });
  const handleDelete = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    setIsMenuOpen(false);
    closeMenu();
    const messageIds = album?.messages ? album.messages.map(({
      id
    }) => id) : [message.id];
    openDeleteMessageModal({
      chatId: message.chatId,
      messageIds,
      isSchedule: messageListType === 'scheduled'
    });
  });
  const closePinModal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    setIsPinModalOpen(false);
    onClose();
  });
  const handleReply = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    const quoteText = selectionQuoteOffset !== UNQUOTABLE_OFFSET && selectionRange ? (0,_helpers_getSelectionAsFormattedText__WEBPACK_IMPORTED_MODULE_12__.getSelectionAsFormattedText)(selectionRange) : undefined;
    if (!canReplyInChat) {
      openReplyMenu({
        fromChatId: message.chatId,
        messageId: message.id,
        quoteText,
        quoteOffset: selectionQuoteOffset
      });
    } else {
      updateDraftReplyInfo({
        replyToMsgId: message.id,
        quoteText,
        quoteOffset: selectionQuoteOffset,
        monoforumPeerId: savedDialogId,
        replyToPeerId: undefined
      });
    }
    closeMenu();
  });
  const handleOpenThread = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    openThread({
      chatId: message.chatId,
      threadId: message.id
    });
    closeMenu();
  });
  const handleEdit = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    if (message.content.todo) {
      openTodoListModal({
        chatId: message.chatId,
        messageId: message.id
      });
    } else {
      setEditingId({
        messageId: message.id
      });
    }
    closeMenu();
  });
  const handleAppendTodoList = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    if (!isCurrentUserPremium) {
      showNotification({
        message: lang('SubscribeToTelegramPremiumForAppendToDo'),
        action: {
          action: 'openPremiumModal',
          payload: {
            initialSection: 'todo'
          }
        },
        actionText: oldLang('PremiumMore')
      });
    } else {
      openTodoListModal({
        chatId: message.chatId,
        messageId: message.id,
        forNewTask: true
      });
    }
    closeMenu();
  });
  const handlePin = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    setIsMenuOpen(false);
    setIsPinModalOpen(true);
  });
  const handleUnpin = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    pinMessage({
      chatId: message.chatId,
      messageId: message.id,
      isUnpin: true
    });
    closeMenu();
  });
  const handleForward = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    if (album?.messages) {
      const messageIds = album.messages.map(({
        id
      }) => id);
      openForwardMenu({
        fromChatId: message.chatId,
        messageIds
      });
    } else {
      openForwardMenu({
        fromChatId: message.chatId,
        messageIds: [message.id]
      });
    }
  });
  const handleFaveSticker = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    faveSticker({
      sticker: message.content.sticker
    });
  });
  const handleUnfaveSticker = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    unfaveSticker({
      sticker: message.content.sticker
    });
  });
  const handleCancelVote = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    cancelPollVote({
      chatId: message.chatId,
      messageId: message.id
    });
  });
  const handlePollClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    closePoll({
      chatId: message.chatId,
      messageId: message.id
    });
  });
  const handleSelectMessage = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    const params = album?.messages ? {
      messageId: message.id,
      childMessageIds: album.messages.map(({
        id
      }) => id),
      withShift: false
    } : {
      messageId: message.id,
      withShift: false
    };
    toggleMessageSelection(params);
    closeMenu();
  });
  const handleScheduledMessageSend = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    sendScheduledMessages({
      chatId: message.chatId,
      id: message.id
    });
    closeMenu();
  });
  const handleRescheduleMessage = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])((scheduledAt, scheduleRepeatPeriod) => {
    rescheduleMessage({
      chatId: message.chatId,
      messageId: message.id,
      scheduledAt,
      scheduleRepeatPeriod
    });
    onClose();
  });
  const handleOpenCalendar = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    setIsMenuOpen(false);
    requestCalendar(handleRescheduleMessage);
  });
  const handleOpenSeenByModal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    openSeenByModal({
      chatId: message.chatId,
      messageId: message.id
    });
  });
  const handleOpenReactorListModal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    closeMenu();
    openReactorListModal({
      chatId: message.chatId,
      messageId: message.id
    });
  });
  const handleCopyMessages = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(messageIds => {
    copyMessagesByIds({
      messageIds
    });
    closeMenu();
  });
  const handleCopyLink = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    copyMessageLink({
      chatId: message.chatId,
      messageId: message.id,
      shouldIncludeThread: threadId !== _api_types__WEBPACK_IMPORTED_MODULE_2__.MAIN_THREAD_ID,
      shouldIncludeGrouped: true // TODO: Provide correct value when ability to target specific message is added
    });
    closeMenu();
  });
  const handleCopyNumber = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_9__.copyTextToClipboard)(message.content.contact.phoneNumber);
    closeMenu();
  });
  const handleDownloadClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    const global = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    (album?.messages || [message]).forEach(msg => {
      const downloadableMedia = (0,_global_selectors_media__WEBPACK_IMPORTED_MODULE_6__.selectMessageDownloadableMedia)(global, msg);
      if (!downloadableMedia) return;
      if (isDownloading) {
        cancelMediaDownload({
          media: downloadableMedia
        });
      } else {
        downloadMedia({
          media: downloadableMedia,
          originMessage: msg
        });
      }
    });
    closeMenu();
  });
  const handleSaveGif = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    const video = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getMessageVideo)(message);
    saveGif({
      gif: video
    });
    closeMenu();
  });
  const handleToggleReaction = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(reaction => {
    if (isInSavedMessages && !isCurrentUserPremium) {
      openPremiumModal({
        initialSection: 'saved_tags'
      });
    } else {
      toggleReaction({
        chatId: message.chatId,
        messageId: message.id,
        reaction,
        shouldAddToRecent: true
      });
    }
    closeMenu();
  });
  const handleSendPaidReaction = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    addLocalPaidReaction({
      chatId: message.chatId,
      messageId: message.id,
      count: 1
    });
    closeMenu();
  });
  const handlePaidReactionModalOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    openPaidReactionModal({
      chatId: message.chatId,
      messageId: message.id
    });
    closeMenu();
  });
  const handleReactionPickerOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(position => {
    openMessageReactionPicker({
      chatId: message.chatId,
      messageId: message.id,
      position
    });
  });
  const handleTranslate = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    requestMessageTranslation({
      chatId: message.chatId,
      id: message.id,
      tone: currentTranslationTone
    });
    closeMenu();
  });
  const handleTranslateWithTone = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(tone => {
    const {
      languageCode
    } = (0,_util_keys_translationKey__WEBPACK_IMPORTED_MODULE_11__.parseTranslationCacheKey)(translationRequestLanguage);
    setSettingOption({
      translationTone: tone
    });
    requestMessageTranslation({
      chatId: message.chatId,
      id: message.id,
      toLanguageCode: languageCode,
      tone
    });
    closeMenu();
  });
  const handleShowOriginal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    showOriginalMessage({
      chatId: message.chatId,
      id: message.id
    });
    closeMenu();
  });
  const handleSelectLanguage = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    openChatLanguageModal({
      chatId: message.chatId,
      messageId: message.id
    });
    closeMenu();
  });
  const reportMessageIds = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (album ? album.messages : [message]).map(({
    id
  }) => id), [album, message]);
  const handleReport = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_16__["default"])(() => {
    if (!chat) return;
    setIsMenuOpen(false);
    onClose();
    reportMessages({
      chatId: chat.id,
      messageIds: reportMessageIds
    });
  });
  if (noOptions) {
    closeMenu();
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsxs)("div", {
    ref: containerRef,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_8__["default"])('ContextMenuContainer', className),
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_MessageContextMenu__WEBPACK_IMPORTED_MODULE_22__["default"], {
      isReactionPickerOpen: isReactionPickerOpen,
      availableReactions: availableReactions,
      topReactions: topReactions,
      defaultTagReactions: defaultTagReactions,
      isWithPaidReaction: isWithPaidReaction,
      message: message,
      isPrivate: isPrivate,
      isCurrentUserPremium: isCurrentUserPremium,
      canBuyPremium: canBuyPremium,
      isOpen: isMenuOpen,
      enabledReactions: enabledReactions,
      reactionsLimit: reactionsLimit,
      anchor: anchor,
      targetHref: targetHref,
      canShowReactionsCount: canShowReactionsCount,
      canShowReactionList: canShowReactionList,
      canSendNow: canSendNow,
      canReschedule: canReschedule,
      canReply: canReply,
      canQuote: selectionQuoteOffset !== UNQUOTABLE_OFFSET,
      canDelete: canDelete,
      canPin: canPin,
      canReport: canReport,
      repliesThreadInfo: repliesThreadInfo,
      canUnpin: canUnpin,
      canEdit: canEdit,
      canAppendTodoList: canAppendTodoList,
      canForward: canForward,
      canFaveSticker: canFaveSticker,
      canUnfaveSticker: canUnfaveSticker,
      canCopy: canCopy,
      canCopyLink: canCopyLink,
      canSelect: canSelect,
      canDownload: canDownload,
      canSaveGif: canSaveGif,
      canRevote: canRevote,
      canClosePoll: canClosePoll,
      canShowSeenBy: canShowSeenBy,
      canTranslate: canTranslate,
      canShowOriginal: canShowOriginal,
      canSelectLanguage: canSelectLanguage,
      currentTranslationTone: currentTranslationTone,
      canPlayAnimatedEmojis: canPlayAnimatedEmojis,
      shouldRenderShowWhen: shouldRenderShowWhen,
      canLoadReadDate: canLoadReadDate,
      hasCustomEmoji: hasCustomEmoji,
      customEmojiSets: customEmojiSets,
      isDownloading: isDownloading,
      seenByRecentPeers: seenByRecentPeers,
      isInSavedMessages: isInSavedMessages,
      noReplies: noReplies,
      poll: poll,
      webPage: webPage,
      story: story,
      onOpenThread: handleOpenThread,
      onReply: handleReply,
      onEdit: handleEdit,
      onAppendTodoList: handleAppendTodoList,
      onPin: handlePin,
      onUnpin: handleUnpin,
      onForward: handleForward,
      onDelete: handleDelete,
      onReport: handleReport,
      onFaveSticker: handleFaveSticker,
      onUnfaveSticker: handleUnfaveSticker,
      onSelect: handleSelectMessage,
      onSend: handleScheduledMessageSend,
      onReschedule: handleOpenCalendar,
      onClose: closeMenu,
      onCopyLink: handleCopyLink,
      onCopyMessages: handleCopyMessages,
      onCopyNumber: handleCopyNumber,
      onDownload: handleDownloadClick,
      onSaveGif: handleSaveGif,
      onCancelVote: handleCancelVote,
      onClosePoll: openClosePollDialog,
      onShowSeenBy: handleOpenSeenByModal,
      onToggleReaction: handleToggleReaction,
      onSendPaidReaction: handleSendPaidReaction,
      onShowPaidReactionModal: handlePaidReactionModalOpen,
      onShowReactors: handleOpenReactorListModal,
      onReactionPickerOpen: handleReactionPickerOpen,
      onTranslate: handleTranslate,
      onTranslateWithTone: handleTranslateWithTone,
      onShowOriginal: handleShowOriginal,
      onSelectLanguage: handleSelectLanguage,
      userFullName: userFullName,
      canGift: canGift,
      noForwardsNotice: noForwardsNotice
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_common_PinMessageModal_async__WEBPACK_IMPORTED_MODULE_20__["default"], {
      isOpen: isPinModalOpen,
      messageId: message.id,
      chatId: message.chatId,
      onClose: closePinModal
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_23__.jsx)(_ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_21__["default"], {
      isOpen: isClosePollDialogOpen,
      onClose: closeClosePollDialog,
      text: oldLang('lng_polls_stop_warning'),
      confirmLabel: oldLang('lng_polls_stop_sure'),
      confirmHandler: handlePollClose
    }), canReschedule && calendar]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message,
  messageListType,
  detectedLanguage
}) => {
  const {
    threadId
  } = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCurrentMessageList)(global) || {};
  const {
    defaultTags,
    topReactions,
    availableReactions
  } = global.reactions;
  const activeDownloads = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectActiveDownloads)(global);
  const chat = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectChat)(global, message.chatId);
  const isPrivate = chat && (0,_util_entities_ids__WEBPACK_IMPORTED_MODULE_10__.isUserId)(chat.id);
  const chatFullInfo = !isPrivate ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectChatFullInfo)(global, message.chatId) : undefined;
  const user = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectUser)(global, message.chatId);
  const userFullName = user && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getUserFullName)(user);
  const userFullInfo = isPrivate ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectUserFullInfo)(global, message.chatId) : undefined;
  const {
    seenByExpiresAt,
    seenByMaxChatMembers,
    maxUniqueReactions,
    readDateExpiresAt
  } = global.appConfig;
  const reactionsLimit = chatFullInfo?.reactionsLimit || maxUniqueReactions;
  const {
    noOptions,
    canReplyGlobally,
    canPin,
    canUnpin,
    canDelete,
    canReport,
    canEdit,
    canFaveSticker,
    canUnfaveSticker,
    canCopy,
    canCopyLink,
    canSelect,
    canDownload,
    canSaveGif,
    canRevote,
    canClosePoll
  } = threadId && (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectAllowedMessageActionsSlow)(global, message, threadId) || {};
  const canForward = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCanForwardMessage)(global, message);
  const userStatus = isPrivate ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectUserStatus)(global, chat.id) : undefined;
  const isOwn = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isOwnMessage)(message);
  const chatBot = chat && (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectBot)(global, chat.id);
  const isBot = Boolean(chatBot);
  const isMessageUnread = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsMessageUnread)(global, message.chatId, threadId || _api_types__WEBPACK_IMPORTED_MODULE_2__.MAIN_THREAD_ID, message.id, messageListType);
  const canLoadReadDate = Boolean(isPrivate && isOwn && !isBot && !isMessageUnread && readDateExpiresAt && message.date > Date.now() / 1000 - readDateExpiresAt && !userStatus?.isReadDateRestricted && messageListType !== 'scheduled');
  const shouldRenderShowWhen = Boolean(canLoadReadDate && isPrivate && (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectUserStatus)(global, chat.id)?.isReadDateRestrictedByMe);
  const isPinned = messageListType === 'pinned';
  const isScheduled = messageListType === 'scheduled';
  const isChannel = chat && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isChatChannel)(chat);
  const threadInfo = threadId && (0,_global_selectors_threads__WEBPACK_IMPORTED_MODULE_7__.selectThreadInfo)(global, message.chatId, threadId);
  const isMessageThread = Boolean(threadInfo && !threadInfo?.isCommentsInfo && threadInfo?.fromChannelId);
  const topic = threadId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectTopic)(global, message.chatId, threadId) : undefined;
  const canSendText = chat && !(0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isUserRightBanned)(chat, 'sendPlain', chatFullInfo);
  const canReplyInChat = chat && threadId ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getCanPostInChat)(chat, topic, isMessageThread, chatFullInfo) && canSendText : false;
  const isLocal = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isMessageLocal)(message);
  const hasTtl = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.hasMessageTtl)(message);
  const canShowSeenBy = Boolean(!isLocal && chat && !chat.isMonoforum && !isMessageUnread && seenByMaxChatMembers && seenByExpiresAt && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isChatGroup)(chat) && isOwn && !isScheduled && chat.membersCount && chat.membersCount <= seenByMaxChatMembers && message.date > Date.now() / 1000 - seenByExpiresAt);
  const isAction = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.isActionMessage)(message);
  const canShowReactionsCount = !isLocal && !isChannel && !isScheduled && !isAction && !isPrivate && message.reactions && !(0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.areReactionsEmpty)(message.reactions) && message.reactions.canSeeList;
  const isProtected = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsMessageProtected)(global, message);
  const canCopyNumber = Boolean(message.content.contact);
  const isCurrentUserPremium = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsCurrentUserPremium)(global);
  const customEmojiSetsInfo = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectMessageCustomEmojiSets)(global, message);
  const customEmojiSetsNotFiltered = customEmojiSetsInfo?.map(set => (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectStickerSet)(global, set));
  const customEmojiSets = customEmojiSetsNotFiltered?.every(Boolean) ? customEmojiSetsNotFiltered : undefined;
  const translationRequestLanguage = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectRequestedMessageTranslationLanguage)(global, message.chatId, message.id);
  const chatTranslationLanguage = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectRequestedChatTranslationLanguage)(global, message.chatId);
  const chatTranslationTone = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectRequestedChatTranslationTone)(global, message.chatId);
  const isManualMessageTranslation = !chatTranslationLanguage && translationRequestLanguage;
  const {
    tone: manualMessageTone
  } = isManualMessageTranslation ? (0,_util_keys_translationKey__WEBPACK_IMPORTED_MODULE_11__.parseTranslationCacheKey)(translationRequestLanguage) : {
    tone: undefined
  };
  const globalTone = global.settings.byKey.translationTone;
  const currentTranslationTone = manualMessageTone || chatTranslationTone || globalTone;
  const translationCacheKey = chatTranslationLanguage ? (0,_util_keys_translationKey__WEBPACK_IMPORTED_MODULE_11__.getTranslationCacheKey)(chatTranslationLanguage, currentTranslationTone) : translationRequestLanguage;
  const messageTranslation = translationCacheKey ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectMessageTranslations)(global, message.chatId, translationCacheKey)[message.id] : undefined;
  const hasTranslation = Boolean(messageTranslation?.text);
  const canTranslate = !hasTranslation && (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCanTranslateMessage)(global, message, detectedLanguage);
  const isChatTranslated = chatTranslationLanguage;
  const isInSavedMessages = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsChatWithSelf)(global, message.chatId);
  const poll = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectPollFromMessage)(global, message);
  const webPage = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectWebPageFromMessage)(global, message);
  const storyData = message.content.storyData;
  const story = storyData ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectPeerStory)(global, storyData.peerId, storyData.id) : undefined;
  const canGift = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCanGift)(global, message.chatId);
  const savedDialogId = (0,_global_selectors_threads__WEBPACK_IMPORTED_MODULE_7__.selectSavedDialogIdFromMessage)(global, message);
  const todoItemsMax = global.appConfig.todoItemsMax;
  const canAppendTodoList = message.content.todo?.todo.othersCanAppend && message.content.todo?.todo.items?.length < todoItemsMax;
  return {
    threadId,
    chat,
    availableReactions,
    topReactions,
    defaultTagReactions: defaultTags,
    noOptions,
    canReport,
    canSendNow: isScheduled,
    canReschedule: isScheduled,
    canReply: !isPinned && !isScheduled && canReplyGlobally,
    canPin: !isScheduled && canPin,
    canUnpin: !isScheduled && canUnpin,
    canDelete,
    canEdit: !isPinned && canEdit,
    canAppendTodoList,
    canForward: !isScheduled && canForward,
    canFaveSticker: !isScheduled && canFaveSticker,
    canUnfaveSticker: !isScheduled && canUnfaveSticker,
    canCopy: canCopyNumber || !isProtected && canCopy,
    canCopyLink: !isScheduled && canCopyLink,
    canSelect,
    canDownload: !isProtected && canDownload,
    canSaveGif: !isProtected && canSaveGif,
    canRevote,
    canClosePoll: !isScheduled && canClosePoll,
    activeDownloads,
    canShowSeenBy,
    canLoadReadDate,
    shouldRenderShowWhen,
    enabledReactions: chat?.isForbidden ? undefined : chatFullInfo?.enabledReactions,
    reactionsLimit,
    isPrivate,
    isCurrentUserPremium,
    hasFullInfo: Boolean(chatFullInfo),
    canShowReactionsCount,
    canShowReactionList: !isLocal && !isAction && !isScheduled && !hasTtl,
    canBuyPremium: !isCurrentUserPremium && !(0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsPremiumPurchaseBlocked)(global),
    customEmojiSetsInfo,
    customEmojiSets,
    canScheduleUntilOnline: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCanScheduleUntilOnline)(global, message.chatId),
    canTranslate,
    canShowOriginal: hasTranslation && !isChatTranslated,
    canSelectLanguage: hasTranslation && !isChatTranslated,
    isMessageTranslated: hasTranslation,
    currentTranslationTone,
    translationRequestLanguage,
    canPlayAnimatedEmojis: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectCanPlayAnimatedEmojis)(global),
    isReactionPickerOpen: (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsReactionPickerOpen)(global),
    isInSavedMessages,
    isChannel,
    canReplyInChat,
    isWithPaidReaction: chatFullInfo?.isPaidReactionAvailable,
    poll,
    story,
    userFullName,
    canGift,
    savedDialogId,
    webPage,
    noForwardsMyEnabled: userFullInfo?.noForwardsMyEnabled,
    noForwardsPeerEnabled: userFullInfo?.noForwardsPeerEnabled
  };
})(ContextMenuContainer)));

/***/ },

/***/ "./src/components/middle/message/InlineButtons.tsx"
/*!*********************************************************!*\
  !*** ./src/components/middle/message/InlineButtons.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../config */ "./src/config.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _composer_helpers_renderKeyboardButtonText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../composer/helpers/renderKeyboardButtonText */ "./src/components/middle/composer/helpers/renderKeyboardButtonText.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_CustomEmoji__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./InlineButtons.module.scss */ "./src/components/middle/message/InlineButtons.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const ICON_SIZE = 16;
const InlineButtons = ({
  className,
  inlineButtons,
  onClick
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const renderIcon = button => {
    const {
      type
    } = button;
    switch (type) {
      case 'url':
        {
          const {
            url
          } = button;
          if (url.startsWith(_config__WEBPACK_IMPORTED_MODULE_1__.TME_LINK_PREFIX) && url.includes('?startapp')) {
            return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
              className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
              name: "webapp"
            });
          } else if (!_config__WEBPACK_IMPORTED_MODULE_1__.RE_TME_LINK.test(url)) {
            return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
              className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
              name: "arrow-right"
            });
          }
          return;
        }
      case 'urlAuth':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
          name: "arrow-right"
        });
      case 'buy':
      case 'receipt':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
          name: "card"
        });
      case 'switchBotInline':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
          name: "share-filled"
        });
      case 'webView':
      case 'simpleWebView':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
          name: "webapp"
        });
      case 'copy':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].cornerIcon,
          name: "copy"
        });
      case 'suggestedMessage':
        if (button.buttonType === 'suggestChanges') {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].leftIcon,
            name: "edit"
          });
        }
        if (button.buttonType === 'approve') {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].leftIcon,
            name: "check"
          });
        }
        if (button.buttonType === 'decline') {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].leftIcon,
            name: "close"
          });
        }
        break;
      case 'giftOffer':
        if (button.buttonType === 'accept') {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].leftIcon,
            name: "check"
          });
        }
        if (button.buttonType === 'reject') {
          return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].leftIcon,
            name: "close"
          });
        }
        break;
    }
    return;
  };
  const buttonTexts = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const texts = [];
    inlineButtons.forEach(row => {
      texts.push(row.map(button => (0,_composer_helpers_renderKeyboardButtonText__WEBPACK_IMPORTED_MODULE_3__["default"])(lang, button)));
    });
    return texts;
  }, [lang, inlineButtons]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].root, className),
    children: inlineButtons.map((row, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].row,
      children: row.map((button, j) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_ui_Button__WEBPACK_IMPORTED_MODULE_7__["default"], {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].button, button.style?.type && _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"][`${button.style.type}Tint`]),
        size: "tiny",
        ripple: true,
        noForcedUpperCase: true,
        disabled: button.type === 'unsupported' || button.type === 'suggestedMessage' && button.disabled,
        onClick: () => onClick(button),
        children: [renderIcon(button), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
          className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].inlineButtonText,
          children: [button.style?.iconId && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_CustomEmoji__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: _InlineButtons_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].customEmojiIcon,
            documentId: button.style.iconId,
            size: ICON_SIZE
          }), buttonTexts[i][j]]
        })]
      }))
    }))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(InlineButtons));

/***/ },

/***/ "./src/components/middle/message/LastEditTimeMenuItem.tsx"
/*!****************************************************************!*\
  !*** ./src/components/middle/message/LastEditTimeMenuItem.tsx ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_MenuItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ui/MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/placeholder/Skeleton */ "./src/components/ui/placeholder/Skeleton.tsx");
/* harmony import */ var _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./TimeMenuItem.module.scss */ "./src/components/middle/message/TimeMenuItem.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







function LastEditTimeMenuItem({
  message
}) {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    editDate
  } = message;
  const shouldRenderSkeleton = !editDate;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_3__["default"], {
    icon: "clock-edit",
    className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].item,
    children: shouldRenderSkeleton ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_4__["default"], {
      className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_5__["default"].skeleton,
      animation: "wave"
    }) : Boolean(editDate) && lang('Chat.PrivateMessageEditTimestamp.Date', (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_1__.formatDateAtTime)(lang, editDate * 1000))
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(LastEditTimeMenuItem));

/***/ },

/***/ "./src/components/middle/message/MessageContextMenu.tsx"
/*!**************************************************************!*\
  !*** ./src/components/middle/message/MessageContextMenu.tsx ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_entities_ids__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/entities/ids */ "./src/util/entities/ids.ts");
/* harmony import */ var _util_scrollLock__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/scrollLock */ "./src/util/scrollLock.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _helpers_copyOptions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers/copyOptions */ "./src/components/middle/message/helpers/copyOptions.ts");
/* harmony import */ var _hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useAppLayout */ "./src/hooks/useAppLayout.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_AvatarList__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../common/AvatarList */ "./src/components/common/AvatarList.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ui_Menu__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../ui/Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../ui/MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _ui_MenuSeparator__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../ui/MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _ui_NestedMenuItem__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../ui/NestedMenuItem */ "./src/components/ui/NestedMenuItem.tsx");
/* harmony import */ var _ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../../ui/placeholder/Skeleton */ "./src/components/ui/placeholder/Skeleton.tsx");
/* harmony import */ var _LastEditTimeMenuItem__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./LastEditTimeMenuItem */ "./src/components/middle/message/LastEditTimeMenuItem.tsx");
/* harmony import */ var _reactions_ReactionSelector__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./reactions/ReactionSelector */ "./src/components/middle/message/reactions/ReactionSelector.tsx");
/* harmony import */ var _ReadTimeMenuItem__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./ReadTimeMenuItem */ "./src/components/middle/message/ReadTimeMenuItem.tsx");
/* harmony import */ var _MessageContextMenu_scss__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./MessageContextMenu.scss */ "./src/components/middle/message/MessageContextMenu.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


























const SCROLLBAR_WIDTH = 10;
const REACTION_SELECTOR_WIDTH_REM = 19.25;
const ANIMATION_DURATION = 200;
const MessageContextMenu = ({
  isReactionPickerOpen,
  availableReactions,
  topReactions,
  defaultTagReactions,
  isOpen,
  message,
  poll,
  webPage,
  story,
  isPrivate,
  isCurrentUserPremium,
  enabledReactions,
  isWithPaidReaction,
  reactionsLimit,
  anchor,
  targetHref,
  canSendNow,
  canReschedule,
  canBuyPremium,
  canReply,
  canQuote,
  canEdit,
  canAppendTodoList,
  noReplies,
  canPin,
  canUnpin,
  canDelete,
  canForward,
  canReport,
  canFaveSticker,
  canUnfaveSticker,
  canCopy,
  canCopyLink,
  canSelect,
  canDownload,
  canSaveGif,
  canRevote,
  canClosePoll,
  canTranslate,
  canShowOriginal,
  canSelectLanguage,
  currentTranslationTone,
  isDownloading,
  repliesThreadInfo,
  canShowSeenBy,
  canShowReactionsCount,
  canShowReactionList,
  seenByRecentPeers,
  hasCustomEmoji,
  customEmojiSets,
  canPlayAnimatedEmojis,
  isInSavedMessages,
  shouldRenderShowWhen,
  canLoadReadDate,
  onReply,
  onOpenThread,
  onEdit,
  onAppendTodoList,
  onPin,
  onUnpin,
  onForward,
  onDelete,
  onFaveSticker,
  onReport,
  onUnfaveSticker,
  onSelect,
  onSend,
  onReschedule,
  onClose,
  onCloseAnimationEnd,
  onCopyLink,
  onCopyNumber,
  onDownload,
  onSaveGif,
  onCancelVote,
  onClosePoll,
  onShowSeenBy,
  onShowReactors,
  onToggleReaction,
  onSendPaidReaction,
  onShowPaidReactionModal,
  onCopyMessages,
  onReactionPickerOpen,
  onTranslate,
  onTranslateWithTone,
  onShowOriginal,
  onSelectLanguage,
  userFullName,
  canGift,
  noForwardsNotice
}) => {
  const {
    showNotification,
    openStickerSet,
    openCustomEmojiSets,
    loadStickers,
    openGiftModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const menuRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const scrollableRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_13__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const noReactions = !isPrivate && !enabledReactions;
  const areReactionsPossible = message.areReactionsPossible;
  const withReactions = canShowReactionList && !noReactions || areReactionsPossible;
  const isEdited = 'isEdited' in message && message.isEdited;
  const seenByDates = message.seenByDates;
  const isPremiumGift = message.content.action?.type === 'giftPremium';
  const isGiftCode = message.content.action?.type === 'giftCode';
  const isStarGift = message.content.action?.type === 'starGift';
  const isStarGiftUnique = message.content.action?.type === 'starGiftUnique';
  const shouldShowGiftButton = (0,_util_entities_ids__WEBPACK_IMPORTED_MODULE_4__.isUserId)(message.chatId) && canGift && (isPremiumGift || isGiftCode || isStarGift || isStarGiftUnique);
  const [isReady, markIsReady, unmarkIsReady] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const {
    isMobile
  } = (0,_hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const seenByDatesCount = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => seenByDates ? Object.keys(seenByDates).length : 0, [seenByDates]);
  const totalSeenCount = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const ids = new Set(seenByDates ? Object.keys(seenByDates) : []);
    message.reactors?.reactions?.forEach(({
      peerId
    }) => ids.add(peerId));
    return ids.size;
  }, [seenByDates, message.reactors?.reactions]);
  const handleAfterCopy = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => {
    showNotification({
      message: oldLang('Share.Link.Copied')
    });
    onClose();
  });
  const handleGiftClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => {
    openGiftModal({
      forUserId: message.chatId
    });
    onClose();
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (customEmojiSets?.length) {
      customEmojiSets.map(customEmojiSet => {
        return loadStickers({
          stickerSetInfo: {
            id: customEmojiSet.id,
            accessHash: customEmojiSet.accessHash
          }
        });
      });
    }
  }, [customEmojiSets, openCustomEmojiSets]);
  const handleOpenCustomEmojiSets = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => {
    if (!customEmojiSets) return;
    if (customEmojiSets.length === 1) {
      openStickerSet({
        stickerSetInfo: {
          shortName: customEmojiSets[0].shortName
        }
      });
    } else {
      openCustomEmojiSets({
        setIds: customEmojiSets.map(set => set.id)
      });
    }
    onClose();
  });
  const copyOptions = (0,_helpers_copyOptions__WEBPACK_IMPORTED_MODULE_8__.getMessageCopyOptions)(message, (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.groupStatefulContent)({
    poll,
    webPage,
    story
  }), targetHref, canCopy, handleAfterCopy, canCopyLink ? onCopyLink : undefined, onCopyMessages, onCopyNumber);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => {
    return document.querySelector(`.Transition_slide-active > .MessageList`);
  });
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => document.querySelector('.MessageContextMenu .bubble'));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(() => {
    return {
      extraPaddingX: SCROLLBAR_WIDTH,
      extraTopPadding: document.querySelector('.MiddleHeader').offsetHeight,
      shouldAvoidNegativePosition: true,
      menuElMinWidth: withReactions && isMobile ? REACTION_SELECTOR_WIDTH_REM * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_6__.REM : undefined,
      withPortal: true
    };
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      unmarkIsReady();
      return;
    }
    const timeout = setTimeout(() => {
      markIsReady();
    }, ANIMATION_DURATION);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return (0,_util_scrollLock__WEBPACK_IMPORTED_MODULE_5__.disableScrolling)(scrollableRef.current, '.ReactionPicker');
  }, [isOpen]);
  const handleOpenMessageReactionPicker = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_12__["default"])(position => {
    onReactionPickerOpen(position);
    onClose();
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_ui_Menu__WEBPACK_IMPORTED_MODULE_16__["default"], {
    ref: menuRef,
    isOpen: isOpen,
    anchor: anchor,
    getTriggerElement: getTriggerElement,
    getRootElement: getRootElement,
    getMenuElement: getMenuElement,
    getLayout: getLayout,
    withMaxHeight: true,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('MessageContextMenu', 'fluid', withReactions && 'with-reactions'),
    withPortal: true,
    onClose: onClose,
    onCloseAnimationEnd: onCloseAnimationEnd,
    children: [withReactions && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_reactions_ReactionSelector__WEBPACK_IMPORTED_MODULE_22__["default"], {
      enabledReactions: enabledReactions,
      topReactions: topReactions,
      allAvailableReactions: availableReactions,
      defaultTagReactions: defaultTagReactions,
      currentReactions: message.reactions?.results,
      reactionsLimit: reactionsLimit,
      onToggleReaction: onToggleReaction,
      onSendPaidReaction: onSendPaidReaction,
      onShowPaidReactionModal: onShowPaidReactionModal,
      isWithPaidReaction: isWithPaidReaction,
      isPrivate: isPrivate,
      isReady: isReady,
      canBuyPremium: canBuyPremium,
      isCurrentUserPremium: isCurrentUserPremium,
      isInSavedMessages: isInSavedMessages,
      canPlayAnimatedEmojis: canPlayAnimatedEmojis,
      onShowMore: handleOpenMessageReactionPicker,
      onClose: onClose
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)("div", {
      ref: scrollableRef,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('MessageContextMenu_items scrollable-content custom-scroll'),
      dir: lang.isRtl ? 'rtl' : undefined,
      children: [shouldShowGiftButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "gift",
        onClick: handleGiftClick,
        children: message?.isOutgoing ? oldLang('SendAnotherGift') : oldLang('Conversation.ContextMenuSendGiftTo', userFullName)
      }), canSendNow && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "send-outline",
        onClick: onSend,
        children: oldLang('MessageScheduleSend')
      }), canReschedule && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "schedule",
        onClick: onReschedule,
        children: oldLang('MessageScheduleEditTime')
      }), canReply && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "reply",
        onClick: onReply,
        children: oldLang(canQuote ? 'lng_context_quote_and_reply' : 'Reply')
      }), !noReplies && Boolean(repliesThreadInfo?.messagesCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "replies",
        onClick: onOpenThread,
        children: oldLang('Conversation.ContextViewReplies', repliesThreadInfo.messagesCount, 'i')
      }), canEdit && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "edit",
        onClick: onEdit,
        children: oldLang('Edit')
      }), canAppendTodoList && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "add",
        onClick: onAppendTodoList,
        children: lang('MenuButtonAppendTodoList')
      }), canFaveSticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "favorite",
        onClick: onFaveSticker,
        children: oldLang('AddToFavorites')
      }), canUnfaveSticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "favorite",
        onClick: onUnfaveSticker,
        children: oldLang('Stickers.RemoveFromFavorites')
      }), canTranslate && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "language",
        onClick: () => onTranslate?.(),
        children: oldLang('TranslateMessage')
      }), canShowOriginal && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "language",
        onClick: onShowOriginal,
        children: oldLang('ShowOriginalButton')
      }), canShowOriginal && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_NestedMenuItem__WEBPACK_IMPORTED_MODULE_19__["default"], {
        icon: "tone",
        submenuClassName: "translation-tone-menu",
        submenu: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.Fragment, {
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
            icon: currentTranslationTone === 'neutral' ? 'message-succeeded' : undefined,
            customIcon: currentTranslationTone !== 'neutral' ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_15__["default"], {
              name: "placeholder"
            }) : undefined,
            onClick: () => onTranslateWithTone?.('neutral'),
            children: lang('TranslationToneNeutral')
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
            icon: currentTranslationTone === 'formal' ? 'message-succeeded' : undefined,
            customIcon: currentTranslationTone !== 'formal' ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_15__["default"], {
              name: "placeholder"
            }) : undefined,
            onClick: () => onTranslateWithTone?.('formal'),
            children: lang('TranslationToneFormal')
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
            icon: currentTranslationTone === 'casual' ? 'message-succeeded' : undefined,
            customIcon: currentTranslationTone !== 'casual' ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_15__["default"], {
              name: "placeholder"
            }) : undefined,
            onClick: () => onTranslateWithTone?.('casual'),
            children: lang('TranslationToneCasual')
          })]
        }),
        children: lang('TranslationTone')
      }), canSelectLanguage && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "web",
        onClick: onSelectLanguage,
        children: oldLang('lng_settings_change_lang')
      }), copyOptions.map(option => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: option.icon,
        onClick: option.handler,
        withPreventDefaultOnMouseDown: true,
        children: oldLang(option.label)
      }, option.label)), canPin && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "pin",
        onClick: onPin,
        children: oldLang('DialogPin')
      }), canUnpin && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "unpin",
        onClick: onUnpin,
        children: oldLang('DialogUnpin')
      }), canSaveGif && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "gifs",
        onClick: onSaveGif,
        children: oldLang('lng_context_save_gif')
      }), canRevote && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "revote",
        onClick: onCancelVote,
        children: oldLang('lng_polls_retract')
      }), canClosePoll && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "stop",
        onClick: onClosePoll,
        children: oldLang('lng_polls_stop')
      }), canDownload && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "download",
        onClick: onDownload,
        children: isDownloading ? oldLang('lng_context_cancel_download') : oldLang('lng_media_download')
      }), canForward && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "forward",
        onClick: onForward,
        children: oldLang('Forward')
      }), canSelect && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "select",
        onClick: onSelect,
        children: oldLang('Common.Select')
      }), canReport && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        icon: "flag",
        onClick: onReport,
        children: oldLang('lng_context_report_msg')
      }), canDelete && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        destructive: true,
        icon: "delete",
        onClick: onDelete,
        children: oldLang('Delete')
      }), hasCustomEmoji && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.Fragment, {
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuSeparator__WEBPACK_IMPORTED_MODULE_18__["default"], {
          size: "thick"
        }), !customEmojiSets && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.Fragment, {
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_20__["default"], {
            inline: true,
            className: "menu-loading-row",
            animation: "wave"
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_20__["default"], {
            inline: true,
            className: "menu-loading-row",
            animation: "wave"
          })]
        }), customEmojiSets && customEmojiSets.length === 1 && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
          withWrap: true,
          onClick: handleOpenCustomEmojiSets,
          className: "menu-custom-emoji-sets",
          children: (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])(oldLang('MessageContainsEmojiPack', customEmojiSets[0].title), ['simple_markdown', 'emoji'])
        }), customEmojiSets && customEmojiSets.length > 1 && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
          withWrap: true,
          onClick: handleOpenCustomEmojiSets,
          className: "menu-custom-emoji-sets",
          children: (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])(oldLang('MessageContainsEmojiPacks', customEmojiSets.length), ['simple_markdown'])
        })]
      }), (canShowSeenBy || canShowReactionsCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.Fragment, {
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuSeparator__WEBPACK_IMPORTED_MODULE_18__["default"], {
          size: hasCustomEmoji ? 'thin' : 'thick'
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsxs)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
          icon: canShowReactionsCount ? 'heart-outline' : 'group',
          onClick: canShowReactionsCount ? onShowReactors : onShowSeenBy,
          disabled: !canShowReactionsCount && !seenByDatesCount,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
            className: "MessageContextMenu--seen-by-label-wrapper",
            children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)("span", {
              className: "MessageContextMenu--seen-by-label",
              dir: lang.isRtl ? 'rtl' : undefined,
              children: canShowReactionsCount && message.reactors?.count ? canShowSeenBy && seenByDatesCount ? lang('ChatOutgoingContextMixedReactionCount', {
                count: message.reactors.count,
                total: totalSeenCount
              }) : lang('ChatContextReactionCount', {
                count: message.reactors.count
              }, {
                pluralValue: message.reactors.count
              }) : seenByDatesCount === 1 && seenByRecentPeers ? (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_util_entities_ids__WEBPACK_IMPORTED_MODULE_4__.isUserId)(seenByRecentPeers[0].id) ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getUserFullName)(seenByRecentPeers[0]) : seenByRecentPeers[0].title) : seenByDatesCount ? lang('ConversationContextMenuSeen', {
                count: seenByDatesCount
              }, {
                pluralValue: seenByDatesCount
              }) : lang('ConversationContextMenuNoViews')
            })
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_common_AvatarList__WEBPACK_IMPORTED_MODULE_14__["default"], {
            className: "avatars",
            size: "micro",
            peers: seenByRecentPeers
          })]
        })]
      }), (canLoadReadDate || shouldRenderShowWhen || isEdited || noForwardsNotice) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuSeparator__WEBPACK_IMPORTED_MODULE_18__["default"], {
        size: hasCustomEmoji ? 'thin' : 'thick'
      }), (canLoadReadDate || shouldRenderShowWhen) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ReadTimeMenuItem__WEBPACK_IMPORTED_MODULE_23__["default"], {
        canLoadReadDate: canLoadReadDate,
        shouldRenderShowWhen: shouldRenderShowWhen,
        message: message,
        closeContextMenu: onClose
      }), isEdited && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_LastEditTimeMenuItem__WEBPACK_IMPORTED_MODULE_21__["default"], {
        message: message
      }), noForwardsNotice && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_25__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_17__["default"], {
        disabled: true,
        withWrap: true,
        className: "no-forwards-notice",
        children: noForwardsNotice
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(MessageContextMenu));

/***/ },

/***/ "./src/components/middle/message/ReadTimeMenuItem.tsx"
/*!************************************************************!*\
  !*** ./src/components/middle/message/ReadTimeMenuItem.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_MenuItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ui/placeholder/Skeleton */ "./src/components/ui/placeholder/Skeleton.tsx");
/* harmony import */ var _ui_Transition__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../ui/Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TimeMenuItem.module.scss */ "./src/components/middle/message/TimeMenuItem.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









function ReadTimeMenuItem({
  message,
  shouldRenderShowWhen,
  canLoadReadDate,
  closeContextMenu
}) {
  const {
    openPrivacySettingsNoticeModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const {
    readDate
  } = message;
  const shouldRenderSkeleton = canLoadReadDate && !readDate && !shouldRenderShowWhen;
  const handleOpenModal = () => {
    closeContextMenu();
    openPrivacySettingsNoticeModal({
      chatId: message.chatId,
      isReadDate: true
    });
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_4__["default"], {
    icon: "message-read",
    className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].item,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui_Transition__WEBPACK_IMPORTED_MODULE_6__["default"], {
      name: "fade",
      activeKey: shouldRenderSkeleton ? 1 : 2,
      className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].transition,
      children: shouldRenderSkeleton ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_5__["default"], {
        className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].skeleton,
        animation: "wave"
      }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
        children: [Boolean(readDate) && lang('PmReadAt', (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_2__.formatDateAtTime)(lang, readDate * 1000)), !readDate && shouldRenderShowWhen && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
          children: [lang('PmRead'), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
            className: _TimeMenuItem_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].get,
            onClick: handleOpenModal,
            children: lang('PmReadShowWhen')
          })]
        })]
      })
    })
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReadTimeMenuItem));

/***/ },

/***/ "./src/components/middle/message/SimilarChannels.tsx"
/*!***********************************************************!*\
  !*** ./src/components/middle/message/SimilarChannels.tsx ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _util_textFormat__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/textFormat */ "./src/util/textFormat.ts");
/* harmony import */ var _hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../hooks/schedulers/useTimeout */ "./src/hooks/schedulers/useTimeout.ts");
/* harmony import */ var _hooks_useAverageColor__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../hooks/useAverageColor */ "./src/hooks/useAverageColor.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../hooks/useHorizontalScroll */ "./src/hooks/useHorizontalScroll.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_Avatar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../common/Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../ui/placeholder/Skeleton */ "./src/components/ui/placeholder/Skeleton.tsx");
/* harmony import */ var _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./SimilarChannels.module.scss */ "./src/components/middle/message/SimilarChannels.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



















const DEFAULT_BADGE_COLOR = '#3C3C4399';
const SHOW_CHANNELS_NUMBER = 10;
const ANIMATION_DURATION = 150;
const MIN_SKELETON_DELAY = 300;
const MAX_SKELETON_DELAY = 2000;
const AUTO_EXPAND_TIME = 10; // Seconds from joining

const SimilarChannels = ({
  chatId,
  similarChannelIds,
  isExpanded,
  count,
  isCurrentUserPremium,
  channelJoinInfo
}) => {
  const {
    toggleChannelRecommendations,
    loadChannelRecommendations
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const [isShowing, markShowing, markNotShowing] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_8__["default"])(false);
  const [isHiding, markHiding, markNotHiding] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_8__["default"])(false);
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const ignoreAutoScrollRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const wasExpandedRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const wasClosedManuallyRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    wasClosedManuallyRef.current = false;
  }, [chatId]);
  const similarChannels = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!similarChannelIds) {
      return undefined;
    }
    const global = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    return similarChannelIds.map(id => (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectChat)(global, id)).filter(Boolean);
  }, [similarChannelIds]);
  // Show skeleton while loading similar channels
  const [shouldRenderSkeleton, setShouldRenderSkeleton] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const firstSimilarChannels = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => similarChannels?.slice(0, SHOW_CHANNELS_NUMBER), [similarChannels]);
  const areSimilarChannelsPresent = Boolean(firstSimilarChannels?.length);
  const isAnimating = isHiding || isShowing;
  const shouldRenderChannels = Boolean(!shouldRenderSkeleton && (isExpanded || isAnimating) && areSimilarChannelsPresent);
  (0,_hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_9__["default"])(ref, !shouldRenderChannels, true);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!similarChannelIds) {
      loadChannelRecommendations({
        chatId
      });
    }
  }, [chatId, similarChannelIds]);
  (0,_hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_6__["default"])(() => setShouldRenderSkeleton(false), MAX_SKELETON_DELAY);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (shouldRenderSkeleton && similarChannels && isExpanded) {
      const id = setTimeout(() => {
        setShouldRenderSkeleton(false);
      }, MIN_SKELETON_DELAY);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [similarChannels, isExpanded, shouldRenderSkeleton]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isExpanded) {
      wasExpandedRef.current = true;
      markShowing();
      markNotHiding();
      setShouldRenderSkeleton(!similarChannelIds);
      if (!ignoreAutoScrollRef.current) {
        setTimeout(() => {
          ref.current?.scrollIntoView({
            behavior: 'smooth'
          });
        }, ANIMATION_DURATION);
      }
    } else if (wasExpandedRef.current) {
      markNotShowing();
      markHiding();
    }
  }, [isExpanded, similarChannelIds]);
  const handleToggle = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(() => {
    if (isExpanded) {
      wasClosedManuallyRef.current = true;
    }
    toggleChannelRecommendations({
      chatId
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!channelJoinInfo?.joinedDate || isExpanded || wasClosedManuallyRef.current) return;
    if ((0,_util_serverTime__WEBPACK_IMPORTED_MODULE_4__.getServerTime)() - channelJoinInfo.joinedDate <= AUTO_EXPAND_TIME) {
      handleToggle();
      ignoreAutoScrollRef.current = true;
    }
  }, [channelJoinInfo, isExpanded]);
  if (!shouldRenderChannels && !shouldRenderSkeleton) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].root),
    children: [shouldRenderSkeleton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_ui_placeholder_Skeleton__WEBPACK_IMPORTED_MODULE_16__["default"], {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].skeleton,
      animation: "wave"
    }), shouldRenderChannels && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].channelsWrapper, isShowing && _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].isAppearing, isHiding && _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].isHiding),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].notch,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("svg", {
          width: "19",
          height: "7",
          viewBox: "0 0 19 7",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
            className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].notchPath,
            "fill-rule": "evenodd",
            "clip-rule": "evenodd",
            d: "M19 7C16.8992 7 13.59 3.88897 11.5003 1.67424C10.7648 0.894688 10.397 0.50491 10.0434 0.385149C9.70568 0.270811 9.4225 0.270474 9.08456 0.38401C8.73059 0.50293 8.36133 0.892443 7.62279 1.67147C5.52303 3.88637 2.18302 7 0 7L19 7Z",
            fill: "white"
          })
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].inner,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
          className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].header,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
            className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].title,
            children: lang('SimilarChannels')
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_15__["default"], {
            className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].close,
            color: "translucent",
            onClick: handleToggle,
            iconName: "close"
          })]
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
          ref: ref,
          className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].channelList, 'no-scrollbar'),
          children: firstSimilarChannels?.map((channel, i) => {
            return i === SHOW_CHANNELS_NUMBER - 1 ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(MoreChannels, {
              channel: channel,
              chatId: chatId,
              channelsCount: count - SHOW_CHANNELS_NUMBER + 1,
              isCurrentUserPremium: isCurrentUserPremium
            }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(SimilarChannel, {
              channel: channel
            });
          })
        })]
      })]
    })]
  });
};
function SimilarChannel({
  channel
}) {
  const {
    openChat
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const color = (0,_hooks_useAverageColor__WEBPACK_IMPORTED_MODULE_7__["default"])(channel, DEFAULT_BADGE_COLOR);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_10__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].item,
    onClick: () => openChat({
      id: channel.id
    }),
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_Avatar__WEBPACK_IMPORTED_MODULE_13__["default"], {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].avatar,
      size: "large",
      peer: channel
    }, channel.id), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
      style: `background: ${color}`,
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].badge,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_14__["default"], {
        name: "user-filled",
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].icon
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].membersCount,
        children: (0,_util_textFormat__WEBPACK_IMPORTED_MODULE_5__.formatIntegerCompact)(lang, channel?.membersCount || 0)
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].channelTitle,
      children: channel.title
    })]
  });
}
function MoreChannels({
  channel,
  chatId,
  channelsCount,
  isCurrentUserPremium
}) {
  const {
    openPremiumModal,
    openChatWithInfo
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const handleClickMore = () => {
    if (isCurrentUserPremium) {
      openChatWithInfo({
        id: chatId,
        shouldReplaceHistory: true,
        profileTab: 'similarChannels',
        forceScrollProfileTab: true
      });
    } else {
      openPremiumModal();
    }
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].item, _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].lastItem),
    onClick: () => handleClickMore(),
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_Avatar__WEBPACK_IMPORTED_MODULE_13__["default"], {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].avatar,
      size: "large",
      peer: channel
    }, channel.id), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].fakeAvatar,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].fakeAvatarInner
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].fakeAvatar, _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].lastFakeAvatar),
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].fakeAvatarInner
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].badge,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].membersCount,
        children: `+${channelsCount}`
      }), !isCurrentUserPremium && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_14__["default"], {
        name: "lock-badge",
        className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].icon
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
      className: _SimilarChannels_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].channelTitle,
      children: lang('MoreSimilar')
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  chatId
}) => {
  const {
    similarChannelIds,
    isExpanded,
    count
  } = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectSimilarChannelIds)(global, chatId) || {};
  const isCurrentUserPremium = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectIsCurrentUserPremium)(global);
  const chatFullInfo = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectChatFullInfo)(global, chatId);
  return {
    similarChannelIds,
    isExpanded,
    count,
    isCurrentUserPremium,
    channelJoinInfo: chatFullInfo?.joinInfo
  };
})(SimilarChannels)));

/***/ },

/***/ "./src/components/middle/message/actions/ChannelPhoto.tsx"
/*!****************************************************************!*\
  !*** ./src/components/middle/message/actions/ChannelPhoto.tsx ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _common_Avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const AVATAR_SIZE = 15 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_1__.REM;
const ChannelPhotoAction = ({
  action,
  onClick,
  observeIntersection
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_common_Avatar__WEBPACK_IMPORTED_MODULE_2__["default"], {
    className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].channelPhoto,
    photo: action.photo,
    loopIndefinitely: true,
    withVideo: true,
    observeIntersection: observeIntersection,
    onClick: onClick,
    size: AVATAR_SIZE
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ChannelPhotoAction));

/***/ },

/***/ "./src/components/middle/message/actions/Gift.tsx"
/*!********************************************************!*\
  !*** ./src/components/middle/message/actions/Gift.tsx ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/formatCurrency */ "./src/util/formatCurrency.tsx");
/* harmony import */ var _common_helpers_renderTextWithEntities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/helpers/renderTextWithEntities */ "./src/components/common/helpers/renderTextWithEntities.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _common_StickerView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/StickerView */ "./src/components/common/StickerView.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const STICKER_SIZE = 150;
const GiftAction = ({
  action,
  sticker,
  canPlayAnimatedEmojis,
  onClick,
  observeIntersectionForLoading,
  observeIntersectionForPlaying
}) => {
  const stickerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const message = action.type === 'giftPremium' ? action.message : undefined;
  const renderTonTitle = () => {
    const {
      cryptoAmount,
      cryptoCurrency
    } = action;
    const price = cryptoAmount ? (0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.formatCurrency)(lang, cryptoAmount, cryptoCurrency, {
      asFontIcon: true
    }) : undefined;
    return price;
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].contentBox,
    tabIndex: 0,
    role: "button",
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      ref: stickerRef,
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].stickerWrapper,
      style: `width: ${STICKER_SIZE}px; height: ${STICKER_SIZE}px`,
      children: sticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_StickerView__WEBPACK_IMPORTED_MODULE_8__["default"], {
        containerRef: stickerRef,
        sticker: sticker,
        size: STICKER_SIZE,
        observeIntersectionForLoading: observeIntersectionForLoading,
        observeIntersectionForPlaying: observeIntersectionForPlaying,
        noLoad: !canPlayAnimatedEmojis
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("h3", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].title,
        children: action.type === 'giftPremium' ? lang('ActionGiftPremiumDuration', {
          duration: (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_3__.formatCountdownDays)(lang, action.days)
        }) : action.type === 'giftStars' ? lang('ActionGiftStarsTitle', {
          amount: action.stars
        }, {
          pluralValue: action.stars
        }) : renderTonTitle()
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        children: [message && (0,_common_helpers_renderTextWithEntities__WEBPACK_IMPORTED_MODULE_5__.renderTextWithEntities)(message), !message && lang(action.type === 'giftTon' ? 'DescriptionAboutTon' : action.type === 'giftPremium' ? 'ActionGiftPremiumText' : 'ActionGiftStarsText')]
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].actionButton,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_7__["default"], {
        preset: "button"
      }), lang('ActionViewButton')]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  action
}) => {
  const sticker = action.type === 'giftPremium' ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectGiftStickerForDuration)(global, action.days) : action.type === 'giftStars' ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectGiftStickerForStars)(global, action.stars) : (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectGiftStickerForTon)(global, action.cryptoAmount);
  const canPlayAnimatedEmojis = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectCanPlayAnimatedEmojis)(global);
  return {
    sticker,
    canPlayAnimatedEmojis
  };
})(GiftAction)));

/***/ },

/***/ "./src/components/middle/message/actions/GiveawayPrize.tsx"
/*!*****************************************************************!*\
  !*** ./src/components/middle/message/actions/GiveawayPrize.tsx ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _common_StickerView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/StickerView */ "./src/components/common/StickerView.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const STICKER_SIZE = 150;
const GiveawayPrizeAction = ({
  currentUserId,
  action,
  sender,
  sticker,
  canPlayAnimatedEmojis,
  channel,
  onClick,
  observeIntersectionForLoading,
  observeIntersectionForPlaying
}) => {
  const stickerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const channelLink = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const channelTitle = channel && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, channel);
    const channelFallbackText = lang('ActionFallbackChannel');
    return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__.renderPeerLink)(channel?.id, channelTitle || channelFallbackText);
  }, [channel, lang]);
  const peerLink = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const peer = channel || sender;
    const peerTitle = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, peer);
    const peerFallbackText = lang('ActionFallbackChat');
    return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__.renderPeerLink)(peer?.id, peerTitle || peerFallbackText);
  }, [channel, sender, lang]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].contentBox,
    tabIndex: 0,
    role: "button",
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      ref: stickerRef,
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].stickerWrapper,
      style: `width: ${STICKER_SIZE}px; height: ${STICKER_SIZE}px`,
      children: sticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_StickerView__WEBPACK_IMPORTED_MODULE_8__["default"], {
        containerRef: stickerRef,
        sticker: sticker,
        size: STICKER_SIZE,
        observeIntersectionForLoading: observeIntersectionForLoading,
        observeIntersectionForPlaying: observeIntersectionForPlaying,
        noLoad: !canPlayAnimatedEmojis
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("h3", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].title,
        children: lang(action.type !== 'giftCode' || action.isViaGiveaway ? 'ActionGiveawayResultTitle' : 'GiftInfoTitle')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        children: [action.type === 'giftCode' && (action.isViaGiveaway ? lang('ActionGiveawayResultPremiumDuration', {
          channel: channelLink,
          duration: (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_4__.formatCountdownDays)(lang, action.days)
        }, {
          withNodes: true,
          withMarkdown: true,
          renderTextFilters: ['br']
        }) : lang(sender?.id === currentUserId ? 'ActionGiftCodeSubscriptionDurationYou' : 'ActionGiftCodeSubscriptionDuration', {
          peer: peerLink,
          duration: (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_4__.formatCountdownDays)(lang, action.days)
        }, {
          withNodes: true,
          renderTextFilters: ['br']
        })), action.type === 'prizeStars' && lang('ActionGiveawayResultStarsText', {
          amount: action.stars,
          channel: channelLink
        }, {
          withNodes: true,
          withMarkdown: true,
          pluralValue: action.stars,
          renderTextFilters: ['br']
        })]
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].actionButton,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_7__["default"], {
        preset: "button"
      }), lang(action.type === 'giftCode' ? 'ActionOpenGiftButton' : 'ActionViewButton')]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  action
}) => {
  const currentUserId = global.currentUserId;
  const sticker = action.type === 'giftCode' ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectGiftStickerForDuration)(global, action.days) : (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectGiftStickerForStars)(global, action.stars);
  const canPlayAnimatedEmojis = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectCanPlayAnimatedEmojis)(global);
  const channel = action.boostPeerId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectChat)(global, action.boostPeerId) : undefined;
  return {
    currentUserId,
    sticker,
    canPlayAnimatedEmojis,
    channel
  };
})(GiveawayPrizeAction)));

/***/ },

/***/ "./src/components/middle/message/actions/NoForwardsRequest.tsx"
/*!*********************************************************************!*\
  !*** ./src/components/middle/message/actions/NoForwardsRequest.tsx ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./NoForwardsRequest.module.scss */ "./src/components/middle/message/actions/NoForwardsRequest.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const SHARING_FEATURES = ['NoForwardsRequestForwarding', 'NoForwardsRequestSaving', 'NoForwardsRequestCopying'];
const NoForwardsRequest = ({
  message,
  sender
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const {
    isOutgoing
  } = message;
  const peerTitle = sender && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, sender);
  const peerLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__.renderPeerLink)(sender?.id, peerTitle || lang('ActionFallbackUser'));
  const title = isOutgoing ? lang('NoForwardsRequestYouTitle') : lang('NoForwardsRequestTitle', {
    user: peerLink
  }, {
    withNodes: true,
    withMarkdown: false
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].contentBox, _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].root),
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].title,
      children: title
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].list,
      children: SHARING_FEATURES.map(featureKey => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].item,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
          name: "check",
          className: _NoForwardsRequest_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].checkIcon
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
          children: lang(featureKey)
        })]
      }, featureKey))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const sender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectSender)(global, message);
  return {
    sender
  };
})(NoForwardsRequest)));

/***/ },

/***/ "./src/components/middle/message/actions/StarGift.tsx"
/*!************************************************************!*\
  !*** ./src/components/middle/message/actions/StarGift.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/browser/windowEnvironment.ts */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_localization_format__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../util/localization/format */ "./src/util/localization/format.tsx");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _util_textFormat__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../util/textFormat */ "./src/util/textFormat.ts");
/* harmony import */ var _common_helpers_gifts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../common/helpers/gifts */ "./src/components/common/helpers/gifts.ts");
/* harmony import */ var _common_helpers_renderTextWithEntities__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../common/helpers/renderTextWithEntities */ "./src/components/common/helpers/renderTextWithEntities.tsx");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../hooks/stickers/useDynamicColorListener */ "./src/hooks/stickers/useDynamicColorListener.ts");
/* harmony import */ var _hooks_useFlag_ts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../hooks/useFlag.ts */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_gift_GiftRibbon__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../common/gift/GiftRibbon */ "./src/components/common/gift/GiftRibbon.tsx");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _common_StickerView__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../common/StickerView */ "./src/components/common/StickerView.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





















const STICKER_SIZE = 120;
const StarGiftAction = ({
  action,
  message,
  canPlayAnimatedEmojis,
  sender,
  recipient,
  starGiftMaxConvertPeriod,
  onClick,
  observeIntersectionForLoading,
  observeIntersectionForPlaying
}) => {
  const ref = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const stickerRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_15__["default"])();
  const [isHover, markHover, unmarkHover] = (0,_hooks_useFlag_ts__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const {
    isOutgoing
  } = message;
  const sticker = (0,_common_helpers_gifts__WEBPACK_IMPORTED_MODULE_10__.getStickerFromGift)(action.gift);
  const peer = isOutgoing ? recipient : sender;
  const isChannel = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.isApiPeerChat)(peer) && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isChatChannel)(peer);
  const isAuction = action.isAuctionAcquired;
  const backgroundColor = (0,_hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_13__["default"])(ref, 'background-color', !action.gift.availabilityTotal);
  const fallbackPeerTitle = lang('ActionFallbackSomeone');
  const peerTitle = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.getPeerTitle)(lang, peer);
  const auctionToTitle = recipient && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.getPeerTitle)(lang, recipient);
  const isSelf = sender?.id === recipient?.id;
  const auctionBid = isAuction ? action.gift.stars : undefined;
  const giftDescription = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const peerLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.renderPeerLink)(peer?.id, peerTitle || fallbackPeerTitle);
    const starsAmount = action.starsToConvert !== undefined ? (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_7__.formatStarsAsText)(lang, action.starsToConvert) : undefined;
    if (isAuction && auctionBid !== undefined) {
      return lang('ActionStarGiftAuctionBought', {
        cost: (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_7__.formatStarsAsText)(lang, auctionBid)
      });
    }
    if (action.isUpgraded) {
      return lang('ActionStarGiftUpgraded');
    }
    if (action.alreadyPaidUpgradeStars && !isAuction) {
      return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'ActionStarGiftUpgradeText', !isOutgoing || isSelf, {
        peer: peerLink
      });
    }
    if (action.isConverted) {
      return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'ActionStarGiftConvertedText', !isOutgoing || isSelf, {
        peer: peerLink,
        amount: starsAmount
      });
    }
    if (starGiftMaxConvertPeriod && (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_8__.getServerTime)() < message.date + starGiftMaxConvertPeriod && starsAmount) {
      return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'ActionStarGiftConvertText', !isOutgoing || isSelf, {
        peer: peerLink,
        amount: starsAmount
      });
    }
    if (isChannel) {
      return lang('ActionStarGiftChannelText', {
        amount: starsAmount
      }, {
        withNodes: true
      });
    }
    return (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'ActionStarGiftNoConvertText', !isOutgoing || isSelf, {
      peer: peerLink
    });
  }, [action, auctionBid, fallbackPeerTitle, isAuction, isChannel, isOutgoing, lang, message.date, peer?.id, peerTitle, starGiftMaxConvertPeriod, isSelf]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
    ref: ref,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_6__["default"])('interactive-gift', _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].contentBox, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].starGift),
    tabIndex: 0,
    role: "button",
    onClick: onClick,
    onMouseEnter: !_util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_5__.IS_TOUCH_ENV ? markHover : undefined,
    onMouseLeave: !_util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_5__.IS_TOUCH_ENV ? unmarkHover : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
      ref: stickerRef,
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].stickerWrapper,
      style: `width: ${STICKER_SIZE}px; height: ${STICKER_SIZE}px`,
      children: sticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_StickerView__WEBPACK_IMPORTED_MODULE_18__["default"], {
        containerRef: stickerRef,
        sticker: sticker,
        size: STICKER_SIZE,
        shouldLoop: isHover,
        observeIntersectionForLoading: observeIntersectionForLoading,
        observeIntersectionForPlaying: observeIntersectionForPlaying,
        noLoad: !canPlayAnimatedEmojis
      })
    }), Boolean(action.gift.availabilityTotal) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_gift_GiftRibbon__WEBPACK_IMPORTED_MODULE_16__["default"], {
      color: backgroundColor || 'blue',
      text: lang('ActionStarGiftLimitedRibbon', {
        total: (0,_util_textFormat__WEBPACK_IMPORTED_MODULE_9__.formatIntegerCompact)(lang, action.gift.availabilityTotal)
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("h3", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].title,
        children: isAuction && recipient ? lang('ActionStarGiftAuctionFor', {
          peer: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.renderPeerLink)(recipient.id, auctionToTitle || fallbackPeerTitle)
        }, {
          withNodes: true
        }) : isSelf ? lang('ActionStarGiftSelf') : lang(isOutgoing ? 'ActionStarGiftTo' : 'ActionStarGiftFrom', {
          peer: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.renderPeerLink)(peer?.id, peerTitle || fallbackPeerTitle)
        }, {
          withNodes: true
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].subtitle,
        children: [action.message && (0,_common_helpers_renderTextWithEntities__WEBPACK_IMPORTED_MODULE_11__.renderTextWithEntities)(action.message), !action.message && giftDescription]
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].actionButton,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_17__["default"], {
        preset: "button"
      }), action.alreadyPaidUpgradeStars && !action.isUpgraded && !isOutgoing ? lang('ActionStarGiftUnpack') : lang('ActionViewButton')]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message,
  action
}) => {
  const currentUser = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectUser)(global, global.currentUserId);
  const canPlayAnimatedEmojis = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectCanPlayAnimatedEmojis)(global);
  const messageSender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectSender)(global, message);
  const giftSender = action.fromId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectPeer)(global, action.fromId) : undefined;
  const messageRecipient = message.isOutgoing ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectPeer)(global, message.chatId) : currentUser;
  const giftRecipientId = action.toId || action.peerId;
  const giftRecipient = giftRecipientId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectPeer)(global, giftRecipientId) : undefined;
  return {
    canPlayAnimatedEmojis,
    sender: giftSender || messageSender,
    recipient: giftRecipient || messageRecipient,
    starGiftMaxConvertPeriod: global.appConfig.starGiftMaxConvertPeriod
  };
})(StarGiftAction)));

/***/ },

/***/ "./src/components/middle/message/actions/StarGiftPurchaseOffer.tsx"
/*!*************************************************************************!*\
  !*** ./src/components/middle/message/actions/StarGiftPurchaseOffer.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _util_localization_format__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../util/localization/format */ "./src/util/localization/format.tsx");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _common_helpers_gifts__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../common/helpers/gifts */ "./src/components/common/helpers/gifts.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_schedulers_useIntervalForceUpdate__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../hooks/schedulers/useIntervalForceUpdate */ "./src/hooks/schedulers/useIntervalForceUpdate.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_profile_RadialPatternBackground__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../common/profile/RadialPatternBackground */ "./src/components/common/profile/RadialPatternBackground.tsx");
/* harmony import */ var _common_StickerView__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../common/StickerView */ "./src/components/common/StickerView.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./StarGiftPurchaseOffer.module.scss */ "./src/components/middle/message/actions/StarGiftPurchaseOffer.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




















const STICKER_SIZE = 48;
const ONE_MINUTE = 60 * 1000;
const StarGiftPurchaseOffer = ({
  action,
  message,
  hasButtons,
  canPlayAnimatedEmojis,
  sender,
  recipient,
  observeIntersectionForLoading,
  observeIntersectionForPlaying,
  onClick
}) => {
  const stickerRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_13__["default"])();
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const [isHover, markHover, unmarkHover] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_12__["default"])();
  const {
    isOutgoing
  } = message;
  const sticker = (0,_common_helpers_gifts__WEBPACK_IMPORTED_MODULE_9__.getStickerFromGift)(action.gift);
  const attributes = (0,_common_helpers_gifts__WEBPACK_IMPORTED_MODULE_9__.getGiftAttributes)(action.gift);
  const pattern = attributes?.pattern;
  const backdrop = attributes?.backdrop;
  const isActive = !action.isAccepted && !action.isDeclined;
  (0,_hooks_schedulers_useIntervalForceUpdate__WEBPACK_IMPORTED_MODULE_11__["default"])(isActive ? ONE_MINUTE : undefined);
  const serverTime = (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_8__.getServerTime)();
  const timeLeft = Math.max(0, action.expiresAt - serverTime);
  const formattedTime = (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_6__.formatShortHoursMinutes)(oldLang, timeLeft);
  const hasExpired = timeLeft <= 0;
  const subtitle = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (action.isAccepted) return lang('ActionStarGiftOfferAccepted');
    if (action.isDeclined) return lang('ActionStarGiftOfferRejected');
    if (hasExpired) return lang('ActionStarGiftOfferHasExpired');
    return lang('ActionStarGiftOfferExpires', {
      time: formattedTime
    });
  }, [action.isAccepted, action.isDeclined, formattedTime, lang, hasExpired]);
  if (!sticker || !pattern || !backdrop) {
    return undefined;
  }
  const backgroundColors = [backdrop.centerColor, backdrop.edgeColor];
  const peer = isOutgoing ? recipient : sender;
  const fallbackPeerTitle = lang('ActionFallbackSomeone');
  const peerTitle = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, peer);
  const giftName = lang('GiftUnique', {
    title: action.gift.title,
    number: action.gift.number
  });
  const priceText = (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_7__.formatCurrencyAmountAsText)(lang, action.price);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].contentBox, _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].root, hasButtons && _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].hasButtons, onClick && _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].clickable),
    tabIndex: onClick ? 0 : undefined,
    role: onClick ? 'button' : undefined,
    onMouseEnter: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_TOUCH_ENV ? markHover : undefined,
    onMouseLeave: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_4__.IS_TOUCH_ENV ? unmarkHover : undefined,
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxs)("div", {
      className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].giftContainer,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)("div", {
        className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].uniqueBackgroundWrapper,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)(_common_profile_RadialPatternBackground__WEBPACK_IMPORTED_MODULE_15__["default"], {
          className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].uniqueBackground,
          backgroundColors: backgroundColors,
          patternIcon: pattern.sticker,
          patternSize: 9,
          ringsCount: 1,
          ovalFactor: 1
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)("div", {
        ref: stickerRef,
        className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].stickerWrapper,
        style: `width: ${STICKER_SIZE}px; height: ${STICKER_SIZE}px`,
        children: sticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)(_common_StickerView__WEBPACK_IMPORTED_MODULE_16__["default"], {
          containerRef: stickerRef,
          sticker: sticker,
          size: STICKER_SIZE,
          shouldLoop: isHover,
          observeIntersectionForLoading: observeIntersectionForLoading,
          observeIntersectionForPlaying: observeIntersectionForPlaying,
          noLoad: !canPlayAnimatedEmojis
        })
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsxs)("div", {
      className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)("p", {
        className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].title,
        children: lang(isOutgoing ? 'ActionStarGiftOfferOutgoing' : 'ActionStarGiftOfferIncoming', {
          peer: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_10__.renderPeerLink)(peer?.id, peerTitle || fallbackPeerTitle),
          cost: priceText,
          gift: giftName
        }, {
          withNodes: true,
          withMarkdown: true
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_19__.jsx)("p", {
        className: _StarGiftPurchaseOffer_module_scss__WEBPACK_IMPORTED_MODULE_18__["default"].subtitle,
        children: subtitle
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const currentUser = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectUser)(global, global.currentUserId);
  const canPlayAnimatedEmojis = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectCanPlayAnimatedEmojis)(global);
  const messageSender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectSender)(global, message);
  const messageRecipient = message.isOutgoing ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, message.chatId) : currentUser;
  return {
    canPlayAnimatedEmojis,
    sender: messageSender,
    recipient: messageRecipient
  };
})(StarGiftPurchaseOffer)));

/***/ },

/***/ "./src/components/middle/message/actions/StarGiftUnique.tsx"
/*!******************************************************************!*\
  !*** ./src/components/middle/message/actions/StarGiftUnique.tsx ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/browser/windowEnvironment.ts */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _common_helpers_gifts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/helpers/gifts */ "./src/components/common/helpers/gifts.ts");
/* harmony import */ var _common_helpers_mediaDimensions_ts__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions.ts */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useFlag_ts__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../hooks/useFlag.ts */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_gift_GiftRibbon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../common/gift/GiftRibbon */ "./src/components/common/gift/GiftRibbon.tsx");
/* harmony import */ var _common_MiniTable__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../common/MiniTable */ "./src/components/common/MiniTable.tsx");
/* harmony import */ var _common_profile_RadialPatternBackground__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../common/profile/RadialPatternBackground */ "./src/components/common/profile/RadialPatternBackground.tsx");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _common_StickerView__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../common/StickerView */ "./src/components/common/StickerView.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



















const STICKER_SIZE = 120;
const StarGiftAction = ({
  action,
  message,
  canPlayAnimatedEmojis,
  sender,
  recipient,
  onClick,
  observeIntersectionForLoading,
  observeIntersectionForPlaying
}) => {
  const stickerRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_11__["default"])();
  const [isHover, markHover, unmarkHover] = (0,_hooks_useFlag_ts__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const {
    isOutgoing
  } = message;
  const sticker = (0,_common_helpers_gifts__WEBPACK_IMPORTED_MODULE_7__.getStickerFromGift)(action.gift);
  const attributes = (0,_common_helpers_gifts__WEBPACK_IMPORTED_MODULE_7__.getGiftAttributes)(action.gift);
  const model = attributes.model;
  const pattern = attributes.pattern;
  const backdrop = attributes.backdrop;
  const backgroundColors = [backdrop.centerColor, backdrop.edgeColor];
  const adaptedPatternColor = `${backdrop.patternColor.slice(0, 7)}55`;
  const tableData = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [[lang('ActionStarGiftUniqueModel'), model.name], [lang('ActionStarGiftUniqueBackdrop'), backdrop.name], [lang('ActionStarGiftUniqueSymbol'), pattern.name]], [lang, model, pattern, backdrop]);
  const shouldShowFrom = !isOutgoing || action.isUpgrade;
  const peer = shouldShowFrom && !action.isUpgrade ? sender : recipient;
  const fallbackPeerTitle = lang('ActionFallbackSomeone');
  const peerTitle = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, peer);
  const isSelf = sender?.id === recipient?.id;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])('interactive-gift', _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].contentBox, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].starGift, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].uniqueGift),
    tabIndex: 0,
    role: "button",
    onClick: onClick,
    onMouseEnter: !_util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_4__.IS_TOUCH_ENV ? markHover : undefined,
    onMouseLeave: !_util_browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_4__.IS_TOUCH_ENV ? unmarkHover : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].uniqueBackgroundWrapper,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_profile_RadialPatternBackground__WEBPACK_IMPORTED_MODULE_14__["default"], {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].uniqueBackground,
        backgroundColors: backgroundColors,
        patternIcon: pattern.sticker,
        patternSize: 14,
        yPosition: 5 * _common_helpers_mediaDimensions_ts__WEBPACK_IMPORTED_MODULE_8__.REM,
        clearBottomSector: true
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
      ref: stickerRef,
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].stickerWrapper,
      style: `width: ${STICKER_SIZE}px; height: ${STICKER_SIZE}px`,
      children: sticker && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_StickerView__WEBPACK_IMPORTED_MODULE_16__["default"], {
        containerRef: stickerRef,
        sticker: sticker,
        size: STICKER_SIZE,
        shouldLoop: isHover,
        observeIntersectionForLoading: observeIntersectionForLoading,
        observeIntersectionForPlaying: observeIntersectionForPlaying,
        noLoad: !canPlayAnimatedEmojis
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_gift_GiftRibbon__WEBPACK_IMPORTED_MODULE_12__["default"], {
      color: action.gift.isBurned ? 'red' : adaptedPatternColor,
      text: action.gift.isBurned ? lang('ActionStarGiftUniqueBurnedRibbon') : lang('ActionStarGiftUniqueRibbon')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("h3", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].title,
        children: isSelf ? action.gift.isCrafted ? lang('ActionStarGiftCrafted') : lang('ActionStarGiftSelf') : lang(shouldShowFrom ? 'ActionStarGiftFrom' : 'ActionStarGiftTo', {
          peer: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_9__.renderPeerLink)(peer?.id, peerTitle || fallbackPeerTitle)
        }, {
          withNodes: true
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("div", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].subtitle,
        style: `color: ${backdrop.textColor}`,
        children: lang('GiftUnique', {
          title: action.gift.title,
          number: action.gift.number
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_MiniTable__WEBPACK_IMPORTED_MODULE_13__["default"], {
        data: tableData,
        style: `color: ${backdrop.textColor}`,
        valueClassName: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].uniqueValue
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_17__["default"].actionButton,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_6__["default"])(adaptedPatternColor && `background-color: ${adaptedPatternColor}`),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_15__["default"], {
        preset: "button"
      }), lang('ActionViewButton')]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message,
  action
}) => {
  const currentUser = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectUser)(global, global.currentUserId);
  const canPlayAnimatedEmojis = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectCanPlayAnimatedEmojis)(global);
  const messageSender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectSender)(global, message);
  const giftSender = action.fromId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, action.fromId) : undefined;
  const messageRecipient = message.isOutgoing ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, message.chatId) : currentUser;
  const giftRecipient = action.peerId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, action.peerId) : undefined;
  return {
    canPlayAnimatedEmojis,
    sender: giftSender || messageSender,
    recipient: giftRecipient || messageRecipient
  };
})(StarGiftAction)));

/***/ },

/***/ "./src/components/middle/message/actions/SuggestedPhoto.tsx"
/*!******************************************************************!*\
  !*** ./src/components/middle/message/actions/SuggestedPhoto.tsx ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../types */ "./src/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../util/files */ "./src/util/files.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _common_Avatar__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../common/Avatar */ "./src/components/common/Avatar.tsx");
/* harmony import */ var _ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../ui/ConfirmDialog */ "./src/components/ui/ConfirmDialog.tsx");
/* harmony import */ var _ui_CropModal__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../ui/CropModal */ "./src/components/ui/CropModal.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


















const SuggestedPhotoAction = ({
  message,
  action,
  peer,
  observeIntersection
}) => {
  const {
    openMediaViewer,
    uploadProfilePhoto,
    showNotification
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const {
    isOutgoing
  } = message;
  const photo = action.photo;
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_10__["default"])();
  const [cropModalBlob, setCropModalBlob] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [isVideoModalOpen, openVideoModal, closeVideoModal] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_9__["default"])(false);
  const suggestedPhotoUrl = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_12__["default"])((0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getPhotoMediaHash)(photo, 'full'));
  const suggestedVideoUrl = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_12__["default"])((0,_global_helpers__WEBPACK_IMPORTED_MODULE_4__.getVideoProfilePhotoMediaHash)(photo));
  const isVideo = photo.isVideo;
  const text = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const peerName = peer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_5__.getPeerTitle)(lang, peer) || lang('ActionFallbackUser');
    const peerLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_8__.renderPeerLink)(peer?.id, peerName);
    if (isOutgoing) {
      return lang('ActionSuggestedPhotoYou', {
        user: peerLink
      }, {
        withNodes: true
      });
    }
    return lang('ActionSuggestedPhoto', {
      user: peerLink
    }, {
      withNodes: true
    });
  }, [lang, isOutgoing, peer]);
  const showAvatarNotification = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(() => {
    showNotification({
      title: lang('ActionSuggestedPhotoUpdatedTitle'),
      message: lang('ActionSuggestedPhotoUpdatedDescription'),
      action: {
        action: 'openSettingsScreen',
        payload: {
          screen: _types__WEBPACK_IMPORTED_MODULE_3__.SettingsScreens.Main
        }
      },
      actionText: lang('Open')
    });
  });
  const handleSetSuggestedAvatar = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(file => {
    setCropModalBlob(undefined);
    uploadProfilePhoto({
      file
    });
    showAvatarNotification();
  });
  const handleCloseCropModal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(() => {
    setCropModalBlob(undefined);
  });
  const handleSetVideo = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_11__["default"])(async () => {
    if (!suggestedVideoUrl) return;
    closeVideoModal();
    showAvatarNotification();

    // TODO Once we support uploading video avatars, add crop/trim modal here
    const blob = await (0,_util_files__WEBPACK_IMPORTED_MODULE_7__.fetchBlob)(suggestedVideoUrl);
    uploadProfilePhoto({
      file: new File([blob], 'avatar.mp4'),
      isVideo: true,
      videoTs: photo.videoSizes?.find(l => l.videoStartTs !== undefined)?.videoStartTs
    });
  });
  const handleViewSuggestedAvatar = async () => {
    if (!isOutgoing && suggestedPhotoUrl) {
      if (isVideo) {
        openVideoModal();
      } else {
        setCropModalBlob(await (0,_util_files__WEBPACK_IMPORTED_MODULE_7__.fetchBlob)(suggestedPhotoUrl));
      }
    } else {
      openMediaViewer({
        chatId: message.chatId,
        messageId: message.id,
        threadId: _api_types__WEBPACK_IMPORTED_MODULE_2__.MAIN_THREAD_ID,
        origin: _types__WEBPACK_IMPORTED_MODULE_3__.MediaViewerOrigin.SuggestedAvatar
      });
    }
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
    className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_16__["default"].contentBox,
    tabIndex: 0,
    role: "button",
    onClick: handleViewSuggestedAvatar,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_common_Avatar__WEBPACK_IMPORTED_MODULE_13__["default"], {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_16__["default"].suggestedAvatar,
      photo: action.photo,
      loopIndefinitely: true,
      withVideo: true,
      observeIntersection: observeIntersection,
      size: "jumbo"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_16__["default"].suggestedText,
      children: text
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_16__["default"].actionButton,
      children: lang('ActionSuggestedPhotoButton')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_ui_CropModal__WEBPACK_IMPORTED_MODULE_15__["default"], {
      file: cropModalBlob,
      onClose: handleCloseCropModal,
      onChange: handleSetSuggestedAvatar
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_ui_ConfirmDialog__WEBPACK_IMPORTED_MODULE_14__["default"], {
      isOpen: isVideoModalOpen,
      title: lang('ActionSuggestedVideoTitle'),
      confirmHandler: handleSetVideo,
      onClose: closeVideoModal,
      text: lang('ActionSuggestedVideoText')
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const peer = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_6__.selectPeer)(global, message.chatId);
  return {
    peer
  };
})(SuggestedPhotoAction)));

/***/ },

/***/ "./src/components/middle/message/actions/SuggestedPostApproval.tsx"
/*!*************************************************************************!*\
  !*** ./src/components/middle/message/actions/SuggestedPostApproval.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../config */ "./src/config.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_helpers_replies__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../global/helpers/replies */ "./src/global/helpers/replies.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../util/dates/oldDateFormat */ "./src/util/dates/oldDateFormat.ts");
/* harmony import */ var _util_formatCurrency__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../util/formatCurrency */ "./src/util/formatCurrency.tsx");
/* harmony import */ var _util_localization_format__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../util/localization/format */ "./src/util/localization/format.tsx");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");

















const SuggestedPostApproval = ({
  message,
  action,
  sender,
  chat,
  originalSender,
  ageMinSeconds,
  isAdmin,
  onClick
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_13__["default"])();
  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_14__["default"])();
  const {
    scheduleDate,
    amount
  } = action;
  const chatTitle = chat && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.getPeerFullTitle)(lang, chat);
  const renderChatLink = () => (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.renderPeerLink)(chat?.id, chatTitle || lang('ActionFallbackChat'));
  const originalSenderTitle = originalSender && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.getPeerFullTitle)(lang, originalSender);
  const originalSenderLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.renderPeerLink)(originalSender?.id, originalSenderTitle || lang('ActionFallbackUser'));
  const publishDate = scheduleDate ? (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_7__.formatScheduledDateTime)(scheduleDate, lang, oldLang) : lang('SuggestMessageAnytime');
  const isPostPublished = scheduleDate ? scheduleDate <= (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_10__.getServerTime)() : false;
  const currency = amount?.currency;
  const amountValue = amount?.amount || 0;
  const formattedAmount = amountValue > 0 ? currency === _config__WEBPACK_IMPORTED_MODULE_2__.TON_CURRENCY_CODE ? (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_9__.formatTonAsText)(lang, (0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_8__.convertTonFromNanos)(amountValue)) : (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_9__.formatStarsAsText)(lang, amountValue) : undefined;
  const duration = (0,_util_dates_oldDateFormat__WEBPACK_IMPORTED_MODULE_7__.formatShortDuration)(lang, ageMinSeconds, true);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_6__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].contentBox, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostContentBox),
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostApprovalTitle,
      children: (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_11__["default"])(lang('SuggestedPostAgreementReached'))
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostApprovalSection,
      children: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, isPostPublished ? 'SuggestedPostPublished' : 'SuggestedPostPublishSchedule', !isAdmin, {
        peer: renderChatLink(),
        date: publishDate
      }, {
        withMarkdown: true
      })
    }), formattedAmount && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostApprovalSection,
      children: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'SuggestedPostCharged', !isAdmin, {
        user: originalSenderLink,
        amount: formattedAmount
      }, {
        withMarkdown: true
      })
    }), isPostPublished && formattedAmount && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.Fragment, {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostApprovalSection,
        children: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'SuggestedPostReceiveAmount', !isAdmin, {
          peer: renderChatLink(),
          duration
        }, {
          withMarkdown: true
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_16__.jsx)("div", {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_15__["default"].suggestedPostApprovalSection,
        children: (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_12__.translateWithYou)(lang, 'SuggestedPostRefund', !isAdmin, {
          peer: renderChatLink(),
          duration
        }, {
          withMarkdown: true
        })
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const sender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectSender)(global, message);
  const chat = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectMonoforumChannel)(global, message.chatId);
  const replyInfo = (0,_global_helpers_replies__WEBPACK_IMPORTED_MODULE_4__.getMessageReplyInfo)(message);
  let originalSender;
  if (replyInfo?.type === 'message' && replyInfo.replyToMsgId) {
    const replyMessage = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectReplyMessage)(global, message);
    if (replyMessage) {
      originalSender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectSender)(global, replyMessage);
    }
  }
  const {
    appConfig
  } = global;
  const ageMinSeconds = appConfig.starsSuggestedPostAgeMin;
  const isAdmin = chat ? Boolean((0,_global_selectors__WEBPACK_IMPORTED_MODULE_5__.selectIsMonoforumAdmin)(global, message.chatId)) : false;
  return {
    sender,
    chat,
    originalSender,
    ageMinSeconds,
    isAdmin
  };
})(SuggestedPostApproval)));

/***/ },

/***/ "./src/components/middle/message/actions/SuggestedPostBalanceTooLow.tsx"
/*!******************************************************************************!*\
  !*** ./src/components/middle/message/actions/SuggestedPostBalanceTooLow.tsx ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../config */ "./src/config.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");












const SuggestedPostBalanceTooLow = ({
  onClick,
  message,
  sender,
  replyMessageSender,
  replyMessage
}) => {
  const {
    openStarsBalanceModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const handleGetMoreStars = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(e => {
    e.preventDefault();
    e.stopPropagation();
    openStarsBalanceModal({});
  });
  const targetPeer = replyMessageSender || sender;
  const peerTitle = targetPeer && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_3__.getPeerFullTitle)(lang, targetPeer);
  const peerLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_6__.renderPeerLink)(targetPeer?.id, peerTitle || lang('ActionFallbackUser'));
  const currency = replyMessage?.suggestedPostInfo?.price?.currency || _config__WEBPACK_IMPORTED_MODULE_2__.STARS_CURRENCY_CODE;
  const currencyName = currency === _config__WEBPACK_IMPORTED_MODULE_2__.TON_CURRENCY_CODE ? lang('CurrencyTon') : lang('CurrencyStars');
  const buyButtonText = currency === _config__WEBPACK_IMPORTED_MODULE_2__.TON_CURRENCY_CODE ? lang('ButtonTopUpViaFragment') : lang('ButtonBuyStars');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_5__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].contentBox, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].suggestedPostBalanceTooLowBox),
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].suggestedPostBalanceTooLowTitle,
      children: lang('SuggestedPostBalanceTooLow', {
        peer: peerLink,
        currency: currencyName
      }, {
        withNodes: true,
        withMarkdown: true
      })
    }), !message.isOutgoing && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].actionButton,
      onClick: handleGetMoreStars,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_9__["default"], {
        preset: "button"
      }), buyButtonText]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const sender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectSender)(global, message);
  const replyMessage = message.replyInfo?.type === 'message' && message.replyInfo.replyToMsgId ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectChatMessage)(global, message.chatId, message.replyInfo.replyToMsgId) : undefined;
  const replyMessageSender = replyMessage ? (0,_global_selectors__WEBPACK_IMPORTED_MODULE_4__.selectSender)(global, replyMessage) : undefined;
  return {
    sender,
    replyMessageSender,
    replyMessage
  };
})(SuggestedPostBalanceTooLow)));

/***/ },

/***/ "./src/components/middle/message/actions/SuggestedPostRejected.tsx"
/*!*************************************************************************!*\
  !*** ./src/components/middle/message/actions/SuggestedPostRejected.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/peers */ "./src/global/helpers/peers.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers/messageActions */ "./src/components/middle/message/helpers/messageActions.tsx");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ActionMessage.module.scss */ "./src/components/middle/message/ActionMessage.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const SuggestedPostRejected = ({
  message,
  action,
  sender,
  onClick
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const {
    isOutgoing
  } = message;
  const {
    rejectComment
  } = action;
  const senderTitle = sender && (0,_global_helpers_peers__WEBPACK_IMPORTED_MODULE_2__.getPeerTitle)(lang, sender);
  const senderLink = (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__.renderPeerLink)(sender?.id, senderTitle || lang('ActionFallbackUser'));
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].contentBox, _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].suggestedPostRejectedContentBox),
    onClick: onClick,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].suggestedPostRejectedTitle,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
        className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].rejectedIcon,
        name: "close"
      }), (0,_helpers_messageActions__WEBPACK_IMPORTED_MODULE_5__.translateWithYou)(lang, rejectComment ? 'SuggestedPostRejectedWithReason' : 'SuggestedPostRejected', isOutgoing, {
        peer: senderLink
      }, {
        withMarkdown: true
      })]
    }), rejectComment && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: _ActionMessage_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].suggestedPostRejectedComment,
      children: lang('SuggestedPostRejectedComment', {
        comment: rejectComment
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)((global, {
  message
}) => {
  const sender = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectSender)(global, message);
  return {
    sender
  };
})(SuggestedPostRejected)));

/***/ },

/***/ "./src/components/middle/message/helpers/copyOptions.ts"
/*!**************************************************************!*\
  !*** ./src/components/middle/message/helpers/copyOptions.ts ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMessageCopyOptions: () => (/* binding */ getMessageCopyOptions)
/* harmony export */ });
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers/messageSummary */ "./src/global/helpers/messageSummary.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/clipboard */ "./src/util/clipboard.ts");
/* harmony import */ var _util_getMessageIdsForSelectedText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/getMessageIdsForSelectedText */ "./src/util/getMessageIdsForSelectedText.ts");
/* harmony import */ var _util_localization__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../util/localization */ "./src/util/localization/index.ts");
/* harmony import */ var _util_mediaLoader__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../util/mediaLoader */ "./src/util/mediaLoader.ts");
/* harmony import */ var _common_helpers_renderMessageText__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/helpers/renderMessageText */ "./src/components/common/helpers/renderMessageText.ts");









function getMessageCopyOptions(message, statefulContent, href, canCopy, afterEffect, onCopyLink, onCopyMessages, onCopyNumber) {
  const {
    webPage
  } = statefulContent || {};
  const options = [];
  const text = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getMessageText)(message);
  const photo = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getMessagePhoto)(message) || (!(0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getWebPageVideo)(webPage) ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getWebPagePhoto)(webPage) : undefined);
  const contact = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getMessageContact)(message);
  const mediaHash = photo ? (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getPhotoMediaHash)(photo, 'full') : undefined;
  const canImageBeCopied = canCopy && photo && (mediaHash || (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.hasMediaLocalBlobUrl)(photo)) && _util_clipboard__WEBPACK_IMPORTED_MODULE_4__.CLIPBOARD_ITEM_SUPPORTED && !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_SAFARI;
  const selection = window.getSelection();
  if (canImageBeCopied) {
    options.push({
      label: 'lng_context_copy_image',
      icon: 'copy-media',
      handler: () => {
        Promise.resolve(mediaHash ? _util_mediaLoader__WEBPACK_IMPORTED_MODULE_7__.fetch(mediaHash, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMediaFormat.BlobUrl) : photo.blobUrl).then(_util_clipboard__WEBPACK_IMPORTED_MODULE_4__.copyImageToClipboard);
        afterEffect?.();
      }
    });
  }
  if (canCopy && href) {
    options.push({
      label: 'lng_context_copy_link',
      icon: 'copy',
      handler: () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_4__.copyTextToClipboard)(href);
        afterEffect?.();
      }
    });
  } else if (canCopy && text) {
    // Detect if the user has selection in the current message
    const hasSelection = Boolean(selection?.anchorNode?.parentNode && selection.anchorNode.parentNode.closest('.Message .content-inner') && selection.toString().replace(/(?:\r\n|\r|\n)/g, '') !== '' && checkMessageHasSelection(message));
    options.push({
      label: getCopyLabel(hasSelection),
      icon: 'copy',
      handler: () => {
        const messageIds = (0,_util_getMessageIdsForSelectedText__WEBPACK_IMPORTED_MODULE_5__["default"])();
        if (messageIds?.length && onCopyMessages) {
          onCopyMessages(messageIds);
        } else if (hasSelection) {
          document.execCommand('copy');
        } else {
          const clipboardText = (0,_common_helpers_renderMessageText__WEBPACK_IMPORTED_MODULE_8__.renderMessageText)({
            message,
            shouldRenderAsHtml: true
          });
          if (clipboardText) {
            (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_4__.copyHtmlToClipboard)(clipboardText.join(''), (0,_global_helpers_messageSummary__WEBPACK_IMPORTED_MODULE_2__.getMessageTextWithSpoilers)((0,_util_localization__WEBPACK_IMPORTED_MODULE_6__.getTranslationFn)(), message, statefulContent));
          }
        }
        afterEffect?.();
      }
    });
  }
  if (onCopyLink) {
    options.push({
      label: 'lng_context_copy_message_link',
      icon: 'link',
      handler: onCopyLink
    });
  }
  if (contact && onCopyNumber) {
    options.push({
      label: 'lng_profile_copy_phone',
      icon: 'copy',
      handler: () => {
        onCopyNumber();
        afterEffect?.();
      }
    });
  }
  return options;
}
function checkMessageHasSelection(message) {
  const selection = window.getSelection();
  const selectionParentNode = selection?.anchorNode?.parentNode;
  const selectedMessageElement = selectionParentNode?.closest('.Message.message-list-item');
  return (0,_global_helpers__WEBPACK_IMPORTED_MODULE_1__.getMessageHtmlId)(message.id) === selectedMessageElement?.id;
}
function getCopyLabel(hasSelection) {
  if (hasSelection) {
    return 'lng_context_copy_selected';
  }
  return 'lng_context_copy_text';
}

/***/ },

/***/ "./src/components/middle/message/helpers/getSelectionAsFormattedText.ts"
/*!******************************************************************************!*\
  !*** ./src/components/middle/message/helpers/getSelectionAsFormattedText.ts ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSelectionAsFormattedText: () => (/* binding */ getSelectionAsFormattedText)
/* harmony export */ });
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _util_parseHtmlAsFormattedText__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/parseHtmlAsFormattedText */ "./src/util/parseHtmlAsFormattedText.ts");


const div = document.createElement('div');
const ALLOWED_QUOTE_ENTITIES = new Set([_api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Bold, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Italic, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Underline, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Strike, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Spoiler, _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.CustomEmoji]);
function getSelectionAsFormattedText(range) {
  const html = getSelectionAsHtml(range);
  const formattedText = (0,_util_parseHtmlAsFormattedText__WEBPACK_IMPORTED_MODULE_1__["default"])(html, false, true);
  return stripEntitiesForQuote(formattedText);
}
function getSelectionAsHtml(range) {
  const clonedSelection = range.cloneContents();
  div.appendChild(clonedSelection);
  const html = wrapHtmlWithMarkupTags(range, div.innerHTML);
  div.innerHTML = '';
  return html.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/gi, ' ') // Convert nbsp's to spaces
  .replace(/\u00a0/gi, ' ');
}
function stripEntitiesForQuote(text) {
  if (!text.entities) return text;
  const entities = text.entities.filter(entity => ALLOWED_QUOTE_ENTITIES.has(entity.type));
  return {
    ...text,
    entities: entities.length ? entities : undefined
  };
}
function wrapHtmlWithMarkupTags(range, html) {
  const container = range.commonAncestorContainer;
  if (container.nodeType === Node.ELEMENT_NODE && container.classList.contains('text-content')) {
    return html;
  }
  let currentElement = range.commonAncestorContainer.parentElement;
  while (currentElement && !currentElement.classList.contains('text-content')) {
    const tag = currentElement.tagName.toLowerCase();
    const entityType = currentElement.dataset.entityType;
    html = `<${tag} ${entityType ? `data-entity-type="${entityType}"` : ''}>${html}</${tag}>`;
    currentElement = currentElement.parentElement;
  }
  return html;
}

/***/ },

/***/ "./src/components/middle/message/helpers/isSelectionRangeInsideMessage.ts"
/*!********************************************************************************!*\
  !*** ./src/components/middle/message/helpers/isSelectionRangeInsideMessage.ts ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isSelectionRangeInsideMessage: () => (/* binding */ isSelectionRangeInsideMessage)
/* harmony export */ });
function isSelectionRangeInsideMessage(range) {
  const ancestor = range.commonAncestorContainer;
  const el = ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentNode : ancestor;
  return Boolean(el.closest('.message-content-wrapper .text-content')) && !(Boolean(el.closest('.EmbeddedMessage')) || Boolean(el.closest('.WebPage')));
}

/***/ },

/***/ "./src/components/middle/message/hooks/useFluidBackgroundFilter.tsx"
/*!**************************************************************************!*\
  !*** ./src/components/middle/message/hooks/useFluidBackgroundFilter.tsx ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useFluidBackgroundFilter)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../config */ "./src/config.ts");
/* harmony import */ var _util_svgController__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../util/svgController */ "./src/util/svgController.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const SVG_MAP = new Map();
class SvgFluidBackgroundFilter {
  referenceCount = 0;
  constructor(color) {
    this.color = color;
    this.filterId = `fluid-background-filter-${color.slice(1)}`;
    (0,_util_svgController__WEBPACK_IMPORTED_MODULE_2__.addSvgDefinition)((0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("filter", {
      "color-interpolation-filters": "sRGB",
      xmlns: _config__WEBPACK_IMPORTED_MODULE_1__.SVG_NAMESPACE,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("feGaussianBlur", {
        in: "SourceAlpha",
        stdDeviation: "4",
        result: "blur"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("feColorMatrix", {
        in: "blur",
        mode: "matrix",
        values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15",
        result: "goo"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("feComposite", {
        in: "SourceAlpha",
        in2: "goo",
        operator: "over",
        result: "outline"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("feFlood", {
        "flood-color": color,
        result: "color"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("feComposite", {
        in: "color",
        in2: "outline",
        operator: "in"
      })]
    }), this.filterId);
  }
  getFilterId() {
    this.referenceCount += 1;
    return this.filterId;
  }
  removeReference() {
    this.referenceCount -= 1;
    if (this.referenceCount === 0) {
      (0,_util_svgController__WEBPACK_IMPORTED_MODULE_2__.removeSvgDefinition)(this.filterId);
    }
  }
  isUsed() {
    return this.referenceCount > 0;
  }
}
function useFluidBackgroundFilter(color, asValue) {
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!color) return undefined;
    return () => {
      const colorFilter = SVG_MAP.get(color);
      if (colorFilter) {
        colorFilter.removeReference();
        if (!colorFilter.isUsed()) {
          SVG_MAP.delete(colorFilter.color);
        }
      }
    };
  }, [color]);
  if (!color) return undefined;
  if (SVG_MAP.has(color)) {
    const svg = SVG_MAP.get(color);
    return prepareStyle(svg.getFilterId(), asValue);
  }
  const svg = new SvgFluidBackgroundFilter(color);
  SVG_MAP.set(color, svg);
  return prepareStyle(svg.getFilterId(), asValue);
}
function prepareStyle(filterId, asValue) {
  if (asValue) {
    return `url(#${filterId})`;
  }
  return `filter: url(#${filterId});`;
}

/***/ },

/***/ "./src/components/middle/message/hooks/useFocusMessageListElement.ts"
/*!***************************************************************************!*\
  !*** ./src/components/middle/message/hooks/useFocusMessageListElement.ts ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useFocusMessageListElement)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_teact_teact_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../lib/teact/teact-dom */ "./src/lib/teact/teact-dom.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../config */ "./src/config.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_animateScroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/animateScroll */ "./src/util/animateScroll.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _helpers_messageListReflow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../helpers/messageListReflow */ "./src/components/middle/helpers/messageListReflow.ts");








// This is used when the viewport was replaced.
const BOTTOM_FOCUS_OFFSET = 500;
const RELOCATED_FOCUS_OFFSET = _config__WEBPACK_IMPORTED_MODULE_2__.SCROLL_MAX_DISTANCE;
const FOCUS_MARGIN = 1.25 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM;
const BOTTOM_FOCUS_MARGIN = 0.5 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM;
function useFocusMessageListElement({
  elementRef,
  isFocused,
  focusDirection,
  noFocusHighlight,
  isResizingContainer,
  isJustAdded,
  isQuote,
  scrollTargetPosition
}) {
  const isRelocatedRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(!isJustAdded);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const isRelocated = isRelocatedRef.current;
    isRelocatedRef.current = false;
    if (isFocused && elementRef.current) {
      const messagesContainer = elementRef.current.closest('.MessageList');
      if (!messagesContainer) return;

      // `noFocusHighlight` is always called with “scroll-to-bottom” buttons
      const isToBottom = noFocusHighlight;
      const scrollPosition = scrollTargetPosition || (isToBottom ? 'end' : 'centerOrTop');
      const exec = () => {
        const maxDistance = focusDirection !== undefined ? isToBottom ? BOTTOM_FOCUS_OFFSET : RELOCATED_FOCUS_OFFSET : undefined;
        const result = (0,_util_animateScroll__WEBPACK_IMPORTED_MODULE_4__["default"])({
          container: messagesContainer,
          element: elementRef.current,
          position: scrollPosition,
          margin: isToBottom ? BOTTOM_FOCUS_MARGIN : FOCUS_MARGIN,
          maxDistance,
          forceDirection: focusDirection,
          forceNormalContainerHeight: isResizingContainer,
          shouldReturnMutationFn: true
        });
        if (isQuote) {
          const firstQuote = elementRef.current.querySelector('.is-quote');
          if (firstQuote) {
            (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__.requestMutation)(() => {
              (0,_lib_teact_teact_dom__WEBPACK_IMPORTED_MODULE_1__.addExtraClass)(firstQuote, 'animate');
            });
          }
        }
        return result;
      };
      if (isRelocated) {
        // We need this to override scroll setting from Message List layout effect
        (0,_helpers_messageListReflow__WEBPACK_IMPORTED_MODULE_6__.requestAfterMessageListReflow)(exec);
      } else {
        (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__.requestMeasure)(() => {
          (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_3__.requestMutation)(exec());
        });
      }
    }
  }, [elementRef, isFocused, focusDirection, noFocusHighlight, isResizingContainer, isQuote, scrollTargetPosition]);
}

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionButton.tsx"
/*!********************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionButton.tsx ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_textFormat__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/textFormat */ "./src/util/textFormat.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_data_useSelector__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/data/useSelector */ "./src/hooks/data/useSelector.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../hooks/useEffectWithPrevDeps */ "./src/hooks/useEffectWithPrevDeps.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_usePrevious__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../hooks/usePrevious */ "./src/hooks/usePrevious.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../common/AnimatedCounter */ "./src/components/common/AnimatedCounter.tsx");
/* harmony import */ var _common_AvatarList__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../common/AvatarList */ "./src/components/common/AvatarList.tsx");
/* harmony import */ var _common_reactions_PaidReactionEmoji__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../common/reactions/PaidReactionEmoji */ "./src/components/common/reactions/PaidReactionEmoji.tsx");
/* harmony import */ var _common_reactions_ReactionAnimatedEmoji__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../common/reactions/ReactionAnimatedEmoji */ "./src/components/common/reactions/ReactionAnimatedEmoji.tsx");
/* harmony import */ var _common_Sparkles__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../common/Sparkles */ "./src/components/common/Sparkles.tsx");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./ReactionButton.module.scss */ "./src/components/middle/message/reactions/ReactionButton.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





















const REACTION_SIZE = 1.25 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM;
const MAX_SCALE = 3;
function selectStarsState(global) {
  return global.stars;
}
const ReactionButton = ({
  reaction,
  containerId,
  isOwnMessage,
  recentReactors,
  className,
  chosenClassName,
  chatId,
  messageId,
  isOutside,
  observeIntersection,
  onClick,
  onPaidClick
}) => {
  const {
    openStarsBalanceModal,
    resetLocalPaidReactions,
    openPaidReactionModal,
    requestWave
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const counterRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const animationRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_9__["default"])();
  const isPaid = reaction.reaction.type === 'paid';
  const starsState = (0,_hooks_data_useSelector__WEBPACK_IMPORTED_MODULE_6__["default"])(selectStarsState);
  const areStarsLoaded = Boolean(starsState);
  const handlePaidClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_10__["default"])((count = 1) => {
    onPaidClick?.(count);
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_10__["default"])(e => {
    if (reaction.reaction.type === 'paid') {
      e.stopPropagation(); // Prevent default message double click behavior
      handlePaidClick();
      return;
    }
    onClick?.(reaction.reaction);
  });
  const {
    isContextMenuOpen,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_7__["default"])(ref, reaction.reaction.type !== 'paid', undefined, undefined, undefined, true);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isContextMenuOpen) {
      openPaidReactionModal({
        chatId,
        messageId
      });
      handleContextMenuClose();
      handleContextMenuHide();
    }
  }, [handleContextMenuClose, handleContextMenuHide, isContextMenuOpen, chatId, messageId]);
  (0,_hooks_useEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_8__["default"])(([prevReaction]) => {
    const amount = reaction.localAmount;
    const button = ref.current;
    if (!amount || !button || amount === prevReaction?.localAmount) return;
    if (areStarsLoaded && amount > starsState.balance.amount) {
      openStarsBalanceModal({
        originReaction: {
          chatId,
          messageId,
          amount
        }
      });
      resetLocalPaidReactions({
        chatId,
        messageId
      });
      return;
    }
    if (reaction.localAmount) {
      const {
        left,
        top
      } = button.getBoundingClientRect();
      const startX = left + button.offsetWidth / 2;
      const startY = top + button.offsetHeight / 2;
      requestWave({
        startX,
        startY
      });
    }
    const currentScale = Number(getComputedStyle(button).scale) || 1;
    animationRef.current?.cancel();
    // Animate scaling by 20%, and then returning to 1
    animationRef.current = button.animate([{
      scale: currentScale
    }, {
      scale: Math.min(currentScale * 1.2, MAX_SCALE),
      offset: 0.2
    }, {
      scale: 1
    }], {
      duration: 500 * currentScale,
      easing: 'ease-out'
    });
  }, [reaction, starsState?.balance, areStarsLoaded, chatId, messageId]);
  const prevAmount = (0,_hooks_usePrevious__WEBPACK_IMPORTED_MODULE_11__["default"])(reaction.localAmount);
  const {
    shouldRender: shouldRenderPaidCounter
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_12__["default"])({
    isOpen: Boolean(reaction.localAmount),
    ref: counterRef,
    className: 'slow',
    withShouldRender: true
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)(_ui_Button__WEBPACK_IMPORTED_MODULE_18__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].root, isOwnMessage && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].own, isPaid && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].paid, isOutside && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].outside, (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isReactionChosen)(reaction) && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].chosen, (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isReactionChosen)(reaction) && chosenClassName, className),
    size: "tiny",
    ref: ref,
    onMouseDown: handleBeforeContextMenu,
    onContextMenu: handleContextMenu,
    onClick: handleClick,
    children: [reaction.reaction.type === 'paid' ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.Fragment, {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_Sparkles__WEBPACK_IMPORTED_MODULE_17__["default"], {
        preset: "button"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_reactions_PaidReactionEmoji__WEBPACK_IMPORTED_MODULE_15__["default"], {
        className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].animatedEmoji,
        containerId: containerId,
        reaction: reaction.reaction,
        size: REACTION_SIZE,
        localAmount: reaction.localAmount,
        observeIntersection: observeIntersection
      }), shouldRenderPaidCounter && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_13__["default"], {
        ref: counterRef,
        text: `+${(0,_util_textFormat__WEBPACK_IMPORTED_MODULE_4__.formatIntegerCompact)(lang, reaction.localAmount || prevAmount)}`,
        className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].paidCounter
      })]
    }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_reactions_ReactionAnimatedEmoji__WEBPACK_IMPORTED_MODULE_16__["default"], {
      className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].animatedEmoji,
      containerId: containerId,
      reaction: reaction.reaction,
      size: REACTION_SIZE,
      observeIntersection: observeIntersection
    }), recentReactors?.length ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_AvatarList__WEBPACK_IMPORTED_MODULE_14__["default"], {
      size: "mini",
      peers: recentReactors
    }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_13__["default"], {
      text: (0,_util_textFormat__WEBPACK_IMPORTED_MODULE_4__.formatIntegerCompact)(lang, reaction.count + (reaction.localAmount || 0)),
      className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_19__["default"].counter
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReactionButton));

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionSelector.tsx"
/*!**********************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionSelector.tsx ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ui_Link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../ui/Link */ "./src/components/ui/Link.tsx");
/* harmony import */ var _ReactionSelectorCustomReaction__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ReactionSelectorCustomReaction */ "./src/components/middle/message/reactions/ReactionSelectorCustomReaction.tsx");
/* harmony import */ var _ReactionSelectorReaction__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ReactionSelectorReaction */ "./src/components/middle/message/reactions/ReactionSelectorReaction.tsx");
/* harmony import */ var _ReactionSelector_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ReactionSelector.scss */ "./src/components/middle/message/reactions/ReactionSelector.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");












const cn = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__.createClassNameBuilder)('ReactionSelector');
const REACTIONS_AMOUNT = 7;
const FADE_IN_DELAY = 20;
const ReactionSelector = ({
  allAvailableReactions,
  topReactions,
  defaultTagReactions,
  enabledReactions,
  currentReactions,
  reactionsLimit,
  isPrivate,
  isReady,
  canPlayAnimatedEmojis,
  className,
  isCurrentUserPremium,
  isInSavedMessages,
  isInStoryViewer,
  isForEffects,
  effectReactions,
  isWithPaidReaction,
  onClose,
  onToggleReaction,
  onSendPaidReaction,
  onShowPaidReactionModal,
  onShowMore
}) => {
  const {
    openPremiumModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const areReactionsLocked = isInSavedMessages && !isCurrentUserPremium && !isInStoryViewer;
  const shouldUseCurrentReactions = Boolean(reactionsLimit && currentReactions && currentReactions.length >= reactionsLimit);
  const availableReactions = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const reactions = (() => {
      if (shouldUseCurrentReactions) return currentReactions?.map(reaction => reaction.reaction);
      if (isForEffects) return effectReactions;
      if (isInSavedMessages) return defaultTagReactions;
      if (enabledReactions?.type === 'some') return enabledReactions.allowed;
      return allAvailableReactions?.map(reaction => reaction.reaction);
    })();
    const filteredReactions = reactions?.map(reaction => {
      const isCustomReaction = reaction.type === 'custom';
      const availableReaction = allAvailableReactions?.find(r => (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isSameReaction)(r.reaction, reaction));
      if (isForEffects) return availableReaction;
      if (!isCustomReaction && !availableReaction || availableReaction?.isInactive) return undefined;
      if (!isPrivate && !shouldUseCurrentReactions && (!enabledReactions || !(0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.canSendReaction)(reaction, enabledReactions))) {
        return undefined;
      }
      return isCustomReaction ? reaction : availableReaction;
    }).filter(Boolean) || [];
    const sortedReactions = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.sortReactions)(filteredReactions, topReactions);
    if (isWithPaidReaction) {
      sortedReactions.unshift({
        type: 'paid'
      });
    }
    return sortedReactions;
  }, [allAvailableReactions, currentReactions, defaultTagReactions, enabledReactions, isInSavedMessages, isPrivate, topReactions, isForEffects, effectReactions, shouldUseCurrentReactions, isWithPaidReaction]);
  const reactionsToRender = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    // Component can fit one more if we do not need show more button
    return availableReactions.length === REACTIONS_AMOUNT + 1 ? availableReactions : availableReactions.slice(0, REACTIONS_AMOUNT);
  }, [availableReactions]);
  const withMoreButton = reactionsToRender.length < availableReactions.length;
  const userReactionIndexes = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const chosenReactions = currentReactions?.filter(({
      chosenOrder
    }) => chosenOrder !== undefined) || [];
    return new Set(chosenReactions.map(({
      reaction
    }) => reactionsToRender.findIndex(r => r && (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isSameReaction)('reaction' in r ? r.reaction : r, reaction))));
  }, [currentReactions, reactionsToRender]);
  const handleShowMoreClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    const bound = ref.current?.getBoundingClientRect() || {
      x: 0,
      y: 0
    };
    onShowMore({
      x: bound.x,
      y: bound.y
    });
  });
  const handleOpenPremiumModal = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    onClose?.();
    openPremiumModal({
      initialSection: 'saved_tags'
    });
  });
  const hintText = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (isInSavedMessages) {
      if (!isCurrentUserPremium) {
        const text = lang('lng_subscribe_tag_about');
        const parts = text.split('{link}');
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
          children: [parts[0], (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ui_Link__WEBPACK_IMPORTED_MODULE_7__["default"], {
            isPrimary: true,
            onClick: handleOpenPremiumModal,
            children: lang('lng_subscribe_tag_link')
          }), parts[1]]
        });
      }
      return lang('SavedTagReactionsHint2');
    }
    if (isInStoryViewer) {
      return lang('StoryReactionsHint');
    }
    if (isForEffects) {
      return lang('AddEffectMessageHint');
    }
    return undefined;
  }, [isCurrentUserPremium, isInSavedMessages, isInStoryViewer, lang, isForEffects]);
  if (!reactionsToRender.length) return undefined;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(cn('&'), className),
    ref: ref,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: cn('bubble-small', lang.isRtl && 'isRtl')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: cn('items-wrapper'),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: cn('bubble-big', lang.isRtl && 'isRtl')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: cn('items'),
        children: [hintText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
          className: cn('hint'),
          children: hintText
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
          className: cn('reactions'),
          dir: lang.isRtl ? 'rtl' : undefined,
          children: [reactionsToRender.map((reaction, i) => 'reaction' in reaction ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ReactionSelectorReaction__WEBPACK_IMPORTED_MODULE_9__["default"], {
            isReady: isReady,
            onToggleReaction: onToggleReaction,
            reaction: reaction,
            noAppearAnimation: !canPlayAnimatedEmojis,
            chosen: userReactionIndexes.has(i),
            isLocked: areReactionsLocked
          }, (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getReactionKey)(reaction.reaction)) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ReactionSelectorCustomReaction__WEBPACK_IMPORTED_MODULE_8__["default"], {
            isReady: isReady,
            onToggleReaction: onToggleReaction,
            onSendPaidReaction: onSendPaidReaction,
            onShowPaidReactionModal: onShowPaidReactionModal,
            reaction: reaction,
            noAppearAnimation: !canPlayAnimatedEmojis,
            chosen: userReactionIndexes.has(i),
            isLocked: areReactionsLocked,
            style: `--_animation-delay: ${(REACTIONS_AMOUNT - i) * FADE_IN_DELAY}ms`
          }, (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getReactionKey)(reaction))), withMoreButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_6__["default"], {
            color: "translucent",
            className: cn('show-more'),
            onClick: handleShowMoreClick,
            iconName: "down"
          })]
        })]
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReactionSelector));

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionSelectorCustomReaction.tsx"
/*!************************************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionSelectorCustomReaction.tsx ***!
  \************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/helpers/animatedAssets */ "./src/components/common/helpers/animatedAssets.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_AnimatedIcon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../common/AnimatedIcon */ "./src/components/common/AnimatedIcon.tsx");
/* harmony import */ var _common_CustomEmoji__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../common/CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ReactionSelectorReaction.module.scss */ "./src/components/middle/message/reactions/ReactionSelectorReaction.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const REACTION_SIZE = 2 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
const ReactionSelectorCustomReaction = ({
  reaction,
  chosen,
  isReady,
  noAppearAnimation,
  style,
  isLocked,
  onToggleReaction,
  onSendPaidReaction,
  onShowPaidReactionModal
}) => {
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(() => {
    if (reaction.type === 'paid') {
      onSendPaidReaction?.();
      return;
    }
    onToggleReaction(reaction);
  });
  const {
    isContextMenuOpen,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_4__["default"])(ref, reaction.type !== 'paid', undefined, undefined, undefined, true);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isContextMenuOpen) {
      onShowPaidReactionModal?.();
      handleContextMenuClose();
      handleContextMenuHide();
    }
  }, [handleContextMenuClose, onShowPaidReactionModal, handleContextMenuHide, isContextMenuOpen]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].root, _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].custom, chosen && reaction.type !== 'paid' && _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].chosen, !noAppearAnimation && isReady && _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].customAnimated, noAppearAnimation && _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].visible),
    ref: ref,
    style: style,
    onClick: handleClick,
    onMouseDown: handleBeforeContextMenu,
    onContextMenu: handleContextMenu,
    children: [reaction.type === 'paid' ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_AnimatedIcon__WEBPACK_IMPORTED_MODULE_6__["default"], {
      tgsUrl: _common_helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__.LOCAL_TGS_URLS.StarReaction,
      size: REACTION_SIZE,
      noLoop: false
    }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_CustomEmoji__WEBPACK_IMPORTED_MODULE_7__["default"], {
      documentId: reaction.documentId,
      size: REACTION_SIZE
    }), isLocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
      className: _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].lock,
      name: "lock-badge"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReactionSelectorCustomReaction));

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionSelectorReaction.tsx"
/*!******************************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionSelectorReaction.tsx ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useMedia */ "./src/hooks/useMedia.ts");
/* harmony import */ var _common_AnimatedSticker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/AnimatedSticker */ "./src/components/common/AnimatedSticker.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ReactionSelectorReaction.module.scss */ "./src/components/middle/message/reactions/ReactionSelectorReaction.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const REACTION_SIZE = 2 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_2__.REM;
const ReactionSelectorReaction = ({
  reaction,
  isReady,
  noAppearAnimation,
  chosen,
  isLocked,
  onToggleReaction
}) => {
  const mediaAppearData = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__["default"])(`sticker${reaction.appearAnimation?.id}`, !isReady || noAppearAnimation);
  const mediaData = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__["default"])(`document${reaction.selectAnimation?.id}`, !isReady || noAppearAnimation);
  const staticIconData = (0,_hooks_useMedia__WEBPACK_IMPORTED_MODULE_4__["default"])(`document${reaction.staticIcon?.id}`, !noAppearAnimation);
  const [isAnimationLoaded, markAnimationLoaded] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const [isFirstPlay,, unmarkIsFirstPlay] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__["default"])(true);
  const [isActivated, activate, deactivate] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__["default"])();
  function handleClick() {
    onToggleReaction(reaction.reaction);
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].root, chosen && _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].chosen),
    onClick: handleClick,
    onMouseEnter: isReady && !isFirstPlay ? activate : undefined,
    children: [noAppearAnimation && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("img", {
      className: _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].staticIcon,
      src: staticIconData,
      alt: reaction.reaction.emoticon,
      draggable: false
    }), !isAnimationLoaded && !noAppearAnimation && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_AnimatedSticker__WEBPACK_IMPORTED_MODULE_5__["default"], {
      tgsUrl: mediaAppearData,
      play: isFirstPlay,
      noLoop: true,
      size: REACTION_SIZE,
      onEnded: unmarkIsFirstPlay,
      forceAlways: true
    }, reaction.appearAnimation?.id), !isFirstPlay && !noAppearAnimation && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_AnimatedSticker__WEBPACK_IMPORTED_MODULE_5__["default"], {
      tgsUrl: mediaData,
      play: isActivated,
      noLoop: true,
      size: REACTION_SIZE,
      onLoad: markAnimationLoaded,
      onEnded: deactivate,
      forceAlways: true
    }, reaction.selectAnimation?.id), isLocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
      className: _ReactionSelectorReaction_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].lock,
      name: "lock-badge"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ReactionSelectorReaction));

/***/ },

/***/ "./src/components/middle/message/reactions/Reactions.tsx"
/*!***************************************************************!*\
  !*** ./src/components/middle/message/reactions/Reactions.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_keys_messageKey__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../util/keys/messageKey */ "./src/util/keys/messageKey.ts");
/* harmony import */ var _hooks_useEffectOnce__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useEffectOnce */ "./src/hooks/useEffectOnce.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ReactionButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ReactionButton */ "./src/components/middle/message/reactions/ReactionButton.tsx");
/* harmony import */ var _SavedTagButton__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SavedTagButton */ "./src/components/middle/message/reactions/SavedTagButton.tsx");
/* harmony import */ var _Reactions_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Reactions.scss */ "./src/components/middle/message/reactions/Reactions.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");













const MAX_RECENT_AVATARS = 3;
const PAID_SEND_DELAY = 5000;
const Reactions = ({
  message,
  threadId,
  isOutside,
  maxWidth,
  metaChildren,
  observeIntersection,
  noRecentReactors,
  isCurrentUserPremium,
  tags,
  isAccountFrozen
}) => {
  const {
    toggleReaction,
    addLocalPaidReaction,
    updateMiddleSearch,
    performMiddleSearch,
    openPremiumModal,
    resetLocalPaidReactions,
    showNotification,
    openFrozenAccountModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const {
    results,
    areTags,
    recentReactions
  } = message.reactions;
  const withServiceReactions = Boolean(message.areReactionsPossible && message.reactions);
  const totalCount = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => results.reduce((acc, reaction) => acc + reaction.count, 0), [results]);
  const recentReactorsByReactionKey = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const global = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getGlobal)();
    return recentReactions?.reduce((acc, recentReaction) => {
      const {
        reaction,
        peerId
      } = recentReaction;
      const key = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getReactionKey)(reaction);
      const peer = (0,_global_selectors__WEBPACK_IMPORTED_MODULE_3__.selectPeer)(global, peerId);
      if (!peer) return acc;
      const peers = acc[key] || [];
      peers.push(peer);
      acc[key] = peers;
      return acc;
    }, {});
  }, [recentReactions]);
  const props = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const messageKey = (0,_util_keys_messageKey__WEBPACK_IMPORTED_MODULE_5__.getMessageKey)(message);
    return results.map(reaction => {
      const reactionKey = (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getReactionKey)(reaction.reaction);
      const recentReactors = recentReactorsByReactionKey?.[reactionKey];
      const shouldHideRecentReactors = totalCount > MAX_RECENT_AVATARS || noRecentReactors;
      const tag = areTags ? tags?.[reactionKey] : undefined;
      return {
        reaction,
        reactionKey,
        messageKey,
        recentReactors: !shouldHideRecentReactors ? recentReactors : undefined,
        isChosen: (0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.isReactionChosen)(reaction),
        tag
      };
    });
  }, [message, noRecentReactors, recentReactorsByReactionKey, results, areTags, tags, totalCount]);
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(reaction => {
    if (isAccountFrozen) {
      openFrozenAccountModal();
      return;
    }
    if (areTags) {
      if (!isCurrentUserPremium) {
        openPremiumModal({
          initialSection: 'saved_tags'
        });
        return;
      }
      updateMiddleSearch({
        chatId: message.chatId,
        threadId,
        update: {
          savedTag: reaction
        }
      });
      performMiddleSearch({
        chatId: message.chatId,
        threadId
      });
      return;
    }
    toggleReaction({
      chatId: message.chatId,
      messageId: message.id,
      reaction
    });
  });
  const paidLocalCount = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => results.find(r => r.reaction.type === 'paid')?.localAmount || 0, [results]);
  const handlePaidClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(count => {
    if (isAccountFrozen) {
      openFrozenAccountModal();
      return;
    }
    addLocalPaidReaction({
      chatId: message.chatId,
      messageId: message.id,
      count
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!paidLocalCount) return;
    showNotification({
      localId: (0,_util_keys_messageKey__WEBPACK_IMPORTED_MODULE_5__.getMessageKey)(message),
      title: lang('StarsSentTitle'),
      message: lang('StarsSentText', paidLocalCount),
      actionText: lang('StarsSentUndo'),
      cacheBreaker: paidLocalCount.toString(),
      action: {
        action: 'resetLocalPaidReactions',
        payload: {
          chatId: message.chatId,
          messageId: message.id
        }
      },
      dismissAction: {
        action: 'sendPaidReaction',
        payload: {
          chatId: message.chatId,
          messageId: message.id
        }
      },
      duration: PAID_SEND_DELAY,
      shouldShowTimer: true,
      disableClickDismiss: true,
      icon: 'star'
    });
  }, [lang, message, paidLocalCount]);
  const handleRemoveReaction = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(reaction => {
    if (isAccountFrozen) {
      openFrozenAccountModal();
      return;
    }
    toggleReaction({
      chatId: message.chatId,
      messageId: message.id,
      reaction
    });
  });

  // Reset paid reactions on unmount
  (0,_hooks_useEffectOnce__WEBPACK_IMPORTED_MODULE_6__["default"])(() => () => {
    resetLocalPaidReactions({
      chatId: message.chatId,
      messageId: message.id
    });
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])('Reactions', isOutside && 'is-outside', withServiceReactions && 'is-service'),
    style: maxWidth ? `max-width: ${maxWidth}px` : undefined,
    dir: lang.isRtl ? 'rtl' : 'ltr',
    children: [props.map(({
      reaction,
      recentReactors,
      messageKey,
      reactionKey,
      isChosen,
      tag
    }) => areTags ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_SavedTagButton__WEBPACK_IMPORTED_MODULE_10__["default"], {
      className: "message-reaction",
      chosenClassName: "chosen",
      containerId: messageKey,
      isOwnMessage: message.isOutgoing,
      isChosen: isChosen,
      reaction: reaction.reaction,
      tag: tag,
      withContextMenu: isCurrentUserPremium,
      onClick: handleClick,
      onRemove: handleRemoveReaction,
      observeIntersection: observeIntersection
    }, reactionKey) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_ReactionButton__WEBPACK_IMPORTED_MODULE_9__["default"], {
      chatId: message.chatId,
      messageId: message.id,
      className: "message-reaction",
      chosenClassName: "chosen",
      containerId: messageKey,
      isOwnMessage: message.isOutgoing,
      recentReactors: recentReactors,
      isOutside: isOutside,
      reaction: reaction,
      onClick: handleClick,
      onPaidClick: handlePaidClick,
      observeIntersection: observeIntersection
    }, reactionKey)), metaChildren]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Reactions));

/***/ },

/***/ "./src/components/middle/message/reactions/SavedTagButton.tsx"
/*!********************************************************************!*\
  !*** ./src/components/middle/message/reactions/SavedTagButton.tsx ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../global */ "./src/global/index.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_reactions_ReactionAnimatedEmoji__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/reactions/ReactionAnimatedEmoji */ "./src/components/common/reactions/ReactionAnimatedEmoji.tsx");
/* harmony import */ var _modals_prompt_PromptDialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../modals/prompt/PromptDialog */ "./src/components/modals/prompt/PromptDialog.tsx");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ui_Menu__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../ui/Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _ui_MenuItem__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../ui/MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ReactionButton.module.scss */ "./src/components/middle/message/reactions/ReactionButton.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");















const REACTION_SIZE = 1.25 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
const TITLE_MAX_LENGTH = 15;
const LOOP_LIMIT = 1;
const SavedTagButton = ({
  reaction,
  tag,
  containerId,
  isChosen,
  isOwnMessage,
  className,
  chosenClassName,
  withCount,
  isDisabled,
  withContextMenu,
  observeIntersection,
  onClick,
  onRemove
}) => {
  const {
    editSavedReactionTag
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const menuRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const [isRenamePromptOpen, openRenamePrompt, closeRenamePrompt] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    title,
    count
  } = tag || {};
  const hasText = Boolean(title || withCount && count);
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    onClick?.(reaction);
  });
  const handleRemoveClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    onRemove?.(reaction);
  });
  const handleRenameTag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(newTitle => {
    editSavedReactionTag({
      reaction,
      title: newTitle
    });
    closeRenamePrompt();
  });
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_4__["default"])(ref, !withContextMenu, undefined, undefined, undefined, true);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ref.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => menuRef.current);
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ({
    withPortal: true,
    shouldAvoidNegativePosition: true
  }));
  if (withCount && count === 0) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_ui_Button__WEBPACK_IMPORTED_MODULE_10__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].root, _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].tag, isOwnMessage && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].own, isChosen && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].chosen, isChosen && chosenClassName, isDisabled && _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].disabled, className),
    size: "tiny",
    onClick: handleClick,
    onMouseDown: handleBeforeContextMenu,
    onContextMenu: handleContextMenu,
    ref: ref,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_common_reactions_ReactionAnimatedEmoji__WEBPACK_IMPORTED_MODULE_8__["default"], {
      className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].animatedEmoji,
      containerId: containerId,
      reaction: reaction,
      loopLimit: LOOP_LIMIT,
      size: REACTION_SIZE,
      observeIntersection: observeIntersection
    }), hasText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("span", {
      className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].tagText,
      children: [title && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
        children: title
      }), withCount && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
        children: count
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("svg", {
      className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].tail,
      width: "15",
      height: "30",
      viewBox: "0 0 15 30",
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("path", {
        className: _ReactionButton_module_scss__WEBPACK_IMPORTED_MODULE_13__["default"].tailFill,
        d: "m 0,30 c 3.1855,0 6.1803,-1.5176 8.0641,-4.0864 l 5.835,-7.9568 c 1.2906,-1.7599 1.2906,-4.1537 0,-5.9136 L 8.0641,4.08636 C 6.1803,1.51761 3.1855,0 0,0"
      })
    }), withContextMenu && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_modals_prompt_PromptDialog__WEBPACK_IMPORTED_MODULE_9__["default"], {
      isOpen: isRenamePromptOpen,
      maxLength: TITLE_MAX_LENGTH,
      title: lang(tag?.title ? 'SavedTagRenameTag' : 'SavedTagLabelTag'),
      subtitle: lang('SavedTagLabelTagText'),
      placeholder: lang('SavedTagLabelPlaceholder'),
      initialValue: tag?.title,
      onClose: closeRenamePrompt,
      onSubmit: handleRenameTag
    }), withContextMenu && contextMenuAnchor && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_ui_Menu__WEBPACK_IMPORTED_MODULE_11__["default"], {
      ref: menuRef,
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      autoClose: true,
      withPortal: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_12__["default"], {
        icon: "tag-filter",
        onClick: handleClick,
        children: lang('SavedTagFilterByTag')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_12__["default"], {
        icon: "tag-name",
        onClick: openRenamePrompt,
        children: lang(tag?.title ? 'SavedTagRenameTag' : 'SavedTagLabelTag')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_ui_MenuItem__WEBPACK_IMPORTED_MODULE_12__["default"], {
        icon: "tag-crossed",
        destructive: true,
        onClick: handleRemoveClick,
        children: lang('SavedTagRemoveTag')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SavedTagButton));

/***/ },

/***/ "./src/components/modals/prompt/PromptDialog.tsx"
/*!*******************************************************!*\
  !*** ./src/components/modals/prompt/PromptDialog.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ui_InputText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../ui/InputText */ "./src/components/ui/InputText.tsx");
/* harmony import */ var _ui_Modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../ui/Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _PromptDialog_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./PromptDialog.module.scss */ "./src/components/modals/prompt/PromptDialog.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");








const PromptDialog = ({
  isOpen,
  title,
  subtitle,
  placeholder,
  submitText,
  maxLength,
  initialValue = '',
  onClose,
  onSubmit
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const [text, setText] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(initialValue);
  const handleTextChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(e => {
    setText(e.target.value);
  });
  const handleSubmit = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(() => {
    onSubmit(text);
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_ui_Modal__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: "narrow",
    title: title,
    isOpen: isOpen,
    onClose: onClose,
    isSlim: true,
    children: [Boolean(subtitle) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: _PromptDialog_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].subtitle,
      children: subtitle
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_InputText__WEBPACK_IMPORTED_MODULE_4__["default"], {
      placeholder: placeholder,
      value: text,
      onChange: handleTextChange,
      maxLength: maxLength,
      teactExperimentControlled: true
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: "dialog-buttons mt-2",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: "confirm-dialog-button",
        onClick: handleSubmit,
        children: submitText || lang('Save')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
        className: "confirm-dialog-button",
        isText: true,
        onClick: onClose,
        children: lang('Cancel')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PromptDialog));

/***/ },

/***/ "./src/hooks/animations/useTransitionActiveKey.ts"
/*!********************************************************!*\
  !*** ./src/hooks/animations/useTransitionActiveKey.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useTransitionActiveKey: () => (/* binding */ useTransitionActiveKey)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _useSyncEffect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useSyncEffect */ "./src/hooks/useSyncEffect.ts");



/**
 * Use this hook to bind `<Transition />` animation to changes in the dependency array.
 * Use optional parameter `noAnimation` if you want to prevent the animation even if the dependency array changes.
*/
function useTransitionActiveKey(deps, noAnimation) {
  const activeKeyRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(0);
  (0,_useSyncEffect__WEBPACK_IMPORTED_MODULE_1__["default"])(() => {
    if (!noAnimation) activeKeyRef.current += 1;
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [...deps]);
  return activeKeyRef.current;
}

/***/ },

/***/ "./src/hooks/animations/useVtn.ts"
/*!****************************************!*\
  !*** ./src/hooks/animations/useVtn.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useVtn: () => (/* binding */ useVtn)
/* harmony export */ });
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _useLastCallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _useUniqueId__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../useUniqueId */ "./src/hooks/useUniqueId.ts");



const VTN_PROPERTY_NAME = '--_vtn';
CSS.registerProperty?.({
  name: VTN_PROPERTY_NAME,
  syntax: '*',
  inherits: false
});
function useVtn(uniqueId) {
  const fallbackId = (0,_useUniqueId__WEBPACK_IMPORTED_MODULE_2__["default"])();

  // Pass `true` to use the same class name as the name parameter
  const createVtnStyle = (0,_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])((name, vtClass) => {
    const vtClassString = vtClass === true ? name : vtClass || undefined;
    return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_0__["default"])(`${VTN_PROPERTY_NAME}: vtn-${name}-${uniqueId || fallbackId}`, vtClassString && `view-transition-class: ${vtClassString}`);
  });
  return {
    createVtnStyle
  };
}

/***/ },

/***/ "./src/hooks/schedulers/useIntervalForceUpdate.ts"
/*!********************************************************!*\
  !*** ./src/hooks/schedulers/useIntervalForceUpdate.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useIntervalForceUpdate)
/* harmony export */ });
/* harmony import */ var _useForceUpdate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../useForceUpdate */ "./src/hooks/useForceUpdate.ts");
/* harmony import */ var _useInterval__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useInterval */ "./src/hooks/schedulers/useInterval.ts");


function useIntervalForceUpdate(interval) {
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_0__["default"])();
  (0,_useInterval__WEBPACK_IMPORTED_MODULE_1__["default"])(forceUpdate, interval, true);
}

/***/ },

/***/ "./src/hooks/schedulers/useTimeout.ts"
/*!********************************************!*\
  !*** ./src/hooks/schedulers/useTimeout.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _useLastCallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../useLastCallback */ "./src/hooks/useLastCallback.ts");


function useTimeout(callback, delay) {
  const savedCallback = (0,_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(callback);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (typeof delay !== 'number') {
      return undefined;
    }
    const id = setTimeout(() => savedCallback(), delay);
    return () => clearTimeout(id);
  }, [delay]);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useTimeout);

/***/ },

/***/ "./src/hooks/useAverageColor.ts"
/*!**************************************!*\
  !*** ./src/hooks/useAverageColor.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _global_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global/helpers */ "./src/global/helpers/index.ts");
/* harmony import */ var _util_colors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/colors */ "./src/util/colors.ts");
/* harmony import */ var _useMedia__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useMedia */ "./src/hooks/useMedia.ts");





function useAverageColor(peer, fallbackColor = '#00000000') {
  const [color, setColor] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(fallbackColor);
  const imgBlobUrl = (0,_useMedia__WEBPACK_IMPORTED_MODULE_4__["default"])((0,_global_helpers__WEBPACK_IMPORTED_MODULE_2__.getChatAvatarHash)(peer), false, _api_types__WEBPACK_IMPORTED_MODULE_1__.ApiMediaFormat.BlobUrl);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (async () => {
      if (!imgBlobUrl) {
        return;
      }
      const averageColor = await (0,_util_colors__WEBPACK_IMPORTED_MODULE_3__.getAverageColor)(imgBlobUrl);
      setColor((0,_util_colors__WEBPACK_IMPORTED_MODULE_3__.rgb2hex)(averageColor));
    })();
  }, [imgBlobUrl]);
  return color;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useAverageColor);

/***/ },

/***/ "./src/hooks/useCanvasBlur.ts"
/*!************************************!*\
  !*** ./src/hooks/useCanvasBlur.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useCanvasBlur)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fastBlur__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/fastBlur */ "./src/lib/fastBlur.js");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _useSyncEffect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useSyncEffect */ "./src/hooks/useSyncEffect.ts");





const RADIUS = 2;
const ITERATIONS = 2;
function useCanvasBlur(dataUri, isDisabled = false, withRaf, radius = RADIUS, preferredWidth, preferredHeight) {
  const canvasRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const isStartedRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,_useSyncEffect__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    if (!isDisabled) {
      isStartedRef.current = false;
    }
  }, [dataUri, isDisabled]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!dataUri || !canvas || isDisabled || isStartedRef.current) {
      return;
    }
    isStartedRef.current = true;
    const img = new Image();
    const processBlur = () => {
      const width = preferredWidth || img.width;
      const height = preferredHeight || img.height;
      const ctx = canvas.getContext('2d', {
        alpha: false
      });
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__.requestMutation)(() => {
        canvas.width = width;
        canvas.height = height;
        if (_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_CANVAS_FILTER_SUPPORTED) {
          ctx.filter = `blur(${radius}px)`;
        }
        ctx.drawImage(img, -radius * 2, -radius * 2, width + radius * 4, height + radius * 4);
        if (!_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_CANVAS_FILTER_SUPPORTED) {
          (0,_lib_fastBlur__WEBPACK_IMPORTED_MODULE_1__["default"])(ctx, 0, 0, width, height, radius, ITERATIONS);
        }
      });
    };
    img.onload = () => {
      if (withRaf) {
        (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__.requestMeasure)(processBlur);
      } else {
        processBlur();
      }
    };
    img.src = dataUri;
  }, [dataUri, isDisabled, preferredHeight, preferredWidth, radius, withRaf]);
  return canvasRef;
}

/***/ },

/***/ "./src/hooks/useCustomBackground.ts"
/*!******************************************!*\
  !*** ./src/hooks/useCustomBackground.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config */ "./src/config.ts");
/* harmony import */ var _util_cacheApi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/cacheApi */ "./src/util/cacheApi.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/files */ "./src/util/files.ts");





const useCustomBackground = (theme, settingValue) => {
  const {
    setThemeSettings
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const [value, setValue] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(settingValue);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!settingValue) {
      return;
    }
    if (settingValue.startsWith('#')) {
      setValue(settingValue);
    } else {
      _util_cacheApi__WEBPACK_IMPORTED_MODULE_3__.fetch(_config__WEBPACK_IMPORTED_MODULE_2__.CUSTOM_BG_CACHE_NAME, theme, _util_cacheApi__WEBPACK_IMPORTED_MODULE_3__.Type.Blob).then(blob => {
        const url = URL.createObjectURL(blob);
        (0,_util_files__WEBPACK_IMPORTED_MODULE_4__.preloadImage)(url).then(() => {
          setValue(`url(${url})`);
        });
      }).catch(() => {
        setThemeSettings({
          theme,
          background: undefined,
          backgroundColor: undefined,
          isBlurred: true,
          patternColor: theme === 'dark' ? _config__WEBPACK_IMPORTED_MODULE_2__.DARK_THEME_PATTERN_COLOR : _config__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_PATTERN_COLOR
        });
      });
    }
  }, [settingValue, theme]);
  return settingValue ? value : undefined;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useCustomBackground);

/***/ },

/***/ "./src/hooks/useEnsureMessage.ts"
/*!***************************************!*\
  !*** ./src/hooks/useEnsureMessage.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useEnsureMessage)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");


function useEnsureMessage(chatId, messageId, message, replyOriginForId, isDisabled) {
  const {
    loadMessage
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isDisabled) return;
    if (messageId && !message) {
      loadMessage({
        chatId,
        messageId,
        replyOriginForId: replyOriginForId
      });
    }
  }, [isDisabled, chatId, message, messageId, replyOriginForId]);
}

/***/ },

/***/ "./src/hooks/useFolderManager.ts"
/*!***************************************!*\
  !*** ./src/hooks/useFolderManager.ts ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFolderManagerForChatsCount: () => (/* binding */ useFolderManagerForChatsCount),
/* harmony export */   useFolderManagerForOrderedIds: () => (/* binding */ useFolderManagerForOrderedIds),
/* harmony export */   useFolderManagerForUnreadChatsByFolder: () => (/* binding */ useFolderManagerForUnreadChatsByFolder),
/* harmony export */   useFolderManagerForUnreadCounters: () => (/* binding */ useFolderManagerForUnreadCounters)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_folderManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/folderManager */ "./src/util/folderManager.ts");
/* harmony import */ var _useForceUpdate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useForceUpdate */ "./src/hooks/useForceUpdate.ts");



function useFolderManagerForOrderedIds(folderId) {
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.addOrderedIdsCallback)(folderId, forceUpdate), [folderId, forceUpdate]);
  return (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.getOrderedIds)(folderId);
}
function useFolderManagerForUnreadCounters() {
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.addUnreadCountersCallback)(forceUpdate), [forceUpdate]);
  return (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.getUnreadCounters)();
}
function useFolderManagerForChatsCount() {
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.addChatsCountCallback)(forceUpdate), [forceUpdate]);
  return (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.getChatsCount)();
}
function useFolderManagerForUnreadChatsByFolder() {
  const forceUpdate = (0,_useForceUpdate__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.addUnreadChatsByFolderIdCallback)(forceUpdate), [forceUpdate]);
  return (0,_util_folderManager__WEBPACK_IMPORTED_MODULE_1__.getUnreadChatsByFolderId)();
}

/***/ },

/***/ "./src/hooks/useHorizontalScroll.ts"
/*!******************************************!*\
  !*** ./src/hooks/useHorizontalScroll.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");

const useHorizontalScroll = (containerRef, isDisabled, shouldPreventDefault = false) => {
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isDisabled) {
      return undefined;
    }
    const container = containerRef.current;
    function handleScroll(e) {
      // Ignore horizontal scroll and let it work natively (e.g. on touchpad)
      if (!e.deltaX) {
        container.scrollLeft += e.deltaY / 4;
        if (shouldPreventDefault) e.preventDefault();
      }
    }
    container.addEventListener('wheel', handleScroll, {
      passive: !shouldPreventDefault
    });
    return () => {
      container.removeEventListener('wheel', handleScroll);
    };
  }, [containerRef, isDisabled, shouldPreventDefault]);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useHorizontalScroll);

/***/ },

/***/ "./src/hooks/useImageLoader.ts"
/*!*************************************!*\
  !*** ./src/hooks/useImageLoader.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useImageLoader)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/files */ "./src/util/files.ts");
/* harmony import */ var _useAsync__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useAsync */ "./src/hooks/useAsync.ts");



function useImageLoader(file) {
  const urlRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    result: image
  } = (0,_useAsync__WEBPACK_IMPORTED_MODULE_2__["default"])(() => {
    if (!file) {
      return Promise.resolve(undefined);
    }
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
    }
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    return (0,_util_files__WEBPACK_IMPORTED_MODULE_1__.preloadImage)(url);
  }, [file]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = undefined;
      }
    };
  }, []);
  return {
    image
  };
}

/***/ },

/***/ "./src/hooks/useInputFocusOnOpen.ts"
/*!******************************************!*\
  !*** ./src/hooks/useInputFocusOnOpen.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useInputFocusOnOpen)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_focusNoScroll__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/focusNoScroll */ "./src/util/focusNoScroll.ts");




const MODAL_HIDE_DELAY_MS = 300;
function useInputFocusOnOpen(inputRef, isOpen, onClose) {
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isOpen) {
      if (!_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV && inputRef.current?.isConnected) {
        (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(() => {
          (0,_util_focusNoScroll__WEBPACK_IMPORTED_MODULE_3__["default"])(inputRef.current);
        });
      }
    } else {
      if (inputRef.current?.isConnected) {
        inputRef.current.blur();
      }
      if (onClose) {
        setTimeout(onClose, MODAL_HIDE_DELAY_MS);
      }
    }
  }, [inputRef, isOpen, onClose]);
}

/***/ },

/***/ "./src/hooks/useRunDebounced.ts"
/*!**************************************!*\
  !*** ./src/hooks/useRunDebounced.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useRunDebounced)
/* harmony export */ });
/* harmony import */ var _useDebouncedCallback__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useDebouncedCallback */ "./src/hooks/useDebouncedCallback.ts");

function useRunDebounced(ms, noFirst, noLast, deps = []) {
  return (0,_useDebouncedCallback__WEBPACK_IMPORTED_MODULE_0__["default"])(cb => {
    cb();
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, deps, ms, noFirst, noLast);
}

/***/ },

/***/ "./src/hooks/useScrollNotch.ts"
/*!*************************************!*\
  !*** ./src/hooks/useScrollNotch.ts ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @teact/teact-dom.ts */ "./src/lib/teact/teact-dom.ts");
/* harmony import */ var _lib_fasterdom_fasterdom_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/fasterdom/fasterdom.ts */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_schedulers_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/schedulers.ts */ "./src/util/schedulers.ts");




const THROTTLE_DELAY = 100;
const SCROLL_THRESHOLD = 5;
const useScrollNotch = ({
  containerRef,
  selector,
  isBottomNotch,
  shouldHideTopNotch
}, deps) => {
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const elements = containerRef.current?.querySelectorAll(selector);
    if (!elements?.length) return undefined;
    const handleScroll = (0,_util_schedulers_ts__WEBPACK_IMPORTED_MODULE_3__.throttle)(event => {
      const target = event.target;
      const isScrolled = target.scrollTop > 0;
      const {
        scrollHeight,
        scrollTop,
        clientHeight
      } = target;
      const isAtEnd = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
      (0,_lib_fasterdom_fasterdom_ts__WEBPACK_IMPORTED_MODULE_2__.requestMutation)(() => {
        if (!shouldHideTopNotch) {
          (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.toggleExtraClass)(target, 'scrolled', isScrolled);
        }
        if (isBottomNotch) {
          (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.toggleExtraClass)(target, 'scrolled-to-end', isAtEnd);
        }
      });
    }, THROTTLE_DELAY);
    elements.forEach(el => {
      if (!shouldHideTopNotch) {
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.addExtraClass)(el, 'with-notch');
      }
      if (isBottomNotch) {
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.addExtraClass)(el, 'with-bottom-notch');
      }
      el.addEventListener('scroll', handleScroll, {
        passive: true
      });
    });
    return () => {
      elements.forEach(el => {
        el.removeEventListener('scroll', handleScroll);
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.removeExtraClass)(el, 'with-notch');
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.removeExtraClass)(el, 'with-bottom-notch');
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.removeExtraClass)(el, 'scrolled');
        (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.removeExtraClass)(el, 'scrolled-to-end');
      });
    };
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [containerRef, selector, isBottomNotch, shouldHideTopNotch, ...deps]);
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const elements = containerRef.current?.querySelectorAll(selector);
    if (!elements?.length) return undefined;
    elements.forEach(el => {
      const isScrolled = el.scrollTop > 0;
      const {
        scrollHeight,
        scrollTop,
        clientHeight
      } = el;
      const isAtEnd = scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
      (0,_lib_fasterdom_fasterdom_ts__WEBPACK_IMPORTED_MODULE_2__.requestMutation)(() => {
        if (!shouldHideTopNotch) {
          (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.toggleExtraClass)(el, 'scrolled', isScrolled);
        }
        if (isBottomNotch) {
          (0,_teact_teact_dom_ts__WEBPACK_IMPORTED_MODULE_1__.toggleExtraClass)(el, 'scrolled-to-end', isAtEnd);
        }
      });
    });
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [containerRef, selector, isBottomNotch, shouldHideTopNotch, ...deps]);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useScrollNotch);

/***/ },

/***/ "./src/util/animateHorizontalScroll.ts"
/*!*********************************************!*\
  !*** ./src/util/animateHorizontalScroll.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ animateHorizontalScroll)
/* harmony export */ });
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animation */ "./src/util/animation.ts");




const DEFAULT_DURATION = 300;
const stopById = new Map();
function animateHorizontalScroll(container, left, duration = DEFAULT_DURATION) {
  if (!(0,_global_selectors__WEBPACK_IMPORTED_MODULE_2__.selectCanAnimateInterface)((0,_global__WEBPACK_IMPORTED_MODULE_0__.getGlobal)())) {
    duration = 0;
  }
  const isRtl = container.getAttribute('dir') === 'rtl';
  const {
    scrollLeft,
    offsetWidth: containerWidth,
    scrollWidth,
    dataset: {
      scrollId
    }
  } = container;
  let path = left - scrollLeft;
  if (path < 0) {
    const remainingPath = -scrollLeft * (isRtl ? -1 : 1);
    path = Math.max(path, remainingPath);
  } else if (path > 0) {
    const remainingPath = scrollWidth - (scrollLeft + containerWidth);
    path = Math.min(path, remainingPath);
  }
  if (path === 0) {
    return Promise.resolve();
  }
  if (scrollId && stopById.has(scrollId)) {
    stopById.get(scrollId)();
  }
  const target = scrollLeft + path;
  return new Promise(resolve => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      if (duration === 0) {
        container.scrollLeft = target;
        resolve();
        return;
      }
      let isStopped = false;
      const id = Math.random().toString();
      container.dataset.scrollId = id;
      stopById.set(id, () => {
        isStopped = true;
      });
      container.style.scrollSnapType = 'none';
      const startAt = Date.now();
      function cleanup() {
        container.style.scrollSnapType = '';
        delete container.dataset.scrollId;
        stopById.delete(id);
      }
      (0,_animation__WEBPACK_IMPORTED_MODULE_3__.animate)(() => {
        if (isStopped) {
          cleanup();
          return false;
        }
        const t = Math.min((Date.now() - startAt) / duration, 1);
        const currentPath = path * (1 - transition(t));
        container.scrollLeft = Math.round(target - currentPath);
        if (t >= 1) {
          cleanup();
          resolve();
        }
        return t < 1;
      }, _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation);
    });
  });
}
function transition(t) {
  return 1 - (1 - t) ** 3.5;
}

/***/ },

/***/ "./src/util/animateScroll.ts"
/*!***********************************!*\
  !*** ./src/util/animateScroll.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cancelScrollBlockingAnimation: () => (/* binding */ cancelScrollBlockingAnimation),
/* harmony export */   "default": () => (/* binding */ animateScroll),
/* harmony export */   isAnimatingScroll: () => (/* binding */ isAnimatingScroll),
/* harmony export */   restartCurrentScrollAnimation: () => (/* binding */ restartCurrentScrollAnimation)
/* harmony export */ });
/* harmony import */ var _teact_teact_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact/teact-dom */ "./src/lib/teact/teact-dom.ts");
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global */ "./src/global/index.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../types */ "./src/types/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../config */ "./src/config.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _visibility_getOffsetToContainer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./visibility/getOffsetToContainer */ "./src/util/visibility/getOffsetToContainer.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./animation */ "./src/util/animation.ts");










let isAnimating = false;
let currentArgs;
let onHeavyAnimationEnd;
function animateScroll(args) {
  currentArgs = args;
  const mutate = createMutateFunction(args);
  if (args.shouldReturnMutationFn) {
    return mutate;
  }
  (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_5__.requestMutation)(mutate);
  return undefined;
}
function restartCurrentScrollAnimation() {
  if (!isAnimating) {
    return;
  }
  (0,_animation__WEBPACK_IMPORTED_MODULE_9__.cancelSingleAnimation)();
  (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_5__.requestMeasure)(() => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_5__.requestMutation)(createMutateFunction(currentArgs));
  });
}
function createMutateFunction(args) {
  const {
    container,
    element,
    position,
    margin = 0,
    maxDistance = _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MAX_DISTANCE,
    forceDirection,
    forceNormalContainerHeight
  } = args;
  let forceDuration = args.forceDuration;
  if (forceDirection === _types__WEBPACK_IMPORTED_MODULE_3__.FocusDirection.Static || !(0,_global_selectors__WEBPACK_IMPORTED_MODULE_6__.selectCanAnimateInterface)((0,_global__WEBPACK_IMPORTED_MODULE_2__.getGlobal)())) {
    forceDuration = 0;
  }
  const {
    offsetHeight: elementHeight
  } = element;
  const {
    scrollTop: currentScrollTop,
    clientHeight: containerHeight,
    scrollHeight
  } = container;
  const elementTop = (0,_visibility_getOffsetToContainer__WEBPACK_IMPORTED_MODULE_8__["default"])(element, container).top;
  const targetContainerHeight = forceNormalContainerHeight && container.dataset.normalHeight ? Number(container.dataset.normalHeight) : containerHeight;
  let scrollTo;
  switch (position) {
    case 'start':
      scrollTo = elementTop - margin + (_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_7__.IS_ANDROID ? 1 : 0);
      break;
    case 'end':
      scrollTo = elementTop + elementHeight + margin - targetContainerHeight;
      break;
    // 'nearest' is not supported yet
    case 'nearest':
    case 'center':
    case 'centerOrTop':
      scrollTo = elementHeight < targetContainerHeight ? elementTop + elementHeight / 2 - targetContainerHeight / 2 : elementTop - margin;
      break;
  }
  const scrollFrom = calculateScrollFrom(container, scrollTo, maxDistance, forceDirection);
  let path = scrollTo - scrollFrom;
  if (path < 0) {
    const remainingPath = -scrollFrom;
    path = Math.max(path, remainingPath);
  } else if (path > 0) {
    const remainingPath = scrollHeight - (scrollFrom + targetContainerHeight);
    path = Math.min(path, remainingPath);
  }
  const absPath = Math.abs(path);
  return () => {
    if (absPath < 1) {
      if (currentScrollTop !== scrollFrom) {
        container.scrollTop = scrollFrom;
      }
      return;
    }
    const target = scrollFrom + path;
    if (forceDuration === 0) {
      container.scrollTop = target;
      return;
    }
    const transition = absPath <= _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_SHORT_TRANSITION_MAX_DISTANCE ? shortTransition : longTransition;
    const duration = forceDuration || _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MIN_DURATION + absPath / _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MAX_DISTANCE * (_config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MAX_DURATION - _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MIN_DURATION);
    const startAt = Date.now();
    isAnimating = true;
    (0,_teact_teact_dom__WEBPACK_IMPORTED_MODULE_0__.setExtraStyles)(container, {
      scrollSnapType: 'none'
    });
    const prevOnHeavyAnimationEnd = onHeavyAnimationEnd;
    onHeavyAnimationEnd = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_1__.beginHeavyAnimation)(undefined, true);
    prevOnHeavyAnimationEnd?.();
    (0,_animation__WEBPACK_IMPORTED_MODULE_9__.animateSingle)(() => {
      const t = Math.min((Date.now() - startAt) / duration, 1);
      const currentPath = path * (1 - transition(t));
      const newScrollTop = Math.round(target - currentPath);
      container.scrollTop = newScrollTop;
      isAnimating = t < 1 && newScrollTop !== target;
      if (!isAnimating) {
        currentArgs = undefined;
        (0,_teact_teact_dom__WEBPACK_IMPORTED_MODULE_0__.setExtraStyles)(container, {
          scrollSnapType: ''
        });
        onHeavyAnimationEnd?.();
        onHeavyAnimationEnd = undefined;
      }
      return isAnimating;
    }, _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_5__.requestMutation);
  };
}
function isAnimatingScroll() {
  return isAnimating;
}
function cancelScrollBlockingAnimation() {
  if (currentArgs?.container) {
    (0,_teact_teact_dom__WEBPACK_IMPORTED_MODULE_0__.setExtraStyles)(currentArgs.container, {
      scrollSnapType: ''
    });
  }
  onHeavyAnimationEnd?.();
  onHeavyAnimationEnd = undefined;
}
function calculateScrollFrom(container, scrollTo, maxDistance = _config__WEBPACK_IMPORTED_MODULE_4__.SCROLL_MAX_DISTANCE, forceDirection) {
  const {
    scrollTop
  } = container;
  if (forceDirection === undefined) {
    const offset = scrollTo - scrollTop;
    if (offset < -maxDistance) {
      return scrollTop + (offset + maxDistance);
    } else if (offset > maxDistance) {
      return scrollTop + (offset - maxDistance);
    }
  } else if (forceDirection === _types__WEBPACK_IMPORTED_MODULE_3__.FocusDirection.Up) {
    return scrollTo + maxDistance;
  } else if (forceDirection === _types__WEBPACK_IMPORTED_MODULE_3__.FocusDirection.Down) {
    return Math.max(0, scrollTo - maxDistance);
  }
  return scrollTop;
}
function shortTransition(t) {
  return 1 - (1 - t) ** 3.5;
}
function longTransition(t) {
  return 1 - (1 - t) ** 6;
}

/***/ },

/***/ "./src/util/animations/viewTransitionTypes.ts"
/*!****************************************************!*\
  !*** ./src/util/animations/viewTransitionTypes.ts ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VTT_CHAT_EXTRA: () => (/* binding */ VTT_CHAT_EXTRA),
/* harmony export */   VTT_CRAFT_ATTRIBUTES: () => (/* binding */ VTT_CRAFT_ATTRIBUTES),
/* harmony export */   VTT_PROFILE_BUSINESS_HOURS: () => (/* binding */ VTT_PROFILE_BUSINESS_HOURS),
/* harmony export */   VTT_PROFILE_BUSINESS_HOURS_COLLAPSE: () => (/* binding */ VTT_PROFILE_BUSINESS_HOURS_COLLAPSE),
/* harmony export */   VTT_PROFILE_BUSINESS_HOURS_EXPAND: () => (/* binding */ VTT_PROFILE_BUSINESS_HOURS_EXPAND),
/* harmony export */   VTT_PROFILE_GIFTS: () => (/* binding */ VTT_PROFILE_GIFTS),
/* harmony export */   VTT_PROFILE_NOTE: () => (/* binding */ VTT_PROFILE_NOTE),
/* harmony export */   VTT_PROFILE_NOTE_COLLAPSE: () => (/* binding */ VTT_PROFILE_NOTE_COLLAPSE),
/* harmony export */   VTT_PROFILE_NOTE_EXPAND: () => (/* binding */ VTT_PROFILE_NOTE_EXPAND),
/* harmony export */   VTT_RIGHT_COLUMN: () => (/* binding */ VTT_RIGHT_COLUMN),
/* harmony export */   VTT_RIGHT_PROFILE_AVATAR: () => (/* binding */ VTT_RIGHT_PROFILE_AVATAR),
/* harmony export */   VTT_RIGHT_PROFILE_COLLAPSE: () => (/* binding */ VTT_RIGHT_PROFILE_COLLAPSE),
/* harmony export */   VTT_RIGHT_PROFILE_EXPAND: () => (/* binding */ VTT_RIGHT_PROFILE_EXPAND),
/* harmony export */   VTTypes: () => (/* binding */ VTTypes)
/* harmony export */ });
class VTTypes {
  hierarchy = [];
  constructor(types) {
    this.hierarchy = [...(types || [])];
  }
  with(type) {
    return new VTTypes([...this.hierarchy, type]);
  }
  getTypes() {
    return this.hierarchy;
  }
}

// View transition types
const VTT_RIGHT_COLUMN = new VTTypes(['rightColumn']);
const VTT_RIGHT_PROFILE_AVATAR = VTT_RIGHT_COLUMN.with('profileAvatar');
const VTT_RIGHT_PROFILE_EXPAND = VTT_RIGHT_PROFILE_AVATAR.with('profileExpand');
const VTT_RIGHT_PROFILE_COLLAPSE = VTT_RIGHT_PROFILE_AVATAR.with('profileCollapse');
const VTT_PROFILE_GIFTS = VTT_RIGHT_COLUMN.with('profileGifts');
const VTT_CHAT_EXTRA = VTT_RIGHT_COLUMN.with('chatExtra');
const VTT_PROFILE_BUSINESS_HOURS = VTT_CHAT_EXTRA.with('profileBusinessHours');
const VTT_PROFILE_BUSINESS_HOURS_EXPAND = VTT_PROFILE_BUSINESS_HOURS.with('profileBusinessHoursExpand');
const VTT_PROFILE_BUSINESS_HOURS_COLLAPSE = VTT_PROFILE_BUSINESS_HOURS.with('profileBusinessHoursCollapse');
const VTT_PROFILE_NOTE = VTT_CHAT_EXTRA.with('profileNote');
const VTT_PROFILE_NOTE_EXPAND = VTT_PROFILE_NOTE.with('profileNoteExpand');
const VTT_PROFILE_NOTE_COLLAPSE = VTT_PROFILE_NOTE.with('profileNoteCollapse');
const VTT_CRAFT_ATTRIBUTES = new VTTypes(['craftAttributes']);

/***/ },

/***/ "./src/util/events/getPointerPosition.ts"
/*!***********************************************!*\
  !*** ./src/util/events/getPointerPosition.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getPointerPosition)
/* harmony export */ });
function getPointerPosition(e) {
  if ('touches' in e) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }
  return {
    x: e.clientX,
    y: e.clientY
  };
}

/***/ },

/***/ "./src/util/focusNoScroll.ts"
/*!***********************************!*\
  !*** ./src/util/focusNoScroll.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ focusNoScroll)
/* harmony export */ });
function focusNoScroll(element) {
  if (!element) return;
  element.focus({
    preventScroll: true
  });
}

/***/ },

/***/ "./src/util/getMessageIdsForSelectedText.ts"
/*!**************************************************!*\
  !*** ./src/util/getMessageIdsForSelectedText.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMessageIdsForSelectedText)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./src/config.ts");

const ELEMENT_NODE = 1;
function getMessageIdsForSelectedText() {
  const selection = window.getSelection();
  const selectedFragments = selection?.rangeCount ? selection.getRangeAt(0).cloneContents() : undefined;
  const shouldIncludeLastMessage = selection?.focusNode && selection.focusOffset > 0 && hasParentWithClassName(selection.focusNode, _config__WEBPACK_IMPORTED_MODULE_0__.MESSAGE_CONTENT_CLASS_NAME);
  if (!selectedFragments || selectedFragments.childElementCount === 0) {
    return undefined;
  }
  const messageIds = Array.from(selectedFragments.children).reduce((result, node) => {
    if (node.nodeType === ELEMENT_NODE && node.classList.contains('message-date-group')) {
      return Array.from(node.querySelectorAll('.Message')).reduce((acc, messageEl) => acc.concat(Number(messageEl.dataset.messageId)), result);
    } else if (node.nodeType === ELEMENT_NODE && node.classList.contains('Message')) {
      return result.concat(Number(node.dataset.messageId));
    }
    return result;
  }, []);

  // Cleanup a document fragment because it is playing media content in the background
  while (selectedFragments.firstChild) {
    selectedFragments.removeChild(selectedFragments.firstChild);
  }
  if (!shouldIncludeLastMessage) {
    messageIds.pop();
  }
  return messageIds;
}
function hasParentWithClassName(element, className) {
  if (element.nodeType === ELEMENT_NODE && element.classList.contains(className)) {
    return true;
  }
  return element.parentNode ? hasParentWithClassName(element.parentNode, className) : false;
}

/***/ },

/***/ "./src/util/objects/customPeer.ts"
/*!****************************************!*\
  !*** ./src/util/objects/customPeer.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CUSTOM_PEER_EXCLUDED_CHAT_TYPES: () => (/* binding */ CUSTOM_PEER_EXCLUDED_CHAT_TYPES),
/* harmony export */   CUSTOM_PEER_HIDDEN: () => (/* binding */ CUSTOM_PEER_HIDDEN),
/* harmony export */   CUSTOM_PEER_INCLUDED_CHAT_TYPES: () => (/* binding */ CUSTOM_PEER_INCLUDED_CHAT_TYPES),
/* harmony export */   CUSTOM_PEER_PREMIUM: () => (/* binding */ CUSTOM_PEER_PREMIUM)
/* harmony export */ });
const CUSTOM_PEER_PREMIUM = {
  isCustomPeer: true,
  type: 'premium',
  titleKey: 'PrivacyPremium',
  subtitleKey: 'PrivacyPremiumText',
  avatarIcon: 'star',
  isAvatarSquare: true,
  withPremiumGradient: true
};
const CUSTOM_PEER_INCLUDED_CHAT_TYPES = [{
  isCustomPeer: true,
  type: 'contacts',
  titleKey: 'FilterContacts',
  avatarIcon: 'user',
  isAvatarSquare: true,
  peerColorId: 5
}, {
  isCustomPeer: true,
  type: 'nonContacts',
  titleKey: 'FilterNonContacts',
  avatarIcon: 'non-contacts',
  isAvatarSquare: true,
  peerColorId: 4
}, {
  isCustomPeer: true,
  type: 'groups',
  titleKey: 'FilterGroups',
  avatarIcon: 'group',
  isAvatarSquare: true,
  peerColorId: 3
}, {
  isCustomPeer: true,
  type: 'channels',
  titleKey: 'FilterChannels',
  avatarIcon: 'channel',
  isAvatarSquare: true,
  peerColorId: 1
}, {
  isCustomPeer: true,
  type: 'bots',
  titleKey: 'FilterBots',
  avatarIcon: 'bots',
  isAvatarSquare: true,
  peerColorId: 6
}];
const CUSTOM_PEER_EXCLUDED_CHAT_TYPES = [{
  isCustomPeer: true,
  type: 'excludeMuted',
  titleKey: 'FilterMuted',
  avatarIcon: 'mute',
  isAvatarSquare: true,
  peerColorId: 6
}, {
  isCustomPeer: true,
  type: 'excludeRead',
  titleKey: 'FilterRead',
  avatarIcon: 'readchats',
  isAvatarSquare: true,
  peerColorId: 4
}, {
  isCustomPeer: true,
  type: 'excludeArchived',
  titleKey: 'FilterArchived',
  avatarIcon: 'archive',
  isAvatarSquare: true,
  peerColorId: 5
}];
const CUSTOM_PEER_HIDDEN = {
  isCustomPeer: true,
  type: 'hidden',
  titleKey: 'StarsTransactionHidden',
  avatarIcon: 'author-hidden',
  peerColorId: 4
};

/***/ },

/***/ "./src/util/parseHtmlAsFormattedText.ts"
/*!**********************************************!*\
  !*** ./src/util/parseHtmlAsFormattedText.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENTITY_CLASS_BY_NODE_NAME: () => (/* binding */ ENTITY_CLASS_BY_NODE_NAME),
/* harmony export */   "default": () => (/* binding */ parseHtmlAsFormattedText),
/* harmony export */   fixImageContent: () => (/* binding */ fixImageContent)
/* harmony export */ });
/* harmony import */ var _api_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../api/types */ "./src/api/types/index.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config */ "./src/config.ts");
/* harmony import */ var _browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");



const ENTITY_CLASS_BY_NODE_NAME = {
  B: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Bold,
  STRONG: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Bold,
  I: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Italic,
  EM: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Italic,
  INS: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Underline,
  U: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Underline,
  S: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Strike,
  STRIKE: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Strike,
  DEL: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Strike,
  CODE: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Code,
  PRE: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Pre,
  BLOCKQUOTE: _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Blockquote
};
const MAX_TAG_DEEPNESS = 3;
function parseHtmlAsFormattedText(html, withMarkdownLinks = false, skipMarkdown = false) {
  const fragment = document.createElement('div');
  fragment.innerHTML = skipMarkdown ? html : withMarkdownLinks ? parseMarkdown(parseMarkdownLinks(html)) : parseMarkdown(html);
  fixImageContent(fragment);
  const text = fragment.innerText.trim().replace(/\u200b+/g, '');
  const trimShift = fragment.innerText.indexOf(text[0]);
  let textIndex = -trimShift;
  let recursionDeepness = 0;
  const entities = [];
  function addEntity(node) {
    if (node.nodeType === Node.COMMENT_NODE) return;
    const {
      index,
      entity
    } = getEntityDataFromNode(node, text, textIndex);
    if (entity) {
      textIndex = index;
      entities.push(entity);
    } else if (node.textContent) {
      // Skip newlines on the beginning
      if (index === 0 && node.textContent.trim() === '') {
        return;
      }
      textIndex += node.textContent.length;
    }
    if (node.hasChildNodes() && recursionDeepness <= MAX_TAG_DEEPNESS) {
      recursionDeepness += 1;
      Array.from(node.childNodes).forEach(addEntity);
    }
  }
  Array.from(fragment.childNodes).forEach(node => {
    recursionDeepness = 1;
    addEntity(node);
  });
  return {
    text,
    entities: entities.length ? entities : undefined
  };
}
function fixImageContent(fragment) {
  fragment.querySelectorAll('img').forEach(node => {
    if (node.dataset.documentId) {
      // Custom Emoji
      node.textContent = node.alt || '';
    } else {
      // Regular emoji with image fallback
      node.replaceWith(node.alt || '');
    }
  });
}
function parseMarkdown(html) {
  let parsedHtml = html.slice(0);

  // Strip redundant nbsp's
  parsedHtml = parsedHtml.replace(/&nbsp;/g, ' ');

  // Replace <div><br></div> with newline (new line in Safari)
  parsedHtml = parsedHtml.replace(/<div><br([^>]*)?><\/div>/g, '\n');
  // Replace <br> with newline
  parsedHtml = parsedHtml.replace(/<br([^>]*)?>/g, '\n');

  // Strip redundant <div> tags
  parsedHtml = parsedHtml.replace(/<\/div>(\s*)<div>/g, '\n');
  parsedHtml = parsedHtml.replace(/<div>/g, '\n');
  parsedHtml = parsedHtml.replace(/<\/div>/g, '');

  // Pre
  parsedHtml = parsedHtml.replace(/^`{3}(.*?)[\n\r](.*?[\n\r]?)`{3}/gms, '<pre data-language="$1">$2</pre>');
  parsedHtml = parsedHtml.replace(/^`{3}[\n\r]?(.*?)[\n\r]?`{3}/gms, '<pre>$1</pre>');
  parsedHtml = parsedHtml.replace(/[`]{3}([^`]+)[`]{3}/g, '<pre>$1</pre>');

  // Code
  parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[`]{1}([^`\n]+)[`]{1}(?![^<]*<\/(code|pre)>)/g, '<code>$2</code>');

  // Custom Emoji markdown tag
  if (!_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_EMOJI_SUPPORTED) {
    // Prepare alt text for custom emoji
    parsedHtml = parsedHtml.replace(/\[<img[^>]+alt="([^"]+)"[^>]*>]/gm, '[$1]');
  }
  parsedHtml = parsedHtml.replace(/(?!<(?:code|pre)[^<]*|<\/)\[([^\]\n]+)\]\(customEmoji:(\d+)\)(?![^<]*<\/(?:code|pre)>)/g, '<img alt="$1" data-document-id="$2">');

  // Other simple markdown
  parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[*]{2}([^*\n]+)[*]{2}(?![^<]*<\/(code|pre)>)/g, '<b>$2</b>');
  parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[_]{2}([^_\n]+)[_]{2}(?![^<]*<\/(code|pre)>)/g, '<i>$2</i>');
  parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[~]{2}([^~\n]+)[~]{2}(?![^<]*<\/(code|pre)>)/g, '<s>$2</s>');
  parsedHtml = parsedHtml.replace(/(?!<(code|pre)[^<]*|<\/)[|]{2}([^|\n]+)[|]{2}(?![^<]*<\/(code|pre)>)/g, `<span data-entity-type="${_api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Spoiler}">$2</span>`);
  return parsedHtml;
}
function parseMarkdownLinks(html) {
  return html.replace(new RegExp(`\\[([^\\]]+?)]\\((${_config__WEBPACK_IMPORTED_MODULE_1__.RE_LINK_TEMPLATE}+?)\\)`, 'g'), (_, text, link) => {
    const url = link.includes('://') ? link : link.includes('@') ? `mailto:${link}` : `https://${link}`;
    return `<a href="${url}">${text}</a>`;
  });
}
function getEntityDataFromNode(node, rawText, textIndex) {
  const type = getEntityTypeFromNode(node);
  if (!type || !node.textContent) {
    return {
      index: textIndex,
      entity: undefined
    };
  }
  const rawIndex = rawText.indexOf(node.textContent, textIndex);
  // In some cases, last text entity ends with a newline (which gets trimmed from `rawText`).
  // In this case, `rawIndex` would return `-1`, so we use `textIndex` instead.
  const index = rawIndex >= 0 ? rawIndex : textIndex;
  const offset = rawText.substring(0, index).length;
  const {
    length
  } = rawText.substring(index, index + node.textContent.length);
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.TextUrl) {
    return {
      index,
      entity: {
        type,
        offset,
        length,
        url: node.href
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.MentionName) {
    return {
      index,
      entity: {
        type,
        offset,
        length,
        userId: node.dataset.userId
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Pre) {
    return {
      index,
      entity: {
        type,
        offset,
        length,
        language: node.dataset.language
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.CustomEmoji) {
    const nodeElement = node;
    const documentId = nodeElement.dataset.documentId || nodeElement.getAttribute('emoji-id');
    if (!documentId) {
      return {
        index,
        entity: undefined
      };
    }
    return {
      index,
      entity: {
        type,
        offset,
        length,
        documentId
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Timestamp) {
    const timestamp = Number(node.dataset.timestamp);
    if (Number.isNaN(timestamp)) {
      return {
        index,
        entity: undefined
      };
    }
    return {
      index,
      entity: {
        type,
        offset,
        length,
        timestamp
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.FormattedDate) {
    const date = Number(node.dataset.unix);
    if (Number.isNaN(date)) {
      return {
        index,
        entity: undefined
      };
    }
    const format = node.dataset.format;
    const relative = format?.includes('r') || undefined;
    const dayOfWeek = format?.includes('w') || undefined;
    const shortDate = format?.includes('d') || undefined;
    const longDate = format?.includes('D') || undefined;
    const shortTime = format?.includes('t') || undefined;
    const longTime = format?.includes('T') || undefined;
    return {
      index,
      entity: {
        type,
        offset,
        length,
        date,
        relative,
        dayOfWeek,
        shortDate,
        longDate,
        shortTime,
        longTime
      }
    };
  }
  if (type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.DiffInsert || type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.DiffReplace || type === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.DiffDelete) {
    return {
      index,
      entity: undefined
    };
  }
  return {
    index,
    entity: {
      type,
      offset,
      length
    }
  };
}
function getEntityTypeFromNode(node) {
  if (node instanceof HTMLElement && node.dataset.entityType) {
    return node.dataset.entityType;
  }
  if (ENTITY_CLASS_BY_NODE_NAME[node.nodeName]) {
    return ENTITY_CLASS_BY_NODE_NAME[node.nodeName];
  }
  if (node.nodeName === 'A') {
    const anchor = node;
    if (anchor.dataset.entityType === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.MentionName) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.MentionName;
    }
    if (anchor.dataset.entityType === _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Url) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Url;
    }
    if (anchor.href.startsWith('mailto:')) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Email;
    }
    if (anchor.href.startsWith('tel:')) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Phone;
    }
    if (anchor.href !== anchor.textContent) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.TextUrl;
    }
    return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.Url;
  }
  if (node.nodeName === 'SPAN') {
    return node.dataset.entityType;
  }
  if (node.nodeName === 'IMG') {
    if (node.dataset.documentId) {
      return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.CustomEmoji;
    }
  }
  if (node.nodeName === 'TG-TIME') {
    return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.FormattedDate;
  }
  if (node.nodeName === 'TG-EMOJI') {
    return _api_types__WEBPACK_IMPORTED_MODULE_0__.ApiMessageEntityTypes.CustomEmoji;
  }
  return undefined;
}

/***/ },

/***/ "./src/util/resolveTransitionName.ts"
/*!*******************************************!*\
  !*** ./src/util/resolveTransitionName.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   resolveTransitionName: () => (/* binding */ resolveTransitionName)
/* harmony export */ });
/* harmony import */ var _config_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.ts */ "./src/config.ts");
/* harmony import */ var _browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser/windowEnvironment.ts */ "./src/util/browser/windowEnvironment.ts");


function resolveTransitionName(name, animationLevel, isDisabled = false, isRtl = false) {
  if (isDisabled || animationLevel === _config_ts__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_LEVEL_MIN) return 'none';
  if (animationLevel === _config_ts__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_LEVEL_MED) return 'slideFade';
  return name === 'slideOptimized' ? isRtl ? 'slideOptimizedRtl' : 'slideOptimized' : name === 'slide' ? isRtl ? 'slideRtl' : 'slide' : _browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_1__.IS_ANDROID ? 'slideFade' : _browser_windowEnvironment_ts__WEBPACK_IMPORTED_MODULE_1__.IS_IOS ? 'slideLayers' : 'pushSlide';
}

/***/ },

/***/ "./src/util/scrollLock.ts"
/*!********************************!*\
  !*** ./src/util/scrollLock.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   disableScrolling: () => (/* binding */ disableScrolling),
/* harmony export */   enableScrolling: () => (/* binding */ enableScrolling),
/* harmony export */   getTouchY: () => (/* binding */ getTouchY)
/* harmony export */ });
let scrollLockEl;
let excludedClosestSelector;
const IGNORED_KEYS = {
  Down: true,
  ArrowDown: true,
  Up: true,
  ArrowUp: true,
  Left: true,
  ArrowLeft: true,
  Right: true,
  ArrowRight: true,
  ' ': true,
  PageUp: true,
  PageDown: true,
  End: true,
  Home: true,
  Tab: true
};
function isTextBox(target) {
  if (!target || !(target instanceof HTMLElement)) return false;
  const element = target;
  const tagName = element.tagName.toLowerCase();
  if (tagName === 'textarea') return true;
  if (tagName !== 'input') return false;
  const type = element.getAttribute('type');
  if (!type) return false;
  const inputTypes = ['text', 'password', 'number', 'email', 'tel', 'url', 'search', 'date', 'datetime', 'datetime-local', 'time', 'month', 'week'];
  return inputTypes.indexOf(type.toLowerCase()) > -1;
}
const getTouchY = e => {
  return 'changedTouches' in e ? e.changedTouches[0].clientY : 0;
};
const preventDefault = e => {
  const deltaY = 'deltaY' in e ? e.deltaY : getTouchY(e);
  if (!scrollLockEl
  // Allow overlay scrolling
  || !scrollLockEl.contains(e.target)
  // Prevent top overscroll
  || scrollLockEl.scrollTop <= 0 && deltaY <= 0
  // Prevent bottom overscroll
  || scrollLockEl.scrollTop >= scrollLockEl.scrollHeight - scrollLockEl.offsetHeight && deltaY >= 0) {
    if (excludedClosestSelector && e.target.closest(excludedClosestSelector)) return;
    e.preventDefault();
  }
};
function preventDefaultForScrollKeys(e) {
  if (IGNORED_KEYS[e.key] && !isTextBox(e.target)) {
    e.preventDefault();
  }
}
function disableScrolling(el, _excludedClosestSelector) {
  scrollLockEl = el;
  excludedClosestSelector = _excludedClosestSelector;
  // Disable scrolling in Chrome
  document.addEventListener('wheel', preventDefault, {
    passive: false
  });
  document.addEventListener('touchmove', preventDefault, {
    passive: false
  });
  document.onkeydown = preventDefaultForScrollKeys;
  return enableScrolling;
}
function enableScrolling() {
  scrollLockEl = undefined;
  excludedClosestSelector = undefined;
  document.removeEventListener('wheel', preventDefault); // Enable scrolling in Chrome
  document.removeEventListener('touchmove', preventDefault);
  // eslint-disable-next-line no-null/no-null
  document.onkeydown = null;
}

/***/ },

/***/ "./src/util/visibility/isElementInViewport.ts"
/*!****************************************************!*\
  !*** ./src/util/visibility/isElementInViewport.ts ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElementInViewport: () => (/* binding */ isElementInViewport)
/* harmony export */ });
/* harmony import */ var _windowSize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../windowSize */ "./src/util/windowSize.ts");

function isElementInViewport(el) {
  if (el.style.display === 'none') {
    return false;
  }
  const rect = el.getBoundingClientRect();
  const {
    height: windowHeight
  } = _windowSize__WEBPACK_IMPORTED_MODULE_0__["default"].get();
  return rect.top <= windowHeight && rect.top + rect.height >= 0;
}

/***/ },

/***/ "./src/components/common/AvatarList.module.scss"
/*!******************************************************!*\
  !*** ./src/components/common/AvatarList.module.scss ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"kXs18Nmi","avatar":"XND8fhC1","badge":"SHyAyGFO"});

/***/ },

/***/ "./src/components/common/BadgeButton.module.scss"
/*!*******************************************************!*\
  !*** ./src/components/common/BadgeButton.module.scss ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"hJUqHi4B","plain":"NsnFJjzu","clickable":"hjDEmFaT","inline":"jNZTCgu2"});

/***/ },

/***/ "./src/components/common/MediaSpoiler.module.scss"
/*!********************************************************!*\
  !*** ./src/components/common/MediaSpoiler.module.scss ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"qF2WgYVg","mask-animation":"pNM3cgkY","maskAnimation":"pNM3cgkY","circle-cut":"WiW38HGg","circleCut":"WiW38HGg","dots":"XBor45hE","canvas":"eULqS2yR","nsfw":"FJGQoa6s","nsfwIcon":"Y7JVRkxJ","opacity-breath":"sW9ega1D","opacityBreath":"sW9ega1D","dots-animation":"mAAEjSPE","dotsAnimation":"mAAEjSPE"});

/***/ },

/***/ "./src/components/common/MiniTable.module.scss"
/*!*****************************************************!*\
  !*** ./src/components/common/MiniTable.module.scss ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"cKr8J5k_","key":"c9RLLvfs","value":"QEuGpzIc"});

/***/ },

/***/ "./src/components/common/PeerChip.module.scss"
/*!****************************************************!*\
  !*** ./src/components/common/PeerChip.module.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"_Lq6_4e5","minimized":"UhOZvxvs","closeable":"uvvgSFUJ","remove":"xVPG2UTy","nonDestructive":"fAk5yEeV","notClickable":"P8r3OoaX","small":"BnD6tlio","avatar":"La8BQ9yr","iconWrapper":"NtoGLT22","icon":"f91Ad80i","name":"XPVuH29G","squareAvatar":"JIHfTUVn"});

/***/ },

/***/ "./src/components/common/PremiumProgress.module.scss"
/*!***********************************************************!*\
  !*** ./src/components/common/PremiumProgress.module.scss ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"nY2ggBsF","withBadge":"RYtVQAjM","badgeContainer":"dhigNjAq","slide-in":"YfcP52Ym","slideIn":"YfcP52Ym","floating-badge-wrapper":"cOpfCGPh","floatingBadgeWrapper":"cOpfCGPh","rotate-in":"AgMPRKbT","rotateIn":"AgMPRKbT","floating-badge":"uNwBLNOy","floatingBadge":"uNwBLNOy","noTransition":"HS9PzRKt","floatingBadgeContent":"W4rqGyJl","floating-badge-triangle":"qRwO7SZm","floatingBadgeTriangle":"qRwO7SZm","floating-badge-icon":"MJ7MTmxi","floatingBadgeIcon":"MJ7MTmxi","floating-badge-value":"MwzZt3Qo","floatingBadgeValue":"MwzZt3Qo","left":"_b5HgBXr","right":"P6mch4bB","progressWrapper":"_B4r3D5W","positiveLayer":"VmyTBAzN","positiveProgress":"MzFvyMb5","negativeLayer":"QZwWHVdB","negativeProgress":"S6H6hBpP","primary":"Zi0w7QJ3","negative":"dXs41qvC","inverted":"Ef0g9liZ","noGradient":"dazw12V7","transitioning":"I7toQztx","hidden":"xdKGgbKQ","cycling":"SxTCkiyg","show":"tkyw4hXo"});

/***/ },

/***/ "./src/components/common/gift/GiftRibbon.module.scss"
/*!***********************************************************!*\
  !*** ./src/components/common/gift/GiftRibbon.module.scss ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"AmQSvxpZ","text":"pQW7dcwr"});

/***/ },

/***/ "./src/components/common/pickers/PickerItem.module.scss"
/*!**************************************************************!*\
  !*** ./src/components/common/pickers/PickerItem.module.scss ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"OHkx_W75","clickable":"VUSwo4t5","separator":"P53DrbWA","disabled":"tvZeVJPh","title":"JSSC0N8V","subtitle":"OYmzCSp2","withAvatar":"dMT9byM6","multiline":"neXqB2_A","input":"kmjqObdP","startInput":"F0Hv3EQm","endInput":"iqGhSQGm","avatarElement":"dnAaRPCo"});

/***/ },

/***/ "./src/components/common/pickers/PickerStyles.module.scss"
/*!****************************************************************!*\
  !*** ./src/components/common/pickers/PickerStyles.module.scss ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"YmM5biTv","header":"S7WFT2bv","pickerCategoryTitle":"YK1300x2","sectionHeader":"_9MIoEHj_","peerChip":"gsKPBPoK","pickerList":"yLCbiItq","padded":"bXzIGw8s","noResults":"dXWKD0ve","onlineStatus":"d5GDOYh9"});

/***/ },

/***/ "./src/components/common/profile/RadialPatternBackground.module.scss"
/*!***************************************************************************!*\
  !*** ./src/components/common/profile/RadialPatternBackground.module.scss ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Af3tYFMg","withLinearGradient":"NorYkjxC","canvas":"GbpiDSS_","showing":"Y5FyX1oo"});

/***/ },

/***/ "./src/components/common/reactions/CustomEmojiEffect.module.scss"
/*!***********************************************************************!*\
  !*** ./src/components/common/reactions/CustomEmojiEffect.module.scss ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"aInga6VW","particle":"PZAuNVZH"});

/***/ },

/***/ "./src/components/common/reactions/ReactionAnimatedEmoji.module.scss"
/*!***************************************************************************!*\
  !*** ./src/components/common/reactions/ReactionAnimatedEmoji.module.scss ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"O9uCTt5C","animated-icon":"HiI6SMxF","animatedIcon":"HiI6SMxF","effect":"NhFcTGja","animating":"ikfZ6Igz","withEffectOnly":"jjRJmHCg"});

/***/ },

/***/ "./src/components/common/reactions/ReactionStaticEmoji.scss"
/*!******************************************************************!*\
  !*** ./src/components/common/reactions/ReactionStaticEmoji.scss ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/middle/message/InlineButtons.module.scss"
/*!*****************************************************************!*\
  !*** ./src/components/middle/message/InlineButtons.module.scss ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"XeRnHctE","button":"TwpITaqZ","cornerIcon":"GeJoOL5b","leftIcon":"o6PKoyTG","inlineButtonText":"H0WzDNYw","row":"tjRjLPPY","primaryTint":"xEZgdShr","successTint":"w0FLwaSo","destructiveTint":"_qPaYzWp","customEmojiIcon":"uu_z24Z9"});

/***/ },

/***/ "./src/components/middle/message/MessageContextMenu.scss"
/*!***************************************************************!*\
  !*** ./src/components/middle/message/MessageContextMenu.scss ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/middle/message/SimilarChannels.module.scss"
/*!*******************************************************************!*\
  !*** ./src/components/middle/message/SimilarChannels.module.scss ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"V3RHiOJR","notch":"tfG_BSDt","notch-path":"HVbeGv4t","notchPath":"HVbeGv4t","header":"s7QOi22Q","title":"JstcOhAN","close":"meewH7t_","icon":"d8axZxyN","skeleton":"xKVZv7KE","inner":"njAC8dR9","channelsWrapper":"z9UxFEb2","is-appearing":"eb8rX09E","isAppearing":"eb8rX09E","channels-appear":"AL2cLQ4i","channelsAppear":"AL2cLQ4i","is-hiding":"XR6_qLCc","isHiding":"XR6_qLCc","channels-disappear":"TwwnoiuD","channelsDisappear":"TwwnoiuD","channel-list":"h4gWlNen","channelList":"h4gWlNen","item":"glDpC2av","last-item":"MBChXyXk","lastItem":"MBChXyXk","avatar":"gqCs9fSo","badge":"gnYhwnvf","members-count":"HWgwnKui","membersCount":"HWgwnKui","channel-title":"BTNQ4KBH","channelTitle":"BTNQ4KBH","fake-avatar":"Xl9MVMTn","fakeAvatar":"Xl9MVMTn","fake-avatar-inner":"Qizai7yv","fakeAvatarInner":"Qizai7yv","last-fake-avatar":"JxSmtOFi","lastFakeAvatar":"JxSmtOFi"});

/***/ },

/***/ "./src/components/middle/message/TimeMenuItem.module.scss"
/*!****************************************************************!*\
  !*** ./src/components/middle/message/TimeMenuItem.module.scss ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"item":"C3LVl_JT","get":"bmxij_dk","skeleton":"cd1ZZeSy","transition":"mg4sBQ9n"});

/***/ },

/***/ "./src/components/middle/message/actions/NoForwardsRequest.module.scss"
/*!*****************************************************************************!*\
  !*** ./src/components/middle/message/actions/NoForwardsRequest.module.scss ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Eh8uZ8ui","title":"p_aoYa8S","list":"lnbOXT6x","item":"Iwbq9bfl","checkIcon":"dTSScHdV"});

/***/ },

/***/ "./src/components/middle/message/actions/StarGiftPurchaseOffer.module.scss"
/*!*********************************************************************************!*\
  !*** ./src/components/middle/message/actions/StarGiftPurchaseOffer.module.scss ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"gGU_fR0o","hasButtons":"O968zq9f","clickable":"_OxdCNdP","giftContainer":"sL_usxX1","uniqueBackgroundWrapper":"BKdiahua","uniqueBackground":"xMKL7_4P","stickerWrapper":"rJwgLZaq","info":"OI1EtWw7","title":"FPQhHJLz","subtitle":"SpzRt25a"});

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionButton.module.scss"
/*!****************************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionButton.module.scss ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"gXO57D98","chosen":"VXSJn0Sm","paid":"N3lcrsh8","outside":"Hqw10FGl","animated-emoji":"lFjoRm_p","animatedEmoji":"lFjoRm_p","tag":"Dr889Kzc","tail":"cUfY1b26","is-safari":"rxxUijuG","isSafari":"rxxUijuG","tail-fill":"y591o4fN","tailFill":"y591o4fN","tag-text":"ly7cruxF","tagText":"ly7cruxF","counter":"P2FqNJAi","disabled":"NRtGofbf","paidCounter":"CW4UO1n3"});

/***/ },

/***/ "./src/components/middle/message/reactions/ReactionSelector.scss"
/*!***********************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionSelector.scss ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/middle/message/reactions/ReactionSelectorReaction.module.scss"
/*!**************************************************************************************!*\
  !*** ./src/components/middle/message/reactions/ReactionSelectorReaction.module.scss ***!
  \**************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"uGUjDZKl","custom":"oc1hpMwv","visible":"kqcWe4tf","custom-animated":"sx6RTuAU","customAnimated":"sx6RTuAU","custom-fade-in":"_p445E1b","customFadeIn":"_p445E1b","chosen":"M62HGuIV","static-icon":"MZ2tH980","staticIcon":"MZ2tH980","lock":"WMpEr5XQ"});

/***/ },

/***/ "./src/components/middle/message/reactions/Reactions.scss"
/*!****************************************************************!*\
  !*** ./src/components/middle/message/reactions/Reactions.scss ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/modals/prompt/PromptDialog.module.scss"
/*!***************************************************************!*\
  !*** ./src/components/modals/prompt/PromptDialog.module.scss ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"subtitle":"cGrbcqD_"});

/***/ }

}]);
//# sourceMappingURL=src_components_common_AnimatedIconFromSticker_tsx-src_components_common_BadgeButton_tsx-src_c-a52457.f7d426c08ada697d425c.js.map
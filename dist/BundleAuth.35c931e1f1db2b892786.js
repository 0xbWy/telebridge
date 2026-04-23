"use strict";
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["BundleAuth"],{

/***/ "./src/bundles/auth.ts"
/*!*****************************!*\
  !*** ./src/bundles/auth.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthCode: () => (/* reexport safe */ _components_auth_AuthCode__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   AuthPassword: () => (/* reexport safe */ _components_auth_AuthPassword__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   AuthRegister: () => (/* reexport safe */ _components_auth_AuthRegister__WEBPACK_IMPORTED_MODULE_2__["default"])
/* harmony export */ });
/* harmony import */ var _components_auth_AuthCode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/auth/AuthCode */ "./src/components/auth/AuthCode.tsx");
/* harmony import */ var _components_auth_AuthPassword__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/auth/AuthPassword */ "./src/components/auth/AuthPassword.tsx");
/* harmony import */ var _components_auth_AuthRegister__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/auth/AuthRegister */ "./src/components/auth/AuthRegister.tsx");




/***/ },

/***/ "./src/components/auth/AuthCode.tsx"
/*!******************************************!*\
  !*** ./src/components/auth/AuthCode.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useHistoryBack */ "./src/hooks/useHistoryBack.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _common_TrackingMonkey__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/TrackingMonkey */ "./src/components/common/TrackingMonkey.tsx");
/* harmony import */ var _ui_InputText__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../ui/InputText */ "./src/components/ui/InputText.tsx");
/* harmony import */ var _ui_Loading__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../ui/Loading */ "./src/components/ui/Loading.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const CODE_LENGTH = 5;
const AuthCode = ({
  auth
}) => {
  const {
    setAuthCode,
    returnToAuthPhoneNumber,
    clearAuthErrorKey
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const {
    phoneNumber,
    isCodeViaApp,
    isLoading,
    errorKey
  } = auth;
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const inputRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [code, setCode] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [isTracking, setIsTracking] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [trackingDirection, setTrackingDirection] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV) {
      inputRef.current.focus();
    }
  }, []);
  (0,_hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_4__["default"])({
    isActive: true,
    onBack: returnToAuthPhoneNumber
  });
  const onCodeChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    if (errorKey) {
      clearAuthErrorKey();
    }
    const {
      currentTarget: target
    } = e;
    target.value = target.value.replace(/[^\d]+/, '').substr(0, CODE_LENGTH);
    if (target.value === code) {
      return;
    }
    setCode(target.value);
    if (!isTracking) {
      setIsTracking(true);
    } else if (!target.value.length) {
      setIsTracking(false);
    }
    if (code && code.length > target.value.length) {
      setTrackingDirection(-1);
    } else {
      setTrackingDirection(1);
    }
    if (target.value.length === CODE_LENGTH) {
      setAuthCode({
        code: target.value
      });
    }
  }, [errorKey, code, isTracking]);
  function handleReturnToAuthPhoneNumber() {
    returnToAuthPhoneNumber();
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    id: "auth-code-form",
    className: "custom-scroll",
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: "auth-form",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_TrackingMonkey__WEBPACK_IMPORTED_MODULE_7__["default"], {
        code: code,
        codeLength: CODE_LENGTH,
        isTracking: isTracking,
        trackingDirection: trackingDirection
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("h1", {
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
          className: "telebridge-glitch-title",
          "data-text": lang('AuthTitle'),
          children: lang('AuthTitle')
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: "auth-phone-number",
        children: [phoneNumber, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          className: "auth-number-edit div-button",
          onClick: handleReturnToAuthPhoneNumber,
          role: "button",
          tabIndex: 0,
          title: lang('WrongNumber'),
          "aria-label": lang('WrongNumber'),
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
            name: "edit"
          })
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p", {
        className: "note",
        children: lang(isCodeViaApp ? 'SentAppCode' : 'LoginJustSentSms', undefined, {
          withNodes: true,
          withMarkdown: true
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_InputText__WEBPACK_IMPORTED_MODULE_8__["default"], {
        ref: inputRef,
        id: "sign-in-code",
        label: lang('Code'),
        onInput: onCodeChange,
        value: code,
        error: errorKey && lang.withRegular(errorKey),
        autoComplete: "off",
        inputMode: "numeric"
      }), isLoading && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_ui_Loading__WEBPACK_IMPORTED_MODULE_9__["default"], {})]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_3__.pick)(global, ['auth']))(AuthCode)));

/***/ },

/***/ "./src/components/auth/AuthPassword.tsx"
/*!**********************************************!*\
  !*** ./src/components/auth/AuthPassword.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_PasswordForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/PasswordForm */ "./src/components/common/PasswordForm.tsx");
/* harmony import */ var _common_PasswordMonkey__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/PasswordMonkey */ "./src/components/common/PasswordMonkey.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const AuthPassword = ({
  auth
}) => {
  const {
    setAuthPassword,
    clearAuthErrorKey
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const {
    isLoading,
    errorKey,
    hint
  } = auth;
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const [showPassword, setShowPassword] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const handleChangePasswordVisibility = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(isVisible => {
    setShowPassword(isVisible);
  }, []);
  const handleSubmit = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(password => {
    setAuthPassword({
      password
    });
  }, [setAuthPassword]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    id: "auth-password-form",
    className: "custom-scroll",
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: "auth-form",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_common_PasswordMonkey__WEBPACK_IMPORTED_MODULE_5__["default"], {
        isPasswordVisible: showPassword
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h1", {
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
          className: "telebridge-glitch-title",
          "data-text": lang('AuthTitle'),
          children: lang('AuthTitle')
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "note",
        children: lang('LoginEnterPasswordDescription')
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_common_PasswordForm__WEBPACK_IMPORTED_MODULE_4__["default"], {
        onClearError: clearAuthErrorKey,
        error: errorKey && lang.withRegular(errorKey),
        hint: hint,
        isLoading: isLoading,
        isPasswordVisible: showPassword,
        onChangePasswordVisibility: handleChangePasswordVisibility,
        onSubmit: handleSubmit
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.pick)(global, ['auth']))(AuthPassword)));

/***/ },

/***/ "./src/components/auth/AuthRegister.tsx"
/*!**********************************************!*\
  !*** ./src/components/auth/AuthRegister.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _ui_AvatarEditable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ui/AvatarEditable */ "./src/components/ui/AvatarEditable.tsx");
/* harmony import */ var _ui_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ui/Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ui_InputText__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ui/InputText */ "./src/components/ui/InputText.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");








const AuthRegister = ({
  auth
}) => {
  const {
    signUp,
    clearAuthErrorKey,
    uploadProfilePhoto
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const {
    isLoading,
    errorKey
  } = auth;
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const [isButtonShown, setIsButtonShown] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [croppedFile, setCroppedFile] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [firstName, setFirstName] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [lastName, setLastName] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const handleFirstNameChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    if (errorKey) {
      clearAuthErrorKey();
    }
    const {
      target
    } = event;
    setFirstName(target.value);
    setIsButtonShown(target.value.length > 0);
  }, [errorKey]);
  const handleLastNameChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    const {
      target
    } = event;
    setLastName(target.value);
  }, []);
  function handleSubmit(event) {
    event.preventDefault();
    signUp({
      firstName,
      lastName
    });
    if (croppedFile) {
      uploadProfilePhoto({
        file: croppedFile
      });
    }
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
    id: "auth-registration-form",
    className: "custom-scroll",
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "auth-form",
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("form", {
        action: "",
        method: "post",
        onSubmit: handleSubmit,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_AvatarEditable__WEBPACK_IMPORTED_MODULE_4__["default"], {
          onChange: setCroppedFile
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h2", {
          children: lang('YourName')
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
          className: "note",
          children: lang('LoginRegisterDesc')
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_InputText__WEBPACK_IMPORTED_MODULE_6__["default"], {
          id: "registration-first-name",
          label: lang('LoginRegisterFirstNamePlaceholder'),
          onChange: handleFirstNameChange,
          value: firstName,
          error: errorKey && lang.withRegular(errorKey),
          autoComplete: "given-name"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_InputText__WEBPACK_IMPORTED_MODULE_6__["default"], {
          id: "registration-last-name",
          label: lang('LoginRegisterLastNamePlaceholder'),
          onChange: handleLastNameChange,
          value: lastName,
          autoComplete: "family-name"
        }), isButtonShown && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_ui_Button__WEBPACK_IMPORTED_MODULE_5__["default"], {
          type: "submit",
          ripple: true,
          isLoading: isLoading,
          children: lang('Next')
        })]
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.pick)(global, ['auth']))(AuthRegister)));

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

/***/ "./src/components/common/PasswordMonkey.tsx"
/*!**************************************************!*\
  !*** ./src/components/common/PasswordMonkey.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config */ "./src/config.ts");
/* harmony import */ var _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/animatedAssets */ "./src/components/common/helpers/animatedAssets.ts");
/* harmony import */ var _hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/schedulers/useTimeout */ "./src/hooks/schedulers/useTimeout.ts");
/* harmony import */ var _hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useAppLayout */ "./src/hooks/useAppLayout.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _AnimatedSticker__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./AnimatedSticker */ "./src/components/common/AnimatedSticker.tsx");
/* harmony import */ var _PasswordMonkey_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PasswordMonkey.scss */ "./src/components/common/PasswordMonkey.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const PEEK_MONKEY_SHOW_DELAY = 2000;
const SEGMENT_COVER_EYES = [0, 50];
const SEGMENT_UNCOVER_EYE = [0, 20];
const SEGMENT_COVER_EYE = [20, 0];
const PasswordMonkey = ({
  isPasswordVisible,
  isBig
}) => {
  const [isFirstMonkeyLoaded, markFirstMonkeyLoaded] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__["default"])(false);
  const [isPeekShown, markPeekShown] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__["default"])(false);
  const {
    isMobile
  } = (0,_hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const stikerSize = isMobile ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_AUTH_MOBILE : _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_AUTH;
  (0,_hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_3__["default"])(markPeekShown, PEEK_MONKEY_SHOW_DELAY);
  const handleFirstMonkeyLoad = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(markFirstMonkeyLoaded, [markFirstMonkeyLoaded]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    id: "monkey",
    className: isBig ? 'big' : '',
    children: [!isFirstMonkeyLoaded && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      className: "monkey-preview"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_6__["default"], {
      size: isBig ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_TWO_FA : stikerSize,
      className: isPeekShown ? 'hidden' : 'shown',
      tgsUrl: _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__.LOCAL_TGS_URLS.MonkeyClose,
      playSegment: SEGMENT_COVER_EYES,
      noLoop: true,
      onLoad: handleFirstMonkeyLoad
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_6__["default"], {
      size: isBig ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_TWO_FA : stikerSize,
      className: isPeekShown ? 'shown' : 'hidden',
      tgsUrl: _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__.LOCAL_TGS_URLS.MonkeyPeek,
      playSegment: isPasswordVisible ? SEGMENT_UNCOVER_EYE : SEGMENT_COVER_EYE,
      noLoop: true
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PasswordMonkey));

/***/ },

/***/ "./src/components/common/TrackingMonkey.tsx"
/*!**************************************************!*\
  !*** ./src/components/common/TrackingMonkey.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config */ "./src/config.ts");
/* harmony import */ var _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers/animatedAssets */ "./src/components/common/helpers/animatedAssets.ts");
/* harmony import */ var _hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useAppLayout */ "./src/hooks/useAppLayout.ts");
/* harmony import */ var _AnimatedSticker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AnimatedSticker */ "./src/components/common/AnimatedSticker.tsx");
/* harmony import */ var _PasswordMonkey_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./PasswordMonkey.scss */ "./src/components/common/PasswordMonkey.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const TRACKING_START_FRAME = 15;
const TRACKING_END_FRAME = 180;
const TrackingMonkey = ({
  code,
  codeLength,
  trackingDirection,
  isTracking,
  isBig
}) => {
  const [isFirstMonkeyLoaded, setIsFirstMonkeyLoaded] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    isMobile
  } = (0,_hooks_useAppLayout__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const trackningFramesPerSymbol = (TRACKING_END_FRAME - TRACKING_START_FRAME) / codeLength;
  const stickerSize = isMobile ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_AUTH_MOBILE : _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_AUTH;
  const handleFirstMonkeyLoad = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => setIsFirstMonkeyLoaded(true), []);
  function getTrackingFrames() {
    const startFrame = code && code.length > 1 || trackingDirection < 0 ? TRACKING_START_FRAME + trackningFramesPerSymbol * (code.length - 1) : 0;
    const endFrame = code.length === codeLength ? TRACKING_END_FRAME : TRACKING_START_FRAME + trackningFramesPerSymbol * code.length;
    if (trackingDirection < 1) {
      return [endFrame, startFrame];
    }
    return [startFrame, endFrame];
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    id: "monkey",
    className: isBig ? 'big' : '',
    children: [!isFirstMonkeyLoaded && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "monkey-preview"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_4__["default"], {
      size: isBig ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_TWO_FA : stickerSize,
      className: isTracking ? 'hidden' : undefined,
      tgsUrl: _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__.LOCAL_TGS_URLS.MonkeyIdle,
      play: !isTracking,
      onLoad: handleFirstMonkeyLoad
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_AnimatedSticker__WEBPACK_IMPORTED_MODULE_4__["default"], {
      size: isBig ? _config__WEBPACK_IMPORTED_MODULE_1__.STICKER_SIZE_TWO_FA : stickerSize,
      className: !isTracking ? 'hidden' : 'shown',
      tgsUrl: _helpers_animatedAssets__WEBPACK_IMPORTED_MODULE_2__.LOCAL_TGS_URLS.MonkeyTracking,
      playSegment: isTracking ? getTrackingFrames() : undefined,
      speed: 2,
      noLoop: true
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TrackingMonkey));

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

/***/ "./src/components/common/PasswordMonkey.scss"
/*!***************************************************!*\
  !*** ./src/components/common/PasswordMonkey.scss ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }

}]);
//# sourceMappingURL=BundleAuth.35c931e1f1db2b892786.js.map
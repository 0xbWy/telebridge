"use strict";
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["shared-components"],{

/***/ "./src/components/ui/AvatarEditable.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/AvatarEditable.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _CropModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CropModal */ "./src/components/ui/CropModal.tsx");
/* harmony import */ var _AvatarEditable_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./AvatarEditable.scss */ "./src/components/ui/AvatarEditable.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const AvatarEditable = ({
  title,
  disabled,
  isForForum,
  currentAvatarBlobUrl,
  onChange
}) => {
  const [selectedFile, setSelectedFile] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [croppedBlobUrl, setCroppedBlobUrl] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(currentAvatarBlobUrl);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setCroppedBlobUrl(currentAvatarBlobUrl);
  }, [currentAvatarBlobUrl]);
  function handleSelectFile(event) {
    const target = event.target;
    if (!target?.files?.[0]) {
      return;
    }
    setSelectedFile(target.files[0]);
    target.value = '';
  }
  const handleAvatarCrop = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(croppedImg => {
    setSelectedFile(undefined);
    onChange(croppedImg);
    if (croppedBlobUrl && croppedBlobUrl !== currentAvatarBlobUrl) {
      URL.revokeObjectURL(croppedBlobUrl);
    }
    setCroppedBlobUrl(URL.createObjectURL(croppedImg));
  }, [croppedBlobUrl, currentAvatarBlobUrl, onChange]);
  const handleModalClose = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setSelectedFile(undefined);
  }, []);
  const labelClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(croppedBlobUrl && 'filled', disabled && 'disabled', isForForum && 'rounded-square');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "AvatarEditable",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("label", {
      className: labelClassName,
      role: "button",
      tabIndex: 0,
      title: title || lang('ChangeYourProfilePicture'),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("input", {
        type: "file",
        onChange: handleSelectFile,
        accept: "image/png, image/jpeg"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_3__["default"], {
        name: "camera-add"
      }), croppedBlobUrl && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: croppedBlobUrl,
        draggable: false,
        alt: ""
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CropModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
      file: selectedFile,
      onClose: handleModalClose,
      onChange: handleAvatarCrop
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(AvatarEditable));

/***/ },

/***/ "./src/components/ui/Badge.tsx"
/*!*************************************!*\
  !*** ./src/components/ui/Badge.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/AnimatedCounter */ "./src/components/common/AnimatedCounter.tsx");
/* harmony import */ var _ShowTransition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ShowTransition */ "./src/components/ui/ShowTransition.tsx");
/* harmony import */ var _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Badge.module.scss */ "./src/components/ui/Badge.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const Badge = ({
  text,
  className,
  isAlternateColor
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_ShowTransition__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].root, isAlternateColor ? _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].alternate : _Badge_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"]["default"], className),
    isOpen: Boolean(text),
    children: text && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_2__["default"], {
      text: text
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Badge));

/***/ },

/***/ "./src/components/ui/CheckboxGroup.tsx"
/*!*********************************************!*\
  !*** ./src/components/ui/CheckboxGroup.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_iteratees__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/iteratees */ "./src/util/iteratees.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Checkbox */ "./src/components/ui/Checkbox.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const CheckboxGroup = ({
  id,
  options,
  selected,
  disabled,
  nestedCheckbox,
  loadingOptions,
  isRound,
  onChange,
  onClickLabel,
  className
}) => {
  const handleChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])((event, nestedOptionList) => {
    const {
      value,
      checked
    } = event.currentTarget;
    let newValues;
    if (checked) {
      newValues = (0,_util_iteratees__WEBPACK_IMPORTED_MODULE_2__.unique)([...selected, value]);
      nestedOptionList?.forEach(nestedOption => {
        if (!newValues.includes(nestedOption.value)) {
          newValues.push(nestedOption.value);
        }
      });
    } else {
      newValues = selected.filter(v => v !== value);
      if (nestedOptionList) {
        newValues = newValues.filter(v => !nestedOptionList.some(nestedOption => nestedOption.value === v));
      }
    }
    onChange(newValues);
  });
  const getCheckedNestedCount = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(nestedOptions => {
    const checkedCount = nestedOptions?.filter(nestedOption => selected.includes(nestedOption.value)).length;
    return checkedCount > 0 ? checkedCount : nestedOptions.length;
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    id: id,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('radio-group', className),
    children: options.map(option => {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Checkbox__WEBPACK_IMPORTED_MODULE_4__["default"], {
        label: option.label,
        subLabel: option.subLabel,
        value: option.value,
        peer: option.peer,
        checked: selected?.indexOf(option.value) !== -1,
        disabled: option.disabled || disabled,
        isLoading: loadingOptions ? loadingOptions.indexOf(option.value) !== -1 : undefined,
        onChange: handleChange,
        onClickLabel: onClickLabel,
        nestedCheckbox: nestedCheckbox,
        nestedCheckboxCount: getCheckedNestedCount(option.nestedOptions ?? []),
        nestedOptionList: option.nestedOptions,
        values: selected,
        isRound: isRound
      });
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CheckboxGroup));

/***/ },

/***/ "./src/components/ui/ConfirmDialog.tsx"
/*!*********************************************!*\
  !*** ./src/components/ui/ConfirmDialog.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useKeyboardListNavigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useKeyboardListNavigation */ "./src/hooks/useKeyboardListNavigation.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const ConfirmDialog = ({
  isOpen,
  title,
  noDefaultTitle,
  header,
  text,
  textParts,
  confirmLabel,
  confirmIsDestructive,
  isConfirmDisabled,
  isOnlyConfirm,
  areButtonsInColumn,
  className,
  children,
  confirmHandler,
  onClose,
  onCloseAnimationEnd
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const handleSelectWithEnter = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(index => {
    if (index === -1) confirmHandler();
  }, [confirmHandler]);
  const handleKeyDown = (0,_hooks_useKeyboardListNavigation__WEBPACK_IMPORTED_MODULE_2__["default"])(containerRef, isOpen, handleSelectWithEnter, '.Button');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_Modal__WEBPACK_IMPORTED_MODULE_5__["default"], {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('confirm', className),
    title: title || (!noDefaultTitle ? lang('Telegram') : undefined),
    header: header,
    isOpen: isOpen,
    onClose: onClose,
    onCloseAnimationEnd: onCloseAnimationEnd,
    children: [text && text.split('\\n').map(textPart => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      children: textPart
    })), textParts || children, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
      className: areButtonsInColumn ? 'dialog-buttons-column' : 'dialog-buttons mt-2',
      ref: containerRef,
      onKeyDown: handleKeyDown,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "confirm-dialog-button",
        isText: true,
        inline: true,
        onClick: confirmHandler,
        color: confirmIsDestructive ? 'danger' : 'primary',
        disabled: isConfirmDisabled,
        children: confirmLabel || lang('GeneralConfirm')
      }), !isOnlyConfirm && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_4__["default"], {
        className: "confirm-dialog-button",
        isText: true,
        onClick: onClose,
        children: lang('Cancel')
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ConfirmDialog));

/***/ },

/***/ "./src/components/ui/CropModal.tsx"
/*!*****************************************!*\
  !*** ./src/components/ui/CropModal.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useImageLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useImageLoader */ "./src/hooks/useImageLoader.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _ImageCropper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ImageCropper */ "./src/components/ui/ImageCropper.tsx");
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Modal */ "./src/components/ui/Modal.tsx");
/* harmony import */ var _CropModal_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CropModal.scss */ "./src/components/ui/CropModal.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const MAX_OUTPUT_SIZE = 1024;
const MIN_OUTPUT_SIZE = 256;
const CropModal = ({
  file,
  onChange,
  onClose
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const {
    image
  } = (0,_hooks_useImageLoader__WEBPACK_IMPORTED_MODULE_1__["default"])(file);
  const isOpen = Boolean(file) && Boolean(image);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Modal__WEBPACK_IMPORTED_MODULE_4__["default"], {
    isOpen: isOpen,
    onClose: onClose,
    title: lang('CropperTitle'),
    className: "CropModal",
    hasCloseButton: true,
    isCondensedHeader: true,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_ImageCropper__WEBPACK_IMPORTED_MODULE_3__["default"], {
      onChange: onChange,
      image: image,
      maxOutputSize: MAX_OUTPUT_SIZE,
      minOutputSize: MIN_OUTPUT_SIZE
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CropModal));

/***/ },

/***/ "./src/components/ui/Draggable.tsx"
/*!*****************************************!*\
  !*** ./src/components/ui/Draggable.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Draggable.module.scss */ "./src/components/ui/Draggable.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");








const ZERO_POINT = {
  x: 0,
  y: 0
};
const Draggable = ({
  children,
  id,
  onDrag,
  onDragEnd,
  style: externalStyle,
  knobStyle,
  isDisabled
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_4__["default"])();
  const ref = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [state, setState] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    isDragging: false,
    origin: ZERO_POINT,
    translation: ZERO_POINT
  });
  const handleMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();
    const {
      x,
      y
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__["default"])(e);
    setState({
      ...state,
      isDragging: true,
      origin: {
        x,
        y
      },
      width: ref.current?.offsetWidth,
      height: ref.current?.offsetHeight
    });
  };
  const handleMouseMove = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const {
      x,
      y
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_3__["default"])(e);
    const translation = {
      x: x - state.origin.x,
      y: y - state.origin.y
    };
    setState(current => ({
      ...current,
      translation
    }));
    onDrag(translation, id);
  }, [id, onDrag, state.origin.x, state.origin.y]);
  const handleMouseUp = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setState(current => ({
      ...current,
      isDragging: false,
      width: undefined,
      height: undefined
    }));
    onDragEnd();
  }, [onDragEnd]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (state.isDragging && isDisabled) {
      setState(current => ({
        ...current,
        isDragging: false,
        width: undefined,
        height: undefined
      }));
    }
  }, [isDisabled, state.isDragging]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (state.isDragging) {
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchcancel', handleMouseUp);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchcancel', handleMouseUp);
      window.removeEventListener('mouseup', handleMouseUp);
      setState(current => ({
        ...current,
        translation: ZERO_POINT
      }));
    }
    return () => {
      if (state.isDragging) {
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
        window.removeEventListener('touchcancel', handleMouseUp);
        window.removeEventListener('mouseup', handleMouseUp);
      }
    };
  }, [handleMouseMove, handleMouseUp, state.isDragging]);
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].container, state.isDragging && _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].isDragging);
  const cssStyles = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(state.isDragging && `transform: translate(${state.translation.x}px, ${state.translation.y}px)`, state.width ? `width: ${state.width}px` : undefined, state.height ? `height: ${state.height}px` : undefined, externalStyle);
  }, [externalStyle, state.height, state.isDragging, state.translation.x, state.translation.y, state.width]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    style: cssStyles,
    className: fullClassName,
    ref: ref,
    children: [children, !isDisabled && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      "aria-label": lang('i18n_dragToSort'),
      tabIndex: 0,
      role: "button",
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].knob, 'div-button', 'draggable-knob'),
      onMouseDown: handleMouseDown,
      onTouchStart: handleMouseDown,
      style: knobStyle,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_5__["default"], {
        name: "sort",
        className: _Draggable_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].icon
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Draggable));

/***/ },

/***/ "./src/components/ui/ExpandableText.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/ExpandableText.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useResizeObserver */ "./src/hooks/useResizeObserver.ts");
/* harmony import */ var _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ExpandableText.module.scss */ "./src/components/ui/ExpandableText.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const DEFAULT_COLLAPSED_HEIGHT = 4.1875 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
const ExpandableText = ({
  text,
  collapsedHeight = DEFAULT_COLLAPSED_HEIGHT,
  className
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const [isExpanded, expand, collapse] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__["default"])(false);
  const [expandedHeight, setExpandedHeight] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [shouldTruncate, setShouldTruncate] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const contentRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const displayText = text || '';
  const canExpand = shouldTruncate;
  const measureTruncation = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(() => {
      if (!contentRef.current) return;
      setShouldTruncate(contentRef.current.scrollHeight > collapsedHeight);
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    measureTruncation();
  }, [displayText, collapsedHeight, measureTruncation]);
  (0,_hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_7__["default"])(contentRef, measureTruncation);
  const handleToggleExpand = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    if (isExpanded) {
      collapse();
    } else {
      if (contentRef.current) {
        setExpandedHeight(contentRef.current.scrollHeight);
      }
      expand();
    }
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].root, !isExpanded && canExpand && _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].truncated, className),
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
      className: _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].inner,
      style: isExpanded && expandedHeight ? `height: ${expandedHeight}px` : `height: ${collapsedHeight / _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM}rem`,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        ref: contentRef,
        className: _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].content,
        children: displayText
      })
    }), canExpand && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
      className: _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].moreLinkWrapper,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
        className: _ExpandableText_module_scss__WEBPACK_IMPORTED_MODULE_8__["default"].moreLink,
        onClick: handleToggleExpand,
        children: lang(isExpanded ? 'TextShowLess' : 'TextShowMore')
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ExpandableText));

/***/ },

/***/ "./src/components/ui/FloatingActionButton.tsx"
/*!****************************************************!*\
  !*** ./src/components/ui/FloatingActionButton.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_IconWithSpinner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/IconWithSpinner */ "./src/components/common/IconWithSpinner.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _FloatingActionButton_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FloatingActionButton.scss */ "./src/components/ui/FloatingActionButton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const FloatingActionButton = ({
  isShown,
  iconName,
  className,
  color = 'primary',
  ariaLabel,
  disabled,
  isLoading,
  onClick
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const buttonClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])('FloatingActionButton', isShown && 'revealed', className);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: buttonClassName,
    color: color,
    round: true,
    disabled: disabled,
    onClick: isShown && !disabled ? onClick : undefined,
    ariaLabel: ariaLabel,
    tabIndex: -1,
    isRtl: lang.isRtl,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_common_IconWithSpinner__WEBPACK_IMPORTED_MODULE_2__["default"], {
      iconName: iconName,
      isLoading: isLoading
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FloatingActionButton);

/***/ },

/***/ "./src/components/ui/Folder.tsx"
/*!**************************************!*\
  !*** ./src/components/ui/Folder.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_FolderIcon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/FolderIcon */ "./src/components/common/FolderIcon.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Folder.module.scss */ "./src/components/ui/Folder.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const Folder = ({
  className,
  title,
  isActive,
  isBlocked,
  badgeCount,
  isBadgeActive,
  contextActions,
  contextRootElementSelector,
  icon,
  clickArg,
  onClick
}) => {
  const folderRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [isHovering, markHovering, unmarkHovering] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const {
    contextMenuAnchor,
    handleContextMenu,
    handleBeforeContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
    isContextMenuOpen
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_3__["default"])(folderRef, !contextActions);
  const {
    handleClick,
    handleMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_4__.useFastClick)(e => {
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.type === 'mousedown' && e.button !== _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.MouseButton.Main) {
      return;
    }
    onClick?.(clickArg);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => folderRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => contextRootElementSelector ? folderRef.current.closest(contextRootElementSelector) : document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.querySelector(`.${_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].contextMenu} .bubble`));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ({
    withPortal: true
  }));
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].folder, isActive && _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].active, className),
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
    onMouseEnter: markHovering,
    onMouseLeave: unmarkHovering,
    ref: folderRef,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].icon,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_FolderIcon__WEBPACK_IMPORTED_MODULE_7__["default"], {
        emoji: typeof icon === 'string' ? icon : undefined,
        customEmojiId: typeof icon === 'object' ? icon.documentId : undefined,
        shouldAnimate: isHovering
      }), Boolean(badgeCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(_Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].badge, isBadgeActive && _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].badgeActive),
        children: badgeCount
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("span", {
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].inner,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
        className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].title,
        children: [isBlocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
          name: "lock-badge",
          className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].blocked
        }), title]
      })
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_9__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: _Folder_module_scss__WEBPACK_IMPORTED_MODULE_12__["default"].contextMenu,
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: true,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_11__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_10__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: action.title
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Folder);

/***/ },

/***/ "./src/components/ui/ImageCropper.tsx"
/*!********************************************!*\
  !*** ./src/components/ui/ImageCropper.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/files */ "./src/util/files.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/math */ "./src/util/math.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/window/useWindowSize */ "./src/hooks/window/useWindowSize.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _RangeSlider__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./RangeSlider */ "./src/components/ui/RangeSlider.tsx");
/* harmony import */ var _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ImageCropper.module.scss */ "./src/components/ui/ImageCropper.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");












const PREVIEW_SIZE = 400;
const MIN_ZOOM = 100;
const MAX_ZOOM = 200;
const CROP_AREA_INSET = 0.125 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM;
const MODAL_INLINE_PADDING = _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_5__.REM * 2;
const ImageCropper = ({
  onChange,
  image,
  maxOutputSize,
  minOutputSize
}) => {
  const [imagePosition, setImagePosition] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    x: 0,
    y: 0
  });
  const [zoom, setZoom] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(MIN_ZOOM);
  const isDraggingRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const lastMousePositionRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const lastImagePositionRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const {
    width: windowWidth
  } = (0,_hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const previewContainerSize = Math.min(PREVIEW_SIZE, windowWidth - MODAL_INLINE_PADDING * 2);
  const scaleFactor = image ? Math.max(previewContainerSize / image.width, previewContainerSize / image.height) : 1;
  const zoomFactor = scaleFactor * zoom / 100;
  const previewImageSize = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!image) return {
      width: 0,
      height: 0
    };
    return {
      width: image.width * zoomFactor,
      height: image.height * zoomFactor
    };
  }, [image, zoomFactor]);
  const clampPosition = (x, y, previewSize) => {
    const radius = previewContainerSize / 2;
    const imgHalfWidth = previewSize.width / 2;
    const imgHalfHeight = previewSize.height / 2;
    const maxOffsetX = Math.max(0, imgHalfWidth - radius);
    const maxOffsetY = Math.max(0, imgHalfHeight - radius);
    return {
      x: (0,_util_math__WEBPACK_IMPORTED_MODULE_4__.clamp)(x, -maxOffsetX, maxOffsetX),
      y: (0,_util_math__WEBPACK_IMPORTED_MODULE_4__.clamp)(y, -maxOffsetY, maxOffsetY)
    };
  };
  const startDrag = e => {
    isDraggingRef.current = true;
    lastMousePositionRef.current = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    lastImagePositionRef.current = {
      ...imagePosition
    };
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
  };
  const moveDrag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    if ('touches' in e && e.touches.length > 1) return;
    if (!isDraggingRef.current) return;
    const {
      x: mouseX,
      y: mouseY
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    const deltaX = mouseX - lastMousePositionRef.current.x;
    const deltaY = mouseY - lastMousePositionRef.current.y;
    const newPosition = clampPosition(lastImagePositionRef.current.x + deltaX, lastImagePositionRef.current.y + deltaY, previewImageSize);
    setImagePosition(newPosition);
  });
  const endDrag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', moveDrag);
    document.removeEventListener('touchmove', moveDrag);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchend', endDrag);
  });
  const handleZoomChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(newZoom => {
    const newZoomFactor = scaleFactor * newZoom / 100;
    const newPreviewImageSize = {
      width: image.width * newZoomFactor,
      height: image.height * newZoomFactor
    };
    const ratio = newZoom / zoom;
    const newPosition = clampPosition(imagePosition.x * ratio, imagePosition.y * ratio, newPreviewImageSize);
    setZoom(newZoom);
    setImagePosition(newPosition);
  });
  const handleCrop = () => {
    if (!image) return;
    const cropSize = previewContainerSize / zoomFactor;
    const cropX = image.width / 2 - cropSize / 2 - imagePosition.x / zoomFactor;
    const cropY = image.height / 2 - cropSize / 2 - imagePosition.y / zoomFactor;
    const outputSize = Math.min(maxOutputSize, Math.max(minOutputSize, cropSize));
    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, cropX, cropY, cropSize, cropSize, 0, 0, outputSize, outputSize);
    canvas.toBlob(blob => {
      if (blob) onChange((0,_util_files__WEBPACK_IMPORTED_MODULE_3__.blobToFile)(blob, 'avatar.jpg'));
    }, 'image/jpeg');
  };
  if (!image) return undefined;
  const imageLeft = (previewContainerSize - previewImageSize.width) / 2 + imagePosition.x;
  const imageTop = (previewContainerSize - previewImageSize.height) / 2 + imagePosition.y;
  const backgroundImageStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewImageSize.width}px`, `height: ${previewImageSize.height}px`, `left: ${imageLeft}px`, `top: ${imageTop}px`);
  const foregroundImageStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewImageSize.width}px`, `height: ${previewImageSize.height}px`, `left: ${imageLeft - CROP_AREA_INSET}px`, `top: ${imageTop - CROP_AREA_INSET}px`);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].previewContainer,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_1__["default"])(`width: ${previewContainerSize}px`, `height: ${previewContainerSize}px`),
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
        src: image.src,
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].backgroundImage,
        style: backgroundImageStyle,
        draggable: false,
        onMouseDown: startDrag,
        onTouchStart: startDrag,
        alt: "",
        role: "presentation"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].previewMask
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].cropArea,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("img", {
          src: image.src,
          className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].foregroundImage,
          style: foregroundImageStyle,
          draggable: false,
          alt: "",
          role: "presentation"
        })
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].bottomControls,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_RangeSlider__WEBPACK_IMPORTED_MODULE_9__["default"], {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].zoomSlider,
        min: MIN_ZOOM,
        max: MAX_ZOOM,
        value: zoom,
        onChange: handleZoomChange
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_8__["default"], {
        className: _ImageCropper_module_scss__WEBPACK_IMPORTED_MODULE_10__["default"].confirmButton,
        round: true,
        color: "primary",
        iconName: "check",
        onClick: handleCrop,
        ariaLabel: "Crop"
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ImageCropper));

/***/ },

/***/ "./src/components/ui/InfiniteScroll.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/InfiniteScroll.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../types */ "./src/types/index.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_resetScroll__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/resetScroll */ "./src/util/resetScroll.ts");
/* harmony import */ var _util_schedulers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../util/schedulers */ "./src/util/schedulers.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const DEFAULT_LIST_SELECTOR = '.ListItem';
const DEFAULT_PRELOAD_BACKWARDS = 20;
const DEFAULT_SENSITIVE_AREA = 800;
const InfiniteScroll = ({
  ref,
  style,
  className,
  items,
  itemSelector = DEFAULT_LIST_SELECTOR,
  preloadBackwards = DEFAULT_PRELOAD_BACKWARDS,
  sensitiveArea = DEFAULT_SENSITIVE_AREA,
  withAbsolutePositioning,
  maxHeight,
  // Used to turn off restoring scroll position (e.g. for frequently re-ordered chat or user lists)
  noScrollRestore = false,
  noScrollRestoreOnTop = false,
  noFastList,
  // Used to re-query `listItemElements` if rendering is delayed by transition
  cacheBuster,
  beforeChildren,
  children,
  scrollContainerClosest,
  onLoadMore,
  onScroll,
  onWheel,
  onClick,
  onKeyDown
}) => {
  let containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  const stateRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)({});
  const [loadMoreBackwards, loadMoreForwards] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!onLoadMore) {
      return [];
    }
    return [(0,_util_schedulers__WEBPACK_IMPORTED_MODULE_6__.debounce)((noScroll = false) => {
      onLoadMore({
        direction: _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Backwards,
        noScroll
      });
    }, 1000, true, false), (0,_util_schedulers__WEBPACK_IMPORTED_MODULE_6__.debounce)(() => {
      onLoadMore({
        direction: _types__WEBPACK_IMPORTED_MODULE_1__.LoadMoreDirection.Forwards
      });
    }, 1000, true, false)];
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [onLoadMore, items]);

  // Initial preload
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    if (!loadMoreBackwards || !scrollContainer) {
      return;
    }
    if (preloadBackwards > 0 && (!items || items.length < preloadBackwards)) {
      loadMoreBackwards(true);
      return;
    }
    const {
      scrollHeight,
      clientHeight
    } = scrollContainer;
    if (clientHeight && scrollHeight < clientHeight) {
      loadMoreBackwards();
    }
  }, [items, loadMoreBackwards, preloadBackwards, scrollContainerClosest]);

  // Restore `scrollTop` after adding items
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    const container = containerRef.current;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_2__.requestForcedReflow)(() => {
      const state = stateRef.current;
      state.listItemElements = container.querySelectorAll(itemSelector);
      let newScrollTop;
      if (state.currentAnchor && Array.from(state.listItemElements).includes(state.currentAnchor)) {
        const {
          scrollTop
        } = scrollContainer;
        const newAnchorTop = state.currentAnchor.getBoundingClientRect().top;
        newScrollTop = scrollTop + (newAnchorTop - state.currentAnchorTop);
      } else {
        const nextAnchor = state.listItemElements[0];
        if (nextAnchor) {
          state.currentAnchor = nextAnchor;
          state.currentAnchorTop = nextAnchor.getBoundingClientRect().top;
        }
      }
      if (withAbsolutePositioning || noScrollRestore) {
        return undefined;
      }
      const {
        scrollTop
      } = scrollContainer;
      if (noScrollRestoreOnTop && scrollTop === 0) {
        return undefined;
      }
      return () => {
        (0,_util_resetScroll__WEBPACK_IMPORTED_MODULE_5__["default"])(scrollContainer, newScrollTop);
        state.isScrollTopJustUpdated = true;
      };
    });
  }, [items, itemSelector, noScrollRestore, noScrollRestoreOnTop, cacheBuster, withAbsolutePositioning, scrollContainerClosest]);
  const handleScroll = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_7__["default"])(e => {
    if (loadMoreForwards && loadMoreBackwards) {
      const {
        isScrollTopJustUpdated,
        currentAnchor,
        currentAnchorTop
      } = stateRef.current;
      const listItemElements = stateRef.current.listItemElements;
      if (isScrollTopJustUpdated) {
        stateRef.current.isScrollTopJustUpdated = false;
        return;
      }
      const listLength = listItemElements.length;
      const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
      const {
        scrollTop,
        scrollHeight,
        offsetHeight
      } = scrollContainer;
      const top = listLength ? listItemElements[0].offsetTop : 0;
      const isNearTop = scrollTop <= top + sensitiveArea;
      const bottom = listLength ? listItemElements[listLength - 1].offsetTop + listItemElements[listLength - 1].offsetHeight : scrollHeight;
      const isNearBottom = bottom - (scrollTop + offsetHeight) <= sensitiveArea;
      let isUpdated = false;
      if (isNearTop) {
        const nextAnchor = listItemElements[0];
        if (nextAnchor) {
          const nextAnchorTop = nextAnchor.getBoundingClientRect().top;
          const newAnchorTop = currentAnchor?.offsetParent && currentAnchor !== nextAnchor ? currentAnchor.getBoundingClientRect().top : nextAnchorTop;
          const isMovingUp = currentAnchor && currentAnchorTop !== undefined && newAnchorTop > currentAnchorTop;
          if (isMovingUp) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchorTop;
            isUpdated = true;
            loadMoreForwards();
          }
        }
      }
      if (isNearBottom) {
        const nextAnchor = listItemElements[listLength - 1];
        if (nextAnchor) {
          const nextAnchorTop = nextAnchor.getBoundingClientRect().top;
          const newAnchorTop = currentAnchor?.offsetParent && currentAnchor !== nextAnchor ? currentAnchor.getBoundingClientRect().top : nextAnchorTop;
          const isMovingDown = currentAnchor && currentAnchorTop !== undefined && newAnchorTop < currentAnchorTop;
          if (isMovingDown) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchorTop;
            isUpdated = true;
            loadMoreBackwards();
          }
        }
      }
      if (!isUpdated) {
        if (currentAnchor?.offsetParent) {
          stateRef.current.currentAnchorTop = currentAnchor.getBoundingClientRect().top;
        } else {
          const nextAnchor = listItemElements[0];
          if (nextAnchor) {
            stateRef.current.currentAnchor = nextAnchor;
            stateRef.current.currentAnchorTop = nextAnchor.getBoundingClientRect().top;
          }
        }
      }
    }
    if (onScroll) {
      onScroll(e);
    }
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const scrollContainer = scrollContainerClosest ? containerRef.current.closest(scrollContainerClosest) : containerRef.current;
    if (!scrollContainer) return undefined;
    const handleNativeScroll = e => handleScroll(e);
    scrollContainer.addEventListener('scroll', handleNativeScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleNativeScroll);
    };
  }, [handleScroll, scrollContainerClosest]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    ref: containerRef,
    className: className,
    style: style,
    teactFastList: !noFastList && !withAbsolutePositioning,
    onClick: onClick,
    onKeyDown: onKeyDown,
    onWheel: onWheel,
    children: [beforeChildren, withAbsolutePositioning && items?.length ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      teactFastList: !noFastList,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_4__["default"])('position: relative', _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_ANDROID && `height: ${maxHeight}px`),
      children: children
    }) : children]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (InfiniteScroll);

/***/ },

/***/ "./src/components/ui/ListItem.tsx"
/*!****************************************!*\
  !*** ./src/components/ui/ListItem.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _RippleEffect__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./RippleEffect */ "./src/components/ui/RippleEffect.tsx");
/* harmony import */ var _ListItem_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ListItem.scss */ "./src/components/ui/ListItem.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


















const ListItem = ({
  ref,
  buttonRef,
  icon,
  iconClassName,
  leftElement,
  buttonClassName,
  menuBubbleClassName,
  secondaryIcon,
  secondaryIconClassName,
  rightElement,
  className,
  style,
  children,
  disabled,
  allowDisabledClick,
  ripple,
  narrow,
  inactive,
  focus,
  destructive,
  withPrimaryColor,
  multiline,
  isStatic,
  allowSelection,
  withColorTransition,
  contextActions,
  withPortalForMenu,
  href,
  nonInteractive,
  onClick,
  clickArg,
  onMouseDown,
  onContextMenu,
  onSecondaryIconClick,
  onDragEnter,
  onDragLeave
}) => {
  let containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    containerRef = ref;
  }
  const menuRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [isTouched, markIsTouched, unmarkIsTouched] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleBeforeContextMenu,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__["default"])(containerRef, !contextActions);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => containerRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => containerRef.current.closest('.custom-scroll'));
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => menuRef.current);
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(() => ({
    withPortal: withPortalForMenu
  }));
  const handleClickEvent = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    const hasModifierKey = e.ctrlKey || e.metaKey || e.shiftKey;
    if (!hasModifierKey && e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      if (href && !onClick) return; // Allow default behavior for opening links
      e.preventDefault();
    }
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    if (disabled && !allowDisabledClick) {
      return;
    }
    if (href) {
      // Allow default behavior for opening links in new tab
      const hasModifierKey = e.ctrlKey || e.metaKey || e.shiftKey;
      if (hasModifierKey && e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main || e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Auxiliary) {
        return;
      }
      if (onClick) e.preventDefault();
    }
    if (!onClick) return;
    onClick(e, clickArg);
    if (_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV && !ripple) {
      markIsTouched();
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(unmarkIsTouched);
    }
  });
  const {
    handleClick: handleSecondaryIconClick,
    handleMouseDown: handleSecondaryIconMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_6__.useFastClick)(e => {
    if (disabled && !allowDisabledClick || e.button !== 0 || !onSecondaryIconClick && !contextActions) return;
    e.stopPropagation();
    if (onSecondaryIconClick) {
      onSecondaryIconClick(e);
    } else {
      handleContextMenu(e);
    }
  });
  const handleMouseDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_9__["default"])(e => {
    if (inactive || _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV) {
      return;
    }
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      if (!onClick) {
        handleContextMenu(e);
      } else {
        handleClick(e);
      }
    }
  });
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem', className, allowSelection && 'allow-selection', ripple && 'has-ripple', narrow && 'narrow', disabled && 'disabled', allowDisabledClick && 'click-allowed', inactive && 'inactive', contextMenuAnchor && 'has-menu-open', focus && 'focus', destructive && 'destructive', withPrimaryColor && 'primary', multiline && 'multiline', isStatic && 'is-static', withColorTransition && 'with-color-transition');
  const ButtonElementTag = href ? 'a' : 'div';
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
    ref: containerRef,
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    style: style,
    onMouseDown: onMouseDown,
    onDragEnter: onDragEnter,
    onDragLeave: onDragLeave,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(ButtonElementTag, {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem-button', isTouched && 'active', buttonClassName),
      role: !isStatic && !href ? 'button' : undefined,
      href: href
      // @ts-expect-error TS requires specific types for refs
      ,
      ref: buttonRef,
      rel: href ? 'noopener noreferrer' : undefined,
      tabIndex: !isStatic ? 0 : undefined,
      onClick: !inactive && _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TOUCH_ENV ? handleClick : handleClickEvent,
      onMouseDown: handleMouseDown,
      onContextMenu: onContextMenu || (!inactive && contextActions ? handleContextMenu : undefined),
      "aria-disabled": disabled || undefined,
      children: [!disabled && !inactive && ripple && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_RippleEffect__WEBPACK_IMPORTED_MODULE_15__["default"], {}), leftElement, icon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_10__["default"], {
        name: icon,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('ListItem-main-icon', iconClassName)
      }), multiline && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
        className: "multiline-item",
        children: children
      }), !multiline && children, secondaryIcon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_11__["default"], {
        nonInteractive: nonInteractive,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('secondary-icon', secondaryIconClassName),
        round: true,
        color: "translucent",
        size: "smaller",
        onClick: handleSecondaryIconClick,
        onMouseDown: handleSecondaryIconMouseDown,
        iconName: secondaryIcon
      }), rightElement]
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_12__["default"], {
      ref: menuRef,
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: "ListItem-context-menu with-menu-transitions",
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: withPortalForMenu,
      bubbleClassName: menuBubbleClassName,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_14__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_13__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("span", {
          className: "list-item-ellipsis",
          children: (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_4__["default"])(action.title)
        })
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ListItem);

/***/ },

/***/ "./src/components/ui/MenuSeparator.tsx"
/*!*********************************************!*\
  !*** ./src/components/ui/MenuSeparator.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MenuSeparator.module.scss */ "./src/components/ui/MenuSeparator.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const MenuSeparator = ({
  className,
  size = 'thin'
}) => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])(_MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].root, _MenuSeparator_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"][size], className)
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MenuSeparator);

/***/ },

/***/ "./src/components/ui/Modal.tsx"
/*!*************************************!*\
  !*** ./src/components/ui/Modal.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ANIMATION_DURATION: () => (/* binding */ ANIMATION_DURATION),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_captureKeyboardListeners__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/captureKeyboardListeners */ "./src/util/captureKeyboardListeners.ts");
/* harmony import */ var _util_directInputManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/directInputManager */ "./src/util/directInputManager.ts");
/* harmony import */ var _util_trapFocus__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/trapFocus */ "./src/util/trapFocus.ts");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFrozenProps__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useFrozenProps */ "./src/hooks/useFrozenProps.ts");
/* harmony import */ var _hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useHistoryBack */ "./src/hooks/useHistoryBack.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useLayoutEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useLayoutEffectWithPrevDeps */ "./src/hooks/useLayoutEffectWithPrevDeps.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _ModalStarBalanceBar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ModalStarBalanceBar */ "./src/components/ui/ModalStarBalanceBar.tsx");
/* harmony import */ var _Portal__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./Portal */ "./src/components/ui/Portal.ts");
/* harmony import */ var _Modal_scss__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Modal.scss */ "./src/components/ui/Modal.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");


















const ANIMATION_DURATION = 200;
const Modal = props => {
  const {
    dialogRef,
    isOpen,
    noBackdropClose,
    noFreezeOnClose,
    onClose,
    onCloseAnimationEnd,
    onEnter
  } = props;
  const {
    ref: modalRef,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_11__["default"])({
    isOpen,
    withShouldRender: true,
    onCloseAnimationEnd
  });
  const shouldFreeze = !noFreezeOnClose && !isOpen;
  const {
    title,
    isLowStackPriority,
    header,
    children,
    className,
    contentClassName,
    headerClassName,
    dialogClassName,
    isSlim,
    hasCloseButton,
    hasAbsoluteCloseButton,
    absoluteCloseButtonColor = 'translucent',
    isBackButton,
    noBackdrop,
    style,
    dialogStyle,
    dialogContent,
    moreMenuItems,
    headerRightToolBar: headerToolBar,
    withBalanceBar,
    isCondensedHeader,
    currencyInBalanceBar = 'XTR'
  } = (0,_hooks_useFrozenProps__WEBPACK_IMPORTED_MODULE_6__["default"])(props, shouldFreeze);
  const localDialogRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const moreButtonRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const menuRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const {
    isContextMenuOpen,
    contextMenuAnchor,
    handleContextMenu,
    handleContextMenuClose,
    handleContextMenuHide
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_5__["default"])(moreButtonRef);
  const actualDialogRef = dialogRef || localDialogRef;
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => actualDialogRef.current);
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => moreButtonRef.current);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => menuRef.current);
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => ({
    withPortal: true
  }));
  const withCloseButton = hasCloseButton || hasAbsoluteCloseButton;
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) {
      return undefined;
    }
    (0,_util_directInputManager__WEBPACK_IMPORTED_MODULE_3__.disableDirectTextInput)();
    return _util_directInputManager__WEBPACK_IMPORTED_MODULE_3__.enableDirectTextInput;
  }, [isOpen]);
  const handleEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(e => {
    if (!onEnter) {
      return false;
    }
    e.preventDefault();
    onEnter();
    return true;
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => isOpen ? (0,_util_captureKeyboardListeners__WEBPACK_IMPORTED_MODULE_2__["default"])({
    onEsc: onClose,
    onEnter: handleEnter
  }) : undefined, [isOpen, onClose, handleEnter]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => isOpen && modalRef.current ? (0,_util_trapFocus__WEBPACK_IMPORTED_MODULE_4__["default"])(modalRef.current) : undefined, [isOpen, modalRef]);
  (0,_hooks_useHistoryBack__WEBPACK_IMPORTED_MODULE_7__["default"])({
    isActive: isOpen,
    onBack: onClose
  });
  (0,_hooks_useLayoutEffectWithPrevDeps__WEBPACK_IMPORTED_MODULE_9__["default"])(([prevIsOpen]) => {
    document.body.classList.toggle('has-open-dialog', Boolean(isOpen));
    if (isOpen || !isOpen && prevIsOpen !== undefined) {
      (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.beginHeavyAnimation)(ANIMATION_DURATION);
    }
    return () => {
      document.body.classList.remove('has-open-dialog');
    };
  }, [isOpen]);
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_10__["default"])();
  if (!shouldRender) {
    return undefined;
  }
  function renderHeader() {
    if (header) {
      return header;
    }
    const closeIconClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('animated-close-icon', isBackButton && 'state-back');
    const closeButton = withCloseButton ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_12__["default"], {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(hasAbsoluteCloseButton && 'modal-absolute-close-button'),
      round: true,
      color: absoluteCloseButtonColor,
      size: "tiny",
      ariaLabel: isBackButton ? lang('Back') : lang('Close'),
      onClick: onClose,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
        className: closeIconClassName
      })
    }) : undefined;
    return title ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-header', headerClassName, isCondensedHeader && 'modal-header-condensed'),
      children: [closeButton, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
        className: "modal-title",
        children: title
      })]
    }) : closeButton;
  }
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Modal', className, noBackdrop && 'transparent-backdrop', isSlim && 'slim', isLowStackPriority && 'low-priority', withBalanceBar && 'with-balance-bar');
  const modalDialogClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-dialog', dialogClassName);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Portal__WEBPACK_IMPORTED_MODULE_15__["default"], {
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
      ref: modalRef,
      className: fullClassName,
      tabIndex: -1,
      role: "dialog",
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
        className: "modal-container",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
          className: "modal-backdrop",
          onClick: !noBackdropClose ? onClose : undefined
        }), withBalanceBar && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_ModalStarBalanceBar__WEBPACK_IMPORTED_MODULE_14__["default"], {
          isModalOpen: isOpen,
          currency: currencyInBalanceBar
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)("div", {
          className: modalDialogClassName,
          ref: actualDialogRef,
          style: dialogStyle,
          children: [renderHeader(), headerToolBar, Boolean(moreMenuItems) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.Fragment, {
            children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_12__["default"], {
              ref: moreButtonRef,
              className: "modal-more-button",
              round: true,
              color: absoluteCloseButtonColor,
              size: "tiny",
              iconName: "more",
              ariaLabel: lang('AriaMoreButton'),
              onClick: handleContextMenu,
              onContextMenu: handleContextMenu
            }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_13__["default"], {
              ref: menuRef,
              isOpen: isContextMenuOpen,
              anchor: contextMenuAnchor,
              autoClose: true,
              withPortal: true,
              positionX: "right",
              onClose: handleContextMenuClose,
              onCloseAnimationEnd: handleContextMenuHide,
              getRootElement: getRootElement,
              getTriggerElement: getTriggerElement,
              getMenuElement: getMenuElement,
              getLayout: getLayout,
              children: moreMenuItems
            })]
          }), dialogContent, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_17__.jsx)("div", {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('modal-content custom-scroll', contentClassName),
            style: style,
            children: children
          })]
        })]
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);

/***/ },

/***/ "./src/components/ui/ModalStarBalanceBar.tsx"
/*!***************************************************!*\
  !*** ./src/components/ui/ModalStarBalanceBar.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../global */ "./src/global/index.ts");
/* harmony import */ var _global_helpers_payments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../global/helpers/payments */ "./src/global/helpers/payments.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/formatCurrency */ "./src/util/formatCurrency.tsx");
/* harmony import */ var _util_localization_format__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/localization/format */ "./src/util/localization/format.tsx");
/* harmony import */ var _hooks_element_useIsTopmostBalanceBarModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/element/useIsTopmostBalanceBarModal */ "./src/hooks/element/useIsTopmostBalanceBarModal.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Link */ "./src/components/ui/Link.tsx");
/* harmony import */ var _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ModalStarBalanceBar.module.scss */ "./src/components/ui/ModalStarBalanceBar.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");













function ModalStarBalanceBar({
  starBalance,
  tonBalance,
  tonUsdRate,
  isModalOpen,
  currency,
  onCloseAnimationEnd
}) {
  const {
    openStarsBalanceModal
  } = (0,_global__WEBPACK_IMPORTED_MODULE_1__.getActions)();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const isTonMode = currency === 'TON';
  const currentBalance = isTonMode ? tonBalance : starBalance;
  const isOpen = isModalOpen ? Boolean(currentBalance) : false;
  const {
    ref,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_9__["default"])({
    isOpen,
    onCloseAnimationEnd,
    withShouldRender: true
  });
  const isTopmost = (0,_hooks_element_useIsTopmostBalanceBarModal__WEBPACK_IMPORTED_MODULE_6__["default"])(ref, Boolean(shouldRender && currentBalance));
  const handleGetMoreStars = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => {
    openStarsBalanceModal(isTonMode ? {
      currency: 'TON'
    } : {});
  });
  if (!shouldRender || !currentBalance) {
    return undefined;
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(_ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_11__["default"].root, !isTopmost && _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_11__["default"].hidden),
    ref: ref,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
      children: isTonMode ? lang('ModalStarsBalanceBarDescription', {
        stars: (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_5__.formatTonAsIcon)(lang, (0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.convertTonFromNanos)(currentBalance.amount))
      }, {
        withNodes: true,
        withMarkdown: true
      }) : lang('ModalStarsBalanceBarDescription', {
        stars: (0,_util_localization_format__WEBPACK_IMPORTED_MODULE_5__.formatStarsAsIcon)(lang, (0,_global_helpers_payments__WEBPACK_IMPORTED_MODULE_2__.formatStarsAmount)(lang, currentBalance))
      }, {
        withNodes: true,
        withMarkdown: true
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)("div", {
      children: [isTonMode && Boolean(tonUsdRate) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
        className: _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_11__["default"].tonInUsdDescription,
        style: "color: var(--color-text-secondary)",
        children: `≈ ${(0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.formatCurrencyAsString)((0,_util_formatCurrency__WEBPACK_IMPORTED_MODULE_4__.convertTonToUsd)(currentBalance.amount, tonUsdRate, true), 'USD', lang.code)}`
      }), !isTonMode && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_Link__WEBPACK_IMPORTED_MODULE_10__["default"], {
        className: _ModalStarBalanceBar_module_scss__WEBPACK_IMPORTED_MODULE_11__["default"].getMoreStarsLink,
        isPrimary: true,
        onClick: handleGetMoreStars,
        children: lang('GetMoreStarsLinkText', undefined, {
          withNodes: true,
          specialReplacement: _util_localization_format__WEBPACK_IMPORTED_MODULE_5__.NEXT_ARROW_REPLACEMENT
        })
      })]
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)((0,_global__WEBPACK_IMPORTED_MODULE_1__.withGlobal)(global => {
  const {
    stars,
    ton
  } = global;
  return {
    starBalance: stars?.balance,
    tonBalance: ton?.balance,
    tonUsdRate: global.appConfig.tonUsdRate
  };
})(ModalStarBalanceBar)));

/***/ },

/***/ "./src/components/ui/NestedMenuItem.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/NestedMenuItem.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useUniqueId */ "./src/hooks/useUniqueId.ts");
/* harmony import */ var _hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/window/useWindowSize */ "./src/hooks/window/useWindowSize.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");













const OPEN_TIMEOUT = 150;
const CLOSE_TIMEOUT = 150;
const NestedMenuItem = ({
  icon,
  customIcon,
  submenuIcon,
  className,
  children,
  submenu,
  submenuClassName,
  disabled,
  destructive,
  ariaLabel,
  footer
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const itemRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const closeTimeoutRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const openTimeoutRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const submenuId = (0,_hooks_useUniqueId__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const isClosingRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const [isSubmenuOpen, openSubmenu, closeSubmenu] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__["default"])(false);
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useUnmountCleanup)(() => {
    clearTimeout(closeTimeoutRef.current);
    clearTimeout(openTimeoutRef.current);
  });
  const [submenuAnchor, setSubmenuAnchor] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const {
    isResizing
  } = (0,_hooks_window_useWindowSize__WEBPACK_IMPORTED_MODULE_8__["default"])();
  const updateAnchor = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMeasure)(() => {
      if (!itemRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const overlap = _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_3__.REM;
      setSubmenuAnchor({
        x: lang.isRtl ? rect.left + overlap : rect.right - overlap,
        y: rect.top,
        width: rect.width - overlap * 2,
        height: rect.height
      });
    });
  });
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isSubmenuOpen && !isResizing) {
      updateAnchor();
    }
  }, [isSubmenuOpen, lang.isRtl, updateAnchor, isResizing]);
  const cancelOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    clearTimeout(openTimeoutRef.current);
    openTimeoutRef.current = undefined;
  });
  const cancelClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = undefined;
  });
  const scheduleOpen = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelClose();
    cancelOpen();
    openTimeoutRef.current = window.setTimeout(() => {
      openTimeoutRef.current = undefined;
      // Don't open if the parent menu is closing
      const parentBubble = itemRef.current?.closest('.bubble');
      if (parentBubble?.classList.contains('closing')) return;
      openSubmenu();
    }, OPEN_TIMEOUT);
  });
  const scheduleClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelOpen();
    cancelClose();
    closeTimeoutRef.current = window.setTimeout(() => {
      closeSubmenu();
      closeTimeoutRef.current = undefined;
    }, CLOSE_TIMEOUT);
  });
  const handleMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    if (disabled) return;
    scheduleOpen();
  });
  const handleSubmenuMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    cancelOpen();
    cancelClose();
  });
  const handleSubmenuMouseLeave = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    scheduleClose();
  });
  const closeParentMenu = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    const parentMenu = itemRef.current?.closest('.Menu');
    if (parentMenu) {
      const backdrop = parentMenu.querySelector('.backdrop');
      if (backdrop) {
        const event = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        backdrop.dispatchEvent(event);
      }
    }
  });
  const handleSubmenuClose = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    cancelOpen();
    cancelClose();
    closeSubmenu();
    closeParentMenu();

    // Reset after a short delay
    setTimeout(() => {
      isClosingRef.current = false;
    }, 100);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => itemRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => document.getElementById(submenuId)?.querySelector('.bubble'));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(() => ({
    withPortal: true
  }));
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    e.stopPropagation();
    if (disabled || isSubmenuOpen) return;
    openSubmenu();
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)("div", {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: scheduleClose,
    ref: itemRef,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsxs)(_MenuItem__WEBPACK_IMPORTED_MODULE_11__["default"], {
      icon: icon,
      customIcon: customIcon,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])(className, 'submenu'),
      disabled: disabled,
      destructive: destructive,
      ariaLabel: ariaLabel,
      onClick: handleClick,
      children: [children, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: submenuIcon || (lang.isRtl ? 'previous' : 'next'),
        className: "submenu-icon"
      }), submenuAnchor && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_12__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_10__["default"], {
        id: submenuId,
        isOpen: isSubmenuOpen,
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('submenu', submenuClassName),
        anchor: submenuAnchor,
        positionX: lang.isRtl ? 'left' : 'right',
        getTriggerElement: getTriggerElement,
        getRootElement: getRootElement,
        getMenuElement: getMenuElement,
        getLayout: getLayout,
        autoClose: true,
        nested: true,
        withPortal: true,
        footer: footer,
        onClose: handleSubmenuClose,
        onMouseEnter: handleSubmenuMouseEnter,
        onMouseLeave: handleSubmenuMouseLeave,
        children: submenu
      })]
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NestedMenuItem);

/***/ },

/***/ "./src/components/ui/ProgressSpinner.tsx"
/*!***********************************************!*\
  !*** ./src/components/ui/ProgressSpinner.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/animation */ "./src/util/animation.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/stickers/useDynamicColorListener */ "./src/hooks/stickers/useDynamicColorListener.ts");
/* harmony import */ var _hooks_useStateRef__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useStateRef */ "./src/hooks/useStateRef.ts");
/* harmony import */ var _hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/window/useDevicePixelRatio */ "./src/hooks/window/useDevicePixelRatio.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ProgressSpinner_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ProgressSpinner.scss */ "./src/components/ui/ProgressSpinner.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const SIZES = {
  s: 42,
  m: 48,
  l: 54,
  xl: 52
};
const STROKE_WIDTH = 2;
const STROKE_WIDTH_XL = 3;
const PADDING = 2;
const MIN_PROGRESS = 0.05;
const MAX_PROGRESS = 1;
const GROW_DURATION = 600; // 0.6 s
const ROTATE_DURATION = 2000; // 2 s

const ProgressSpinner = ({
  progress = 0,
  size = 'l',
  square,
  transparent,
  noCross,
  rotationOffset,
  withColor,
  onClick
}) => {
  const canvasRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const width = SIZES[size];
  const progressRef = (0,_hooks_useStateRef__WEBPACK_IMPORTED_MODULE_5__.useStateRef)(progress);
  const dpr = (0,_hooks_window_useDevicePixelRatio__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const color = (0,_hooks_stickers_useDynamicColorListener__WEBPACK_IMPORTED_MODULE_4__["default"])(canvasRef, undefined, !withColor);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    let isFirst = true;
    let growFrom = MIN_PROGRESS;
    let growStartedAt;
    let prevProgress;
    (0,_util_animation__WEBPACK_IMPORTED_MODULE_2__.animate)(() => {
      if (!canvasRef.current) {
        return false;
      }
      if (progressRef.current !== prevProgress) {
        growFrom = Math.min(Math.max(MIN_PROGRESS, prevProgress || 0), MAX_PROGRESS);
        growStartedAt = Date.now();
        prevProgress = progressRef.current;
      }
      const targetProgress = Math.min(Math.max(MIN_PROGRESS, progressRef.current), MAX_PROGRESS);
      const t = Math.min(1, (Date.now() - growStartedAt) / GROW_DURATION);
      const animationFactor = _util_animation__WEBPACK_IMPORTED_MODULE_2__.timingFunctions.easeOutQuad(t);
      const currentProgress = growFrom + (targetProgress - growFrom) * animationFactor;
      drawSpinnerArc(canvasRef.current, width * dpr, (size === 'xl' ? STROKE_WIDTH_XL : STROKE_WIDTH) * dpr, color ?? 'white', currentProgress, dpr, isFirst, rotationOffset);
      isFirst = false;
      return currentProgress < 1;
    }, _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation);
  }, [progressRef, size, width, dpr, rotationOffset, color]);
  const className = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])(`ProgressSpinner size-${size}`, transparent && 'transparent', square && 'square', noCross && 'no-cross');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: className,
    onClick: onClick,
    children: [!noCross && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_7__["default"], {
      name: "close"
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("canvas", {
      ref: canvasRef,
      className: "ProgressSpinner_canvas",
      style: `width: ${width}; height: ${width}px;`
    })]
  });
};
function drawSpinnerArc(canvas, size, strokeWidth, color, progress, dpr, shouldInit = false, rotationOffset) {
  const centerCoordinate = size / 2;
  const radius = (size - strokeWidth) / 2 - PADDING * dpr;
  const offset = rotationOffset ?? Date.now() % ROTATE_DURATION / ROTATE_DURATION;
  const startAngle = 2 * Math.PI * offset;
  const endAngle = startAngle + 2 * Math.PI * progress;
  const ctx = canvas.getContext('2d');
  if (shouldInit) {
    canvas.width = size;
    canvas.height = size;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
  }
  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(centerCoordinate, centerCoordinate, radius, startAngle, endAngle);
  ctx.stroke();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(ProgressSpinner));

/***/ },

/***/ "./src/components/ui/Radio.tsx"
/*!*************************************!*\
  !*** ./src/components/ui/Radio.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _Spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Spinner */ "./src/components/ui/Spinner.tsx");
/* harmony import */ var _Radio_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Radio.scss */ "./src/components/ui/Radio.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const Radio = ({
  id,
  label,
  subLabel,
  subLabelClassName,
  value,
  name,
  checked,
  disabled,
  hidden,
  isLoading,
  className,
  onlyInput,
  withIcon,
  isLink,
  onChange,
  onSubLabelClick,
  isCanCheckedInDisabled
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Radio', className, disabled && 'disabled', hidden && 'hidden-widget', withIcon && 'with-icon', isLoading && 'loading', onlyInput && 'onlyInput', Boolean(subLabel) && 'withSubLabel', isCanCheckedInDisabled && 'canCheckedInDisabled');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("label", {
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
      type: "radio",
      name: name,
      value: value,
      id: id,
      checked: checked,
      onChange: onChange,
      disabled: disabled || hidden
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "Radio-main",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "label",
        dir: lang.isRtl ? 'auto' : undefined,
        children: label
      }), Boolean(subLabel) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(subLabelClassName, 'subLabel', isLink ? 'subLabelLink' : undefined),
        dir: lang.isRtl ? 'auto' : undefined,
        onClick: isLink ? onSubLabelClick : undefined,
        children: subLabel
      })]
    }), isLoading && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_Spinner__WEBPACK_IMPORTED_MODULE_3__["default"], {})]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Radio));

/***/ },

/***/ "./src/components/ui/RadioGroup.tsx"
/*!******************************************!*\
  !*** ./src/components/ui/RadioGroup.tsx ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Radio */ "./src/components/ui/Radio.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const RadioGroup = ({
  id,
  name,
  options,
  selected,
  disabled,
  loadingOption,
  onChange,
  onClickAction,
  subLabelClassName,
  isLink,
  withIcon,
  subLabel,
  className
}) => {
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    const {
      value
    } = event.currentTarget;
    onChange(value, event);
  }, [onChange]);
  const onSubLabelClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(value => () => {
    onClickAction?.(value);
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    id: id,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('radio-group', className),
    children: options.map(option => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Radio__WEBPACK_IMPORTED_MODULE_3__["default"], {
      name: name,
      label: option.label,
      subLabel: subLabel || option.subLabel,
      subLabelClassName: subLabelClassName,
      value: option.value,
      checked: option.value === selected,
      hidden: option.hidden,
      isCanCheckedInDisabled: option.isCanCheckedInDisabled,
      disabled: disabled,
      withIcon: withIcon,
      isLoading: loadingOption ? loadingOption === option.value : undefined,
      className: option.className,
      onChange: handleChange,
      onSubLabelClick: onSubLabelClick(option.value),
      isLink: isLink
    }))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RadioGroup));

/***/ },

/***/ "./src/components/ui/RangeSlider.tsx"
/*!*******************************************!*\
  !*** ./src/components/ui/RangeSlider.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _RangeSlider_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RangeSlider.scss */ "./src/components/ui/RangeSlider.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const RangeSlider = ({
  options,
  min = 0,
  max = options ? options.length - 1 : 100,
  step = 1,
  label,
  value,
  disabled,
  readOnly,
  bold,
  className,
  renderValue,
  onChange,
  isCenteredLayout
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    onChange(Number(event.currentTarget.value));
  }, [onChange]);
  const mainClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(className, 'RangeSlider', disabled && 'disabled', readOnly && 'readOnly', bold && 'bold');
  const trackWidth = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (options) {
      return value / (options.length - 1) * 100;
    } else {
      const possibleValuesLength = (max - min) / step;
      return (value - min) / possibleValuesLength * 100;
    }
  }, [options, value, max, min, step]);
  function renderTopRow() {
    if (isCenteredLayout) {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-top-row",
        dir: lang.isRtl ? 'rtl' : undefined,
        children: !options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "value-min",
            dir: "auto",
            children: min
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "label",
            dir: "auto",
            children: renderValue ? renderValue(value) : value
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "value-max",
            dir: "auto",
            children: max
          })]
        })
      });
    }
    if (!label) {
      return undefined;
    }
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "slider-top-row",
      dir: lang.isRtl ? 'rtl' : undefined,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "label",
        dir: "auto",
        children: label
      }), !options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "value",
        dir: "auto",
        children: renderValue ? renderValue(value) : value
      })]
    });
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: mainClassName,
    children: [renderTopRow(), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "slider-main",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-fill-track",
        style: `width: ${trackWidth}%`
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
        min: min,
        max: max,
        value: value,
        step: step,
        type: "range",
        className: "RangeSlider__input",
        onChange: handleChange
      }), options && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "slider-options",
        children: options.map((option, index) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('slider-option', index === value && 'active'),
          onClick: () => onChange(index),
          children: option
        }))
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RangeSlider));

/***/ },

/***/ "./src/components/ui/RangeSliderWithMarks.tsx"
/*!****************************************************!*\
  !*** ./src/components/ui/RangeSliderWithMarks.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RangeSliderWithMarks.module.scss */ "./src/components/ui/RangeSliderWithMarks.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const RangeSliderWithMarks = ({
  marks,
  onChange,
  rangeCount
}) => {
  const sliderRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const rangeCountIndex = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => marks.indexOf(rangeCount), [marks, rangeCount]);
  const rangeValue = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return marks.indexOf(rangeCount).toString();
  }, [marks, rangeCount]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    if (sliderRef.current) {
      const fillPercentage = rangeCountIndex / (marks.length - 1) * 100;
      const thumbOffset = fillPercentage / 2;
      sliderRef.current.style.setProperty('--fill-percentage', `${fillPercentage}%`);
      sliderRef.current.style.setProperty('--thumb-offset', `${thumbOffset}%`);
    }
  }, [rangeCountIndex, marks]);
  const handleChange = event => {
    const index = parseInt(event.target.value, 10);
    const newValue = marks[index];
    onChange(newValue);
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].dotWrapper,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("form", {
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].sliderContainer,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tickMarks,
          children: marks.map((mark, index) => {
            const isFilled = index <= rangeCountIndex;
            return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
              className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tick, isFilled ? _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].filled : _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].tickUnfilled)
            }, mark);
          })
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].marksContainer,
          children: marks.map(mark => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].mark, rangeCount === mark && _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].active),
            children: mark
          }, mark))
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("input", {
          ref: sliderRef,
          type: "range",
          className: _RangeSliderWithMarks_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].slider,
          min: "0",
          max: marks.length - 1,
          value: rangeValue,
          onChange: handleChange,
          step: "1"
        })]
      })
    })
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RangeSliderWithMarks));

/***/ },

/***/ "./src/components/ui/ResponsiveHoverButton.tsx"
/*!*****************************************************!*\
  !*** ./src/components/ui/ResponsiveHoverButton.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const BUTTON_ACTIVATE_DELAY = 200;
let openTimeout;
let isFirstTimeActivation = true;
const ResponsiveHoverButton = ({
  onActivate,
  ...buttonProps
}) => {
  const isMouseInsideRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const handleMouseEnter = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    isMouseInsideRef.current = true;

    // This is used to counter additional delay caused by asynchronous module loading
    if (isFirstTimeActivation) {
      isFirstTimeActivation = false;
      onActivate(e);
      return;
    }
    if (openTimeout) {
      clearTimeout(openTimeout);
      openTimeout = undefined;
    }
    openTimeout = window.setTimeout(() => {
      if (isMouseInsideRef.current) {
        onActivate(e);
      }
    }, BUTTON_ACTIVATE_DELAY);
  });
  const handleMouseLeave = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(() => {
    isMouseInsideRef.current = false;
  });
  const handleClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    isMouseInsideRef.current = true;
    onActivate(e);
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ...buttonProps,
    onMouseEnter: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? handleMouseEnter : undefined,
    onMouseLeave: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? handleMouseLeave : undefined,
    onClick: !_util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TOUCH_ENV ? onActivate : handleClick
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ResponsiveHoverButton);

/***/ },

/***/ "./src/components/ui/SearchInput.tsx"
/*!*******************************************!*\
  !*** ./src/components/ui/SearchInput.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useInputFocusOnOpen__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useInputFocusOnOpen */ "./src/hooks/useInputFocusOnOpen.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _Loading__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Loading */ "./src/components/ui/Loading.tsx");
/* harmony import */ var _Transition__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _SearchInput_scss__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./SearchInput.scss */ "./src/components/ui/SearchInput.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");














const SearchInput = ({
  ref,
  children,
  resultsItemSelector,
  value,
  inputId,
  className,
  focused,
  isLoading = false,
  spinnerColor,
  spinnerBackgroundColor,
  placeholder,
  disabled,
  autoComplete,
  canClose,
  autoFocusSearch,
  hasUpButton,
  hasDownButton,
  teactExperimentControlled,
  withBackIcon,
  onChange,
  onStartBackspace,
  onReset,
  onFocus,
  onBlur,
  onClick,
  onUpClick,
  onDownClick,
  onSpinnerClick,
  onEnter
}) => {
  let inputRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    inputRef = ref;
  }
  const [isInputFocused, markInputFocused, unmarkInputFocused] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_3__["default"])(focused);
  (0,_hooks_useInputFocusOnOpen__WEBPACK_IMPORTED_MODULE_4__["default"])(inputRef, autoFocusSearch, unmarkInputFocused);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!inputRef.current) {
      return;
    }
    if (focused) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [focused, placeholder]); // Trick for setting focus when selecting a contact to search for

  const oldLang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_7__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  function handleChange(event) {
    const {
      currentTarget
    } = event;
    onChange(currentTarget.value);
    if (!isInputFocused) {
      handleFocus();
    }
  }
  function handleFocus() {
    markInputFocused();
    onFocus?.();
  }
  function handleBlur() {
    unmarkInputFocused();
    onBlur?.();
  }
  const handleKeyDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_6__["default"])(e => {
    if (e.key === 'Enter') {
      if (onEnter) {
        e.preventDefault();
        onEnter();
        return;
      }
      if (resultsItemSelector) {
        const element = document.querySelector(resultsItemSelector);
        if (element) {
          element.focus();
        }
      }
    }
    if (resultsItemSelector && e.key === 'ArrowDown') {
      const element = document.querySelector(resultsItemSelector);
      if (element) {
        element.focus();
      }
    }
    if (e.key === 'Backspace' && e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0) {
      onStartBackspace?.();
    }
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_2__["default"])('SearchInput', className, isInputFocused && 'has-focus'),
    onClick: onClick,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Transition__WEBPACK_IMPORTED_MODULE_11__["default"], {
      name: "fade",
      shouldCleanup: true,
      activeKey: Number(!isLoading && !withBackIcon),
      className: "icon-container-left",
      slideClassName: "icon-container-slide",
      children: isLoading && !withBackIcon ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Loading__WEBPACK_IMPORTED_MODULE_10__["default"], {
        color: spinnerColor,
        backgroundColor: spinnerBackgroundColor,
        onClick: onSpinnerClick
      }) : withBackIcon ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
        name: "arrow-left",
        className: "back-icon",
        onClick: onReset
      }) : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_8__["default"], {
        name: "search",
        className: "search-icon"
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("div", {
      children: children
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)("input", {
      ref: inputRef,
      id: inputId,
      type: "text",
      dir: "auto",
      placeholder: placeholder || oldLang('Search'),
      className: "form-control",
      value: value,
      disabled: disabled,
      autoComplete: autoComplete,
      spellCheck: _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_1__.IS_TAURI ? false : undefined,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      teactExperimentControlled: teactExperimentControlled
    }), hasUpButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
      round: true,
      size: "tiny",
      color: "translucent",
      iconName: "up",
      onClick: onUpClick,
      disabled: !onUpClick,
      ariaLabel: lang('AriaSearchOlderResult')
    }), hasDownButton && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
      round: true,
      size: "tiny",
      color: "translucent",
      iconName: "down",
      onClick: onDownClick,
      disabled: !onDownClick,
      ariaLabel: lang('AriaSearchNewerResult')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Transition__WEBPACK_IMPORTED_MODULE_11__["default"], {
      name: "fade",
      shouldCleanup: true,
      activeKey: Number(isLoading),
      className: "icon-container-right",
      slideClassName: "icon-container-slide",
      children: withBackIcon && isLoading ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Loading__WEBPACK_IMPORTED_MODULE_10__["default"], {
        color: spinnerColor,
        backgroundColor: spinnerBackgroundColor,
        onClick: onSpinnerClick
      }) : (value || canClose) && onReset && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_13__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_9__["default"], {
        round: true,
        size: "tiny",
        color: "translucent",
        iconName: "close",
        onClick: onReset
      })
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SearchInput));

/***/ },

/***/ "./src/components/ui/Select.tsx"
/*!**************************************!*\
  !*** ./src/components/ui/Select.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");



const Select = props => {
  const {
    id,
    value,
    label,
    hasArrow,
    error,
    ref,
    tabIndex,
    onChange,
    children
  } = props;
  const labelText = error || label;
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('input-group', value && 'touched', error && 'error', labelText && 'with-label', hasArrow && 'with-arrow', 'input-group');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: fullClassName,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("select", {
      className: "form-control",
      id: id,
      value: value || '',
      onChange: onChange,
      tabIndex: tabIndex,
      ref: ref,
      children: children
    }), labelText && id && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("label", {
      htmlFor: id,
      children: labelText
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Select));

/***/ },

/***/ "./src/components/ui/SelectAvatar.tsx"
/*!********************************************!*\
  !*** ./src/components/ui/SelectAvatar.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_systemFilesDialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/systemFilesDialog */ "./src/util/systemFilesDialog.ts");
/* harmony import */ var _CropModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CropModal */ "./src/components/ui/CropModal.tsx");
/* harmony import */ var _SelectAvatar_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./SelectAvatar.module.scss */ "./src/components/ui/SelectAvatar.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const SelectAvatar = ({
  onChange,
  inputRef
}) => {
  const [selectedFile, setSelectedFile] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const handleAvatarCrop = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(croppedImg => {
    setSelectedFile(undefined);
    onChange(croppedImg);
  }, [onChange]);
  const handleModalClose = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setSelectedFile(undefined);
  }, []);
  const handleClick = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    (0,_util_systemFilesDialog__WEBPACK_IMPORTED_MODULE_1__.openSystemFilesDialog)('image/png, image/jpeg', event => {
      const target = event.target;
      if (!target?.files?.[0]) {
        return;
      }
      setSelectedFile(target.files[0]);
    }, true);
  }, []);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
      ref: inputRef,
      className: _SelectAvatar_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].input,
      onClick: handleClick
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CropModal__WEBPACK_IMPORTED_MODULE_2__["default"], {
      file: selectedFile,
      onClose: handleModalClose,
      onChange: handleAvatarCrop
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SelectAvatar));

/***/ },

/***/ "./src/components/ui/Separator.tsx"
/*!*****************************************!*\
  !*** ./src/components/ui/Separator.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _Separator_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Separator.module.scss */ "./src/components/ui/Separator.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




function Separator({
  children,
  className
}) {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    dir: lang.isRtl ? 'rtl' : undefined,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_0__["default"])(_Separator_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].separator, className),
    children: children
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Separator);

/***/ },

/***/ "./src/components/ui/ShowMoreButton.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/ShowMoreButton.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _ShowMoreButton_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShowMoreButton.scss */ "./src/components/ui/ShowMoreButton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const ShowMoreButton = ({
  count,
  itemName,
  itemPluralName,
  isLoading,
  onClick
}) => {
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_0__["default"])();
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(_Button__WEBPACK_IMPORTED_MODULE_1__["default"], {
    className: "ShowMoreButton",
    color: "translucent",
    isText: true,
    isLoading: isLoading,
    isRtl: lang.isRtl,
    onClick: onClick,
    iconName: "down",
    children: ["Show", ' ', count, ' ', "more", ' ', count > 1 ? itemPluralName || `${itemName}s` : itemName]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowMoreButton);

/***/ },

/***/ "./src/components/ui/ShowTransition.tsx"
/*!**********************************************!*\
  !*** ./src/components/ui/ShowTransition.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../hooks/usePreviousDeprecated */ "./src/hooks/usePreviousDeprecated.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const ShowTransition = ({
  isOpen,
  isHidden,
  isCustom,
  id,
  className,
  onClick,
  children,
  noCloseTransition,
  shouldAnimateFirstRender,
  style,
  ref: externalRef
}) => {
  const prevIsOpen = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(isOpen);
  const prevChildren = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_1__["default"])(children);
  const fromChildrenRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const isFirstRender = prevIsOpen === undefined;
  const {
    ref,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_2__["default"])({
    isOpen: isOpen && !isHidden,
    ref: externalRef,
    noMountTransition: isFirstRender && !shouldAnimateFirstRender,
    className: isCustom ? false : undefined,
    noCloseTransition,
    withShouldRender: true
  });
  if (prevIsOpen && !isOpen) {
    fromChildrenRef.current = prevChildren;
  }
  return (shouldRender || isHidden) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    id: id,
    ref: ref,
    className: className,
    onClick: onClick,
    style: style,
    children: isOpen ? children : fromChildrenRef.current
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ShowTransition);

/***/ },

/***/ "./src/components/ui/SquareTabList.tsx"
/*!*********************************************!*\
  !*** ./src/components/ui/SquareTabList.tsx ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_animateHorizontalScroll__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/animateHorizontalScroll */ "./src/util/animateHorizontalScroll.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useHorizontalScroll */ "./src/hooks/useHorizontalScroll.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/usePreviousDeprecated */ "./src/hooks/usePreviousDeprecated.ts");
/* harmony import */ var _Tab__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Tab */ "./src/components/ui/Tab.tsx");
/* harmony import */ var _SquareTabList_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./SquareTabList.scss */ "./src/components/ui/SquareTabList.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");










const TAB_SCROLL_THRESHOLD_PX = 16;
// Should match duration from `--slide-transition` CSS variable
const SCROLL_DURATION = _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_IOS ? 450 : _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_ANDROID ? 400 : 300;
const SquareTabList = ({
  tabs,
  activeTab,
  className,
  tabClassName,
  contextRootElementSelector,
  ref,
  onSwitchTab
}) => {
  const internalRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const containerRef = ref || internalRef;
  const previousActiveTab = (0,_hooks_usePreviousDeprecated__WEBPACK_IMPORTED_MODULE_6__["default"])(activeTab);
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  (0,_hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_4__["default"])(containerRef, undefined, true);

  // Scroll container to place active tab in the center
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const container = containerRef.current;
    const {
      scrollWidth,
      offsetWidth,
      scrollLeft
    } = container;
    if (scrollWidth <= offsetWidth) {
      return;
    }
    const activeTabElement = container.childNodes[activeTab];
    if (!activeTabElement) {
      return;
    }
    const {
      offsetLeft: activeTabOffsetLeft,
      offsetWidth: activeTabOffsetWidth
    } = activeTabElement;
    const newLeft = activeTabOffsetLeft - offsetWidth / 2 + activeTabOffsetWidth / 2;

    // Prevent scrolling by only a couple of pixels, which doesn't look smooth
    if (Math.abs(newLeft - scrollLeft) < TAB_SCROLL_THRESHOLD_PX) {
      return;
    }
    (0,_util_animateHorizontalScroll__WEBPACK_IMPORTED_MODULE_1__["default"])(container, newLeft, SCROLL_DURATION);
  }, [activeTab, containerRef]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('SquareTabList', 'no-scrollbar', className),
    ref: containerRef,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: tabs.map((tab, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_Tab__WEBPACK_IMPORTED_MODULE_7__["default"], {
      title: tab.title,
      isActive: i === activeTab,
      isBlocked: tab.isBlocked,
      badgeCount: tab.badgeCount,
      isBadgeActive: tab.isBadgeActive,
      previousActiveTab: previousActiveTab,
      onClick: onSwitchTab,
      clickArg: i,
      contextActions: tab.contextActions,
      contextRootElementSelector: contextRootElementSelector,
      className: tabClassName
    }, tab.id))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(SquareTabList));

/***/ },

/***/ "./src/components/ui/Switcher.tsx"
/*!****************************************!*\
  !*** ./src/components/ui/Switcher.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _Switcher_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Switcher.scss */ "./src/components/ui/Switcher.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const Switcher = ({
  id,
  name,
  value,
  label,
  checked = false,
  disabled,
  inactive,
  noAnimation,
  onCheck
}) => {
  const handleChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    onCheck?.(e.currentTarget.checked);
  });
  const className = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Switcher', disabled && 'disabled', inactive && 'inactive', noAnimation && 'no-animation');
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
    className: className,
    title: label,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
      type: "checkbox",
      id: id,
      name: name,
      value: value,
      checked: checked,
      disabled: disabled,
      onChange: handleChange
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
      className: "widget"
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Switcher));

/***/ },

/***/ "./src/components/ui/Tab.tsx"
/*!***********************************!*\
  !*** ./src/components/ui/Tab.tsx ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_forceReflow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/forceReflow */ "./src/util/forceReflow.ts");
/* harmony import */ var _common_helpers_renderText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers/renderText */ "./src/components/common/helpers/renderText.tsx");
/* harmony import */ var _hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useContextMenuHandlers */ "./src/hooks/useContextMenuHandlers.ts");
/* harmony import */ var _hooks_useFastClick__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../hooks/useFastClick */ "./src/hooks/useFastClick.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./Menu */ "./src/components/ui/Menu.tsx");
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MenuItem */ "./src/components/ui/MenuItem.tsx");
/* harmony import */ var _MenuSeparator__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./MenuSeparator */ "./src/components/ui/MenuSeparator.tsx");
/* harmony import */ var _Tab_scss__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./Tab.scss */ "./src/components/ui/Tab.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");















const classNames = {
  active: 'Tab--active',
  badgeActive: 'Tab__badge--active'
};
const Tab = ({
  className,
  title,
  isActive,
  isBlocked,
  badgeCount,
  isBadgeActive,
  previousActiveTab,
  contextActions,
  contextRootElementSelector,
  icon,
  clickArg,
  onClick
}) => {
  const tabRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    // Set initial active state
    if (isActive && previousActiveTab === undefined && tabRef.current) {
      tabRef.current.classList.add(classNames.active);
    }
  }, [isActive, previousActiveTab]);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isActive || previousActiveTab === undefined) {
      return;
    }
    const tabEl = tabRef.current;
    const prevTabEl = tabEl.parentElement.children[previousActiveTab];
    if (!prevTabEl) {
      // The number of tabs in the parent component has decreased. It is necessary to add the active tab class name.
      if (isActive && !tabEl.classList.contains(classNames.active)) {
        (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
          tabEl.classList.add(classNames.active);
        });
      }
      return;
    }
    const platformEl = tabEl.querySelector('.platform');
    const prevPlatformEl = prevTabEl.querySelector('.platform');

    // We move and resize the platform, so it repeats the position and size of the previous one
    const shiftLeft = prevPlatformEl.parentElement.offsetLeft - platformEl.parentElement.offsetLeft;
    const scaleFactor = prevPlatformEl.clientWidth / platformEl.clientWidth;
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      prevPlatformEl.classList.remove('animate');
      platformEl.classList.remove('animate');
      platformEl.style.transform = `translate3d(${shiftLeft}px, 0, 0) scale3d(${scaleFactor}, 1, 1)`;
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestForcedReflow)(() => {
        (0,_util_forceReflow__WEBPACK_IMPORTED_MODULE_4__["default"])(platformEl);
        return () => {
          platformEl.classList.add('animate');
          platformEl.style.transform = 'none';
          prevTabEl.classList.remove(classNames.active);
          tabEl.classList.add(classNames.active);
        };
      });
    });
  }, [isActive, previousActiveTab]);
  const {
    contextMenuAnchor,
    handleContextMenu,
    handleBeforeContextMenu,
    handleContextMenuClose,
    handleContextMenuHide,
    isContextMenuOpen
  } = (0,_hooks_useContextMenuHandlers__WEBPACK_IMPORTED_MODULE_6__["default"])(tabRef, !contextActions);
  const {
    handleClick,
    handleMouseDown
  } = (0,_hooks_useFastClick__WEBPACK_IMPORTED_MODULE_7__.useFastClick)(e => {
    if (contextActions && (e.button === _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Secondary || !onClick)) {
      handleBeforeContextMenu(e);
    }
    if (e.type === 'mousedown' && e.button !== _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_2__.MouseButton.Main) {
      return;
    }
    onClick?.(clickArg);
  });
  const getTriggerElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => tabRef.current);
  const getRootElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => contextRootElementSelector ? tabRef.current.closest(contextRootElementSelector) : document.body);
  const getMenuElement = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => document.querySelector('#portals').querySelector('.Tab-context-menu .bubble'));
  const getLayout = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_8__["default"])(() => ({
    withPortal: true
  }));
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('Tab', onClick && 'Tab--interactive', className),
    onClick: handleClick,
    onMouseDown: handleMouseDown,
    onContextMenu: handleContextMenu,
    ref: tabRef,
    children: [icon, (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("span", {
      className: "Tab_inner",
      children: [typeof title === 'string' ? (0,_common_helpers_renderText__WEBPACK_IMPORTED_MODULE_5__["default"])(title) : title, Boolean(badgeCount) && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("span", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('badge', isBadgeActive && classNames.badgeActive),
        children: badgeCount
      }), isBlocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_9__["default"], {
        name: "lock-badge",
        className: "blocked"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("i", {
        className: "platform"
      })]
    }), contextActions && contextMenuAnchor !== undefined && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_Menu__WEBPACK_IMPORTED_MODULE_10__["default"], {
      isOpen: isContextMenuOpen,
      anchor: contextMenuAnchor,
      getTriggerElement: getTriggerElement,
      getRootElement: getRootElement,
      getMenuElement: getMenuElement,
      getLayout: getLayout,
      className: "Tab-context-menu",
      autoClose: true,
      onClose: handleContextMenuClose,
      onCloseAnimationEnd: handleContextMenuHide,
      withPortal: true,
      children: contextActions.map(action => 'isSeparator' in action ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_MenuSeparator__WEBPACK_IMPORTED_MODULE_12__["default"], {}, action.key || 'separator') : (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_MenuItem__WEBPACK_IMPORTED_MODULE_11__["default"], {
        icon: action.icon,
        destructive: action.destructive,
        disabled: !action.handler,
        onClick: action.handler,
        children: action.title
      }, action.title))
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Tab);

/***/ },

/***/ "./src/components/ui/TabList.tsx"
/*!***************************************!*\
  !*** ./src/components/ui/TabList.tsx ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../hooks/useHorizontalScroll */ "./src/hooks/useHorizontalScroll.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useResizeObserver */ "./src/hooks/useResizeObserver.ts");
/* harmony import */ var _common_CustomEmoji__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/CustomEmoji */ "./src/components/common/CustomEmoji.tsx");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./TabList.module.scss */ "./src/components/ui/TabList.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const EMOJI_SIZE = 20;
const TabList = ({
  tabs,
  activeTab,
  className,
  tabClassName,
  indicatorClassName,
  centered,
  stretched,
  itemAlignment,
  onSwitchTab
}) => {
  const containerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const clipPathContainerRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [clipPath, setClipPath] = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,_hooks_useHorizontalScroll__WEBPACK_IMPORTED_MODULE_2__["default"])(containerRef, !tabs.length, true);
  const updateClipPath = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    const clipPathContainer = clipPathContainerRef.current;
    const activeTabEl = activeTab >= 0 && clipPathContainer?.childNodes[activeTab];
    if (clipPathContainer && activeTabEl && clipPathContainer.offsetWidth > 0) {
      const {
        offsetLeft,
        offsetWidth
      } = activeTabEl;
      const containerWidth = clipPathContainer.offsetWidth;
      const left = (offsetLeft / containerWidth * 100).toFixed(1);
      const right = ((containerWidth - (offsetLeft + offsetWidth)) / containerWidth * 100).toFixed(1);
      setClipPath(`inset(0.25rem ${right}% 0.25rem ${left}% round var(--tab-radius))`);
    } else if (activeTab < 0) {
      setClipPath('inset(0 100% 0 100%)');
    }
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    updateClipPath();
  }, [activeTab, tabs]);
  (0,_hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_4__["default"])(clipPathContainerRef, updateClipPath);
  const handleTabClick = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(index => {
    onSwitchTab(index);
  });
  if (!tabs.length) return undefined;
  const renderTab = (tab, index) => {
    const stringEmoticon = typeof tab.emoticon === 'string' ? tab.emoticon : undefined;
    const customEmoji = typeof tab.emoticon === 'object' ? tab.emoticon : undefined;
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tab, tabClassName, itemAlignment === 'vertical' && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].vertical, stretched && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].stretched),
      onClick: () => handleTabClick(index),
      children: [stringEmoticon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
        className: _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tabEmoji,
        children: stringEmoticon
      }), customEmoji && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_CustomEmoji__WEBPACK_IMPORTED_MODULE_5__["default"], {
        documentId: customEmoji.documentId,
        className: _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tabEmoji,
        size: EMOJI_SIZE,
        shouldNotLoop: true
      }), tab.icon && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
        name: tab.icon,
        className: _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].tabIcon
      }), tab.title, tab.isBlocked && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_6__["default"], {
        name: "lock-badge",
        className: _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].lockIcon
      })]
    }, tab.id ?? index);
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("div", {
    ref: containerRef,
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].container, centered && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].centered, itemAlignment === 'vertical' && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].vertical, className, clipPath && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].ready),
    children: [tabs.map(renderTab), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("div", {
      ref: clipPathContainerRef,
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].activeIndicator, centered && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].centered, stretched && _TabList_module_scss__WEBPACK_IMPORTED_MODULE_7__["default"].stretched, indicatorClassName),
      style: clipPath ? `clip-path: ${clipPath}` : undefined,
      "aria-hidden": true,
      children: tabs.map(renderTab)
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TabList));

/***/ },

/***/ "./src/components/ui/TextArea.tsx"
/*!****************************************!*\
  !*** ./src/components/ui/TextArea.tsx ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../lib/fasterdom/fasterdom */ "./src/lib/fasterdom/fasterdom.ts");
/* harmony import */ var _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/browser/globalEnvironment */ "./src/util/browser/globalEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useOldLang */ "./src/hooks/useOldLang.ts");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");







const TextArea = ({
  ref,
  id,
  className,
  value,
  label,
  error,
  success,
  disabled,
  readOnly,
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  maxLengthIndicator,
  tabIndex,
  onChange,
  onInput,
  onKeyPress,
  onKeyDown,
  onBlur,
  onPaste,
  noReplaceNewlines
}) => {
  let textareaRef = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  if (ref) {
    textareaRef = ref;
  }
  const lang = (0,_hooks_useOldLang__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const labelText = error || success || label;
  const fullClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_3__["default"])('input-group', value && 'touched', error ? 'error' : success && 'success', disabled && 'disabled', readOnly && 'disabled', labelText && 'with-label', className);
  const resizeHeight = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(element => {
    (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestMutation)(() => {
      element.style.height = '0';
      (0,_lib_fasterdom_fasterdom__WEBPACK_IMPORTED_MODULE_1__.requestForcedReflow)(() => {
        const newHeight = element.scrollHeight;
        return () => {
          element.style.height = `${newHeight}px`;
        };
      });
    });
  });
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    resizeHeight(textarea);
  }, []);
  const handleChange = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    const target = e.currentTarget;
    if (!noReplaceNewlines) {
      const previousSelectionEnd = target.selectionEnd;
      // TDesktop replaces newlines with spaces as well
      target.value = target.value.replace(/\n/g, ' ');
      target.selectionEnd = previousSelectionEnd;
    }
    resizeHeight(target);
    onChange?.(e);
  }, [noReplaceNewlines, onChange]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: fullClassName,
    dir: lang.isRtl ? 'rtl' : undefined,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("textarea", {
      ref: textareaRef,
      className: "form-control",
      id: id,
      dir: "auto",
      value: value || '',
      tabIndex: tabIndex,
      placeholder: placeholder,
      maxLength: maxLength,
      autoComplete: autoComplete,
      spellCheck: _util_browser_globalEnvironment__WEBPACK_IMPORTED_MODULE_2__.IS_TAURI ? false : undefined,
      inputMode: inputMode,
      disabled: disabled,
      readOnly: readOnly,
      onChange: handleChange,
      onInput: onInput,
      onKeyPress: onKeyPress,
      onKeyDown: onKeyDown,
      onBlur: onBlur,
      onPaste: onPaste,
      "aria-label": labelText
    }), labelText && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("label", {
      htmlFor: id,
      children: labelText
    }), maxLengthIndicator && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
      className: "max-length-indicator",
      children: maxLengthIndicator
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TextArea));

/***/ },

/***/ "./src/components/ui/TextTimer.tsx"
/*!*****************************************!*\
  !*** ./src/components/ui/TextTimer.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_localization_dateFormat__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/localization/dateFormat */ "./src/util/localization/dateFormat.ts");
/* harmony import */ var _util_serverTime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/serverTime */ "./src/util/serverTime.ts");
/* harmony import */ var _hooks_schedulers_useInterval__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../hooks/schedulers/useInterval */ "./src/hooks/schedulers/useInterval.ts");
/* harmony import */ var _hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks/schedulers/useTimeout */ "./src/hooks/schedulers/useTimeout.ts");
/* harmony import */ var _hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../hooks/useForceUpdate */ "./src/hooks/useForceUpdate.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../common/AnimatedCounter */ "./src/components/common/AnimatedCounter.tsx");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");









const DAY_IN_SECONDS = 24 * 60 * 60;
const UPDATE_FREQUENCY = 500; // Sometimes second gets skipped if using 1000

const TextTimer = ({
  className,
  endsAt,
  mode = 'clock',
  shouldShowZeroOnEnd,
  onEnd
}) => {
  const forceUpdate = (0,_hooks_useForceUpdate__WEBPACK_IMPORTED_MODULE_5__["default"])();
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_6__["default"])();
  const serverTime = (0,_util_serverTime__WEBPACK_IMPORTED_MODULE_2__.getServerTime)();
  const isActive = serverTime < endsAt;
  const timeLeft = Math.max(0, endsAt - serverTime);
  const shouldUseClock = mode === 'clock' || timeLeft < DAY_IN_SECONDS;
  const switchToClockDelay = isActive && mode === 'countdown' && !shouldUseClock ? (timeLeft - DAY_IN_SECONDS) * 1000 + UPDATE_FREQUENCY : undefined;
  (0,_hooks_schedulers_useTimeout__WEBPACK_IMPORTED_MODULE_4__["default"])(forceUpdate, switchToClockDelay);
  (0,_hooks_schedulers_useInterval__WEBPACK_IMPORTED_MODULE_3__["default"])(forceUpdate, isActive && shouldUseClock ? UPDATE_FREQUENCY : undefined);
  (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isActive) {
      onEnd?.();
    }
  }, [isActive, onEnd]);
  if (!isActive && !shouldShowZeroOnEnd) return undefined;
  if (mode === 'countdown' && !shouldUseClock) {
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
      className: className,
      children: (0,_util_localization_dateFormat__WEBPACK_IMPORTED_MODULE_1__.formatCountdownDateTime)(lang, (0,_util_localization_dateFormat__WEBPACK_IMPORTED_MODULE_1__.secondsToDate)(endsAt), {
        anchorDate: (0,_util_localization_dateFormat__WEBPACK_IMPORTED_MODULE_1__.secondsToDate)(serverTime)
      })
    });
  }
  const time = (0,_util_localization_dateFormat__WEBPACK_IMPORTED_MODULE_1__.formatClockDuration)(timeLeft);
  const timeParts = time.split(':');
  const clockNode = (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.Fragment, {
    children: timeParts.map((part, index) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsxs)("span", {
      children: [index > 0 && ':', (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(_common_AnimatedCounter__WEBPACK_IMPORTED_MODULE_7__["default"], {
        text: part
      })]
    }, index))
  });
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)("span", {
    className: className,
    style: "font-variant-numeric: tabular-nums;",
    children: mode === 'countdown' ? lang('TimeIn', {
      time: clockNode
    }, {
      withNodes: true
    }) : clockNode
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TextTimer);

/***/ },

/***/ "./src/components/ui/Toggle.tsx"
/*!**************************************!*\
  !*** ./src/components/ui/Toggle.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Toggle.module.scss */ "./src/components/ui/Toggle.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




function Toggle({
  value
}) {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].root, 'Toggle'),
    "aria-hidden": true,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("i", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].filler, _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"][value])
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("i", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].widget, _Toggle_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"][value])
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Toggle));

/***/ },

/***/ "./src/components/ui/mediaEditor/CropOverlay.tsx"
/*!*******************************************************!*\
  !*** ./src/components/ui/mediaEditor/CropOverlay.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaEditor.module.scss */ "./src/components/ui/mediaEditor/MediaEditor.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const CORNERS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
function CropOverlay({
  cropState,
  displaySize,
  scale,
  isFadingOut,
  onCropperDragStart,
  onCornerResizeStart
}) {
  const {
    cropperX,
    cropperY,
    cropperWidth,
    cropperHeight
  } = cropState;
  const frameX = cropperX * scale;
  const frameY = cropperY * scale;
  const frameWidth = cropperWidth * scale;
  const frameHeight = cropperHeight * scale;
  if (frameWidth === 0 || frameHeight === 0) return undefined;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].cropWrapper, isFadingOut && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].fadingOut),
    style: `width: ${displaySize.width}px; height: ${displaySize.height}px`,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].cropDarkOverlay,
      style: `clip-path: polygon(
          0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
          ${frameX}px ${frameY}px,
          ${frameX}px ${frameY + frameHeight}px,
          ${frameX + frameWidth}px ${frameY + frameHeight}px,
          ${frameX + frameWidth}px ${frameY}px,
          ${frameX}px ${frameY}px
        )`
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].cropRegion,
      style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(`left: ${frameX}px`, `top: ${frameY}px`, `width: ${frameWidth}px`, `height: ${frameHeight}px`),
      onMouseDown: onCropperDragStart,
      onTouchStart: onCropperDragStart,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].cropGrid
      })
    }), CORNERS.map(corner => {
      const isTop = corner === 'topLeft' || corner === 'topRight';
      const isLeft = corner === 'topLeft' || corner === 'bottomLeft';
      const x = isLeft ? frameX : frameX + frameWidth;
      const y = isTop ? frameY : frameY + frameHeight;
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].cropCorner, _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"][corner]),
        style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(`left: ${x}px`, `top: ${y}px`),
        onMouseDown: e => onCornerResizeStart(e, corner),
        onTouchStart: e => onCornerResizeStart(e, corner)
      }, corner);
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CropOverlay));

/***/ },

/***/ "./src/components/ui/mediaEditor/CropPanel.tsx"
/*!*****************************************************!*\
  !*** ./src/components/ui/mediaEditor/CropPanel.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useCropper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./hooks/useCropper */ "./src/components/ui/mediaEditor/hooks/useCropper.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _ListItem__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../ListItem */ "./src/components/ui/ListItem.tsx");
/* harmony import */ var _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./MediaEditor.module.scss */ "./src/components/ui/mediaEditor/MediaEditor.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");








const RATIO_ICON_CLASSES = {
  square: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio1x1,
  '3:2': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio3x2,
  '2:3': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio2x3,
  '4:3': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio4x3,
  '3:4': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio3x4,
  '5:4': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio5x4,
  '4:5': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio4x5,
  '16:9': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio16x9,
  '9:16': _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratio9x16
};

// First 3 ratios are displayed as full-width items
const FULL_WIDTH_RATIOS = _hooks_useCropper__WEBPACK_IMPORTED_MODULE_3__.ASPECT_RATIOS.slice(0, 3);

// Remaining ratios are displayed in pairs
const PAIRED_RATIOS = _hooks_useCropper__WEBPACK_IMPORTED_MODULE_3__.ASPECT_RATIOS.slice(3);
function CropPanel({
  currentRatio,
  onRatioChange
}) {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_2__["default"])();
  const renderRatioIcon = value => {
    if (value === 'free') {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "fullscreen",
        className: "ListItem-main-icon"
      });
    }
    if (value === 'original') {
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
        name: "photo",
        className: "ListItem-main-icon"
      });
    }
    return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('ListItem-main-icon', _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].ratioBox, RATIO_ICON_CLASSES[value])
    });
  };
  const renderRatioLabel = option => {
    if (option.labelKey) {
      return lang(option.labelKey);
    }
    return option.label;
  };
  const renderPairedRows = () => {
    // Generate row indices for paired ratios (0, 2, 4, ...)
    const rowIndices = Array.from({
      length: Math.ceil(PAIRED_RATIOS.length / 2)
    }, (_, i) => i * 2);
    return rowIndices.map(i => {
      const leftRatio = PAIRED_RATIOS[i];
      const rightRatio = PAIRED_RATIOS[i + 1];
      return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].aspectRatioRow,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_ListItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
          focus: currentRatio === leftRatio.value,
          onClick: () => onRatioChange(leftRatio.value),
          children: [renderRatioIcon(leftRatio.value), leftRatio.label]
        }), rightRatio && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_ListItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
          focus: currentRatio === rightRatio.value,
          onClick: () => onRatioChange(rightRatio.value),
          children: [renderRatioIcon(rightRatio.value), rightRatio.label]
        })]
      }, i);
    });
  };
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].sectionLabel,
      children: lang('AspectRatio')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_6__["default"].aspectRatioList,
      children: [FULL_WIDTH_RATIOS.map(option => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_ListItem__WEBPACK_IMPORTED_MODULE_5__["default"], {
        focus: currentRatio === option.value,
        onClick: () => onRatioChange(option.value),
        children: [renderRatioIcon(option.value), renderRatioLabel(option)]
      }, option.value)), renderPairedRows()]
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(CropPanel));

/***/ },

/***/ "./src/components/ui/mediaEditor/DrawPanel.tsx"
/*!*****************************************************!*\
  !*** ./src/components/ui/mediaEditor/DrawPanel.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useDrawing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./hooks/useDrawing */ "./src/components/ui/mediaEditor/hooks/useDrawing.ts");
/* harmony import */ var _InputText__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../InputText */ "./src/components/ui/InputText.tsx");
/* harmony import */ var _ListItem__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../ListItem */ "./src/components/ui/ListItem.tsx");
/* harmony import */ var _RangeSlider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../RangeSlider */ "./src/components/ui/RangeSlider.tsx");
/* harmony import */ var _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./DrawToolSvgs */ "./src/components/ui/mediaEditor/DrawToolSvgs.tsx");
/* harmony import */ var _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./MediaEditor.module.scss */ "./src/components/ui/mediaEditor/MediaEditor.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");











const DRAW_TOOLS = [{
  id: 'pen',
  labelKey: 'Pen',
  Icon: _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__.PenSvg
}, {
  id: 'arrow',
  labelKey: 'Arrow',
  Icon: _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__.ArrowSvg
}, {
  id: 'brush',
  labelKey: 'Brush',
  Icon: _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__.BrushSvg
}, {
  id: 'neon',
  labelKey: 'Neon',
  Icon: _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__.NeonSvg
}, {
  id: 'eraser',
  labelKey: 'Eraser',
  Icon: _DrawToolSvgs__WEBPACK_IMPORTED_MODULE_8__.EraserSvg
}];
function DrawPanel({
  predefinedColors,
  selectedColor,
  isColorPickerOpen,
  hue,
  saturation,
  brightness,
  pickerColor,
  hexInputValue,
  rgbInputValue,
  brushSize,
  drawTool,
  hueSliderRef,
  satBrightRef,
  onColorSelect,
  onOpenColorPicker,
  onCloseColorPicker,
  onHueSliderMouseDown,
  onHueChange,
  onSatBrightMouseDown,
  onSatBrightChange,
  onHexInput,
  onHexInputBlur,
  onRgbInput,
  onRgbInputBlur,
  onBrushSizeChange,
  onToolChange
}) {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_3__["default"])();
  const hueDeg = hue * 360;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.Fragment, {
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorRow,
      children: [isColorPickerOpen ? (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
        ref: hueSliderRef,
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].hueSlider,
        onMouseDown: onHueSliderMouseDown,
        onTouchStart: onHueChange,
        onTouchMove: onHueChange,
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].hueHandle,
          style: `--picker-hue: ${hueDeg}`
        })
      }) : predefinedColors.map(color => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("button", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorSwatch, selectedColor === color && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].selected),
        style: `--swatch-color: ${color}; --swatch-outline: ${color}1a`,
        onClick: () => onColorSelect(color),
        "aria-label": color
      }, color)), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("button", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorSwatch, _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].customColor, isColorPickerOpen && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].selected),
        onClick: isColorPickerOpen ? onCloseColorPicker : onOpenColorPicker,
        "aria-label": lang('CustomColor')
      })]
    }), isColorPickerOpen && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorPickerInline,
      children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorPickerRow,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
          ref: satBrightRef,
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].saturationBrightness,
          style: `--picker-hue: ${hueDeg}`,
          onMouseDown: onSatBrightMouseDown,
          onTouchStart: onSatBrightChange,
          onTouchMove: onSatBrightChange,
          children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].satBrightHandle,
            style: (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(`--picker-sat: ${saturation * 100}%`, `--picker-bright: ${(1 - brightness) * 100}%`, `--picker-color: ${pickerColor}`)
          })
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorInputs,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_InputText__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorInput,
            label: lang('HEX'),
            value: hexInputValue,
            onChange: onHexInput,
            onBlur: onHexInputBlur,
            maxLength: 7
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_InputText__WEBPACK_IMPORTED_MODULE_5__["default"], {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].colorInput,
            label: lang('RGB'),
            value: rgbInputValue,
            onChange: onRgbInput,
            onBlur: onRgbInputBlur
          })]
        })]
      })
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sizeRow,
      style: `--selected-color: ${selectedColor}`,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("span", {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sectionLabel,
        children: [lang('Size'), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sizeValue,
          children: brushSize
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_RangeSlider__WEBPACK_IMPORTED_MODULE_7__["default"], {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sizeSlider,
        min: _hooks_useDrawing__WEBPACK_IMPORTED_MODULE_4__.MIN_BRUSH_SIZE,
        max: _hooks_useDrawing__WEBPACK_IMPORTED_MODULE_4__.MAX_BRUSH_SIZE,
        value: brushSize,
        onChange: onBrushSizeChange,
        bold: true
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].sectionLabel,
      children: lang('Tool')
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].toolList,
      children: DRAW_TOOLS.map(tool => {
        const iconClassName = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('ListItem-main-icon', _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].toolIcon, drawTool === tool.id && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].toolIconActive);
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_ListItem__WEBPACK_IMPORTED_MODULE_6__["default"], {
          focus: drawTool === tool.id,
          onClick: () => onToolChange(tool.id),
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: iconClassName,
            style: `color: ${selectedColor}`,
            children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(tool.Icon, {})
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_9__["default"].toolLabel,
            children: lang(tool.labelKey)
          })]
        }, tool.id);
      })
    })]
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(DrawPanel));

/***/ },

/***/ "./src/components/ui/mediaEditor/DrawToolSvgs.tsx"
/*!********************************************************!*\
  !*** ./src/components/ui/mediaEditor/DrawToolSvgs.tsx ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ArrowSvg: () => (/* binding */ ArrowSvg),
/* harmony export */   BrushSvg: () => (/* binding */ BrushSvg),
/* harmony export */   EraserSvg: () => (/* binding */ EraserSvg),
/* harmony export */   NeonSvg: () => (/* binding */ NeonSvg),
/* harmony export */   PenSvg: () => (/* binding */ PenSvg)
/* harmony export */ });
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");

/* eslint-disable @stylistic/max-len */

function PenSvg() {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "20",
    viewBox: "0 0 120 20",
    className: "draw-tool-icon",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
      "clip-path": "url(#clip0_2524_7134)",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter0_iiii_2524_7134)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M0 1H80L110.2 8.44653C112.048 8.90213 112.971 9.12994 113.185 9.49307C113.369 9.80597 113.369 10.194 113.185 10.5069C112.971 10.8701 112.048 11.0979 110.2 11.5535L80 19H0V1Z",
          fill: "#3E3F3F"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M112.564 10.9709L103.474 13.2132C103.21 13.2782 102.944 13.121 102.883 12.8566C102.736 12.2146 102.5 11.0296 102.5 10C102.5 8.9705 102.736 7.78549 102.883 7.14344C102.944 6.87906 103.21 6.72187 103.474 6.78685L112.564 9.02913C113.578 9.27925 113.578 10.7208 112.564 10.9709Z",
        fill: "currentColor"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
        x: "76",
        y: "1",
        width: "4",
        height: "18",
        rx: "0.5",
        fill: "currentColor"
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter0_iiii_2524_7134",
        x: "0",
        y: "-4",
        width: "116.323",
        height: "28",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7134"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "3",
          dy: "-5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect1_innerShadow_2524_7134",
          result: "effect2_innerShadow_2524_7134"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "-1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect2_innerShadow_2524_7134",
          result: "effect3_innerShadow_2524_7134"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect3_innerShadow_2524_7134",
          result: "effect4_innerShadow_2524_7134"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("clipPath", {
        id: "clip0_2524_7134",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
          width: "20",
          height: "120",
          fill: "currentColor",
          transform: "matrix(0 1 -1 0 120 0)"
        })
      })]
    })]
  });
}
function ArrowSvg() {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "20",
    viewBox: "0 0 120 20",
    className: "draw-tool-icon",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
      "clip-path": "url(#clip0_2524_7140)",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M94 10H110M110 10L104 4M110 10L104 16",
        stroke: "url(#paint0_linear_2524_7140)",
        "stroke-width": "3",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter0_iiii_2524_7140)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M0 1H92C94.2091 1 96 2.79086 96 5V15C96 17.2091 94.2091 19 92 19H0V1Z",
          fill: "#3E3F3F"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M92 1C94.2091 1 96 2.79086 96 5V15C96 17.2091 94.2091 19 92 19V1Z",
        fill: "currentColor"
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter0_iiii_2524_7140",
        x: "0",
        y: "-4",
        width: "99",
        height: "28",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7140"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "3",
          dy: "-5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect1_innerShadow_2524_7140",
          result: "effect2_innerShadow_2524_7140"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "-1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect2_innerShadow_2524_7140",
          result: "effect3_innerShadow_2524_7140"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect3_innerShadow_2524_7140",
          result: "effect4_innerShadow_2524_7140"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("linearGradient", {
        id: "paint0_linear_2524_7140",
        x1: "110",
        y1: "10",
        x2: "94",
        y2: "10",
        gradientUnits: "userSpaceOnUse",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("stop", {
          offset: "0.755",
          "stop-color": "currentColor"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("stop", {
          offset: "1",
          "stop-color": "currentColor",
          "stop-opacity": "0"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("clipPath", {
        id: "clip0_2524_7140",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
          width: "20",
          height: "120",
          fill: "currentColor",
          transform: "matrix(0 1 -1 0 120 0)"
        })
      })]
    })]
  });
}
function BrushSvg() {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "20",
    viewBox: "0 0 120 20",
    className: "draw-tool-icon",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
      "clip-path": "url(#clip0_2524_7174)",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter0_iiii_2524_7174)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M0 1H82.3579C83.4414 1 84.5135 1.22006 85.5093 1.64684L91 4H101C101.552 4 102 4.44772 102 5V15C102 15.5523 101.552 16 101 16H91L85.5093 18.3532C84.5135 18.7799 83.4414 19 82.3579 19H0V1Z",
          fill: "#3E3F3F"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
        x: "76",
        y: "1",
        width: "4",
        height: "18",
        rx: "0.5",
        fill: "currentColor"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M102 5H106.434C106.785 5 107.111 5.1843 107.291 5.4855L112.091 13.4855C112.491 14.152 112.011 15 111.234 15H102V5Z",
        fill: "currentColor"
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter0_iiii_2524_7174",
        x: "0",
        y: "-4",
        width: "105",
        height: "28",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7174"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "3",
          dy: "-5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect1_innerShadow_2524_7174",
          result: "effect2_innerShadow_2524_7174"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "-1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect2_innerShadow_2524_7174",
          result: "effect3_innerShadow_2524_7174"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect3_innerShadow_2524_7174",
          result: "effect4_innerShadow_2524_7174"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("clipPath", {
        id: "clip0_2524_7174",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
          width: "20",
          height: "120",
          fill: "currentColor",
          transform: "matrix(0 1 -1 0 120 0)"
        })
      })]
    })]
  });
}
function NeonSvg() {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "20",
    viewBox: "0 0 120 20",
    className: "draw-tool-icon",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
      "clip-path": "url(#clip0_2524_7180)",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter0_f_2524_7180)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M102 5H107.146C108.282 5 109.323 5.64872 109.601 6.75061C109.813 7.59297 110 8.70303 110 10C110 11.297 109.813 12.407 109.601 13.2494C109.323 14.3513 108.282 15 107.146 15H102V5Z",
          fill: "currentColor"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter1_f_2524_7180)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M102 5H107.146C108.282 5 109.323 5.64872 109.601 6.75061C109.813 7.59297 110 8.70303 110 10C110 11.297 109.813 12.407 109.601 13.2494C109.323 14.3513 108.282 15 107.146 15H102V5Z",
          fill: "currentColor"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter2_f_2524_7180)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M102 5H107.146C108.282 5 109.323 5.64872 109.601 6.75061C109.813 7.59297 110 8.70303 110 10C110 11.297 109.813 12.407 109.601 13.2494C109.323 14.3513 108.282 15 107.146 15H102V5Z",
          fill: "currentColor"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter3_iiii_2524_7180)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M0 1H82.3579C83.4414 1 84.5135 1.22006 85.5093 1.64684L91 4H101C101.552 4 102 4.44772 102 5V15C102 15.5523 101.552 16 101 16H91L85.5093 18.3532C84.5135 18.7799 83.4414 19 82.3579 19H0V1Z",
          fill: "#3E3F3F"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
        x: "76",
        y: "1",
        width: "4",
        height: "18",
        rx: "0.5",
        fill: "currentColor"
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M102 5H107.146C108.282 5 109.323 5.64872 109.601 6.75061C109.813 7.59297 110 8.70303 110 10C110 11.297 109.813 12.407 109.601 13.2494C109.323 14.3513 108.282 15 107.146 15H102V5Z",
        fill: "currentColor"
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter0_f_2524_7180",
        x: "96",
        y: "-1",
        width: "20",
        height: "22",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3",
          result: "effect1_foregroundBlur_2524_7180"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter1_f_2524_7180",
        x: "96",
        y: "-1",
        width: "20",
        height: "22",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3",
          result: "effect1_foregroundBlur_2524_7180"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter2_f_2524_7180",
        x: "96",
        y: "-1",
        width: "20",
        height: "22",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3",
          result: "effect1_foregroundBlur_2524_7180"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter3_iiii_2524_7180",
        x: "0",
        y: "-4",
        width: "105",
        height: "28",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7180"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "3",
          dy: "-5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect1_innerShadow_2524_7180",
          result: "effect2_innerShadow_2524_7180"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "-1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect2_innerShadow_2524_7180",
          result: "effect3_innerShadow_2524_7180"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect3_innerShadow_2524_7180",
          result: "effect4_innerShadow_2524_7180"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("clipPath", {
        id: "clip0_2524_7180",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
          width: "20",
          height: "120",
          fill: "currentColor",
          transform: "matrix(0 1 -1 0 120 0)"
        })
      })]
    })]
  });
}
function EraserSvg() {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "120",
    height: "20",
    viewBox: "0 0 120 20",
    className: "draw-tool-icon",
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
      "clip-path": "url(#clip0_2524_7149)",
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("g", {
        filter: "url(#filter0_i_2524_7149)",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M95 1H108C110.209 1 112 2.79086 112 5V15C112 17.2091 110.209 19 108 19H95V1Z",
          fill: "#D9D9D9"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M95 1H108C110.209 1 112 2.79086 112 5V15C112 17.2091 110.209 19 108 19H95V1Z",
          fill: "#F09B99"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("g", {
        filter: "url(#filter1_iiii_2524_7149)",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
          d: "M0 1H77.6464C77.8728 1 78.0899 0.910072 78.25 0.75C78.4101 0.589928 78.6272 0.5 78.8536 0.5H96C97.1046 0.5 98 1.39543 98 2.5V17.5C98 18.6046 97.1046 19.5 96 19.5H78.8536C78.6272 19.5 78.4101 19.4101 78.25 19.25C78.0899 19.0899 77.8728 19 77.6464 19H0V1Z",
          fill: "#3E3F3F"
        })
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("path", {
        d: "M79 19.5V0.5L78 0.5V19.5H79Z",
        fill: "black",
        "fill-opacity": "0.33"
      })]
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("defs", {
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter0_i_2524_7149",
        x: "95",
        y: "-1",
        width: "19",
        height: "20",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "2",
          dy: "-2"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "2"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.33 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7149"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("filter", {
        id: "filter1_iiii_2524_7149",
        x: "0",
        y: "-4.5",
        width: "101",
        height: "29",
        filterUnits: "userSpaceOnUse",
        "color-interpolation-filters": "sRGB",
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feFlood", {
          "flood-opacity": "0",
          result: "BackgroundImageFix"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in: "SourceGraphic",
          in2: "BackgroundImageFix",
          result: "shape"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "shape",
          result: "effect1_innerShadow_2524_7149"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "3",
          dy: "-5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "3"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.137255 0 0 0 0 0.145098 0 0 0 0 0.14902 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect1_innerShadow_2524_7149",
          result: "effect2_innerShadow_2524_7149"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "-1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect2_innerShadow_2524_7149",
          result: "effect3_innerShadow_2524_7149"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          in: "SourceAlpha",
          type: "matrix",
          values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0",
          result: "hardAlpha"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feOffset", {
          dx: "1",
          dy: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feGaussianBlur", {
          stdDeviation: "0.5"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feComposite", {
          in2: "hardAlpha",
          operator: "arithmetic",
          k2: "-1",
          k3: "1"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feColorMatrix", {
          type: "matrix",
          values: "0 0 0 0 0.242217 0 0 0 0 0.247242 0 0 0 0 0.247101 0 0 0 1 0"
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("feBlend", {
          mode: "normal",
          in2: "effect3_innerShadow_2524_7149",
          result: "effect4_innerShadow_2524_7149"
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("clipPath", {
        id: "clip0_2524_7149",
        children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("rect", {
          width: "20",
          height: "120",
          fill: "white",
          transform: "matrix(0 1 -1 0 120 0)"
        })
      })]
    })]
  });
}

/***/ },

/***/ "./src/components/ui/mediaEditor/MediaEditor.tsx"
/*!*******************************************************!*\
  !*** ./src/components/ui/mediaEditor/MediaEditor.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _global_selectors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../global/selectors */ "./src/global/selectors/index.ts");
/* harmony import */ var _global_selectors_sharedState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../global/selectors/sharedState */ "./src/global/selectors/sharedState.ts");
/* harmony import */ var _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../util/browser/windowEnvironment */ "./src/util/browser/windowEnvironment.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _util_captureEscKeyListener__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../util/captureEscKeyListener */ "./src/util/captureEscKeyListener.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _util_files__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../util/files */ "./src/util/files.ts");
/* harmony import */ var _util_resolveTransitionName__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../util/resolveTransitionName */ "./src/util/resolveTransitionName.ts");
/* harmony import */ var _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../common/helpers/mediaDimensions */ "./src/components/common/helpers/mediaDimensions.ts");
/* harmony import */ var _canvasUtils__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./canvasUtils */ "./src/components/ui/mediaEditor/canvasUtils.ts");
/* harmony import */ var _hooks_data_useSelector__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../hooks/data/useSelector */ "./src/hooks/data/useSelector.ts");
/* harmony import */ var _hooks_useLang__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../hooks/useLang */ "./src/hooks/useLang.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../hooks/useShowTransition */ "./src/hooks/useShowTransition.ts");
/* harmony import */ var _hooks_useCanvasRenderer__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./hooks/useCanvasRenderer */ "./src/components/ui/mediaEditor/hooks/useCanvasRenderer.ts");
/* harmony import */ var _hooks_useColorPicker__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./hooks/useColorPicker */ "./src/components/ui/mediaEditor/hooks/useColorPicker.ts");
/* harmony import */ var _hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./hooks/useCropper */ "./src/components/ui/mediaEditor/hooks/useCropper.ts");
/* harmony import */ var _hooks_useDisplaySize__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./hooks/useDisplaySize */ "./src/components/ui/mediaEditor/hooks/useDisplaySize.ts");
/* harmony import */ var _hooks_useDrawing__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./hooks/useDrawing */ "./src/components/ui/mediaEditor/hooks/useDrawing.ts");
/* harmony import */ var _common_icons_Icon__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../common/icons/Icon */ "./src/components/common/icons/Icon.tsx");
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../Button */ "./src/components/ui/Button.tsx");
/* harmony import */ var _FloatingActionButton__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../FloatingActionButton */ "./src/components/ui/FloatingActionButton.tsx");
/* harmony import */ var _Portal__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../Portal */ "./src/components/ui/Portal.ts");
/* harmony import */ var _SquareTabList__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../SquareTabList */ "./src/components/ui/SquareTabList.tsx");
/* harmony import */ var _Transition__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../Transition */ "./src/components/ui/Transition.tsx");
/* harmony import */ var _CropOverlay__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./CropOverlay */ "./src/components/ui/mediaEditor/CropOverlay.tsx");
/* harmony import */ var _CropPanel__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./CropPanel */ "./src/components/ui/mediaEditor/CropPanel.tsx");
/* harmony import */ var _DrawPanel__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./DrawPanel */ "./src/components/ui/mediaEditor/DrawPanel.tsx");
/* harmony import */ var _RotationSlider__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./RotationSlider */ "./src/components/ui/mediaEditor/RotationSlider.tsx");
/* harmony import */ var _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./MediaEditor.module.scss */ "./src/components/ui/mediaEditor/MediaEditor.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");

































const EDITOR_TABS = [{
  type: 'draw',
  icon: 'brush'
}, {
  type: 'crop',
  icon: 'crop'
}];
const INITIAL_MODE = 'draw';
const TABS = EDITOR_TABS.map(tab => ({
  title: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_21__["default"], {
    name: tab.icon
  })
}));
const TRANSITION_DURATION = 300;
const MediaEditor = ({
  isOpen,
  imageUrl,
  mimeType,
  filename,
  onClose,
  onSave
}) => {
  const lang = (0,_hooks_useLang__WEBPACK_IMPORTED_MODULE_13__["default"])();
  const animationLevel = (0,_hooks_data_useSelector__WEBPACK_IMPORTED_MODULE_12__["default"])(_global_selectors_sharedState__WEBPACK_IMPORTED_MODULE_2__.selectAnimationLevel);
  const theme = (0,_hooks_data_useSelector__WEBPACK_IMPORTED_MODULE_12__["default"])(_global_selectors__WEBPACK_IMPORTED_MODULE_1__.selectTheme);
  const predefinedColors = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_hooks_useColorPicker__WEBPACK_IMPORTED_MODULE_17__.getPredefinedColors)(theme), [theme]);
  const {
    ref: rootRef,
    shouldRender
  } = (0,_hooks_useShowTransition__WEBPACK_IMPORTED_MODULE_15__["default"])({
    isOpen,
    withShouldRender: true
  });
  const transitionRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const canvasRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const canvasAreaRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const originalImageRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(undefined);
  const [mode, setMode] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(INITIAL_MODE);
  const [isTransitioning, setIsTransitioning] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [snapshotSrc, setSnapshotSrc] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [snapshotStyle, setSnapshotStyle] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [imageDimensions, setImageDimensions] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    width: 0,
    height: 0
  });
  const [cropState, setCropState] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__.DEFAULT_CROP_STATE);
  const effectiveDims = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (imageDimensions.width === 0) return {
      width: 0,
      height: 0
    };
    return (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.getEffectiveDimensions)(imageDimensions.width, imageDimensions.height, cropState.quarterTurns);
  }, [imageDimensions.width, imageDimensions.height, cropState.quarterTurns]);
  const [transformAnimType, setTransformAnimType] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)();
  const [actions, setActions] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [redoStack, setRedoStack] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const actionsRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  const redoStackRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  actionsRef.current = actions;
  redoStackRef.current = redoStack;

  // Display size hook - must be called before useCropper and useCanvasRenderer
  const {
    displaySize,
    getDisplayScale,
    resetDisplaySize
  } = (0,_hooks_useDisplaySize__WEBPACK_IMPORTED_MODULE_19__["default"])({
    canvasAreaRef,
    imageWidth: effectiveDims.width,
    imageHeight: effectiveDims.height,
    reservedHeight: 6.5 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_10__.REM
  });

  // Color picker hook
  const {
    hueSliderRef,
    satBrightRef,
    selectedColor,
    setSelectedColor,
    isColorPickerOpen,
    openColorPicker,
    closeColorPicker,
    hue,
    saturation,
    brightness,
    pickerColor,
    hexInputValue,
    rgbInputValue,
    handleHueChange,
    handleSatBrightChange,
    handleHexInput,
    handleHexInputBlur,
    handleRgbInput,
    handleRgbInputBlur,
    handleColorSelect,
    handleHueSliderMouseDown,
    handleSatBrightMouseDown
  } = (0,_hooks_useColorPicker__WEBPACK_IMPORTED_MODULE_17__["default"])({
    initialColor: predefinedColors[1]
  });

  // Get display coordinates for cropper
  const getDisplayCoordinates = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(e => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0,
      y: 0
    };
    const rect = canvas.getBoundingClientRect();
    const {
      x: clientX,
      y: clientY
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_7__["default"])(e);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  });

  // Handle crop actions
  const handleCropAction = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(action => {
    setActions(prev => [...prev, action]);
    setRedoStack([]);
  });

  // Cropper hook
  const {
    getCroppedRegion,
    initCropState,
    handleCropperDragStart,
    handleCornerResizeStart,
    handleAspectRatioChange,
    handleRotationChange,
    handleRotationChangeEnd,
    handleQuarterRotate,
    handleFlip
  } = (0,_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__["default"])({
    imageRef: originalImageRef,
    displaySize,
    getDisplayScale,
    getDisplayCoordinates,
    onAction: handleCropAction,
    cropState,
    setCropState
  });

  // Memoize drawActions to avoid filtering on every render
  const drawActions = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => actions.filter(a => a.type === 'draw'), [actions]);

  // Get canvas coordinates for drawing
  const getCanvasCoordinates = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(e => {
    const canvas = canvasRef.current;
    if (!canvas) return {
      x: 0,
      y: 0
    };
    const rect = canvas.getBoundingClientRect();
    const {
      x: clientX,
      y: clientY
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_7__["default"])(e);
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  });
  const inverseTransformPoint = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])((x, y, effCenterX, effCenterY, imgCenterX, imgCenterY, zoom) => {
    const rotation = (0,_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__.getTotalRotation)(cropState);
    const {
      flipH
    } = cropState;

    // Translate to effective center
    let tx = x - effCenterX;
    let ty = y - effCenterY;

    // Inverse rotation
    if (rotation !== 0) {
      const rad = -rotation * Math.PI / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const newX = tx * cos - ty * sin;
      const newY = tx * sin + ty * cos;
      tx = newX;
      ty = newY;
    }

    // Divide by zoom
    tx /= zoom;
    ty /= zoom;

    // Inverse flip
    if (flipH) tx = -tx;

    // Translate back to image center
    return {
      x: tx + imgCenterX,
      y: ty + imgCenterY
    };
  });
  const canvasToImageCoords = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])((canvasX, canvasY) => {
    const crop = getCroppedRegion();
    const img = originalImageRef.current;
    const effectiveX = crop.x + canvasX;
    const effectiveY = crop.y + canvasY;
    if (!img || mode !== 'draw') return {
      x: effectiveX,
      y: effectiveY
    };
    const {
      width: effW,
      height: effH
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.getEffectiveDimensions)(img.width, img.height, cropState.quarterTurns);
    const rotation = (0,_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__.getTotalRotation)(cropState);
    const {
      flipH
    } = cropState;
    const zoom = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.computeRotationZoom)(effW, effH, cropState.rotation);
    if (rotation === 0 && !flipH && zoom === 1) {
      return {
        x: effectiveX,
        y: effectiveY
      };
    }
    return inverseTransformPoint(effectiveX, effectiveY, effW / 2, effH / 2, img.width / 2, img.height / 2, zoom);
  });

  // Handle draw action complete
  const handleDrawActionComplete = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(action => {
    setActions(prev => [...prev, action]);
    setRedoStack([]);
  });

  // Drawing hook
  const {
    drawTool,
    setDrawTool,
    brushSize,
    setBrushSize,
    currentDrawAction,
    handlePointerDown,
    resetDrawing
  } = (0,_hooks_useDrawing__WEBPACK_IMPORTED_MODULE_20__["default"])({
    getCanvasCoordinates,
    canvasToImageCoords,
    selectedColor,
    onActionComplete: handleDrawActionComplete
  });

  // Canvas renderer hook
  const {
    canvasSize,
    renderCanvas,
    resetCanvasSize
  } = (0,_hooks_useCanvasRenderer__WEBPACK_IMPORTED_MODULE_16__["default"])({
    canvasRef,
    imageRef: originalImageRef,
    mode,
    cropState,
    drawActions,
    currentDrawAction
  });

  // Reset state when editor opens
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isOpen && imageUrl) {
      setActions([]);
      setRedoStack([]);
      resetDrawing();
      setMode(INITIAL_MODE);
      setSnapshotSrc(undefined);
      setIsTransitioning(false);
      setTransformAnimType(undefined);
      setSelectedColor(predefinedColors[1]);
      setCropState(_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__.DEFAULT_CROP_STATE);
      resetCanvasSize();
      resetDisplaySize();
      setImageDimensions({
        width: 0,
        height: 0
      });
      originalImageRef.current = undefined;
    }
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [isOpen, imageUrl]);

  // Initialize canvas when image loads
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen || !imageUrl) return;
    const initCanvas = async () => {
      let image;
      try {
        image = await (0,_util_files__WEBPACK_IMPORTED_MODULE_8__.preloadImage)(imageUrl);
      } catch {
        return;
      }
      originalImageRef.current = image;
      setImageDimensions({
        width: image.width,
        height: image.height
      });
      initCropState(image.width, image.height);
      renderCanvas();
    };
    initCanvas();
  }, [isOpen, imageUrl, renderCanvas, initCropState]);

  // Esc key handler via captureEscKeyListener (participates in shared handler stack)
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) return undefined;
    return (0,_util_captureEscKeyListener__WEBPACK_IMPORTED_MODULE_6__["default"])(() => {
      if (isColorPickerOpen) {
        closeColorPicker();
      } else {
        onClose();
      }
    });
  }, [isOpen, isColorPickerOpen, closeColorPicker, onClose]);

  // Keyboard shortcuts (undo/redo)
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = e => {
      const isMeta = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (isMeta && key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (isMeta && key === 'z' && e.shiftKey || _util_browser_windowEnvironment__WEBPACK_IMPORTED_MODULE_3__.IS_WINDOWS && isMeta && key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);
  const handleUndo = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(() => {
    const actionList = actionsRef.current;
    if (actionList.length === 0) return;
    const lastAction = actionList[actionList.length - 1];
    const newActions = actionList.slice(0, -1);
    if (lastAction.type === 'crop') {
      const currentState = {
        ...cropState
      };
      setCropState(lastAction.previousState);
      setRedoStack(prev => [...prev, {
        type: 'crop',
        previousState: currentState
      }]);
    } else {
      setRedoStack(prev => [...prev, lastAction]);
    }
    setActions(newActions);
  });
  const handleRedo = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(() => {
    const redo = redoStackRef.current;
    if (redo.length === 0) return;
    const actionToRedo = redo[redo.length - 1];
    const newRedoStack = redo.slice(0, -1);
    if (actionToRedo.type === 'crop') {
      const currentState = {
        ...cropState
      };
      setCropState(actionToRedo.previousState);
      setActions(prev => [...prev, {
        type: 'crop',
        previousState: currentState
      }]);
    } else {
      setActions(prev => [...prev, actionToRedo]);
    }
    setRedoStack(newRedoStack);
  });
  const captureCanvasSnapshot = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(computeStyle => {
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0 || canvas.height === 0) return;
    try {
      const displayWidth = canvas.offsetWidth;
      const displayHeight = canvas.offsetHeight;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = displayWidth;
      tempCanvas.height = displayHeight;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(canvas, 0, 0, displayWidth, displayHeight);
        setSnapshotSrc(tempCanvas.toDataURL());
        setSnapshotStyle(computeStyle ? computeStyle(displayWidth, displayHeight) : `width: ${displayWidth}px; height: ${displayHeight}px`);
      }
    } catch {
      // Canvas might be tainted
    }
  });
  const handleQuarterRotateAnimated = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(() => {
    if (animationLevel > 0) {
      captureCanvasSnapshot((oldW, oldH) => {
        // Compute scale factors so the rotated snapshot matches the new canvas size
        const canvasArea = canvasAreaRef.current;
        if (!canvasArea) return `width: ${oldW}px; height: ${oldH}px`;
        const newEffDims = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.getEffectiveDimensions)(imageDimensions.width, imageDimensions.height, (cropState.quarterTurns + 1) % 4);
        const areaRect = canvasArea.getBoundingClientRect();
        const areaStyle = getComputedStyle(canvasArea);
        const padX = parseFloat(areaStyle.paddingLeft) + parseFloat(areaStyle.paddingRight);
        const padY = parseFloat(areaStyle.paddingTop) + parseFloat(areaStyle.paddingBottom);
        const scaleToFit = Math.min((areaRect.width - padX) / newEffDims.width, (areaRect.height - padY - 6.5 * _common_helpers_mediaDimensions__WEBPACK_IMPORTED_MODULE_10__.REM) / newEffDims.height, 1);
        const newW = newEffDims.width * scaleToFit;
        const newH = newEffDims.height * scaleToFit;

        // After CSS rotate(-90deg) scale(sx, sy), visual bounds = (oldH*sy, oldW*sx)
        const sx = newH / oldW;
        const sy = newW / oldH;
        return `width: ${oldW}px; height: ${oldH}px; --end-sx: ${sx}; --end-sy: ${sy}`;
      });
      setTransformAnimType('rotate');
    }
    handleQuarterRotate();
    if (animationLevel > 0) {
      setTimeout(() => {
        setTransformAnimType(undefined);
        setSnapshotSrc(undefined);
      }, TRANSITION_DURATION);
    }
  });
  const handleFlipAnimated = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(() => {
    if (animationLevel > 0) {
      captureCanvasSnapshot();
      setTransformAnimType('flip');
    }
    handleFlip();
    if (animationLevel > 0) {
      setTimeout(() => {
        setTransformAnimType(undefined);
        setSnapshotSrc(undefined);
      }, TRANSITION_DURATION);
    }
  });
  const handleSave = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(() => {
    const img = originalImageRef.current;
    if (!img) return;
    const crop = getCroppedRegion();
    if (crop.width <= 0 || crop.height <= 0) return;
    const rotation = (0,_hooks_useCropper__WEBPACK_IMPORTED_MODULE_18__.getTotalRotation)(cropState);
    const {
      flipH
    } = cropState;
    const {
      width: effW,
      height: effH
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.getEffectiveDimensions)(img.width, img.height, cropState.quarterTurns);
    const zoom = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.computeRotationZoom)(effW, effH, cropState.rotation);
    const hasTransforms = rotation !== 0 || flipH || cropState.quarterTurns !== 0 || zoom !== 1;

    // Stage 1: Render full image with transforms at effective dims
    const fullCanvas = document.createElement('canvas');
    fullCanvas.width = effW;
    fullCanvas.height = effH;
    const fullCtx = fullCanvas.getContext('2d');
    if (!fullCtx) return;
    if (hasTransforms) {
      fullCtx.save();
      (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.applyCanvasTransform)(fullCtx, img, rotation, flipH, cropState.quarterTurns, zoom);
    }
    fullCtx.drawImage(img, 0, 0);
    (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_11__.renderActionsToCanvas)(fullCtx, drawActions, 0, 0, undefined, img.width, img.height);
    if (hasTransforms) {
      fullCtx.restore();
    }

    // Stage 2: Crop from effective space
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = Math.round(crop.width);
    finalCanvas.height = Math.round(crop.height);
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(fullCanvas, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    const mimeTypeToUse = mimeType || 'image/jpeg';
    finalCanvas.toBlob(blob => {
      if (blob) {
        const resultFilename = filename || `image.${getExtensionFromMimeType(mimeTypeToUse)}`;
        const file = (0,_util_files__WEBPACK_IMPORTED_MODULE_8__.blobToFile)(blob, resultFilename);
        onSave(file);
        onClose();
      }
    }, mimeTypeToUse);
  });
  const activeTabIndex = EDITOR_TABS.findIndex(tab => tab.type === mode);
  const handleTabSwitch = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_14__["default"])(index => {
    const tab = EDITOR_TABS[index];
    if (tab && tab.type !== mode) {
      if (animationLevel > 0) {
        if (tab.type === 'draw') {
          // Crop → Draw: compute crop frame for zoom animation
          captureCanvasSnapshot((displayWidth, displayHeight) => {
            const scale = getDisplayScale();
            const fW = cropState.cropperWidth * scale;
            const fH = cropState.cropperHeight * scale;
            const fX = cropState.cropperX * scale;
            const fY = cropState.cropperY * scale;
            return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_5__["default"])(`width: ${displayWidth}px`, `height: ${displayHeight}px`, `--crop-top: ${fY}px`, `--crop-right: ${displayWidth - (fX + fW)}px`, `--crop-bottom: ${displayHeight - (fY + fH)}px`, `--crop-left: ${fX}px`, `--offset-x: ${displayWidth / 2 - (fX + fW / 2)}px`, `--offset-y: ${displayHeight / 2 - (fY + fH / 2)}px`);
          });
        } else {
          captureCanvasSnapshot();
        }
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
          setSnapshotSrc(undefined);
        }, TRANSITION_DURATION);
      }
      setMode(tab.type);
    }
  });
  const canUndo = actions.length > 0;
  const canRedo = redoStack.length > 0;
  const renderPanelContent = () => {
    switch (mode) {
      case 'crop':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_CropPanel__WEBPACK_IMPORTED_MODULE_28__["default"], {
          currentRatio: cropState.aspectRatio,
          onRatioChange: handleAspectRatioChange
        });
      case 'draw':
        return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_DrawPanel__WEBPACK_IMPORTED_MODULE_29__["default"], {
          predefinedColors: predefinedColors,
          selectedColor: selectedColor,
          isColorPickerOpen: isColorPickerOpen,
          hue: hue,
          saturation: saturation,
          brightness: brightness,
          pickerColor: pickerColor,
          hexInputValue: hexInputValue,
          rgbInputValue: rgbInputValue,
          brushSize: brushSize,
          drawTool: drawTool,
          hueSliderRef: hueSliderRef,
          satBrightRef: satBrightRef,
          onColorSelect: handleColorSelect,
          onOpenColorPicker: openColorPicker,
          onCloseColorPicker: closeColorPicker,
          onHueSliderMouseDown: handleHueSliderMouseDown,
          onHueChange: handleHueChange,
          onSatBrightMouseDown: handleSatBrightMouseDown,
          onSatBrightChange: handleSatBrightChange,
          onHexInput: handleHexInput,
          onHexInputBlur: handleHexInputBlur,
          onRgbInput: handleRgbInput,
          onRgbInputBlur: handleRgbInputBlur,
          onBrushSizeChange: setBrushSize,
          onToolChange: setDrawTool
        });
      default:
        return undefined;
    }
  };
  const isTransitioningToDraw = isTransitioning && mode === 'draw';
  const isTransitioningToCrop = isTransitioning && mode === 'crop';
  const shouldShowCropOverlay = mode === 'crop' || isTransitioningToDraw;
  const displayScale = getDisplayScale();
  const canvasStyle = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (displaySize.width === 0) return '';
    if (mode === 'crop') {
      const baseStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_5__["default"])(`width: ${displaySize.width}px`, `height: ${displaySize.height}px`);
      if (isTransitioning) {
        // Draw → Crop: pass crop frame vars for zoom-out animation
        const fW = cropState.cropperWidth * displayScale;
        const fH = cropState.cropperHeight * displayScale;
        const fX = cropState.cropperX * displayScale;
        const fY = cropState.cropperY * displayScale;
        return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_5__["default"])(baseStyle, `--crop-top: ${fY}px`, `--crop-right: ${displaySize.width - (fX + fW)}px`, `--crop-bottom: ${displaySize.height - (fY + fH)}px`, `--crop-left: ${fX}px`, `--offset-x: ${displaySize.width / 2 - (fX + fW / 2)}px`, `--offset-y: ${displaySize.height / 2 - (fY + fH / 2)}px`);
      }
      return baseStyle;
    }
    const frameWidth = cropState.cropperWidth * displayScale;
    const frameHeight = cropState.cropperHeight * displayScale;
    return (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_5__["default"])(`width: ${frameWidth}px`, `height: ${frameHeight}px`);
  }, [displaySize, cropState, displayScale, mode, isTransitioning]);
  if (!shouldRender) return undefined;
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Portal__WEBPACK_IMPORTED_MODULE_24__["default"], {
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
      ref: rootRef,
      className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].root,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
        ref: canvasAreaRef,
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].canvasArea,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].canvasContainer,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)("canvas", {
            ref: canvasRef,
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].canvas, isTransitioningToDraw && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].transitioningToDraw, isTransitioningToCrop && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].transitioningToCrop, mode === 'draw' && !isTransitioning && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].drawMode, transformAnimType === 'rotate' && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].transformAnimating, transformAnimType === 'flip' && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].flipAnimating),
            width: canvasSize.width || undefined,
            height: canvasSize.height || undefined,
            style: canvasStyle,
            onMouseDown: mode === 'draw' ? handlePointerDown : undefined,
            onTouchStart: mode === 'draw' ? handlePointerDown : undefined
          }), snapshotSrc && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)("img", {
            className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].canvasSnapshot, isTransitioningToDraw && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].zoomIn, isTransitioningToCrop && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].fadeOut, transformAnimType === 'rotate' && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].rotateFade, transformAnimType === 'flip' && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].flipFade),
            src: snapshotSrc,
            style: snapshotStyle,
            alt: "",
            draggable: false
          }), shouldShowCropOverlay && !transformAnimType && displaySize.width > 0 && (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_CropOverlay__WEBPACK_IMPORTED_MODULE_27__["default"], {
            cropState: cropState,
            displaySize: displaySize,
            scale: displayScale,
            isFadingOut: isTransitioningToDraw,
            onCropperDragStart: handleCropperDragStart,
            onCornerResizeStart: handleCornerResizeStart
          })]
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
          className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_4__["default"])(_MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].canvasControls, isTransitioningToDraw && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].fadingOut, isTransitioningToCrop && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].fadingIn, mode === 'draw' && !isTransitioning && _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].hidden),
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_22__["default"], {
            round: true,
            color: "translucent",
            size: "smaller",
            onClick: handleQuarterRotateAnimated,
            iconName: "rotate"
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_RotationSlider__WEBPACK_IMPORTED_MODULE_30__["default"], {
            value: cropState.rotation,
            onChange: handleRotationChange,
            onChangeEnd: handleRotationChangeEnd
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_22__["default"], {
            round: true,
            color: "translucent",
            size: "smaller",
            onClick: handleFlipAnimated,
            iconName: "flip"
          })]
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].editPanel,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].panelHeader,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_22__["default"], {
            round: true,
            color: "translucent",
            size: "smaller",
            onClick: onClose,
            children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_common_icons_Icon__WEBPACK_IMPORTED_MODULE_21__["default"], {
              name: "close"
            })
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)("div", {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].headerTitle,
            children: lang('EditMedia')
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].headerActions,
            children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_22__["default"], {
              round: true,
              color: "translucent",
              size: "smaller",
              onClick: handleUndo,
              disabled: !canUndo,
              iconName: "undo"
            }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Button__WEBPACK_IMPORTED_MODULE_22__["default"], {
              round: true,
              color: "translucent",
              size: "smaller",
              onClick: handleRedo,
              disabled: !canRedo,
              iconName: "redo"
            })]
          })]
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsxs)("div", {
          className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].panelTabs,
          children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_Transition__WEBPACK_IMPORTED_MODULE_26__["default"], {
            ref: transitionRef,
            name: (0,_util_resolveTransitionName__WEBPACK_IMPORTED_MODULE_9__.resolveTransitionName)('slideOptimized', animationLevel, undefined, lang.isRtl),
            activeKey: activeTabIndex,
            shouldRestoreHeight: true,
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].panelContent,
            children: renderPanelContent()
          }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_SquareTabList__WEBPACK_IMPORTED_MODULE_25__["default"], {
            tabs: TABS,
            activeTab: activeTabIndex,
            onSwitchTab: handleTabSwitch,
            className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].modeTabs,
            tabClassName: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].modeTab
          })]
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_32__.jsx)(_FloatingActionButton__WEBPACK_IMPORTED_MODULE_23__["default"], {
        isShown: actions.length > 0,
        iconName: "check",
        className: _MediaEditor_module_scss__WEBPACK_IMPORTED_MODULE_31__["default"].saveButton,
        onClick: handleSave,
        ariaLabel: lang('Save')
      })]
    })
  });
};
function getExtensionFromMimeType(mimeType) {
  return mimeType.split('/')[1];
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(MediaEditor));

/***/ },

/***/ "./src/components/ui/mediaEditor/RotationSlider.tsx"
/*!**********************************************************!*\
  !*** ./src/components/ui/mediaEditor/RotationSlider.tsx ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/math */ "./src/util/math.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");
/* harmony import */ var _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./RotationSlider.module.scss */ "./src/components/ui/mediaEditor/RotationSlider.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");






const MIN_ROTATION = -90;
const MAX_ROTATION = 90;
const LABEL_INTERVAL = 15;
const PIXELS_PER_DEGREE = 5;
function RotationSlider({
  value,
  onChange,
  onChangeEnd
}) {
  const handlePointerDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(e => {
    e.preventDefault();
    const {
      x: startX
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_1__["default"])(e);
    const startValue = value;
    const handleMove = ev => {
      ev.preventDefault();
      const {
        x: clientX
      } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_1__["default"])(ev);
      const deltaX = clientX - startX;
      const newValue = (0,_util_math__WEBPACK_IMPORTED_MODULE_2__.clamp)(Math.round(startValue - deltaX / PIXELS_PER_DEGREE), MIN_ROTATION, MAX_ROTATION);
      onChange(newValue);
    };
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
      onChangeEnd?.();
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('touchmove', handleMove, {
      passive: false
    });
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);
  });
  const nearestLabel = Math.round(value / LABEL_INTERVAL) * LABEL_INTERVAL;
  const trackOffset = -value * PIXELS_PER_DEGREE;
  const labels = [];
  for (let deg = MIN_ROTATION; deg <= MAX_ROTATION; deg += LABEL_INTERVAL) {
    labels.push((0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
      className: deg === nearestLabel ? _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].labelActive : _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].label,
      style: `left: ${deg * PIXELS_PER_DEGREE}px`,
      children: deg
    }, deg));
  }
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].root,
    children: (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].slider,
      onMouseDown: handlePointerDown,
      onTouchStart: handlePointerDown,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
        className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].track,
        style: `transform: translateX(${trackOffset}px)`,
        children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].labelsRow,
          children: labels
        }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
          className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].dotsRow
        })]
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
        className: _RotationSlider_module_scss__WEBPACK_IMPORTED_MODULE_4__["default"].centerIndicator
      })]
    })
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(RotationSlider));

/***/ },

/***/ "./src/components/ui/mediaEditor/canvasUtils.ts"
/*!******************************************************!*\
  !*** ./src/components/ui/mediaEditor/canvasUtils.ts ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ARROW_ANIMATION_DURATION: () => (/* binding */ ARROW_ANIMATION_DURATION),
/* harmony export */   applyCanvasTransform: () => (/* binding */ applyCanvasTransform),
/* harmony export */   computeRotationZoom: () => (/* binding */ computeRotationZoom),
/* harmony export */   getEffectiveDimensions: () => (/* binding */ getEffectiveDimensions),
/* harmony export */   renderActionsToCanvas: () => (/* binding */ renderActionsToCanvas),
/* harmony export */   renderDrawAction: () => (/* binding */ renderDrawAction),
/* harmony export */   renderImageToCanvas: () => (/* binding */ renderImageToCanvas)
/* harmony export */ });
const ARROW_ANIMATION_DURATION = 200;
const offscreen = document.createElement('canvas');
function getEffectiveDimensions(imgWidth, imgHeight, quarterTurns) {
  const isSideways = quarterTurns % 2 === 1;
  return {
    width: isSideways ? imgHeight : imgWidth,
    height: isSideways ? imgWidth : imgHeight
  };
}
function computeRotationZoom(effectiveW, effectiveH, fineRotation) {
  if (fineRotation === 0 || effectiveW <= 0 || effectiveH <= 0) return 1;
  const rad = Math.abs(fineRotation * Math.PI / 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return Math.max(cos + effectiveH / effectiveW * sin, effectiveW / effectiveH * sin + cos);
}
function renderDrawAction(ctx, action, offsetX = 0, offsetY = 0, isComplete = true) {
  if (action.points.length < 2) return;
  ctx.save();
  if (action.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth = action.brushSize * 2;
  } else if (action.tool === 'neon') {
    ctx.shadowColor = action.color;
    ctx.shadowBlur = action.brushSize * 2;
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.brushSize * 0.5;
  } else if (action.tool === 'brush') {
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.brushSize * 2;
  } else {
    ctx.strokeStyle = action.color;
    ctx.lineWidth = action.brushSize;
  }
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (action.tool === 'arrow') {
    renderArrow(ctx, action, offsetX, offsetY, isComplete);
  } else {
    renderPath(ctx, action, offsetX, offsetY);
  }
  ctx.restore();
}
function renderArrow(ctx, action, offsetX, offsetY, isComplete) {
  if (action.points.length < 2) return;
  const firstPoint = action.points[0];
  const lastPoint = action.points[action.points.length - 1];

  // Draw the path
  ctx.beginPath();
  ctx.moveTo(firstPoint.x + offsetX, firstPoint.y + offsetY);
  for (let i = 1; i < action.points.length; i++) {
    const point = action.points[i];
    ctx.lineTo(point.x + offsetX, point.y + offsetY);
  }
  ctx.stroke();

  // Only draw arrowhead when drawing is complete
  if (!isComplete) return;

  // Calculate angle from a point further back for stable direction that follows the path
  // Use a point 10 steps back, or the first point if path is shorter
  const lookbackIndex = Math.max(0, action.points.length - 10);
  const referencePoint = action.points[lookbackIndex];
  const angle = Math.atan2(lastPoint.y - referencePoint.y, lastPoint.x - referencePoint.x);

  // Animate arrowhead appearance
  const elapsed = action.completedAt ? Date.now() - action.completedAt : ARROW_ANIMATION_DURATION;
  const progress = Math.min(elapsed / ARROW_ANIMATION_DURATION, 1);
  // Ease out cubic for smooth animation
  const easedProgress = 1 - (1 - progress) ** 3;
  const headLength = action.brushSize * 3 * easedProgress;
  ctx.beginPath();
  ctx.moveTo(lastPoint.x + offsetX, lastPoint.y + offsetY);
  ctx.lineTo(lastPoint.x + offsetX - headLength * Math.cos(angle - Math.PI / 6), lastPoint.y + offsetY - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(lastPoint.x + offsetX, lastPoint.y + offsetY);
  ctx.lineTo(lastPoint.x + offsetX - headLength * Math.cos(angle + Math.PI / 6), lastPoint.y + offsetY - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}
function renderPath(ctx, action, offsetX, offsetY) {
  ctx.beginPath();
  const firstPoint = action.points[0];
  ctx.moveTo(firstPoint.x + offsetX, firstPoint.y + offsetY);
  for (let i = 1; i < action.points.length; i++) {
    const point = action.points[i];
    ctx.lineTo(point.x + offsetX, point.y + offsetY);
  }
  ctx.stroke();
}
function applyCanvasTransform(ctx, image, rotation, flipH, quarterTurns = 0, scale = 1) {
  const {
    width: effW,
    height: effH
  } = getEffectiveDimensions(image.width, image.height, quarterTurns);
  ctx.translate(effW / 2, effH / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.scale(scale * (flipH ? -1 : 1), scale);
  ctx.translate(-image.width / 2, -image.height / 2);
}
function renderImageToCanvas(ctx, img, crop, targetWidth, targetHeight, isCropMode, rotation = 0, flipH = false, quarterTurns = 0, scale = 1) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  if (rotation !== 0 || flipH || quarterTurns !== 0 || scale !== 1) {
    applyCanvasTransform(ctx, img, rotation, flipH, quarterTurns, scale);
  }
  if (isCropMode) {
    ctx.drawImage(img, 0, 0);
  } else {
    ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, targetWidth, targetHeight);
  }
  ctx.restore();
}
function renderActionsToCanvas(ctx, actions, offsetX = 0, offsetY = 0, currentAction, offscreenWidth, offscreenHeight) {
  const hasCurrentAction = currentAction && !actions.includes(currentAction);
  if (actions.length === 0 && !hasCurrentAction) return;
  const width = offscreenWidth || ctx.canvas.width;
  const height = offscreenHeight || ctx.canvas.height;
  offscreen.width = width;
  offscreen.height = height;
  const offCtx = offscreen.getContext('2d');
  offCtx.clearRect(0, 0, width, height);
  actions.forEach(action => {
    renderDrawAction(offCtx, action, offsetX, offsetY, true);
  });
  if (hasCurrentAction) {
    renderDrawAction(offCtx, currentAction, offsetX, offsetY, false);
  }
  ctx.drawImage(offscreen, 0, 0);
}

/***/ },

/***/ "./src/components/ui/mediaEditor/hooks/useCanvasRenderer.ts"
/*!******************************************************************!*\
  !*** ./src/components/ui/mediaEditor/hooks/useCanvasRenderer.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useCanvasRenderer)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_schedulers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/schedulers */ "./src/util/schedulers.ts");
/* harmony import */ var _canvasUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvasUtils */ "./src/components/ui/mediaEditor/canvasUtils.ts");
/* harmony import */ var _useCropper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./useCropper */ "./src/components/ui/mediaEditor/hooks/useCropper.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");





function useCanvasRenderer({
  canvasRef,
  imageRef,
  mode,
  cropState,
  drawActions,
  currentDrawAction
}) {
  const [canvasSize, setCanvasSize] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    width: 0,
    height: 0
  });
  const renderCanvas = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const crop = {
      x: cropState.cropperX,
      y: cropState.cropperY,
      width: cropState.cropperWidth,
      height: cropState.cropperHeight
    };
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rotation = (0,_useCropper__WEBPACK_IMPORTED_MODULE_3__.getTotalRotation)(cropState);
    const {
      flipH
    } = cropState;
    if (mode === 'crop') {
      const {
        width: effW,
        height: effH
      } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropState.quarterTurns);
      const zoom = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.computeRotationZoom)(effW, effH, cropState.rotation);
      if (canvasSize.width !== effW || canvasSize.height !== effH) {
        setCanvasSize({
          width: effW,
          height: effH
        });
        return;
      }
      (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.renderImageToCanvas)(ctx, img, crop, effW, effH, true, rotation, flipH, cropState.quarterTurns, zoom);
      const hasTransforms = rotation !== 0 || flipH || cropState.quarterTurns !== 0 || zoom !== 1;
      if (hasTransforms) {
        ctx.save();
        (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.applyCanvasTransform)(ctx, img, rotation, flipH, cropState.quarterTurns, zoom);
        (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.renderActionsToCanvas)(ctx, drawActions, 0, 0, undefined, img.width, img.height);
        ctx.restore();
      } else {
        (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.renderActionsToCanvas)(ctx, drawActions);
      }
    } else {
      if (crop.width <= 0 || crop.height <= 0) return;
      const targetWidth = Math.round(crop.width);
      const targetHeight = Math.round(crop.height);
      if (canvasSize.width !== targetWidth || canvasSize.height !== targetHeight) {
        setCanvasSize({
          width: targetWidth,
          height: targetHeight
        });
        return;
      }
      const {
        width: effW,
        height: effH
      } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropState.quarterTurns);
      const zoom = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.computeRotationZoom)(effW, effH, cropState.rotation);
      const hasTransforms = rotation !== 0 || flipH || cropState.quarterTurns !== 0 || zoom !== 1;

      // Create temp canvas at effective dimensions
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = effW;
      tempCanvas.height = effH;
      const tempCtx = tempCanvas.getContext('2d');
      if (hasTransforms) {
        tempCtx.save();
        (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.applyCanvasTransform)(tempCtx, img, rotation, flipH, cropState.quarterTurns, zoom);
      }

      // Draw image and actions (in image coords, transformed to effective space)
      tempCtx.drawImage(img, 0, 0);
      (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.renderActionsToCanvas)(tempCtx, drawActions, 0, 0, currentDrawAction, img.width, img.height);
      if (hasTransforms) {
        tempCtx.restore();
      }

      // Crop from effective space
      ctx.drawImage(tempCanvas, crop.x, crop.y, crop.width, crop.height, 0, 0, targetWidth, targetHeight);
    }
  });

  // Throttle re-renders to one per animation frame
  const scheduleRender = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => (0,_util_schedulers__WEBPACK_IMPORTED_MODULE_1__.throttleWith)(_util_schedulers__WEBPACK_IMPORTED_MODULE_1__.fastRaf, renderCanvas), [renderCanvas]);

  // Re-render canvas when dependencies change
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    scheduleRender();
  }, [drawActions, currentDrawAction, canvasSize, mode, cropState, scheduleRender]);

  // Animation loop for arrow spreading effect
  const animationFrameRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const hasAnimatingArrow = () => drawActions.some(action => {
      return action.tool === 'arrow' && action.completedAt && Date.now() - action.completedAt < _canvasUtils__WEBPACK_IMPORTED_MODULE_2__.ARROW_ANIMATION_DURATION;
    });
    if (!hasAnimatingArrow()) return undefined;
    const animate = () => {
      renderCanvas();
      if (hasAnimatingArrow()) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawActions, renderCanvas]);
  const resetCanvasSize = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_4__["default"])(() => {
    setCanvasSize({
      width: 0,
      height: 0
    });
  });
  return {
    canvasSize,
    renderCanvas,
    resetCanvasSize
  };
}

/***/ },

/***/ "./src/components/ui/mediaEditor/hooks/useColorPicker.ts"
/*!***************************************************************!*\
  !*** ./src/components/ui/mediaEditor/hooks/useColorPicker.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useColorPicker),
/* harmony export */   getPredefinedColors: () => (/* binding */ getPredefinedColors)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_colors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/colors */ "./src/util/colors.ts");
/* harmony import */ var _util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../util/events/getPointerPosition */ "./src/util/events/getPointerPosition.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../util/math */ "./src/util/math.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");






const PREDEFINED_COLORS_BASE = ['#FE4438', '#FF8901', '#FFD60A', '#33C759', '#62E5E0', '#0A84FF', '#5856D6', '#BD5CF3'];
function getPredefinedColors(theme) {
  return theme === 'light' ? ['#000000', ...PREDEFINED_COLORS_BASE] : ['#FFFFFF', ...PREDEFINED_COLORS_BASE];
}
function buildPickerState(h, s, v) {
  const rgb = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([h, s, v]);
  const hex = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hex)(rgb);
  return {
    hue: h,
    saturation: s,
    brightness: v,
    hexInputValue: hex.toUpperCase(),
    rgbInputValue: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`
  };
}
const DEFAULT_PICKER_STATE = {
  hue: 0,
  saturation: 1,
  brightness: 1,
  hexInputValue: '',
  rgbInputValue: ''
};
function useColorPicker({
  initialColor
}) {
  const hueSliderRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const satBrightRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const [selectedColor, setSelectedColor] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(initialColor);
  const [isColorPickerOpen, openColorPicker, closeColorPicker] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_4__["default"])(false);
  const [pickerState, setPickerState] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(DEFAULT_PICKER_STATE);
  const pickerColor = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hex)((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([pickerState.hue, pickerState.saturation, pickerState.brightness]));
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!isColorPickerOpen) return;
    const rgb = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hex2rgb)(selectedColor.replace('#', ''));
    const [h, s, v] = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hsv)(rgb);
    setPickerState(buildPickerState(h, s, v));
    // eslint-disable-next-line react-hooks-static-deps/exhaustive-deps
  }, [isColorPickerOpen]);
  const updateFromHsv = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])((h, s, v) => {
    const state = buildPickerState(h, s, v);
    setPickerState(state);
    setSelectedColor((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hex)((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([h, s, v])));
  });
  const setupColorDrag = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(handler => {
    const handleMove = ev => handler(ev);
    const handleUp = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  });
  const handleHueChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    const el = hueSliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const {
      x: clientX
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    const x = (0,_util_math__WEBPACK_IMPORTED_MODULE_3__.clamp)(clientX - rect.left, 0, rect.width);
    updateFromHsv(x / rect.width, pickerState.saturation, pickerState.brightness);
  });
  const handleSatBrightChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    const el = satBrightRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const {
      x: clientX,
      y: clientY
    } = (0,_util_events_getPointerPosition__WEBPACK_IMPORTED_MODULE_2__["default"])(e);
    const x = (0,_util_math__WEBPACK_IMPORTED_MODULE_3__.clamp)(clientX - rect.left, 0, rect.width);
    const y = (0,_util_math__WEBPACK_IMPORTED_MODULE_3__.clamp)(clientY - rect.top, 0, rect.height);
    updateFromHsv(pickerState.hue, x / rect.width, 1 - y / rect.height);
  });
  const handleHexInput = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    const cleanHex = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 6);
    // Force the DOM input to show the cleaned value immediately
    e.target.value = `#${cleanHex}`;

    // Expand 3-char shortcode (#EEE -> #EEEEEE) or use 6-char hex
    const fullHex = cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex;
    if (fullHex.length === 6) {
      const [h, s, v] = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hsv)((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hex2rgb)(fullHex));
      const state = buildPickerState(h, s, v);
      // Preserve the raw typed hex while updating HSV + rgb
      setPickerState({
        ...state,
        hexInputValue: `#${cleanHex}`
      });
      setSelectedColor((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hex)((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([h, s, v])));
    } else {
      setPickerState(prev => ({
        ...prev,
        hexInputValue: `#${cleanHex}`
      }));
    }
  });
  const handleRgbInput = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    const value = e.target.value;
    const parts = value.split(',').map(p => p.trim());
    if (parts.length === 3) {
      const r = parseInt(parts[0], 10);
      const g = parseInt(parts[1], 10);
      const b = parseInt(parts[2], 10);
      if (![r, g, b].some(v => Number.isNaN(v) || v < 0 || v > 255)) {
        const [h, s, v] = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hsv)([r, g, b]);
        const state = buildPickerState(h, s, v);
        // Preserve the raw typed rgb while updating HSV + hex
        setPickerState({
          ...state,
          rgbInputValue: value
        });
        setSelectedColor((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.rgb2hex)((0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([h, s, v])));
        return;
      }
    }
    setPickerState(prev => ({
      ...prev,
      rgbInputValue: value
    }));
  });
  const handleHexInputBlur = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(() => {
    setPickerState(prev => ({
      ...prev,
      hexInputValue: pickerColor.toUpperCase()
    }));
  });
  const handleRgbInputBlur = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(() => {
    const rgb = (0,_util_colors__WEBPACK_IMPORTED_MODULE_1__.hsv2rgb)([pickerState.hue, pickerState.saturation, pickerState.brightness]);
    setPickerState(prev => ({
      ...prev,
      rgbInputValue: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`
    }));
  });
  const handleColorSelect = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(color => {
    setSelectedColor(color);
    closeColorPicker();
  });
  const handleHueSliderMouseDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    handleHueChange(e);
    setupColorDrag(handleHueChange);
  });
  const handleSatBrightMouseDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_5__["default"])(e => {
    handleSatBrightChange(e);
    setupColorDrag(handleSatBrightChange);
  });
  return {
    hueSliderRef,
    satBrightRef,
    selectedColor,
    setSelectedColor,
    isColorPickerOpen,
    openColorPicker,
    closeColorPicker,
    hue: pickerState.hue,
    saturation: pickerState.saturation,
    brightness: pickerState.brightness,
    pickerColor,
    hexInputValue: pickerState.hexInputValue,
    rgbInputValue: pickerState.rgbInputValue,
    handleHueChange,
    handleSatBrightChange,
    handleHexInput,
    handleHexInputBlur,
    handleRgbInput,
    handleRgbInputBlur,
    handleColorSelect,
    handleHueSliderMouseDown,
    handleSatBrightMouseDown
  };
}

/***/ },

/***/ "./src/components/ui/mediaEditor/hooks/useCropper.ts"
/*!***********************************************************!*\
  !*** ./src/components/ui/mediaEditor/hooks/useCropper.ts ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASPECT_RATIOS: () => (/* binding */ ASPECT_RATIOS),
/* harmony export */   DEFAULT_CROP_STATE: () => (/* binding */ DEFAULT_CROP_STATE),
/* harmony export */   "default": () => (/* binding */ useCropper),
/* harmony export */   getTotalRotation: () => (/* binding */ getTotalRotation)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../util/math */ "./src/util/math.ts");
/* harmony import */ var _canvasUtils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../canvasUtils */ "./src/components/ui/mediaEditor/canvasUtils.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");




function getTotalRotation(state) {
  return state.rotation - state.quarterTurns * 90;
}
const ASPECT_RATIOS = [{
  value: 'free',
  labelKey: 'Free'
}, {
  value: 'original',
  labelKey: 'Original'
}, {
  value: 'square',
  labelKey: 'Square',
  ratio: 1
}, {
  value: '3:2',
  label: '3:2',
  ratio: 3 / 2
}, {
  value: '2:3',
  label: '2:3',
  ratio: 2 / 3
}, {
  value: '4:3',
  label: '4:3',
  ratio: 4 / 3
}, {
  value: '3:4',
  label: '3:4',
  ratio: 3 / 4
}, {
  value: '5:4',
  label: '5:4',
  ratio: 5 / 4
}, {
  value: '4:5',
  label: '4:5',
  ratio: 4 / 5
}, {
  value: '16:9',
  label: '16:9',
  ratio: 16 / 9
}, {
  value: '9:16',
  label: '9:16',
  ratio: 9 / 16
}];
const DEFAULT_CROP_STATE = {
  cropperX: 0,
  cropperY: 0,
  cropperWidth: 0,
  cropperHeight: 0,
  aspectRatio: 'free',
  rotation: 0,
  quarterTurns: 0,
  flipH: false
};
const MIN_CROP_SIZE = 50;
const MIN_ROTATION = -90;
const MAX_ROTATION = 90;
function computeCenteredCrop(effW, effH, ratioValue) {
  let width;
  let height;
  if (!ratioValue) {
    width = effW;
    height = effH;
  } else if (effW / effH > ratioValue) {
    height = effH;
    width = effH * ratioValue;
  } else {
    width = effW;
    height = effW / ratioValue;
  }
  return {
    cropperX: (effW - width) / 2,
    cropperY: (effH - height) / 2,
    cropperWidth: width,
    cropperHeight: height
  };
}
function useCropper({
  imageRef,
  displaySize,
  getDisplayScale,
  getDisplayCoordinates,
  onAction,
  cropState,
  setCropState
}) {
  const cropperDragStartRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const cropStateRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(DEFAULT_CROP_STATE);
  cropStateRef.current = cropState;
  const getAspectRatioValue = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(ratio => {
    if (ratio === 'free') return undefined;
    if (ratio === 'original' && imageRef.current) {
      const {
        width: effW,
        height: effH
      } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(imageRef.current.width, imageRef.current.height, cropStateRef.current.quarterTurns);
      return effW / effH;
    }
    const option = ASPECT_RATIOS.find(r => r.value === ratio);
    return option?.ratio;
  });
  const setupDragListeners = (onMove, onUp) => {
    const handleUp = () => {
      onUp();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchend', handleUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('touchend', handleUp);
  };
  const handleCropperDragStart = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(e => {
    const img = imageRef.current;
    if (!img || displaySize.width === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const {
      x,
      y
    } = getDisplayCoordinates(e);
    const displayScale = getDisplayScale();
    cropperDragStartRef.current = {
      startX: x,
      startY: y,
      cropperX: cropState.cropperX,
      cropperY: cropState.cropperY,
      cropperWidth: cropState.cropperWidth,
      cropperHeight: cropState.cropperHeight
    };
    const handleMove = ev => {
      if (!cropperDragStartRef.current) return;
      const coords = getDisplayCoordinates(ev);
      const displayDeltaX = coords.x - cropperDragStartRef.current.startX;
      const displayDeltaY = coords.y - cropperDragStartRef.current.startY;
      const imageDeltaX = displayDeltaX / displayScale;
      const imageDeltaY = displayDeltaY / displayScale;
      const newCropperX = cropperDragStartRef.current.cropperX + imageDeltaX;
      const newCropperY = cropperDragStartRef.current.cropperY + imageDeltaY;
      const {
        width: effW,
        height: effH
      } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropStateRef.current.quarterTurns);
      const constrainedX = (0,_util_math__WEBPACK_IMPORTED_MODULE_1__.clamp)(newCropperX, 0, effW - cropperDragStartRef.current.cropperWidth);
      const constrainedY = (0,_util_math__WEBPACK_IMPORTED_MODULE_1__.clamp)(newCropperY, 0, effH - cropperDragStartRef.current.cropperHeight);
      setCropState(prev => ({
        ...prev,
        cropperX: constrainedX,
        cropperY: constrainedY
      }));
    };
    const handleUp = () => {
      if (cropperDragStartRef.current) {
        const startState = cropperDragStartRef.current;
        if (startState.cropperX !== cropStateRef.current.cropperX || startState.cropperY !== cropStateRef.current.cropperY) {
          const previousState = {
            ...cropStateRef.current,
            cropperX: startState.cropperX,
            cropperY: startState.cropperY,
            cropperWidth: startState.cropperWidth,
            cropperHeight: startState.cropperHeight
          };
          onAction({
            type: 'crop',
            previousState
          });
        }
      }
      cropperDragStartRef.current = undefined;
    };
    setupDragListeners(handleMove, handleUp);
  });
  const handleCornerResizeStart = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])((e, handle) => {
    const img = imageRef.current;
    if (!img || displaySize.width === 0) return;
    e.preventDefault();
    e.stopPropagation();
    const {
      x,
      y
    } = getDisplayCoordinates(e);
    const displayScale = getDisplayScale();
    cropperDragStartRef.current = {
      startX: x,
      startY: y,
      cropperX: cropState.cropperX,
      cropperY: cropState.cropperY,
      cropperWidth: cropState.cropperWidth,
      cropperHeight: cropState.cropperHeight
    };
    const handleMove = ev => {
      if (!cropperDragStartRef.current) return;
      const coords = getDisplayCoordinates(ev);
      const displayDeltaX = coords.x - cropperDragStartRef.current.startX;
      const displayDeltaY = coords.y - cropperDragStartRef.current.startY;
      const imageDeltaX = displayDeltaX / displayScale;
      const imageDeltaY = displayDeltaY / displayScale;
      const startState = cropperDragStartRef.current;
      const {
        width: effW,
        height: effH
      } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropStateRef.current.quarterTurns);
      let newX = startState.cropperX;
      let newY = startState.cropperY;
      let newWidth = startState.cropperWidth;
      let newHeight = startState.cropperHeight;
      const ratioValue = getAspectRatioValue(cropStateRef.current.aspectRatio);
      if (handle === 'topLeft') {
        newX = startState.cropperX + imageDeltaX;
        newY = startState.cropperY + imageDeltaY;
        newWidth = startState.cropperWidth - imageDeltaX;
        newHeight = startState.cropperHeight - imageDeltaY;
      } else if (handle === 'topRight') {
        newY = startState.cropperY + imageDeltaY;
        newWidth = startState.cropperWidth + imageDeltaX;
        newHeight = startState.cropperHeight - imageDeltaY;
      } else if (handle === 'bottomLeft') {
        newX = startState.cropperX + imageDeltaX;
        newWidth = startState.cropperWidth - imageDeltaX;
        newHeight = startState.cropperHeight + imageDeltaY;
      } else if (handle === 'bottomRight') {
        newWidth = startState.cropperWidth + imageDeltaX;
        newHeight = startState.cropperHeight + imageDeltaY;
      }
      if (ratioValue) {
        const currentRatio = newWidth / newHeight;
        if (currentRatio > ratioValue) {
          const adjustedWidth = newHeight * ratioValue;
          if (handle === 'topLeft' || handle === 'bottomLeft') {
            newX += newWidth - adjustedWidth;
          }
          newWidth = adjustedWidth;
        } else {
          const adjustedHeight = newWidth / ratioValue;
          if (handle === 'topLeft' || handle === 'topRight') {
            newY += newHeight - adjustedHeight;
          }
          newHeight = adjustedHeight;
        }
      }
      if (newWidth < MIN_CROP_SIZE) {
        if (handle === 'topLeft' || handle === 'bottomLeft') {
          newX -= MIN_CROP_SIZE - newWidth;
        }
        newWidth = MIN_CROP_SIZE;
        if (ratioValue) newHeight = MIN_CROP_SIZE / ratioValue;
      }
      if (newHeight < MIN_CROP_SIZE) {
        if (handle === 'topLeft' || handle === 'topRight') {
          newY -= MIN_CROP_SIZE - newHeight;
        }
        newHeight = MIN_CROP_SIZE;
        if (ratioValue) newWidth = MIN_CROP_SIZE * ratioValue;
      }

      // Clamp to image bounds, keeping the opposite edge fixed
      const rightEdge = newX + newWidth;
      const bottomEdge = newY + newHeight;
      if (handle === 'topLeft' || handle === 'bottomLeft') {
        newX = Math.max(0, newX);
        newWidth = rightEdge - newX;
      } else {
        newWidth = Math.min(newWidth, effW - newX);
      }
      if (handle === 'topLeft' || handle === 'topRight') {
        newY = Math.max(0, newY);
        newHeight = bottomEdge - newY;
      } else {
        newHeight = Math.min(newHeight, effH - newY);
      }
      setCropState(prev => ({
        ...prev,
        cropperX: newX,
        cropperY: newY,
        cropperWidth: newWidth,
        cropperHeight: newHeight
      }));
    };
    const handleUp = () => {
      if (cropperDragStartRef.current) {
        const startState = cropperDragStartRef.current;
        if (startState.cropperX !== cropStateRef.current.cropperX || startState.cropperY !== cropStateRef.current.cropperY || startState.cropperWidth !== cropStateRef.current.cropperWidth || startState.cropperHeight !== cropStateRef.current.cropperHeight) {
          const previousState = {
            ...cropStateRef.current,
            cropperX: startState.cropperX,
            cropperY: startState.cropperY,
            cropperWidth: startState.cropperWidth,
            cropperHeight: startState.cropperHeight
          };
          onAction({
            type: 'crop',
            previousState
          });
        }
      }
      cropperDragStartRef.current = undefined;
    };
    setupDragListeners(handleMove, handleUp);
  });
  const handleAspectRatioChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(newRatio => {
    const img = imageRef.current;
    if (!img) return;
    const previousState = {
      ...cropStateRef.current
    };
    const {
      width: effW,
      height: effH
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropStateRef.current.quarterTurns);
    setCropState({
      ...cropStateRef.current,
      aspectRatio: newRatio,
      ...computeCenteredCrop(effW, effH, getAspectRatioValue(newRatio))
    });
    onAction({
      type: 'crop',
      previousState
    });
  });
  const initCropState = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])((width, height) => {
    setCropState({
      aspectRatio: 'free',
      cropperX: 0,
      cropperY: 0,
      cropperWidth: width,
      cropperHeight: height,
      rotation: 0,
      quarterTurns: 0,
      flipH: false
    });
  });
  const getCroppedRegion = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    const {
      cropperX,
      cropperY,
      cropperWidth,
      cropperHeight
    } = cropStateRef.current;
    return {
      x: cropperX,
      y: cropperY,
      width: cropperWidth,
      height: cropperHeight
    };
  });
  const rotationStartStateRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  const handleRotationChange = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(value => {
    const img = imageRef.current;
    if (!img) return;
    if (!rotationStartStateRef.current) {
      rotationStartStateRef.current = {
        ...cropStateRef.current
      };
    }
    const {
      width: effW,
      height: effH
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropStateRef.current.quarterTurns);
    setCropState({
      ...cropStateRef.current,
      rotation: (0,_util_math__WEBPACK_IMPORTED_MODULE_1__.clamp)(value, MIN_ROTATION, MAX_ROTATION),
      ...computeCenteredCrop(effW, effH, getAspectRatioValue(cropStateRef.current.aspectRatio))
    });
  });
  const handleRotationChangeEnd = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    if (rotationStartStateRef.current) {
      onAction({
        type: 'crop',
        previousState: rotationStartStateRef.current
      });
      rotationStartStateRef.current = undefined;
    }
  });
  const handleQuarterRotate = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    const img = imageRef.current;
    if (!img) return;
    const previousState = {
      ...cropStateRef.current
    };
    const newQuarterTurns = (cropStateRef.current.quarterTurns + 1) % 4;
    const {
      width: newEffW,
      height: newEffH
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, newQuarterTurns);
    setCropState({
      ...cropStateRef.current,
      quarterTurns: newQuarterTurns,
      rotation: 0,
      ...computeCenteredCrop(newEffW, newEffH, getAspectRatioValue(cropStateRef.current.aspectRatio))
    });
    onAction({
      type: 'crop',
      previousState
    });
  });
  const handleFlip = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_3__["default"])(() => {
    const img = imageRef.current;
    if (!img) return;
    const previousState = {
      ...cropStateRef.current
    };
    const {
      width: effW
    } = (0,_canvasUtils__WEBPACK_IMPORTED_MODULE_2__.getEffectiveDimensions)(img.width, img.height, cropStateRef.current.quarterTurns);
    setCropState({
      ...cropStateRef.current,
      flipH: !cropStateRef.current.flipH,
      cropperX: effW - cropStateRef.current.cropperX - cropStateRef.current.cropperWidth
    });
    onAction({
      type: 'crop',
      previousState
    });
  });
  return {
    getCroppedRegion,
    initCropState,
    handleCropperDragStart,
    handleCornerResizeStart,
    handleAspectRatioChange,
    handleRotationChange,
    handleRotationChangeEnd,
    handleQuarterRotate,
    handleFlip
  };
}

/***/ },

/***/ "./src/components/ui/mediaEditor/hooks/useDisplaySize.ts"
/*!***************************************************************!*\
  !*** ./src/components/ui/mediaEditor/hooks/useDisplaySize.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useDisplaySize)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");


function useDisplaySize({
  canvasAreaRef,
  imageWidth,
  imageHeight,
  reservedHeight = 0
}) {
  const [displaySize, setDisplaySize] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)({
    width: 0,
    height: 0
  });
  const getDisplayScale = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(() => {
    if (displaySize.width === 0 || imageWidth === 0) return 1;
    return Math.min(displaySize.width / imageWidth, displaySize.height / imageHeight);
  });
  (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvasArea = canvasAreaRef.current;
    if (!canvasArea || imageWidth === 0) return undefined;
    const updateDisplaySize = () => {
      const areaRect = canvasArea.getBoundingClientRect();
      const style = getComputedStyle(canvasArea);
      const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const paddingY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const availableWidth = areaRect.width - paddingX;
      const availableHeight = areaRect.height - paddingY - reservedHeight;
      if (availableWidth <= 0 || availableHeight <= 0) return;
      const scaleToFit = Math.min(availableWidth / imageWidth, availableHeight / imageHeight);
      const scale = Math.min(scaleToFit, 1);
      setDisplaySize({
        width: imageWidth * scale,
        height: imageHeight * scale
      });
    };
    updateDisplaySize();
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, [canvasAreaRef, imageWidth, imageHeight, reservedHeight]);
  const resetDisplaySize = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_1__["default"])(() => {
    setDisplaySize({
      width: 0,
      height: 0
    });
  });
  return {
    displaySize,
    getDisplayScale,
    resetDisplaySize
  };
}

/***/ },

/***/ "./src/components/ui/mediaEditor/hooks/useDrawing.ts"
/*!***********************************************************!*\
  !*** ./src/components/ui/mediaEditor/hooks/useDrawing.ts ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAX_BRUSH_SIZE: () => (/* binding */ MAX_BRUSH_SIZE),
/* harmony export */   MIN_BRUSH_SIZE: () => (/* binding */ MIN_BRUSH_SIZE),
/* harmony export */   "default": () => (/* binding */ useDrawing)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _hooks_useFlag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../hooks/useFlag */ "./src/hooks/useFlag.ts");
/* harmony import */ var _hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../hooks/useLastCallback */ "./src/hooks/useLastCallback.ts");



const DEFAULT_BRUSH_SIZE = 5;
function useDrawing({
  getCanvasCoordinates,
  canvasToImageCoords,
  selectedColor,
  onActionComplete
}) {
  const [drawTool, setDrawTool] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)('pen');
  const [brushSize, setBrushSize] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(DEFAULT_BRUSH_SIZE);
  const [currentDrawAction, setCurrentDrawAction] = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useState)(undefined);
  const [isDrawing, markDrawing, unmarkDrawing] = (0,_hooks_useFlag__WEBPACK_IMPORTED_MODULE_1__["default"])(false);
  const lastCompletedActionRef = (0,_teact__WEBPACK_IMPORTED_MODULE_0__.useRef)(undefined);
  const handlePointerMove = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    // Also check lastCompletedActionRef to prevent moves after completion (stale state race)
    if (!isDrawing || !currentDrawAction || lastCompletedActionRef.current === currentDrawAction) return;
    const canvasCoords = getCanvasCoordinates(e);
    const imageCoords = canvasToImageCoords(canvasCoords.x, canvasCoords.y);
    const isShiftPressed = 'shiftKey' in e ? e.shiftKey : false;

    // When shift is pressed, only keep first and last point (straight line)
    const newPoints = isShiftPressed ? [currentDrawAction.points[0], imageCoords] : [...currentDrawAction.points, imageCoords];
    setCurrentDrawAction({
      ...currentDrawAction,
      points: newPoints,
      isShiftPressed
    });
  });
  const handlePointerUp = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    // Use ref to prevent double completion from mouseup + mouseleave firing together
    if (!isDrawing || !currentDrawAction || lastCompletedActionRef.current === currentDrawAction) return;
    unmarkDrawing();
    const completedAction = {
      ...currentDrawAction,
      completedAt: Date.now()
    };
    lastCompletedActionRef.current = completedAction;
    setCurrentDrawAction(undefined);
    if (completedAction.points.length > 1) {
      onActionComplete(completedAction);
    }
    document.removeEventListener('mousemove', handlePointerMove);
    document.removeEventListener('touchmove', handlePointerMove);
    document.removeEventListener('mouseup', handlePointerUp);
    document.removeEventListener('touchend', handlePointerUp);
  });
  const handlePointerDown = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(e => {
    markDrawing();
    const canvasCoords = getCanvasCoordinates(e);
    const imageCoords = canvasToImageCoords(canvasCoords.x, canvasCoords.y);
    const isShiftPressed = 'shiftKey' in e ? e.shiftKey : false;
    setCurrentDrawAction({
      type: 'draw',
      tool: drawTool,
      points: [imageCoords],
      color: selectedColor,
      brushSize,
      isShiftPressed
    });

    // Attach document listeners to continue drawing even when cursor leaves canvas
    document.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove);
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);
  });
  const resetDrawing = (0,_hooks_useLastCallback__WEBPACK_IMPORTED_MODULE_2__["default"])(() => {
    setCurrentDrawAction(undefined);
    unmarkDrawing();
  });
  return {
    drawTool,
    setDrawTool,
    brushSize,
    setBrushSize,
    currentDrawAction,
    isDrawing,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    resetDrawing
  };
}
const MIN_BRUSH_SIZE = 2;
const MAX_BRUSH_SIZE = 50;

/***/ },

/***/ "./src/components/ui/placeholder/PlaceholderChatInfo.tsx"
/*!***************************************************************!*\
  !*** ./src/components/ui/placeholder/PlaceholderChatInfo.tsx ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PlaceholderChatInfo.module.scss */ "./src/components/ui/placeholder/PlaceholderChatInfo.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");




const PlaceholderChatInfo = () => {
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].root,
    children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].avatar, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
    }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].info,
      children: [(0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].title, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
      }), (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
        className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].subtitle, _PlaceholderChatInfo_module_scss__WEBPACK_IMPORTED_MODULE_2__["default"].animated)
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(PlaceholderChatInfo));

/***/ },

/***/ "./src/components/ui/placeholder/Skeleton.tsx"
/*!****************************************************!*\
  !*** ./src/components/ui/placeholder/Skeleton.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _util_buildStyle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/buildStyle */ "./src/util/buildStyle.ts");
/* harmony import */ var _Skeleton_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Skeleton.scss */ "./src/components/ui/placeholder/Skeleton.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const Skeleton = ({
  variant = 'rectangular',
  animation = 'none',
  width,
  height,
  forceAspectRatio,
  inline,
  className,
  style
}) => {
  const classNames = (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])('Skeleton', variant, animation, className, inline && 'inline');
  const aspectRatio = width && height ? `aspect-ratio: ${width}/${height}` : undefined;
  const computedStyle = (0,_util_buildStyle__WEBPACK_IMPORTED_MODULE_2__["default"])(style, forceAspectRatio && aspectRatio, Boolean(width) && `width: ${width}px`, !forceAspectRatio && Boolean(height) && `height: ${height}px`);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: classNames,
    style: computedStyle,
    children: inline && '\u00A0'
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(Skeleton));

/***/ },

/***/ "./src/components/ui/placeholder/TextLoadingPlaceholder.tsx"
/*!******************************************************************!*\
  !*** ./src/components/ui/placeholder/TextLoadingPlaceholder.tsx ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../lib/teact/teact */ "./src/lib/teact/teact.ts");
/* harmony import */ var _util_buildClassName__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../util/buildClassName */ "./src/util/buildClassName.ts");
/* harmony import */ var _Skeleton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Skeleton */ "./src/components/ui/placeholder/Skeleton.tsx");
/* harmony import */ var _TextLoadingPlaceholder_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TextLoadingPlaceholder.module.scss */ "./src/components/ui/placeholder/TextLoadingPlaceholder.module.scss");
/* harmony import */ var _teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @teact/jsx-runtime */ "./src/lib/teact/jsx-runtime.ts");





const WIDTH_PATTERNS = [[85, 90, 87, 83, 87, 70], [81, 75, 83, 87, 81, 93], [73, 87, 91, 75, 87, 91]];
const TextLoadingPlaceholder = ({
  lines = 6,
  className
}) => {
  const lineWidths = (0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const patternIndex = Math.floor(Math.random() * WIDTH_PATTERNS.length);
    const pattern = WIDTH_PATTERNS[patternIndex];
    return Array.from({
      length: lines
    }, (_, i) => pattern[i % pattern.length]);
  }, [lines]);
  return (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: (0,_util_buildClassName__WEBPACK_IMPORTED_MODULE_1__["default"])(_TextLoadingPlaceholder_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].root, className),
    children: lineWidths.map((width, i) => (0,_teact_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_Skeleton__WEBPACK_IMPORTED_MODULE_2__["default"], {
      variant: "rounded-rect",
      animation: "fast-wave",
      className: _TextLoadingPlaceholder_module_scss__WEBPACK_IMPORTED_MODULE_3__["default"].line,
      style: `width: ${width}%`
    }, i))
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_lib_teact_teact__WEBPACK_IMPORTED_MODULE_0__.memo)(TextLoadingPlaceholder));

/***/ },

/***/ "./src/components/ui/AvatarEditable.scss"
/*!***********************************************!*\
  !*** ./src/components/ui/AvatarEditable.scss ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Badge.module.scss"
/*!*********************************************!*\
  !*** ./src/components/ui/Badge.module.scss ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Y3ZoW17O","default":"DWjOG2Ze","alternate":"Lq67O2D2"});

/***/ },

/***/ "./src/components/ui/CropModal.scss"
/*!******************************************!*\
  !*** ./src/components/ui/CropModal.scss ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Draggable.module.scss"
/*!*************************************************!*\
  !*** ./src/components/ui/Draggable.module.scss ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"kWQHzIMD","isDragging":"k0c5WDAy","knob":"UpzQzcvs","icon":"JIThxQAL"});

/***/ },

/***/ "./src/components/ui/ExpandableText.module.scss"
/*!******************************************************!*\
  !*** ./src/components/ui/ExpandableText.module.scss ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"wQnkm0PP","inner":"cIdCum0y","content":"wAD3_xQA","moreLinkWrapper":"wRHZDd4K","truncated":"zTnTr5it","moreLink":"IZhl7cdQ"});

/***/ },

/***/ "./src/components/ui/FloatingActionButton.scss"
/*!*****************************************************!*\
  !*** ./src/components/ui/FloatingActionButton.scss ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Folder.module.scss"
/*!**********************************************!*\
  !*** ./src/components/ui/Folder.module.scss ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"folder":"r_wWhyY_","no-page-transitions":"WddG2sPd","noPageTransitions":"WddG2sPd","inner":"k59cp8Xp","title":"GfrkwlNw","icon":"Ehg2aEWm","badge":"XwWX8ZRp","badge-active":"JrMkpoeL","badgeActive":"JrMkpoeL","blocked":"xqOTsTUl","active":"y8ZeQOsX"});

/***/ },

/***/ "./src/components/ui/ImageCropper.module.scss"
/*!****************************************************!*\
  !*** ./src/components/ui/ImageCropper.module.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"previewContainer":"r_2tKzuI","foregroundImage":"nJUDgVTD","backgroundImage":"caUABR3p","previewMask":"gR8q967h","cropArea":"m_d02kUd","confirmButton":"M0r9Gw03","zoomSlider":"s73_IyYI","bottomControls":"_YQbrXkD"});

/***/ },

/***/ "./src/components/ui/ListItem.scss"
/*!*****************************************!*\
  !*** ./src/components/ui/ListItem.scss ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/MenuSeparator.module.scss"
/*!*****************************************************!*\
  !*** ./src/components/ui/MenuSeparator.module.scss ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"h039vb1K","thin":"NGKaFgra","thick":"_BdnjPEa"});

/***/ },

/***/ "./src/components/ui/ModalStarBalanceBar.module.scss"
/*!***********************************************************!*\
  !*** ./src/components/ui/ModalStarBalanceBar.module.scss ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"UtvP6LQ2","hidden":"xYkfrKnb","dots":"PdzBnsGR","tonInUsdDescription":"VMKBAQXy","getMoreStarsLink":"GGPosAVA"});

/***/ },

/***/ "./src/components/ui/ProgressSpinner.scss"
/*!************************************************!*\
  !*** ./src/components/ui/ProgressSpinner.scss ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Radio.scss"
/*!**************************************!*\
  !*** ./src/components/ui/Radio.scss ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/RangeSlider.scss"
/*!********************************************!*\
  !*** ./src/components/ui/RangeSlider.scss ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/RangeSliderWithMarks.module.scss"
/*!************************************************************!*\
  !*** ./src/components/ui/RangeSliderWithMarks.module.scss ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"dotWrapper":"s8NMMSES","sliderContainer":"i_wrxmyh","marksContainer":"bVlnaLCI","mark":"AFFaq4eZ","active":"cuogxYPG","slider":"H_rMZrqn","tickMarks":"O7SI4r_Y","tick":"b6UDc3zh","filled":"VELPJsJ0","tickUnfilled":"K8NtimIi"});

/***/ },

/***/ "./src/components/ui/SearchInput.scss"
/*!********************************************!*\
  !*** ./src/components/ui/SearchInput.scss ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/SelectAvatar.module.scss"
/*!****************************************************!*\
  !*** ./src/components/ui/SelectAvatar.module.scss ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"input":"axfkbhWJ"});

/***/ },

/***/ "./src/components/ui/Separator.module.scss"
/*!*************************************************!*\
  !*** ./src/components/ui/Separator.module.scss ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"separator":"LxlpQKLr"});

/***/ },

/***/ "./src/components/ui/ShowMoreButton.scss"
/*!***********************************************!*\
  !*** ./src/components/ui/ShowMoreButton.scss ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/SquareTabList.scss"
/*!**********************************************!*\
  !*** ./src/components/ui/SquareTabList.scss ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Switcher.scss"
/*!*****************************************!*\
  !*** ./src/components/ui/Switcher.scss ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/Tab.scss"
/*!************************************!*\
  !*** ./src/components/ui/Tab.scss ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/TabList.module.scss"
/*!***********************************************!*\
  !*** ./src/components/ui/TabList.module.scss ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"container":"Jya4TQTw","activeIndicator":"apT7vRiG","ready":"Gsb2Drsd","vertical":"olvrE11Z","centered":"aqYb2jyH","stretched":"A194nVWE","tab":"U0xACBS1","tabEmoji":"o1qYw03A","tabIcon":"wz7cqDHX","lockIcon":"V6G8MwAI"});

/***/ },

/***/ "./src/components/ui/Toggle.module.scss"
/*!**********************************************!*\
  !*** ./src/components/ui/Toggle.module.scss ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"eGD1rubd","widget":"EXXsQxeq","min":"C4vXj96y","mid":"nRNm3LRD","max":"LdztzMx0","filler":"kudEBJOk"});

/***/ },

/***/ "./src/components/ui/mediaEditor/MediaEditor.module.scss"
/*!***************************************************************!*\
  !*** ./src/components/ui/mediaEditor/MediaEditor.module.scss ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"fS7bjhZZ","canvasArea":"nOvdLJ1f","canvasContainer":"flFdG3Pw","canvas":"S__rCiJq","drawMode":"SsRJ8Ne8","transitioningToDraw":"icvmSYcf","canvasFadeInDelayed":"U1RgSGpb","transitioningToCrop":"NBftB_Wf","canvasZoomOut":"XWRi5K7q","transformAnimating":"FIix5Nx_","canvasTransformReveal":"oMjsJ3C4","flipAnimating":"KE1JgIqy","canvasFlipReveal":"hYKyTZX1","canvasSnapshot":"Hn9OjWnJ","zoomIn":"RYaLTunM","snapshotZoomIn":"GAZb8MPh","fadeOut":"cy5aDIor","snapshotFadeOut":"VHbOGv8X","rotateFade":"nruaroqo","snapshotRotateFade":"ow81UAjP","flipFade":"YVh8VNb5","snapshotFlipFade":"_AIjAMlP","cropWrapper":"GbMfO7GI","fadeIn":"Ztf1aNhm","fadingOut":"KgL8yEmQ","cropDarkOverlay":"iVu6ZHeJ","cropRegion":"r8Qx2Ktf","cropGrid":"BFtdoj0S","cropCorner":"nEDBQw1H","topLeft":"qzU5GUm_","topRight":"IBoPxRge","bottomLeft":"HrdjIhiG","bottomRight":"IdkngJiS","editPanel":"QVflGRhn","panelHeader":"O_DGaaLI","headerTitle":"E4eCdO4M","headerActions":"_4706V27","panelTabs":"mJXF_Yxs","modeTabs":"h8eu56lc","modeTab":"l4buYDV4","panelContent":"i6JIcnc8","sectionLabel":"_0du4yfwQ","colorRow":"pX2M1SEc","colorSwatch":"vvX7mrfr","selected":"dJPeRZqd","customColor":"_hSMHHR5","sizeRow":"vNJyCRnu","sizeSlider":"Rhwfg155","sizeValue":"iMkZTuXV","canvasControls":"dJwM8niH","hidden":"VeD7D760","fadingIn":"cureBZo1","aspectRatioList":"xj769eB6","toolList":"X0nYMkPZ","toolIcon":"fDGjX7uI","toolLabel":"piZ_2j0J","aspectRatioRow":"Vxu0LMkw","ratioBox":"E3afJRca","ratio1x1":"a3SrmuRv","ratio1X1":"a3SrmuRv","ratio3x2":"CRJondNh","ratio3X2":"CRJondNh","ratio2x3":"oh3kbhar","ratio2X3":"oh3kbhar","ratio4x3":"hW7rVntz","ratio4X3":"hW7rVntz","ratio3x4":"jaH1RSPd","ratio3X4":"jaH1RSPd","ratio5x4":"_7JukZoaG","ratio5X4":"_7JukZoaG","ratio4x5":"mU6KfKdp","ratio4X5":"mU6KfKdp","ratio16x9":"F5xquvwb","ratio16X9":"F5xquvwb","ratio9x16":"hG0HwSYF","ratio9X16":"hG0HwSYF","colorPickerInline":"A4gAVclo","colorPickerRow":"jSDhtnV4","saturationBrightness":"pakBNiyw","colorInputs":"fH8Baw0r","colorInput":"ZmhX1fIF","satBrightHandle":"XinWYrSA","hueSlider":"_MJjYdh1","hueHandle":"LBY1bylB","saveButton":"BSHyHGia"});

/***/ },

/***/ "./src/components/ui/mediaEditor/RotationSlider.module.scss"
/*!******************************************************************!*\
  !*** ./src/components/ui/mediaEditor/RotationSlider.module.scss ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"YFefcZgL","slider":"dXY4Fo0z","track":"j5mg6w9j","labelsRow":"l0eEy5Rf","label":"wmzytKOT","labelActive":"tSDtmAv6","centerIndicator":"TLbgSYM9","dotsRow":"qitJ1s1k"});

/***/ },

/***/ "./src/components/ui/placeholder/PlaceholderChatInfo.module.scss"
/*!***********************************************************************!*\
  !*** ./src/components/ui/placeholder/PlaceholderChatInfo.module.scss ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"Oob7moh7","avatar":"ao0o6F_1","info":"e94nYlC4","title":"ANs9RCJu","subtitle":"RSn3O5Rx","animated":"AtWkrIxV","slide":"_iiRl0o2"});

/***/ },

/***/ "./src/components/ui/placeholder/Skeleton.scss"
/*!*****************************************************!*\
  !*** ./src/components/ui/placeholder/Skeleton.scss ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "./src/components/ui/placeholder/TextLoadingPlaceholder.module.scss"
/*!**************************************************************************!*\
  !*** ./src/components/ui/placeholder/TextLoadingPlaceholder.module.scss ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"root":"HenC8uSU","line":"j0EaVKZd"});

/***/ }

}]);
//# sourceMappingURL=shared-components.187b61f751552836f1d8.js.map
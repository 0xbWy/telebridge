(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for bnf"],{

/***/ "./node_modules/highlight.js/lib/languages/bnf.js"
/*!********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/bnf.js ***!
  \********************************************************/
(module) {

/*
Language: Backus–Naur Form
Website: https://en.wikipedia.org/wiki/Backus–Naur_form
Category: syntax
Author: Oleg Efimov <efimovov@gmail.com>
*/

/** @type LanguageFn */
function bnf(hljs) {
  return {
    name: 'Backus–Naur Form',
    contains: [
      // Attribute
      {
        className: 'attribute',
        begin: /</,
        end: />/
      },
      // Specific
      {
        begin: /::=/,
        end: /$/,
        contains: [
          {
            begin: /</,
            end: />/
          },
          // Common
          hljs.C_LINE_COMMENT_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE
        ]
      }
    ]
  };
}

module.exports = bnf;


/***/ }

}]);
//# sourceMappingURL=Highlight for bnf.faebd8f092849d1ff0dc.js.map
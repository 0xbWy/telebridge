(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for ebnf"],{

/***/ "./node_modules/highlight.js/lib/languages/ebnf.js"
/*!*********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/ebnf.js ***!
  \*********************************************************/
(module) {

/*
Language: Extended Backus-Naur Form
Author: Alex McKibben <alex@nullscope.net>
Website: https://en.wikipedia.org/wiki/Extended_Backus–Naur_form
Category: syntax
*/

/** @type LanguageFn */
function ebnf(hljs) {
  const commentMode = hljs.COMMENT(/\(\*/, /\*\)/);

  const nonTerminalMode = {
    className: "attribute",
    begin: /^[ ]*[a-zA-Z]+([\s_-]+[a-zA-Z]+)*/
  };

  const specialSequenceMode = {
    className: "meta",
    begin: /\?.*\?/
  };

  const ruleBodyMode = {
    begin: /=/,
    end: /[.;]/,
    contains: [
      commentMode,
      specialSequenceMode,
      {
        // terminals
        className: 'string',
        variants: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          {
            begin: '`',
            end: '`'
          }
        ]
      }
    ]
  };

  return {
    name: 'Extended Backus-Naur Form',
    illegal: /\S/,
    contains: [
      commentMode,
      nonTerminalMode,
      ruleBodyMode
    ]
  };
}

module.exports = ebnf;


/***/ }

}]);
//# sourceMappingURL=Highlight for ebnf.9fdd8191130001efc88c.js.map
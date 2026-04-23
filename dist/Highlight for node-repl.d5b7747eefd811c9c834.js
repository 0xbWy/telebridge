(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for node-repl"],{

/***/ "./node_modules/highlight.js/lib/languages/node-repl.js"
/*!**************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/node-repl.js ***!
  \**************************************************************/
(module) {

/*
Language: Node REPL
Requires: javascript.js
Author: Marat Nagayev <nagaevmt@yandex.ru>
Category: scripting
*/

/** @type LanguageFn */
function nodeRepl(hljs) {
  return {
    name: 'Node REPL',
    contains: [
      {
        className: 'meta.prompt',
        starts: {
          // a space separates the REPL prefix from the actual code
          // this is purely for cleaner HTML output
          end: / |$/,
          starts: {
            end: '$',
            subLanguage: 'javascript'
          }
        },
        variants: [
          { begin: /^>(?=[ ]|$)/ },
          { begin: /^\.\.\.(?=[ ]|$)/ }
        ]
      }
    ]
  };
}

module.exports = nodeRepl;


/***/ }

}]);
//# sourceMappingURL=Highlight for node-repl.d5b7747eefd811c9c834.js.map
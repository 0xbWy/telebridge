(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for python-repl"],{

/***/ "./node_modules/highlight.js/lib/languages/python-repl.js"
/*!****************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/python-repl.js ***!
  \****************************************************************/
(module) {

/*
Language: Python REPL
Requires: python.js
Author: Josh Goebel <hello@joshgoebel.com>
Category: common
*/

function pythonRepl(hljs) {
  return {
    aliases: [ 'pycon' ],
    contains: [
      {
        className: 'meta.prompt',
        starts: {
          // a space separates the REPL prefix from the actual code
          // this is purely for cleaner HTML output
          end: / |$/,
          starts: {
            end: '$',
            subLanguage: 'python'
          }
        },
        variants: [
          { begin: /^>>>(?=[ ]|$)/ },
          { begin: /^\.\.\.(?=[ ]|$)/ }
        ]
      }
    ]
  };
}

module.exports = pythonRepl;


/***/ }

}]);
//# sourceMappingURL=Highlight for python-repl.7c0a82342be2ec5fc249.js.map
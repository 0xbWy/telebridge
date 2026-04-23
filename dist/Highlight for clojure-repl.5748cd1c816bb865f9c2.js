(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for clojure-repl"],{

/***/ "./node_modules/highlight.js/lib/languages/clojure-repl.js"
/*!*****************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/clojure-repl.js ***!
  \*****************************************************************/
(module) {

/*
Language: Clojure REPL
Description: Clojure REPL sessions
Author: Ivan Sagalaev <maniac@softwaremaniacs.org>
Requires: clojure.js
Website: https://clojure.org
Category: lisp
*/

/** @type LanguageFn */
function clojureRepl(hljs) {
  return {
    name: 'Clojure REPL',
    contains: [
      {
        className: 'meta.prompt',
        begin: /^([\w.-]+|\s*#_)?=>/,
        starts: {
          end: /$/,
          subLanguage: 'clojure'
        }
      }
    ]
  };
}

module.exports = clojureRepl;


/***/ }

}]);
//# sourceMappingURL=Highlight for clojure-repl.5748cd1c816bb865f9c2.js.map
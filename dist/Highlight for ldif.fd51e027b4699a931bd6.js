(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for ldif"],{

/***/ "./node_modules/highlight.js/lib/languages/ldif.js"
/*!*********************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/ldif.js ***!
  \*********************************************************/
(module) {

/*
Language: LDIF
Contributors: Jacob Childress <jacobc@gmail.com>
Category: enterprise, config
Website: https://en.wikipedia.org/wiki/LDAP_Data_Interchange_Format
*/

/** @type LanguageFn */
function ldif(hljs) {
  return {
    name: 'LDIF',
    contains: [
      {
        className: 'attribute',
        match: '^dn(?=:)',
        relevance: 10
      },
      {
        className: 'attribute',
        match: '^\\w+(?=:)'
      },
      {
        className: 'literal',
        match: '^-'
      },
      hljs.HASH_COMMENT_MODE
    ]
  };
}

module.exports = ldif;


/***/ }

}]);
//# sourceMappingURL=Highlight for ldif.fd51e027b4699a931bd6.js.map
(self["webpackChunktelebridge"] = self["webpackChunktelebridge"] || []).push([["Highlight for mojolicious"],{

/***/ "./node_modules/highlight.js/lib/languages/mojolicious.js"
/*!****************************************************************!*\
  !*** ./node_modules/highlight.js/lib/languages/mojolicious.js ***!
  \****************************************************************/
(module) {

/*
Language: Mojolicious
Requires: xml.js, perl.js
Author: Dotan Dimet <dotan@corky.net>
Description: Mojolicious .ep (Embedded Perl) templates
Website: https://mojolicious.org
Category: template
*/
function mojolicious(hljs) {
  return {
    name: 'Mojolicious',
    subLanguage: 'xml',
    contains: [
      {
        className: 'meta',
        begin: '^__(END|DATA)__$'
      },
      // mojolicious line
      {
        begin: "^\\s*%{1,2}={0,2}",
        end: '$',
        subLanguage: 'perl'
      },
      // mojolicious block
      {
        begin: "<%{1,2}={0,2}",
        end: "={0,1}%>",
        subLanguage: 'perl',
        excludeBegin: true,
        excludeEnd: true
      }
    ]
  };
}

module.exports = mojolicious;


/***/ }

}]);
//# sourceMappingURL=Highlight for mojolicious.d5b1b058f863f27ce1fb.js.map
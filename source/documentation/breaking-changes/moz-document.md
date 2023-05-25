---
title: "Breaking Change: -moz-document"
introduction: >
  Firefox used to have a @-moz-document rule requiring special parsing. As
  support is removed from Firefox, Sass is in the process of removing support
  for parsing them.
---

Sass has historically supported a special parsing for the `@-moz-document` rule.
As [Firefox dropped support for them], Sass will also drop support for the special
parsing and will treat it as an unknown at-rule.

[Firefox dropped support for them]: https://web.archive.org/web/20200528221656/https://www.fxsitecompat.dev/en-CA/docs/2018/moz-document-support-has-been-dropped-except-for-empty-url-prefix/


**There is one exception**: an empty url prefix function is still allowed, as
that's used in a hack targetting Firefox.

{% codeExample 1 %}
@-moz-document url-prefix() {
  .error {
    color: red;
  }
}
===
@-moz-document url-prefix()
  .error
    color: red
{% endcodeExample %}

## Transition Period

{% compatibility '1.7.2', false, null, false %}{% endcompatibility %}

First, we'll emit deprecation warnings for all usages of `@-moz-document`
except for the empty url-prefix hack.

In Dart Sass 2.0, `@-moz-document` will be treated as an unknown at-rule.

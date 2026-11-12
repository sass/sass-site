---
title: 'Breaking Change: -moz-document'
introduction: >
  Firefox used to have a `@-moz-document` rule that required special parsing.
  Since [Firefox dropped support for this rule], Sass removed special parsing as
  well.

  [Firefox dropped support for this rule]: https://web.archive.org/web/20200528221656/https://www.fxsitecompat.dev/en-CA/docs/2018/moz-document-support-has-been-dropped-except-for-empty-url-prefix/
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

`@-moz-document` is now parsed just like any other [generic at-rule].

[generic at-rule]: /documentation/at-rules/css/

## Historical Behavior

Historically, `@-moz-document` had its own parsing logic. In most cases, this
just meant that it disallowed syntax that was valid for generic at-rules, but it
also parsed the `domain()` function with the same special syntax as `url()`.

{% codeExample 'moz-document-before' %}
  @-moz-document domain(http://mozilla.org) {
    .error {
      color: red;
    }
  }
  ===
  @-moz-document domain(http://mozilla.org)
    .error
      color: red
{% endcodeExample %}

{% compatibility 'dart: "1.7.2"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.7.2, Dart Sass emitted the `moz-document` deprecation warning for
any `@-moz-document` rule other than those that contained only an empty
`url-prefix()` function, since that's still used as a CSS hack to target
Firefox.

{% render 'silencing_deprecations' %}

---
title: Parsing a Stylesheet
introduction: >
  A Sass stylesheet is parsed from a sequence of Unicode code points. It's
  parsed directly, without first being converted to a token stream.
---

## Input Encoding

{% compatibility 'dart: false', 'libsass: true', 'ruby: true' %}
  Dart Sass currently *only* supports the UTF-8 encoding. As such, it's safest
  to encode all Sass stylesheets as UTF-8.
{% endcompatibility %}

It's often the case that a document is initially available only as a sequence of
bytes, which must be decoded into Unicode. Sass performs this decoding as
follows:

* If the sequence of bytes begins with the UTF-8 or UTF-16 encoding of U+FEFF
  BYTE ORDER MARK, the corresponding encoding is used.

* If the sequence of bytes begins with the plain ASCII string `@charset`, Sass
  determines the encoding using step 2 of the CSS algorithm for
  [determining the fallback encoding][].

  [determining the fallback encoding]: https://drafts.csswg.org/css-syntax-3/#input-byte-stream

* Otherwise, UTF-8 is used.

## Parse Errors

When Sass encounters invalid syntax in a stylesheet, parsing will fail and an
error will be presented to the user with information about the location of the
invalid syntax and the reason it was invalid.

Note that this is different than CSS, which specifies how to recover from most
errors rather than failing immediately. This is one of the few cases where SCSS
isn't *strictly* a superset of CSS. However, it's much more useful to Sass users
to see errors immediately, rather than having them passed through to the CSS
output.

The location of parse errors can be accessed through implementation-specific
APIs. For example, in Dart Sass you can access [`SassException.span`][], and in
Node Sass's and Dart Sass's JS API you can access the [`file`, `line`, and
`column`][js error] properties.

[`SassException.span`]: https://pub.dartlang.org/documentation/sass/latest/sass/SassException/span.html
[js error]: https://github.com/sass/node-sass#error-object

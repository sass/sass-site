---
title: Special Functions
table_of_contents: true
introduction: >
  CSS defines many functions, and most of them work just fine with Sass’s normal
  function syntax. They’re parsed as function calls, resolved to [plain CSS
  functions](/documentation/at-rules/function/#plain-css-functions), and compiled
  as-is to CSS. There are a few exceptions, though, which have special syntax
  that can’t just be parsed as a [SassScript
  expression](/documentation/syntax/structure#expressions). All special function
  calls return [unquoted strings](/documentation/values/strings#unquoted).
---

## `if()`

{% compatibility 'dart: "1.95.0"', 'libsass: false', 'ruby: false', 'feature: "calc()"' %}
  LibSass, Ruby Sass, and versions of Dart Sass parse `if()` as a Sass function
  with the signature `if($condition, $if-true, $if-false)`. If `$condition` is
  [truthy], this function returns `$if-true`; otherwise, it returns `$if-false`.
  This function has special syntax that avoids evaluating the branch that
  doesn't match `$condition`.

  [truthy]: /documentation/at-rules/control/if#truthiness-and-falsiness

  Dart Sass versions 1.95.0 and later parse `if()` as described below. Dart Sass
  versions before 3.0.0 still support the old `if()` syntax, but it's
  considered deprecated. See [/d/if-function].

  [/d/if-function]: /documentation/breaking-changes/if-function
{% endcompatibility %}

Sass supports the [CSS `if()` function] with one important addition: the
`sass(...)` condition, which takes a SassScript expression and matches if that
expression evaluates to a [truthy] value. An `if()` function that contains only
`sass(...)` conditions (and optionally `else`) will be evaluated entirely by
Sass, and return the corresponding value.

[CSS `if()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/if
[truthy]: /documentation/at-rules/control/if#truthiness-and-falsiness

SassScript in an `if()` function's conditions is *only* allowed within the
`sass(...)` condition or in [interpolation]. The values, on the other hand, are
normal SassScript expressions and don't need any special wrapping. Only the
value whose condition matches will be evaluted, so the other values may refer to
variables that don't exist or call functions that would error.

If no conditions in an pure-Sass `if()` match, it returns `null`.

[interpolation]: /documentation/interpolation

{% codeExample 'css-if-sass' %}
  @use 'sass:meta';

  $hungry: true;
  @debug if(sass($hungry): breakfast burrito; else: cereal); // breakfast burrito

  // You can use CSS boolean expressions with sass(...) conditions.
  @debug if(not sass($hungry): skip lunch); // null

  // Only the matching branch is evaluated.
  @debug if(sass(meta.variable-exists("thirsty")): thirsty; else: hungry); // hungry
  ===
  @use 'sass:meta'

  $hungry: true
  @debug if(sass($hungry): breakfast burrito; else: cereal)  // breakfast burrito

  // You can use CSS boolean expressions with sass(...) conditions.
  @debug if(not sass($hungry): skip lunch)  // null

  // Only the matching branch is evaluated.
  @debug if(sass(meta.variable-exists("thirsty")): thirsty; else: hungry)  // hungry
{% endcodeExample %}

`sass(...)` conditions can also be combined with normal CSS conditions. The Sass
conditions will be evaluated by Sass, but if any CSS conditions are left Sass
will return the whole result as a string.

{% codeExample 'css-if-mixed' %}
  $support-widescreen: true;
  @debug if(
    sass($support-widescreen) and media(width >= 3000px): big;
    else: small
  ); // if(media(width >= 3000px): big; else: small)

  // If Sass conditions mean a branch will never match (or always match), Sass
  // eagerly removes that branch and returns the final value if possible.
  $support-widescreen: false;
  @debug if(
    sass($support-widescreen) and media(width >= 3000px): big;
    else: small
  ); // small
  ===
  $support-widescreen: true
  @debug if(
    sass($support-widescreen) and media(width >= 3000px): big;
    else: small
  )  // if(media(width >= 3000px): big; else: small)

  // If Sass conditions mean a branch will never match (or always match), Sass
  // eagerly removes that branch and returns the final value if possible.
  $support-widescreen: false
  @debug if(
    sass($support-widescreen) and media(width >= 3000px): big;
    else: small
  )  // small
{% endcodeExample %}

## `url()`

The [`url()` function][] is commonly used in CSS, but its syntax is different
than other functions: it can take either a quoted *or* unquoted URL. Because an
unquoted URL isn't a valid SassScript expression, Sass needs special logic to
parse it.

[`url()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/url

If the `url()`'s argument is a valid unquoted URL, Sass parses it as-is,
although [interpolation][] may also be used to inject SassScript values. If it's
not a valid unquoted URL—for example, if it contains [variables][] or [function
calls][]—it's parsed as a normal [plain CSS function call][].

[interpolation]: /documentation/interpolation
[variables]: /documentation/variables
[function calls]: /documentation/at-rules/function
[plain CSS function call]: /documentation/at-rules/function/#plain-css-functions

{% codeExample 'url' %}
  $roboto-font-path: "../fonts/roboto";

  @font-face {
      // This is parsed as a normal function call that takes a quoted string.
      src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2");

      font-family: "Roboto";
      font-weight: 100;
  }

  @font-face {
      // This is parsed as a normal function call that takes an arithmetic
      // expression.
      src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2");

      font-family: "Roboto";
      font-weight: 300;
  }

  @font-face {
      // This is parsed as an interpolated special function.
      src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2");

      font-family: "Roboto";
      font-weight: 400;
  }
  ===
  $roboto-font-path: "../fonts/roboto"

  @font-face
      // This is parsed as a normal function call that takes a quoted string.
      src: url("#{$roboto-font-path}/Roboto-Thin.woff2") format("woff2")

      font-family: "Roboto"
      font-weight: 100


  @font-face
      // This is parsed as a normal function call that takes an arithmetic
      // expression.
      src: url($roboto-font-path + "/Roboto-Light.woff2") format("woff2")

      font-family: "Roboto"
      font-weight: 300


  @font-face
      // This is parsed as an interpolated special function.
      src: url(#{$roboto-font-path}/Roboto-Regular.woff2) format("woff2")

      font-family: "Roboto"
      font-weight: 400
{% endcodeExample %}

## `element()`, `progid:...()`, and `expression()`

{% compatibility 'dart: "1.40.0"', 'libsass: false', 'ruby: false', 'feature: "calc()"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.40.0 parse `calc()`
  as special syntactic function like `element()`.

  Dart Sass versions 1.40.0 and later parse `calc()` as a [calculation].

  [calculation]: /documentation/values/calculations
{% endcompatibility %}

{% compatibility 'dart: ">=1.31.0 <1.40.0"', 'libsass: false', 'ruby: false', 'feature: "clamp()"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.31.0 parse `clamp()`
  as a [plain CSS function] rather than supporting special syntax within it.

  [plain CSS function]: /documentation/at-rules/function/#plain-css-functions

  Dart Sass versions between 1.31.0 and 1.40.0 parse `clamp()` as special
  syntactic function like `element()`.

  Dart Sass versions 1.40.0 and later parse `clamp()` as a [calculation].

  [calculation]: /documentation/values/calculations
{% endcompatibility %}

The [`element()`] function is defined in the CSS spec, and because its IDs could
be parsed as colors, they need special parsing.

[`element()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/element

[`expression()`][] and functions beginning with [`progid:`][] are legacy
Internet Explorer features that use non-standard syntax. Although they're no
longer supported by recent browsers, Sass continues to parse them for backwards
compatibility.

[`expression()`]:
    https://blogs.msdn.microsoft.com/ie/2008/10/16/ending-expressions/
[`progid:`]:
    https://blogs.msdn.microsoft.com/ie/2009/02/19/the-css-corner-using-filters-in-ie8/

Sass allows *any text* in these function calls, including nested parentheses.
Nothing is interpreted as a SassScript expression, with the exception that
[interpolation][] can be used to inject dynamic values.

[interpolation]: /documentation/interpolation

{% codeExample 'element' %}
  $logo-element: logo-bg;

  .logo {
    background: element(##{$logo-element});
  }
  ===
  $logo-element: logo-bg

  .logo
    background: element(##{$logo-element})
{% endcodeExample %}

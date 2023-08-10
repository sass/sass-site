---
title: 'Breaking Change: Calc functions'
introduction: >
   Sass has added support for the CSS Values and Units Level 4 specification.
   These global functions are now reserved: `round()`, `mod()`, `rem()`,
   `sin()`, `cos()`, `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`, `pow()`,
   `sqrt()`, `hypot()`, `log()`, `exp()`, `abs()`, and `sign()`.
-------------------------------------------------------------------------------
{% compatibility 'dart: "1.65.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The new calc functions are now reserved as global functions. These function
calls will be parsed as CSS calculations instead of function calls: [`round()`], [`mod()`],
[`rem()`], [`sin()`], [`cos()`], [`tan()`], [`asin()`], [`acos()`], [`atan()`], [`atan2()`],
[`pow()`], [`sqrt()`], [`hypot()`], [`log()`], [`exp()`], [`abs()`], or [`sign()`].
User-defined functions named after any of these may no longer be called without
a namespace.

[`round()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/round
[`abs()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/abs
[`sin()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/sin
[`cos()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/cos
[`tan()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/tan
[`asin()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/asin
[`acos()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/acos
[`atan()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/atan
[`atan2()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/atan2
[`pow()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/pow
[`sqrt()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/sqrt
[`hypot()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/hypot
[`log()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/log
[`exp()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/exp
[`mod()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/mod
[`rem()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/rem
[`sign()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/sign

{% codeExample 'calc-function-bad', false %}
@function rem($number) {
  @return $number % 10;
}

.sidebar {
  // WRONG, Sass parses `rem()` as a calculation, not as a call to the function
  // declared above. This throws an error because `rem()` requires two parameters.
  margin-left: rem(9) * 1px;
}
===
@function rem($number)
  @return $number % 10

.sidebar 
    // WRONG, Sass parses `rem()` as a calculation, not as a call to the function
    // declared above. This throws an error because `rem()` requires two parameters.
    margin-left: rem(9) * 1px
{% endcodeExample %}

However, if the function is loaded from another file and called with a namespace
it is parsed as a function call.

{% codeExample 'calc-function-use' %}
  // _library.scss
  @function rem($number) {
    @return $number % 10;
  }
  ---
  // style.scss
  @use 'library';

  .sidebar {
    // RIGHT, Sass parses `library.rem()` as a function call rather than
    // a calculation because of the namespace.
    margin: library.rem(11);
  }
  ===
  // _library.sass
  @function rem($number)
    @return $number % 10
  ---
  // style.sass
  @use 'library'

  .sidebar
    // RIGHT, Sass parses `library.rem()` as a function call rather than
    // a calculation because of the namespace.
    a: library.rem(11) * 1px
  ===
  .sidebar {
    margin: 1;
  }
{% endcodeExample %}

{% headsUp %}
  Because calling a function from a module loaded [_without a namespace_] by
  writing `@use <url> as *` has the same syntax as calling a global function,
  Sass will parse these function calls as calculations, not as calls to the
  function defined in the module!

  [_without a namespace_]: /documentation/at-rules/use/#choosing-a-namespace
{% endheadsUp %}

To preserve the current behavior, use [`meta.call()`] and [`meta.get-function()`].

[`meta.get-function()`]: /documentation/modules/meta/#get-function
[`meta.call()`]: /documentation/modules/meta/#call

{% codeExample 'function-using-meta'%}
@use 'sass:meta';

@function rem($number) {
  @return $number % 10;
}

.sidebar {
  margin-left: meta.call(meta.get-function("rem"), 9) * 1px;
}
===
@use 'sass:meta'

@function rem($number)
  @return $number % 10

.sidebar
  margin-left: meta.call(meta.get-function("rem"), 9) * 1px
{% endcodeExample %}
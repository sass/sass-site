---
title: Calculations
introduction: >
  Calculations are how Sass represents the `calc()` function, as well as similar
  functions like `clamp()`, `min()`, and `max()`. Sass will simplify these as
  much as possible, even if they're combined with one another.
---

{% compatibility 'dart: "1.40.0"', 'libsass: false', 'ruby: false' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.40.0 parse `calc()`
  as a [special function] like `element()`.

  [special function]: /documentation/syntax/special-functions#element-progid-and-expression

  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.31.0 parse `clamp()`
  as a [plain CSS function] rather than supporting special syntax within it.
  Versions of Dart Sass between 1.31.0 and 1.40.0 parse `clamp()` as a [special
  function] like `element()`.

  [plain CSS function]: /documentation/at-rules/function/#plain-css-functions
{% endcompatibility %}

{% compatibility 'dart: "1.67.0"', 'libsass: false', 'ruby: false', 'feature: "Adjacent values"' %}
  Versions of Dart Sass between 1.40.0 and 1.67.0 don't allow multiple values in
  calculations that aren't separated by an operator, even in cases like `calc(1
  var(--plus-two))` which is valid CSS (since `--plus-two` can be defined to be `+
  2`).

  As of Dart Sass 1.67.0, multiple values in a calculation can be separated by
  spaces as long as every other value evaluates to an unquoted string (such as a
  `var()` expression or the unquoted string `"+ 2"`).
{% endcompatibility %}

{% codeExample 'calculations', false %}
  @debug calc(400px + 10%); // calc(400px + 10%)
  @debug calc(400px / 2); // 200px
  @debug min(100px, calc(1rem + 10%)); // min(100px, 1rem + 10%)
  ===
  @debug calc(400px + 10%)  // calc(400px + 10%)
  @debug calc(400px / 2)  // 200px
  @debug min(100px, calc(1rem + 10%)) ; // min(100px, 1rem + 10%)
{% endcodeExample %}

Calculations use a special syntax that's different from normal SassScript. It's
the same syntax as the CSS `calc()`, but with the additional ability to use
[Sass variables] and call [Sass functions]. This means that `/` is always a
division operator within a calculation!

[Sass variables]: /documentation/variables
[Sass functions]: /documentation/modules

{% funFact %}
  The arguments to a Sass function call use the normal Sass syntax, rather than
  the special calculation syntax!
{% endfunFact %}

You can also use [interpolation] in a calculation. However, if you do, no
operations that involve that interpolation will be simplified or type-checked,
so it's easy to end up with extra verbose or even invalid CSS. Rather than
writing `calc(10px + #{$var})`, just write `calc(10px + $var)`!

[interpolation]: /documentation/interpolation

## Simplification

Sass will simplify adjacent operations in calculations if they use units that
can be combined at compile-time, such as `1in + 10px` or `5s * 2`. If possible,
it'll even simplify the whole calculation to a single number—for example,
`clamp(0px, 30px, 20px)` will return `20px`.

{% headsUp %}
  This means that a calculation expression won't necessarily always return a
  calculation! If you're writing a Sass library, you can always use the
  [`meta.type-of()`] function to determine what type you're dealing with.

  [`meta.type-of()`]: /documentation/modules/meta#type-of
{% endheadsUp %}

Calculations will also be simplified within other calculations. In particular,
if a `calc()` end up inside any other calculation, the function call will be
removed and it'll be replaced by a plain old operation.

{% codeExample 'simplification' %}
  $width: calc(400px + 10%);

  .sidebar {
    width: $width;
    padding-left: calc($width / 4);
  }
  ===
  $width: calc(400px + 10%)

  .sidebar
    width: $width
    padding-left: calc($width / 4)
{% endcodeExample %}

## Operations

You can't use calculations with normal SassScript operations like `+` and `*`.
If you want to write some math functions that allow calculations just write them
within their own `calc()` expressions—if they're passed a bunch of numbers with
compatible units, they'll return plain numbers as well, and if they're passed
calculations they'll return calculations.

This restriction is in place to make sure that if calculations *aren't* wanted,
they throw an error as soon as possible. Calculations can't be used everywhere
plain numbers can: they can't be injected into CSS identifiers (such as
`.item-#{$n}`), for example, and they can't be passed to Sass's built-in [math
functions]. Reserving SassScript operations for plain numbers makes it clear
exactly where calculations are allowed and where they aren't.

[math functions]: /documentation/modules/math

{% codeExample 'calc-operations', false %}
  $width: calc(100% + 10px);
  @debug $width * 2; // Error!
  @debug calc($width * 2); // calc((100% + 10px) * 2);
  ===
  $width: calc(100% + 10px);
  @debug $width * 2; // Error!
  @debug calc($width * 2); // calc((100% + 10px) * 2);
{% endcodeExample %}

## Constants

{% compatibility 'dart: "1.60.0"','libsass: false', 'ruby: false' %}{% endcompatibility %}

Calculations can also contain constants, which are written as CSS identifiers.
For forwards-compatibility with future CSS specs, *all* identifiers are allowed,
and by default they're just treated as unquoted strings that are passed-through
as-is.

{% codeExample 'calc-constants', false %}
  @debug calc(h + 30deg); // calc(h + 30deg);
  ===
  @debug calc(h + 30deg)  // calc(h + 30deg);
{% endcodeExample %}

Sass automatically resolves a few special constant names that are specified in
CSS to unitless numbers:

* `pi` is a shorthand for the [mathematical constant *π*].

  [mathematical constant *π*]: https://en.wikipedia.org/wiki/Pi

* `e` is a shorthand for the [mathematical constant *e*].

  [mathematical constant *e*]: https://en.wikipedia.org/wiki/E_(mathematical_constant)

* `infinity`, `-infinity`, and `NaN` represent the corresponding floating-point
  values.

{% codeExample 'unitless-numbers', false %}
  @use 'sass:math';

  @debug calc(pi); // 3.1415926536
  @debug calc(e);  // 2.7182818285
  @debug calc(infinity) > math.$max-number;  // true
  @debug calc(-infinity) < math.$min-number; // true
  ===
  @use 'sass:math'

  @debug calc(pi)  // 3.1415926536
  @debug calc(e)   // 2.7182818285
  @debug calc(infinity) > math.$max-number   // true
  @debug calc(-infinity) < math.$min-number  // true
{% endcodeExample %}

## Calculation Functions

{% compatibility 'dart: "1.65.0"', 'libsass: false', 'ruby: false', 'feature: "Additional functions"' %}
  Versions of Dart Sass 1.65.0 and later _except_ 1.66.x handle the execution of
  these calculation functions: `round()`, `mod()`, `rem()`, `sin()`, `cos()`,
  `tan()`, `asin()`, `acos()`, `atan()`, `atan2()`, `pow()`, `sqrt()`,
  `hypot()`, `log()`, `exp()`, `abs()`, and `sign()`.

  In Dart Sass 1.65.x, any function call whose name matched a calculation
  function was _always_ parsed as a calculation function. This broke some
  existing user-defined functions, so support for the new calculation functions
  was removed in 1.66.0 until it could be added back _without_ breaking existing
  behavior in 1.67.0.
{% endcompatibility %}

Sass parses the following functions as [calculations]:
* Comparison Functions: [`min()`], [`max()`], and [`clamp()`]
* Stepped Value Functions: [`round()`], [`mod()`], and [`rem()`].
* Trigonometric Functions: [`sin()`], [`cos()`], [`tan()`], [`asin()`], [`acos()`],
  [`atan()`], and [`atan2()`].
* Exponential Functions: [`pow()`], [`sqrt()`], [`hypot()`], [`log()`], and [`exp()`].
* Sign-Related Functions: [`abs()`] and [`sign()`].

[calculations]: https://www.w3.org/TR/css-values-4/#math
[`min()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/min
[`max()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/max
[`clamp()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/clamp
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

{% funFact %}
  If you've defined a [Sass function] with the same name as a calculation
  function, Sass will always call your function instead of creating a
  calculation value.

  [Sass function]: /documentation/at-rules/function
{% endfunFact %}

### Legacy Global Functions

CSS added support for [mathematical expressions] in Values and Units Level
4. However, Sass supported its own [`round()`], [`abs()`], [`min()`] and
[`max()`] long before this, and it needed to be backwards-compatible with all
those existing stylesheets. This led to the need for extra-special syntactic
cleverness.

[mathematical expressions]: https://www.w3.org/TR/css-values-4/#math
[`round()`]: ../modules/math#round
[`abs()`]: ../modules/math#abs
[`min()`]: ../modules/math#min
[`max()`]: ../modules/math#max

If a call to `round()`, `abs()`, `min()`, or `max()` is a valid calculation
expression, it will be parsed as a calculation. But as soon as any part of the
call contains a SassScript feature that isn't supported in a calculation, like
the [modulo operator], it's parsed as a call to the appropriate Sass math
function instead.

Since calculations are simplified to numbers when possible anyway, the only
substantive difference is that the Sass functions only support units that can be
combined at build time, so `min(12px % 10, 10%)` will throw an error.

[modulo operator]: /documentation/operators/numeric/

{% headsUp %}
  Other calculations don't allow unitless numbers to be added to, subtracted
  from, or compared to numbers with units. [`min()`], [`max()`], [`abs()`] and
  [single-argument `round()`] are different, though: for backwards-compatibility
  with the global Sass legacy functions which allow unit/unitless mixing for
  historical reasons, these units can be mixed as long as they're contained
  directly within a `min()`, `max()`, `abs()`, or single-argument `round()`
  calculation.

  For instance, `min(5 + 10px, 20px)` will result in `15px`. However
  `sqrt(5 + 10px)` will throw an error, as `sqrt(5 + 10px)` was never a global
  Sass function, and these are incompatible units.

[single-argument `round()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/round
[`abs()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/abs
[`min()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/min
[`max()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/max
{% endheadsUp %}

#### `min()` and `max()`

{% compatibility 'dart: ">=1.11.0 <1.42.0"', 'libsass: false', 'ruby: false', 'feature: "min and max syntax"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.11.0 *always* parse
  `min()` and `max()` as Sass functions. To create a plain CSS `min()` or
  `max()` call for those implementations, you can write something like
  `unquote("min(#{$padding}, env(safe-area-inset-left))")` instead.

  CSS added support for [`min()` and `max()` functions] in Values and Units
  Level 4, from where they were quickly adopted by Safari [to support the iPhoneX].
  Since we already supported `min()` and `max()` as legacy Sass functions, we
  had to implement logic for backwards-compatibility and for support as CSS
  functions.

  Versions of Dart Sass between 1.11.0 and 1.40.0, and between 1.40.1
  and 1.42.0 parse `min()` and `max()` functions as [special functions] if
  they're valid plain CSS, but parse them as Sass functions if they contain Sass
  features other than interpolation, like variables or function calls.

  Dart Sass 1.41.0 parses `min()` and `max()` functions as calculations, but
  doesn't allow unitless numbers to be combined with numbers with units. This
  was backwards-incompatible with the global `min()` and `max()` functions, so
  that behavior was reverted.

  [`min()` and `max()` functions]: https://www.w3.org/TR/css-values-4/#math
  [to support the iPhoneX]: https://webkit.org/blog/7929/designing-websites-for-iphone-x/
  [special functions]: /documentation/syntax/special-functions/
{% endcompatibility %}

{% codeExample 'min-max' %}
  $padding: 12px;

  .post {
    // Since these max() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: max($padding, env(safe-area-inset-left));
    padding-right: max($padding, env(safe-area-inset-right));
  }

  .sidebar {
    // Since these use the SassScript-only modulo operator, they're parsed as
    // SassScript function calls.
    padding-left: max($padding % 10, 20px);
    padding-right: max($padding % 10, 20px);
  }

  ===
  $padding: 12px

  .post
    // Since these max() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: max($padding, env(safe-area-inset-left))
    padding-right: max($padding, env(safe-area-inset-right))


  .sidebar
    // Since these use the SassScript-only modulo operator, they're parsed as
    // SassScript function calls.
    padding-left: max($padding % 10, 20px)
    padding-right: max($padding % 10, 20px)

  ===
  .post {
    padding-left: max(12px, env(safe-area-inset-left));
    padding-right: max(12px, env(safe-area-inset-right));
  }

  .sidebar {
    padding-left: 20px;
    padding-right: 20px;
  }
{% endcodeExample %}

#### `round()`

{% compatibility 'dart: "1.65.0"', 'libsass: false', 'ruby: false', 'feature: "min and max syntax"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.65.0, as well as Dart
  Sass 1.66.x, *always* parse `round()` as a Sass function. To use a plain CSS
  function for those implementations, you can write something like
  `round(#{$strategy, $number, $step})` instead.
{% endcompatibility %}

The [`round(<strategy>, number, step)`] function accepts an optional rounding
strategy, a value to be rounded and a rounding interval `step`. `strategy`
should be `nearest`, `up`, `down`, or `to-zero`.

[`round(<strategy>, number, step)`]: https://developer.mozilla.org/en-US/docs/Web/CSS/round#parameter

{% codeExample 'round' %}
  $number: 12.5px;
  $step: 15px;

  .post-image {
    // Since these round() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: round(nearest, $number, $step);
    padding-right: round($number + 10px);
    padding-bottom: round($number + 10px, $step + 10%);
  }

  ===
  $number: 12.5px
  $step: 15px

  .post-image
    // Since these round() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: round(nearest, $number, $step)
    padding-right: round($number + 10px)
    padding-bottom: round($number + 10px, $step + 10%)

  ===
  .post-image {
    padding-left: 15px;
    padding-right: 23px;
    padding-bottom: round(22.5px, 15px + 10%);
  }
{% endcodeExample %}

#### `abs()`

{% compatibility 'dart: "1.67.0"', 'libsass: false', 'ruby: false', 'feature: "min and max syntax"' %}
  LibSass, Ruby Sass, and versions of Dart Sass prior to 1.67.0 *always* parse
  `abs()` as a Sass function. To create a plain CSS calculation for those
  implementations, you can write something like `abs(#{$number})` instead.
{% endcompatibility %}

{% headsUp %}
  The global `abs()` function compatibiliy with [% unit parameters is
  deprecated]. In the future, this will emit a CSS abs() function to be resolved
  by the browser.

  [% unit parameters is deprecated]: /documentation/breaking-changes/abs-percent/
{% endheadsUp %}

The [`abs(value)`] takes in a single expressiona as a parameter and returns the
absolute value of `$value`. If `$value` is negative, this returns `-$value`, and if
`$value` is positive, it returns `$value` as-is.

[`abs(value)`]: https://developer.mozilla.org/en-US/docs/Web/CSS/abs

{% codeExample 'abs' %}
  .post-image {
    // Since these abs() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: abs(10px);
    padding-right: math.abs(-7.5%);
    padding-top: abs(1 + 1px);
  }

  ===
  .post-image
    // Since these abs() calls are valid calculation expressions, they're
    // parsed as calculations.
    padding-left: abs(-10px)
    padding-right: math.abs(-7.5%)
    padding-top: abs(1 + 1px)

  ===
  .post-image {
    padding-left: 10px;
    padding-right: 7.5%;
    padding-top: 2px;
  }
{% endcodeExample %}

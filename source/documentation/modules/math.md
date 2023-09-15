---
title: sass:math
---

{% render 'doc_snippets/built-in-module-status' %}

## Variables

{% function 'math.$e' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The closest 64-bit floating point approximation of the [mathematical constant
  *e*][].

  [mathematical constant *e*]: https://en.wikipedia.org/wiki/E_(mathematical_constant)

  {% codeExample 'math-e' %}
    @use 'sass:math';

    @debug math.$e; // 2.7182818285
    ===
    @use 'sass:math'

    @debug math.$e  // 2.7182818285
  {% endcodeExample %}
{% endfunction %}

{% function 'math.$epsilon' %}
  {% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The difference between 1 and the smallest 64-bit floating point number greater
  than 1 according to floating-point comparisons. Because of Sass numbers' [10
  digits of precision](/documentation/values/numbers), in many cases this will
  appear to be 0.
{% endfunction %}

{% function 'math.$max-number' %}
  {% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The maximum finite number that can be represented as a 64-bit floating point
  number.

  {% codeExample 'math-max-number' %}
    @use 'sass:math';

    @debug math.$max-number; // 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
    ===
    @use 'sass:math'

    @debug math.$max-number  // 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
  {% endcodeExample %}
{% endfunction %}

{% function 'math.$max-safe-integer' %}
  {% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The maximum integer `n` such that both `n` and `n + 1` can be precisely
  represented as a 64-bit floating-point number.

  {% codeExample 'math-max-safe-integer' %}
    @use 'sass:math';

    @debug math.$max-safe-integer; // 9007199254740991
    ===
    @use 'sass:math'

    @debug math.$max-safe-integer  // 9007199254740991
  {% endcodeExample %}
{% endfunction %}

{% function 'math.$min-number' %}
  {% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The smallest positive number that can be represented as a 64-bit floating
  point number. Because of Sass numbers' [10 digits of
  precision](/documentation/values/numbers), in many cases this will appear to
  be 0.
{% endfunction %}

{% function 'math.$min-safe-integer' %}
  {% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The minimum integer `n` such that both `n` and `n - 1` can be precisely
  represented as a 64-bit floating-point number.

  {% codeExample 'math-min-safe-integer' %}
    @use 'sass:math';

    @debug math.$min-safe-integer; // -9007199254740991
    ===
    @use 'sass:math'

    @debug math.$min-safe-integer  // -9007199254740991
  {% endcodeExample %}
{% endfunction %}

{% function 'math.$pi' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  The closest 64-bit floating point approximation of the [mathematical constant
  *π*][].

  [mathematical constant *π*]: https://en.wikipedia.org/wiki/Pi

  {% codeExample 'math-pi' %}
    @use 'sass:math';

    @debug math.$pi; // 3.1415926536
    ===
    @use 'sass:math'

    @debug math.$pi  // 3.1415926536
  {% endcodeExample %}
{% endfunction %}

## Bounding Functions

{% function 'math.ceil($number)', 'ceil($number)', 'returns:number' %}
  Rounds `$number` up to the next highest whole number.

  {% codeExample 'math-ceil' %}
    @use 'sass:math';

    @debug math.ceil(4); // 4
    @debug math.ceil(4.2); // 5
    @debug math.ceil(4.9); // 5
    ===
    @use 'sass:math'

    @debug math.ceil(4)  // 4
    @debug math.ceil(4.2)  // 5
    @debug math.ceil(4.9)  // 5
  {% endcodeExample %}
{% endfunction %}

{% function 'math.clamp($min, $number, $max)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Restricts `$number` to the range between `$min` and `$max`. If `$number` is
  less than `$min` this returns `$min`, and if it's greater than `$max` this
  returns `$max`.

  `$min`, `$number`, and `$max` must have compatible units, or all be unitless.

  {% codeExample 'math-clamp' %}
    @use 'sass:math';

    @debug math.clamp(-1, 0, 1); // 0
    @debug math.clamp(1px, -1px, 10px); // 1px
    @debug math.clamp(-1in, 1cm, 10mm); // 10mm
    ===
    @use 'sass:math'

    @debug math.clamp(-1, 0, 1) // 0
    @debug math.clamp(1px, -1px, 10px) // 1px
    @debug math.clamp(-1in, 1cm, 10mm) // 10mm
  {% endcodeExample %}
{% endfunction %}

{% function 'math.floor($number)', 'floor($number)', 'returns:number' %}
  Rounds `$number` down to the next lowest whole number.

  {% codeExample 'math-floor' %}
    @use 'sass:math';

    @debug math.floor(4); // 4
    @debug math.floor(4.2); // 4
    @debug math.floor(4.9); // 4
    ===
    @use 'sass:math'

    @debug math.floor(4)  // 4
    @debug math.floor(4.2)  // 4
    @debug math.floor(4.9)  // 4
  {% endcodeExample %}
{% endfunction %}

{% function 'math.max($number...)', 'max($number...)', 'returns:number' %}
  Returns the highest of one or more numbers.

  {% codeExample 'math-max' %}
    @use 'sass:math';

    @debug math.max(1px, 4px); // 4px

    $widths: 50px, 30px, 100px;
    @debug math.max($widths...); // 100px
    ===
    @use 'sass:math'

    @debug math.max(1px, 4px)  // 4px

    $widths: 50px, 30px, 100px
    @debug math.max($widths...)  // 100px
  {% endcodeExample %}
{% endfunction %}

{% function 'math.min($number...)', 'min($number...)', 'returns:number' %}
  Returns the lowest of one or more numbers.

  {% codeExample 'math-min' %}
    @use 'sass:math';

    @debug math.min(1px, 4px); // 1px

    $widths: 50px, 30px, 100px;
    @debug math.min($widths...); // 30px
    ===
    @use 'sass:math'

    @debug math.min(1px, 4px)  // 1px

    $widths: 50px, 30px, 100px
    @debug math.min($widths...)  // 30px
  {% endcodeExample %}
{% endfunction %}

{% function 'math.round($number)', 'round($number)', 'returns:number' %}
  Rounds `$number` to the nearest whole number.

  {% codeExample 'math-round' %}
    @use 'sass:math';

    @debug math.round(4); // 4
    @debug math.round(4.2); // 4
    @debug math.round(4.9); // 5
    ===
    @use 'sass:math'

    @debug math.round(4)  // 4
    @debug math.round(4.2)  // 4
    @debug math.round(4.9)  // 5
  {% endcodeExample %}
{% endfunction %}

## Distance Functions

{% function 'math.abs($number)', 'abs($number)', 'returns:number' %}
  Returns the [absolute value][] of `$number`. If `$number` is negative, this
  returns `-$number`, and if `$number` is positive, it returns `$number` as-is.

  [absolute value]: https://en.wikipedia.org/wiki/Absolute_value

  {% codeExample 'math-abs' %}
    @use 'sass:math';

    @debug math.abs(10px); // 10px
    @debug math.abs(-10px); // 10px
    ===
    @use 'sass:math'

    @debug math.abs(10px) // 10px
    @debug math.abs(-10px) // 10px
  {% endcodeExample %}
{% endfunction %}

{% function 'math.hypot($number...)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the length of the *n*-dimensional [vector][] that has components equal
  to each `$number`. For example, for three numbers *a*, *b*, and *c*, this
  returns the square root of *a² + b² + c²*.

  The numbers must either all have compatible units, or all be unitless. And
  since the numbers' units may differ, the output takes the unit of the first
  number.

  [vector]: https://en.wikipedia.org/wiki/Euclidean_vector

  {% codeExample 'math-hypot' %}
    @use 'sass:math';

    @debug math.hypot(3, 4); // 5

    $lengths: 1in, 10cm, 50px;
    @debug math.hypot($lengths...); // 4.0952775683in
    ===
    @use 'sass:math'

    @debug math.hypot(3, 4) // 5

    $lengths: 1in, 10cm, 50px
    @debug math.hypot($lengths...) // 4.0952775683in
  {% endcodeExample %}
{% endfunction %}

## Exponential Functions

{% function 'math.log($number, $base: null)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [logarithm][] of `$number` with respect to `$base`. If `$base` is
  `null`, the [natural log][] is calculated.

  `$number` and `$base` must be unitless.

  [logarithm]: https://en.wikipedia.org/wiki/Logarithm
  [natural log]: https://en.wikipedia.org/wiki/Natural_logarithm

  {% codeExample 'math-log' %}
    @use 'sass:math';

    @debug math.log(10); // 2.302585093
    @debug math.log(10, 10); // 1
    ===
    @use 'sass:math'

    @debug math.log(10) // 2.302585093
    @debug math.log(10, 10) // 1
  {% endcodeExample %}
{% endfunction %}

{% function 'math.pow($base, $exponent)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Raises `$base` [to the power of][] `$exponent`.

  `$base` and `$exponent` must be unitless.

  [to the power of]: https://en.wikipedia.org/wiki/Exponentiation

  {% codeExample 'math-pow' %}
    @use 'sass:math';

    @debug math.pow(10, 2); // 100
    @debug math.pow(100, math.div(1, 3)); // 4.6415888336
    @debug math.pow(5, -2); // 0.04
    ===
    @use 'sass:math'

    @debug math.pow(10, 2) // 100
    @debug math.pow(100, math.div(1, 3)) // 4.6415888336
    @debug math.pow(5, -2) // 0.04
  {% endcodeExample %}
{% endfunction %}

{% function 'math.sqrt($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [square root][] of `$number`.

  `$number` must be unitless.

  [square root]: https://en.wikipedia.org/wiki/Square_root

  {% codeExample 'math-sqrt' %}
    @use 'sass:math';

    @debug math.sqrt(100); // 10
    @debug math.sqrt(math.div(1, 3)); // 0.5773502692
    @debug math.sqrt(-1); // NaN
    ===
    @use 'sass:math'

    @debug math.sqrt(100) // 10
    @debug math.sqrt(math.div(1, 3)) // 0.5773502692
    @debug math.sqrt(-1) // NaN
  {% endcodeExample %}
{% endfunction %}

## Trigonometric Functions

{% function 'math.cos($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [cosine][] of `$number`.

  `$number` must be an angle (its units must be compatible with `deg`) or
  unitless. If `$number` has no units, it is assumed to be in `rad`.

  [cosine]: https://en.wikipedia.org/wiki/Trigonometric_functions#Right-angled_triangle_definitions

  {% codeExample 'math-cos' %}
    @use 'sass:math';

    @debug math.cos(100deg); // -0.1736481777
    @debug math.cos(1rad); // 0.5403023059
    @debug math.cos(1); // 0.5403023059
    ===
    @use 'sass:math'

    @debug math.cos(100deg) // -0.1736481777
    @debug math.cos(1rad) // 0.5403023059
    @debug math.cos(1) // 0.5403023059
  {% endcodeExample %}
{% endfunction %}

{% function 'math.sin($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [sine][] of `$number`.

  `$number` must be an angle (its units must be compatible with `deg`) or
  unitless. If `$number` has no units, it is assumed to be in `rad`.

  [sine]: https://en.wikipedia.org/wiki/Trigonometric_functions#Right-angled_triangle_definitions

  {% codeExample 'math-sin' %}
    @use 'sass:math';

    @debug math.sin(100deg); // 0.984807753
    @debug math.sin(1rad); // 0.8414709848
    @debug math.sin(1); // 0.8414709848
    ===
    @use 'sass:math'

    @debug math.sin(100deg) // 0.984807753
    @debug math.sin(1rad) // 0.8414709848
    @debug math.sin(1) // 0.8414709848
  {% endcodeExample %}
{% endfunction %}

{% function 'math.tan($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [tangent][] of `$number`.

  `$number` must be an angle (its units must be compatible with `deg`) or
  unitless. If `$number` has no units, it is assumed to be in `rad`.

  [tangent]: https://en.wikipedia.org/wiki/Trigonometric_functions#Right-angled_triangle_definitions

  {% codeExample 'math-tan' %}
    @use 'sass:math';

    @debug math.tan(100deg); // -5.6712818196
    @debug math.tan(1rad); // 1.5574077247
    @debug math.tan(1); // 1.5574077247
    ===
    @use 'sass:math'

    @debug math.tan(100deg) // -5.6712818196
    @debug math.tan(1rad) // 1.5574077247
    @debug math.tan(1) // 1.5574077247
  {% endcodeExample %}
{% endfunction %}

{% function 'math.acos($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [arccosine][] of `$number` in `deg`.

  `$number` must be unitless.

  [arccosine]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties

  {% codeExample 'math-acos' %}
    @use 'sass:math';

    @debug math.acos(0.5); // 60deg
    @debug math.acos(2); // NaNdeg
    ===
    @use 'sass:math'

    @debug math.acos(0.5) // 60deg
    @debug math.acos(2) // NaNdeg
  {% endcodeExample %}
{% endfunction %}

{% function 'math.asin($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [arcsine][] of `$number` in `deg`.

  `$number` must be unitless.

  [arcsine]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties

  {% codeExample 'math-asin' %}
    @use 'sass:math';

    @debug math.asin(0.5); // 30deg
    @debug math.asin(2); // NaNdeg
    ===
    @use 'sass:math'

    @debug math.asin(0.5) // 30deg
    @debug math.asin(2) // NaNdeg
  {% endcodeExample %}
{% endfunction %}

{% function 'math.atan($number)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [arctangent][] of `$number` in `deg`.

  `$number` must be unitless.

  [arctangent]: https://en.wikipedia.org/wiki/Inverse_trigonometric_functions#Basic_properties

  {% codeExample 'math-atan' %}
    @use 'sass:math';

    @debug math.atan(10); // 84.2894068625deg
    ===
    @use 'sass:math'

    @debug math.atan(10) // 84.2894068625deg
  {% endcodeExample %}
{% endfunction %}

{% function 'math.atan2($y, $x)', 'returns:number' %}
  {% compatibility 'dart: "1.25.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [2-argument arctangent][] of `$y` and `$x` in `deg`.

  `$y` and `$x` must have compatible units or be unitless.

  [2-argument arctangent]: https://en.wikipedia.org/wiki/Atan2

  {% funFact %}
    `math.atan2($y, $x)` is distinct from `atan(math.div($y, $x))` because it
    preserves the quadrant of the point in question. For example, `math.atan2(1,
    -1)` corresponds to the point `(-1, 1)` and returns `135deg`. In contrast,
    `math.atan(math.div(1, -1))` and `math.atan(math.div(-1, 1))` resolve first
    to `atan(-1)`, so both return `-45deg`.
  {% endfunFact %}

  {% codeExample 'math-atan2' %}
    @use 'sass:math';

    @debug math.atan2(-1, 1); // 135deg
    ===
    @use 'sass:math'

    @debug math.atan2(-1, 1) // 135deg
  {% endcodeExample %}
{% endfunction %}

## Unit Functions

{% function 'math.compatible($number1, $number2)', 'comparable($number1, $number2)', 'returns:boolean' %}
  Returns whether `$number1` and `$number2` have compatible units.

  If this returns `true`, `$number1` and `$number2` can safely be [added][],
  [subtracted][], and [compared][]. Otherwise, doing so will produce errors.

  [added]: /documentation/operators/numeric
  [subtracted]: /documentation/operators/numeric
  [compared]: /documentation/operators/relational

  {% headsUp %}
    The global name of this function is
    <code>compa<strong>ra</strong>ble</code>, but when it was added to the
    `sass:math` module the name was changed to
    <code>compa<strong>ti</strong>ble</code> to more clearly convey what the
    function does.
  {% endheadsUp %}

  {% codeExample 'math-compatible' %}
    @use 'sass:math';

    @debug math.compatible(2px, 1px); // true
    @debug math.compatible(100px, 3em); // false
    @debug math.compatible(10cm, 3mm); // true
    ===
    @use 'sass:math'

    @debug math.compatible(2px, 1px)  // true
    @debug math.compatible(100px, 3em)  // false
    @debug math.compatible(10cm, 3mm)  // true
  {% endcodeExample %}
{% endfunction %}

{% function 'math.is-unitless($number)', 'unitless($number)', 'returns:boolean' %}
  Returns whether `$number` has no units.

  {% codeExample 'math-is-unitless' %}
    @use 'sass:math';

    @debug math.is-unitless(100); // true
    @debug math.is-unitless(100px); // false
    ===
    @use 'sass:math'

    @debug math.is-unitless(100)  // true
    @debug math.is-unitless(100px)  // false
  {% endcodeExample %}
{% endfunction %}

{% function 'math.unit($number)', 'unit($number)', 'returns:quoted string' %}
  Returns a string representation of `$number`'s units.

  {% headsUp %}
    This function is intended for debugging; its output format is not guaranteed
    to be consistent across Sass versions or implementations.
  {% endheadsUp %}

  {% codeExample 'math-unitless' %}
    @use 'sass:math';

    @debug math.unit(100); // ""
    @debug math.unit(100px); // "px"
    @debug math.unit(5px * 10px); // "px*px"
    @debug math.unit(math.div(5px, 1s)); // "px/s"
    ===
    @use 'sass:math'

    @debug math.unit(100)  // ""
    @debug math.unit(100px)  // "px"
    @debug math.unit(5px * 10px)  // "px*px"
    @debug math.unit(math.div(5px, 1s))  // "px/s"
  {% endcodeExample %}
{% endfunction %}

## Other Functions

{% function 'math.div($number1, $number2)', 'returns:number' %}
  {% compatibility 'dart: "1.33.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the result of dividing `$number1` by `$number2`.

  Any units shared by both numbers will be canceled out. Units in `$number1`
  that aren't in `$number2` will end up in the return value's numerator, and
  units in `$number2` that aren't in `$number1` will end up in its denominator.

  {% headsUp %}
    For backwards-compatibility purposes, this returns the *exact same result*
    as [the deprecated `/` operator], including concatenating two strings with a
    `/` character between them. However, this behavior will be removed
    eventually and shouldn't be used in new stylesheets.

    [the deprecated `/` operator]: /documentation/breaking-changes/slash-div
  {% endheadsUp %}

  {% codeExample 'math-div' %}
    @use 'sass:math';

    @debug math.div(1, 2); // 0.5
    @debug math.div(100px, 5px); // 20
    @debug math.div(100px, 5); // 20px
    @debug math.div(100px, 5s); // 20px/s
    ===
    @use 'sass:math'

    @debug math.div(1, 2)  // 0.5
    @debug math.div(100px, 5px)  // 20
    @debug math.div(100px, 5)  // 20px
    @debug math.div(100px, 5s)  // 20px/s
  {% endcodeExample %}
{% endfunction %}

{% function 'math.percentage($number)', 'percentage($number)', 'returns:number' %}
  Converts a unitless `$number` (usually a decimal between 0 and 1) to a
  percentage.

  {% funFact %}
    This function is identical to `$number * 100%`.
  {% endfunFact %}

  {% codeExample 'math-percentage' %}
    @use 'sass:math';

    @debug math.percentage(0.2); // 20%
    @debug math.percentage(math.div(100px, 50px)); // 200%
    ===
    @use 'sass:math'

    @debug math.percentage(0.2)  // 20%
    @debug math.percentage(math.div(100px, 50px))  // 200%
  {% endcodeExample %}
{% endfunction %}

{% function 'math.random($limit: null)', 'random($limit: null)', 'returns:number' %}
  If `$limit` is `null`, returns a random decimal number between 0 and 1.

  {% codeExample 'math-random' %}
    @use 'sass:math';

    @debug math.random(); // 0.2821251858
    @debug math.random(); // 0.6221325814
    ===
    @use 'sass:math'

    @debug math.random()  // 0.2821251858
    @debug math.random()  // 0.6221325814
  {% endcodeExample %}

  * * *

  If `$limit` is a number greater than or equal to 1, returns a random whole
  number between 1 and `$limit`.

  {% headsUp %}
    `random()` ignores units in `$limit`. [This behavior is deprecated] and
    `random($limit)` will return a random integer with the same units as the
    `$limit` argument.

    [This behavior is deprecated]: /documentation/breaking-changes/function-units

    {% codeExample 'math-random-warning' %}
      @use 'sass:math';

      @debug math.random(100px); // 42
      ===
      @use 'sass:math'

      @debug math.random(100px)  // 42
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'math-random-limit' %}
    @use 'sass:math';

    @debug math.random(10); // 4
    @debug math.random(10000); // 5373
    ===
    @use 'sass:math'

    @debug math.random(10)  // 4
    @debug math.random(10000)  // 5373
  {% endcodeExample %}
{% endfunction %}

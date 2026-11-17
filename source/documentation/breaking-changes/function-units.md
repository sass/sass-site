---
title: 'Breaking Change: Strict Function Units'
introduction: >
  Various built-in functions are now stricter in which units they allow and
  handle those units more consistently. This makes Sass more compatible with the
  CSS spec and helps catch errors more quickly.
table_of_contents: true
---

## Hue

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

When specifying a color's hue, CSS allows only [angle units] (`deg`, `grad`,
`rad`, or `turn`) and unitless numbers, which it interprets as `deg`. Sass now
matches this behavior by converting angle units into `deg` and throwing an error
if a number with a non-angle unit is used.

[angle units]: https://drafts.csswg.org/css-values-4/#angles

{% codeExample 'function-units-angle' %}
  .sidebar {
    background-color: hsl(0.5turn, 100%, 50%);
  }
  ===
  .sidebar
    background-color: hsl(0.5turn, 100%, 50%)
{% endcodeExample %}

{% codeExample 'function-units-error' %}
  .sidebar {
    background-color: hsl(120px, 100%, 50%);
  }
  ===
  .sidebar
    background-color: hsl(120px, 100%, 50%)
{% endcodeExample %}

### Historical Behavior

Historically, Sass interpreted *any* unit as though it was `deg`, including
other angle units. For example, `hsl(0.5turn, 100%, 50%)` was interpreted as
`hsl(0.5deg, 100%, 50%)` instead of the correct interpretation `hsl(180deg,
100%, 50%)`.

{% codeExample 'function-units-angle-before' %}
  .sidebar {
    background-color: hsl(0.5turn, 100%, 50%);
  }
  ===
  .sidebar
    background-color: hsl(0.5turn, 100%, 50%)
  ===
  .sidebar {
    background-color: hsl(0.5, 100%, 50%);
  }
{% endcodeExample %}

{% codeExample 'function-units-error-before' %}
  .sidebar {
    background-color: hsl(120px, 100%, 50%);
  }
  ===
  .sidebar
    background-color: hsl(120px, 100%, 50%)
  ===
  .sidebar {
    background-color: hsl(120, 100%, 50%);
  }
{% endcodeExample %}

{% compatibility 'dart: "1.32.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.32.0, Dart Sass emitted the `function-units` deprecation warning
if you passed a number with a unit other than `deg` as a hue to any function,
but the actual behavior was unchanged.

{% compatibility 'dart: "1.52.1"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Dart Sass 1.52.1 changed the way angle units are handled for hue parameters to
match the CSS spec. Numbers with `grad`, `rad`, or `turn` units were converted
to `deg`: `0.5turn` will be converted to `180deg`, `100grad` will be converted
to `90deg`, and so on. It did not change the way non-angle units were
interpreted.

{% codeExample 'function-units-angle-phase-2' %}
  .sidebar {
    background-color: hsl(0.5turn, 100%, 50%);
  }
  ===
  .sidebar
    background-color: hsl(0.5turn, 100%, 50%)
{% endcodeExample %}

## Saturation and Lightness

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

When specifying an HSL color's saturation and lightness, CSS only allows `%`
units. Even unitless numbers aren't allowed (unlike for the hue). Sass now
matches this behavior and throws an error for numbers without the unit `%`.

{% codeExample 'function-units-saturation' %}
  .sidebar {
    background-color: hsl(0, 50, 50%);
  }
  ===
  .sidebar
    background-color: hsl(0, 50, 50%)
{% endcodeExample %}

### Historical Behavior

Historically, Sass interpreted *any* unit (or no unit at all) as `%`.

{% codeExample 'function-units-saturation-before' %}
  .sidebar {
    background-color: hsl(0, 50px, 50%);
    color: hsl(180, 100, 50%);
  }
  ===
  .sidebar
    background-color: hsl(0, 50px, 50%)
    color: hsl(180, 100, 50%)
  ===
  .sidebar {
    background-color: hsl(0, 50%, 50%);
    color: hsl(180, 100%, 50%);
  }
{% endcodeExample %}

{% compatibility 'dart: "1.32.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.32.0, Dart Sass emitted the `function-units` deprecation warning
if you passed a number with no unit or a unit other than `%` as a lightness or
saturation to any function.

## Alpha

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

When specifying a color's alpha value, CSS (as of [Colors Level 4]) allows
either unitless values between 0 and 1 or `%` values between `0%` and `100%`.
Sass now matches this behavior and consistently interpretes percentages as
equivalent to their corresponding decimal values, while throwing an error for
any other unit.

{% codeExample 'function-units-alpha-percent' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.change(red, $alpha: 0.8%);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.change(red, $alpha: 0.8%)
{% endcodeExample %}

{% codeExample 'function-units-alpha-unit' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.change(red, $alpha: 0.8px);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.change(red, $alpha: 0.8px)
{% endcodeExample %}

### Historical Behavior

Historically, Sass ignored the units entirely for the `$alpha` argument for the
[`color.change()` function] and [`color.adjust()` function].

[`color.change()` function]: /documentation/modules/color/#change
[`color.adjust()` function]: /documentation/modules/color/#adjust

{% codeExample 'function-units-alpha-before' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.change(red, $alpha: 0.8%);
    color: color.change(blue, $alpha: 0.8px);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.change(red, $alpha: 0.8%)
    color: color.change(blue, $alpha: 0.8px)
  ===
  .sidebar {
    background-color: rgba(255, 0, 0, 0.8);
    color: rgba(0, 0, 255, 0.8);
  }
{% endcodeExample %}

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.56.0, Dart Sass emitted the `function-units` deprecation warning
if you passed a number with any unit, including `%`, as an alpha value to
`color.change()` or `color.adjust()`.

{% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Dart 1.79.0 changed the way `%` units were handled for the alpha argument to
`color.change()` and `color.adjust()`. Alphas with unit `%` are now divided by
`100%`, converting them to unitless numbers between 0 and 1.

{% codeExample 'function-units-alpha-percent-phase-2' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.change(red, $alpha: 0.8%);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.change(red, $alpha: 0.8%)
{% endcodeExample %}

## `math.random()`

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The [`math.random()` function] now returns a number with the same units as its
`$limit` argument.

[`math.random()` function]: /documentation/modules/math#random

{% codeExample 'function-units-random' %}
  @use 'sass:math';

  .sidebar {
    width: math.random($limit: 200px);
  }
  ===
  @use 'sass:math'

  .sidebar
    width: math.random($limit: 200px)
{% endcodeExample %}

### Historical Behavior

Historically, the `math.random()` function ignored units in `$limit` and always
returned a unitless value.

{% codeExample 'function-units-random-before' %}
  @use 'sass:math';

  .sidebar {
    width: math.random($limit: 200px);
  }
  ===
  @use 'sass:math'

  .sidebar
    width: math.random($limit: 200px)
  ===
  .sidebar {
    width: 117;
  }
{% endcodeExample %}

{% compatibility 'dart: "1.54.5"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.54.5, Dart Sass emitted the `function-units` deprecation warning
if you passed a `$limit` with units to `math.random()`.

## Weight

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The [`color.mix()` function] and [`color.invert()` function] now throw an error
if their `$weight` arguments don't have unit `%`.

[`color.mix()` function]: /documentation/modules/color#mix
[`color.invert()` function]: /documentation/modules/color#invert

{% codeExample 'function-units-weight' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.mix(red, blue, 80);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.mix(red, blue, 80)
{% endcodeExample %}

### Historical Behavior

Historically, these functions ignored units entirely for their `$weight`
parameters and interpreted them as though they were percentages.

{% codeExample 'function-units-weight-before' %}
  @use 'sass:color';

  .sidebar {
    background-color: color.mix(red, blue, 80);
    color: color.invert(green, 20px);
  }
  ===
  @use 'sass:color'

  .sidebar
    background-color: color.mix(red, blue, 80)
    color: color.invert(green, 20px)
  ===
  .sidebar {
    background-color: #cc0033;
    color: rgb(20%, 50.1176470588%, 20%);
  }
{% endcodeExample %}

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.56.0, Dart Sass emitted the `function-units` deprecation warning
if you passed a `$weight` with no units or with units other than `%` to
`color.mix()` or `color.invert()`.

## Index

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The [`list.nth()` function] and [`list.set-nth()` function] now throw errors if
any unit is used for their `$n` arguments.

[`list.nth()` function]: /documentation/modules/list#nth
[`list.set-nth()` function]: /documentation/modules/list#set-nth

{% codeExample 'function-units-index' %}
  @use 'sass:list';

  .sidebar {
    background-color: list.nth(red green blue, 2px);
  }
  ===
  @use 'sass:list'

  .sidebar
    background-color: list.nth(red green blue, 2px)
{% endcodeExample %}

### Historical Behavior

Historically, these functions ignored units entirely for their `$n` parameters.

{% codeExample 'function-units-index' %}
  @use 'sass:list';

  .sidebar {
    $options: list.set-nth(red green blue, 1s, yellow);
    background-color: list.nth($options, 1px);
  }
  ===
  @use 'sass:list'

  .sidebar
    $options: list.set-nth(red green blue, 1s, yellow)
    background-color: list.nth($options, 1px)
  ===
  .sidebar {
    background-color: yellow;
  }
{% endcodeExample %}

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.56.0, Dart Sass emitted the `function-units` deprecation warning
if you passed an `$n` with units to `list.nth()` or `list.set-nth()`.

{% render 'silencing_deprecations' %}

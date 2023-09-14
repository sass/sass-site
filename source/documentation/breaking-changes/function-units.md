---
title: 'Breaking Change: Strict Function Units'
introduction: >
  Various built-in functions will become stricter in which units they allow
  and will handle those units more consistently. This makes Sass more compatible
  with the CSS spec and helps catch errors more quickly.
---

## Hue

{% compatibility 'dart: "1.32.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

When specifying a color's hue, CSS allows any [angle unit][] (`deg`, `grad`,
`rad`, or `turn`). It also allows a unitless number, which is interpreted as
`deg`. Historically, Sass has allowed *any* unit, and interpreted it as `deg`.
This is particularly problematic because it meant that the valid CSS expression
`hsl(0.5turn, 100%, 50%)` would be allowed by Sass but interpreted entirely
wrong.

[angle unit]: https://drafts.csswg.org/css-values-4/#angles

To fix this issue and bring Sass in line with the CSS spec, we're making changes
in multiple phases:

### Phase 1

{% compatibility 'dart: "1.32.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

At first, Sass just emitted a deprecation warning if you passed a number with a
unit other than `deg` as a hue to any function. Passing a unitless number is
still allowed.

### Phase 2

{% compatibility 'dart: "1.52.1"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Next, we changed the way angle units are handled for hue parameters to match the
CSS spec. This means that numbers with `grad`, `rad`, or `turn` units will be
converted to `deg`: `0.5turn` will be converted to `180deg`, `100grad` will be
converted to `90deg`, and so on.

Because this change is necessary to preserve CSS compatibility, according to the
[Dart Sass compatibility policy] it was made with only a minor version bump.
However, it changes as little behavior as possible to ensure that Sass
interprets all valid CSS according to the CSS spec.

[Dart Sass compatibility policy]: https://github.com/sass/dart-sass#compatibility-policy

### Phase 3

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Finally, in Dart Sass 2.0.0 color functions will throw errors if they're passed
a hue parameter with a non-angle unit. Unitless hues will still be allowed.

## Saturation and Lightness

When specifying an HSL color's saturation and lightness, CSS only allows `%`
units. Even unitless numbers aren't allowed (unlike for the hue). Historically,
Sass has allowed *any* unit, and interpreted it as `%`. You could even write
`hsl(0, 100px, 50s)` and Sass would return the color `red`.

To fix this issue and bring Sass in line with the CSS spec, we're making changes
in two phases:

### Phase 1

{% compatibility 'dart: "1.32.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass just emits a deprecation warning if you pass a number with no
unit or a unit other than `%` as a lightness or saturation to any function.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0 color functions will throw errors if they're passed a
saturation or lightness parameter with no unit or a non-`%` unit.

## Alpha

When specifying a color's alpha value, CSS (as of [Colors Level 4]) allows
either unitless values between 0 and 1 or `%` values between `0%` and `100%`. In
most cases Sass follows this behavior, but the functions `color.adjust()` and
`color.change()` have historically allowed *any* unit, and interpreted it as
unitless. You could even write `color.change(red, $alpha: 1%)` and Sass would
return the opaque color `red`.

[Colors Level 4]: https://www.w3.org/TR/css-color-4/#typedef-alpha-value

To fix this issue and bring Sass in line with the CSS spec, we're making changes
in three phases:

### Phase 1

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass just emits a deprecation warning if you pass a number with any
unit, including `%`, as an alpha value to `color.change()` or `color.adjust()`.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Next, we'll change the way `%` units are handled for the alpha argument to
`color.change()` and `color.adjust()`. Alphas with unit `%` will be divided by
`100%`, converting them to unitless numbers between 0 and 1.

Because this change is a bug fix that improves consistency with other Sass
functions, it will be made with only a minor version bump. It will be changed at
minimum three months after Phase 1 is released, to give users time to adjust
their code and avoid the bug.

[Dart Sass compatibility policy]: https://github.com/sass/dart-sass#compatibility-policy

### Phase 3

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Finally, in Dart Sass 2.0.0 `color.change()` and `color.adjust()` will throw
errors if they're passed an alpha parameter with a non-`%` unit. Unitless alphas
will still be allowed.

## `math.random()`

[The `math.random()` function] has historically ignored units in `$limit` and
returned a unitless value. For example `math.random(100px)` would drop "px" and
return a value like `42`.

A future version of Sass will stop ignoring units for the `$limit` argument and
return a random integer with the same units.

[The `math.random()` function]: /documentation/modules/math#random

{% codeExample 'function-units', false %}
  @use "sass:math";

  // Future Sass, doesn't work yet!
  @debug math.random(100px); // 42px
  ===
  @use "sass:math"

  // Future Sass, doesn't work yet!
  @debug math.random(100px)  // 42px
{% endcodeExample %}

### Phase 1

{% compatibility 'dart: "1.54.5"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass emits a deprecation warning if you pass a `$limit` with units to
`math.random()`.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, passing a `$limit` number with units will be an error.

### Phase 3

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In a minor release after Dart Sass 2.0.0, passing a `$limit` number with units
to the `math.random()` function will be allowed again. It will return a random
integer the same units as `$limit`, instead of a unitless number.

## Weight

The [`color.mix()` function] and [`color.invert()` function] have both
historically ignored units in their `$weight` arguments, despite that argument
conceptually representing a percentage. A future version of Sass will require
the unit `%`.

[`color.mix()` function]: /documentation/modules/color#mix
[`color.invert()` function]: /documentation/modules/color#invert

### Phase 1

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass emits a deprecation warning if you pass a `$weight` with no
units or with units other than `%` to `color.mix()` or `color.invert()`.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, `color.mix()` and `color.invert()` will throw errors if
they're passed a `$weight` with no unit or a non-`%` unit.

## Index

The [`list.nth()` function] and [`list.set-nth()` function] have both
historically ignored units in their `$n` arguments. A future version of Sass
will forbid any units.

[`list.nth()` function]: /documentation/modules/list#nth
[`list.set-nth()` function]: /documentation/modules/list#set-nth

### Phase 1

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass emits a deprecation warning if you pass a `$weight` with no
units or with units other than `%` to `color.mix()` or `color.invert()`.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, `list.nth()` and `list.set-nth()` will throw errors if
they're passed an index `$n` with a unit.

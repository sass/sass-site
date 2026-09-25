---
title: 'Breaking Change: abs() Percentage'
introduction: >
  Sass has historically supported a top-level `abs()` function. CSS's native
  `abs()` calculation function, added in Values and Units Level 4, introduced a
  compatibility issue in that it handled values with unit `%` differently than
  Sass.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The native CSS `abs()` resolves a percentage before taking the absolute value of
the result. For example, if the value `10%` represents `-50px`, `abs(10%)`
evaluates to `50px`, even though `10%` is already a positive number.

The value that a percentage represents can't be known until the browser is
actually rendering the stylesheet. Therefore, in order to make sure that
percentages are interpreted correctly, Sass doesn't resolve them at all in the
top-level `abs()` function. It just returns them as a [calculation value].

[calculation value]: /documentation/values/calculations/

{% codeExample 'abs-percent' %}
  div {
    width: abs(-10%);
  }
  ===
  div
    width: abs(-10%)
{% endcodeExample %}

If you want to resolve the value at build time based on the sign of the
percentage itself, you can use the [`math.abs()`] function instead.

[`math.abs()`]: documentation/modules/math/#abs

{% codeExample 'math-abs-percent' %}
  @use 'sass:math';

  div {
    width: math.abs(-10%);
  }
  ===
  @use 'sass:math'

  div
    width: math.abs(-10%)
{% endcodeExample %}

## Historical Behavior

In older Sass versions, the top-level `abs()` function handled percentages the
same way that `math.abs()` does today: by converting negative percentages into
positive ones. This behavior was deprecated in Dart Sass 1.65.0.

{% codeExample 'abs-percent' %}
  div {
    width: abs(-10%);
  }
  ===
  div
    width: abs(-10%)
  ===
  div {
    width: 10%;
  }
{% endcodeExample %}

{% render 'silencing_deprecations' %}

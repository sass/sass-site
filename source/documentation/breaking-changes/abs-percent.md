---
title: 'Breaking Change: abs() Percentage'
introduction: >
  Sass has historically supported the `abs()` function. After CSS supported
  calculations in Values and Units Level 4, we had to workaround
  backwards-compatibility. However, for the `abs()` function we posses a
  compatibility problem supporting the `%` unit.
---

The `abs()` global function in Sass supported the `%` unit as an input and would
resolve the `abs()` function before resolving the `%` value. For instance, if
the input was `abs(10%)` the function will return `10%`. As a result, if the
value of `10%` represented `-50px` the function would return `-50px`.

However, the CSS `abs()` abs function will resolve the `%` before resolving the
function. Therefore if the value of `10%` represented `-50px`, `abs(10%)` would
return `-10%` which in the browser would be `50px`.

For this reason, we are deprecating the global abs() function with a percentage.
To preserve the current behavior, use `math.abs()` or `abs(#{})` instead.


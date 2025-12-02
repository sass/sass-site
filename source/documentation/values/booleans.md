---
title: Booleans
introduction: >
  Booleans are the logical values `true` and `false`. In addition their literal
  forms, booleans are returned by [equality](/documentation/operators/equality)
  and [relational](/documentation/operators/relational) operators, as well as
  many built-in functions like
  [`math.comparable()`](/documentation/modules/math#comparable) and
  [`map.has-key()`](/documentation/modules/map#has-key).
---

{% codeExample 'booleans', false %}
  @use "sass:math";

  @debug 1px == 2px; // false
  @debug 1px == 1px; // true
  @debug 10px < 3px; // false
  @debug math.comparable(100px, 3in); // true
  ===
  @use "sass:math"

  @debug 1px == 2px  // false
  @debug 1px == 1px  // true
  @debug 10px < 3px  // false
  @debug math.comparable(100px, 3in)  // true
{% endcodeExample %}

You can work with booleans using [boolean operators][]. The `and` operator
returns `true` if *both* sides are `true`, and the `or` operator returns `true`
if *either* side is `true`. The `not` operator returns the opposite of a single
boolean value.

[boolean operators]: /documentation/operators/boolean

{% codeExample 'boolean-operators', false %}
  @debug true and true; // true
  @debug true and false; // false

  @debug true or false; // true
  @debug false or false; // false

  @debug not true; // false
  @debug not false; // true
  ===
  @debug true and true  // true
  @debug true and false  // false

  @debug true or false  // true
  @debug false or false  // false

  @debug not true  // false
  @debug not false  // true
{% endcodeExample %}

## Using Booleans

You can use booleans to choose whether or not to do various things in Sass. The
[`@if` rule][] evaluates a block of styles if its argument is `true`:

[`@if` rule]: /documentation/at-rules/control/if

{% render 'code_snippets/example-if' %}

The [`if()` function] returns one value if its argument is `true` and another
if its argument is `false`:

[`if()` function]: /documentation/syntax/special-functions#if

{% codeExample 'if-function', false %}
  @debug if(true: 10px; 30px); // 10px
  @debug if(false: 10px; 30px); // 30px
  ===
  @debug if(true: 10px; 30px)  // 10px
  @debug if(false: 10px; 30px)  // 30px
{% endcodeExample %}

{% render 'doc_snippets/truthiness-and-falsiness' %}

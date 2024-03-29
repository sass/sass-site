---
title: String Operators
introduction: >
  Sass supports a few operators that generate
  [strings](/documentation/values/strings):
---

* `<expression> + <expression>` returns a string that contains both expressions'
  values. If the either value is a [quoted string][], the result will be quoted;
  otherwise, it will be unquoted.

* `<expression> - <expression>` returns an unquoted string that contains both
  expressions' values, separated by `-`. This is a legacy operator, and
  [interpolation][] should generally be used instead.

[quoted string]: /documentation/values/strings#quoted
[interpolation]: /documentation/interpolation

{% codeExample 'string', false %}
  @debug "Helvetica" + " Neue"; // "Helvetica Neue"
  @debug sans- + serif; // sans-serif
  @debug sans - serif; // sans-serif
  ===
  @debug "Helvetica" + " Neue"  // "Helvetica Neue"
  @debug sans- + serif  // sans-serif
  @debug sans - serif  // sans-serif
{% endcodeExample %}

These operators don't just work for strings! They can be used with any values
that can be written to CSS, with a few exceptions:

* Numbers can't be used as the left-hand value, because they have [their own
  operators][numeric].
* Colors can't be used as the left-hand value, because they used to have [their
  own operators][color].

[numeric]: /documentation/operators/numeric
[color]: /documentation/operators

{% codeExample 'string-exceptions', false %}
  @debug "Elapsed time: " + 10s; // "Elapsed time: 10s";
  @debug true + " is a boolean value"; // "true is a boolean value";
  ===
  @debug "Elapsed time: " + 10s  // "Elapsed time: 10s";
  @debug true + " is a boolean value"  // "true is a boolean value";
{% endcodeExample %}

{% headsUp %}
  It's often cleaner and clearer to use [interpolation][] to create strings,
  rather than relying on these operators.

  [interpolation]: /documentation/interpolation
{% endheadsUp %}

## Unary Operators

For historical reasons, Sass also supports `/` and `-` as a unary operators
which take only one value:

* `/<expression>` returns an unquoted string starting with `/` and followed by
  the expression's value.
* `-<expression>` returns an unquoted string starting with `-` and followed by
  the expression's value.

{% codeExample 'unary-operators', false %}
  @debug / 15px; // /15px
  @debug - moz; // -moz
  ===
  @debug / 15px  // /15px
  @debug - moz  // -moz
{% endcodeExample %}

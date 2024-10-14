---
title: Equality Operators
---

{% compatibility 'dart: true', 'libsass: false', 'ruby: "4.0.0 (unreleased)"', 'feature: "Unitless Equality"'%}
  LibSass and older versions of Ruby Sass consider numbers without units to be
  equal to the same numbers with any units. This behavior was deprecated and has
  been removed from more recently releases because it violates [transitivity][].

  [transitivity]: https://en.wikipedia.org/wiki/Transitive_relation
{% endcompatibility %}

The equality operators return whether or not two values are the same. They're
written `<expression> == <expression>`, which returns whether two
[expressions][] are equal, and `<expression> != <expression>`, which returns
whether two expressions are *not* equal. Two values are considered equal if
they're the same type *and* the same value, which means different things for
different types:

[expressions]: /documentation/syntax/structure#expressions

* [Numbers][] are equal if they have the same value *and* the same units, or if
  their values are equal when their units are converted between one another.
* [Strings][] are unusual in that [unquoted][] and [quoted][] strings with the
  same contents are considered equal.
* [Colors] are equal if they're in the same [color space] and have the same
  channel values, *or* if they're both in [legacy color spaces] and have the
  same RGBA channel values.
* [Lists][] are equal if their contents are equal. Comma-separated lists aren't
  equal to space-separated lists, and bracketed lists aren't equal to
  unbracketed lists.
* [Maps][] are equal if their keys and values are both equal.
* [Calculations] are equal if their names and arguments are all equal. Operation
  arguments are compared textually.
* [`true`, `false`][], and [`null`][] are only equal to themselves.
* [Functions][] are equal to the same function. Functions are compared *by
  reference*, so even if two functions have the same name and definition they're
  considered different if they aren't defined in the same place.

[Numbers]: /documentation/values/numbers
[Strings]: /documentation/values/strings
[quoted]: /documentation/values/strings#quoted
[unquoted]: /documentation/values/strings#unquoted
[Colors]: /documentation/values/colors
[color space]: /documentation/values/colors#color-spaces
[legacy color spaces]: /documentation/values/colors#legacy-color-spaces
[Lists]: /documentation/values/lists
[`true`, `false`]: /documentation/values/booleans
[`null`]: /documentation/values/null
[Maps]: /documentation/values/maps
[Calculations]: /documentation/values/calculations
[Functions]: /documentation/values/functions

{% codeExample 'equality', false %}
  @debug 1px == 1px; // true
  @debug 1px != 1em; // true
  @debug 1 != 1px; // true
  @debug 96px == 1in; // true

  @debug "Helvetica" == Helvetica; // true
  @debug "Helvetica" != "Arial"; // true

  @debug hsl(34, 35%, 92.1%) == #f2ece4; // true
  @debug rgba(179, 115, 153, 0.5) != rgba(179, 115, 153, 0.8); // true

  @debug (5px 7px 10px) == (5px 7px 10px); // true
  @debug (5px 7px 10px) != (10px 14px 20px); // true
  @debug (5px 7px 10px) != (5px, 7px, 10px); // true
  @debug (5px 7px 10px) != [5px 7px 10px]; // true

  $theme: ("venus": #998099, "nebula": #d2e1dd);
  @debug $theme == ("venus": #998099, "nebula": #d2e1dd); // true
  @debug $theme != ("venus": #998099, "iron": #dadbdf); // true

  @debug true == true; // true
  @debug true != false; // true
  @debug null != false; // true

  @debug get-function("rgba") == get-function("rgba"); // true
  @debug get-function("rgba") != get-function("hsla"); // true
  ===
  @debug 1px == 1px  // true
  @debug 1px != 1em  // true
  @debug 1 != 1px  // true
  @debug 96px == 1in  // true

  @debug "Helvetica" == Helvetica  // true
  @debug "Helvetica" != "Arial"  // true

  @debug hsl(34, 35%, 92.1%) == #f2ece4  // true
  @debug rgba(179, 115, 153, 0.5) != rgba(179, 115, 153, 0.8)  // true

  @debug (5px 7px 10px) == (5px 7px 10px)  // true
  @debug (5px 7px 10px) != (10px 14px 20px)  // true
  @debug (5px 7px 10px) != (5px, 7px, 10px)  // true
  @debug (5px 7px 10px) != [5px 7px 10px]  // true

  $theme: ("venus": #998099, "nebula": #d2e1dd)
  @debug $theme == ("venus": #998099, "nebula": #d2e1dd)  // true
  @debug $theme != ("venus": #998099, "iron": #dadbdf)  // true

  @debug calc(10px + 10%) == calc(10px + 10%)  // true
  @debug calc(10% + 10px) == calc(10px + 10%)  // false

  @debug true == true  // true
  @debug true != false  // true
  @debug null != false  // true

  @debug get-function("rgba") == get-function("rgba")  // true
  @debug get-function("rgba") != get-function("hsla")  // true
{% endcodeExample %}

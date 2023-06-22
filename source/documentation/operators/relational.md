---
title: Relational Operators
introduction: >
  Relational operators determine whether
  [numbers](/documentation/values/numbers) are larger or smaller than one
  another. They automatically convert between compatible units.
---

* `<expression> < <expression>` returns whether the first [expression][]'s value
  is less than the second's.
* `<expression> <= <expression>` returns whether the first [expression][]'s
  value is less than or equal to the second's.
* `<expression> > <expression>` returns whether the first [expression][]'s value
  is greater than to the second's.
* `<expression> >= <expression>`, returns whether the first [expression][]'s
  value is greater than or equal to the second's.

[expression]: /documentation/syntax/structure#expressions

{% codeExample 'relational', false %}
  @debug 100 > 50; // true
  @debug 10px < 17px; // true
  @debug 96px >= 1in; // true
  @debug 1000ms <= 1s; // true
  ===
  @debug 100 > 50  // true
  @debug 10px < 17px  // true
  @debug 96px >= 1in  // true
  @debug 1000ms <= 1s  // true
{% endcodeExample %}

Unitless numbers can be compared with any number. They're automatically
converted to that number's unit.

{% codeExample 'unitless-numbers', false %}
  @debug 100 > 50px; // true
  @debug 10px < 17; // true
  ===
  @debug 100 > 50px  // true
  @debug 10px < 17  // true
{% endcodeExample %}

Numbers with incompatible units can't be compared.

{% codeExample 'incompatible-units', false %}
  @debug 100px > 10s;
  //     ^^^^^^^^^^^
  // Error: Incompatible units px and s.
  ===
  @debug 100px > 10s
  //     ^^^^^^^^^^^
  // Error: Incompatible units px and s.
{% endcodeExample %}

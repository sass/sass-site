---
title: Boolean Operators
introduction: >
  Unlike languages like JavaScript, Sass uses words rather than symbols for its
  [boolean](/documentation/values/booleans) operators.
---

* `not <expression>` returns the opposite of the expression's value: it turns
  `true` into `false` and `false` into `true`.
* `<expression> and <expression>` returns `true` if *both* expressions' values
  are `true`, and `false` if either is `false`.
* `<expression> or <expression>` returns `true` if *either* expression's value
  is `true`, and `false` if both are `false`.

{% codeExample 'boolean', false %}
  @debug not true; // false
  @debug not false; // true

  @debug true and true; // true
  @debug true and false; // false

  @debug true or false; // true
  @debug false or false; // false
  ===
  @debug not true  // false
  @debug not false  // true

  @debug true and true  // true
  @debug true and false  // false

  @debug true or false  // true
  @debug false or false  // false
{% endcodeExample %}

{% render 'doc_snippets/truthiness-and-falsiness' %}

---
title: Numeric Operators
table_of_contents: true
introduction: >
  Sass supports the standard set of mathematical operators for
  [numbers](/documentation/values/numbers). They automatically convert between
  compatible units.
---

* `<expression> + <expression>` adds the first [expression][]'s value to the
  second's.
* `<expression> - <expression>` subtracts the first [expression][]'s value from
  the second's.
* `<expression> * <expression>` multiplies the first [expression][]'s value by
  the second's.
* `<expression> % <expression>` returns the remainder of the first
  [expression][]'s value divided by the second's. This is known as the [*modulo*
  operator][].

[expression]: /documentation/syntax/structure#expressions
[*modulo* operator]: https://en.wikipedia.org/wiki/Modulo_operation

{% codeExample 'numeric', false %}
  @debug 10s + 15s; // 25s
  @debug 1in - 10px; // 0.8958333333in
  @debug 5px * 3px; // 15px*px
  @debug 1in % 9px; // 0.0625in
  ===
  @debug 10s + 15s  // 25s
  @debug 1in - 10px  // 0.8958333333in
  @debug 5px * 3px  // 15px*px
  @debug 1in % 9px  // 0.0625in
{% endcodeExample %}

Unitless numbers can be used with numbers of any unit.

{% codeExample 'unitless-numbers', false %}
  @debug 100px + 50; // 150px
  @debug 4s * 10; // 40s
  ===
  @debug 100px + 50  // 150px
  @debug 4s * 10  // 40s
{% endcodeExample %}

Numbers with incompatible units can't be used with addition, subtraction, or
modulo.

{% codeExample 'incompatible-units', false %}
  @debug 100px + 10s;
  //     ^^^^^^^^^^^
  // Error: Incompatible units px and s.
  ===
  @debug 100px + 10s
  //     ^^^^^^^^^^^
  // Error: Incompatible units px and s.
{% endcodeExample %}

## Unary Operators

You can also write `+` and `-` as unary operators, which take only one value:

* `+<expression>` returns the expression's value without changing it.
* `-<expression>` returns the negative version of the expression's value.

{% codeExample 'unary-operators', false %}
  @debug +(5s + 7s); // 12s
  @debug -(50px + 30px); // -80px
  @debug -(10px - 15px); // 5px
  ===
  @debug +(5s + 7s)  // 12s
  @debug -(50px + 30px)  // -80px
  @debug -(10px - 15px)  // 5px
{% endcodeExample %}

{% headsUp %}
  Because `-` can refer to both subtraction and unary negation, it can be
  confusing which is which in a space-separated list. To be safe:

  * Always write spaces on both sides of `-` when subtracting.
  * Write a space before `-` but not after for a negative number or a unary
    negation.
  * Wrap unary negation in parentheses if it's in a space-separated list.

  The different meanings of `-` in Sass take precedence in the following order:

  1. `-` as part of an identifier. The only exception are units; Sass normally
    allows any valid identifier to be used as an identifier, but units may not
    contain a hyphen followed by a digit.
  2. `-` between an expression and a literal number with no whitespace, which is
    parsed as subtraction.
  3. `-` at the beginning of a literal number, which is parsed as a negative
    number.
  4. `-` between two numbers regardless of whitespace, which is parsed as
    subtraction.
  5. `-` before a value other than a literal number, which is parsed as unary
    negation.

  {% codeExample 'heads-up-subtraction-unary-negation', false %}
    @debug a-1; // a-1
    @debug 5px-3px; // 2px
    @debug 5-3; // 2
    @debug 1 -2 3; // 1 -2 3

    $number: 2;
    @debug 1 -$number 3; // -1 3
    @debug 1 (-$number) 3; // 1 -2 3
    ===
    @debug a-1  // a-1
    @debug 5px-3px  // 2px
    @debug 5-3  // 2
    @debug 1 -2 3  // 1 -2 3

    $number: 2
    @debug 1 -$number 3  // -1 3
    @debug 1 (-$number) 3  // 1 -2 3
  {% endcodeExample %}
{% endheadsUp %}

## Division

{% compatibility 'dart: "1.33.0"', 'libsass: false', 'ruby: false', 'feature: "math.div()"' %}{% endcompatibility %}

Unlike other mathematical operations, division in Sass is done with the
[`math.div()`] function. Although many programming languages use `/` as a
division operator, in CSS `/` is used as a separator (as in `font: 15px/32px` or
`hsl(120 100% 50% / 0.8)`). While Sass does support the use of `/` as a division
operator, this is deprecated and [will be removed] in a future version.

[`math.div()`]: /documentation/modules/math#div
[will be removed]: /documentation/breaking-changes/slash-div

### Slash-Separated Values

For the time being while Sass still supports `/` as a division operator, it has
to have a way to disambiguate between `/` as a separator and `/` as division. In
order to make this work, if two numbers are separated by `/`, Sass will print
the result as slash-separated instead of divided unless one of these conditions
is met:

* Either expression is anything other than a literal number.
* The result is stored in a variable or returned by a function.
* The operation is surrounded by parentheses, unless those parentheses are
  outside a list that contains the operation.
* The result is used as part of another operation (other than `/`).
* The result is returned by a [calculation].

[calculation]: /documentation/values/calculations

You can use [`list.slash()`] to force `/` to be used as a separator.

[`list.slash()`]: /documentation/modules/list#slash

{% codeExample 'slash-separated-values', false %}
  @use "sass:list";

  @debug 15px / 30px; // 15px/30px
  @debug (10px + 5px) / 30px; // 0.5
  @debug list.slash(10px + 5px, 30px); // 15px/30px

  $result: 15px / 30px;
  @debug $result; // 0.5

  @function fifteen-divided-by-thirty() {
    @return 15px / 30px;
  }
  @debug fifteen-divided-by-thirty(); // 0.5

  @debug (15px/30px); // 0.5
  @debug (bold 15px/30px sans-serif); // bold 15px/30px sans-serif
  @debug 15px/30px + 1; // 1.5
  ===
  @use "sass:list";

  @debug 15px / 30px  // 15px/30px
  @debug (10px + 5px) / 30px  // 0.5
  @debug list.slash(10px + 5px, 30px)  // 15px/30px

  $result: 15px / 30px
  @debug $result  // 0.5

  @function fifteen-divided-by-thirty()
    @return 15px / 30px

  @debug fifteen-divided-by-thirty()  // 0.5

  @debug (15px/30px)  // 0.5
  @debug (bold 15px/30px sans-serif)  // bold 15px/30px sans-serif
  @debug 15px/30px + 1  // 1.5
{% endcodeExample %}

{% render 'doc_snippets/number-units' %}

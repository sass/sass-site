---
title: Operators
introduction: >
  Sass supports a handful of useful `operators` for working with different
  values. These include the standard mathematical operators like `+` and `*`, as
  well as operators for various other types:
---

{% render 'doc_snippets/operator-list', parens: false %}

{% headsUp %}
  Early on in Sass's history, it added support for mathematical operations on
  [colors][]. These operations operated on each of the colors' RGB channels
  separately, so adding two colors would produce a color with the sum of their
  red channels as its red channel and so on.

  [colors]: /documentation/values/colors

  This behavior wasn't very useful, since it channel-by-channel RGB arithmetic
  didn't correspond well to how humans perceive color. [Color functions][] were
  added which are much more useful, and color operations were deprecated.
  They're still supported in LibSass and Ruby Sass, but they'll produce warnings
  and users are strongly encouraged to avoid them.

  [Color functions]: /documentation/modules/color
{% endheadsUp %}

## Order of Operations

Sass has a pretty standard [order of operations][], from tightest to loosest:

[order of operations]: https://en.wikipedia.org/wiki/Order_of_operations#Programming_languages

1. The unary operators [`not`][], [`+`, `-`][], and [`/`][].
2. The [`*`, `/`, and `%` operators][].
3. The [`+` and `-` operators][].
4. The [`>`, `>=`, `<` and `<=` operators][].
5. The [`==` and `!=` operators][].
6. The [`and` operator][].
7. The [`or` operator][].
8. The [`=` operator][], when it's available.

[`not`]: /documentation/operators/boolean
[`+`, `-`]: /documentation/operators/numeric#unary-operators
[`/`]: /documentation/operators/string#unary-operators
[`*`, `/`, and `%` operators]: /documentation/operators/numeric
[`+` and `-` operators]: /documentation/operators/numeric
[`>`, `>=`, `<` and `<=` operators]: /documentation/operators/relational
[`==` and `!=` operators]: /documentation/operators/equality
[`and` operator]: /documentation/operators/boolean
[`or` operator]: /documentation/operators/boolean
[`=` operator]: #single-equals

{% codeExample 'operators', false %}
  @debug 1 + 2 * 3 == 1 + (2 * 3); // true
  @debug true or false and false == true or (false and false); // true
  ===
  @debug 1 + 2 * 3 == 1 + (2 * 3)  // true
  @debug true or false and false == true or (false and false)  // true
{% endcodeExample %}

### Parentheses

You can explicitly control the order of operations using parentheses. An
operation inside parentheses is always evaluated before any operations outside
of them. Parentheses can even be nested, in which case the innermost parentheses
will be evaluated first.

{% codeExample 'parentheses', false %}
  @debug (1 + 2) * 3; // 9
  @debug ((1 + 2) * 3 + 4) * 5; // 65
  ===
  @debug (1 + 2) * 3  // 9
  @debug ((1 + 2) * 3 + 4) * 5  // 65
{% endcodeExample %}

## Single Equals

Sass supports a special `=` operator that's only allowed in function arguments,
which just creates an [unquoted string][] with its two operands separated by
`=`. This exists for backwards-compatibility with very old IE-only syntax.

[unquoted string]: /documentation/values/strings#unquoted

{% codeExample 'single-equals' %}
  .transparent-blue {
    filter: chroma(color=#0000ff);
  }
  ===
  .transparent-blue
    filter: chroma(color=#0000ff)
{% endcodeExample %}

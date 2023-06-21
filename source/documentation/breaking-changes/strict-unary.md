---
title: 'Breaking Change: Strict Unary Operators'
introduction: >
  Sass has historically allowed `-` and `+` to be used in ways that make it
  ambiguous whether the author intended them to be a binary or unary operator.
  This confusing syntax is being deprecated.
---

How is this property compiled?

{% codeExample 'strict-unary', false %}
  $size: 10px;

  div {
    margin: 15px -$size;
  }
  ===
  $size: 10px

  div
    margin: 15px -$size
{% endcodeExample %}

Some users might say "the `-` is attached to `$size`, so it should be `margin:
20px -10px`". Others might say "the `-` is between `20px` and `$size`, so it
should be `margin: 5px`." Sass currently agrees with the latter opinion, but the
real problem is that it's so confusing in the first place! This is a natural but
unfortunate consequence of CSS's space-separated list syntax combined with
Sass's arithmetic syntax.

That's why we're moving to make this an error. In the future, if you want to use
a binary `-` or `+` operator (that is, one that subtracts or adds two numbers),
you'll need to put whitespace on both sides or on neither side:

* Valid: `15px - $size`
* Valid: `(15px)-$size`
* Invalid: `15px -$size`

If you want to use a unary `-` or `+` operator as part of a space-separated
list, you'll (still) need to wrap it in parentheses:

* Valid: `15px (-$size)`

## Transition Period

{% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

We'll make this an error in Dart Sass 2.0.0, but until then it'll just emit a
deprecation warning.

{% render 'doc_snippets/silence-deprecations' %}

## Automatic Migration

You can use [the Sass migrator] to automatically update your stylesheets to add
a space after any `-` or `+` operators that need it, which will preserve the
existing behavior of these stylesheets.

[the Sass migrator]: https://github.com/sass/migrator#readme

```shellsession
$ npm install -g sass-migrator
$ sass-migrator strict-unary **/*.scss
```

---
title: 'Breaking Change: Strict Unary Operators'
introduction: >
  Sass now requires `+` and `-` operators to use spaces or parentheses to
  indicate unambiguously how they should be interpreted.
---

How should this property be compiled?

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
15px -10px`". Others might say "the `-` is between `15px` and `$size`, so it
should be `margin: 5px`." The real problem is that this question is so unclear
in the first place! This is a natural but unfortunate consequence of CSS's
space-separated list syntax combined with standard arithmetic syntax.

That's why the example above is now an error. If you want to use a binary `-` or
`+` operator (that is, one that subtracts or adds two numbers), you need to put
whitespace on both sides or on neither side:

* Valid: `15px - $size`
* Valid: `(15px)-$size`
* Invalid: `15px -$size`

If you want to use a unary `-` or `+` operator as part of a space-separated
list, you need to wrap it in parentheses:

* Valid: `15px (-$size)`

Otherwise, you'll get an error:

{% codeExample 'strict-unary-error' %}
  $size: 10px;

  div {
    margin: 15px -$size;
  }
  ===
  $size: 10px

  div
    margin: 15px -$size
{% endcodeExample %}

{% funFact %}
  You don't need to worry about this for plain numbers that don't involve any
  SassScript. CSS and Sass parse the `-` in a negative number like `-10px` as
  part of the number itself, not as an operator, which means it's always clear
  how to interpret it.
{% endfunFact %}

## Historical Behavior

Historically, Dart Sass treated the example above as a binary subtraction operation:

{% codeExample 'strict-unary-before' %}
  $size: 10px;

  div {
    margin: 15px -$size;
  }
  ===
  $size: 10px

  div
    margin: 15px -$size
  ===
  $size: 10px;

  div {
    margin: 5px;
  }
{% endcodeExample %}

{% compatibility 'dart: "1.55.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.55.0, Dart Sass emitted a `strict-unary` deprecation warning for
ambiguous uses of `-` (or `+`) like the example above.

### Automatic Migration

You can use [the Sass migrator] to automatically update your stylesheets to add
a space after any `-` or `+` operators that need it, which will preserve the
existing behavior of these stylesheets.

[the Sass migrator]: https://github.com/sass/migrator#readme

```shellsession
$ npm install -g sass-migrator
$ sass-migrator strict-unary **/*.scss
```

{% render 'silencing_deprecations' %}

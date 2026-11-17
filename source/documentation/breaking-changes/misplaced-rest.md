---
title: 'Breaking Change: Misplaced Rest Arguments'
introduction: >
  Sass has historically allowed rest arguments to appear anywhere in an
  argument list, even though they're always evaluated at the end. That loophole
  is now closed: Sass requires rest arguments to appear at the end of argument
  lists.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

{% codeExample 'misplaced-rest' %}
  .sidebar {
    color: rgb([255, 0]..., 63);
  }
  ===
  .sidebar
    color: rgb([255, 0]..., 63)
{% endcodeExample %}

To fix any violations and preserve the older behavior, just move the rest
argument to the end of the argument list. You might want to check to make sure
that you weren't expecting it to do something different than it actually does
when you first wrote the code, though!

## Historical Behavior

[Rest arguments] in Sass (written `$args...`) were always intended to be written
at the end of argument lists. The way they're evaluated reflects this: they're
always run after all the other arguments, and they're always added to the end of
the list of positional arguments.

[Rest arguments]: https://sass-lang.com/documentation/at-rules/function/#taking-arbitrary-arguments

However, due to an oversight in the implementation of both Ruby Sass and Dart
Sass, this was never enforced. It was possible to write a function call like
`rgb([1, 2]..., 3)` with the rest argument before a positional (or named)
argument. This didn't work how it looks, though: it was parsed the same as
`rgb(3, [1, 2]...)` and resulted in the color value `rgb(3, 1, 2)`. This
behavior was deprecated in Dart Sass 1.91.0.

{% codeExample 'misplaced-rest-before' %}
  .sidebar {
    color: rgb([255, 0]..., 63);
  }
  ===
  .sidebar
    color: rgb([255, 0]..., 63)
  ===
  .sidebar {
    color: rgb(63, 255, 0);
  }
{% endcodeExample %}

{% funFact %}
  Parameter declarations in the `@function` and `@mixin` rules have *always*
  required rest parameters to appear at the end. They aren't affected by this
  breaking change.
{% endfunFact %}

{% render 'silencing_deprecations' %}

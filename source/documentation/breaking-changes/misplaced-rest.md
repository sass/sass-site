---
title: 'Breaking Change: Misplaced Rest Arguments'
introduction: >
  Sass has historically allowed rest arguments to appear anywhere in an
  argument list, even though they're always evaluated at the end. This closes
  that loophole and requires rest arguments to appear at the end of argument
  lists.
---

{% compatibility 'dart: "1.91.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

[Rest arguments] in Sass (written `$args...`) were always intended to be written
at the end of argument lists. The way they're evaluated reflects this: they're
always run after all the other arguments, and they're always added to the end of
the list of positional arguments.

[Rest arguments]: https://sass-lang.com/documentation/at-rules/function/#taking-arbitrary-arguments

However, due to an oversight in the implementation of both Ruby Sass and Dart
Sass, this was never enforced. It was possible to write a function call like
`rgb([1, 2]..., 3)` with the rest argument before a positional (or named)
argument. This didn't work how it looks, though: it was parsed the same as
`rgb(3, [1, 2]...)` and resulted in the color value `rgb(3, 1, 2)`.

{% funFact %}
  Note that parameter declarations in the `@function` and `@mixin` rules have
  *always* required rest parameters to appear at the end. They aren't affected
  by this deprecation.
{% endfunFact %}

To eliminate this confusion and potentially open a path towards supporting more
sensible behavior for rest arguments in the future, we're making changes in
multiple phases:

### Phase 1

{% compatibility 'dart: "1.91.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Dart Sass emits a deprecation warning if you use a rest argument
anywhere other than at the end of an argument list.

To fix any violations and preserve the existing behavior, just move the rest
argument to the end of the argument list. You might want to check to make sure
that you weren't expecting it to do something different than it actually does
when you first wrote the code, though!

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, using a rest argument anywhere other than at the end of an
argument list will be a syntax error.

{% render 'silencing_deprecations' %}

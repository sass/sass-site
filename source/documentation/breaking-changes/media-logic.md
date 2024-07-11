---
title: 'Breaking Change: Media Queries Level 4'
introduction: >
  Sass has added support for the CSS Media Queries Level 4 specification. This
  originally conflicted with some Sass-specific syntax, so this syntax was
  deprecated and is now interpreted according to the CSS standard.
---

{% compatibility 'dart: "1.56.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Because Sass supports almost any Sass expression in parenthesized media
conditions, there were a few constructs whose meaning was changed by adding full
support for Media Queries Level 4. Specifically:

- `@media (not (foo))` was historically interpreted by Sass as meaning
  `@media (#{not (foo)})`, and so compiled to `@media (false)`.

- `@media ((foo) and (bar))` and `@media ((foo) or (bar))` were similarly
  interpreted as SassScript's logical operators, compiling to `@media (bar)` and
  `@media (foo)` respectively.

Fortunately, these came up very infrequently in practice.

## Transition Period

{% compatibility 'dart: "1.54.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

First, we emitted deprecation warnings for the previous ambiguous cases. These
will have suggestions for how to preserve the existing behavior or how to use
the new CSS syntax.

{% render 'silencing_deprecations' %}

---
title: "Breaking Change: Functions and Mixins Beginning with --"
introduction: |
  Prior to Dart Sass 1.76.0, function and mixin names could be any valid CSS
  identifier, but identifiers beginning with `--` are now deprecated.
---

Generally, Sass allows any valid CSS identifier to be used for any Sass
definition. This includes identifiers which begin with `--`, which users may be
most familiar with in the context of [CSS custom properties]. However, the CSS
working group is [seriously considering] adding built-in support to CSS itself
for functions and mixins, likely using at-rules named `@mixin` and `@function`
just like Sass.

[CSS custom properties]: https://www.w3.org/TR/css-variables-1/
[seriously considering]: https://github.com/w3c/csswg-drafts/issues/9350

This means that Sass, in order to preserve its core design principle of CSS
compatibility while still supporting Sass's build-time functions and mixins,
needs to be able to distinguish between CSS and Sass declarations that use the
same at-rule names. Fortunately, although the details of the syntax CSS uses for
functions and mixins is still very much up in the air, one point seems
uncontroversial: the use of custom-property-like identifiers beginning with `--`
for CSS mixin and function names.

This will allow Sass to distinguish plain-CSS functions and mixins as those that
begin with `--`. But in order for this to work, we first have to disallow Sass
functions and mixins from using that prefix.

## Transition Period

{% compatibility 'dart: "1.76.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Between Dart Sass 1.76.0 and Dart Sass 2.0.0, Dart Sass will continue to allow
functions and mixins whose names begin with `--`. However, it will emit a
deprecation warning named `css-function-mixin`.

Between Dart Sass 2.0.0 and the release of Dart Sass's support for plain CSS
functions and mixins, functions and mixins will not be allowed to have names
that begin with `--`.

{% render 'silencing_deprecations' %}

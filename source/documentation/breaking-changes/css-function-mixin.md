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

### Phase 1: Deprecation

{% compatibility 'dart: "1.76.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Between Dart Sass 1.76.0 and Dart Sass 1.94.0, Dart Sass continued to allow
functions and mixins whose names begin with `--`. However, it emitted a
deprecation warning named `css-function-mixin`.

### Phase 2: Plain-CSS Functions

{% compatibility 'dart: "1.94.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Dart 1.94.0 added support for plain-CSS functions, since they landed in Chrome
shortly beforehand. Any function whose name begins with `--` is now parsed as a
plain-CSS at-rule, and its `result` property is parsed the same as a custom
property value.

In phase 2, mixins whose names begin with `--` were upgraded from deprecations
to errors.

{% render 'silencing_deprecations' %}

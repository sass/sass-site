---
title: "Breaking Change: Custom Identifier Functions and Mixins"
introduction: Function and mixin names starting with `--` are forbidden.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Generally, Sass allows any valid CSS identifier to be used for any Sass
definition. This includes identifiers which begin with `--`, which users may be
most familiar with in the context of [CSS custom properties]. However, the CSS
working group [added built-in support] to CSS itself for functions and mixins
using at-rules named `@mixin` and `@function` just like Sass. (We're honored to
be such an inspiration!)

[CSS custom properties]: https://www.w3.org/TR/css-variables-1/
[added built-in support]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Custom_functions_and_mixins

This means that Sass, in order to preserve its core design principle of CSS
compatibility while still supporting Sass's build-time functions and mixins,
needs to be able to distinguish between CSS and Sass declarations that use the
same at-rule names. Fortunately, they're easy to tell apart: CSS function and
mixin names have to start with `--`, just like custom properties.

To ensure that Sass functions and mixins aren't ambiguous with their CSS
counterparts, names that start with `--` are now reserved for plain CSS. For
`@function`, that means that the rule will be passed right through to CSS:

{% codeExample 'custom-identifier-function' %}
  @function --transparent(--color, --alpha) {
    result: oklch(from var(--color) l c h / var(--alpha));
  }
  ===
  @function --transparent(--color, --alpha)
    result: oklch(from var(--color) l c h / var(--alpha))
{% endcodeExample %}

For mixins, names that begin with `--` are an error. It's Sass policy not to add
support for a new CSS feature until it lands in at least one browser, and mixins
aren't there quite yet.

{% codeExample 'custom-identifier-mixin' %}
  @mixin --error() {
    color: red;
  }
  ===
  @mixin --error()
    color: red
{% endcodeExample %}

## Historical Behavior

Historically, Sass allowed functions and mixins to use names that  began
with `--` (although these were still [private] in the module system).

{% codeExample 'custom-identifier-function-mixin-old' %}
  @use 'sass:color';

  @function --transparent($color, $alpha) {
    @return color.change($color, $alpha: $alpha);
  }

  @mixin --error() {
    background-color: --transparent(red, 0.3);
  }

  .sidebar {
    @include --error;
  }
  ===
  @use 'sass:color'

  @function --transparent($color, $alpha)
    @return color.change($color, $alpha: $alpha)


  @mixin --error()
    background-color: --transparent(red, 0.3)


  .sidebar
    @include --error
  ===
  .sidebar {
    background-color: rgba(255, 0, 0, 0.3);
  }
{% endcodeExample %}

{% compatibility 'dart: "1.76.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Dart Sass 1.76.0, Dart Sass emitted the `css-function-mixin`
deprecation warning for both functions and mixins beginning with `--`.

[private]: /documentation/at-rules/use/#private-members

{% compatibility 'dart: "1.94.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Dart Sass 1.94.0, plain-CSS functions were parsed as generic
at-rules but mixins whose names began with `--` were still just deprecated.

{% codeExample 'custom-identifier-function-phase-2' %}
  @function --transparent(--color, --alpha) {
    result: oklch(from var(--color) l c h / var(--alpha));
  }
  ===
  @function --transparent(--color, --alpha)
    result: oklch(from var(--color) l c h / var(--alpha))
{% endcodeExample %}

{% render 'silencing_deprecations' %}

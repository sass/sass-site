---
title: Syntax
introduction: >
  Sass supports two different syntaxes. Each one can load the other, so it's
  up to you and your team which one to choose.
---

## SCSS

The SCSS syntax uses the file extension `.scss`. With a few small exceptions,
it's a superset of CSS, which means essentially **all valid CSS is valid SCSS as
well**. Because of its similarity to CSS, it's the easiest syntax to get used to
and the most popular.

SCSS looks like this:

```scss
@mixin button-base() {
  @include typography(button);
  @include ripple-surface;
  @include ripple-radius-bounded;

  display: inline-flex;
  position: relative;
  height: $button-height;
  border: none;
  vertical-align: middle;

  &:hover {
    cursor: pointer;
  }

  &:disabled {
    color: $mdc-button-disabled-ink-color;
    cursor: default;
    pointer-events: none;
  }
}
```

## The Indented Syntax

The indented syntax was Sass's original syntax, so it uses the file
extension `.sass`. Because of this extension, it's sometimes just called "Sass".
The indented syntax supports all the same features as SCSS, but it uses
indentation instead of curly braces and semicolons to describe the format of the
document.

In general, any time you'd write curly braces in CSS or SCSS, you can just
indent one level deeper in the indented syntax. And any time a line ends, that
counts as a semicolon. There are also a few additional differences in the
indented syntax that are noted throughout the reference.

{% headsUp %}
  The indented syntax currently doesn't support expressions that wrap across
  multiple lines. See [issue #216].

  [issue #216]: https://github.com/sass/sass/issues/216
{% endheadsUp %}

The indented syntax looks like this:

```sass
@mixin button-base()
  @include typography(button)
  @include ripple-surface
  @include ripple-radius-bounded

  display: inline-flex
  position: relative
  height: $button-height
  border: none
  vertical-align: middle

  &:hover
    cursor: pointer

  &:disabled
    color: $mdc-button-disabled-ink-color
    cursor: default
    pointer-events: none
```

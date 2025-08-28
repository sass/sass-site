---
title: 'Breaking Change: type() function'
introduction: >
  CSS has added a `type()` function with unique syntax. In order to support
  flexible syntax for this function, user-defined functions named `type()` are
  no longer allowed.
---

CSS Values and Units 5 defines [a `type()` function] for use in the `attr()`
function. This function defines the syntax to use when parsing an HTML attribute
as a CSS value, so for example `attr(data-count type(<number>))` would return
the value of the `data-count` attribute as a CSS number. Although it's currently
only defined in a working draft, Chrome already supports the `type()` function
so Sass is adding support as well.

[a `type()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/attr#attr-type

## Deprecation

{% compatibility 'dart: "1.86.7"', 'libsass: false', 'ruby: false' %}
{% endcompatibility %}

Because the `type()` function doesn't follow the normal conventions for CSS
expression syntax, Sass will need to parse it as a [special function] like
`url()` or `element()`. Because this represents a breaking change for any
existing Sass code that defined functions named `type()`, Sass 1.86.0 deprecated
the ability to define functions with this name.

[special function]: /documentation/syntax/special-functions/

{% render 'silencing_deprecations' %}

## Breaking Change

{% compatibility 'dart: "1.92.0"', 'libsass: false', 'ruby: false' %}
{% endcompatibility %}

Modern versions of Sass support the `type()` function as a [special function],
meaning that it's parsed as a type of unquoted string which allows unusual
syntax like `type(<custom-ident>)`. Sass `@function` rules are no longer allowed
to define functions named `type`.

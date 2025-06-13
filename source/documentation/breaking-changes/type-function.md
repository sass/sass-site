---
title: 'Breaking Change: type() function'
introduction: >
  CSS has added a `type()` function with unique syntax. In order to support
  flexible syntax for this function, user-defined functions named `type()` are
  deprecated.
---

CSS Values and Units 5 defines [a `type()` function] for use in the `attr()`
function. This function defines the syntax to use when parsing an HTML attribute
as a CSS value, so for example `attr(data-count type(<number>))` would return
the value of the `data-count` attribute as a CSS number. Although it's currently
only defined in a working draft, Chrome already supports the `type()` function
so Sass is adding support as well.

[a `type()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/attr#attr-type

Because the `type()` function doesn't follow the normal conventions for CSS
expression syntax, Sass will need to parse it as a [special function] like
`url()` or `element()`. Because this represents a breaking change for any
existing Sass code that defined functions named `type()`, as of Sass 1.86.0 we
are deprecating the ability to define functions with this name. Once this
deprecation has been in place for at least three months, we'll release a version
of Sass that parses `type()` as a special function instead.

[special function]: /documentation/syntax/special-functions/

{% render 'silencing_deprecations' %}

---
title: Values
introduction: >
  Sass supports a number of value types, most of which come straight from CSS.
  Every [expression](/documentation/syntax/structure#expressions) produces a
  value, [variables](/documentation/variables) hold values. Most value types
  come straight from CSS:
---

* [Numbers](/documentation/values/numbers), which may or may not have units,
  like `12` or `100px`.

* [Strings](/documentation/values/strings), which may or may not have quotes,
  like `"Helvetica Neue"` or `bold`.

* [Colors](/documentation/values/colors), which can be referred to by their hex
  representation or by name, like `#c6538c` or `blue`, or returned from
  functions, like `rgb(107, 113, 127)` or `hsl(210, 100%, 20%)`.

* [Lists of values](/documentation/values/lists), which may be separated by
  spaces or commas and which may be enclosed in square brackets or no brackets
  at all, like `1.5em 1em 0 2em`, `Helvetica, Arial, sans-serif`, or
  `[col1-start]`.

A few more are specific to Sass:

* The [boolean](/documentation/values/booleans) values `true` and `false`.

* The singleton [`null`](/documentation/values/null) value.

* [Maps](/documentation/values/maps) that associate values with keys, like
  `("background": red, "foreground": pink)`.

* [Function references](/documentation/values/functions) returned by
  [`get-function()`][] and called with [`call()`][].

  [`get-function()`]: /documentation/modules/meta#get-function
  [`call()`]: /documentation/modules/meta#call

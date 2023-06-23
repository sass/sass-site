---
title: "Request for Comments: First-Class Calc"
author: Natalie Weizenbaum
date: 2021-3-15 1:35:00 -8
---

One of the absolutely most-requested features in Sass is the ability to more
easily work with `calc()` expressions. These expressions have historically been
parsed opaquely: between the parentheses, you can put any text at all, and
Sass will just treat it as an unquoted string. This has simplified Sass's
parser, since we don't have to support the specific `calc()` microsyntax, and
it's meant that we automatically support new features like the use of [CSS
variables] within `calc()`.

[CSS variables]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

However, it comes at a substantial usability cost as well. Because each `calc()`
is totally opaque to Sass's parser, users can't simply use Sass variables in
place of values; they have to [interpolate] variables explicitly. And once a
`calc()` expression has been created, there's no way to manipulate it with Sass
the way you can manipulate a plain number.

[interpolate]: /documentation/interpolation

We're looking to change that with a new proposal we call "First-Class Calc".
This proposal changes `calc()` (and other supported mathematical functions) from
being parsed as unquoted strings to being parsed in-depth, and sometimes
(although not always) producing a new data type known as a "calculation". This
data type represents mathematical expressions that can't be resolved at
compile-time, such as `calc(10% + 5px)`, and allows those expressions to be
combined gracefully within further mathematical functions.

To be more specific: a `calc()` expression will be parsed according to the [CSS
syntax], with additional support for Sass variables, functions, and (for
backwards compatibility) interpolation. Sass will perform as much math as
possible at compile-time, and if the result is a single number it will return it
as a normal Sass number type. Otherwise, it will return a calculation that
represents the (simplified) expression that can be resolved in the browser.

[CSS syntax]: https://drafts.csswg.org/css-values-3/#calc-syntax

For example:

* `calc(1px + 10px)` will return the number `11px`.

* Similarly, if `$length` is `10px`, `calc(1px + $length)` will return `11px`.

* However, `calc(1px + 10%)` will return the calc `calc(1px + 10%)`.

* If `$length` is `calc(1px + 10%)`, `calc(1px + $length)` will return
  `calc(2px + 10%)`.

* Sass functions can be used directly in `calc()`, so `calc(1% +
  math.round(15.3px))` returns `calc(1% + 15px)`.

Note that calculations cannot generally be used in place of numbers. For
example, `1px + calc(1px + 10%)` will produce an error, as will
`math.round(calc(1px + 10%))`. This is because calculations can't be used
interchangeably with numbers (you can't pass a calculation to `math.sqrt()`), so
we want to make sure mathematical functions are explicit about whether or not
they support calculations by either wrapping all of their math in `calc()` or
using normal Sass arithmetic.

For backwards compatibility, `calc()` expressions that contain interpolation
will continue to be parsed using the old highly-permissive syntax, although this
behavior will eventually be deprecated and removed. These expressions will still
return calculation values, but they'll never be simplified or resolve to plain
numbers.

## Let us know what you think!

If you're interested in learning more about this proposal, [read it in full] on
GitHub. It's open for comments and revisions for the next month, so if you'd
like to see something change please [file an issue] and we can discuss it!

[read it in full]: https://github.com/sass/sass/blob/main/accepted/first-class-calc.md
[file an issue]: https://github.com/sass/sass/issues/new

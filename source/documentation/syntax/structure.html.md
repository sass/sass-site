---
title: Structure of a Stylesheet
---

Just like CSS, most Sass stylesheets are mainly made up of style rules that
contain property declarations. But Sass stylesheets have many more features that
can exist alongside these.

## Statements

A Sass stylesheet is made up of a series of *statements*, which are evaluated in
order to build the resulting CSS. Some statements may have *blocks*, defined
using `{` and `}`, which contain other statements. For example, a style rule is
a statement with a block. That block contains other statements, such as property
declarations.

In SCSS, statements are separated by semicolons (which are optional if the
statement uses a block). In the indented syntax, they're just separated by
newlines.

### Universal Statements

These types of statements can be used anywhere in a Sass stylesheet:

* [Variable declarations](../variables), like `$var: value`.
* [Control at-rules](../at-rules/control), like `@if` and `@each`.
* The [`@error`](../at-rules/error), [`@warn`](../at-rules/warn), and
  [`@debug`](../at-rules/debug) rules.

### CSS Statements

These statements produce CSS. They can be used anywhere except within a
`@function`:

* [Style rules](../style-rules), like `h1 { /* ... */ }`.
* [CSS at-rules](../at-rules/css), like `@media` and `@font-face`.
* [Mixin uses](../at-rules/mixin) using `@include`.
* The [`@at-root`](../at-rules/at-root) rule.

### Top-Level Statements

These statements can only be used at the top level of a stylesheet, or nested
within a CSS statement at the top level:

* [Imports](../at-rules/import), using `@import`.
* [Mixin definitions](../at-rules/mixin) using `@mixin`.
* [Function definitions](../at-rules/function) using `@function`.

### Other Statements

* [Property declarations](../declarations) like `width: 100px` may only be used
  within style rules and some CSS at-rules.
* The [`@extend`](../at-rules/extend) rule may only be used within style rules.

## Expressions

An *expression* is anything that goes on the right-hand side of a property or
variable declaration. Each expression produces a *[value][]*. Any valid CSS property
value is also a Sass expression, but Sass expressions are much more powerful
than plain CSS values. They're passed as arguments to [mixins][] and
[functions][], used for control flow with [`@if`][], and manipulated using
[arithmetic][]. We call Sass's expression syntax *SassScript*.

[value]: ../values
[mixins]: ../at-rules/mixin
[functions]: ../at-rules/function
[`@if`]: ../at-rules/if
[arithmetic]: ../operators/numeric

### Literals

The simplest expressions just represent static values:

* [Numbers](../values/numbers), which may or may not have units, like `12` or
  `100px`.
* [Strings](../values/strings), which may or may not have quotes, like
  `"Helvetica Neue"` or `bold`.
* [Colors](../values/colors), which can be referred to by their hex
  representation or by name, like `#c6538c` or `blue`.
* The [boolean](../values/booleans) literals `true` or `false`.
* The singleton [`null`](../values/null).
* [Lists of values](../values/lists), which may be separated by spaces or commas
  and which may be enclosed in square brackets or no brackets at all, like
  `1.5em 1em 0 2em` or `Helvetica, Arial, sans-serif`.
* [Maps](../values/maps) that associate values with keys, like
  `("background": red, "foreground": pink)`.

### Operations

Sass defines syntax for a number of operations:

* [`==` and `!=`](../operators/equality) are used to check if two values are the
  same.
* [`+`, `-`, `*`, `/`, and `%`](../operators/numeric) have their usual
  mathematical meaning for numbers, with special behaviors for units that
  matches the use of units in scientific math.
* [`<`, `<=`, `>`, and `>=`](../operators/relational) check whether two numbers
  are greater or less than one another.
* [`and`, `or`, and `not`](../operators/boolean) have the usual boolean
  behavior. Sass considers every value "true" except for `false` and `null`.
* [`+`, `-`, and `/`](../operators/string) can be used to concatenate strings.
* [`(` and `)`](../operators#parentheses) can be used to explicitly control the
  precedence order of operations.

### Other Expressions

* [Variables](../variables), like `$var`.
* [Function calls](../at-rules/function), like `nth($list, 1)` or
  `var(--main-bg-color)`, which may call Sass core library functions or
  user-defined functions, or which may be compiled directly to CSS.
* [Special functions](special-functions), like `calc(1px + 100%)` or
  `url(http://myapp.com/assets/logo.png)`, that have their own unique parsing
  rules.
* [The parent selector](../parent-selector), `&`.
* The value `!important`, which is parsed as an unquoted string.

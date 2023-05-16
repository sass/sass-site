---
title: Structure of a Stylesheet
table_of_contents: true
introduction: >
  Just like CSS, most Sass stylesheets are mainly made up of style rules that
  contain property declarations. But Sass stylesheets have many more features
  that can exist alongside these.
complementary_content: |
  <nav aria-labelledby="page-sections" class="page-sections sl-c-list-navigation-wrapper sl-c-list-navigation-wrapper--collapsible">

  ### Page Sections{#page-sections}

  - [Statements](#statements){.section}
    - [Overview](#statements)
    - [Universal Statements](#universal-statements)
    - [CSS Statements](#css-statements)
    - [Top-Level Statements](#top-level-statements)
    - [Other Statements](#other-statements)
  - [Expressions](#expressions){.section}
    - [Overview](#expressions)
    - [Literals](#literals)
    - [Operations](#operations)
    - [Other Expressions](#other-expressions)

  </nav>
---

## Statements

A Sass stylesheet is made up of a series of _statements_, which are evaluated in
order to build the resulting CSS. Some statements may have _blocks_, defined
using `{` and `}`, which contain other statements. For example, a style rule is
a statement with a block. That block contains other statements, such as property
declarations.

In SCSS, statements are separated by semicolons (which are optional if the
statement uses a block). In the indented syntax, they're just separated by
newlines.

### Universal Statements

These types of statements can be used anywhere in a Sass stylesheet:

- [Variable declarations](../../variables), like `$var: value`.
- [Flow control at-rules](../../at-rules/control), like `@if` and `@each`.
- The [`@error`](../../at-rules/error), [`@warn`](../../at-rules/warn), and
  [`@debug`](../../at-rules/debug) rules.

### CSS Statements

These statements produce CSS. They can be used anywhere except within a
`@function`:

- [Style rules](../../style-rules), like `h1 { /* ... */ }`.
- [CSS at-rules](../../at-rules/css), like `@media` and `@font-face`.
- [Mixin uses](../../at-rules/mixin) using `@include`.
- The [`@at-root` rule](../../at-rules/at-root).

### Top-Level Statements

These statements can only be used at the top level of a stylesheet, or nested
within a CSS statement at the top level:

- [Module loads](../../at-rules/use), using `@use`.
- [Imports](../../at-rules/import), using `@import`.
- [Mixin definitions](../../at-rules/mixin) using `@mixin`.
- [Function definitions](../../at-rules/function) using `@function`.

### Other Statements

- [Property declarations](../../style-rules/declarations) like `width: 100px` may
  only be used within style rules and some CSS at-rules.
- The [`@extend` rule](../../at-rules/extend) may only be used within style rules.

## Expressions

An _expression_ is anything that goes on the right-hand side of a property or
variable declaration. Each expression produces a _[value][]_. Any valid CSS property
value is also a Sass expression, but Sass expressions are much more powerful
than plain CSS values. They're passed as arguments to [mixins][] and
[functions][], used for control flow with the [`@if` rule][], and manipulated using
[arithmetic][]. We call Sass's expression syntax _SassScript_.

[value]: ../../values
[mixins]: ../../at-rules/mixin
[functions]: ../../at-rules/function
[`@if` rule]: ../../at-rules/control/if
[arithmetic]: ../../operators/numeric

### Literals

The simplest expressions just represent static values:

- [Numbers](../../values/numbers), which may or may not have units, like `12` or
  `100px`.
- [Strings](../../values/strings), which may or may not have quotes, like
  `"Helvetica Neue"` or `bold`.
- [Colors](../../values/colors), which can be referred to by their hex
  representation or by name, like `#c6538c` or `blue`.
- The [boolean](../../values/booleans) literals `true` or `false`.
- The singleton [`null`](../../values/null).
- [Lists of values](../../values/lists), which may be separated by spaces or commas
  and which may be enclosed in square brackets or no brackets at all, like
  `1.5em 1em 0 2em`, `Helvetica, Arial, sans-serif`, or `[col1-start]`.
- [Maps](../../values/maps) that associate values with keys, like
  `("background": red, "foreground": pink)`.

### Operations

Sass defines syntax for a number of operations:

{% render 'documentation/snippets/operator-list', parens:true %}

### Other Expressions

- [Variables](../../variables), like `$var`.
- [Function calls](../../at-rules/function), like `nth($list, 1)` or
  `var(--main-bg-color)`, which may call Sass core library functions or
  user-defined functions, or which may be compiled directly to CSS.
- [Special functions](special-functions), like `calc(1px + 100%)` or
  `url(http://myapp.com/assets/logo.png)`, that have their own unique parsing
  rules.
- [The parent selector](../../style-rules/parent-selector), `&`.
- The value `!important`, which is parsed as an unquoted string.

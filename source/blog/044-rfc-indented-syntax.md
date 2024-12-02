---
title: "Request for Comments: Indented Syntax Improvements"
author: James Stuckey Weber
date: 2024-12-02 15:30:00 -8
---

For users of the indented syntax (`.sass`), there has been a long standing
request for the ability to have line breaks that don't end a statement. Certain
CSS syntaxes like `grid-template` and `@font-face` `src` declarations are long,
and line breaks can greatly increase the readability of the styles. 

There have been many suggestions, several attempts, and numerous workarounds to
address this pain point. We are proposing several new syntax options in the
indented syntax that add considerable flexibility and look to address this as
part of the language.

## The new syntax

Instead of adding syntax that is completely new to Sass, we propose to borrow
syntax from the SCSS format and make it available in the indented syntax. This
reduces the learning curve, code complexity, and likelihood of future conflicts
with new CSS features.

A common way of using this syntax will be wrapping lists with line breaks in
parentheses. This allows for a grid-template declaration on multiple lines.

```sass
.grid
  display: grid
  grid-template: (
    "header" min-content
    "main" 1fr
  )
}
```

These parentheses will not be included in the output.

```css
.grid {
  display: grid;
  grid-template: "header" min-content "main" 1fr;
}
```

Powering this change is the underlying rule that linebreaks only end statements
in places where statements can end. Anywhere where a statement can't end, a
linebreak is treated as whitespace. This means that if the parser can't tell
whether or not a linebreak is intended to end a statement, it will end the
statement.

This example demonstrates several places where line breaks will be possible.

```sass
@each $item in /* A statement can't end after the word "in" in an `@each` statement. */
    1, 2, 3
  .item-#{ 
    $item /* A statement can't end inside the curly braces in an interpolation. */
  }
    content: $item * /* A statement can't end after a multiplication operator. */
        10
```


As a counter example, here are some places in the same stylesheet where
linebreaks could end statements, so linebreaks will cause compilation errors.

> **Important! This code snippet demonstrates what will NOT work.**

```sass
@each $item in 1, /* A statement can end after a value, even in the middle of a list. */
     2, 3
  .item-#{ $item }
    content: $item /* A statement can end after a value, and does not look ahead for operators. */
      * 10
```

## SCSS-in-Sass

We are also proposing a new block-level opt-in to the SCSS format. One 
workaround for not having multiline statements has been to author some styles in
separate SCSS files, and this provides an inline alternative.

To opt in to the SCSS format for a block, you simply need
to wrap the block inside of curly braces. 

```sass
a
  color: blue

// Opt in to SCSS format for this rule
p {
  padding: 
    var(--top-padding, 1em)
    var(--right-padding, 2em)
    var(--bottom-padding, 1em)
    var(--left-padding, 1.5em);
  color: red;
}

// Back to indented syntax
strong
  font:
    weight: bold
```

## Semicolons are also allowed

Another proposed change would allow semicolons to optionally be added at the end
of statements in the indented syntax. Indentation rules still apply, so you
won't be able to separate multiple statements on the same line, even with a
semicolon (unless you're in a [SCSS-in-Sass](#scss-in-sass) block).

## No breaking changes

These changes are opt-in, so authors who don't want to use the new syntax do not
have to make any changes or learn new syntax. No changes need to be made to
existing stylesheets written in the Indented Syntax.

## Next steps

This is still in the proposal phase, and we are open to feedback. Review the
proposal [on
Github](https://github.com/sass/sass/blob/main/proposal/indented-syntax-improvements.md),
and [open an issue](https://github.com/sass/sass/issues/new) with any thoughts
or concerns you may have.

In addition to feedback from authors using the indented syntax, we are also
interested in hearing from maintainers of tooling that supports the indented
syntax.

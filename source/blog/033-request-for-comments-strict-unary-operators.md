---
title: "Request for Comments: Strict Unary Operators"
author: Natalie Weizenbaum
date: 2022-06-15 15:30:00 -8
---

Do you know what `margin: $a -$b` does in Sass? If you said "the same thing as
`margin: $a (-$b)`, I'm sorry, but you're wrong. It's *actually* the same thing
as `margin: $a - $b`. Don't worry, you're not the first person to get tripped up
by this weird corner of Sass's parser! But our new language proposal aims to fix
that.

In the [Strict Unary Operators] proposal, which is currently open for community
feedback, we propose to first deprecate and then eventually disallow expressions
of the form `$a -$b`. We know deprecations are never pleasant, but this should
be fairly painless as they go: you can simply write `$a - $b` or `$a (-$b)`,
depending which you intend. We'll also provide a [Sass migrator] migration to
automatically update your stylesheets.

[strict unary operators]: https://github.com/sass/sass/blob/main/proposal/strict-unary.md
[Sass migrator]: /documentation/cli/migrator

**Deprecated:**

* `$a -$b` will no longer be allowed, because it's unclear what the author
  intended and the current behavior is likely to be incorrect.

**Still allowed:**

* `$a - $b` will continue to work, since it's clearly supposed to indicate
  subtraction.

* `$a (-$b)` will continue to work, since the parentheses make the unary minus
  unambiguous.

The `$a - $b` or `$a (-$b)` options are supported by all widely-used Sass
versions, so there shouldn't be any trouble for libraries to avoid this
deprecation warning and continue to support older Sass versions. In addition,
you can always use the [`--quiet-deps` command-line flag] or the [`quietDeps` JS
API option] to silence warnings from dependencies you don't control.

[`--quiet-deps` command-line flag]: /documentation/cli/dart-sass/#quiet-deps
[`quietDeps` JS API option]: /documentation/js-api/interfaces/Options#quietDeps

## Why does it work this way?

Why, you might wonder, does `$a -$b` parse this way in the first place? The
short answer is, "because other programming languages do it that way". In most
programming languages, operators are parsed the same way regardless of the
whitespace that may or may not surround them. If you parse `$a - $b` as
subtraction, you should parse `$a -$b` as subtraction as well.

The problem for Sass is that we also inherit CSS's use of space-separated lists
of values, so in some contexts users expect to be able to write two expressions
next to one another and have them parse the same way they would if they were
each used on their own. These two principles come into conflict and produce the
confusion this proposal seeks to address.

## Why not just change the way it works?

In theory, we could change Sass so that `$a -$b` parses the same as `$a (-$b)`:
a space-separated list of two values, the latter with a unary minus. We chose
not to do that for two reasons:

1. Pragmatically, it's more painful to make a breaking change that changes the
   behavior of existing syntax than it is to make one that just forbids the
   syntax entirely. It requires more releases and more different versions of
   Sass with different behaviors. It also opens the door for a stylesheet that
   upgrades many versions at once to switch to the new behavior *without
   producing an error*, which could lead to the worst-case scenario: shipping
   incorrect styles.

2. It's not obvious that `$a -$b` *should* parse as `$a (-$b)` in every case.
   Users coming from other programming languages may expect it to parse the same
   way it does in those languages. Even in Sass, `$a -$b` will continue to be a
   valid binary operation within `calc()`. It may not be elegant style, but
   sometimes formatting isn't at the top of an author's mind!

## Let us know what you think!

If you've got thoughts or opinions about this change, please read over [the full
proposal] and then [file an issue] with your feedback. We'll be leaving this
open to comments for a month, after which we'll finalize the proposal and start
implementing it.

[the full proposal]: https://github.com/sass/sass/blob/main/proposal/strict-unary.md
[file an issue]: https://github.com/sass/sass/issues/new

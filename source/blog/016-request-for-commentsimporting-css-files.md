---
title: "Request For Comments: Importing CSS Files"
author: Natalie Weizenbaum
date: 2018-07-09 11:19:00 -8
---

As Dart Sass catches up with Ruby Sass in terms of usability, we're starting
work on adding new features to the language. The first feature we're looking at
is one that's long been requested by users: adding support for importing plain
CSS files without having to rename them to `.scss`. Not only do we expect this
to be very useful, it's already partially implemented in LibSass, so this will
help bring the implementations more in line with one another.

We're also trying out a new process with this feature. In order to help keep the
behavior of different implementations in sync, we're starting with a prose
specification of the feature before moving on to writing code. We're also taking
this as an opportunity to solicit feedback from you, the Sass community! We want
to hear your thoughts on the new feature while we have a chance to revise it
based on that feedback.

## Background

Historically, the reference implementations of Sass—first Ruby Sass, then Dart
Sass—only supported importing other Sass files. However, LibSass supported
importing CSS files as well, interpreting them as though they were SCSS.
Although this technically violated the [implementation guide][]'s prohibition on
unilaterally extending the language, these CSS imports were useful and were
widely adopted in the Node.js community.

[implementation guide]: /implementation

This became particularly clear when, at the language team's urging, LibSass
added [deprecation warnings][libsass#2611] for CSS imports and users were left
without a suitable replacement. The language team came together to discuss the
problem, and decided to move towards allowing CSS imports but forbidding the use
of non-CSS features in the imported files. The proposal describes the specifics
of that idea.

[libsass#2611]: https://github.com/sass/libsass/issues/2611

LibSass's behavior at time of writing is to import files with the extension
`.css` at the same precedence level as those with the `.scss` and `.sass`
extensions, and to throw an error if an import is ambiguous between a `.css`
file and a `.scss` or `.sass` file.

## Summary

The proposal seeks to strike a balance between preserving compatibility with
LibSass's existing behavior and moving towards a more principled scheme for
loading CSS. This is particularly important as we intend to allow `@use` to load
CSS files without Sass features, so we want the existing CSS loading support to
be as similar as possible.

Locating CSS files for import works similarly under the proposal as it does in
LibSass currently: a relative `.css` file takes precedence over files with any
extension on the load path, a `.css` file earlier on the load path takes
precedence over a file with any extension later on the load path, and `foo.css`
takes precedence over `index/foo.scss`.

The only difference in loading scheme occurs when an import is ambiguous between
a `.css` file and a `.scss` or `.sass` file at the same path. LibSass currently
produces an error here, but in order to maximize compatibility with existing
Dart Sass (and Ruby Sass) behavior, the proposal has the `.scss` or `.sass` file
taking precedence. This is not a breaking change to LibSass's behavior, since it
only applies in situations that would previously have produced an error.

The proposal diverges significantly from LibSass in parsing the imported CSS
files, though: it forbids all use of SCSS features in the parsed files. Most
SCSS features produce errors (rather than compiling to plain, likely-invalid
CSS) in order to help users who accidentally wrote SCSS in their CSS realize
what's going wrong. However, features like `@import` that overlap with plain CSS
continue to be rendered as CSS.

In order to avoid a sudden backwards-incompatible change in LibSass, this also
includes a proposal for a set of deprecation warnings that can be added to
LibSass's existing behavior to steer users away from using Sass features in
their imported CSS without entirely breaking their build process.

## Giving Feedback

If you want more details on exactly how the proposed behavior will work, [head
over to the `sass/language` repo and read the full
proposal](https://github.com/sass/language/blob/main/accepted/css-imports.md).
You can skip the Background and Summary sections, since they're included above.
Be aware, though, that it's written to be a specification; it's a great for
figuring out how exactly an edge case should work, but it's not as
conversational as the sections quoted above.

If you have any issues with the proposal as written, or if it doesn't cover a
use-case that's important to you, [please bring that up in the `sass/language`
issue
tracker](https://github.com/sass/language/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22proposal%3A+CSS+imports%22).
We'll be leaving it open for discussion for at least two weeks before we mark
the proposal as "accepted" and move on to the implementation phase.

Please be aware, though, that while we welcome community feedback, the design of
Sass is ultimately in the hands of the language team. We'll absolutely consider
the perspectives and use-cases of users who speak up, but it's also our job to
consider all the users who are new to Sass or even to CSS and who don't yet know
to read blogs or comment on issue trackers. Remember that our careful
decision-making made Sass what it is today, and have patience with us if we
don't make the decisions you would have!

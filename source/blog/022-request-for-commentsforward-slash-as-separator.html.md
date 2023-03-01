---
title: 'Request For Comments: Forward Slash as Separator'
author: Natalie Weizenbaum
tags: blog
#date: 2019-05-06 16:15 PST
---

Early on in Sass's history, the decision was made to use `/` as a division
operator, since that was (and is) by far the most common representation across
programming languages. The `/` character was used in very few plain CSS
properties, and for those it was an optional shorthand. So Sass defined [a set
of heuristics][] that defined when `/` would be rendered as a literal slash
versus treated as an operator.

[a set of heuristics]: /documentation/operators/numeric#slash-separated-values

For a long time, these heuristics worked pretty well. In recent years, however,
new additions to CSS such as [CSS Grid][] and [CSS Color Level 4][] have been
using `/` as a separator increasingly often. Using the same character for both
division and slash-separation is becoming more and more annoying to users, and
will likely eventually become untenable.

[CSS Grid]: https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row
[CSS Color Level 4]: https://drafts.csswg.org/css-color/#rgb-functions

As such, we're planning to redefine `/` to be _only_ a separator. Rather than
creating an unquoted string (as it currently does when at least one operand
isn't a number), it will create a list with a new slash separator. For example,
`1 / 2 / 3` will be a three-element slash-separated list. Division will instead
be written as a function, `divide()` (or `math.div()` in [the new module
system][]).

[the new module system]: /blog/request-for-comments-module-system-proposal

## Rollout

This is a major breaking change to existing Sass semantics, so we'll roll it out
in a three-stage process:

1. The first stage won't introduce any breaking changes. It will:

   - Add a `divide()` function which will work exactly like the `/` operator
     does today, except that it will produce deprecation warnings for any
     non-number arguments.
   - Add slash-separated lists to Sass's object models, _without_ a literal
     syntax for creating them. That will come later, since it would otherwise be
     a breaking change.
   - Add a `slash-list()` function that will create slash-separated lists.
   - Produce deprecation warnings for all `/` operations that are interpreted as
     division.

2. The second stage _will_ be a breaking change. It will:

   - Make `/` exclusively a list separator.
   - Make `divide()` throw errors for non-number arguments.
   - Deprecate the `slash-list()` function, since it will now be redundant.

3. The third stage will just remove the `slash-list()` function. This is not a
   priority, and will be delayed until the next major version release.

## Giving Feedback

If you want more details on exactly how the proposed behavior will work, [head
over to the Sass language repo and read the full
proposal](https://github.com/sass/sass/blob/main/accepted/slash-separator.md).
You can skip the Background and Summary sections, since they're included above.
Be aware, though, that it's written to be a specification; it's a great for
figuring out how exactly an edge case should work, but it's not as
conversational as the sections quoted above.

If you have any issues with the proposal as written, or if it doesn't cover a
use-case that's important to you, [please bring that up in the Sass language
issue
tracker](https://github.com/sass/sass/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+label%3A%22proposal%3A+slash+separator%22).
We'll be leaving it open for discussion for at least two weeks before we mark
the proposal as "accepted" and move on to the implementation phase.

Please be aware, though, that while we welcome community feedback, the design of
Sass is ultimately in the hands of the language team. We'll absolutely consider
the perspectives and use-cases of users who speak up, but it's also our job to
consider all the users who are new to Sass or even to CSS and who don't yet know
to read blogs or comment on issue trackers. Remember that our careful
decision-making made Sass what it is today, and have patience with us if we
don't make the decisions you would have!

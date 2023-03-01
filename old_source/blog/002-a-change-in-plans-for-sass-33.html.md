---
title: A Change in Plans for Sass 3.3
author: Natalie Weizenbaum
# date: 2013-12-19 20:05 PST
---

_This was originally published as [a gist](https://gist.github.com/nex3/8050187)._

Sass 3.3 is coming soon, and along with it several major new features. It
supports source maps, SassScript maps, and the use of `&` in SassScript. In
preparation for its release, we've put out a couple of release candidates to be
sure that everything was set and ready to go. Unfortunately, it wasn't.

Release candidates often turn up small bugs and inconsistencies in new features,
but it's rare that they find anything truly damning. In this case, though,
several users noticed an issue with using `&` in SassScript that rendered a
sizable chunk of our plan for that section of 3.3 unworkable. It's not a fatal
issue, and we think we have a good plan for dealing with it (I'll get to that in
a bit), but it is a problem.

## The Background

To understand what's wrong, first you need to understand the reason we decided
to make `&` accessible to SassScript in the first place. One thing users want to
do pretty often is to add suffixes to classes. Sometimes this takes the place of
nesting selectors, sometimes it's just to make a new class based on the old ones
-- the reason doesn't matter much to this discussion. When people tried to do
this, they'd write something like `.foo { &-suffix { ... } }`, and it wouldn't
work. The reason is that `&` has the same syntactic function as a type selector
(e.g. `h1`) or a universal selector (`*`), since it could be replaced by any of
those. It doesn't make sense to write `*-suffix` in a selector, so `&-suffix`
wasn't allowed either.

This didn't stop people from wanting to do it, though. So we decided, "all
right, we already use interpolation (`#{}`) to support injecting text into
selectors -- let's just use that". We decided to add `&` as a sort of special
variable in SassScript that contained a parsed representation of the current
selector. You could then mimic `&-suffix` by doing `@at-root #{&}-suffix`
instead[^1]. Life was peachy, until our intrepid users discovered the problem.

## The Problem

Here's a small snippet of SCSS that demonstrates the issue. See if you can
figure it out:

```scss
.foo, .bar {
  @at-root #{&}-suffix {
    color: blue;
  }
}
```

Did you get it? That's right: `&` in this example is `.foo, .bar`, which means
the selector compiles to `.foo, .bar-suffix`. Since `#{}` injects plain old
text, there's no chance for Sass to figure out how it should split up the
selector.

[Chris](https://github.com/chriseppstein) and I talked and talked about how to
fix this. We considered adding a function to add the suffix, but that was too
verbose. We considered making `&` split the compilation of the CSS rule into
several parallel rules which each had a single selector for `&`, but that was
too complicated and fell down in too many edge cases. We eventually concluded
that there was no way for SassScript `&` to cleanly support the use case we
designed it for.

## The Solution

We knew we wanted to support the `&-suffix` use case, and our clever plan for
doing so had failed. We put our heads together and discussed, and decided that
the best way to support it was the most straightforward: we'd just allow
`&-suffix`. This was, after all, what most people tried first when they wanted
this behavior, and with the `&` embedded directly in the selector, we can handle
selector lists easily.

This means that **`&-suffix` will be supported in Sass 3.3**, without needing
`#{}` or `@at-root`. I've created [issue
1055](https://github.com/nex3/sass/issues/1055) to track it. When compiling
these selectors, if the parent selector is one that would result in an invalid
selector (e.g. `*-suffix` or `:nth-child(1)-suffix`), we'll throw an error there
describing why that selector was generated.

We are still worried about cases where people write mixins using `&-suffix` that
will then fail to work with certain parent selectors, but in this case we
determined that this would be the least of all available evils.

## The Future of `&` in SassScript

In addition to supporting `&-suffix`, **we've decided to pull SassScript `&`
from the 3.3 release**. Rest assured that it will return -- we recognize that it
has other good use cases, and we intend to bring it back for the next big
release (likely 3.4). In addition, it will come with a suite of functions for
manipulating the selectors it makes available, so it will be more powerful than
ever.

There are two reasons that we want to hold off on using `&` in SassScript for
now. The first is that we want some time to create the functions that will go
along with it and put them through their paces. This may require changing the
way it works in various ways, and we don't want to have to make
backwards-incompatible changes to do so.

The second reason is that we've spent a fair amount of energy talking up `#{&}`
as a solution to the `&-suffix` problem. This is our own fault, clearly, but
it's true and it's something we need to deal with. Making `&-suffix` work is
great, but if everyone is using `#{&}` anyway because that's what we told them
about a few months ago, then it's not doing everything it can. Having a release
where `&-suffix` works but `#{&}` doesn't will help guide users towards the best
way to solve their problem, before we make the more advanced functionality
available.

`@at-root` will still be included in Sass 3.3.

## Releasing 3.3

Unfortunately, this change will delay the release of 3.3, but hopefully not by
too much. I anticipate this being relatively straightforward to implement; the
major hurdle was figuring out what to do about it, and that part's done. I plan
to devote a large chunk of time to getting 3.3 out the door after I come back
from winter vacation, so hopefully (no promises) it'll be released some time in
January.

[^1]: The `@at-root` is necessary since Sass can't reliably figure out whether
    `&` was used in the selector like it can when `&` is used without `#{}`.

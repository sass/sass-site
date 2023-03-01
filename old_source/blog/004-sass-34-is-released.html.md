---
title: Sass 3.4 is Released
author: Natalie Weizenbaum
# date: 2014-08-18 16:38 PST
---

We've been trying to increase the pace of Sass releases, and it looks like we've
succeeded. A mere five months after the release of [Sass
3.3](/blog/sass-33-is-released), we're announcing the release of Sass 3.4.0,
codename Selective Steve. Faster releases mean fewer major features per release,
so there are only two big new things to talk about (although there are plenty of
little improvements you can read about in [the
changelog](/documentation/file.SASS_CHANGELOG.html)). As the version name
suggests, both of these features have to do with selectors.

# Using `&` in SassScript

"SassScript" is what we call the mini-language Sass uses for variables, property
values, and so forth. It's mostly just CSS values, but it also supports custom
functions, arithmetic, and so forth. In Sass 3.4, we added support for something
new: the parent selector, `&`.

Most Sass users will probably recognize `&` from its previous appearances in
selectors around the world, where it's used to explicitly refer to the parent
selector. For example, in `.parent { .child & { ... } }`, `&` refers to
`.parent`, and this compiles to `.child .parent { ... }`.

Now `&` works much the same way in SassScript. It refers to the same parent
selector, but instead of just being dropped in it's exposed as a list of lists
to make it easy for functions to inspect and manipulate it. For example, if you
write `.foo .bar, .baz { $selector: & }`, `$selector` will be `((".foo" ".bar"),
(".baz",))`.

We had originally slated this feature for version 3.3, but we took it out when
we realized [it was really hard to use these selectors in a way that didn't
break when they contained commas](/blog/a-change-in-plans-for-sass-33).
Because of that, we decided to delay it for a version to give us time to come up
with its compantion feature: selector functions.

# Selector Functions

The problem with just exposing `&` was that the only way to use it with other
selectors was by glomming them together as strings. This works okay in simple
cases, but when you write `#{$selector} .child` and `$selector` is `.foo, .bar`,
you want `.foo .child, .bar .child` but you get `.foo, .bar .child`. This is no
good at all.

To solve this, we added a slew of functions that use Sass's powerful built-in
selector logic to do the right thing. For example, you can now write
**`selector-nest(".foo, .bar", ".child")`** and get exactly what you want. These
functions all return the same sort of nested-list representation that `&`
uses,but they're very liberal in what they accept: anything from nested lists to
plain old strings.

If you want to see every selector function we thought up, check out [the
changelog](/documentation/file.SASS_CHANGELOG.html). I do want to highlight a
few that I'm particularly fond of, though. You've already seen
`selector-nest()`, and **`selector-append()`** is a close relative. The
difference between them is whitespace: `selector-nest()` adds a space between
its selectors, where `selector-append()` doesn't. This means that
`selector-append(".foo, .bar", "-suffix")` returns `.foo-suffix, .bar-suffix`.

Another function I like a lot is **`selector-replace()`**. This does a
search-and-replace of one selector within another, but it's a lot more clever
than your basic string replace. It uses Sass's `@extend` logic to replace
selectors *semantically*, as though every element matched by the replacement
selector was also matched by the replaced selector. For example,
`selector-replace(".foo.bar.baz", ".foo.baz", ".qux")` returns `.bar.qux`.

The last really powerful function I want to draw your attention to is
**`selector-unify()`**. This takes two selectors and returns a new selector that
matches only elements that are matched by *both* input selectors. This is an
operation Sass uses a lot internally, and now users can access it as well. For
example, `selector-unify(".foo.bar", ".bar.baz")` will return `.foo.bar.baz`.

# What's Next?

I won't rule out the possibility of Sass 3.5 existing, but
[Chris](https://twitter.com/chriseppstein) and I plan to focus pretty hard on
Sass 4.0. The big feature for 4.0 is going to be `@import`, or rather the lack
thereof. Our current import system is beginning to show its age in a major way,
and we intend to replace it wholesale, up to and including the name. As of 4.0,
the recommended way of pulling in other Sass files will be `@use`.

Among the features we're planning for `@use` are two that have been widely
requested. You'll be able to import CSS stylesheets directly into your Sass
ones, and each stylesheet will only be run once, no matter how many times it's
imported.

Until then, though, run `gem update sass` and enjoy Selective Steve!

---
title: Sass 3.5 is Released
author: Natalie Weizenbaum
tags: blog
date: 2017-07-07 15:33:00 -8
---

I'm excited to announce that I've just released the stable version of Sass 3.5.
This release focuses on compatibility with new CSS syntax, and helps lay the
groundwork for the upcoming module system and compatibility with [Dart
Sass](/blog/announcing-dart-sass).

Most of the major features in 3.5 were already in the release candidate, which
[you can read about here](/blog/sass-35-release-candidate). But there are a
handful of other changes that have been added since then:

- Sass now supports the [the `::slotted()`
  pseudo-element](https://drafts.csswg.org/css-scoping-1/#slotted-pseudo),
  including extending its selector arguments.

- [The `var()` function](https://www.w3.org/TR/css-variables-1/#using-variables)
  may be safely passed to the CSS color functions `rgb()`, `rgba()`, `hsl()`,
  and `hsla()`.

- Transparent colors created by Sass's color functions will now be written as
  `rgba(0, 0, 0, 0)` rather than `transparent` to work around a bug in Internet
  Explorer. Colors written as `transparent` in the document will still be
  emitted as written.

### Dart Sass Compatibility

[I wrote last month](http://sass.logdown.com/posts/1909151) about our plans for
keeping Ruby Sass compatible with Dart Sass in the short term. Sass 3.5 begins
to implement those plans by adding support for a number of small behavioral
extensions added by Dart Sass:

- It's no longer an error to `@extend` a selector that appears in the
  stylesheet, but for which unification fails. The purpose of extension errors
  was to prevent typos, which weren't occurring in this case.

- Pseudo selectors that take arguments can now take any argument that matches
  CSS's [`<declataion-value>`
  syntax](https://drafts.csswg.org/css-syntax-3/#typedef-declaration-value).
  This will provide better forwards-compatibility with new selectors.

- Pseudo selectors that contain placeholder selectors as well as
  non-placeholders—for example, `:matches(.foo, %bar)`—will no longer be
  eliminated. This matches the definition of a placeholder as a selector that
  matches nothing.

- You can now vary the indentation within an indented-syntax file, as long as it
  still defines a consistent tree structure.

There are also some deprecations for functionality that's not supported in Ruby
Sass:

- Extending compound selectors, such as `@extend .foo.bar`, is deprecated. This
  never followed the stated semantics of extend: elements that match the
  extending selector are styled as though they matches the extended selector.

  When you write `h1 {@extend .a.b}`, this _should_ mean that all `h1` elements
  are styled as though they match `.a.b`—that is, as though they have `class="a
b"`, which means they'd match both `.a` and `.b` separately. But instead we
  extend only selectors that contain _both_ `.a` and `.b`, which is incorrect.

- Color arithmetic is deprecated. Channel-by-channel arithmetic doesn't
  correspond closely to intuitive understandings of color. Sass's suite of
  [color
  functions](/documentation/Sass/Script/Functions.html#other_color_functions)
  are a much cleaner and more comprehensible way of manipulating colors
  dynamically.

- The reference combinator, `/foo/`, is deprecated since it hasn't been in the
  CSS specification for some time and is being removed from Chrome soon.

- The old-style `:name value` property syntax is deprecated. This syntax is not
  widely used, and is unnecessarily different from CSS.

### LibSass Compatibility

[LibSass](/libsass), the C++ implementation of Sass, is well on its way to
compatibility with all these features. It's not quite there yet, but we decided
we didn't want to block the 3.5 release on 100% compatibility. LibSass will
release these features as it implements them.

### What's Next?

In the most immediate future, I'm going on leave for a few months, so there's
not likely to be a huge amount of work. Once that's over, I'll be focusing on
getting Dart Sass to a full 1.0.0 release, which means spending a bunch of time
making its JavaScript API compatible with
[node-sass](http://npmjs.com/package/node-sass).

As far as Ruby Sass goes, I'll continue to fix bugs and add support for the CSS
features as browsers start to support them. Once Dart Sass 1.0.0 is out, I'll
add new features concurrently across both Ruby and Dart until the one-year
support period is up.

But for now, run `gem update sass` and enjoy 3.5!

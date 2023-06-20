---
title: "Feature Watch: Content Arguments and Color Functions"
author: Natalie Weizenbaum
date: 2018-11-14 14:14:00 -8
---

Dart Sass 1.15, released today and available [on
npm](https://npmjs.com/package/sass) and [all other distribution
channels](/install), brings with it a number of highly-anticipated new Sass
features. This is also the first release of Dart Sass with major new language
features that *aren't* just for CSS compatibility. That's a big accomplishment,
and we intend to continue that pattern moving forward!

### `@content` Arguments

Mixins that take [`@content`
blocks](/documentation/at-rules/mixin/#content-blocks) can now pass
arguments to those blocks. This is written `@content(<arguments...>)`. If a
mixin passes arguments to its content block, users of that mixin must accept
those arguments by writing `@include <name> using (<arguments...>)`. The
argument list for a content block works just like a mixin's argument list, and
the arguments passed to it by `@content` work just like passing arguments to a
mixin.

```scss
// style.scss
@mixin media($types...) {
  @each $type in $types {
    @media #{$type} {
      @content($type);
    }
  }
}

@include media(screen, print) using ($type) {
  h1 {
    font-size: 40px;
    @if $type == print {
      font-family: Calluna;
    }
  }
}
```

```css
/* style.css */
@media screen {
  h1 {
    font-size: 40px;
  }
}
@media print {
  h1 {
    font-size: 40px;
    font-family: Calluna;
  }
}
```

For more details, see [the feature
proposal](https://github.com/sass/language/blob/main/accepted/content-args.md).
This feature is implemented in LibSass, and will be released in version 3.6.0.
Since [Ruby Sass is deprecated](/blog/ruby-sass-is-deprecated) and this isn't a
CSS compatibility feature, it won't be implemented in Ruby Sass.

### Color Level 4 Syntax for `rgb()` and `hsl()`

The [CSS Color Module Level 4](https://drafts.csswg.org/css-color/) has
introduced new syntax for the `rgb()` and `hsl()` functions, which has begun to
be supported in browsers. This syntax makes these functions more compact, allows
the alpha value to be specified without needing additional `rgba()` and `hsla()`
functions, and it looks like `rgb(0 255 0 / 0.5)` and `hsla(0 100% 50%)`.

To support this function, Sass's `rgb()` and `hsl()` functions now accept a
space-separated list of components as a single argument. If this last argument
is a slash-separated pair of numbers, the first number will be treated as the
blue channel or lightness (respectively) and the second as the alpha channel.

**Be aware though** that the normal rules for [disambiguating between division
and `/` as a
separator](/documentation/breaking-changes/slash-div/) still
apply! So if you want to pass a variable for the alpha value, you'll need to use
the old `rgba()` syntax. We're [considering possible long-term
solutions](https://github.com/sass/sass/issues/2565) for this problem as `/` is
used more prominently as a separator in CSS.

In addition, the new color spec defines the `rgba()` and `hsla()` functions as
pure aliases for `rgb()` and `hsl()`, and adds support for the four-argument
`rgba()` and `hsla()` syntax to `rgb()` and `hsl()` as well. To match this
behavior, Sass is also defining `rgba()` and `hsla()` as aliases and adding
support for all their definitions to `rgb()` and `hsl()`.

All in all, this means that the function calls like all of the following are
newly supported in Sass:
* `rgb(0 255 0)`, `rgb(0% 100% 0%)`, `rgb(0 255 0 / 0.5)`, and `rgb(0, 255, 0,
  0.5)`;
* `hsl(0 100% 50%)`, `hsl(0 100% 50% / 0.5)`, and `hsl(0, 100%, 50%, 0.5)`;
* `rgba(0, 255, 0)` and `hsla(0, 100%, 50%)`;
* and `rgb($color, 0.5)`.

This change is fully backwards-compatible, so all the arguments to `rgb()`,
`hsl()`, `rgba()`, and `hsla()` that previously worked will continue to do so.

For more details, see [the feature
proposal](https://github.com/sass/language/blob/main/accepted/color-4-rgb-hsl.md).
This feature isn't yet implemented in
[LibSass](https://github.com/sass/libsass/issues/2722) or [Ruby
Sass](https://github.com/sass/ruby-sass/issues/84).

### Interpolated At-Rule Names

This feature is a little smaller than the last two, but it's been on the to-do
list for even longer: adding support for interpolation in the names of at-rules!
This works just how you'd expect:

```scss
@mixin viewport($prefixes) {
  @each $prefix in $prefixes {
    @-#{$prefix}-viewport {
      @content;
    }
  }
  @viewport {
    @content;
  }
}
```

For more details, see [the feature
proposal](https://github.com/sass/language/blob/main/accepted/at-rule-interpolation.md).
This feature isn't yet implemented in
[LibSass](https://github.com/sass/libsass/issues/2721). Since [Ruby Sass is
deprecated](http://sass.logdown.com/posts/7081811) and this isn't a CSS
compatibility feature, it won't be implemented in Ruby Sass.

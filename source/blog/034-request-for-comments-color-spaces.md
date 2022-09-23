---
title: "Request for Comments: Color Spaces"
author: Miriam Suzanne and Natalie Weizenbaum
date: 2022-09-21 13:00 PST
---

There's been a lot of exciting work in the CSS color specifications lately, and
as it begins to land in browsers we've been preparing to add support for it in
Sass as well. The first and largest part of that is adding support for *color
spaces* to Sass, which represents a huge (but largely backwards-compatible)
rethinking of the way colors work.

Historically, all colors in CSS have existed in the same color space, known as
"sRGB". Whether you represent them as a hex code, an `hsl()` function, or a
color name, they represented the same set of visible colors you could tell a
screen to display. While this is conceptually simple, there are some major
downsides:

* As monitors have improved over time, they've become capable of displaying more
  colors than can be represented in the sRGB color space.

* sRGB, even when you're using it via `hsl()`, doesn't correspond very well with
  how humans perceive colors. Cyan looks noticeably lighter than purple with the
  same saturation and lightness values.

* There's no way to represent domain- or device-specific color spaces, such as
  the [CMYK] color space that's used by printers.

  [CMYK]: https://en.wikipedia.org/wiki/CMYK_color_model

Color spaces solve all of these problems. Now not every color has a red, green,
and blue channel (which can be interpreted as hue, saturation, and lightness).
Instead, a every color has a specific *color space* which specifies which
channels it has. For example, the color `oklch(80% 50% 90deg)` has `oklch` as
its color space, `80%` lightness, `50%` chroma, and `90deg` hue.

## Color Spaces in Sass

Today we're announcing [a proposal for how to handle color spaces in Sass]. In
addition to expanding Sass's color values to support color spaces, this proposal
defines Sassified versions of all the color functions in [CSS Color Level
4][color-4].

[a proposal for how to handle color spaces in Sass]: https://github.com/sass/sass/blob/main/proposal/color-4-new-spaces.md

### Rules of Thumb

There are several rules of thumb for working with color spaces in Sass:

* The `rgb`, `hsl`, and `hwb` spaces are considered "legacy spaces", and will
  often get special handling for the sake of backwards compatibility. Colors
  defined using hex notation or CSS color names are considered part of the `rgb`
  color space. Legacy colors are emitted in the most compatible format. This
  matches CSS's own backwards-compatibility behavior.

* Otherwise, any color defined in a given space will remain in that space, and
  be emitted in that space.

* Authors can explicitly convert a color's space by using `color.to-space()`.
  This can be useful to enforce non-legacy behavior, by converting into a
  non-legacy space, or to ensure the color output is compatible with older
  browsers by converting colors into a legacy space before emitting.

* The `srgb` color space is equivalent to `rgb`, except that one is a legacy
  space, and the other is not. They also use different coordinate systems, with
  `rgb()` accepting a range from 0-255, and `srgb` using a range of 0-1.

* Color functions that allow specifying a color space for manipulation will
  always use the source color space by default. When an explicit space is
  provided for manipulation, the resulting color will still be returned in the
  same space as the origin color. For `color.mix()`, the first color parameter
  is considered the origin color.

* All legacy and RGB-style spaces represent bounded gamuts of color. Since
  mapping colors into gamut is a lossy process, it should generally be left to
  browsers, which can map colors as-needed, based on the capabilities of a
  display. For that reason, out-of-gamut channel values are maintained by Sass
  whenever possible, even when converting into gamut-bounded color spaces. The
  only exception is that `hsl` and `hwb` color spaces are not able to express
  out-of-gamut color, so converting colors into those spaces will gamut-map the
  colors as well. Authors can also perform explicit gamut mapping with the
  `color.to-gamut()` function.

* Legacy browsers require colors in the `srgb` gamut. However, most modern
  displays support the wider `display-p3` gamut.

### Standard CSS Color Functions

#### `oklab()` and `oklch()`

The `oklab()` (cubic) and `oklch()` (cylindrical) functions provide access to an
unbounded gamut of colors in a perceptually uniform space. Authors can use these
functions to define reliably uniform colors. For example, the following colors
are perceptually similar in lightness and saturation:

```scss
$pink: oklch(64% 0.196 353); // hsl(329.8 70.29% 58.75%)
$blue: oklch(64% 0.196 253); // hsl(207.4 99.22% 50.69%)
```

The `oklch()` format uses consistent "lightness" and "chroma" values, while the
`hsl()` format shows dramatic changes in both "lightness" and "saturation". As
such, `oklch` is often the best space for consistent transforms.

#### `lab()` and `lch()`

The `lab()` and `lch()` functions provide access to an unbounded gamut of colors
in a space that's less perpetually-uniform but more widely-adopted than OKLab
and OKLCH.

#### `hwb()`

Sass now supports a top-level `hwb()` function that uses the same syntax as
CSS's built-in `hwb()` syntax.

#### `color()`

The new `color()` function provides access to a number of specialty spaces. Most
notably, `display-p3` is a common space for wide-gamut monitors, making it
likely one of the more popular options for authors who simply want access to a
wider range of colors. For example, P3 greens are significantly 'brighter' and
more saturated than the greens available in sRGB:

```scss
$fallback-green: rgb(0% 100% 0%);
$brighter-green: color(display-p3 0 1 0);
```

Sass will natively support all predefined color spaces declared in the Colors
Level 4 specification. It will also support unknown color spaces, although these
can't be converted to and from any other color space.

### New Sass Color Functions

#### `color.channel()`

This function returns the value of a single channel in a color. By default, it
only supports channels that are available in the color's own space, but you can
pass the `$space` parameter to return the value of the channel after converting
to the given space.

```scss
$brand: hsl(0 100% 25.1%);

// result: 25.1%
$hsl-lightness: color.channel($brand, "lightness");

// result: 37.67%
$oklch-lightness: color.channel($brand, "lightness", $space: oklch);
```

#### `color.space()`

This function returns the name of the color's space.

```scss
// result: hsl
$hsl-space: color.space(hsl(0 100% 25.1%));

// result: oklch
$oklch-space: color.space(oklch(37.7% 38.75% 29.23deg));
```

#### `color.is-in-gamut()`, `color.is-legacy()`

These functions return various facts about the color. `color.is-in-gamut()`
returns whether the color is in-gamut for its color space (as opposed to having
one or more of its channels out of bounds, like `rgb(300 0 0)`).
`color.is-legacy()` returns whether the color is a legacy color in the `rgb`,
`hsl`, or `hwb` color space.

#### `color.is-powerless()`

This function returns whether a given channel is "powerless" in the given color.
This is a special state that's defined for individual color spaces, which
indicates that a channel's value won't affect how a color is displayed.

```scss
$grey: hsl(0 0% 60%);

// result: true, because saturation is 0
$hue-powerless: color.is-powerless($grey, "hue");

// result: false
$hue-powerless: color.is-powerless($grey, "lightness");
```

#### `color.same()`

This function returns whether two colors will be displayed the same way, even if
this requires converting between spaces. This is unlike the `==` operator, which
always considers colors in different non-legacy spaces to be inequal.

```scss
$orange-rgb: #ff5f00;
$orange-oklch: oklch(68.72% 20.966858279% 41.4189852913deg);

// result: false
$equal: $orange-rgb == $orange-oklch;

// result: true
$same: color.same($orange-rgb, $orange-oklch);
```

### Existing Sass Color Functions

#### `color.scale()`, `color.adjust()`, and `color.change()`

By default, all Sass color transformations are handled and returned in the color
space of the original color parameter. However, all relevant functions now allow
specifying an explicit color space for transformations. For example, lightness &
darkness adjustments are most reliable in `oklch`:

```scss
$brand: hsl(0 100% 25.1%);

// result: hsl(0 100% 43.8%)
$hsl-lightness: color.scale($brand, $lightness: 25%);

// result: hsl(5.76 56% 45.4%)
$oklch-lightness: color.scale($brand, $lightness: 25%, $space: oklch);
```

Note that the returned color is still emitted in the original color space, even
when the adjustment is performed in a different space.

#### `color.mix()`

The `color.mix()` function will retain its existing behavior for legacy color
spaces, but for new color spaces it will match CSS's "color interpolation"
specification. This is how CSS computes which color to use in between two colors
in a gradient or an animation.

#### Deprecations

A number of existing functions only make sense for legacy colors, and so are
being deprecated in favor of color-space-friendly functions like
`color.channel()` and `color.adjust()`:

* `color.red()`
* `color.green()`
* `color.blue()`
* `color.hue()`
* `color.saturation()`
* `color.lightness()`
* `color.whiteness()`
* `color.blackness()`
* `adjust-hue()`
* `saturate()`
* `desaturate()`
* `transparentize()`/`fade-out()`
* `opacify()`/`fade-in()`
* `lighten()`/`darken()`

## Let Us Know What You Think!

There's lots more detail to this proposal, and it's not set in stone yet. We
want your feedback on it! Read it over [on GitHub], and [file an issue] with any
thoughts or concerns you may have.

[on GitHub]: https://github.com/sass/sass/blob/main/proposal/color-4-new-spaces.md#deprecated-functions
[file an issue]: https://github.com/sass/sass/issues/new

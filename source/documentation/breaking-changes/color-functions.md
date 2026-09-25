---
title: 'Breaking Change: Color Functions'
introduction: >
  Certain color functions that were designed with the assumption that all colors
  were mutually compatible no longer make sense now that Sass supports all the
  color spaces of CSS Color 4.
---

Historically, all Sass color values interchangeable: whether the colors were
defined as RGB, HSL, or HWB, they only covered [the `sRGB` gamut] and could only
represent the colors that monitors could display since the mid-1990s. When Sass
added its original set of color functions, these functions assumed that all
colors could be freely converted between any of these representations and that
there was a single unambiguous meaning for each channel name like `red` or
`hue`.

[the `sRGB` gamut]: https://en.wikipedia.org/wiki/SRGB

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The release of [CSS Color 4] changed all that. It added support for many new
color spaces with wider gamuts than `sRGB`. In order to support these colors,
Sass had to rethink the way color functions worked. In addition to adding new
functions like [`color.channel()`] and [`color.to-space()`], a number of older
functions were removed when they were based on assumptions that no longer held
true.

[CSS Color 4]: https://developer.mozilla.org/en-US/blog/css-color-module-level-4/

[`color.channel()`]: /documentation/modules/color/#channel
[`color.to-space()`]: /documentation/modules/color/#to-space

### Old Channel Functions

Channel names are now ambiguous across color spaces. The legacy RGB space has a
`red` channel, but so do `display-p3`, `rec2020`, and many more. To avoid
ambiguity, `color.red()`, `color.green()`, `color.blue()`, `color.hue()`,
`color.saturation()`, `color.lightness()`, `color.whiteness()`,
`color.blackness()`, `color.alpha()`, and `color.opacity()` have been removed.
Instead, you can use the [`color.channel()`] function to get the value of a
specific channel, usually with an explicit `$space` argument to indicate which
color space you want to interpret the color in.

{% codeExample 'channel', false %}
  @use "sass:color";

  $color: #c71585;
  // Instead of `color.red($color)`:
  @debug color.channel($color, "red", $space: rgb);

  // These didn't have equivalents in the old functions.
  @debug color.channel($color, "red", $space: display-p3);
  @debug color.channel($color, "hue", $space: oklch);
  ===
  @use "sass:color"

  $color: #c71585
  // Instead of `color.red($color)`:
  @debug color.channel($color, "red", $space: rgb)

  // These didn't have equivalents in the old functions.
  @debug color.channel($color, "red", $space: display-p3)
  @debug color.channel($color, "hue", $space: oklch)
{% endcodeExample %}

### Single-Channel Adjustment Functions

These have the same ambiguity problem as the old channel functions, while _also_
already being redundant with [`color.adjust()`] even before Color 4 support was
added. Not only that, it's often better to use [`color.scale()`] anyway, because
it's better suited for making changes relative to the existing color rather than
in absolute terms. To avoid these problems, `adjust-hue()`, `saturate()`,
`desaturate()`, `lighten()`, `darken()`, `opacify()`, `fade-in()`,
`transparentize()`, and `fade-out()` have been removed. Note that these
functions never had module-scoped counterparts because their use was already
discouraged.

[`color.adjust()`]: /documentation/modules/color/#adjust
[`color.scale()`]: /documentation/modules/color/#scale
[`adjust-hue()`]: /documentation/modules/color/#adjust-hue
[`saturate()`]: /documentation/modules/color/#saturate
[`desaturate()`]: /documentation/modules/color/#desaturate
[`lighten()`]: /documentation/modules/color/#lighten
[`darken()`]: /documentation/modules/color/#darken
[`opacify()`]: /documentation/modules/color/#opacify
[`fade-in()`]: /documentation/modules/color/#fade-in
[`transparentize()`]: /documentation/modules/color/#transparentize
[`fade-out()`]: /documentation/modules/color/#fade-out

{% codeExample 'adjust', false %}
  @use "sass:color";

  $color: #c71585;
  // Instead of `lighten($color, 15%):
  @debug color.adjust($color, $lightness: 15%, $space: hsl);

  // These didn't have equivalents in the old functions.
  @debug color.adjust($color, $lightness: 15%, $space: oklch);
  @debug color.scale($color, $lightness: 15%, $space: oklch);
  ===
  @use "sass:color"

  $color: #c71585
  // Instead of `lighten($color, 15%):
  @debug color.adjust($color, $lightness: 15%, $space: hsl)

  // These didn't have equivalents in the old functions.
  @debug color.adjust($color, $lightness: 15%, $space: oklch)
  @debug color.scale($color, $lightness: 15%, $space: oklch)
{% endcodeExample %}

## Historical Behavior

Before Dart Sass 2.0.0, the channel functions listed above returned the value of
the given color channel after converting the color to `rgb`, `hsl`, or `hwb`.
They only ever supported [legacy colors], and were deprecated in Dart Sass
1.79.0.

[legacy colors]: /documentation/values/colors#legacy-color-spaces

The adjustment functions were mostly equivalent to calling `color.adjust` with
the corresponding channel name:

* `$hue` for `adjust-hue()`;
* `$saturation` for `saturate()` and `desaturate()`;
* `$lightness` for `lighten()` and `darken()`; and
* `$alpha` for `opacify()`, `fade-in()`, `transparentize()`, and `fade-out()`.

The `desaturate()`, `darken()`, `transparentize()`, and `fade-out()` functions
were mostly equivalent to passing the *negative* value of the argument. For
example, `darken($color, 15%)` worked lke `color.adjust($color, $lightness:
-15%, $space: "hsl")`.

Unlike `color.adjust()`, the adjustment functions only ever supported [legacy
colors], and they were deprecated in Dart Sass 1.79.0.

{% render 'silencing_deprecations' %}

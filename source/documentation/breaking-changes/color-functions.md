---
title: 'Breaking Change: Color Functions'
introduction: >
  Certain color functions that were designed with the assumption that all colors
  were mutually compatible no longer make sense now that Sass supports all the
  color spaces of CSS Color 4.
---

Historically, all Sass color values covered the same gamut: whether the colors
were defined as RGB, HSL, or HWB, they only covered [the `sRGB` gamut] and could
only represent the colors that monitors could display since the mid-1990s. When
Sass added its original set of color functions, they assumed that all colors
could be freely converted between any of these representations and that there
was a single unambiguous meaning for each channel name like "red" or "hue".

[the `sRGB` gamut]: https://en.wikipedia.org/wiki/SRGB

The release of [CSS Color 4] changed all that. It added support for many new
color spaces with different (wider) gamuts than `sRGB`. In order to support
these colors, Sass had to rethink the way color functions worked. In addition to
adding new functions like [`color.channel()`] and [`color.to-space()`], a number
of older functions were deprecated when they were based on assumptions that no
longer held true.

[CSS Color 4]: https://developer.mozilla.org/en-US/blog/css-color-module-level-4/

[`color.channel()`]: /documentation/modules/color/#channel
[`color.to-space()`]: /documentation/modules/color/#to-space

### Old Channel Functions

Channel names are now ambiguous across color spaces. The legacy RGB space has a
`red` channel, but so do `display-p3`, `rec2020`, and many more. This means that
[`color.red()`], [`color.green()`], [`color.blue()`], [`color.hue()`],
[`color.saturation()`], [`color.lightness()`], [`color.whiteness()`],
[`color.blackness()`], [`color.alpha()`], and [`color.opacity()`] will be
removed. Instead, you can use the [`color.channel()`] function to get the value
of a specific channel, usually with an explicit `$space` argument to indicate
which color space you're working with.

[`color.red()`]: /documentation/modules/color/#red
[`color.green()`]: /documentation/modules/color/#green
[`color.blue()`]: /documentation/modules/color/#blue
[`color.hue()`]: /documentation/modules/color/#hue
[`color.saturation()`]: /documentation/modules/color/#saturation
[`color.lightness()`]: /documentation/modules/color/#lightness
[`color.whiteness()`]: /documentation/modules/color/#whiteness
[`color.blackness()`]: /documentation/modules/color/#blackness
[`color.alpha()`]: /documentation/modules/color/#alpha
[`color.opacity()`]: /documentation/modules/color/#opacity

{% codeExample 'channel', false %}
  @use "sass:color";

  $color: #c71585;
  @debug color.channel($color, "red", $space: rgb);
  @debug color.channel($color, "red", $space: display-p3);
  @debug color.channel($color, "hue", $space: oklch);
  ===
  @use "sass:color"

  $color: #c71585
  @debug color.channel($color, "red", $space: rgb)
  @debug color.channel($color, "red", $space: display-p3)
  @debug color.channel($color, "hue", $space: oklch)
{% endcodeExample %}

### Single-Channel Adjustment Functions

These have the same ambiguity problem as the old channel functions, while _also_
already being redundant with [`color.adjust()`] even before Color 4 support was
added. Not only that, it's often better to use [`color.scale()`] anyway, because
it's better suited for making changes relative to the existing color rather than
in absolute terms. This means that [`adjust-hue()`], [`saturate()`],
[`desaturate()`], [`lighten()`], [`darken()`], [`opacify()`], [`fade-in()`],
[`transparentize()`], and [`fade-out()`] will be removed. Note that these
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
  @debug color.adjust($color, $lightness: 15%, $space: hsl);
  @debug color.adjust($color, $lightness: 15%, $space: oklch);
  @debug color.scale($color, $lightness: 15%, $space: oklch);
  ===
  @use "sass:color"

  $color: #c71585
  @debug color.adjust($color, $lightness: 15%, $space: hsl)
  @debug color.adjust($color, $lightness: 15%, $space: oklch)
  @debug color.scale($color, $lightness: 15%, $space: oklch)
{% endcodeExample %}

## Transition Period

{% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

First, we'll emit deprecation warnings for all uses of the functions that are
slated to be removed. In Dart Sass 2.0.0, these functions will be removed
entirely. Attempts to call the module-scoped versions will throw an error, while
the global functions will be treated as plain CSS functions and emitted as plain
strings.

{% render 'silencing_deprecations' %}

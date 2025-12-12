---
title: Colors
table_of_contents: true
---

{% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "Color Spaces"' %}
  LibSass, Ruby Sass, and older versions of Dart Sass don't support color spaces
  other than `rgb` and `hsl`.

  As well as to adding support for new color spaces, this release changed some
  details of the way colors were handled. In particular, even the legacy `rgb`
  and `hsl` color spaces are no longer clamped to their gamuts; it's now
  possible to represent `rgb(500 0 0)` or other out-of-bounds values. In
  addition, `rgb` colors are no longer rounded to the nearest integer because
  the CSS spec now requires implementations to maintain precision wherever
  possible.
{% endcompatibility %}

{% compatibility 'dart: "1.14.0"', 'libsass: false', 'ruby: "3.6.0"', 'feature: "Level 4 Syntax"' %}
  LibSass and older versions of Dart or Ruby Sass don't support [hex colors with
  an alpha channel][].

  [hex colors with an alpha channel]: https://drafts.csswg.org/css-color/#hex-notation
{% endcompatibility %}

Sass has built-in support for color values. Just like CSS colors, each color
represents a point in a particular color space such as `rgb` or `lab`. Sass
colors can be written as hex codes (`#f2ece4` or `#b37399aa`), [CSS color names]
(`midnightblue`, `transparent`), or color functions like [`rgb()`], [`lab()`],
or [`color()`].

[sRGB color space]: https://en.wikipedia.org/wiki/SRGB
[color functions]: /documentation/modules/color
[CSS color names]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords
[`rgb()`]: /documentation/modules#rgb
[`lab()`]: /documentation/modules#lab
[`color()`]: /documentation/modules#color

{% codeExample 'colors', false %}
  @debug #f2ece4; // #f2ece4
  @debug #b37399aa; // rgba(179, 115, 153, 67%)
  @debug midnightblue; // #191970
  @debug rgb(204 102 153); // #c69
  @debug lab(32.4% 38.4 -47.7 / 0.7); // lab(32.4% 38.4 -47.7 / 0.7)
  @debug color(display-p3 0.597 0.732 0.576); // color(display-p3 0.597 0.732 0.576)
  ===
  @debug #f2ece4  // #f2ece4
  @debug #b37399aa  // rgba(179, 115, 153, 67%)
  @debug midnightblue  // #191970
  @debug rgb(204 102 153)  // #c69
  @debug lab(32.4% 38.4 -47.7 / 0.7)  // lab(32.4% 38.4 -47.7 / 0.7)
  @debug color(display-p3 0.597 0.732 0.576)  // color(display-p3 0.597 0.732 0.576)
{% endcodeExample %}

## Color Spaces

Sass supports the same set of color spaces as CSS. A Sass color will always be
emitted in the same color space it was written in unless it's in a [legacy color
space] or you convert it to another space using [`color.to-space()`]. All the
other color functions in Sass will always return a color in the same spaces as
the original color, even if the function made changes to that color in another
space.

[legacy color space]: #legacy-color-spaces
[`color.to-space()`]: /documentation/modules/color#to-space

Although each color space has bounds on the gamut it expects for its channels,
Sass can represent out-of-gamut values for any color space. This allows a color
from a wide-gamut space to be safely converted into and back out of a
narrow-gamut space without losing information.

{% headsUp %}
  CSS requires that some color functions clip their input channels. For example,
  `rgb(500 0 0)` clips its red channel to be within [0, 255] and so is
  equivalent to `rgb(255 0 0)` even though `rgb(500 0 0)` is a distinct value
  that Sass can represent. You can always use Sass's [`color.change()`] function
  to set an out-of-gamut value for any space.

  [`color.change()`]: /documentation/modules/color#change
{% endheadsUp %}

Following is a full list of all the color spaces Sass supports. You can read
learn about these spaces [on MDN].

{% compatibility 'dart: "1.97.0"', 'libsass: false', 'ruby: false', 'feature: "display-p3-linear"' %}
{% endcompatibility %}

[on MDN]: https://developer.mozilla.org/en-US/docs/Glossary/Color_space

<table class="sl-c-table">
  <tr>
    <th scope="col">Space</th>
    <th scope="col">Syntax</th>
    <th scope="col">Channels [min, max]</th>
  </tr>
  <tr>
    <th scope="row"><code>rgb</code>*</th>
    <td>
      <code>rgb(102 51 153)</code><br>
      <code>#663399</code><br>
      <code>rebeccapurple</code>
    </td>
    <td>
      red <span class="fade">[0, 255]</span>;
      green <span class="fade">[0, 255]</span>;
      blue <span class="fade">[0, 255]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>hsl</code>*</th>
    <td><code>hsl(270 50% 40%)</code></td>
    <td>
      hue <span class="fade">[0, 360]</span>;
      saturation <span class="fade">[0%, 100%]</span>;
      lightness <span class="fade">[0%, 100%]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>hwb</code>*</th>
    <td><code>hwb(270 20% 40%)</code></td>
    <td>
      hue <span class="fade">[0, 360]</span>;
      whiteness <span class="fade">[0%, 100%]</span>;
      blackness <span class="fade">[0%, 100%]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>srgb</code></th>
    <td><code>color(srgb 0.4 0.2 0.6)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>srgb-linear</code></th>
    <td><code>color(srgb-linear 0.133 0.033 0.319)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>display-p3</code></th>
    <td><code>color(display-p3 0.1154 0.0363 0.2946)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>display-p3</code></th>
    <td><code>color(display-p3 0.374 0.21 0.579)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>a98-rgb</code></th>
    <td><code>color(a98-rgb 0.358 0.212 0.584)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>prophoto-rgb</code></th>
    <td><code>color(prophoto-rgb 0.316 0.191 0.495)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>rec2020</code></th>
    <td><code>color(rec2020 0.305 0.168 0.531)</code></td>
    <td>
      red <span class="fade">[0, 1]</span>;
      green <span class="fade">[0, 1]</span>;
      blue <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>xyz</code>, <code>xyz-d65</code></th>
    <td>
      <code>color(xyz 0.124 0.075 0.309)</code><br>
      <code>color(xyz-d65 0.124 0.075 0.309)</code>
    </td>
    <td>
      x <span class="fade">[0, 1]</span>;
      y <span class="fade">[0, 1]</span>;
      z <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>xyz-d50</code></th>
    <td><code>color(xyz-d50 0.116 0.073 0.233)</code></td>
    <td>
      x <span class="fade">[0, 1]</span>;
      y <span class="fade">[0, 1]</span>;
      z <span class="fade">[0, 1]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>lab</code></th>
    <td><code>lab(32.4% 38.4 -47.7)</code></td>
    <td>
      lightness <span class="fade">[0%, 100%]</span>;
      a <span class="fade">[-125, 125]</span>;
      b <span class="fade">[-125, 125]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>lch</code></th>
    <td><code>lch(32.4% 61.2 308.9deg)</code></td>
    <td>
      lightness <span class="fade">[0%, 100%]</span>;
      chroma <span class="fade">[0, 150]</span>;
      hue <span class="fade">[0deg, 360deg]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>oklab</code></th>
    <td><code>oklab(44% 0.088 -0.134)</code></td>
    <td>
      lightness <span class="fade">[0%, 100%]</span>;
      a <span class="fade">[-0.4, 0.4]</span>;
      b <span class="fade">[-0.4, 0.4]</span>
    </td>
  </tr>
  <tr>
    <th scope="row"><code>oklch</code></th>
    <td><code>oklch(44% 0.16 303.4deg)</code></td>
    <td>
      lightness <span class="fade">[0%, 100%]</span>;
      chroma <span class="fade">[0, 0.4]</span>;
      hue <span class="fade">[0deg, 360deg]</span>
    </td>
  </tr>
</table>

Spaces marked with * are [legacy color spaces].

[legacy color spaces]: #legacy-color-spaces

## Missing Channels

Colors in CSS and Sass can have "missing channels", which are written `none` and
represent a channel whose value isn't known or doesn't affect the way the color
is rendered. For example, you might write `hsl(none 0% 50%)`, because the hue
doesn't matter if the saturation is `0%`. In most cases, missing channels are
just treated as 0 values, but they do come up occasionally:

* If you're mixing colors together, either as part of CSS interpolation for
  something like an animation or using Sass's [`color.mix()`] function, missing
  channels always take on the other color's value for that channel if possible.

  [`color.mix()`]: /documentation/modules/color#mix

* If you convert a color with a missing channel to another space that has an
  analogous channel, that channel will be set to `none` after the conversion is
  complete.

Although [`color.channel()`] will return 0 for missing channels, you can always
check for them using [`color.is-missing()`].

[`color.channel()`]: /documentation/modules/color#channel
[`color.is-missing()`]: /documentation/modules/color#is-missing

{% codeExample 'missing-channels', false %}
  @use 'sass:color';

  $grey: hsl(none 0% 50%);

  @debug color.mix($grey, blue, $method: hsl); // hsl(240, 50%, 50%)
  @debug color.to-space($grey, lch); // lch(53.3889647411% 0 none)
  ===
  @use 'sass:color'

  $grey: hsl(none 0% 50%)

  @debug color.mix($grey, blue, $method: hsl)  // hsl(240, 50%, 50%)
  @debug color.to-space($grey, lch)  // lch(53.3889647411% 0 none)
{% endcodeExample %}

### Powerless Channels

A color channel is considered "powerless" under certain circumstances its value
doesn't affect the way the color is rendered on screen. The CSS spec requires
that when a color is converted to a new space, any powerless channels are
replaced by `none`. Sass does this in all cases except conversions to legacy
spaces, to guarantee that converting to a legacy space always produces a color
that's compatible with older browsers.

For more details on powerless channels, see [`color.is-powerless()`].

[`color.is-powerless()`]: /documentation/modules/color#is-powerless

## Legacy Color Spaces

Historically, CSS and Sass only supported the standard RGB gamut, and only
supported the `rgb`, `hsl`, and `hwb` functions for defining colors. Because at
the time all colors used the same gamut, every color function worked with every
color regardless of its color space. Sass still preserves this behavior, but
only for older functions and only for colors in these three "legacy" color
spaces. Even so, it's still a good practice to explicitly specify the `$space`
you want to work in when using color functions.

Sass will also freely convert between different legacy color spaces when
converting legacy color values to CSS. This is always safe, because they all use
the same underlying color model, and this helps ensure that Sass emits colors in
as compatible a format as possible.

## Color Functions

Sass supports many useful [color functions] that can be used to create new
colors based on existing ones by [mixing colors together] or [scaling their
channel values]. When calling color functions, color spaces should always be
written as unquoted strings to match CSS, while channel names should be written
as quoted strings so that channels like `"red"` aren't parsed as color values.

[mixing colors together]: /documentation/modules/color#mix
[scaling their channel values]: /documentation/modules/color#scale

{% funFact %}
  Sass color functions can automatically convert colors between spaces, which
  makes it easy to do transformations in perceptually-uniform color spaces like
  Oklch. But they'll *always* return a color in the same space you gave it,
  unless you explicitly call [`color.to-space()`] to convert it.

  [`color.to-space()`]: /documentation/modules/color#to-space
{% endfunFact %}

{% codeExample 'color-formats', false %}
  @use 'sass:color';

  $venus: #998099;

  @debug color.scale($venus, $lightness: +15%, $space: oklch);
  // rgb(170.1523703626, 144.612080603, 170.1172627174)
  @debug color.mix($venus, midnightblue, $method: oklch);
  // rgb(95.9363315581, 74.5687109346, 133.2082569526)
  ===
  @use 'sass:color'

  $venus: #998099

  @debug color.scale($venus, $lightness: +15%, $space: oklch)
  // rgb(170.1523703626, 144.612080603, 170.1172627174)
  @debug color.mix($venus, midnightblue, $method: oklch)
  // rgb(95.9363315581, 74.5687109346, 133.2082569526)
{% endcodeExample %}

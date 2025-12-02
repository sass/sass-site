---
title: Built-In Modules
eleventyComputed:
  before_introduction: >
    {% render 'doc_snippets/built-in-module-status' %}
introduction: >
  Sass provides many built-in modules which contain useful functions (and the
  occasional mixin). These modules can be loaded with the [`@use`
  rule](/documentation/at-rules/use) like any user-defined stylesheet, and their
  functions can be called [like any other module
  member](/documentation/at-rules/use#loading-members). All built-in module URLs
  begin with `sass:` to indicate that they're part of Sass itself.
---

{% headsUp %}
  Before the Sass module system was introduced, all Sass functions were globally
  available at all times. Many functions still have global aliases (these are
  listed in their documentation). The Sass team discourages their use and will
  eventually deprecate them, but for now they remain available for compatibility
  with older Sass versions and with LibSass (which doesn't support the module
  system yet).

  [A few functions][] are *only* available globally even in the new module
  system because they add extra behavior on top of built-in CSS functions.

  [a few functions]: #global-functions
  [`rgb()`]: #rgb
  [`hsl()`]: #hsl
{% endheadsUp %}

{% codeExample 'modules' %}
  @use "sass:color";

  .button {
    $primary-color: #6b717f;
    color: $primary-color;
    border: 1px solid color.scale($primary-color, $lightness: 20%);
  }
  ===
  @use "sass:color"

  .button
    $primary-color: #6b717f
    color: $primary-color
    border: 1px solid color.scale($primary-color, $lightness: 20%)
{% endcodeExample %}

Sass provides the following built-in modules:

* The [`sass:math` module][] provides functions that operate on [numbers][].

* The [`sass:string` module][] makes it easy to combine, search, or split apart
  [strings][].

* The [`sass:color` module][] generates new [colors][] based on existing ones,
  making it easy to build color themes.

* The [`sass:list` module][] lets you access and modify values in [lists][].

* The [`sass:map` module][] makes it possible to look up the value associated
  with a key in a [map][], and much more.

* The [`sass:selector` module][] provides access to Sass's powerful selector
  engine.

* The [`sass:meta` module][] exposes the details of Sass's inner workings.

[`sass:math` module]: /documentation/modules/math
[numbers]: /documentation/values/numbers
[`sass:string` module]: /documentation/modules/string
[strings]: /documentation/values/strings
[`sass:color` module]: /documentation/modules/color
[colors]: /documentation/values/colors
[`sass:list` module]: /documentation/modules/list
[lists]: /documentation/values/lists
[`sass:map` module]: /documentation/modules/map
[map]: /documentation/values/maps
[`sass:selector` module]: /documentation/modules/selector
[`sass:meta` module]: /documentation/modules/meta

## Global Functions

{% funFact %}
  You can pass [special functions] like `calc()` or `var()` in place of any
  argument to a global color constructor. You can even use `var()` in place of
  multiple arguments, since it might be replaced by multiple values! When a
  color function is called this way, it returns an unquoted string using the
  same signature it was called with.

  [special functions]: /documentation/syntax/special-functions

  {% codeExample 'color-special', false %}
    @debug rgb(0 51 102 / var(--opacity)); // rgb(0 51 102 / var(--opacity))
    @debug color(display-p3 var(--peach)); // color(display-p3 var(--peach))
    ===
    @debug rgb(0 51 102 / var(--opacity))  // rgb(0 51 102 / var(--opacity))
    @debug color(display-p3 var(--peach))  // color(display-p3 var(--peach))
  {% endcodeExample %}
{% endfunFact %}

{% function 'color($space $channel1 $channel2 $channel3)', 'color($space $channel1 $channel2 $channel3 / $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color in the given color space with the given channel values.

  This supports the color spaces `srgb`, `srgb-linear`, `display-p3`, `a98-rgb`,
  `prophoto-rgb`, `rec2020`, `xyz`, and `xyz-d50`, as well as `xyz-d65` which is
  an alias for `xyz`. For all spaces, the channels are numbers between 0 and 1
  (inclusive) or percentages between `0%` and `100%` (inclusive).
  
  If any color channel is outside the range 0 to 1, this represents a color
  outside the standard gamut for its color space.

  {% codeExample 'hsl', false %}
    @debug color(srgb 0.1 0.6 1); // color(srgb 0.1 0.6 1)
    @debug color(xyz 30% 0% 90% / 50%); // color(xyz 0.3 0 0.9 / 50%)
    ===
    @debug color(srgb 0.1 0.6 1)  // color(srgb 0.1 0.6 1)
    @debug color(xyz 30% 0% 90% / 50%)  // color(xyz 0.3 0 0.9 / 50%)
  {% endcodeExample %}
{% endfunction %}

{% function 'hsl($hue $saturation $lightness)', 'hsl($hue $saturation $lightness / $alpha)', 'hsl($hue, $saturation, $lightness, $alpha: 1)', 'hsla($hue $saturation $lightness)', 'hsla($hue $saturation $lightness / $alpha)', 'hsla($hue, $saturation, $lightness, $alpha: 1)', 'returns:color' %}
  {% compatibility 'dart: "1.15.0"', 'libsass: false', 'ruby: false', 'feature: "Level 4 Syntax"' %}
    LibSass and Ruby Sass only support the following signatures:

    * `hsl($hue, $saturation, $lightness)`
    * `hsla($hue, $saturation, $lightness, $alpha)`

    Note that for these implementations, the `$alpha` argument is *required* if
    the function name `hsla()` is used, and *forbidden* if the function name
    `hsl()` is used.
  {% endcompatibility %}

  {% compatibility 'dart: true', 'libsass: false', 'ruby: "3.7.0"', 'feature: "Percent Alpha"' %}
    LibSass and older versions of Ruby Sass don't support alpha values specified
    as percentages.
  {% endcompatibility %}

  Returns a color with the given [hue, saturation, and lightness][] and the
  given alpha channel.

  [hue, saturation, and lightness]: https://en.wikipedia.org/wiki/HSL_and_HSV

  The hue is a number between `0deg` and `360deg` (inclusive) and may be
  unitless. The saturation and lightness are typically numbers between `0%` and
  `100%` (inclusive) and may *not* be unitless. The alpha channel can be
  specified as either a unitless number between 0 and 1 (inclusive), or a
  percentage between `0%` and `100%` (inclusive).

  A hue outside `0deg` and `360deg` is equivalent to `$hue % 360deg`. A
  saturation less than `0%` is clamped to `0%`. A saturation above `100%` or a
  lightness outside `0%` and `100%` are both allowed, and represent colors
  outside the standard RGB gamut.

  {% headsUp %}
    Sass's [special parsing rules][] for slash-separated values make it
    difficult to pass variables for `$lightness` or `$alpha` when using the
    `hsl($hue $saturation $lightness / $alpha)` signature. Consider using
    `hsl($hue, $saturation, $lightness, $alpha)` instead.

    [special parsing rules]: /documentation/operators/numeric#slash-separated-values
  {% endheadsUp %}

  {% codeExample 'hsl', false %}
    @debug hsl(210deg 100% 20%); // #036
    @debug hsl(210deg 100% 20% / 50%); // rgba(0, 51, 102, 0.5)
    @debug hsla(34, 35%, 92%, 0.2); // rgba(241.74, 235.552, 227.46, 0.2)
    ===
    @debug hsl(210deg 100% 20%) // #036
    @debug hsl(210deg 100% 20% / 50%)  // rgba(0, 51, 102, 0.5)
    @debug hsla(34, 35%, 92%, 0.2)  // rgba(241.74, 235.552, 227.46, 0.2)
  {% endcodeExample %}
{% endfunction %}

{% function 'hwb($hue $whiteness $blackness)', 'hwb($hue $whiteness $blackness / $alpha)', 'color.hwb($hue $whiteness $blackness)', 'color.hwb($hue $whiteness $blackness / $alpha)', 'color.hwb($hue, $whiteness, $blackness, $alpha: 1)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [hue, whiteness, and blackness] and the
  given alpha channel.

  [hue, whiteness, and blackness]: https://en.wikipedia.org/wiki/HWB_color_model

  The hue is a number between `0deg` and `360deg` (inclusive) and may be
  unitless. The whiteness and blackness are numbers typically between `0%` and
  `100%` (inclusive) and may *not* be unitless. The alpha channel can be
  specified as either a unitless number between 0 and 1 (inclusive), or a
  percentage between `0%` and `100%` (inclusive).

  A hue outside `0deg` and `360deg` is equivalent to `$hue % 360deg`. If
  `$whiteness + $blackness > 100%`, the two values are scaled so that they add
  up to `100%`. If `$whiteness`, `$blackness`, or both are less than `0%`, this
  represents a color outside the standard RGB gamut.
  
  {% headsUp %}
    The `color.hwb()` variants are deprecated. New Sass code should use the
    global `hwb()` function instead.
  {% endheadsUp %}

  {% codeExample 'hwb', false %}
    @debug hwb(210deg 0% 60%); // #036
    @debug hwb(210 0% 60% / 0.5); // rgba(0, 51, 102, 0.5)
    ===
    @debug hwb(210deg 0% 60%)  // #036
    @debug hwb(210 0% 60% / 0.5)  // rgba(0, 51, 102, 0.5)
  {% endcodeExample %}
{% endfunction %}

{% function 'lab($lightness $a $b)', 'lab($lightness $a $b / $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [lightness, a, b], and alpha channels.

  [hue, whiteness, and blackness]: https://en.wikipedia.org/wiki/CIELAB_color_space

  The lightness is a number between `0%` and `100%` (inclusive) and may be
  unitless. The a and b channels can be specified as either [unitless] numbers
  between -125 and 125 (inclusive), or percentages between `-100%` and `100%`
  (inclusive). The alpha channel can be specified as either a unitless number
  between 0 and 1 (inclusive), or a percentage between `0%` and `100%`
  (inclusive).

  [unitless]: /documentation/values/numbers#units

  A lightness outside the range `0%` and `100%` is clamped to be within that
  range. If the a or b channels are outside the range `-125` to `125`, this
  represents a color outside the standard CIELAB gamut.

  {% codeExample 'lab', false %}
    @debug lab(50% -20 30); // lab(50% -20 30)
    @debug lab(80% 0% 20% / 0.5); // lab(80% 0 25 / 0.5);
    ===
    @debug lab(50% -20 30)  // lab(50% -20 30)
    @debug lab(80% 0% 20% / 0.5)  // lab(80% 0 25 / 0.5);
  {% endcodeExample %}
{% endfunction %}

{% function 'lch($lightness $chroma $hue)', 'lch($lightness $chroma $hue / $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [lightness, chroma, and hue], and the given
  alpha channel.

  [hue, whiteness, and blackness]: https://en.wikipedia.org/wiki/CIELAB_color_space#Cylindrical_model

  The lightness is a number between `0%` and `100%` (inclusive) and may be
  unitless. The chroma channel can be specified as either a [unitless] number
  between 0 and 150 (inclusive), or a percentage between `0%` and `100%`
  (inclusive). The hue is a number between `0deg` and `360deg` (inclusive) and
  may be unitless. The alpha channel can be specified as either a unitless
  number between 0 and 1 (inclusive), or a percentage between `0%` and `100%`
  (inclusive).

  [unitless]: /documentation/values/numbers#units

  A lightness outside the range `0%` and `100%` is clamped to be within that
  range. A chroma below 0 is clamped to 0, and a chroma above 150 represents a
  color outside the standard CIELAB gamut. A hue outside `0deg` and `360deg` is
  equivalent to `$hue % 360deg`.

  {% codeExample 'lch', false %}
    @debug lch(50% 10 270deg); // lch(50% 10 270deg)
    @debug lch(80% 50% 0.2turn / 0.5); // lch(80% 75 72deg / 0.5);
    ===
    @debug lch(50% 10 270deg)  // lch(50% 10 270deg)
    @debug lch(80% 50% 0.2turn / 0.5)  // lch(80% 75 72deg / 0.5);
  {% endcodeExample %}
{% endfunction %}

{% function 'oklab($lightness $a $b)', 'oklab($lightness $a $b / $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [perceptually-uniform lightness, a, b], and
  alpha channels.

  [perceptually-uniform lightness, a, b]: https://bottosson.github.io/posts/oklab/

  The lightness is a number between `0%` and `100%` (inclusive) and may be
  unitless. The a and b channels can be specified as either [unitless] numbers
  between -0.4 and 0.4 (inclusive), or percentages between `-100%` and `100%`
  (inclusive). The alpha channel can be specified as either a unitless number
  between 0 and 1 (inclusive), or a percentage between `0%` and `100%`
  (inclusive).

  [unitless]: /documentation/values/numbers#units

  A lightness outside the range `0%` and `100%` is clamped to be within that
  range. If the a or b channels are outside the range `-0.4` to `0.4`, this
  represents a color outside the standard Oklab gamut.

  {% codeExample 'oklab', false %}
    @debug oklab(50% -0.1 0.15); // oklab(50% -0.1 0.15)
    @debug oklab(80% 0% 20% / 0.5); // oklab(80% 0 0.08 / 0.5)
    ===
    @debug oklab(50% -0.1 0.15)  // oklab(50% -0.1 0.15)
    @debug oklab(80% 0% 20% / 0.5)  // oklab(80% 0 0.08 / 0.5)
  {% endcodeExample %}
{% endfunction %}

{% function 'oklch($lightness $chroma $hue)', 'oklch($lightness $chroma $hue / $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [perceptually-uniform lightness, chroma, and
  hue], and the given alpha channel.

  [hue, whiteness, and blackness]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch

  The lightness is a number between `0%` and `100%` (inclusive) and may be
  unitless. The chroma channel can be specified as either a [unitless] number
  between 0 and 0.4 (inclusive), or a percentage between `0%` and `100%`
  (inclusive). The hue is a number between `0deg` and `360deg` (inclusive) and
  may be unitless. The alpha channel can be specified as either a unitless
  number between 0 and 1 (inclusive), or a percentage between `0%` and `100%`
  (inclusive).

  [unitless]: /documentation/values/numbers#units

  A lightness outside the range `0%` and `100%` is clamped to be within that
  range. A chroma below 0 is clamped to 0, and a chroma above 0.4 represents a
  color outside the standard Oklab gamut. A hue outside `0deg` and `360deg` is
  equivalent to `$hue % 360deg`.

  {% codeExample 'oklch', false %}
    @debug oklch(50% 0.3 270deg); // oklch(50% 0.3 270deg)
    @debug oklch(80% 50% 0.2turn / 0.5); // oklch(80% 0.2 72deg / 0.5);
    ===
    @debug oklch(50% 0.3 270deg)  // oklch(50% 0.3 270deg)
    @debug oklch(80% 50% 0.2turn / 0.5)  // oklch(80% 0.2 72deg / 0.5);
  {% endcodeExample %}
{% endfunction %}

{% function 'rgb($red $green $blue)', 'rgb($red $green $blue / $alpha)', 'rgb($red, $green, $blue, $alpha: 1)', 'rgb($color, $alpha)', 'rgba($red $green $blue)', 'rgba($red $green $blue / $alpha)', 'rgba($red, $green, $blue, $alpha: 1)', 'rgba($color, $alpha)', 'returns:color' %}
  {% compatibility 'dart: "1.15.0"', 'libsass: false', 'ruby: false', 'feature: "Level 4 Syntax"' %}
    LibSass and Ruby Sass only support the following signatures:

    * `rgb($red, $green, $blue)`
    * `rgba($red, $green, $blue, $alpha)`
    * `rgba($color, $alpha)`

    Note that for these implementations, the `$alpha` argument is *required* if
    the function name `rgba()` is used, and *forbidden* if the function name
    `rgb()` is used.
  {% endcompatibility %}

  {% compatibility 'dart: true', 'libsass: false', 'ruby: "3.7.0"', 'feature: "Percent Alpha"' %}
    LibSass and older versions of Ruby Sass don't support alpha values specified
    as percentages.
  {% endcompatibility %}

  If `$red`, `$green`, `$blue`, and optionally `$alpha` are passed, returns a
  color with the given red, green, blue, and alpha channels.

  Each channel can be specified as either a [unitless] number between 0 and
  255 (inclusive), or a percentage between `0%` and `100%` (inclusive). The
  alpha channel can be specified as either a unitless number between 0 and 1
  (inclusive), or a percentage between `0%` and `100%` (inclusive).

  [unitless]: /documentation/values/numbers#units

  If any color channel is outside the range 0 to 255, this represents a color
  outside the standard RGB gamut.

  {% headsUp %}
    Sass's [special parsing rules][] for slash-separated values make it
    difficult to pass variables for `$blue` or `$alpha` when using the
    `rgb($red $green $blue / $alpha)` signature. Consider using
    `rgb($red, $green, $blue, $alpha)` instead.

    [special parsing rules]: /documentation/operators/numeric#slash-separated-values
  {% endheadsUp %}

  {% codeExample 'rgb', false %}
    @debug rgb(0 51 102); // #036
    @debug rgb(95%, 92.5%, 89.5%); // #f2ece4
    @debug rgb(0 51 102 / 50%); // rgba(0, 51, 102, 0.5)
    @debug rgba(95%, 92.5%, 89.5%, 0.2); // rgba(242, 236, 228, 0.2)
    ===
    @debug rgb(0 51 102)  // #036
    @debug rgb(95%, 92.5%, 89.5%)  // #f2ece4
    @debug rgb(0 51 102 / 50%)  // rgba(0, 51, 102, 0.5)
    @debug rgba(95%, 92.5%, 89.5%, 0.2)  // rgba(242, 236, 228, 0.2)
  {% endcodeExample %}

  ---

  If `$color` and `$alpha` are passed, this returns `$color` with the given
  `$alpha` channel instead of its original alpha channel.

  {% codeExample 'color-and-alpha', false %}
    @debug rgb(#f2ece4, 50%); // rgba(242, 236, 228, 0.5);
    @debug rgba(rgba(0, 51, 102, 0.5), 1); // #003366
    ===
    @debug rgb(#f2ece4, 50%)  // rgba(242, 236, 228, 0.5)
    @debug rgba(rgba(0, 51, 102, 0.5), 1)  // #003366
  {% endcodeExample %}
{% endfunction %}

## Deprecated Functions

{% function 'if($condition, $if-true, $if-false)' %}
  Returns `$if-true` if `$condition` is [truthy][], and `$if-false` otherwise.

  This function is special in that it doesn't even evaluate the argument that
  isn't returned, so it's safe to call even if the unused argument would throw
  an error.

  [truthy]: /documentation/at-rules/control/if#truthiness-and-falsiness

  {% headsUp %}
    Now that CSS supports its own [`if()` function syntax], Sass is moving to
    use that syntax instead. The old `if()` function is deprecated, although it
    will continue to be supported in Dart Sass until version 3.0.0. See
    [/d/if-function] for more information.

    [`if()` function syntax]: /documentation/syntax/special-functions#if
    [/d/if-function]: /documentation/breaking-changes/if-function
  {% endheadsUp %}

  {% codeExample 'debug', false %}
    @debug if(true, 10px, 15px); // 10px
    @debug if(false, 10px, 15px); // 15px
    @debug if(variable-defined($var), $var, null); // null
    ===
    @debug if(true, 10px, 15px)  // 10px
    @debug if(false, 10px, 15px)  // 15px
    @debug if(variable-defined($var), $var, null)  // null
  {% endcodeExample %}
{% endfunction %}

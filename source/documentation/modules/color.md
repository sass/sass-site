---
title: sass:color
---

{% render 'doc_snippets/built-in-module-status' %}

{% capture color_adjust %}
  color.adjust($color,
    $red: null, $green: null, $blue: null,
    $hue: null, $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $alpha: null)
{% endcapture %}

{% function color_adjust, 'adjust-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Increases or decreases one or more properties of `$color` by fixed amounts.

  Adds the value passed for each keyword argument to the corresponding property
  of the color, and returns the adjusted color. It's an error to specify an RGB
  property (`$red`, `$green`, and/or `$blue`) at the same time as an HSL
  property (`$hue`, `$saturation`, and/or `$lightness`), or either of those at
  the same time as an [HWB][] property (`$hue`, `$whiteness`, and/or
  `$blackness`).

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  All optional arguments must be numbers. The `$red`, `$green`, and `$blue`
  arguments must be [unitless][] and between -255 and 255 (inclusive). The
  `$hue` argument must have either the unit `deg` or no unit. The `$saturation`,
  `$lightness`, `$whiteness`, and `$blackness` arguments must be between `-100%`
  and `100%` (inclusive), and may not be unitless. The `$alpha` argument must be
  unitless and between -1 and 1 (inclusive).

  [unitless]: /documentation/values/numbers#units

  See also:

  * [`color.scale()`](#scale) for fluidly scaling a color's properties.
  * [`color.change()`](#change) for setting a color's properties.

  {% codeExample 'adjust-color' %}
    @use 'sass:color';

    @debug color.adjust(#6b717f, $red: 15); // #7a717f
    @debug color.adjust(#d2e1dd, $red: -10, $blue: 10); // #c8e1e7
    @debug color.adjust(#998099, $lightness: -30%, $alpha: -0.4); // rgba(71, 57, 71, 0.6)
    ===
    @use 'sass:color'

    @debug color.adjust(#6b717f, $red: 15)  // #7a717f
    @debug color.adjust(#d2e1dd, $red: -10, $blue: 10)  // #c8e1e7
    @debug color.adjust(#998099, $lightness: -30%, $alpha: -0.4)  // rgba(71, 57, 71, 0.6)
  {% endcodeExample %}
{% endfunction %}

{% function 'adjust-hue($color, $degrees)', 'returns:color' %}
  Increases or decreases `$color`'s hue.

  The `$hue` must be a number between `-360deg` and `360deg` (inclusive) to add
  to `$color`'s hue. It may be [unitless][] but it may not have any unit other
  than `deg`.

  [unitless]: /documentation/values/numbers#units

  See also [`color.adjust()`](#adjust), which can adjust any property of a
  color.

  {% headsUp %}
    Because `adjust-hue()` is redundant with [`adjust()`](#adjust), it's not
    included directly in the new module system. Instead of `adjust-hue($color,
    $amount)`, you can write [`color.adjust($color, $hue: $amount)`](#adjust).
  {% endheadsUp %}

  {% codeExample 'adjust-hue' %}
    // Hue 222deg becomes 282deg.
    @debug adjust-hue(#6b717f, 60deg); // #796b7f

    // Hue 164deg becomes 104deg.
    @debug adjust-hue(#d2e1dd, -60deg); // #d6e1d2

    // Hue 210deg becomes 255deg.
    @debug adjust-hue(#036, 45); // #1a0066
    ===
    // Hue 222deg becomes 282deg.
    @debug adjust-hue(#6b717f, 60deg)  // #796b7f

    // Hue 164deg becomes 104deg.
    @debug adjust-hue(#d2e1dd, -60deg)  // #d6e1d2

    // Hue 210deg becomes 255deg.
    @debug adjust-hue(#036, 45)  // #1a0066
  {% endcodeExample %}
{% endfunction %}

{% function 'color.alpha($color)', 'alpha($color)', 'opacity($color)', 'returns:number' %}
  Returns the alpha channel of `$color` as a number between 0 and 1.

  As a special case, this supports the Internet Explorer syntax
  `alpha(opacity=20)`, for which it returns an [unquoted string][].

  [unquoted string]: /documentation/values/strings#unquoted

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.

  {% codeExample 'color-alpha' %}
    @use 'sass:color';

    @debug color.alpha(#e1d7d2); // 1
    @debug color.opacity(rgb(210, 225, 221, 0.4)); // 0.4
    @debug alpha(opacity=20); // alpha(opacity=20)
    ===
    @use 'sass:color'

    @debug color.alpha(#e1d7d2)  // 1
    @debug color.opacity(rgb(210, 225, 221, 0.4))  // 0.4
    @debug alpha(opacity=20)  // alpha(opacity=20)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.blackness($color)', 'returns:number' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [HWB][] blackness of `$color` as a number between `0%` and `100%`.

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-blackness' %}
    @use 'sass:color';

    @debug color.blackness(#e1d7d2); // 11.7647058824%
    @debug color.blackness(white); // 0%
    @debug color.blackness(black); // 100%
    ===
    @use 'sass:color'

    @debug color.blackness(#e1d7d2)  // 11.7647058824%
    @debug color.blackness(white)  // 0%
    @debug color.blackness(black)  // 100%
  {% endcodeExample %}
{% endfunction %}

{% function 'color.blue($color)', 'blue($color)', 'returns:number' %}
  Returns the blue channel of `$color` as a number between 0 and 255.

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-blue' %}
    @use 'sass:color';

    @debug color.blue(#e1d7d2); // 210
    @debug color.blue(white); // 255
    @debug color.blue(black); // 0
    ===
    @use 'sass:color'

    @debug color.blue(#e1d7d2)  // 210
    @debug color.blue(white)  // 255
    @debug color.blue(black)  // 0
  {% endcodeExample %}
{% endfunction %}

{% capture color_change %}
  color.change($color,
    $red: null, $green: null, $blue: null,
    $hue: null, $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $alpha: null)
{% endcapture %}

{% function color_change, 'change-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Sets one or more properties of a color to new values.

  Uses the value passed for each keyword argument in place of the corresponding
  property of the color, and returns the changed color. It's an error to specify
  an RGB property (`$red`, `$green`, and/or `$blue`) at the same time as an HSL
  property (`$hue`, `$saturation`, and/or `$lightness`), or either of those at
  the same time as an [HWB][] property (`$hue`, `$whiteness`, and/or
  `$blackness`).

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  All optional arguments must be numbers. The `$red`, `$green`, and `$blue`
  arguments must be [unitless][] and between 0 and 255 (inclusive). The `$hue`
  argument must have either the unit `deg` or no unit. The `$saturation`,
  `$lightness`, `$whiteness`, and `$blackness` arguments must be between `0%`
  and `100%` (inclusive), and may not be unitless. The `$alpha` argument must be
  unitless and between 0 and 1 (inclusive).

  [unitless]: /documentation/values/numbers#units

  See also:

  * [`color.scale()`](#scale) for fluidly scaling a color's properties.
  * [`color.adjust()`](#adjust) for adjusting a color's properties by fixed
  amounts.

  {% codeExample 'color-change' %}
    @use 'sass:color';

    @debug color.change(#6b717f, $red: 100); // #64717f
    @debug color.change(#d2e1dd, $red: 100, $blue: 50); // #64e132
    @debug color.change(#998099, $lightness: 30%, $alpha: 0.5); // rgba(85, 68, 85, 0.5)
    ===
    @use 'sass:color'

    @debug color.change(#6b717f, $red: 100)  // #64717f
    @debug color.change(#d2e1dd, $red: 100, $blue: 50)  // #64e132
    @debug color.change(#998099, $lightness: 30%, $alpha: 0.5)  // rgba(85, 68, 85, 0.5)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.complement($color)', 'complement($color)', 'returns:color' %}
  Returns the RGB [complement][] of `$color`.

  This is identical to [`color.adjust($color, $hue: 180deg)`](#adjust).

  [complement]: https://en.wikipedia.org/wiki/Complementary_colors

  {% codeExample 'color-complement' %}
    @use 'sass:color';

    // Hue 222deg becomes 42deg.
    @debug color.complement(#6b717f); // #7f796b

    // Hue 164deg becomes 344deg.
    @debug color.complement(#d2e1dd); // #e1d2d6

    // Hue 210deg becomes 30deg.
    @debug color.complement(#036); // #663300
    ===
    @use 'sass:color'

    // Hue 222deg becomes 42deg.
    @debug color.complement(#6b717f)  // #7f796b

    // Hue 164deg becomes 344deg.
    @debug color.complement(#d2e1dd)  // #e1d2d6

    // Hue 210deg becomes 30deg.
    @debug color.complement(#036)  // #663300
  {% endcodeExample %}
{% endfunction %}

{% function 'darken($color, $amount)', 'returns:color' %}
  Makes `$color` darker.

  The `$amount` must be a number between `0%` and `100%` (inclusive). Decreases
  the HSL lightness of `$color` by that amount.

  {% headsUp %}
    The `darken()` function decreases lightness by a fixed amount, which is
    often not the desired effect. To make a color a certain percentage darker
    than it was before, use [`color.scale()`](#scale) instead.

    Because `darken()` is usually not the best way to make a color darker, it's
    not included directly in the new module system. However, if you have to
    preserve the existing behavior, `darken($color, $amount)` can be written
    [`color.adjust($color, $lightness: -$amount)`](#adjust).

    {% codeExample 'color-darken' %}
      @use 'sass:color';

      // #036 has lightness 20%, so when darken() subtracts 30% it just returns black.
      @debug darken(#036, 30%); // black

      // scale() instead makes it 30% darker than it was originally.
      @debug color.scale(#036, $lightness: -30%); // #002447
      ===
      @use 'sass:color'

      // #036 has lightness 20%, so when darken() subtracts 30% it just returns black.
      @debug darken(#036, 30%)  // black

      // scale() instead makes it 30% darker than it was originally.
      @debug color.scale(#036, $lightness: -30%)  // #002447
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'color-darken-2' %}
    // Lightness 92% becomes 72%.
    @debug darken(#b37399, 20%); // #7c4465

    // Lightness 85% becomes 45%.
    @debug darken(#f2ece4, 40%); // #b08b5a

    // Lightness 20% becomes 0%.
    @debug darken(#036, 30%); // black
    ===
    // Lightness 92% becomes 72%.
    @debug darken(#b37399, 20%)  // #7c4465

    // Lightness 85% becomes 45%.
    @debug darken(#f2ece4, 40%)  // #b08b5a

    // Lightness 20% becomes 0%.
    @debug darken(#036, 30%)  // black
  {% endcodeExample %}
{% endfunction %}

{% function 'desaturate($color, $amount)', 'returns:color' %}
  Makes `$color` less saturated.

  The `$amount` must be a number between `0%` and `100%` (inclusive). Decreases
  the HSL saturation of `$color` by that amount.

  {% headsUp %}
    The `desaturate()` function decreases saturation by a fixed amount, which is
    often not the desired effect. To make a color a certain percentage less
    saturated than it was before, use [`color.scale()`](#scale) instead.

    Because `desaturate()` is usually not the best way to make a color less
    saturated, it's not included directly in the new module system. However, if
    you have to preserve the existing behavior, `desaturate($color, $amount)`
    can be written [`color.adjust($color, $saturation: -$amount)`](#adjust).

    {% codeExample 'color-desaturate' %}
      @use 'sass:color';

      // #d2e1dd has saturation 20%, so when desaturate() subtracts 30% it just
      // returns gray.
      @debug desaturate(#d2e1dd, 30%); // #dadada

      // scale() instead makes it 30% less saturated than it was originally.
      @debug color.scale(#6b717f, $saturation: -30%); // #6e727c
      ===
      @use 'sass:color'

      // #6b717f has saturation 20%, so when desaturate() subtracts 30% it just
      // returns gray.
      @debug desaturate(#d2e1dd, 30%)  // #dadada

      // scale() instead makes it 30% less saturated than it was originally.
      @debug color.scale(#6b717f, $saturation: -30%)  // #6e727c
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'color-desaturate-2' %}
    // Saturation 100% becomes 80%.
    @debug desaturate(#036, 20%); // #0a335c

    // Saturation 35% becomes 15%.
    @debug desaturate(#f2ece4, 20%); // #eeebe8

    // Saturation 20% becomes 0%.
    @debug desaturate(#d2e1dd, 30%); // #dadada
    ===
    // Saturation 100% becomes 80%.
    @debug desaturate(#036, 20%)  // #0a335c

    // Saturation 35% becomes 15%.
    @debug desaturate(#f2ece4, 20%)  // #eeebe8

    // Saturation 20% becomes 0%.
    @debug desaturate(#d2e1dd, 30%)  // #dadada
  {% endcodeExample %}
{% endfunction %}

{% function 'color.grayscale($color)', 'grayscale($color)', 'returns:color' %}
  Returns a gray color with the same lightness as `$color`.

  This is identical to [`color.change($color, $saturation: 0%)`](#change).

  {% codeExample 'color-grayscale' %}
    @use 'sass:color';

    @debug color.grayscale(#6b717f); // #757575
    @debug color.grayscale(#d2e1dd); // #dadada
    @debug color.grayscale(#036); // #333333
    ===
    @use 'sass:color'

    @debug color.grayscale(#6b717f)  // #757575
    @debug color.grayscale(#d2e1dd)  // #dadada
    @debug color.grayscale(#036)  // #333333
  {% endcodeExample %}
{% endfunction %}

{% function 'color.green($color)', 'green($color)', 'returns:number' %}
  Returns the green channel of `$color` as a number between 0 and 255.

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-green' %}
    @use 'sass:color';

    @debug color.green(#e1d7d2); // 215
    @debug color.green(white); // 255
    @debug color.green(black); // 0
    ===
    @use 'sass:color'

    @debug color.green(#e1d7d2)  // 215
    @debug color.green(white)  // 255
    @debug color.green(black)  // 0
  {% endcodeExample %}
{% endfunction %}

{% function 'color.hue($color)', 'hue($color)', 'returns:number' %}
  Returns the hue of `$color` as a number between `0deg` and `360deg`.

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-hue' %}
    @use 'sass:color';

    @debug color.hue(#e1d7d2); // 20deg
    @debug color.hue(#f2ece4); // 34.2857142857deg
    @debug color.hue(#dadbdf); // 228deg
    ===
    @use 'sass:color'

    @debug color.hue(#e1d7d2)  // 20deg
    @debug color.hue(#f2ece4)  // 34.2857142857deg
    @debug color.hue(#dadbdf)  // 228deg
  {% endcodeExample %}
{% endfunction %}

{% function 'color.hwb($hue $whiteness $blackness)', 'color.hwb($hue $whiteness $blackness / $alpha)', 'color.hwb($hue, $whiteness, $blackness, $alpha: 1)', 'returns:color' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a color with the given [hue, whiteness, and blackness][] and the given
  alpha channel.

  [hue, whiteness, and blackness]: https://en.wikipedia.org/wiki/HWB_color_model

  The hue is a number between `0deg` and `360deg` (inclusive). The whiteness and
  blackness are numbers between `0%` and `100%` (inclusive). The hue may be
  [unitless][], but the whiteness and blackness must have unit `%`. The alpha
  channel can be specified as either a unitless number between 0 and 1
  (inclusive), or a percentage between `0%` and `100%` (inclusive).

  [unitless]: /documentation/values/numbers#units

  {% headsUp %}
    Sass's [special parsing rules][] for slash-separated values make it
    difficult to pass variables for `$blackness` or `$alpha` when using the
    `color.hwb($hue $whiteness $blackness / $alpha)` signature. Consider using
    `color.hwb($hue, $whiteness, $blackness, $alpha)` instead.

    [special parsing rules]: /documentation/operators/numeric#slash-separated-values
  {% endheadsUp %}

  {% codeExample 'color-hwb' %}
    @use 'sass:color';

    @debug color.hwb(210, 0%, 60%); // #036
    @debug color.hwb(34, 89%, 5%); // #f2ece4
    @debug color.hwb(210 0% 60% / 0.5); // rgba(0, 51, 102, 0.5)
    ===
    @use 'sass:color'

    @debug color.hwb(210, 0%, 60%)  // #036
    @debug color.hwb(34, 89%, 5%)  // #f2ece4
    @debug color.hwb(210 0% 60% / 0.5)  // rgba(0, 51, 102, 0.5)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.ie-hex-str($color)', 'ie-hex-str($color)', 'returns:unquoted string' %}
  Returns an unquoted string that represents `$color` in the `#AARRGGBB` format
  expected by Internet Explorer's [`-ms-filter`][] property.

  [`-ms-filter`]: https://learn.microsoft.com/en-us/previous-versions/ms530752(v=vs.85)

  {% codeExample 'color-ie-hex-str' %}
    @use 'sass:color';

    @debug color.ie-hex-str(#b37399); // #FFB37399
    @debug color.ie-hex-str(#808c99); // #FF808C99
    @debug color.ie-hex-str(rgba(242, 236, 228, 0.6)); // #99F2ECE4
    ===
    @use 'sass:color'

    @debug color.ie-hex-str(#b37399); // #FFB37399
    @debug color.ie-hex-str(#808c99); // #FF808C99
    @debug color.ie-hex-str(rgba(242, 236, 228, 0.6)); // #99F2ECE4
  {% endcodeExample %}
{% endfunction %}

{% function 'color.invert($color, $weight: 100%)', 'invert($color, $weight: 100%)', 'returns:color' %}
  Returns the inverse or [negative][] of `$color`.

  [negative]: https://en.wikipedia.org/wiki/Negative_(photography)

  The `$weight` must be a number between `0%` and `100%` (inclusive). A higher
  weight means the result will be closer to the negative, and a lower weight
  means it will be closer to `$color`. Weight `50%` will always produce
  `#808080`.

  {% codeExample 'color-invert' %}
    @use 'sass:color';

    @debug color.invert(#b37399); // #4c8c66
    @debug color.invert(black); // white
    @debug color.invert(#550e0c, 20%); // #663b3a
    ===
    @use 'sass:color'

    @debug color.invert(#b37399)  // #4c8c66
    @debug color.invert(black)  // white
    @debug color.invert(#550e0c, 20%)  // #663b3a
  {% endcodeExample %}
{% endfunction %}

{% function 'lighten($color, $amount)', 'returns:color' %}
  Makes `$color` lighter.

  The `$amount` must be a number between `0%` and `100%` (inclusive). Increases
  the HSL lightness of `$color` by that amount.

  {% headsUp %}
    The `lighten()` function increases lightness by a fixed amount, which is
    often not the desired effect. To make a color a certain percentage lighter
    than it was before, use [`scale()`](#scale) instead.

    Because `lighten()` is usually not the best way to make a color lighter,
    it's not included directly in the new module system. However, if you have to
    preserve the existing behavior, `lighten($color, $amount)` can be written
    [`adjust($color, $lightness: $amount)`](#adjust).

    {% codeExample 'color-lighten' %}
      @use 'sass:color';

      // #e1d7d2 has lightness 85%, so when lighten() adds 30% it just returns white.
      @debug lighten(#e1d7d2, 30%); // white

      // scale() instead makes it 30% lighter than it was originally.
      @debug color.scale(#e1d7d2, $lightness: 30%); // #eae3e0
      ===
      @use 'sass:color'

      // #e1d7d2 has lightness 85%, so when lighten() adds 30% it just returns white.
      @debug lighten(#e1d7d2, 30%)  // white

      // scale() instead makes it 30% lighter than it was originally.
      @debug color.scale(#e1d7d2, $lightness: 30%)  // #eae3e0
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'color-lighten-2' %}
    // Lightness 46% becomes 66%.
    @debug lighten(#6b717f, 20%); // #a1a5af

    // Lightness 20% becomes 80%.
    @debug lighten(#036, 60%); // #99ccff

    // Lightness 85% becomes 100%.
    @debug lighten(#e1d7d2, 30%); // white
    ===
    // Lightness 46% becomes 66%.
    @debug lighten(#6b717f, 20%)  // #a1a5af

    // Lightness 20% becomes 80%.
    @debug lighten(#036, 60%)  // #99ccff

    // Lightness 85% becomes 100%.
    @debug lighten(#e1d7d2, 30%)  // white
  {% endcodeExample %}
{% endfunction %}

{% function 'color.lightness($color)', 'lightness($color)', 'returns:number' %}
  Returns the HSL lightness of `$color` as a number between `0%` and `100%`.

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-lightness' %}
    @use 'sass:color';

    @debug color.lightness(#e1d7d2); // 85.2941176471%
    @debug color.lightness(#f2ece4); // 92.1568627451%
    @debug color.lightness(#dadbdf); // 86.4705882353%
    ===
    @use 'sass:color'

    @debug color.lightness(#e1d7d2)  // 85.2941176471%
    @debug color.lightness(#f2ece4)  // 92.1568627451%
    @debug color.lightness(#dadbdf)  // 86.4705882353%
  {% endcodeExample %}
{% endfunction %}

{% function 'color.mix($color1, $color2, $weight: 50%)', 'mix($color1, $color2, $weight: 50%)', 'returns:color' %}
  Returns a color that's a mixture of `$color1` and `$color2`.

  Both the `$weight` and the relative opacity of each color determines how much
  of each color is in the result. The `$weight` must be a number between `0%`
  and `100%` (inclusive). A larger weight indicates that more of `$color1`
  should be used, and a smaller weight indicates that more of `$color2` should
  be used.

  {% codeExample 'color-mix' %}
    @use 'sass:color';

    @debug color.mix(#036, #d2e1dd); // #698aa2
    @debug color.mix(#036, #d2e1dd, 75%); // #355f84
    @debug color.mix(#036, #d2e1dd, 25%); // #9eb6bf
    @debug color.mix(rgba(242, 236, 228, 0.5), #6b717f); // rgba(141, 144, 152, 0.75)
    ===
    @use 'sass:color'

    @debug color.mix(#036, #d2e1dd)  // #698aa2
    @debug color.mix(#036, #d2e1dd, 75%)  // #355f84
    @debug color.mix(#036, #d2e1dd, 25%)  // #9eb6bf
    @debug color.mix(rgba(242, 236, 228, 0.5), #6b717f)  // rgba(141, 144, 152, 0.75)
  {% endcodeExample %}
{% endfunction %}

{% function 'opacify($color, $amount)', 'fade-in($color, $amount)', 'returns:color' %}
  Makes `$color` more opaque.

  The `$amount` must be a number between `0` and `1` (inclusive). Increases the
  alpha channel of `$color` by that amount.

  {% headsUp %}
    The `opacify()` function increases the alpha channel by a fixed amount,
    which is often not the desired effect. To make a color a certain percentage
    more opaque than it was before, use [`scale()`](#scale) instead.

    Because `opacify()` is usually not the best way to make a color more opaque,
    it's not included directly in the new module system. However, if you have to
    preserve the existing behavior, `opacify($color, $amount)` can be written
    [`adjust($color, $alpha: -$amount)`](#adjust).

    {% codeExample 'color-opacify' %}
      @use 'sass:color';

      // rgba(#036, 0.7) has alpha 0.7, so when opacify() adds 0.3 it returns a fully
      // opaque color.
      @debug opacify(rgba(#036, 0.7), 0.3); // #036

      // scale() instead makes it 30% more opaque than it was originally.
      @debug color.scale(rgba(#036, 0.7), $alpha: 30%); // rgba(0, 51, 102, 0.79)
      ===
      @use 'sass:color'

      // rgba(#036, 0.7) has alpha 0.7, so when opacify() adds 0.3 it returns a fully
      // opaque color.
      @debug opacify(rgba(#036, 0.7), 0.3)  // #036

      // scale() instead makes it 30% more opaque than it was originally.
      @debug color.scale(rgba(#036, 0.7), $alpha: 30%)  // rgba(0, 51, 102, 0.79)
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'color-opacify-2' %}
    @debug opacify(rgba(#6b717f, 0.5), 0.2); // rgba(107, 113, 127, 0.7)
    @debug fade-in(rgba(#e1d7d2, 0.5), 0.4); // rgba(225, 215, 210, 0.9)
    @debug opacify(rgba(#036, 0.7), 0.3); // #036
    ===
    @debug opacify(rgba(#6b717f, 0.5), 0.2)  // rgba(107, 113, 127, 0.7)
    @debug fade-in(rgba(#e1d7d2, 0.5), 0.4)  // rgba(225, 215, 210, 0.9)
    @debug opacify(rgba(#036, 0.7), 0.3)  // #036
  {% endcodeExample %}
{% endfunction %}

{% function 'color.red($color)', 'red($color)', 'returns:number' %}
  Returns the red channel of `$color` as a number between 0 and 255.

  See also:

  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-red' %}
    @use 'sass:color';

    @debug color.red(#e1d7d2); // 225
    @debug color.red(white); // 255
    @debug color.red(black); // 0
    ===
    @use 'sass:color'

    @debug color.red(#e1d7d2)  // 225
    @debug color.red(white)  // 255
    @debug color.red(black)  // 0
  {% endcodeExample %}
{% endfunction %}

{% function 'color.saturate($color, $amount)', 'saturate($color, $amount)', 'returns:color' %}
  Makes `$color` more saturated.

  The `$amount` must be a number between `0%` and `100%` (inclusive). Increases
  the HSL saturation of `$color` by that amount.

  {% headsUp %}
    The `saturate()` function increases saturation by a fixed amount, which is
    often not the desired effect. To make a color a certain percentage more
    saturated than it was before, use [`scale()`](#scale) instead.

    Because `saturate()` is usually not the best way to make a color more
    saturated, it's not included directly in the new module system. However, if
    you have to preserve the existing behavior, `saturate($color, $amount)` can
    be written [`adjust($color, $saturation: $amount)`](#adjust).

    {% codeExample 'color-saturate' %}
      @use 'sass:color';

      // #0e4982 has saturation 80%, so when saturate() adds 30% it just becomes
      // fully saturated.
      @debug saturate(#0e4982, 30%); // #004990

      // scale() instead makes it 30% more saturated than it was originally.
      @debug color.scale(#0e4982, $saturation: 30%); // #0a4986
      ===
      @use 'sass:color'

      // #0e4982 has saturation 80%, so when saturate() adds 30% it just becomes
      // fully saturated.
      @debug saturate(#0e4982, 30%)  // #004990

      // scale() instead makes it 30% more saturated than it was originally.
      @debug color.scale(#0e4982, $saturation: 30%)  // #0a4986
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'color-saturate-2' %}
    // Saturation 50% becomes 70%.
    @debug saturate(#c69, 20%); // #e05299

    // Saturation 35% becomes 85%.
    @debug desaturate(#f2ece4, 50%); // #ebebeb

    // Saturation 80% becomes 100%.
    @debug saturate(#0e4982, 30%)  // #004990
    ===
    // Saturation 50% becomes 70%.
    @debug saturate(#c69, 20%); // #e05299

    // Saturation 35% becomes 85%.
    @debug desaturate(#f2ece4, 50%); // #ebebeb

    // Saturation 80% becomes 100%.
    @debug saturate(#0e4982, 30%)  // #004990
  {% endcodeExample %}
{% endfunction %}

{% function 'color.saturation($color)', 'saturation($color)', 'returns:number' %}
  Returns the HSL saturation of `$color` as a number between `0%` and `100%`.

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.blue()`](#blue) for getting a color's blue channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.whiteness()`](#whiteness) for getting a color's whiteness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-saturation' %}
    @use 'sass:color';

    @debug color.saturation(#e1d7d2); // 20%
    @debug color.saturation(#f2ece4); // 30%
    @debug color.saturation(#dadbdf); // 7.2463768116%
    ===
    @use 'sass:color'

    @debug color.saturation(#e1d7d2)  // 20%
    @debug color.saturation(#f2ece4)  // 30%
    @debug color.saturation(#dadbdf)  // 7.2463768116%
  {% endcodeExample %}
{% endfunction %}

{% capture color_scale %}
  color.scale($color,
    $red: null, $green: null, $blue: null,
    $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $alpha: null)
{% endcapture %}

{% function color_scale, 'scale-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Fluidly scales one or more properties of `$color`.

  Each keyword argument must be a number between `-100%` and `100%` (inclusive).
  This indicates how far the corresponding property should be moved from its
  original position towards the maximum (if the argument is positive) or the
  minimum (if the argument is negative). This means that, for example,
  `$lightness: 50%` will make all colors `50%` closer to maximum lightness
  without making them fully white.

  It's an error to specify an RGB property (`$red`, `$green`, and/or `$blue`) at
  the same time as an HSL property (`$saturation`, and/or `$lightness`), or
  either of those at the same time as an [HWB][] property (`$whiteness`, and/or
  `$blackness`).

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  See also:

  * [`color.adjust()`](#adjust) for changing a color's properties by fixed
    amounts.
  * [`color.change()`](#change) for setting a color's properties.

  {% codeExample 'color-scale' %}
    @use 'sass:color';

    @debug color.scale(#6b717f, $red: 15%); // #81717f
    @debug color.scale(#d2e1dd, $lightness: -10%, $saturation: 10%); // #b3d4cb
    @debug color.scale(#998099, $alpha: -40%); // rgba(153, 128, 153, 0.6)
    ===
    @use 'sass:color'

    @debug color.scale(#6b717f, $red: 15%)  // #81717f
    @debug color.scale(#d2e1dd, $lightness: -10%, $saturation: 10%)  // #b3d4cb
    @debug color.scale(#998099, $alpha: -40%)  // rgba(153, 128, 153, 0.6)
  {% endcodeExample %}
{% endfunction %}

{% function 'transparentize($color, $amount)', 'fade-out($color, $amount)', 'returns:color' %}
  Makes `$color` more transparent.

  The `$amount` must be a number between `0` and `1` (inclusive). Decreases the
  alpha channel of `$color` by that amount.

  {% headsUp %}
    The `transparentize()` function decreases the alpha channel by a fixed
    amount, which is often not the desired effect. To make a color a certain
    percentage more transparent than it was before, use
    [`color.scale()`](#scale) instead.

    Because `transparentize()` is usually not the best way to make a color more
    transparent, it's not included directly in the new module system. However,
    if you have to preserve the existing behavior, `transparentize($color,
    $amount)` can be written [`color.adjust($color, $alpha:
    -$amount)`](#adjust).

    {% codeExample 'transparentize' %}
      @use 'sass:color';

      // rgba(#036, 0.3) has alpha 0.3, so when transparentize() subtracts 0.3 it
      // returns a fully transparent color.
      @debug transparentize(rgba(#036, 0.3), 0.3); // rgba(0, 51, 102, 0)

      // scale() instead makes it 30% more transparent than it was originally.
      @debug color.scale(rgba(#036, 0.3), $alpha: -30%); // rgba(0, 51, 102, 0.21)
      ===
      @use 'sass:color'

      // rgba(#036, 0.3) has alpha 0.3, so when transparentize() subtracts 0.3 it
      // returns a fully transparent color.
      @debug transparentize(rgba(#036, 0.3), 0.3)  // rgba(0, 51, 102, 0)

      // scale() instead makes it 30% more transparent than it was originally.
      @debug color.scale(rgba(#036, 0.3), $alpha: -30%)  // rgba(0, 51, 102, 0.21)
    {% endcodeExample %}
  {% endheadsUp %}

  {% codeExample 'transparentize-2' %}
    @debug transparentize(rgba(#6b717f, 0.5), 0.2);  // rgba(107, 113, 127, 0.3)
    @debug fade-out(rgba(#e1d7d2, 0.5), 0.4);  // rgba(225, 215, 210, 0.1)
    @debug transparentize(rgba(#036, 0.3), 0.3);  // rgba(0, 51, 102, 0)
    ===
    @debug transparentize(rgba(#6b717f, 0.5), 0.2)  // rgba(107, 113, 127, 0.3)
    @debug fade-out(rgba(#e1d7d2, 0.5), 0.4)  // rgba(225, 215, 210, 0.1)
    @debug transparentize(rgba(#036, 0.3), 0.3)  // rgba(0, 51, 102, 0)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.whiteness($color)', 'returns:number' %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the [HWB][] whiteness of `$color` as a number between `0%` and `100%`.

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  See also:

  * [`color.red()`](#red) for getting a color's red channel.
  * [`color.green()`](#green) for getting a color's green channel.
  * [`color.hue()`](#hue) for getting a color's hue.
  * [`color.saturation()`](#saturation) for getting a color's saturation.
  * [`color.lightness()`](#lightness) for getting a color's lightness.
  * [`color.blackness()`](#blackness) for getting a color's blackness.
  * [`color.alpha()`](#alpha) for getting a color's alpha channel.

  {% codeExample 'color-whiteness' %}
    @use 'sass:color';

    @debug color.whiteness(#e1d7d2); // 82.3529411765%
    @debug color.whiteness(white); // 100%
    @debug color.whiteness(black); // 0%
    ===
    @use 'sass:color'

    @debug color.whiteness(#e1d7d2)  // 82.3529411765%
    @debug color.whiteness(white)  // 100%
    @debug color.whiteness(black)  // 0%
  {% endcodeExample %}
{% endfunction %}

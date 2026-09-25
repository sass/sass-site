---
title: sass:color
---

{% render 'doc_snippets/built-in-module-status' %}

{% capture color_adjust %}
  color.adjust($color,
    $red: null, $green: null, $blue: null,
    $hue: null, $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $x: null, $y: null, $z: null,
    $chroma: null,
    $alpha: null,
    $space: null)
{% endcapture %}

{% function color_adjust, 'adjust-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$x, $y, $z, $chroma, and $space"' %}{% endcompatibility %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Increases or decreases one or more channels of `$color` by fixed amounts.

  Adds the value passed for each keyword argument to the corresponding channel
  of the color, and returns the adjusted color. By default, this can only adjust
  channels in `$color`'s space, but a different color space can be passed as
  `$space` to adjust channels there instead. This always returns a color in the
  same space as `$color`.

  {% headsUp %}
    For historical reasons, if `$color` is in a [legacy color space], _any_
    legacy color space channels can be adjusted. However, it's an error to
    specify an RGB channel (`$red`, `$green`, and/or `$blue`) at the same time
    as an HSL channel (`$hue`, `$saturation`, and/or `$lightness`), or either of
    those at the same time as an [HWB] channel (`$hue`, `$whiteness`, and/or
    `$blackness`).

    [legacy color space]: /documentation/values/colors#legacy-color-spaces
    [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

    Even so, it's a good idea to pass `$space` explicitly even for legacy colors.
  {% endheadsUp %}

  All channel arguments must be numbers, and must be units that could be passed
  for those channels in the color space's constructor. If the existing channel
  value plus the adjustment value is outside the channel's native range, it's
  clamped for:
  
  * red, green, and blue channels for the `rgb` space;
  * lightness channel for the `lab`, `lch`, `oklab`, and `oklch` spaces;
  * the lower bound of the saturation and chroma channels for the `hsl`, `lch`,
    and `oklch` spaces;
  * and the alpha channel for all spaces.

  See also:

  * [`color.scale()`](#scale) for fluidly scaling a color's properties.
  * [`color.change()`](#change) for setting a color's properties.

  {% codeExample 'adjust-color', false %}
    @use 'sass:color';

    @debug color.adjust(#6b717f, $red: 15); // #7a717f
    @debug color.adjust(lab(40% 30 40), $lightness: 10%, $a: -20); // lab(50% 10 40)
    @debug color.adjust(#d2e1dd, $hue: 45deg, $space: oklch);
    // rgb(209.7987626149, 223.8632000471, 229.3988769575)
    ===
    @use 'sass:color'

    @debug color.adjust(#6b717f, $red: 15)  // #7a717f
    @debug color.adjust(lab(40% 30 40), $lightness: 10%, $a: -20)  // lab(50% 10 40)
    @debug color.adjust(#d2e1dd, $hue: 45deg, $space: oklch)
    // rgb(209.7987626149, 223.8632000471, 229.3988769575)
  {% endcodeExample %}
{% endfunction %}

{% capture color_change %}
  color.change($color,
    $red: null, $green: null, $blue: null,
    $hue: null, $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $x: null, $y: null, $z: null,
    $chroma: null,
    $alpha: null,
    $space: null)
{% endcapture %}

{% function color_change, 'change-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$x, $y, $z, $chroma, and $space"' %}{% endcompatibility %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Sets one or more channels of a color to new values.

  Uses the value passed for each keyword argument in place of the corresponding
  color channel, and returns the changed color. By default, this can only change
  channels in `$color`'s space, but a different color space can be passed as
  `$space` to adjust channels there instead. This always returns a color in the
  same space as `$color`.

  {% headsUp %}

    For historical reasons, if `$color` is in a [legacy color space], _any_
    legacy color space channels can be changed. However, it's an error to
    specify an RGB channel (`$red`, `$green`, and/or `$blue`) at the same time
    as an HSL channel (`$hue`, `$saturation`, and/or `$lightness`), or either
    of those at the same time as an [HWB] channel (`$hue`, `$whiteness`, and/or
    `$blackness`).

    [legacy color space]: /documentation/values/colors#legacy-color-spaces
    [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

    Even so, it's a good idea to pass `$space` explicitly even for legacy colors.
  {% endheadsUp %}

  All channel arguments must be numbers, and must be units that could be passed
  for those channels in the color space's constructor. Channels are never
  clamped for `color.change()`.

  See also:

  * [`color.scale()`](#scale) for fluidly scaling a color's properties.
  * [`color.adjust()`](#adjust) for adjusting a color's properties by fixed
  amounts.

  {% codeExample 'color-change', false %}
    @use 'sass:color';

    @debug color.change(#6b717f, $red: 100); // #64717f
    @debug color.change(color(srgb 0 0.2 0.4), $red: 0.8, $blue: 0.1);
    // color(srgb 0.8 0.2 0.1)
    @debug color.change(#998099, $lightness: 30%, $space: oklch);
    // rgb(58.0719961509, 37.2631531594, 58.4201613409)
    ===
    @use 'sass:color'

    @debug color.change(#6b717f, $red: 100)  // #64717f
    @debug color.change(color(srgb 0 0.2 0.4), $red: 0.8, $blue: 0.1)
    // color(srgb 0.8 0.2 0.1)
    @debug color.change(#998099, $lightness: 30%, $space: oklch)
    // rgb(58.0719961509, 37.2631531594, 58.4201613409)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.channel($color, $channel, $space: null)', 'returns:number' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns the value of `$channel` in `$space`, which defaults to `$color`'s
  space. The `$channel` must be a quoted string, and the `$space` must be an
  unquoted string.

  This returns a number with unit `deg` for the `hue` channel of the `hsl`,
  `hwb`, `lch`, and `oklch` spaces. It returns a number with unit `%` for the
  `saturation`, `lightness`, `whiteness`, and `blackness` channels of the `hsl`,
  `hwb`, `lab`, `lch`, `oklab`, and `oklch` spaces. For all other channels, it
  returns a unitless number.

  This will return `0` (possibly with an appropriate unit) if the `$channel` is
  missing in `$color`. You can use [`color.is-missing()`] to check explicitly
  for missing channels.

  [`color.is-missing()`]: #is-missing

  {% codeExample 'color-channel', false %}
    @use 'sass:color';

    @debug color.channel(hsl(80deg 30% 50%), "hue"); // 80deg
    @debug color.channel(hsl(80deg 30% 50%), "hue", $space: oklch); // 124.279238779deg
    @debug color.channel(hsl(80deg 30% 50%), "red", $space: rgb); // 140.25
    ===
    @use 'sass:color'

    @debug color.channel(hsl(80deg 30% 50%), "hue")  // 80deg
    @debug color.channel(hsl(80deg 30% 50%), "hue", $space: oklch)  // 124.279238779deg
    @debug color.channel(hsl(80deg 30% 50%), "red", $space: rgb)  // 140.25
  {% endcodeExample %}
{% endfunction %}

{% function 'color.complement($color, $space: null)', 'complement($color, $space: null)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns the [complement] of `$color` in `$space`.

  [complement]: https://en.wikipedia.org/wiki/Complementary_colors

  This rotates `$color`'s hue by `180deg` in `$space`. This means that `$space`
  has to be a polar color space: `hsl`, `hwb`, `lch`, or `oklch`. It always
  returns a color in the same space as `$color`.

  {% headsUp %}
    For historical reasons, `$space` is optional if `$color` is in a [legacy
    color space]. In that case, `$space` defaults to `hsl`. It's always a good
    idea to pass `$space` explicitly regardless.

    [legacy color space]: /documentation/values/colors#legacy-color-spaces
  {% endheadsUp %}

  {% codeExample 'color-complement', false %}
    @use 'sass:color';

    // HSL hue 222deg becomes 42deg.
    @debug color.complement(#6b717f); // #7f796b

    // Oklch hue 267.1262408996deg becomes 87.1262408996deg
    @debug color.complement(#6b717f, oklch);
    // rgb(118.8110604298, 112.5123650034, 98.1616586336)

    // Hue 70deg becomes 250deg.
    @debug color.complement(oklch(50% 0.12 70deg), oklch); // oklch(50% 0.12 250deg)
    ===
    @use 'sass:color'

    // HSL hue 222deg becomes 42deg.
    @debug color.complement(#6b717f)  // #7f796b

    // Oklch hue 267.1262408996deg becomes 87.1262408996deg
    @debug color.complement(#6b717f, oklch) 
    // rgb(118.8110604298, 112.5123650034, 98.1616586336)

    // Hue 70deg becomes 250deg.
    @debug color.complement(oklch(50% 0.12 70deg), oklch)  // oklch(50% 0.12 250deg)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.grayscale($color)', 'grayscale($color)', 'returns:color' %}
  Returns a gray color with the same lightness as `$color`.

  If `$color` is in a [legacy color space], this sets the HSL saturation to 0%.
  Otherwise, it sets the Oklch chroma to 0%.

  [legacy color space]: /documentation/values/colors#legacy-color-spaces

  {% codeExample 'color-grayscale', false %}
    @use 'sass:color';

    @debug color.grayscale(#6b717f); // #757575
    @debug color.grayscale(color(srgb 0.4 0.2 0.6)); // color(srgb 0.3233585271 0.3233585411 0.3233585792)
    @debug color.grayscale(oklch(50% 80% 270deg)); // oklch(50% 0% 270deg)
    ===
    @use 'sass:color'

    @debug color.grayscale(#6b717f)  // #757575
    @debug color.grayscale(color(srgb 0.4 0.2 0.6))  // color(srgb 0.3233585271 0.3233585411 0.3233585792)
    @debug color.grayscale(oklch(50% 80% 270deg))  // oklch(50% 0% 270deg)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.ie-hex-str($color)', 'ie-hex-str($color)', 'returns:unquoted string' %}
  Returns an unquoted string that represents `$color` in the `#AARRGGBB` format
  expected by Internet Explorer's [`-ms-filter`] property.

  [`-ms-filter`]: https://learn.microsoft.com/en-us/previous-versions/ms530752(v=vs.85)

  If `$color` isn't already in the `rgb` color space, it's converted to `rgb`
  and gamut-mapped if necessary. The specific gamut-mapping algorithm may change
  in future Sass versions as the state of the art improves; currently,
  [`local-minde`] is used.

  [`local-minde`]: #to-gamut

  {% codeExample 'color-ie-hex-str', false %}
    @use 'sass:color';

    @debug color.ie-hex-str(#b37399); // #FFB37399
    @debug color.ie-hex-str(rgba(242, 236, 228, 0.6)); // #99F2ECE4
    @debug color.ie-hex-str(oklch(70% 10% 120deg)); // #FF9BA287
    ===
    @use 'sass:color'

    @debug color.ie-hex-str(#b37399)  // #FFB37399
    @debug color.ie-hex-str(rgba(242, 236, 228, 0.6))  // #99F2ECE4
    @debug color.ie-hex-str(oklch(70% 10% 120deg))  // #FF9BA287
  {% endcodeExample %}
{% endfunction %}

{% function 'color.invert($color, $weight: 100%, $space: null)', 'invert($color, $weight: 100%, $space: null)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns the inverse or [negative] of `$color` in `$space`.

  [negative]: https://en.wikipedia.org/wiki/Negative_(photography)

  The `$weight` must be a number between `0%` and `100%` (inclusive). A higher
  weight means the result will be closer to the negative, and a lower weight
  means it will be closer to `$color`. Weight `50%` will always produce a
  medium-lightness gray in `$space`.
  
  {% headsUp %}
    For historical reasons, `$space` is optional if `$color` is in a [legacy
    color space]. In that case, `$space` defaults to `$color`'s own space. It's
    always a good idea to pass `$space` explicitly regardless.

    [legacy color space]: /documentation/values/colors#legacy-color-spaces
  {% endheadsUp %}

  {% codeExample 'color-invert', false %}
    @use 'sass:color';

    @debug color.invert(#b37399, $space: rgb); // #4c8c66
    @debug color.invert(#550e0c, 20%, $space: display-p3); // rgb(103.4937692017, 61.3720912206, 59.430641338)
    ===
    @use 'sass:color'

    @debug color.invert(#b37399, $space: rgb)  // #4c8c66
    @debug color.invert(#550e0c, 20%, $space: display-p3)  // rgb(103.4937692017, 61.3720912206, 59.430641338)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.is-legacy($color)', 'returns:boolean' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns whether `$color` is in a [legacy color space].

  [legacy color space]: /documentation/values/colors#legacy-color-spaces

  {% codeExample 'color-is-legacy', false %}
    @use 'sass:color';

    @debug color.is-legacy(#b37399); // true
    @debug color.is-legacy(hsl(90deg 30% 90%)); // true
    @debug color.is-legacy(oklch(70% 10% 120deg)); // false
    ===
    @use 'sass:color'

    @debug color.is-legacy(#b37399)  // true
    @debug color.is-legacy(hsl(90deg 30% 90%))  // true
    @debug color.is-legacy(oklch(70% 10% 120deg))  // false
  {% endcodeExample %}
{% endfunction %}

{% function 'color.is-missing($color, $channel)', 'returns:boolean' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns whether `$channel` is [missing] in `$color`. The `$channel` must be a
  quoted string.

  [missing]: /documentation/values/colors#missing-channels

  {% codeExample 'color-is-missing', false %}
    @use 'sass:color';

    @debug color.is-missing(#b37399, "green"); // false
    @debug color.is-missing(rgb(100 none 200), "green"); // true
    @debug color.is-missing(color.to-space(grey, lch), "hue"); // true
    ===
    @use 'sass:color'

    @debug color.is-legacy(#b37399)  // true
    @debug color.is-legacy(hsl(90deg 30% 90%))  // true
    @debug color.is-legacy(oklch(70% 10% 120deg))  // false
  {% endcodeExample %}
{% endfunction %}

{% function 'color.is-powerless($color, $channel, $space: null)', 'returns:boolean' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$space"' %}{% endcompatibility %}

  Returns whether `$color`'s `$channel` is [powerless] in `$space`, which
  defaults to `$color`'s space. The `$channel` must be a quoted string and the
  `$space` must be an unquoted string.

  [powerless]: /documentation/values/colors#powerless-channels

  Channels are considered powerless in the following circumstances:

  * In the `hsl` space, the `hue` is powerless if the `saturation` is 0%.
  * In the `hwb` space, the `hue` is powerless if the `whiteness` plus the
    `blackness` is greater than 100%.
  * In the `lch` and `oklch` spaces, the `hue` is powerless if the `chroma` is
    0%.

  {% codeExample 'color-is-powerless', false %}
    @use 'sass:color';

    @debug color.is-powerless(hsl(180deg 0% 40%), "hue"); // true
    @debug color.is-powerless(hsl(180deg 0% 40%), "saturation"); // false
    @debug color.is-powerless(#999, "hue", $space: hsl); // true
    ===
    @use 'sass:color'

    @debug color.is-powerless(hsl(180deg 0% 40%), "hue")  // true
    @debug color.is-powerless(hsl(180deg 0% 40%), "saturation")  // false
    @debug color.is-powerless(#999, "hue", $space: hsl)  // true
  {% endcodeExample %}
{% endfunction %}

{% function 'color.mix($color1, $color2, $weight: 50%, $method: null)', 'mix($color1, $color2, $weight: 50%, $method: null)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$method"' %}{% endcompatibility %}

  Returns a color that's a mixture of `$color1` and `$color2` using `$method`,
  which is the name of a color space, optionally followed by a [hue
  interpolation method] if it's a polar color space (`hsl`, `hwb`, `lch`, or
  `oklch`).
  
  [hue interpolation method]: https://developer.mozilla.org/en-US/docs/Web/CSS/hue-interpolation-method

  This uses the same algorithm to mix colors as [the CSS `color-mix()`
  function]. This also means that if either color has a [missing channel] in the
  interpolation space, it will take on the corresponding channel value from the
  other color. This always returns a color in `$color1`'s space.

  [the CSS `color-mix()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix
  [missing channel]: /documentation/values/colors#missing-channels
  
  The `$weight` must be a number between `0%` and `100%` (inclusive). A larger
  weight indicates that more of `$color1` should be used, and a smaller weight
  indicates that more of `$color2` should be used.

  {% headsUp %}
    For historical reasons, `$method` is optional if `$color1` and `$color2` are
    both in [legacy color spaces]. In this case, color mixing is done using the
    same algorithm that Sass used historically, in which both the `$weight` and
    the relative opacity of each color determines how much of each color is in
    the result.

    [legacy color spaces]: /documentation/values/colors#legacy-color-spaces
  {% endheadsUp %}

  {% codeExample 'color-mix', false %}
    @use 'sass:color';

    @debug color.mix(#036, #d2e1dd, $method: rgb); // #698aa2
    @debug color.mix(#036, #d2e1dd, $method: oklch); // rgb(87.864037264, 140.601918773, 154.2876826946)
    @debug color.mix(
      color(rec2020 1 0.7 0.1),
      color(rec2020 0.8 none 0.3),
      $weight: 75%,
      $method: rec2020
    ); // color(rec2020 0.95 0.7 0.15)
    @debug color.mix(
      oklch(80% 20% 0deg),
      oklch(50% 10% 120deg),
      $method: oklch longer hue
    ); // oklch(65% 0.06 240deg)
    ===
    @use 'sass:color'

    @debug color.mix(#036, #d2e1dd, $method: rgb)  // #698aa2
    @debug color.mix(#036, #d2e1dd, $method: oklch)  // rgb(87.864037264, 140.601918773, 154.2876826946)
    @debug color.mix(color(rec2020 1 0.7 0.1), color(rec2020 0.8 none 0.3), $weight: 75%, $method: rec2020)  // color(rec2020 0.95 0.7 0.15)





    @debug color.mix(oklch(80% 20% 0deg), oklch(50% 10% 120deg), $method: oklch longer hue)  // oklch(65% 0.06 240deg)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.same($color1, $color2)', 'returns:boolean' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns whether `$color1` and `$color2` visually render as the same color.
  Unlike `==`, this considers colors to be equivalent even if they're in
  different color spaces as long as they represent the same color value in the
  `xyz` color space. This treats [missing channels] as equivalent to zero.

  [missing channels]: /documentation/values/colors#missing-channels

  {% codeExample 'color-same', false %}
    @use 'sass:color';

    @debug color.same(#036, #036); // true
    @debug color.same(#036, #037); // false
    @debug color.same(#036, color.to-space(#036, oklch)); // true
    @debug color.same(hsl(none 50% 50%), hsl(0deg 50% 50%)); // true
    ===
    @use 'sass:color'

    @debug color.same(#036, #036)  // true
    @debug color.same(#036, #037)  // false
    @debug color.same(#036, color.to-space(#036, oklch))  // true
    @debug color.same(hsl(none 50% 50%), hsl(0deg 50% 50%))  // true
  {% endcodeExample %}
{% endfunction %}

{% capture color_scale %}
  color.scale($color,
    $red: null, $green: null, $blue: null,
    $saturation: null, $lightness: null,
    $whiteness: null, $blackness: null,
    $x: null, $y: null, $z: null,
    $chroma: null,
    $alpha: null,
    $space: null)
{% endcapture %}

{% function color_scale, 'scale-color(...)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false', 'feature: "$x, $y, $z, $chroma, and $space"' %}{% endcompatibility %}
  {% compatibility 'dart: "1.28.0"', 'libsass: false', 'ruby: false', 'feature: "$whiteness and $blackness"' %}{% endcompatibility %}

  Fluidly scales one or more properties of `$color`.

  Each keyword argument must be a number between `-100%` and `100%` (inclusive).
  This indicates how far the corresponding property should be moved from its
  original position towards the maximum (if the argument is positive) or the
  minimum (if the argument is negative). This means that, for example,
  `$lightness: 50%` will make all colors `50%` closer to maximum lightness
  without making them fully white. By default, this can only scale colors in
  `$color`'s space, but a different color space can be passed as `$space` to
  scale channels there instead. This always returns a color in the same space as
  `$color`.

  {% headsUp %}
    For historical reasons, if `$color` is in a [legacy color space], _any_
    legacy color space channels can be scaled. However, it's an error to specify
    an RGB channel (`$red`, `$green`, and/or `$blue`) at the same time as an HSL
    channel (`$saturation`, and/or `$lightness`), or either of those at the same
    time as an [HWB] channel (`$hue`, `$whiteness`, and/or `$blackness`).

    [legacy color space]: /documentation/values/colors#legacy-color-spaces
    [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

    Even so, it's a good idea to pass `$space` explicitly even for legacy colors.
  {% endheadsUp %}

  [HWB]: https://en.wikipedia.org/wiki/HWB_color_model

  See also:

  * [`color.adjust()`](#adjust) for changing a color's properties by fixed
    amounts.
  * [`color.change()`](#change) for setting a color's properties.

  {% codeExample 'color-scale', false %}
    @use 'sass:color';

    @debug color.scale(#6b717f, $red: 15%); // rgb(129.2, 113, 127)
    @debug color.scale(#d2e1dd, $lightness: -10%, $space: oklch);
    // rgb(181.2580722731, 195.8949200496, 192.0059024063)
    @debug color.scale(oklch(80% 20% 120deg), $chroma: 50%, $alpha: -40%);
    // oklch(80% 0.24 120deg / 0.6)
    ===
    @use 'sass:color'

    @debug color.scale(#6b717f, $red: 15%)  // rgb(129.2, 113, 127)
    @debug color.scale(#d2e1dd, $lightness: -10%, $space: oklch)
    // rgb(181.2580722731, 195.8949200496, 192.0059024063)
    @debug color.scale(oklch(80% 20% 120deg), $chroma: 50%, $alpha: -40%)
    // oklch(80% 0.24 120deg / 0.6)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.space($color)', 'returns:unquoted string' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns the name of `$color`'s space as an unquoted string.

  {% codeExample 'color-space', false %}
    @use 'sass:color';

    @debug color.space(#036); // rgb
    @debug color.space(hsl(120deg 40% 50%)); // hsl
    @debug color.space(color(xyz-d65 0.1 0.2 0.3)); // xyz
    ===
    @use 'sass:color'

    @debug color.space(#036)  // rgb
    @debug color.space(hsl(120deg 40% 50%))  // hsl
    @debug color.space(color(xyz-d65 0.1 0.2 0.3))  // xyz
  {% endcodeExample %}
{% endfunction %}

{% function 'color.to-gamut($color, $space: null, $method: null)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a visually similar color to `$color` in the gamut of `$space`, which
  defaults to `$color`'s space. If `$color` is already in-gamut for `$space`,
  it's returned as-is. This always returns a color in` $color`'s original space.
  The `$space` must be an unquoted string.

  The `$method` indicates how Sass should choose a "similar" color:

  * `local-minde`: This is the method currently recommended by the CSS Colors 4
    specification. It binary searches the Oklch chroma space of the color until
    it finds a color whose clipped-to-gamut value is as close as possible to the
    reduced-chroma variant.

  * `clip`: This simply clips all channels to within `$space`'s gamut, setting
    them to the minimum or maximum gamut values if they're out-of-gamut.
  
  {% headsUp %}
    The CSS working group and browser vendors are still actively discussing
    alternative options for a recommended gamut-mapping algorithm. Until they
    settle on a recommendation, the `$method` parameter is mandatory in
    `color.to-gamut()` so that we can eventually make its default value the same
    as the CSS default.
  {% endheadsUp %}

  {% codeExample 'color-to-gamut', false %}
    @use 'sass:color';

    @debug color.to-gamut(#036, $method: local-minde); // #036
    @debug color.to-gamut(oklch(60% 70% 20deg), $space: rgb, $method: local-minde);
    // oklch(61.2058838235% 0.2466052584 22.0773325274deg)
    @debug color.to-gamut(oklch(60% 70% 20deg), $space: rgb, $method: clip);
    // oklch(62.5026609544% 0.2528579741 24.1000466758deg)
    ===
    @use 'sass:color'

    @debug color.to-gamut(#036, $method: local-minde)  // #036
    @debug color.to-gamut(oklch(60% 70% 20deg), $space: rgb, $method: local-minde)
    // oklch(61.2058838235% 0.2466052584 22.0773325274deg)
    @debug color.to-gamut(oklch(60% 70% 20deg), $space: rgb, $method: clip)
    // oklch(62.5026609544% 0.2528579741 24.1000466758deg)
  {% endcodeExample %}
{% endfunction %}

{% function 'color.to-space($color, $space)', 'returns:color' %}
  {% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Converts `$color` into the given `$space`, which must be an unquoted string.

  If the gamut of `$color`'s original space is wider than `$space`'s gamut, this
  may return a color that's out-of-gamut for the `$space`. You can convert it to
  a similar in-gamut color using [`color.to-gamut()`].

  [`color.to-gamut()`]: #to-gamut

  This can produce colors with [missing channels], either if `$color` has an
  [analogous channel] that's missing, or if the channel is [powerless] in the
  destination space. In order to ensure that converting to legacy color spaces
  always produces a color that's compatible with older browsers, if `$space` is
  legacy this will never return a new missing channel.

  [missing channels]: /documentation/values/colors#missing-channels
  [analogous channel]: https://www.w3.org/TR/css-color-4/#analogous-components
  [powerless]: /documentation/values/colors#powerless-channels
  
  {% funFact %}
    This is the only Sass function that returns a color in a different space
    than the one passed in.
  {% endfunFact %}

  {% codeExample 'color-to-space', false %}
    @use 'sass:color';

    @debug color.to-space(#036, display-p3); // lch(20.7457453073% 35.0389733355 273.0881809283deg)
    @debug color.to-space(oklab(44% 0.09 -0.13)); // rgb(103.1328911972, 50.9728091281, 150.8382311692)
    @debug color.to-space(xyz(0.8 0.1 0.1)); // color(a98-rgb 1.2177586808 -0.7828263424 0.3516847577)
    @debug color.to-space(grey, lch); // lch(53.5850134522% 0 none)
    @debug color.to-space(lch(none 10% 30deg), oklch); // oklch(none 0.3782382429 11.1889160032deg)
    ===
    @use 'sass:color'

    @debug color.to-space(#036, display-p3)  // lch(20.7457453073% 35.0389733355 273.0881809283deg)
    @debug color.to-space(oklab(44% 0.09 -0.13))  // rgb(103.1328911972, 50.9728091281, 150.8382311692)
    @debug color.to-space(xyz(0.8 0.1 0.1))  // color(a98-rgb 1.2177586808 -0.7828263424 0.3516847577)
    @debug color.to-space(grey, lch)  // lch(53.5850134522% 0 none)
    @debug color.to-space(lch(none 10% 30deg), oklch)  // oklch(none 0.3782382429 11.1889160032deg)
  {% endcodeExample %}
{% endfunction %}

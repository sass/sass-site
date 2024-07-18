---
title: Colors
---

{% compatibility 'dart: "1.14.0"', 'libsass: "3.6.0"', 'ruby: "3.6.0"', 'feature: "Level 4 Syntax"' %}
  LibSass and older versions of Dart or Ruby Sass don't support [hex colors with
  an alpha channel][].

  [hex colors with an alpha channel]: https://drafts.csswg.org/css-color/#hex-notation
{% endcompatibility %}

Sass has built-in support for color values. Just like CSS colors, they represent
points in the [sRGB color space][], although many Sass [color functions][]
operate using [HSL coordinates][] (which are just another way of expressing sRGB
colors). Sass colors can be written as hex codes (`#f2ece4` or `#b37399aa`),
[CSS color names][] (`midnightblue`, `transparent`), or the functions
[`rgb()`][], [`rgba()`][], [`hsl()`][], and [`hsla()`][].

[sRGB color space]: https://en.wikipedia.org/wiki/SRGB
[color functions]: /documentation/modules/color
[HSL coordinates]: https://en.wikipedia.org/wiki/HSL_and_HSV
[CSS color names]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords
[`rgb()`]: /documentation/modules#rgb
[`rgba()`]: /documentation/modules#rgba
[`hsl()`]: /documentation/modules#hsl
[`hsla()`]: /documentation/modules#hsla

{% codeExample 'colors', false %}
  @debug #f2ece4; // #f2ece4
  @debug #b37399aa; // rgba(179, 115, 153, 67%)
  @debug midnightblue; // #191970
  @debug rgb(204, 102, 153); // #c69
  @debug rgba(107, 113, 127, 0.8); // rgba(107, 113, 127, 0.8)
  @debug hsl(228, 7%, 86%); // #dadbdf
  @debug hsla(20, 20%, 85%, 0.7); // rgb(225, 215, 210, 0.7)
  ===
  @debug #f2ece4  // #f2ece4
  @debug #b37399aa  // rgba(179, 115, 153, 67%)
  @debug midnightblue  // #191970
  @debug rgb(204, 102, 153)  // #c69
  @debug rgba(107, 113, 127, 0.8)  // rgba(107, 113, 127, 0.8)
  @debug hsl(228, 7%, 86%)  // #dadbdf
  @debug hsla(20, 20%, 85%, 0.7)  // rgb(225, 215, 210, 0.7)
{% endcodeExample %}

{% funFact %}
  No matter how a Sass color is originally written, it can be used with both
  HSL-based and RGB-based functions!
{% endfunFact %}

CSS supports many different formats that can all represent the same color: its
name, its hex code, and [functional notation][]. Which format Sass chooses to
compile a color to depends on the color itself, how it was written in the
original stylesheet, and the current output mode. Because it can vary so much,
stylesheet authors shouldn't rely on any particular output format for colors
they write.

[functional notation]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value

Sass supports many useful [color functions][] that can be used to create new
colors based on existing ones by [mixing colors together][] or [scaling their
hue, saturation, or lightness][].

[mixing colors together]: /documentation/modules/color#mix
[scaling their hue, saturation, or lightness]: /documentation/modules/color#scale

{% codeExample 'color-formats', false %}
  $venus: #998099;

  @debug scale-color($venus, $lightness: +15%); // #a893a8
  @debug mix($venus, midnightblue); // #594d85
  ===
  $venus: #998099

  @debug scale-color($venus, $lightness: +15%)  // #a893a8
  @debug mix($venus, midnightblue)  // #594d85
{% endcodeExample %}

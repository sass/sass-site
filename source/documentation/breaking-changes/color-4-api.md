---
title: 'Breaking Change: Color JS API'
introduction: >
  Certain aspects of the JS color API that were designed with the assumption
  that all colors were mutually compatible no longer make sense now that Sass
  supports all the color spaces of CSS Color 4.
---

Just as some aspects of [Sass's color functions have changed] with the addition
of support for [CSS Color 4], some corners of the JS API for manipulating colors
have changed as well.

[Sass's color functions have changed]: /documentation/breaking-changes/color-functions
[CSS Color 4]: https://developer.mozilla.org/en-US/blog/css-color-module-level-4/

### `color.change()` now requires a `space` for cross-space changes

Previously, the [`color.change()` method] just took a set of channel names from
the RGB, HSL, or HWB spaces. As long as those channels didn't come from multiple
color spaces (for example, changing both `red` and `hue` at the same time), Sass
could figure out which space was intended.

[`color.change()` method]: /documentation/js-api/classes/SassColor/#change

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

With Color 4, color spaces are no longer unambiguous from their channel names
alone. Many spaces have `red`, `green`, and `blue` channels with different
ranges; many spaces have `hue` channels which produce very different color
wheels. To fix this ambiguity, `color.change()` now takes a `space` parameter
which explicitly specifies the name of the color space you want to do the
transformation in:

```js
const color = new sass.SassColor({red: 0x66, green: 0x33, blue: 0x99});
color.change({hue: 270, space: "okclh"});
```

In some cases, specifying it is mandatory to avoid ambiguity, and we recommend
you *always* specify the color space you're using to avoid errors. However, the
`space` argument is optional as long as you're changing a channel that exists
within the color's original space.

### `null` channel values

One of the major changes in CSS Color 4 is the new concept of ["missing"
channels]. For example, `hsl(none 0% 40%)` has a missing hue, which is treated
as 0 in most cases but doesn't contribute to color interpolation so that a
gradient with this color won't have a phantom red hue in the middle. When
constructing colors, Sass represents missing values as the value `null`.

["missing" channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components

## Historical Behavior

### `color.change()`

In older Sass versions, `color.change()` would infer which color space should be
used based on the channels being changed. This behavior was deprecated in Dart
Sass 1.79.0.

{% headsUp %}
  In Dart Sass versions between 1.79.0 and 2.0.0, `color.change()` still
  required the `space` option for colors in non-[legacy color spaces] and for
  channel names like `chroma` that only appear in non-legacy spaces.

  [legacy color spaces]: /documentation/values/colors#legacy-color-spaces
{% endheadsUp %}

### `null` channel values

Between Dart Sass 1.79.0 and 2.0.0, the Sass JS API's TypeScript types forbade
the use of `null` in all places where it was relevant. However, the code itself
treated `null` the same as `undefined`, so to avoid breaking any plain
JavaScript code that was relying on this behavior, the API treated a `null`
value is treated as `undefined` and emitted a deprecation warning when
constructing a new [legacy color] or calling `color.change()` for a legacy
color.

In either case, passing a `space` parameter explicitly opted into the new
behavior and `null` was be treated as a missing channel.

[legacy color]: /documentation/values/colors#legacy-color-spaces

{% render 'silencing_deprecations', jsonly: true %}

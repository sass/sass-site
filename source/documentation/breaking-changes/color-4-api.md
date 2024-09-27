---
title: 'Breaking Change: Color JS API'
introduction: >
  Certain aspects of the JS color API that were designed with the assumption
  that all colors were mutually compatible no longer make sense now that Sass
  supports all the color spaces of CSS Color 4.
---

Just as some aspects of [Sass's color functions are being deprecated] with the
addition of support for [CSS Color 4], some corners of the JS API for
manipulating colors are deprecated as well.

[Sass's color functions are being deprecated]: /documentation/breaking-changes/color-functions
[CSS Color 4]: https://developer.mozilla.org/en-US/blog/css-color-module-level-4/

### `color.change()` now requires a `space` for cross-space changes

Previously, the [`color.change()` method] just took a set of channel names from
the RGB, HSL, or HWB spaces. As long as those channels weren't mixed across
spaces (for example by changing both `red` and `hue` at the same time), Sass
could figure out which space was intended.

[`color.change()` method]: /documentation/js-api/classes/SassColor/#change

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

Specifying the color space is mandatory if the color in question isn't in a
[legacy color space] or if you're changing a channel like chroma that only
exists in non-legacy color spaces. It's always optional if you're changing a
channel that exists in the color's own space, so `color.change({red: 0.8})`
always refers to the native red channel of any color with `red`, `green`, and
`blue` channels.

[legacy color space]: /documentation/values/colors#legacy-color-spaces

For backwards-compatibility, if you're changing legacy channels for a legacy
color, Sass will still automatically convert the color for you. However, this
behavior is deprecated. To be safe, you should _always_ pass the `space`
parameter unless you're sure the color is already in the color space whose
channel you want to change.

### `null` channel values

One of the major changes in CSS Color 4 is the new concept of ["missing"
channels]. For example, `hsl(none 0% 40%)` has a missing hue, which is treated
as 0 in most cases but doesn't contribute to color interpolation so that a
gradient with this color won't have a phantom red hue in the middle. When
constructing colors, Sass represents missing values as the value `null`.

["missing" channels]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components

Before adding support for CSS Color 4, the Sass JS API's TypeScript types
forbade the use of `null` in all places where it was relevant. However, the code
itself treated `null` the same as `undefined`, and we don't want to break
compatibility with any plain JavaScript code that was relying on this behavior.
For now, a `null` value is treated as `undefined` and emits a deprecation
warning when constructing a new [legacy color] or calling `color.change()` for a
legacy color. In either case, if you pass a `space` parameter explicitly, you'll
opt into the new behavior and `null` will be treated as a missing channel.

## Transition Period

{% compatibility 'dart: "1.79.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

First, we'll emit deprecation warnings for all uses of these APIs that are
slated to be changed. In Dart Sass 2.0.0, the breaking changes will go into
effect fully, and the old behavior will no longer work how it used to.

{% render 'silencing_deprecations', jsonly: true %}


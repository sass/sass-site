---
title: "Breaking Change: Null Alpha Channel"
introduction: |
  Prior to Dart Sass 1.64.3, in the JS and Dart APIs, if `null` was passed to
  the `SassColor` constructor it would be treated as 1. This is now deprecated.
  Users should explicitly pass 1 or `undefined` instead.
---

Sass is working on adding support for the [CSS Color Module Level 4]. One of the
changes in this module is the idea of ["missing components"]: if a color
component like `alpha` is missing, it's mostly treated as 0, but if it's
interpolated with another color (such as in a gradient or an animation) it will
automatically take on the other color's value.

[CSS Color Module Level 4]: https://www.w3.org/TR/css-color-4/
["missing components"]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components

We need a way for users of the JS and Dart APIs to access and set missing
channels, and `null` is the most natural way to do that. In most cases, this
isn't an issue; callers who intend to create opaque colors usually just leave
out the `alpha` parameter anyway (or pass `undefined` in JS). But if callers are
explicitly passing `null`, that will eventually be treated as a transparent
color instead of an opaque one.

To preserve the current behavior, all you need to do is explicitly pass 1 if
`alpha` is unset. In JS:

```js
new sass.SassColor({
  red: 102,
  green: 51,
  blue: 153,
  alpha: alpha ?? 1,
});
```

And in Dart:

```dart
sass.SassColor.rgb(102, 51, 153, alpha ?? 1);
```

{% funFact %}
  The TypeScript types for the Sass API already forbid passing `null` as
  `alpha`; it's only allowed to be absent, `undefined`, or a `Number`. But prior
  to Dart Sass 1.64.3, if you weren't using TypeScript and you _did_ pass `null`
  it would still be treated as an opaque color.
{% endfunFact %}

## Transition Period

{% compatibility 'dart: "1.64.3"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Between Dart Sass 1.64.3 and the upcoming release of support for CSS Colors
Level 4, Dart Sass will continue to interpret a `null` `alpha` value as an opaque
color. However, it will emit a deprecation warning to encourage authors to
explicitly pass `alpha` 1 instead.

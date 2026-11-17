---
title: "Breaking Change: Null Alpha Channel"
introduction: |
  In the JS and Dart APIs, passing `alpha: null` to the `SassColor` constructor
  now indicates a missing alpha component.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

One of the changes introduced in the [CSS Color Module Level 4] is the idea of
["missing components"]: if a color component like `alpha` is missing, it's
mostly treated as 0, but if it's interpolated with another color (such as in a
gradient or an animation) it will automatically take on the other color's value.
We need a way for users of the JS and Dart APIs to access and set missing
channels, and `null` is the most natural way to do that.

[CSS Color Module Level 4]: https://www.w3.org/TR/css-color-4/
["missing components"]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#missing_color_components

Passing `alpha: undefined` in the JS API still works the way it always did,
falling back to making the color opaque.

### Historical Behavior

Historically, the JS and Dart APIs both treated `alpha: null` the same as
`alpha: undefined` or `alpha: 1.0`.

{% funFact %}
  The TypeScript types for the Sass API always forbade passing `null` as
  `alpha`; it was only allowed to be absent, `undefined`, or a `Number`. But
  if you weren't using TypeScript and you _did_ pass `null` it would still be
  treated as an opaque color.
{% endfunFact %}

{% compatibility 'dart: "1.64.3"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.64.3, Dart Sass emitted the `null-alpha` deprecation warning
whenever `alpha: null` was passed in either the JS or Dart APIs. It was still
interpreted as an opaque color.

To preserve the historical behavior, all you need to do is explicitly pass 1 if
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

---
title: 'Breaking Change: meta.feature-exists()'
introduction: >
  The `meta.feature-exists()` function has been removed. Users should use other
  methods to determine whether a new feature is available.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Historically, Sass used the `meta.feature-exists()` function (also available as
the global `feature-exists()` function) to allow authors to detect whether
various new language features were available when compiling stylesheets.
However, as time has gone on it's turned out that the vast majority of new Sass
features are either possible to detect in a more straightforward way or else
aren't very useful to detect at all. As such, the function has been removed.

Since Dart Sass is now the only officially supported Sass implementation, and
all versions of Dart Sass support all the features that were detected by
`meta.feature-exists()`, all existing uses of it can safely be removed.

Many new features can be detected using [`meta.function-exists()`],
[`meta.mixin-exists()`], or [`meta.global-variable-exists()`]. Others can be
detected using expression-level syntax, such as using `calc(1) == 1` to
determine if the current version of Sass supports first-class calculations.

[`meta.function-exists()`]: /documentation/modules/meta#function-exists
[`meta.mixin-exists()`]: /documentation/modules/meta#mixin-exists
[`meta.global-variable-exists()`]: /documentation/modules/meta#global-variable-exists

## Historical Behavior

In Dart Sass, the `meta.feature-exists($feature)` function returned `true` when
passed the strings `global-variable-shadowing`, `extend-selector-pseudoclass`,
`units-level3`, `at-error`, and `custom-property`. It returned `false` for all
other strings. In other Sass implementations, it may have returned `false` for
one or more of those strings. It was deprecated in Dart Sass 1.78.0.

{% render 'silencing_deprecations' %}

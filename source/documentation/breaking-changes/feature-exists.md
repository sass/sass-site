---
title: 'Breaking Change: meta.feature-exists()'
introduction: >
  The `meta.feature-exists()` function hasn't had any new features added in a
  long time, and is now deprecated. Users should use other methods to determine
  if a new feature is available.
---

Historically, Sass used the `meta.feature-exists()` function (also available as
the global `feature-exists()` function) to allow authors to detect whether
various new language features were available when compiling stylesheets.
However, as time has gone on it's turned out that the vast majority of new Sass
features are either possible to detect in a more straightforward way, or else
aren't very useful to detect at all.


This function is now deprecated and will be removed in Dart Sass 2.0.0. Since
Dart Sass is now the only officially supported Sass implementation, and all
versions of Dart Sass support all the features supported by
`meta.feature-exists()`, all existing uses of it can safely be removed.

Many new features can be detected using [`meta.function-exists()`] or
[`meta.mixin-exists()`]. Others can be detected using expression-level syntax,
such as using `calc(1) == 1` to determine if the current version of Sass
supports first-class calculations.

[`meta.function-exists()`]: /documentation/modules/meta#function-exists
[`meta.mixin-exists()`]: /documentation/modules/meta#mixin-exists
[`meta.variable-exists()`]: /documentation/modules/meta#variable-exists

## Deprecation Process

### Phase 1

{% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Sass emits a deprecation warning if you call `meta.feature-exists()`.

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, `meta.feature-exists()` will no longer exist.

{% render 'silencing_deprecations' %}

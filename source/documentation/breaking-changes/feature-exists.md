---
title: 'Breaking Change: Removing the meta.feature-exists function'
introduction: >
  Sass has historically supported the `feature-exists()` function. However, the
  list of supported features has not been updated since years and all supported
  features exist in all implementations.
---

Sass has historically supported the `feature-exists()` function. However, the
list of supported features has not been updated since years and all supported
features exist in all implementations.

In practice, essentially all the new features fall into one of three categories:

1. New built-in functions or mixins, which are easy to detect using other
   `sass:meta` functions.
2. Language-level features which are relatively easy to detect on their own
   (for example, first-class calc can be detected with `calc(1 + 1) == 2`).
3. New syntax which can't even be parsed in implementations that don't support
   it, for which feature detection isn't particularly useful anyway.

Sass will drop support for the `meta.feature-exists()` function and its global alias.

## Transition Period

{% compatibility 'dart: "1.78.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

First, we'll emit deprecation warnings for all usages of `feature-exists`.

In Dart Sass 2.0, `meta.feature-exists` will throw an error due to being a
non-existent function in the `sass:meta` module and `feature-exists` will be
treated as a plain CSS function.

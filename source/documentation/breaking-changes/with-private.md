---
title: 'Breaking Change: Private Configuration'
introduction: >
  When Sass introduced the new module system, it also introduced the concept of
  private variables that were meant only to be visible or modifiable within the
  module. But there was an accidental loophole: this variables could still be
  configured.
---

It's possible to write `@use "module" with ($-private: value)` and affect the
value of a module's private variable. This goes against the intended behavior of
the language, and likely against the module author's intentions as well. To
close this loophole, we're moving towards making it an error to ever configure a
private variable.

We still plan to allow private variables to be declared with `!default`, because
this remains a useful way to assign a value only if the variable is currently
`null` (similar to [`??=` assignment] in JavaScript).

[`??=` assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment

{% headsUp %}
  Any variable whose name starts with `-` or `_` is considered private,
  including variables whose names start with `--`. For this reason, we
  discourage the use of CSS custom property-style names for Sass variables.
{% endheadsUp %}

### Phase 1

{% compatibility 'dart: "1.92.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Dart Sass emits a deprecation warning if you use a private variable
name in a configuration, but it will still allow that variable to be configured
if the module declares it with `!default`.

To fix any violations, change all variables that are intended to be configured
to no longer be private by removing all leading `-` or `_` characters.

{% render 'silencing_deprecations' %}

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, including a private variable in a configuration will be an
error.

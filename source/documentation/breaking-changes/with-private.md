---
title: 'Breaking Change: Private Configuration'
introduction: >
  It's no longer possible to configure private variables through
  `@use ... with`.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The following is now an error:

{% codeExample 'with-private', false %}
  @use "module" (
    $-private: value,
  );
  ===
  @use "module" (
    $-private: value,
  )
{% endcodeExample %}

You may still declare proviate variables with `!default`, because this is still
a useful way to assign a value only if the variable is currently `null` (similar
to [`??=` assignment] in JavaScript).

[`??=` assignment]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment

{% headsUp %}
  Any variable whose name starts with `-` or `_` is considered private,
  including variables whose names start with `--`. For this reason, we
  discourage the use of CSS custom-property-style names for Sass variables.
{% endheadsUp %}

## Historical Behavior

Private variables were never supposed to be visible outside of the module that
declared them in any way. but when the module system was first released, there
was an accidental loophole: these variables could still be configured. This went
against the intended behavior of the language, and likely against the module
author's intentions as well.

{% compatibility 'dart: "1.92.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.92.0, Dart Sass emitted a `with-private` deprecation warning when
configurations set a value for a private variable.

To fix any violations, change all variables that are intended to be configured
to no longer be private by removing all leading `-` or `_` characters.

{% render 'silencing_deprecations' %}

---
title: 'Breaking Change: Duplicate Variable Flags'
introduction: >
  Variables now only allow a single `!global` or `!default` flag.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

{% codeExample 'duplicate-var-flags' %}
  $color: red !default !default;
  ===
  $color: red !default !default
{% endcodeExample %}

Declaring a variable with one of each flag is still allowed:

{% codeExample 'two-var-flags', false %}
  $color: red !global !default;
  ===
  $color: red !global !default
{% endcodeExample %}

## Historical Behavior

Before Dart Sass 2.0.0, additional copies of the same flag were ignored. This
was deprecated in Dart Sass 1.62.0.

{% render 'silencing_deprecations' %}

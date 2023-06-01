---
title: 'Breaking Change: Duplicate Variable Flags'
introduction: >
  Variables will only allow a single `!global` or `!default` flag. Duplicate
  flags never had any additional effect, this just ensures that stylesheets are
  more consistent.
---

## Phase 1

{% compatibility 'dart: 2.0.0', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Dart Sass 2.0.0, if a single variable declaration has more than one
each `!global` or `!default` flag, this will be a syntax error. This means that
`$var: value !default !default` will be forbidden. `$var: value !global
!default` will still be allowed.

## Transition Period

{% compatibility 'dart: 1.62.0', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Until Dart Sass 2.0.0 is released, multiple copies of a flag just produce
deprecation warnings.

---
title: 'Breaking Change: Adjacent Compound Selectors'
introduction: >
  Going forward, it will be an error to have two
  [compound selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selector_structure#compound_selector)
  that aren't separated by whitespace, like `[id]a`.
---

Selectors written this way aren't allowed in CSS, and it's not clear whether
they're intended to be the same as (for example) `a[id]` or `[id] a`.
Historically Sass has allowed them and parsed them as though there was
whitespace between them, but this will be an error in the future.

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Dart Sass 2.0.0, multiple compound selectors require whitespace (or
an explicit combinator (like `+` or `~`) between them.

## Transition Period

{% compatibility 'dart: "1.100.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Until Dart Sass 2.0.0 is released, adjacent compound selectors just produce a
deprecation warning.

{% render 'silencing_deprecations' %}

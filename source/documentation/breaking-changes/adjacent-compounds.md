---
title: 'Breaking Change: Adjacent Compound Selectors'
introduction: >
  As of Dart Sass 2.0.0, it's an error to have two
  [compound selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Selectors/Selector_structure#compound_selector)
  that aren't separated by whitespace, like `[id]a`.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Selectors written this way aren't allowed in CSS because it's not clear whether
they're intended to be the same as (for example) `a[id]` or `[id] a`. Sass now
forbids them as well: compound selectors now require whitespace (or an explicit
combinator (like `+` or `~`) between them, or else Sass will produce a parse
error.

{% codeExample 'adjacent-compounds' %}
  [id]a {
    color: red;
  }
  ===
  [id]a
    color: red
{% endcodeExample %}

## Historical Behavior

In older Sass versions, adjacent compound selectors were parsed as though
there was whitespace between them (that is, `[id]a` was parsed the same as
`[id] a`). This behavior was deprecated in Dart Sass 1.100.0.

{% codeExample 'adjacent-compounds' %}
  article [id]a {
    color: red;
  }
  ===
  article [id]a
    color: red
  ===
  article [id] a {
    color: red;
  }
{% endcodeExample %}

{% render 'silencing_deprecations' %}

---
title: "@for"
introduction: >
  The `@for` rule, written `@for <variable> from <expression> to <expression> {
  ... }` or `@for <variable> from <expression> through <expression> { ... }`,
  counts up or down from one number (the result of the first
  [expression](/documentation/syntax/structure#expressions)) to another (the
  result of the second) and evaluates a block for each number in between. Each
  number along the way is assigned to the given variable name. If `to` is used,
  the final number is excluded; if `through` is used, it's included.
---

{% codeExample 'for' %}
  $base-color: #036;

  @for $i from 1 through 3 {
    ul:nth-child(3n + #{$i}) {
      background-color: lighten($base-color, $i * 5%);
    }
  }
  ===
  $base-color: #036

  @for $i from 1 through 3
    ul:nth-child(3n + #{$i})
      background-color: lighten($base-color, $i * 5%)
{% endcodeExample %}

---
title: "@each"
introduction: >
  The `@each` rule makes it easy to emit styles or evaluate code for each
  element of a [list](/documentation/values/lists) or each pair in a
  [map](/documentation/values/maps). It’s great for repetitive styles that only
  have a few variations between them. It’s usually written `@each <variable> in
  <expression> { ... }`, where the
  [expression](/documentation/syntax/structure#expressions) returns a list. The
  block is evaluated for each element of the list in turn, which is assigned to
  the given variable name.
---

{% render 'code_snippets/example-each-list' %}

## With Maps

You can also use `@each` to iterate over every key/value pair in a map by
writing it `@each <variable>, <variable> in <expression> { ... }`. The key is
assigned to the first variable name, and the element is assigned to the second.

{% render 'code_snippets/example-each-map' %}

## Destructuring

If you have a list of lists, you can use `@each` to automatically assign
variables to each of the values from the inner lists by writing it `@each
<variable...> in <expression> { ... }`. This is known as *destructuring*, since
the variables match the structure of the inner lists. Each variable name is
assigned to the value at the corresponding position in the list, or [`null`][]
if the list doesn't have enough values.

[`null`]: /documentation/values/null

{% codeExample 'each' %}
  $icons:
    "eye" "\f112" 12px,
    "start" "\f12e" 16px,
    "stop" "\f12f" 10px;

  @each $name, $glyph, $size in $icons {
    .icon-#{$name}:before {
      display: inline-block;
      font-family: "Icon Font";
      content: $glyph;
      font-size: $size;
    }
  }
  ===
  $icons: "eye" "\f112" 12px, "start" "\f12e" 16px, "stop" "\f12f" 10px




  @each $name, $glyph, $size in $icons
    .icon-#{$name}:before
      display: inline-block
      font-family: "Icon Font"
      content: $glyph
      font-size: $size
{% endcodeExample %}

{% funFact %}
  Because `@each` supports destructuring and [maps count as lists of lists][],
  `@each`'s map support works without needing special support for maps in
  particular.

  [maps count as lists of lists]: /documentation/values/maps
{% endfunFact %}

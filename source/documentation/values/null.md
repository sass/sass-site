---
title: "null"
introduction: >
  The value `null` is the only value of its type. It represents the absence of a
  value, and is often returned by [functions](/documentation/at-rules/function)
  to indicate the lack of a result.
---

{% codeExample 'null', false %}
  @use "sass:map";
  @use "sass:string";

  @debug string.index("Helvetica Neue", "Roboto"); // null
  @debug map.get(("large": 20px), "small"); // null
  @debug &; // null
  ===
  @use "sass:map"
  @use "sass:string"

  @debug string.index("Helvetica Neue", "Roboto")  // null
  @debug map.get(("large": 20px), "small")  // null
  @debug &  // null
{% endcodeExample %}

If a [list][] contains a `null`, that `null` is omitted from the generated CSS.

[list]: /documentation/values/lists

{% codeExample 'null-lists' %}
  $fonts: ("serif": "Helvetica Neue", "monospace": "Consolas");

  h3 {
    font: 18px bold map-get($fonts, "sans");
  }
  ===
  $fonts: ("serif": "Helvetica Neue", "monospace": "Consolas")

  h3
    font: 18px bold map-get($fonts, "sans")
{% endcodeExample %}

If a property value is `null`, that property is omitted entirely.

{% codeExample 'null-value-omitted' %}
  $fonts: ("serif": "Helvetica Neue", "monospace": "Consolas");

  h3 {
    font: {
      size: 18px;
      weight: bold;
      family: map-get($fonts, "sans");
    }
  }
  ===
  $fonts: ("serif": "Helvetica Neue", "monospace": "Consolas")

  h3
    font:
      size: 18px
      weight: bold
      family: map-get($fonts, "sans")
{% endcodeExample %}

`null` is also [*falsey*][], which means it counts as `false` for any rules or
[operators][] that take booleans. This makes it easy to use values that can be
`null` as conditions for [`@if`][] and [`if()`][].

[*falsey*]: /documentation/at-rules/control/if#truthiness-and-falsiness
[operators]: /documentation/operators/boolean
[`@if`]: /documentation/at-rules/control/if
[`if()`]: /documentation/modules#if

{% render 'code_snippets/example-if-parent-selector' %}

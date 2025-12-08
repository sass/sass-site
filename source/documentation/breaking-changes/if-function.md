---
title: 'Breaking Change: Plain-CSS if()'
introduction: >
  Sass's legacy `if()` function is being deprecated in favor of the official CSS
  `if()` function syntax. This syntax allows Sass and CSS conditions to be mixed
  freely.
---

{% compatibility 'dart: "1.95.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In 2010, shortly after adding the [boolean value type], Sass added the global
`if()` function as a way to easily use booleans in a single expression without
having to write out an entire [`@if` rule]. This function had the signature
`if($condition, $if-true, $if-false)` and returned `$if-true` if `$condition`
was [truthy] and `$if-false` otherwise.

[boolean value type]: /documentation/values/booleans
[`@if` rule]: /documentation/at-rules/control/if.md
[truthy]: /documentation/at-rules/control/if#truthiness-and-falsiness

At the time, browsers didn't even support `@media` queries and we never imagined
that CSS might support its own `if()` function someday. But fifteen years later,
support for the [CSS `if()` function] began landing in browsers and we had to
do so as well in order to remain fully CSS-compatible.

[CSS `if()` function]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/if

Sass now supports the [plain-CSS `if()` syntax], as well as a special
`sass(...)` condition that evaluates Sass expressions. In order to avoid
redundancy and standardize on the most CSS-compatible option, we plan to
eventually remove the legacy `if()` function from the language.

[plain-CSS `if()` syntax]: /documentation/syntax/special-functions#if

You can use [the Sass migrator] to automatically migrate from the legacy `if()`
function to the CSS `if()` syntax.

[the Sass migrator]: https://sass-lang.com/documentation/cli/migrator/#if

{% codeExample 'debug', false %}
  @use 'sass:meta';

  // Instead of if(true, 10px, 15px)
  @debug if(sass(true): 10px; else: 15px);

  // Instead of if(meta.variable-defined($var), $var, null)
  @debug if(sass(meta.variable-defined($var)): $var);
  ===
  @use 'sass:meta'

  // Instead of if(true, 10px, 15px)
  @debug if(sass(true): 10px; else: 15px)

  // Instead of if(meta.variable-defined($var), $var, null)
  @debug if(sass(meta.variable-defined($var)): $var)
{% endcodeExample %}


{% render 'silencing_deprecations' %}


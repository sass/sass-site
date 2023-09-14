---
title: sass:selector
---

{% render 'doc_snippets/built-in-module-status' %}

## Selector Values

The functions in this module inspect and manipulate selectors. Whenever they
return a selector, it's always a comma-separated [list][] (the selector list)
that contains space-separated lists (the complex selectors) that contain
[unquoted strings][] (the compound selectors). For example, the selector `.main
aside:hover, .sidebar p` would be returned as:

[list]: /documentation/values/lists
[unquoted strings]: /documentation/values/strings#unquoted

```scss
@debug ((unquote(".main") unquote("aside:hover")),
        (unquote(".sidebar") unquote("p")));
// .main aside:hover, .sidebar p
```

Selector arguments to these functions may be in the same format, but they can
also just be normal strings (quoted or unquoted), or a combination. For example,
`".main aside:hover, .sidebar p"` is a valid selector argument.

{% function 'selector.is-superselector($super, $sub)', 'is-superselector($super, $sub)', 'returns:boolean' %}
  Returns whether the selector `$super` matches all the elements that the
  selector `$sub` matches.

  Still returns true even if `$super` matches *more* elements than `$sub`.

  The `$super` and `$sub` selectors may contain [placeholder selectors][], but
  not [parent selectors][].

  [placeholder selectors]: /documentation/style-rules/placeholder-selectors
  [parent selectors]: /documentation/style-rules/parent-selector

  {% codeExample 'is-superselector' %}
    @use "sass:selector";

    @debug selector.is-superselector("a", "a.disabled"); // true
    @debug selector.is-superselector("a.disabled", "a"); // false
    @debug selector.is-superselector("a", "sidebar a"); // true
    @debug selector.is-superselector("sidebar a", "a"); // false
    @debug selector.is-superselector("a", "a"); // true
    ===
    @use "sass:selector"

    @debug selector.is-superselector("a", "a.disabled")  // true
    @debug selector.is-superselector("a.disabled", "a")  // false
    @debug selector.is-superselector("a", "sidebar a")  // true
    @debug selector.is-superselector("sidebar a", "a")  // false
    @debug selector.is-superselector("a", "a")  // true
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.append($selectors...)', 'selector-append($selectors...)', 'returns:selector' %}
  Combines `$selectors` without [descendant combinators][]—that is, without
  whitespace between them.

  [descendant combinators]: https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_selectors

  If any selector in `$selectors` is a selector list, each complex selector is
  combined separately.

  The `$selectors` may contain [placeholder selectors][], but not [parent
  selectors][].

  [placeholder selectors]: /documentation/style-rules/placeholder-selectors
  [parent selectors]: /documentation/style-rules/parent-selector

  See also [`selector.nest()`](#nest).

  {% codeExample 'append' %}
    @use "sass:selector";

    @debug selector.append("a", ".disabled"); // a.disabled
    @debug selector.append(".accordion", "__copy"); // .accordion__copy
    @debug selector.append(".accordion", "__copy, __image");
    // .accordion__copy, .accordion__image
    ===
    @use "sass:selector"

    @debug selector.append("a", ".disabled")  // a.disabled
    @debug selector.append(".accordion", "__copy")  // .accordion__copy
    @debug selector.append(".accordion", "__copy, __image")
    // .accordion__copy, .accordion__image
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.extend($selector, $extendee, $extender)', 'selector-extend($selector, $extendee, $extender)', 'returns:selector' %}
  Extends `$selector` as with the [`@extend` rule][].

  [`@extend` rule]: /documentation/at-rules/extend

  Returns a copy of `$selector` modified with the following `@extend` rule:

  ```scss
  #{$extender} {
    @extend #{$extendee};
  }
  ```

  In other words, replaces all instances of `$extendee` in `$selector` with
  `$extendee, $extender`. If `$selector` doesn't contain `$extendee`, returns it
  as-is.

  The `$selector`, `$extendee`, and `$extender` selectors may contain
  [placeholder selectors][], but not [parent selectors][].

  [placeholder selectors]: /documentation/style-rules/placeholder-selectors
  [parent selectors]: /documentation/style-rules/parent-selector

  See also [`selector.replace()`](#replace).

  {% codeExample 'extend' %}
    @use "sass:selector";

    @debug selector.extend("a.disabled", "a", ".link"); // a.disabled, .link.disabled
    @debug selector.extend("a.disabled", "h1", "h2"); // a.disabled
    @debug selector.extend(".guide .info", ".info", ".content nav.sidebar");
    // .guide .info, .guide .content nav.sidebar, .content .guide nav.sidebar
    ===
    @use "sass:selector"

    @debug selector.extend("a.disabled", "a", ".link")  // a.disabled, .link.disabled
    @debug selector.extend("a.disabled", "h1", "h2")  // a.disabled
    @debug selector.extend(".guide .info", ".info", ".content nav.sidebar")
    // .guide .info, .guide .content nav.sidebar, .content .guide nav.sidebar
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.nest($selectors...)', 'selector-nest($selectors...)', 'returns:selector' %}
  Combines `$selectors` as though they were nested within one another in the
  stylesheet.

  The `$selectors` may contain [placeholder selectors][]. Unlike other selector
  functions, all of them except the first may also contain [parent selectors][].

  [placeholder selectors]: /documentation/style-rules/placeholder-selectors
  [parent selectors]: /documentation/style-rules/parent-selector

  See also [`selector.append()`](#append).

  {% codeExample 'nest' %}
    @use "sass:selector";

    @debug selector.nest("ul", "li"); // ul li
    @debug selector.nest(".alert, .warning", "p"); // .alert p, .warning p
    @debug selector.nest(".alert", "&:hover"); // .alert:hover
    @debug selector.nest(".accordion", "&__copy"); // .accordion__copy
    ===
    @use "sass:selector"

    @debug selector.nest("ul", "li")  // ul li
    @debug selector.nest(".alert, .warning", "p")  // .alert p, .warning p
    @debug selector.nest(".alert", "&:hover")  // .alert:hover
    @debug selector.nest(".accordion", "&__copy")  // .accordion__copy
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.parse($selector)', 'selector-parse($selector)', 'returns:selector' %}
  Returns `$selector` in the [selector value](#selector-values) format.

  {% codeExample 'parse' %}
    @use "sass:selector";

    @debug selector.parse(".main aside:hover, .sidebar p");
    // ((unquote(".main") unquote("aside:hover")),
    //  (unquote(".sidebar") unquote("p")))
    ===
    @use "sass:selector"

    @debug selector.parse(".main aside:hover, .sidebar p")
    // ((unquote(".main") unquote("aside:hover")),
    //  (unquote(".sidebar") unquote("p")))
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.replace($selector, $original, $replacement)', 'selector-replace($selector, $original, $replacement)', 'returns:selector' %}
  Returns a copy of `$selector` with all instances of `$original` replaced by
  `$replacement`.

  This uses the [`@extend` rule][]'s [intelligent unification][] to make sure
  `$replacement` is seamlessly integrated into `$selector`. If `$selector`
  doesn't contain `$original`, returns it as-is.

  [`@extend` rule]: /documentation/at-rules/extend
  [intelligent unification]: /documentation/at-rules/extend#how-it-works

  The `$selector`, `$original`, and `$replacement` selectors may contain
  [placeholder selectors][], but not [parent selectors][].

  [placeholder selectors]: /documentation/style-rules/placeholder-selectors
  [parent selectors]: /documentation/style-rules/parent-selector

  See also [`selector.extend()`](#extend).

  {% codeExample 'replace' %}
    @use "sass:selector";

    @debug selector.replace("a.disabled", "a", ".link"); // .link.disabled
    @debug selector.replace("a.disabled", "h1", "h2"); // a.disabled
    @debug selector.replace(".guide .info", ".info", ".content nav.sidebar");
    // .guide .content nav.sidebar, .content .guide nav.sidebar
    ===
    @use "sass:selector"

    @debug selector.replace("a.disabled", "a", ".link")  // .link.disabled
    @debug selector.replace("a.disabled", "h1", "h2")  // a.disabled
    @debug selector.replace(".guide .info", ".info", ".content nav.sidebar")
    // .guide .content nav.sidebar, .content .guide nav.sidebar
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.unify($selector1, $selector2)', 'selector-unify($selector1, $selector2)', 'returns:selector | null' %}
  Returns a selector that matches only elements matched by *both* `$selector1`
  and `$selector2`.

  Returns `null` if `$selector1` and `$selector2` don't match any of the same
  elements, or if there's no selector that can express their overlap.

  Like selectors generated by the [`@extend` rule][], the returned selector
  isn't guaranteed to match *all* the elements matched by both `$selector1` and
  `$selector2` if they're both complex selectors.

  [`@extend` rule]: /documentation/at-rules/extend#html-heuristics

  {% codeExample 'unify' %}
    @use "sass:selector";

    @debug selector.unify("a", ".disabled"); // a.disabled
    @debug selector.unify("a.disabled", "a.outgoing"); // a.disabled.outgoing
    @debug selector.unify("a", "h1"); // null
    @debug selector.unify(".warning a", "main a"); // .warning main a, main .warning a
    ===
    @use "sass:selector"

    @debug selector.unify("a", ".disabled")  // a.disabled
    @debug selector.unify("a.disabled", "a.outgoing")  // a.disabled.outgoing
    @debug selector.unify("a", "h1")  // null
    @debug selector.unify(".warning a", "main a")  // .warning main a, main .warning a
  {% endcodeExample %}
{% endfunction %}

{% function 'selector.simple-selectors($selector)', 'simple-selectors($selector)', 'returns:list' %}
  Returns a list of simple selectors in `$selector`.

  The `$selector` must be a single string that contains a compound selector.
  This means it may not contain combinators (including spaces) or commas.

  The returned list is comma-separated, and the simple selectors are unquoted
  strings.

  {% codeExample 'simple-selectors' %}
    @use "sass:selector";

    @debug selector.simple-selectors("a.disabled"); // a, .disabled
    @debug selector.simple-selectors("main.blog:after"); // main, .blog, :after
    ===
    @use "sass:selector"

    @debug selector.simple-selectors("a.disabled")  // a, .disabled
    @debug selector.simple-selectors("main.blog:after")  // main, .blog, :after
  {% endcodeExample %}
{% endfunction %}

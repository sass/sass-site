---
title: "@at-root"
introduction: >
  The `@at-root` rule is usually written `@at-root <selector> { ... }` and
  causes everything within it to be emitted at the root of the document instead
  of using the normal nesting. It's most often used when doing [advanced
  nesting](/documentation/style-rules/parent-selector#advanced-nesting) with the
  [SassScript parent
  selector](/documentation/style-rules/parent-selector#in-sassscript) and
  [selector functions](/documentation/modules/selector).
---

{% render 'code_snippets/example-advanced-nesting' %}

The `@at-root` rule is necessary here because Sass doesn't know what
interpolation was used to generate a selector when it's performing selector
nesting. This means it will automatically add the outer selector to the inner
selector *even if* you used `&` as a SassScript expression. The `@at-root`
explicitly tells Sass not to include the outer selector (although it will
_always_ be included in `&` as an expression).

{% funFact %}
  The `@at-root` rule can also be written `@at-root { ... }` to put multiple
  style rules at the root of the document. In fact, `@at-root <selector> { ...
  }` is just a shorthand for `@at-root { <selector> { ... } }`!
{% endfunFact %}

## Beyond Style Rules

On its own, `@at-root` only gets rid of [style rules][]. Any at-rules like
[`@media`][] or [`@supports`][] will be left in. If this isn't what you want,
though, you can control exactly what it includes or excludes using syntax like
[media query features][], written `@at-root (with: <rules...>) { ... }` or
`@at-root (without: <rules...>) { ... }`. The `(without: ...)` query tells Sass
which rules should be excluded; the `(with: ...)` query excludes all rules
*except* those that are listed.

[style rules]: /documentation/style-rules
[`@media`]: /documentation/at-rules/css#media
[`@supports`]: /documentation/at-rules/css#supports
[media query features]: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#Targeting_media_features

{% codeExample 'at-root' %}
  @media print {
    .page {
      width: 8in;

      @at-root (without: media) {
        color: #111;
      }

      @at-root (with: rule) {
        font-size: 1.2em;
      }
    }
  }
  ===
  @media print
    .page
      width: 8in

      @at-root (without: media)
        color: #111


      @at-root (with: rule)
        font-size: 1.2em
{% endcodeExample %}

In addition to the names of at-rules, there are two special values that can be
used in queries:

* `rule` refers to style rules. For example, `@at-root (with: rule)` excludes
  all at-rules but preserves style rules.

* `all` refers to all at-rules *and* style rules should be excluded.

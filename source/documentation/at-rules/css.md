---
title: CSS At-Rules
table_of_contents: true
---

{% compatibility 'dart: "1.15.0"', 'libsass: false', 'ruby: false', 'feature: "Name Interpolation"' %}
  LibSass, Ruby Sass, and older versions of Dart Sass don't support
  [interpolation][] in at-rule names. They do support interpolation in values.

  [interpolation]: /documentation/interpolation
{% endcompatibility %}

Sass supports all the at-rules that are part of CSS proper. To stay flexible and
forwards-compatible with future versions of CSS, Sass has general support that
covers almost all at-rules by default. A CSS at-rule is written `@<name>
<value>`, `@<name> { ... }`, or `@<name> <value> { ... }`. The name must be an
identifier, and the value (if one exists) can be pretty much anything. Both the
name and the value can contain [interpolation][].

[interpolation]: /documentation/interpolation

{% codeExample 'css' %}
  @namespace svg url(http://www.w3.org/2000/svg);

  @font-face {
    font-family: "Open Sans";
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
  }

  @counter-style thumbs {
    system: cyclic;
    symbols: "\1F44D";
  }
  ===
  @namespace svg url(http://www.w3.org/2000/svg)

  @font-face
    font-family: "Open Sans"
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2")

  @counter-style thumbs
    system: cyclic
    symbols: "\1F44D"
{% endcodeExample %}

If a CSS at-rule is nested within a style rule, the two automatically swap
positions so that the at-rule is at the top level of the CSS output and the
style rule is within it. This makes it easy to add conditional styling without
having to rewrite the style rule's selector.

{% codeExample 'nested-css-at-rule' %}
  .print-only {
    display: none;

    @media print { display: block; }
  }
  ===
  .print-only
    display: none

    @media print
      display: block
{% endcodeExample %}

## `@media`

{% compatibility 'dart: "1.11.0"', 'libsass: false', 'ruby: "3.7.0"', 'feature: "Range Syntax"' %}
  LibSass and older versions of Dart Sass and Ruby Sass don't support media
  queries with features written in a [range context][]. They do support other
  standard media queries.

  [range context]: https://www.w3.org/TR/mediaqueries-4/#mq-range-context

  {% codeExample 'range-syntax' %}
    @media (width <= 700px) {
      body {
        background: green;
      }
    }
    ===
    @media (width <= 700px)
      body
        background: green
  {% endcodeExample %}
{% endcompatibility %}

The [`@media` rule][] does all of the above and more. In addition to allowing
interpolation, it allows [SassScript expressions][] to be used directly in the
[feature queries][].

[`@media` rule]: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
[SassScript expressions]: /documentation/syntax/structure#expressions
[feature queries]: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#Targeting_media_features

{% codeExample 'media-rule' %}
  $layout-breakpoint-small: 960px;

  @media (min-width: $layout-breakpoint-small) {
    .hide-extra-small {
      display: none;
    }
  }
  ===
  $layout-breakpoint-small: 960px

  @media (min-width: $layout-breakpoint-small)
    .hide-extra-small
      display: none
{% endcodeExample %}

When possible, Sass will also merge media queries that are nested within one
another to make it easier to support browsers that don't yet natively support
nested `@media` rules.

{% codeExample 'merge-media-queries' %}
  @media (hover: hover) {
    .button:hover {
      border: 2px solid black;

      @media (color) {
        border-color: #036;
      }
    }
  }
  ===
  @media (hover: hover)
    .button:hover
      border: 2px solid black

      @media (color)
        border-color: #036
{% endcodeExample %}

## `@supports`

The [`@supports` rule][] also allows [SassScript expressions][] to be used in
the declaration queries.

[SassScript expressions]: /documentation/syntax/structure#expressions
[`@supports` rule]: https://developer.mozilla.org/en-US/docs/Web/CSS/@supports

{% codeExample 'support-at-rule' %}
  @mixin sticky-position {
    position: fixed;
    @supports (position: sticky) {
      position: sticky;
    }
  }

  .banner {
    @include sticky-position;
  }
  ===
  @mixin sticky-position
    position: fixed
    @supports (position: sticky)
      position: sticky



  .banner
    @include sticky-position
{% endcodeExample %}

## `@keyframes`

The [`@keyframes` rule][] works just like a general at-rule, except that its
child rules must be valid keyframe rules (`<number>%`, `from`, or `to`) rather
than normal selectors.

[`@keyframes` rule]: https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes

{% codeExample 'keyframes' %}
  @keyframes slide-in {
    from {
      margin-left: 100%;
      width: 300%;
    }

    70% {
      margin-left: 90%;
      width: 150%;
    }

    to {
      margin-left: 0%;
      width: 100%;
    }
  }
  ===
  @keyframes slide-in
    from
      margin-left: 100%
      width: 300%


    70%
      margin-left: 90%
      width: 150%


    to
      margin-left: 0%
      width: 100%
{% endcodeExample %}

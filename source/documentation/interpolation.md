---
title: Interpolation
table_of_contents: true
introduction: >
  Interpolation can be used almost anywhere in a Sass stylesheet to embed the
  result of a [SassScript
  expression](/documentation/syntax/structure#expressions) into a chunk of CSS.
  Just wrap an expression in `#{}` in any of the following places:
---

* [Selectors in style rules](/documentation/style-rules#interpolation)
* [Property names in declarations](/documentation/style-rules/declarations#interpolation)
* [Custom property values](/documentation/style-rules/declarations#custom-properties)
* [CSS at-rules](/documentation/at-rules/css)
* [`@extend`s](/documentation/at-rules/extend)
* [Plain CSS `@import`s](/documentation/at-rules/import/#plain-css-imports)
* [Quoted or unquoted strings](/documentation/values/strings)
* [Special functions](/documentation/syntax/special-functions)
* [Plain CSS function names](/documentation/at-rules/function/#plain-css-functions)
* [Loud comments](/documentation/syntax/comments)

{% codeExample 'interpolation' %}
  @mixin corner-icon($name, $top-or-bottom, $left-or-right) {
    .icon-#{$name} {
      background-image: url("/icons/#{$name}.svg");
      position: absolute;
      #{$top-or-bottom}: 0;
      #{$left-or-right}: 0;
    }
  }

  @include corner-icon("mail", top, left);
  ===
  @mixin corner-icon($name, $top-or-bottom, $left-or-right)
    .icon-#{$name}
      background-image: url("/icons/#{$name}.svg")
      position: absolute
      #{$top-or-bottom}: 0
      #{$left-or-right}: 0



  @include corner-icon("mail", top, left)
{% endcodeExample %}

## In SassScript

{% compatibility 'dart: true', 'libsass: false', 'ruby: "4.0.0 (unreleased)"', 'feature: "Modern Syntax"' %}
  LibSass and Ruby Sass currently use an older syntax for parsing
  interpolation in SassScript. For most practical purposes it works the same,
  but it can behave strangely around [operators][]. See [this document][] for
  details.

  [operators]: /documentation/operators
  [this document]: https://github.com/sass/sass/blob/main/accepted/free-interpolation.md#old-interpolation-rules
{% endcompatibility %}

Interpolation can be used in SassScript to inject SassScript into [unquoted
strings][]. This is particularly useful when dynamically generating names (for
example for animations), or when using [slash-separated values][]. Note that
interpolation in SassScript always returns an unquoted string.

[unquoted strings]: /documentation/values/strings#unquoted
[slash-separated values]: /documentation/operators/numeric#slash-separated-values

<!-- Add explicit CSS here to prevent diffs due to the use of unique-id -->

{% codeExample 'interpolation-sass-script' %}
  @mixin inline-animation($duration) {
    $name: inline-#{unique-id()};

    @keyframes #{$name} {
      @content;
    }

    animation-name: $name;
    animation-duration: $duration;
    animation-iteration-count: infinite;
  }

  .pulse {
    @include inline-animation(2s) {
      from { background-color: yellow }
      to { background-color: red }
    }
  }
  ===
  @mixin inline-animation($duration)
    $name: inline-#{unique-id()}

    @keyframes #{$name}
      @content


    animation-name: $name
    animation-duration: $duration
    animation-iteration-count: infinite


  .pulse
    @include inline-animation(2s)
      from
        background-color: yellow
      to
        background-color: red
  ===
  .pulse {
    animation-name: inline-uifpe6h;
    animation-duration: 2s;
    animation-iteration-count: infinite;
  }
  @keyframes inline-uifpe6h {
    from {
      background-color: yellow;
    }
    to {
      background-color: red;
    }
  }
{% endcodeExample %}

{% funFact %}
  Interpolation is useful for injecting values into strings, but other than that
  it's rarely necessary in SassScript expressions. You definitely *don't* need
  it to just use a variable in a property value. Instead of writing `color:
  #{$accent}`, you can just write `color: $accent`!
{% endfunFact %}

{% headsUp %}
  It's almost always a bad idea to use interpolation with numbers. Interpolation
  returns unquoted strings that can't be used for any further math, and it
  avoids Sass's built-in safeguards to ensure that units are used correctly.

  Sass has powerful [unit arithmetic][] that you can use instead. For example,
  instead of writing `#{$width}px`, write `$width * 1px`—or better yet, declare
  the `$width` variable in terms of `px` to begin with. That way if `$width`
  already has units, you'll get a nice error message instead of compiling bogus
  CSS.

  [unit arithmetic]: /documentation/values/numbers#units
{% endheadsUp %}

## Quoted Strings

In most cases, interpolation injects the exact same text that would be used if
the expression were used as a [property value][]. But there is one exception:
the quotation marks around quoted strings are removed (even if those quoted
strings are in lists). This makes it possible to write quoted strings that
contain syntax that's not allowed in SassScript (like selectors) and interpolate
them into style rules.

[property value]: /documentation/style-rules/declarations

{% codeExample 'quoted-strings' %}
  .example {
    unquoted: #{"string"};
  }
  ===
  .example
    unquoted: #{"string"}
{% endcodeExample %}

{% headsUp %}
  While it's tempting to use this feature to convert quoted strings to unquoted
  strings, it's a lot clearer to use the [`string.unquote()` function][].
  Instead of `#{$string}`, write `string.unquote($string)`!

  [`string.unquote()` function]: /documentation/modules/string#unquote
{% endheadsUp %}

---
title: "@warn"
introduction: >
  When writing [mixins](/documentation/at-rules/mixin) and
  [functions](/documentation/at-rules/function), you may want to discourage
  users from passing certain arguments or certain values. They may be passing
  legacy arguments that are now deprecated, or they may be calling your API in a
  way that’s not quite optimal.
---

The `@warn` rule is designed just for that. It's written `@warn <expression>`
and it prints the value of the [expression][] (usually a string) for the user,
along with a stack trace indicating how the current mixin or function was
called. Unlike the [`@error` rule][], though, it doesn't stop Sass entirely.

[expression]: /documentation/syntax/structure#expressions
[`@error` rule]: /documentation/at-rules/error

{% codeExample 'warn' %}
  $known-prefixes: webkit, moz, ms, o;

  @mixin prefix($property, $value, $prefixes) {
    @each $prefix in $prefixes {
      @if not index($known-prefixes, $prefix) {
        @warn "Unknown prefix #{$prefix}.";
      }

      -#{$prefix}-#{$property}: $value;
    }
    #{$property}: $value;
  }

  .tilt {
    // Oops, we typo'd "webkit" as "wekbit"!
    @include prefix(transform, rotate(15deg), wekbit ms);
  }
  ===
  $known-prefixes: webkit, moz, ms, o

  @mixin prefix($property, $value, $prefixes)
    @each $prefix in $prefixes
      @if not index($known-prefixes, $prefix)
        @warn "Unknown prefix #{$prefix}."


      -#{$prefix}-#{$property}: $value

    #{$property}: $value


  .tilt
    // Oops, we typo'd "webkit" as "wekbit"!
    @include prefix(transform, rotate(15deg), wekbit ms)
  ===
  .tilt {
    -wekbit-transform: rotate(15deg);
    -ms-transform: rotate(15deg);
    transform: rotate(15deg);
  }
{% endcodeExample %}

The exact format of the warning and stack trace varies from implementation to
implementation. This is what it looks like in Dart Sass:

```
Warning: Unknown prefix wekbit.
    example.scss 6:7   prefix()
    example.scss 16:3  root stylesheet
```

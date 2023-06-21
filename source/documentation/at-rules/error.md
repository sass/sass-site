---
title: "@error"
introduction: >
  When writing [mixins](/documentation/at-rules/mixin) and
  [functions](/documentation/at-rules/function) that take arguments, you usually
  want to ensure that those arguments have the types and formats your API
  expects. If they aren't, the user needs to be notified and your mixin/function
  needs to stop running.
---

Sass makes this easy with the `@error` rule, which is written `@error
<expression>`. It prints the value of the [expression][] (usually a string)
along with a stack trace indicating how the current mixin or function was
called. Once the error is printed, Sass stops compiling the stylesheet and tells
whatever system is running it that an error occurred.

[expression]: /documentation/syntax/structure#expressions

{% codeExample 'error', false %}
  @mixin reflexive-position($property, $value) {
    @if $property != left and $property != right {
      @error "Property #{$property} must be either left or right.";
    }

    $left-value: if($property == right, initial, $value);
    $right-value: if($property == right, $value, initial);

    left: $left-value;
    right: $right-value;
    [dir=rtl] & {
      left: $right-value;
      right: $left-value;
    }
  }

  .sidebar {
    @include reflexive-position(top, 12px);
    //       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Error: Property top must be either left or right.
  }
  ===
  @mixin reflexive-position($property, $value)
    @if $property != left and $property != right
      @error "Property #{$property} must be either left or right."


    $left-value: if($property == right, initial, $value)
    $right-value: if($property == right, $value, initial)

    left: $left-value
    right: $right-value
    [dir=rtl] &
      left: $right-value
      right: $left-value



  .sidebar
    @include reflexive-position(top, 12px)
    //       ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // Error: Property top must be either left or right.
{% endcodeExample %}

The exact format of the error and stack trace varies from implementation to
implementation, and can also depend on your build system. This is what it looks
like in Dart Sass when run from the command line:

```
Error: "Property top must be either left or right."
  ╷
3 │     @error "Property #{$property} must be either left or right.";
  │     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  ╵
  example.scss 3:5   reflexive-position()
  example.scss 19:3  root stylesheet
```

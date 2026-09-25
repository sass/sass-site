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

{% codeExample 'error' %}
  @mixin reflexive-position($property, $value) {
    @if $property != left and $property != right {
      @error "Property #{$property} must be either left or right.";
    }

    $left-value: if(sass($property == right): initial; else: $value);
    $right-value: if(sass($property == right): $value; else: initial);

    left: $left-value;
    right: $right-value;
    [dir=rtl] & {
      left: $right-value;
      right: $left-value;
    }
  }

  .sidebar {
    @include reflexive-position(top, 12px);
  }
  ===
  @mixin reflexive-position($property, $value)
    @if $property != left and $property != right
      @error "Property #{$property} must be either left or right."


    $left-value: if(sass($property == right): initial; else: $value)
    $right-value: if(sass($property == right): $value; else: initial)

    left: $left-value
    right: $right-value
    [dir=rtl] &
      left: $right-value
      right: $left-value



  .sidebar
    @include reflexive-position(top, 12px)
{% endcodeExample %}

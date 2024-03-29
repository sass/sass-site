---
title: 'Breaking Change: Extending Compound Selectors'
introduction: >
  LibSass currently allows compound selectors like `.message.info` to be
  [extended](/documentation/at-rules/extend), but the way it was extended
  doesn't match the way `@extend` is meant to work.
---

{% compatibility 'dart: true', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

When one selector extends another, Sass styles all elements that match the
extender as though they also match the class being extended. In other words, if
you write `.heads-up {@extend .info}`, it works just like you replaced
`class="heads-up"` in your HTML with `class="heads-up info"`.

Following that logic, you'd expect that `.heads-up {@extend .message.info}` to
work like replacing `class="heads-up"` with `class="heads-up info message"`. But
that's not how it works right now in LibSass and Ruby Sass--instead of adding
`.heads-up` to every selector that has *either `.info` or `.message`*, it only
adds it to selectors that have *`.info.message` together*.

{% codeExample 'extend-compound-bad', false %}
  // These should both be extended, but they won't be.
  .message {
    border: 1px solid black;
  }
  .info {
    font-size: 1.5rem;
  }

  .heads-up {
    @extend .message.info;
  }
  ===
  // These should both be extended, but they won't be.
  .message
    border: 1px solid black

  .info
    font-size: 1.5rem


  .heads-up
    @extend .message.info
{% endcodeExample %}

To fix this issue, avoid more confusion, and keep the implementation clean and
efficient the ability to extend compound selectors is unsupported in Dart Sass
and will be removed in a future version of LibSass. For compatibility, users
should extend each simple selector separately instead:

{% codeExample 'extend-compound-good' %}
  .message {
    border: 1px solid black;
  }
  .info {
    font-size: 1.5rem;
  }

  .heads-up {
    @extend .message, .info;
  }
  ===
  .message
    border: 1px solid black

  .info
    font-size: 1.5rem


  .heads-up
    @extend .message, .info
{% endcodeExample %}

{% headsUp %}
  Because Sass doesn't know the details of the HTML the CSS is going to style,
  any `@extend` might need to generate extra selectors that won't apply to your
  HTML in particular. This is especially true when switching away from extending
  compound selectors.

  Most of the time, these extra selectors won't cause any problems, and will
  only add a couple extra bytes to gzipped CSS. But some stylesheets might be
  relying more heavily on the old behavior. In that case, we recommend replacing
  the compound selector with a [placeholder selector][].

  [placeholder selector]: /documentation/style-rules/placeholder-selectors

  {% codeExample 'extend-compound-heads-up' %}
    // Instead of just `.message.info`.
    %message-info, .message.info {
      border: 1px solid black;
      font-size: 1.5rem;
    }

    .heads-up {
      // Instead of `.message.info`.
      @extend %message-info;
    }
    ===
    // Instead of just `.message.info`.
    %message-info, .message.info
      border: 1px solid black
      font-size: 1.5rem


    .heads-up
      // Instead of `.message.info`.
      @extend %message-info
  {% endcodeExample %}
{% endheadsUp %}

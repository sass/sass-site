---
title: Parent Selector
introduction: >
  The parent selector, `&`, is a special selector invented by Sass that’s used
  in [nested selectors](/documentation/style-rules#nesting) to refer to the
  outer selector. It makes it possible to re-use the outer selector in more
  complex ways, like adding a
  [pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
  or adding a selector *before* the parent.
---

When a parent selector is used in an inner selector, it's replaced with the
corresponding outer selector. This happens instead of the normal nesting
behavior.

{% codeExample 'parent-selector' %}
  .alert {
    // The parent selector can be used to add pseudo-classes to the outer
    // selector.
    &:hover {
      font-weight: bold;
    }

    // It can also be used to style the outer selector in a certain context, such
    // as a body set to use a right-to-left language.
    [dir=rtl] & {
      margin-left: 0;
      margin-right: 10px;
    }

    // You can even use it as an argument to pseudo-class selectors.
    :not(&) {
      opacity: 0.8;
    }
  }
  ===
  .alert
    // The parent selector can be used to add pseudo-classes to the outer
    // selector.
    &:hover
      font-weight: bold


    // It can also be used to style the outer selector in a certain context, such
    // as a body set to use a right-to-left language.
    [dir=rtl] &
      margin-left: 0
      margin-right: 10px


    // You can even use it as an argument to pseudo-class selectors.
    :not(&)
      opacity: 0.8
{% endcodeExample %}

{% headsUp %}
  Because the parent selector could be replaced by a type selector like `h1`,
  it's only allowed at the beginning of compound selectors where a type selector
  would also be allowed. For example, `span&` is not allowed.

  We're looking into loosening this restriction, though. If you'd like to help
  make that happen, check out [this GitHub issue][].

  [this GitHub issue]: https://github.com/sass/sass/issues/1425
{% endheadsUp %}

## Adding Suffixes

You can also use the parent selector to add extra suffixes to the outer
selector. This is particularly useful when using a methodology like [BEM][] that
uses highly structured class names. As long as the outer selector ends with an
alphanumeric name (like class, ID, and element selectors), you can use the
parent selector to append additional text.

[BEM]: http://getbem.com/

{% codeExample 'parent-selector-suffixes' %}
  .accordion {
    max-width: 600px;
    margin: 4rem auto;
    width: 90%;
    font-family: "Raleway", sans-serif;
    background: #f4f4f4;

    &__copy {
      display: none;
      padding: 1rem 1.5rem 2rem 1.5rem;
      color: gray;
      line-height: 1.6;
      font-size: 14px;
      font-weight: 500;

      &--open {
        display: block;
      }
    }
  }
  ===
  .accordion
    max-width: 600px
    margin: 4rem auto
    width: 90%
    font-family: "Raleway", sans-serif
    background: #f4f4f4

    &__copy
      display: none
      padding: 1rem 1.5rem 2rem 1.5rem
      color: gray
      line-height: 1.6
      font-size: 14px
      font-weight: 500

      &--open
        display: block
{% endcodeExample %}

## In SassScript

The parent selector can also be used within SassScript. It's a special
expression that returns the current parent selector in the same format used by
[selector functions][]: a comma-separated list (the selector list) that contains
space-separated lists (the complex selectors) that contain unquoted strings (the
compound selectors).

[selector functions]: /documentation/modules/selector#selector-values

{% codeExample 'parent-selector-sassscript' %}
  .main aside:hover,
  .sidebar p {
    parent-selector: &;
    // => ((unquote(".main") unquote("aside:hover")),
    //     (unquote(".sidebar") unquote("p")))
  }
  ===
  .main aside:hover,
  .sidebar p
    parent-selector: &
    // => ((unquote(".main") unquote("aside:hover")),
    //     (unquote(".sidebar") unquote("p")))
{% endcodeExample %}

If the `&` expression is used outside any style rules, it returns `null`. Since
`null` is [falsey][], this means you can easily use it to determine whether a
mixin is being called in a style rule or not.

[falsey]: /documentation/at-rules/control/if#truthiness-and-falsiness

{% render 'code_snippets/example-if-parent-selector' %}

### Advanced Nesting

You can use `&` as a normal SassScript expression, which means you can pass it
to functions or include it in interpolation—even in other selectors! Using it in
combination with [selector functions][] and the [`@at-root` rule][] allows you
to nest selectors in very powerful ways.

[selector functions]: /documentation/modules/selector#selector-values
[`@at-root` rule]: /documentation/at-rules/at-root

{% render 'code_snippets/example-advanced-nesting' %}

{% headsUp %}
  When Sass is nesting selectors, it doesn't know what interpolation was used to
  generate them. This means it will automatically add the outer selector to the
  inner selector *even if* you used `&` as a SassScript expression. That's why
  you need to explicitly use the [`@at-root` rule][] to tell Sass not to include
  the outer selector.

  [`@at-root` rule]: /documentation/at-rules/at-root
{% endheadsUp %}

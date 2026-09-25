---
title: 'Breaking Change: Invalid Combinators'
introduction: >
  As of Dart Sass 2.0.0, it's an error to use
  [selector combinators](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Combinators)
  in ways that produce invalid CSS.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Sass historically supported three invalid uses of combinators:

* Leading combinators, as in `+ .error {color: red}`.

* Trailing combinators, as in `.error + {color: red}`.

* Repeated combinators, as in `div > > .error {color: red}`.

None of these are valid CSS, and all of them will cause browsers to ignore the
style rule in question. Supporting them added a substantial amount of complexity
to Sass's implementation, and made it particularly difficult to fix various bugs
related to the `@extend` rule. As such, these patterns are now all errors.

[made the decision]: https://github.com/sass/sass/issues/3340

{% codeExample 'bogus-combinators' %}
  div > > .error {
    color: red;
  }
  ===
  .div > > .error
    color: red
{% endcodeExample %}

**There is one major exception**: leading and trailing combinators may still be
used for nesting purposes. For example, the following is still very much
supported:

{% codeExample 'non-bogus-combinators' %}
  .sidebar > {
    .error {
      color: red;
    }
  }
  ===
  .sidebar >
    .error
      color: red
{% endcodeExample %}

Sass will only produce an error if a selector still has a leading or trailing
combinator _after nesting is resolved_. Repeated combinators, on the other hand,
will always be errors.

## Historical Behavior

In older Sass versions, invalid combinators were emitted as-is to the compiled
CSS, despite making the style rule invalid in all browsers. This behavior was
deprecated in Dart Sass 1.54.0.

{% codeExample 'bogus-combinators-old' %}
  div > > .error {
    color: red;
  }
  ===
  .div > > .error
    color: red
  ===
  div > > .error {
    color: red;
  }
{% endcodeExample %}

To make sure existing stylesheets who (likely accidentally) contain invalid
combinators, we'll support a transition period until the next major release of
Dart Sass.

{% render 'silencing_deprecations' %}

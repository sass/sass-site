---
title: "Breaking Change: Invalid Combinators"
introduction: >
  Sass has historically been very permissive about the use of leading, trailing,
  and repeated combinators in selectors. These combinators are being deprecated
  except where they're useful for nesting.
---

Sass has historically supported three invalid uses of combinators:

* Leading combinators, as in `+ .error {color: red}`.

* Trailing combinators, as in `.error + {color: red}`.

* Repeated combinators, as in `div > > .error {color: red}`.

None of these are valid CSS, and all of them will cause browsers to ignore the
style rule in question. Supporting them added a substantial amount of complexity
to Sass's implementation, and made it particularly difficult to fix various bugs
related to the `@extend` rule. As such, we [made the decision] to remove support
for these uses.

[made the decision]: https://github.com/sass/sass/issues/3340

**There is one major exception**: leading and trailing combinators may still be
used for nesting purposes. For example, the following is still very much
supported:

{% codeExample 1 %}
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

To make sure existing stylesheets who (likely accidentally) contain invalid
combinators, we'll support a transition period until the next major release of
Dart Sass.

## Transition Period

{% compatibility '1.54.0', false, null, false %}{% endcompatibility %}

First, we'll emit deprecation warnings for all double combinators, as well as
leading or trailing combinators that end up in selectors after nesting is
resolved.

{% render 'documentation/snippets/silence-deprecations' %}

In addition, we'll immediately start omitting selectors that we know to be
invalid CSS from the compiled CSS, with one exception: we _won't_ omit selectors
that begin with a leading combinator, since they may be used from a nested
`@import` rule or `meta.load-css()` mixin. However, we don't encourage this
pattern and will drop support for it in Dart Sass 2.0.0.

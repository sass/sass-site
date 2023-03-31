---
title: "Sass and Native Nesting"
author: Natalie Weizenbaum
date: 2023-03-29 14:30 PST
---

The stable release of Chrome 112, which is releasing today, is the first stable
browser to add support for the new [native CSS nesting feature]. This feature—
inspired by Sass's nesting—adds the ability to nest style rules in plain CSS,
and even uses Sass's convention of `&` to refer to the parent selector.

[native CSS nesting feature]: https://drafts.csswg.org/css-nesting/

We here at Sass HQ are honored every time our language design inspires
improvements in CSS itself. We're excited to see the usability and clarity
benefits of nesting brought to even more CSS authors as more browsers continue
to roll out support for this feature.

## The Future of Sass Nesting

This raises an important question, though: what will happen to Sass's nesting?
First of all, we won't ever change existing valid Sass code so that it starts
emitting CSS that's incompatible with widely-used browsers. This means that even
if we did decide to phase out Sass nesting and just emit plain CSS nesting
instead, we wouldn't do so until [98% of the global browser market share]
supported native nesting.

[98% of the global browser market share]: https://github.com/sass/dart-sass#browser-compatibility

More importantly, though, **native CSS nesting is subtly incompatible with Sass
nesting**. This affects three different cases:

1. Native CSS nesting implicitly wraps the parent selector in [`:is()`], while
   Sass copies its text into the resolved selector. That means that

   [`:is()`]: https://developer.mozilla.org/en-US/docs/Web/CSS/:is

   ```scss
   .foo, #bar {
     .baz { /* ... */ }
   }
   ```

   produces the selector `.foo .baz, #bar .baz` in Sass but `:is(.foo, #bar)
   .baz` in native CSS. This changes the specificity: `:is()` always has the
   specificity of its _most specific selector_, so `:is(.foo, #bar) .baz` will
   match
   
   ```html
   <div class=foo>
     <p class=baz>
   </div>
   ```
   
   with specificity 1 0 1 in native CSS and 0 0 2 in Sass even though neither
   element is matched by ID.

2. Also because native CSS nesting uses `:is()`, a parent selector with
   descendant combinators will behave differently.

   ```scss
   .foo .bar {
     .green-theme & { /* ... */ }
   }
   ```

   produces the selector `.green-theme .foo .bar` in Sass, but in native CSS it
   produces `.green-theme :is(.foo .bar)`. This means that the native CSS
   version will match
   
   ```html
   <div class=foo>
     <div class="green-theme">
       <p class=bar>
     </div>
   </div>
   ```

   but Sass will not, since the element matching `.foo` is outside the element
   matching `.green-theme`.

3. Sass nesting and native CSS nesting both support syntax that looks like
   `&foo`, but it means different things. In Sass, this adds a suffix to the
   parent selector, so

   ```scss
   .foo {
     &-suffix { /* ... */ }
   }
   ```

   produces the selector `.foo-suffix`. But in native CSS, this adds a type
   selector to the parent selector, so
   
   ```scss
   .foo {
     &div { /* ... */ }
   }
   ```

   produces the selector `div.foo` (where Sass would produce `.foodiv` instead).
   Native CSS nesting has no way to add a suffix to a selector like Sass.

### Design Commitments

When considering how to handle this new CSS feature, we have two important
design commitments to keep in mind:

* We're committed to being a CSS superset. All valid CSS that's supported by a
  real browser should also work in Sass with the same semantics.

* We're committed to backwards compatibility. As much as possible, we want to
  avoid changing the semantics of existing stylesheets, and if we need to do so
  we want to give users as much time and resources as possible to make the
  change gracefully.

In most cases, remaining a CSS superset trumps backwards compatibility. However,
nesting is one of the oldest and most widely-used Sass features so we're
particularly reluctant to change it, especially in ways that would drop support
for widely-used features like `&-suffix` that don't have an elegant equivalent
in native CSS.

### The Plan for Sass

**In the short term**, we don't intend to change anything about Sass nesting.
Sass will simply not support plain CSS nesting unless we can do so in a way
that's fully compatible with existing Sass behavior.

We _will_ add support for parsing plain CSS nesting in `.css` files. This
nesting won't be resolved in any way; Sass will just emit it as-is.

**In the long term**, once [`:is()` is supported by 98% of the global browser
market share], we'll start transitioning Sass to emit `:is()` when resolving
Sass nesting. This will make Sass behave like CSS in the first two behavioral
incompatibilities. We will consider this a breaking change, and release it as
part of a major version release to avoid unexpectedly breaking existing
stylesheets. We'll do our best to make this transition as smooth as possible
using the [Sass Migrator].

[`:is()` is supported by 98% of the global browser market share]: https://caniuse.com/css-matches-pseudo
[Sass Migrator]: /documentation/cli/migrator

We will _not_ drop our current behavior for `&-suffix` unless we can come up
with a comparably ergonomic way to represent it that's more compatible with CSS.
This behavior is too important to existing Sass users, and the benefit of the
plain CSS version is not strong enough to override that.

---
title: "Request For Comments: Module System"
author: Natalie Weizenbaum
date: 2018-11-27 13:10:00 -8
---

Many of the most frequently-requested features for Sass have to do with its
imports. The import system that we've had since the very early releases of Sass
is, to put it simply, not great. It does little more than textually include one
Sass file in another, which makes it hard to keep track of where mixins,
functions, and variables were defined and hard to be sure that any new additions
won't happen to conflict with something elsewhere in the project. To make
matters worse, it overlaps with CSS's built-in `@import` rule, which forces us
to have [a bunch of heuristics](/documentation/file.SASS_REFERENCE.html#import)
to decide which is which.

Because of these problems and others, we've wanted to do a full overhaul of the
way Sass files relate to one another for a long time. Over the last few years,
I've been working with the Sass core team and Sass framework maintainers to
create a proposal for a module system that's fit to replace `@import`. That
proposal is now in a place that the core team is pretty happy with, at least as
a starting point, so we want to open it up for community feedback.

If you want to read the full proposal, [it's available on
GitHub](https://github.com/sass/language/blob/main/accepted/module-system.md).
Feel free to [file issues](https://github.com/sass/language/issues/new) for any
feedback you have. The main body of the proposal is written as a spec, so it's
very detailed, but the Goals, Summary, and FAQ sections (reproduced below)
should be accessible to anyone familiar with Sass.

## Goals

### High-Level

These are the philosophical design goals for the module system as a whole. While
they don't uniquely specify a system, they do represent the underlying
motivations behind many of the lower-level design decisions.

* **Locality**. The module system should make it possible to understand a Sass
  file by looking only at that file. An important aspect of this is that names
  in the file should be resolved based on the contents of the file rather than
  the global state of the compilation. This also applies to authoring: an author
  should be able to be confident that a name is safe to use as long as it
  doesn't conflict with any name visible in the file.

* **Encapsulation**. The module system should allow authors, particularly
  library authors, to choose what API they expose. They should be able to define
  entities for internal use without making those entities available for external
  users to access or modify. The organization of a library's implementation into
  files should be flexible enough to change without changing the user-visible
  API.

* **Configuration**. Sass is unusual among languages in that its design leads to
  the use of files whose entire purpose is to produce side effects—specifically,
  to emit CSS. There's also a broader class of libraries that may not emit CSS
  directly, but do define configuration variables that are used in computations,
  including computation of other top-level variables' values. The module system
  should allow the user to flexibly use and configure modules with side-effects.

### Low-Level

These are goals that are based less on philosophy than on practicality. For the
most part, they're derived from user feedback that we've collected about
`@import` over the years.

* **Import once**. Because `@import` is a literal textual inclusion, multiple
  `@import`s of the same Sass file within the scope of a compilation will
  compile and run that file multiple times. At best this hurts compilation time
  for little benefit, and it can also contribute to bloated CSS output when the
  styles themselves are duplicated. The new module system should only compile a
  file once.

* **Backwards compatibility**. We want to make it as easy as possible for people
  to migrate to the new module system, and that means making it work in
  conjunction with existing stylesheets that use `@import`. Existing stylesheets
  that only use `@import` should have identical importing behavior to earlier
  versions of Sass, and stylesheets should be able to change parts to `@use`
  without changing the whole thing at once.

### Non-Goals

These are potential goals that we have explicitly decided to avoid pursuing as
part of this proposal for various reasons. Some of them may be on the table for
future work, but we don't consider them to be blocking the module system.

* **Dynamic imports**. Allowing the path to a module to be defined dynamically,
  whether by including variables or including it in a conditional block, moves
  away from being declarative. In addition to making stylesheets harder to read,
  this makes any sort of static analysis more difficult (and actually impossible
  in the general case). It also limits the possibility of future implementation
  optimizations.

* **Importing multiple files at once**. In addition to the long-standing reason
  that this hasn't been supported—that it opens authors up to sneaky and
  difficult-to-debug ordering bugs—this violates the principle of locality by
  obfuscating which files are imported and thus where names come from.

* **Extend-only imports**. The idea of importing a file so that the CSS it
  generates isn't emitted unless it's `@extend`ed is cool, but it's also a lot
  of extra work. This is the most likely feature to end up in a future release,
  but it's not central enough to include in the initial module system.

* **Context-independent modules**. It's tempting to try to make the loaded form
  of a module, including the CSS it generates and the resolved values of all its
  variables, totally independent of the entrypoint that cause it to be loaded.
  This would make it possible to share loaded modules across multiple
  compilations and potentially even serialize them to the filesystem for
  incremental compilation.

  However, it's not feasible in practice. Modules that generate CSS almost
  always do so based on some configuration, which may be changed by different
  entrypoints rendering caching useless. What's more, multiple modules may
  depend on the same shared module, and one may modify its configuration before
  the other uses it. Forbidding this case in general would effectively amount to
  forbidding modules from generating CSS based on variables.

  Fortunately, implementations have a lot of leeway to cache information that
  the can statically determine to be context-independent, including source trees
  and potentially even constant-folded variable values and CSS trees. Full
  context independence isn't likely to provide much value in addition to that.

* **Increased strictness**. Large teams with many people often want stricter
  rules around how Sass stylesheets are written, to enforce best practices and
  quickly catch mistakes. It's tempting to use a new module system as a lever to
  push strictness further; for example, we could make it harder to have partials
  directly generate CSS, or we could decline to move functions we'd prefer
  people avoid to the new built-in modules.

  As tempting as it is, though, we want to make all existing use-cases as easy
  as possible in the new system, *even if we think they should be avoided*. This
  module system is already a major departure from the existing behavior, and
  will require a substantial amount of work from Sass users to support. We want
  to make this transition as easy as possible, and part of that is avoiding
  adding any unnecessary hoops users have to jump through to get their existing
  stylesheets working in the new module system.

  Once `@use` is thoroughly adopted in the ecosystem, we can start thinking
  about increased strictness in the form of lints or TypeScript-style
  `--strict-*` flags.

* **Code splitting**. The ability to split monolithic CSS into separate chunks
  that can be served lazily is important for maintaining quick load times for
  very large applications. However, it's orthogonal to the problems that this
  module system is trying to solve. This system is primarily concerned with
  scoping Sass APIs (mixins, functions, and placeholders) rather than declaring
  dependencies between chunks of generated CSS.

  We believe that this module system can work in concert with external
  code-splitting systems. For example, the module system can be used to load
  libraries that are used to style individual components, each of which is
  compiled to its own CSS file. These CSS files could then declare dependencies
  on one another using special comments or custom at-rules and be stitched
  together by a code-splitting post-processor.

## Summary

This proposal adds two at-rules, `@use` and `@forward`, which may only appear at
the top level of stylesheets before any rules (other than `@charset`). Together,
they're intended to completely replace `@import`, which will eventually be
deprecated and even more eventually removed from the language.

### `@use`

`@use` makes CSS, variables, mixins, and functions from another stylesheet
accessible in the current stylesheet. By default, variables, mixins, and
functions are available in a namespace based on the basename of the URL.

```scss
@use "bootstrap";

.element {
  @include bootstrap.float-left;
}
```

In addition to namespacing, there are a few important differences between `@use`
and `@import`:

* `@use` only executes a stylesheet and includes its CSS once, no matter how
  many times that stylesheet is used.
* `@use` only makes names available in the current stylesheet, as opposed to
  globally.
* Members whose names begin with `-` or `_` are private to the current
  stylesheet with `@use`.
* If a stylesheet includes `@extend`, that extension is only applied to
  stylesheets it imports, not stylesheets that import it.

Note that placeholder selectors are *not* namespaced, but they *do* respect
privacy.

#### Controlling Namespaces

Although a `@use` rule's default namespace is determined by the basename of its
URL, it can also be set explicitly using `as`.

```scss
@use "bootstrap" as b;

.element {
  @include b.float-left;
}
```

The special construct `as *` can also be used to include everything in the
top-level namespace. Note that if multiple modules expose members with the same
name and are used with `as *`, Sass will produce an error.

```scss
@use "bootstrap" as *;

.element {
  @include float-left;
}
```

#### Configuring Libraries

With `@import`, libraries are often configured by setting global variables that
override `!default` variables defined by those libraries. Because variables are
no longer global with `@use`, it supports a more explicit way of configuring
libraries: the `with` clause.

```scss
// bootstrap.scss
$paragraph-margin-bottom: 1rem !default;

p {
  margin-top: 0;
  margin-bottom: $paragraph-margin-bottom;
}
```

```scss
@use "bootstrap" with (
  $paragraph-margin-bottom: 1.2rem
);
```

This sets bootstrap's `$paragraph-margin-bottom` variable to `1.2rem` before
evaluating it. The `with` clause only allows variables defined in (or forwarded
by) the module being imported, and only if they're defined with `!default`, so
users are protected against typos.

### `@forward`

The `@forward` rule includes another module's variables, mixins, and functions
as part of the API exposed by the current module, without making them visible to
code within the current module. It allows library authors to be able to split up
their library among many different source files without sacrificing locality
within those files. Unlike `@use`, forward doesn't add any namespaces to names.

```scss
// bootstrap.scss
@forward "functions";
@forward "variables";
@forward "mixins";
```

#### Visibility Controls

A `@forward` rule can choose to show only specific names:

```scss
@forward "functions" show color-yiq;
```

It can also hide names that are intended to be library-private:

```scss
@forward "functions" hide assert-ascending;
```

#### Extra Prefixing

If you forward a child module through an all-in-one module, you may want to add
some manual namespacing to that module. You can do what with the `as` clause,
which adds a prefix to every member name that's forwarded:

```scss
// material/_index.scss
@forward "theme" as theme-*;
```

This way users can use the all-in-one module with well-scoped names for theme
variables:

```scss
@use "material" with ($theme-primary: blue);
```

or they can use the child module with simpler names:

```scss
@use "material/theme" with ($primary: blue);
```

### `@import` Compatibility

The Sass ecosystem won't switch to `@use` overnight, so in the meantime it needs
to interoperate well with `@import`. This is supported in both directions:

* When a file that contains `@import`s is `@use`d, everything in its global
  namespace is treated as a single module. This module's members are then
  referred to using its namespace as normal.

* When a file that contains `@use`s is `@import`ed, everything in its public API
  is added to the importing stylesheet's global scope. This allows a library to
  control what specific names it exports, even for users who `@import` it rather
  than `@use` it.

In order to allow libraries to maintain their existing `@import`-oriented API,
with explicit namespacing where necessary, this proposal also adds support for
files that are only visible to `@import`, not to `@use`. They're written
`"file.import.scss"`, and imported when the user writes `@import "file"`.

### Built-In Modules

The new module system will also add seven built-in modules: `math`, `color`,
`string`, `list`, `map`, `selector`, and `meta`. These will hold all the
existing built-in Sass functions. Because these modules will (typically) be
imported with a namespace, it will be much easier to use Sass functions without
running into conflicts with plain CSS functions.

This in turn will make it much safer for Sass to add new functions. We expect to
add a number of convenience functions to these modules in the future.

#### `meta.load-css()`

This proposal also adds a new built-in mixin, `meta.load-css($url, $with: ())`.
This mixin dynamically loads the module with the given URL and includes its CSS
(although its functions, variables, and mixins are not made available). This is
a replacement for nested imports, and it helps address some use-cases of dynamic
imports without many of the problems that would arise if new members could be
loaded dynamically.

## Frequently Asked Questions

* **Why this privacy model?** We considered a number of models for declaring
  members to be private, including a JS-like model where only members that were
  explicitly exported from a module were visible and a C#-like model with an
  explicit `@private` keyword. These models involve a lot more boilerplate,
  though, and they work particularly poorly for placeholder selectors where
  privacy may be mixed within a single style rule. Name-based privacy also
  provides a degree of compatibility with conventions libraries are already
  using.

* **Can I make a member library-private?** There's no language-level notion of a
  "library", so library-privacy isn't built in either. However, members used by
  one module aren't automatically visible to downstream modules. If a module
  isn't [`@forward`ed](#forward) through a library's main stylesheet, it won't
  be visible to downstream consumers and thus is effectively library-private.
  <br><br> As a convention, we recommend that libraries write library-private
  stylesheets that aren't intended to be used directly by their users in a
  directory named `src`.

* **How do I make my library configurable?** If you have a large library made up
  of many source files that all share some core `!default`-based configuration,
  we recommend that you define that configuration in a file that gets forwarded
  from your library's entrypoint and used by your library's files. For example:

```scss
// bootstrap.scss
@forward "variables";
@use "reboot";
```

```scss
// _variables.scss
$paragraph-margin-bottom: 1rem !default;
```

```scss
// _reboot.scss
@use "variables" as *;

p {
  margin-top: 0;
  margin-bottom: $paragraph-margin-bottom;
}
```

```scss
// User's stylesheet
@use "bootstrap" with (
  $paragraph-margin-bottom: 1.2rem
);
```

## Sending Feedback

This is still just a proposal. We're pretty happy with the overall shape of the
module system, but it's not at all set in stone, and anything can change with
enough feedback provided by users like you. If you have opinions, please [file
an issue on GitHub](https://github.com/sass/language/issues/new) or just [tweet
at @SassCSS](https://twitter.com/SassCSS). We'll take anything from "it looks
awesome" to "it looks awful", although the more specific you can be the more
information we have to work with!

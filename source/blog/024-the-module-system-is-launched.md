---
title: The Module System is Launched
author: Natalie Weizenbaum
date: 2019-10-01 18:58:00 -8
---

The Sass team has known for years that the `@import` rule, one of the earliest
additions to Sass, wasn't as good as we wanted it. It caused a litany of
problems for our users:

- It was next to impossible to figure out where a given variable, mixin, or
  function (collectively called "members") was originally defined, since
  anything defined in one stylesheet was available to all stylesheets that were
  imported after it.

- Even if you chose to explicitly import every stylesheet that defined members
  you used, you'd end up with duplicate CSS and strange side-effects, because
  stylesheets were reloaded from scratch every time they were imported.

- It wasn't safe to use terse and simple names because there was always a
  possibility that some other stylesheet elsewhere in your application would use
  the same name and mess up your logic. To be safe users had to manually add
  long, awkward namespaces to everything they defined.

- Library authors had no way to ensure that their private helpers wouldn't be
  accessed by downstream users, causing confusion and backwards-compatibility
  headaches.

- The [`@extend` rule][] could affect any selector anywhere in the stylesheet,
  not just those that its author explicitly chose to extend.

  [`@extend` rule]: /documentation/at-rules/extend

We also knew that any replacement we wanted to introduce would have to be
designed and developed with the utmost care to ensure it would provide a
rock-solid foundation for the future of Sass development. Over the past few
years, we've discussed, designed, and developed a brand-new module system that
solves these problems and more, and today we're excited to announce that it's
available in Dart Sass 1.23.0.

Please note that the module system is _fully backwards-compatible_. No existing
features have been removed or deprecated, and your current Sass stylesheets will
keep working just as they always have. We designed the module system to be
[fully interoperable with `@import`](#import-compatibility) to make it easy for
stylesheet authors to migrate to it incrementally. We do plan to [eventually get
rid of `@import`](#future-plans), but not until long after everyone's had a
chance to migrate.

## `@use`, the Heart of the Module System

The [`@use` rule][] is the primary replacement for `@import`: it makes CSS,
variables, mixins, and functions from another stylesheet accessible in the
current stylesheet. By default, variables, mixins, and functions are available
in a namespace based on the basename of the URL.

[`@use` rule]: /documentation/at-rules/use

```scss
@use 'bootstrap';

.element {
  background-color: bootstrap.$body-bg;
  @include bootstrap.float-left;
}
```

In addition to namespacing, there are a few important differences between `@use`
and `@import`:

- `@use` only executes a stylesheet and includes its CSS once, no matter how
  many times that stylesheet is used.
- `@use` only makes names available in the current stylesheet, as opposed to globally.
- Members whose names begin with `-` or `_` are private to the current
  stylesheet with `@use`.
- If a stylesheet includes `@extend`, that extension is only applied to
  stylesheets it imports, not stylesheets that import it.

Note that placeholder selectors are _not_ namespaced, but they _do_ respect
privacy.

### Controlling Namespaces

Although a `@use` rule's default namespace is determined by the basename of its
URL, it can also be set explicitly using `as`.

```scss
@use 'bootstrap' as b;

.element {
  @include b.float-left;
}
```

The special construct `as *` can also be used to include everything in the
top-level namespace. Note that if multiple modules expose members with the same
name and are used with `as *`, Sass will produce an error.

```scss
@use 'bootstrap' as *;

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
@use 'bootstrap' with (
  $paragraph-margin-bottom: 1.2rem
);
```

This sets bootstrap's `$paragraph-margin-bottom` variable to `1.2rem` before
evaluating it. The `with` clause only allows variables defined in (or forwarded
by) the module being imported, and only if they're defined with `!default`, so
users are protected against typos.

## `@forward`, for Library Authors

The [`@forward` rule][] includes another module's variables, mixins, and
functions as part of the API exposed by the current module, without making them
visible to code within the current module. It allows library authors to be able
to split up their library among many different source files without sacrificing
locality within those files. Unlike `@use`, forward doesn't add any namespaces
to names.

[`@forward` rule]: /documentation/at-rules/forward

```scss
// bootstrap.scss
@forward 'functions';
@forward 'variables';
@forward 'mixins';
```

### Visibility Controls

A `@forward` rule can choose to show only specific names:

```scss
@forward 'functions' show color-yiq;
```

It can also hide names that are intended to be library-private:

```scss
@forward 'functions' hide assert-ascending;
```

### Extra Prefixing

If you forward a child module through an all-in-one module, you may want to add
some manual namespacing to that module. You can do what with the `as` clause,
which adds a prefix to every member name that's forwarded:

```scss
// material/_index.scss
@forward 'theme' as theme-*;
```

This way users can use the all-in-one module with well-scoped names for theme
variables:

```scss
@use 'material' with (
  $theme-primary: blue
);
```

or they can use the child module with simpler names:

```scss
@use 'material/theme' with (
  $primary: blue
);
```

## Built-In Modules

The new module system also adds [built-in modules](/documentation/modules)
(`sass:math`, `sass:color`, `sass:string`, `sass:list`, `sass:map`,
`sass:selector`, and `sass:meta`) to hold all the existing built-in Sass
functions. Because these modules will (typically) be imported with a namespace,
it's now much easier to use Sass functions without running into conflicts with
plain CSS functions.

This in turn makes it much safer for Sass to add new functions. We expect to add a number of convenience functions to these modules in the future.

### Renamed Functions

Some functions have different names in the built-in modules than they did as
global functions. Built-in functions that already had manual namespaces, like
[`map-get()`](/documentation/modules/map#get), have those namespaces removed in
the built-in modules so you can just write `map.get()`. Similarly,
[`adjust-color()`](/documentation/modules/color#adjust),
[`scale-color()`](/documentation/modules/color#scale), and
[`change-color()`](/documentation/modules/color#change) are now
`color.adjust()`, `color.scale()`, and `color.change()`.

We've also taken this opportunity to change a couple confusing old function
names. [`unitless()`](/documentation/modules/math#unitless) is now
`math.is-unitless()`, and
[`comparable()`](/documentation/modules/math#compatible) is now
`math.compatible()`.

### Removed Functions

Sass's shorthand color functions `lighten()`, `darken()`, `saturate()`,
`desaturate()`, `opacify()`, `fade-in()`, `transparentize()`, and `fade-out()`
all had very unintuitive behavior. Rather than scaling their associated
attributes fluidly, they just incremented them by a static amount, so that
`lighten($color, 20%)` would return `white` for a color with `85%` lightness
rather than returning a color with `88%` lightness (`20%` closer to full white).

To help set us on the path towards fixing this, these functions (along with
`adjust-hue()`) aren't included in the new built-in modules. You can still get
the same effect by calling
[`color.adjust()`](/documentation/modules/color#adjust)—for example,
`lighten($color, $amount)` is equivalent to `color.adjust($color, $lightness:
$amount)`—but we recommend trying to use
[`color.scale()`](/documentation/modules/color#scale) instead if possible
because of how much more intuitive it is.

At some point in the future, we plan to add `color.lighten()` and similar
functions as shorthands for `color.scale()`.

### `meta.load-css()`

The new module system comes with a new built-in mixin, [`meta.load-css($url,
$with: ())`](/documentation/modules/meta#load-css). This mixin dynamically loads
the module with the given URL and includes its CSS (although its functions,
variables, and mixins are not made available). This is a replacement for nested
imports, and it helps address some use-cases of dynamic imports without many of
the problems that would arise if new members could be loaded dynamically.

## `@import` Compatibility

The Sass ecosystem won't switch to `@use` overnight, so in the meantime it needs
to [interoperate well with
`@import`](/documentation/at-rules/import#import-and-modules).
This is supported in both directions:

- When a file that contains `@import`s is `@use`d, everything in its global
  namespace is treated as a single module. This module's members are then
  referred to using its namespace as normal.

- When a file that contains `@use`s is `@import`ed, everything in its public API
  is added to the importing stylesheet's global scope. This allows a library to
  control what specific names it exports, even for users who `@import` it rather
  than `@use` it.

In order to allow libraries to maintain their existing `@import`-oriented API,
with explicit namespacing where necessary, this proposal also adds support for
files that are only visible to `@import`, not to `@use`. They're written
`"file.import.scss"`, and imported when the user writes `@import "file"`.

## Automatic Migration

Concurrent with the launch of the new module system, we're launching a new
[automated Sass migrator](/documentation/cli/migrator). This tool makes it easy
to migrate most stylesheets to use the new module system automatically. Follow
the instructions on [the Sass website](/documentation/cli/migrator#installation)
to install it, then run it on your application:

```shellsession
$ sass-migrator module --migrate-deps <path/to/style.scss>
```

The [`--migrate-deps` flag](/documentation/cli/migrator#migrate-deps) tells the
migrator to migrate not only the file you pass, but anything it imports as well.
The migrator will automatically pick up files imported through [Webpack's
`node_modules`
syntax](https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules),
but you can also pass explicit load paths with the [`--load-path`
flag](/documentation/cli/migrator#load-path).

If you want the migrator to tell you what changes it would make without actually
making them, pass both the [`--dry-run`
flag](/documentation/cli/migrator#dry-run) and the [`--verbose`
flag](/documentation/cli/migrator#verbose) to tell it to just print out the
changes it would make without saving them to disk.

### Migrating a Library

If you want to migrate a Sass library that's meant for downstream users to load
and use, run:

```shellsession
$ sass-migrator module --migrate-deps --forward=all <path/to/index.scss>
```

The [`--forward` flag](/documentation/cli/migrator#forward) tells the migrator
to add [`@forward` rules](/documentation/at-rules/forward) so that users can
still load all the mixins, variables, and functions your library defines with a
single `@use`.

If you added a manual namespace to your library to avoid name conflicts, the
migrator will remove it for you if you pass the [`--remove-prefix`
flag](/documentation/cli/migrator#remove-prefix). You can even choose to only
forward members that originally had that prefix by passing `--forward=prefixed`.

### Filing Issues

The migration tool is brand new, so it may still have some rough edges. If you
run into any problems, please don't hesitate to [file an issue on
GitHub](https://github.com/sass/migrator/issues/new)!

## Try It Now!

The module system is available as part of Dart Sass 1.23.0. You can install it
right now using:

```shellsession
$ npm install -g sass
```

Alternately, check out [the installation page](/install) for all the different
ways it can be installed!

## Future Plans

The Sass team wants to allow for a large amount of time when `@use` and
`@import` can coexist, to help the ecosystem smoothly migrate to the new system.
However, doing away with `@import` entirely is the ultimate goal for simplicity,
performance, and CSS compatibility. As such, we plan to gradually turn down
support for `@import` on the following timeline:

- ~~One year after both Dart Sass and LibSass have launched support for the
  module system _or_ two years after Dart Sass launches support for the module
  system, whichever comes sooner (**1 October 2021** at latest), we will
  deprecate `@import` as well as global core library function calls that could
  be made through modules.~~

- ~~One year after this deprecation goes into effect (**1 October 2022** at
  latest), we will drop support for `@import` and most global functions
  entirely. This will involve a major version release for all implementations.~~

~~This means that there will be at least two full years when `@import` and `@use`
are both usable at once, and likely closer to three years in practice.~~

**July 2022**: In light of the fact that LibSass was deprecated before ever
adding support for the new module system, the timeline for deprecating and
removing `@import` has been pushed back. We now intend to wait until 80% of
users are using Dart Sass (measured by npm downloads) before deprecating
`@import`, and wait at least a year after that and likely more before removing
it entirely.

---
title: "@import"
table_of_contents: true
introduction: >
  Sass extends CSS's [`@import`
  rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) with the
  ability to import Sass and CSS stylesheets, providing access to
  [mixins](/documentation/at-rules/mixin),
  [functions](/documentation/at-rules/function), and
  [variables](/documentation/variables) and combining multiple stylesheets' CSS
  together. Unlike plain CSS imports, which require the browser to make multiple
  HTTP requests as it renders your page, Sass imports are handled entirely
  during compilation.
---

Sass imports have the same syntax as CSS imports, except that they allow
multiple imports to be separated by commas rather than requiring each one to
have its own `@import`. Also, in the [indented syntax][], imported URLs aren't
required to have quotes.

[indented syntax]: /documentation/syntax#the-indented-syntax

{% headsUp %}
  As of Dart Sass 1.78.0, the `@import` rule is [deprecated] and will be removed
  from the language in Dart Sass 3.0.0. Prefer the [`@use` rule] instead.

  [deprecated]: /documentation/breaking-changes/import
  [`@use` rule]: /documentation/at-rules/use

  <h4>{{ "What's Wrong With `@import`?" | markdown }}</h4>

  The `@import` rule has a number of serious issues:

  * `@import` makes all variables, mixins, and functions globally accessible.
    This makes it very difficult for people (or tools) to tell where anything is
    defined.

  * Because everything's global, libraries must add a prefix to all their
    members to avoid naming collisions.

  * [`@extend` rules][] are also global, which makes it difficult to predict
    which style rules will be extended.

    [`@extend` rules]: /documentation/at-rules/extend

  * Each stylesheet is executed and its CSS emitted *every time* it's
    `@import`ed, which increases compilation time and produces bloated output.

  * There was no way to define private members or placeholder selectors that
    were inaccessible to downstream stylesheets.

  The new module system and the `@use` rule address all these problems.

  <h4>{{ 'How Do I Migrate?' | markdown }}</h4>

  We've written a [migration tool][] that automatically converts most
  `@import`-based code to `@use`-based code in a flash. Just point it at your
  entrypoints and let it run!

  [migration tool]: /documentation/cli/migrator
{% endheadsUp %}

{% codeExample 'import' %}
  // foundation/_code.scss
  code {
    padding: .25em;
    line-height: 0;
  }
  ---
  // foundation/_lists.scss
  ul, ol {
    text-align: left;

    & & {
      padding: {
        bottom: 0;
        left: 0;
      }
    }
  }
  ---
  // style.scss
  @import 'foundation/code', 'foundation/lists';
  ===
  // foundation/_code.sass
  code
    padding: .25em
    line-height: 0
  ---
  // foundation/_lists.sass
  ul, ol
    text-align: left

    & &
      padding:
        bottom: 0
        left: 0
  ---
  // style.sass
  @import foundation/code, foundation/lists
  ===
  code {
    padding: .25em;
    line-height: 0;
  }

  ul, ol {
    text-align: left;
  }
  ul ul, ol ol {
    padding-bottom: 0;
    padding-left: 0;
  }
{% endcodeExample %}

When Sass imports a file, that file is evaluated as though its contents appeared
directly in place of the `@import`. Any [mixins][], [functions][], and
[variables][] from the imported file are made available, and all its CSS is
included at the exact point where the `@import` was written. What's more, any
mixins, functions, or variables that were defined before the `@import`
(including from other `@import`s) are available in the imported stylesheet.

[mixins]: /documentation/at-rules/mixin
[functions]: /documentation/at-rules/function
[variables]: /documentation/variables

{% headsUp %}
  If the same stylesheet is imported more than once, it will be evaluated again
  each time. If it just defines functions and mixins, this usually isn't a big
  deal, but if it contains style rules they'll be compiled to CSS more than
  once.
{% endheadsUp %}

## Finding the File

It wouldn't be any fun to write out absolute URLs for every stylesheet you
import, so Sass's algorithm for finding a file to import makes it a little
easier. For starters, you don't have to explicitly write out the extension of
the file you want to import; `@import "variables"` will automatically load
`variables.scss`, `variables.sass`, or `variables.css`.

{% headsUp %}
  To ensure that stylesheets work on every operating system, Sass imports files
  by *URL*, not by *file path*. This means you need to use forward slashes, not
  backslashes, even when you're on Windows.
{% endheadsUp %}

### Load Paths

All Sass implementations allow users to provide *load paths*: paths on the
filesystem that Sass will look in when resolving imports. For example, if you
pass `node_modules/susy/sass` as a load path, you can use `@import "susy"` to
load `node_modules/susy/sass/susy.scss`.

Imports will always be resolved relative to the current file first, though. Load
paths will only be used if no relative file exists that matches the import. This
ensures that you can't accidentally mess up your relative imports when you add a
new library.

{% funFact %}
  Unlike some other languages, Sass doesn't require that you use `./` for
  relative imports. Relative imports are always available.
{% endfunFact %}

### Partials

As a convention, Sass files that are only meant to be imported, not compiled on
their own, begin with `_` (as in `_code.scss`). These are called *partials*, and
they tell Sass tools not to try to compile those files on their own. You can
leave off the `_` when importing a partial.

### Index Files

{% compatibility 'dart: true', 'libsass: "3.6.0"', 'ruby: "3.6.0"' %}{% endcompatibility %}

If you write an `_index.scss` or `_index.sass` in a folder, when the folder
itself is imported that file will be loaded in its place.

{% codeExample 'index-files' %}
  // foundation/_code.scss
  code {
    padding: .25em;
    line-height: 0;
  }
  ---
  // foundation/_lists.scss
  ul, ol {
    text-align: left;

    & & {
      padding: {
        bottom: 0;
        left: 0;
      }
    }
  }
  ---
  // foundation/_index.scss
  @import 'code', 'lists';
  ---
  // style.scss
  @import 'foundation';
  ===
  // foundation/_code.sass
  code
    padding: .25em
    line-height: 0
  ---
  // foundation/_lists.sass
  ul, ol
    text-align: left

    & &
      padding:
        bottom: 0
        left: 0
  ---
  // foundation/_index.sass
  @import code, lists
  ---
  // style.sass
  @import foundation
  ===
  code {
    padding: .25em;
    line-height: 0;
  }

  ul, ol {
    text-align: left;
  }
  ul ul, ol ol {
    padding-bottom: 0;
    padding-left: 0;
  }
{% endcodeExample %}

### Custom Importers

All Sass implementations provide a way to define custom importers, which control
how `@import`s locate stylesheets:

* [Node Sass][] and [Dart Sass on npm][] provide an [`importer` option][] as
  part of their JS API.

* [Dart Sass on pub][] provides an abstract [`Importer` class][] that can be
  extended by a custom importer.

* [Ruby Sass][] provides an abstract [`Importers::Base` class][] that can be
  extended by a custom importer.

[Node Sass]: https://npmjs.com/package/node-sass
[Dart Sass on npm]: https://npmjs.com/package/sass
[`importer` option]: https://github.com/sass/node-sass#importer--v200---experimental
[Dart Sass on pub]: https://pub.dartlang.org/packages/sass
[`Importer` class]: https://pub.dartlang.org/documentation/sass/latest/sass/Importer-class.html
[Ruby Sass]: /ruby-sass
[`Importers::Base` class]: https://www.rubydoc.info/gems/sass/Sass/Importers/Base

## Nesting

Imports are usually written at the top level of a stylesheet, but they don't
have to be. They can nested within [style rules][] or [plain CSS at-rules][] as
well. The imported CSS is nested in that context, which makes nested imports
useful for scoping a chunk of CSS to a particular element or media query.
Top-level [mixins][], [functions][], and [variables][] defined in the nested
import are only available in the nested context.

[style rules]: /documentation/style-rules
[plain CSS at-rules]: /documentation/at-rules/css
[mixins]: /documentation/at-rules/mixin
[functions]: /documentation/at-rules/function
[variables]: /documentation/variables

{% codeExample 'nesting' %}
  // _theme.scss
  pre, code {
    font-family: 'Source Code Pro', Helvetica, Arial;
    border-radius: 4px;
  }
  ---
  // style.scss
  .theme-sample {
    @import "theme";
  }
  ===
  // _theme.sass
  pre, code
    font-family: 'Source Code Pro', Helvetica, Arial
    border-radius: 4px
  ---
  // style.sass
  .theme-sample
    @import theme
  ===
  .theme-sample pre, .theme-sample code {
    font-family: 'Source Code Pro', Helvetica, Arial;
    border-radius: 4px;
  }
{% endcodeExample %}

{% funFact %}
  Nested imports are very useful for scoping third-party stylesheets, but if
  you're the author of the stylesheet you're importing, it's usually a better
  idea to write your styles in a [mixin][] and include that mixin in the nested
  context. A mixin can be used in more flexible ways, and it's clearer when
  looking at the imported stylesheet how it's intended to be used.

  [mixin]: /documentation/at-rules/mixin
{% endfunFact %}

{% headsUp %}
  The CSS in nested imports is evaluated like a mixin, which means that any
  [parent selectors][] will refer to the selector in which the stylesheet is
  nested.

  [parent selectors]: /documentation/style-rules/parent-selector

  {% codeExample 'parent-selector' %}
    // _theme.scss
    ul li {
      $padding: 16px;
      padding-left: $padding;
      [dir=rtl] & {
        padding: {
          left: 0;
          right: $padding;
        }
      }
    }
    ---
    // style.scss
    .theme-sample {
      @import "theme";
    }
    ===
    // _theme.sass
    ul li
      $padding: 16px
      padding-left: $padding
      [dir=rtl] &
        padding:
          left: 0
          right: $padding
    ---
    // style.sass
    .theme-sample
      @import theme
    ===
    .theme-sample ul li {
      padding-left: 16px;
    }
    [dir=rtl] .theme-sample ul li {
      padding-left: 0;
      padding-right: 16px;
    }
  {% endcodeExample %}
{% endheadsUp %}

## Importing CSS

{% compatibility 'dart: "1.11.0"', 'libsass: "partial"', 'ruby: false' %}
  LibSass supports importing files with the extension `.css`, but contrary to
  the specification they're treated as SCSS files rather than being parsed as
  CSS. This behavior has been deprecated, and an update is in the works to
  support the behavior described below.
{% endcompatibility %}

In addition to importing `.sass` and `.scss` files, Sass can import plain old
`.css` files. The only rule is that the import *must not* explicitly include the
`.css` extension, because that's used to indicate a [plain CSS `@import`][].

[plain CSS `@import`]: #plain-css-imports

{% codeExample 'import-css' %}
  // code.css
  code {
    padding: .25em;
    line-height: 0;
  }
  ---
  // style.scss
  @import 'code';
  ===
  // code.css
  code {
    padding: .25em;
    line-height: 0;
  }
  ---
  // style.sass
  @import code
  ===
  code {
    padding: .25em;
    line-height: 0;
  }
{% endcodeExample %}

CSS files imported by Sass don't allow any special Sass features. In order to
make sure authors don't accidentally write Sass in their CSS, all Sass features
that aren't also valid CSS will produce errors. Otherwise, the CSS will be
rendered as-is. It can even be [extended][]!

[extended]: /documentation/at-rules/extend

## Plain CSS `@import`s

{% compatibility 'dart: true', 'libsass: "partial"', 'ruby: true' %}
  By default, LibSass handles plain CSS imports correctly. However, any [custom
  importers][] will incorrectly apply to plain-CSS `@import` rules, making it
  possible for those rules to load Sass files.

  [custom importers]: /documentation/js-api/interfaces/LegacySharedOptions#importer
{% endcompatibility %}

Because `@import` is also defined in CSS, Sass needs a way of compiling plain
CSS `@import`s without trying to import the files at compile time. To accomplish
this, and to ensure SCSS is as much of a superset of CSS as possible, Sass will
compile any `@import`s with the following characteristics to plain CSS imports:

* Imports where the URL ends with `.css`.
* Imports where the URL begins `http://` or `https://`.
* Imports where the URL is written as a `url()`.
* Imports that have media queries.

{% codeExample 'plain-css-imports' %}
  @import "theme.css";
  @import "http://fonts.googleapis.com/css?family=Droid+Sans";
  @import url(theme);
  @import "landscape" screen and (orientation: landscape);
  ===
  @import "theme.css"
  @import "http://fonts.googleapis.com/css?family=Droid+Sans"
  @import url(theme)
  @import "landscape" screen and (orientation: landscape)
{% endcodeExample %}

### Interpolation

Although Sass imports can't use [interpolation][] (to make sure it's always
possible to tell where [mixins][], [functions][], and [variables][] come from),
plain CSS imports can. This makes it possible to dynamically generate imports,
for example based on mixin parameters.

[interpolation]: /documentation/interpolation
[mixins]: /documentation/at-rules/mixin
[functions]: /documentation/at-rules/function
[variables]: /documentation/variables

{% codeExample 'interpolation' %}
  @mixin google-font($family) {
    @import url("http://fonts.googleapis.com/css?family=#{$family}");
  }

  @include google-font("Droid Sans");
  ===
  @mixin google-font($family)
    @import url("http://fonts.googleapis.com/css?family=#{$family}")


  @include google-font("Droid Sans")
{% endcodeExample %}

## Import and Modules

{% render 'doc_snippets/module-system-status' %}

Sass's [module system][] integrates seamlessly with `@import`, whether you're
importing a file that contains `@use` rules or loading a file that contains
imports as a module. We want to make the transition from `@import` to `@use` as
smooth as possible.

[module system]: /documentation/at-rules/use

### Importing a Module-System File

When you import a file that contains `@use` rules, the importing file has access
to all members (even private members) defined directly in that file, but *not*
any members from modules that file has loaded. However, if that file contains
[`@forward` rules][], the importing file will have access to forwarded members.
This means that you can import a library that was written to be used with the
module system.

[`@forward` rules]: /documentation/at-rules/forward

{% headsUp %}
  When a file with `@use` rules is imported, all the CSS transitively loaded by
  those is included in the resulting stylesheet, even if it's already been
  included by another import. If you're not careful, this can result in bloated
  CSS output!
{% endheadsUp %}

#### Import-Only Files

An API that makes sense for `@use` might not make sense for `@import`. For
example, `@use` adds a namespace to all members by default so you can safely use
short names, but `@import` doesn't so you might need something longer. If you're
a library author, you may be concerned that if you update your library to use
the new module system, your existing `@import`-based users will break.

To make this easier, Sass also supports *import-only files*. If you name a file
`<name>.import.scss`, it will only be loaded for imports, not for `@use`s. This
way, you can retain compatibility for `@import` users while still providing a
nice API for users of the new module system.

{% codeExample 'import-only-files', false %}
  // _reset.scss

  // Module system users write `@include reset.list()`.
  @mixin list() {
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
  ---
  // _reset.import.scss

  // Legacy import users can keep writing `@include reset-list()`.
  @forward "reset" as reset-*;
  ===
  // _reset.sass

  // Module system users write `@include reset.list()`.
  @mixin list()
    ul
      margin: 0
      padding: 0
      list-style: none
  ---
  // _reset.import.sass

  // Legacy import users can keep writing `@include reset-list()`.
  @forward "reset" as reset-*
{% endcodeExample %}

#### Configuring Modules Through Imports

{% compatibility 'dart: "1.24.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

You can [configure modules][] that are loaded through an `@import` by defining
global variables prior the `@import` that first loads that module.

[configure modules]: /documentation/at-rules/use#configuration

{% codeExample 'configuring-modules' %}
  // _library.scss
  $color: blue !default;

  a {
    color: $color;
  }
  ---
  // _library.import.scss
  @forward 'library' as lib-*;
  ---
  // style.sass
  $lib-color: green;
  @import "library";
  ===
  $color: blue !default

  a
    color: $color
  ---
  // _library.import.sass
  @forward 'library' as lib-*
  ---
  // style.sass
  $lib-color: green
  @import "library"
  ===
  a {
    color: green;
  }
{% endcodeExample %}

{% headsUp %}
  Modules are only loaded once, so if you change the configuration after you
  `@import` a module for the first time (even indirectly), the change will be
  ignored if you `@import` the module again.
{% endheadsUp %}

### Loading a Module That Contains Imports

When you use `@use` (or `@forward`) load a module that uses `@import`, that
module will contain all the public members defined by the stylesheet you load
*and* everything that stylesheet transitively imports. In other words,
everything that's imported is treated as though it were written in one big
stylesheet.

This makes it easy to convert start using `@use` in a stylesheet even before all
the libraries you depend on have converted to the new module system. Be aware,
though, that if they do convert their APIs may well change!

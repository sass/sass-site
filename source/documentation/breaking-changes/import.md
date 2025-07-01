---
title: 'Breaking Change: @import and global built-in functions'
introduction: >
  Originally, Sass used `@import` rules to load other files with a single
  global namespace, with all built-in functions also available globally. We're
  deprecating both Sass `@import` rules and global built-in functions now that
  the module system (`@use` and `@forward` rules) has been available for
  several years.
---

`@import` causes numerous problems, requiring Sass members to be manually
namespaced to avoid conflicts, slowing down compilation when the same file is
imported more than once, and making it very difficult for both humans and tools
to tell where a given variable, mixin, or function comes from.

The module system fixes these problems and brings Sass's modularity up to par
with the best practices of other modern languages, but we can't get the full
benefits of it while `@import` remains in the language.

`@import` is now deprecated as of Dart Sass 1.80.0. Additionally, we're also
deprecating the global versions of Sass built-in functions that are available
in `sass:` modules.

## Transition Period

{% compatibility 'dart: "1.80.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Sass `@import` rules and global built-in function calls now emit deprecation
warnings. While Dart Sass 2.0.0 will be released soon with various smaller
breaking changes, we don't expect to remove Sass `@import` rules or global
built-in functions until Dart Sass 3.0.0, which will be released no sooner than
two years after Dart Sass 1.80.0.

Eventually, all `@import` rules will be treated as [plain CSS `@import`s],
likely after an intermediate period where anything that used to be a Sass
`@import` throws an error.

[plain CSS `@import`s]: /documentation/at-rules/import/#plain-css-imports

## Automatic Migration

You can use [the Sass migrator][] to automatically update your stylesheets to
use the module system.

[the Sass migrator]: https://github.com/sass/migrator#readme

```shellsession
$ npm install -g sass-migrator
$ sass-migrator module --migrate-deps your-entrypoint.scss
```

If you want to migrate away from global built-in functions, but aren't yet
ready to fully migrate your `@import` rules, you can pass the `--built-in-only`
flag to migrate the functions while leaving `@import` rules as-is.

## Migration Recipes

### Nested Imports

While `@import` can be used within CSS rules, `@use` has to be written at the
top level of a file (this is because each `@use`d module's CSS is only included
in the output once, so it wouldn't make sense to allow it both in a nested
context and the top level). There are two ways to migrate nested `@import`s to
the module system:

1. The recommended way, which requires a little more up-front effort, is to wrap
   all the CSS emitted by your nested modules in [mixins] and `@include` those
   mixins in the nested context. This matches the way most other programming
   languages work, where each file defines a function or class that gets called
   by the files that use it, and it makes it very clear exactly how you expect
   that file to be used. It also makes it easier to add configuration, since you
   can just pass parameters or even [`@content` blocks] to the mixin.

2. A more direct translation is to use the [`meta.load-css()` mixin] to directly
   load the module's CSS where you want to use it. This is appropriate when you
   don't have control over the file you're loading to create a mixin wrapper.
   Note that `meta.load-css()` fully compiles the CSS before it does any
   nesting, so any [parent selectors] won't "see" the rules outside the
   `meta.load-css()` call.

[mixins]: /documentation/at-rules/mixin/
[`@content` blocks]: /documentation/at-rules/mixin/#content-blocks
[`meta.load-css()` mixin]: /documentation/modules/meta/#load-css
[parent selectors]: /documentation/style-rules/parent-selector/

### Configured Themes

A pattern that people sometimes use with `@import` is to have a component
library full of partials that all use the same variables without explicitly
loading them, and then having several different "theme" entrypoints that define
different values for those variables to provide different visual themes. They
may either define the variables directly, or override defaults of a base theme
partial. As a simplified example:

{% codeExample 'import-theme' %}
  // components/_button.scss
  button {
    color: $text-color;
    background-color: $background-color;
  }
  ---
  // _theme.scss
  $text-color: black !default;
  $background-color: white !default;
  ---
  // dark.scss
  $text-color: white;
  $background-color: black;
  @import "theme";

  @import "components/button";
  // More components are usually imported here.
  ===
  // components/_button.scss
  button
    color: $text-color
    background-color: $background-color
  ---
  // _theme.scss
  $text-color: black
  $background-color: white
  ---
  // dark.scss
  $text-color: white
  $background-color: black
  @import "theme"

  @import "components/button"
  // More components are usually imported here.
  ===
  button {
    color: white;
    background-color: black;
  }
{% endcodeExample %}

In the module system, the component partials need to explicitly reference the
variables they refer to. But this doesn't mean this kind of theming doesn't
work! Because `@use`-ing the same module multiple times always uses the same
configuration, if you configure it once in the entrypoint and all other uses
will see that configuration:

{% render 'code_snippets/example-use-theme' %}

{% render 'silencing_deprecations' %}

Note: While the deprecations for `@import` and global built-ins are being
released together and we expect both features to be removed simultaneously
as well (in Dart Sass 3.0.0), they are considered separate deprecations for the
purpose of the API. If you wish to silence both `@import` deprecation warnings
and global built-in deprecation warnings, you'll need to pass both `import`
and `global-builtin` to `--silence-deprecation`/`silenceDeprecations`.

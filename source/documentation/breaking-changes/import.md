---
title: 'Breaking Change: `@import` and global built-in functions'
introduction: >
  Originally, Sass used `@import` rules to load other files with a single
  global namespace, with all built-in functions also available globally. We're
  deprecating both Sass `@import` rules and global built-in functions now that
  the module system (`@use` and `@forward` rules) has been available for
  several years.
---

Sass historically loaded dependencies in a single global namespace using
`@import` rules. This causes numerous problems, requiring Sass members to be
manually namespaced to avoid conflicts, slowing down compilation when the same
file is imported more than once, and making it very difficult for both humans
and tools to tell where a given variable, mixin, or function comes from.

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
a year after Dart Sass 1.80.0.

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
ready to fully migrate your `@import` rules, you can pass the `--builtin-only`
flag to migrate the functions while leaving `@import` rules as-is.

{% render 'silencing_deprecations' %}

Note: While the deprecations for `@import` and global built-ins are being
released together and we expect both features to be removed simultaneously
as well (in Dart Sass 3.0.0), they are considered separate deprecations for the
purpose of the API. If you wish to silence both `@import` deprecation warnings
and global built-in deprecation warnings, you'll need to pass both `import`
and `global-builtin` to `--silence-deprecation`/`silenceDeprecations`.

---
title: Breaking Changes
introduction: >
  New versions of Sass are as backwards-compatible as possible, but sometimes
  a breaking change is necessary. Sass needs to keep up with the evolving CSS
  specification, and old language design mistakes occasionally need to be fixed.
---

Before each breaking change is released, Sass implementations will produce
deprecation warnings for stylesheets whose behavior will change. Whenever
possible, these warnings will include suggestions for how to update the
deprecated styles to make them forward-compatible.

Different implementations may have different policies for breaking changes and
deprecations. [Dart Sass] will emit deprecation warnings for at least three
months before releasing a breaking change, and will release the breaking change
with a new major version number **unless that change is necessary for CSS
compatibility**. CSS compatibility changes are often both non-disruptive and
time-sensitive, so they may be released with new minor version numbers instead.

[Dart Sass]: /dart-sass

## Upcoming Breaking Changes

These behaviors are deprecated in the most recent release of Dart Sass and will
become breaking changes in the future:

* [Passing future versions to
  `Options.fatalDeprecations`](/documentation/breaking-changes/deprecation-version)
  in the JS API, beginning in Dart Sass 1.107.0.

* [The legacy `if()` function](/documentation/breaking-changes/if-function/)
  was deprecated in Dart Sass 1.95.0.

* [`@import` and global functions](/documentation/breaking-changes/import/) were
  deprecated in Dart Sass 1.80.0.

## Recent Breaking Changes

These behaviors were changed in or after Dart Sass 2.0.0:

* [Adjacent compound
  selectors](/documentation/breaking-changes/adjacent-compounds) are an error
  starting in Dart Sass 2.0.0.

* [Vendor-prefixed `expression()` and `progid:...`
  functions](/documentation/breaking-changes/function-name/) no longer have
  special parsing starting in Dart Sass 2.0.0.

* [Private variables in `with`](/documentation/breaking-changes/with-private/)
  are an error starting in Dart Sass 2.0.0.

* [Misplaced rest arguments](/documentation/breaking-changes/misplaced-rest/)
  are an error starting in Dart Sass 2.0.0.

* [The legacy JS API was
  removed](/documentation/breaking-changes/legacy-js-api/) in Dart Sass 2.0.0.

* [Certain uses of the JS color API
  changed](/documentation/breaking-changes/color-4-api/) starting in Dart Sass
  2.0.0.

* [A number of color functions were
  removed](/documentation/breaking-changes/color-functions/) in Dart Sass 2.0.0
  in favor of new CSS Color 4-compatible functions.

* [The `meta.feature-exists()` function was
  removed](/documentation/breaking-changes/feature-exists/) in Dart Sass 2.0.0.

* [Mixin names starting with
  `--`](/documentation/breaking-changes/css-function-mixin/) are forbidden
  starting in Dart Sass 2.0.0.

* [Passing a percentage unit to the global `abs()`
  function](/documentation/breaking-changes/abs-percent/) returns a [calculation
  value] starting in Dart Sass 1.65.0.

  [calculation value]: /documentation/values/calculations

* [Passing `null` as an alpha channel to `new
  SassColor()`](/documentation/breaking-changes/null-alpha) creates a missing
  channel starting in Dart Sass 2.0.0.

* [Loading Sass as a default export in JS is no longer
  allowed](/documentation/breaking-changes/default-export) starting in Dart Sass
  2.0.0.

* [A variable may only have a single `!global` or `!default`
  flag](/documentation/breaking-changes/duplicate-var-flags) starting in Dart
  Sass 2.0.0.

* [Unary operators must be
  unambiguous](/documentation/breaking-changes/strict-unary/) starting in Dart
  Sass 2.0.0.

* [Selectors with invalid combinators are
  invalid](/documentation/breaking-changes/bogus-combinators) starting in Dart
  Sass 2.0.0.

* [`/` a list separator](/documentation/breaking-changes/slash-div) rather than
  a division operator starting in Dart Sass 2.0.0.

* [Functions are stricter about which units they
  allow](/documentation/breaking-changes/function-units) starting in Dart Sass
  2.0.0.

* [`@-moz-document` is parsed as an unknown
  at-rule](/documentation/breaking-changes/moz-document) starting in Dart Sass
  2.0.0.

## Older Breaking Changes

These behaviors were changed in an earlier Dart Sass version:

* [Functions whose names start with
  `--`](/documentation/breaking-changes/css-function-mixin/) are interpreted as
  plain CSS functions starting in Dart Sass 1.94.0.

* [The `type()` function](/documentation/breaking-changes/type-function/)
  has special parsing syntax starting in Dart Sass 1.92.0

* [Declarations mixed with nested
  rules](/documentation/breaking-changes/mixed-decls/) are emitted in textual
  order starting in Dart Sass 1.92.0.

* [Media Queries Level 4 syntax](/documentation/breaking-changes/media-logic/)
  is interpreted according to the CSS spec starting in Dart Sass 1.56.0.

* [Compound selectors could not be
  extended](/documentation/breaking-changes/extend-compound) starting in Dart
  Sass 1.0.0 and Ruby Sass 4.0.0.

* [The syntax for CSS custom property values
  changed](/documentation/breaking-changes/css-vars) in Dart Sass 1.0.0, LibSass
  3.5.0, and Ruby Sass 3.5.0.

## Early Opt-In

Dart Sass users can opt in to treat deprecations as errors early using the
[`--fatal-deprecation` command line
option](/documentation/cli/dart-sass/#fatal-deprecation).

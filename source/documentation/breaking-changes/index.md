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

Different implementations have different policies for breaking changes and
deprecations. [Dart Sass][] will emit deprecation warnings for at least three
months before releasing a breaking change, and will release the breaking change
with a new major version number **unless that change is necessary for CSS
compatibility**. CSS compatibility changes are often both non-disruptive and
time-sensitive, so they may be released with new minor version numbers instead.

[Dart Sass]: /dart-sass

These breaking changes are coming soon or have recently been released:

* [Loading Sass as a default export in JS is no longer
  allowed](/documentation/breaking-changes/default-export) beginning in Dart
  Sass 1.63.0.

* [A variable may only have a single `!global` or `!default`
  flag](/documentation/breaking-changes/duplicate-var-flags) beginning in Dart
  Sass 1.62.0.

* [Selectors with invalid combinators are
  invalid](/documentation/breaking-changes/bogus-combinators) beginning in Dart
  Sass 1.54.0.

* [`/` is changing from a division operation to a list
  separator](/documentation/breaking-changes/slash-div) beginning in Dart Sass
  1.33.0.

* [Functions are stricter about which units they
  allow](/documentation/breaking-changes/function-units) beginning in Dart Sass
  1.32.0.

* [Parsing the special syntax of `@-moz-document` will be
  invalid](/documentation/breaking-changes/moz-document) beginning in Dart Sass
  1.7.2.

* [Compound selectors could not be
  extended](/documentation/breaking-changes/extend-compound) in Dart Sass 1.0.0
  and Ruby Sass 4.0.0.

* [The syntax for CSS custom property values
  changed](/documentation/breaking-changes/css-vars) in Dart Sass 1.0.0, LibSass
  3.5.0, and Ruby Sass 3.5.0.

## Early Opt-In

Dart Sass users can opt in to treat deprecations as errors early using the
[`--fatal-deprecation` command line
option](/documentation/cli/dart-sass#fatal-deprecation).

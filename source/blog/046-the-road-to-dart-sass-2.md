---
title: The Road to Dart Sass 2
author: Natalie Weizenbaum
date: 2026-09-22T18:43:19Z
---

When we first released Dart Sass 1.0.0 in March 2018, our goals were clear:

1. We wanted to retain the original Ruby Sass implementation's commitment to
   fixing bugs quickly and consistently keeping up with the evolving CSS spec as
   well as new Sass language features.

2. We wanted to provide competitive performance with the LibSass C++
   implementation and be even easier to use from JavaScript, the _lingua franca_
   of the web.

We accomplished those goals. In 2021, we surpassed the LibSass-based `node-sass`
npm package in downloads, and [last year] we officially declared that it had
reached its end of life. In the meantime, we've added support for new CSS
features like [color spaces], [math functions], and [the new `if()` syntax];
we've added new Sass features like [the module system], [nested map functions],
and first-class [mixins] and [modules]; and we've made it easier to use Sass in
a wide variety of contexts with [a fully reworked JS API], [embedded Dart Sass],
[`pkg:` importers], and support for running [directly in the browser][^1].

[last year]: /blog/libsass-is-end-of-life
[color spaces]: /blog/wide-gamut-colors-in-sass
[math functions]: /blog/request-for-comments-first-class-calc
[the new `if()` syntax]: /documentation/syntax/special-functions/#if
[the module system]: /blog/the-module-system-is-launched
[nested map functions]: /blog/request-for-comments-nested-map-functions
[mixins]: /documentation/values/mixins
[modules]: /documentation/values/modules
[a fully reworked JS API]: /blog/request-for-comments-new-js-api
[embedded Dart Sass]: /dart-sass/#embedded-dart-sass
[`pkg:` importers]: /blog/announcing-pkg-importers
[directly in the browser]: /blog/sass-in-the-browser

[^1]: Try it yourself by opening your browser console anywhere on the Sass site!

All of these improvements involve changes to the Sass language, and every so
often we realize some old Sass behavior isn't doing what we need it to.
Sometimes this is because we designed it in a way that didn't work out over the
long term, like [using `/` for division] when CSS already used it as a
separator. Sometimes it's because a corner of the language turned out to be more
error-prone than we expected, like [the subtraction operator]. Sometimes it's
just a straight-up bug that we didn't notice, like [being able to configure
private variables].

[using `/` for division]: /documentation/breaking-changes/slash-div
[the subtraction operator]: /documentation/breaking-changes/strict-unary
[being able to configure private variables]: /documentation/breaking-changes/with-private

We try very hard to avoid releasing breaking changes to Sass. While we do
occasionally make exceptions under [strict conditions] in order to ensure
compatibility with CSS, the vast majority of breaking changes are held back
until a new major version release. At the same time, we try to release new
*features* as soon as they're implemented so they can get into users' hands as
quickly as possible. This has the funny side effect of meaning that the releases
with the most exciting-looking numbers are just a bunch of breaking changes
without any new toys.

[strict conditions]: https://github.com/sass/dart-sass/#compatibility-policy

## Dart Sass 2: A Bunch of Breaking Changes Without Any New Toys

We're hoping to release Dart Sass 2 in December 2026. The main difference
between 2.0.0 and whatever ends up being the last release in the 1.x.x branch
will be that most things that produced deprecation warnings in 1.x.x will
instead be errors in 2.0.0. There are a couple exceptions, though:

* As we said [when we deprecated `@import`], it won't be fully removed until
  Dart Sass 3. All deprecations related to it (`import`, `global-builtin`, and
  `color-module-compat`) will continue to be deprecations rather than errors in
  Dart Sass 2.

* The [legacy Sass `if()` function] likewise won't be removed until Dart Sass 3.
  This syntax has been widely used in Sass stylesheets for many years, and the
  new syntax has existed for less than a year. Even though we have [an automated
  migrator] to make it easier to move to the new CSS syntax, it's easy enough
  for the two syntaxes to coexist so we want to give the ecosystem as much time
  as we can to migrate.

* Any new deprecations introduced after this blog post goes live will not become
  errors in Dart Sass 2. We want to make sure our users have plenty of time to
  adapt to the upcoming changes, and deprecating something just a couple months
  before it's removed for good is more churn than we want to cause.
  Specifically, **no deprecations introduced after Dart Sass 1.105.0 will become
  errors in Dart Sass 2**[^2].

[when we deprecated `@import`]: /blog/import-is-deprecated
[legacy Sass `if()` function]: /documentation/breaking-changes/if-function
[an automated migrator]: /documentation/cli/migrator

[^2]: As ever, we do reserve the right to make breaking changes necessary for
    CSS compatibility after a three month deprecation period. We can't always
    tell when we'll have to introduce these deprecations, but given that we
    intend to release Dart Sass 2 within the next three months it shouldn't be
    an issue.

I also lied a little when I said there wouldn't be any new toys. We are actually
introducing one new feature in Dart Sass 2 that we haven't been able to add to
1.x.x because it's too big of a breaking change: **Dart Sass 2 will match CSS by
treating `/` as a separator rather than a division operator**. It will create a
slash-separated list, the same kind currently created by the [`list.slash()`]
function. If you need to do division, you can either use [`math.div()`] or
continue using `/` within a `calc()` expression.

[`list.slash()`]: /documentation/modules/list/#slash
[`math.div()`]: /documentation/modules/math/#div

### Preparing for Dart Sass 2

In preparation for the release of Dart Sass 2, we recommend that Sass users
begin eagerly upgrading warnings to errors using Sass's deprecation control
system. When using the Sass CLI, to upgrade all warnings that will become errors
in Dart Sass 2, pass:

```
--fatal-deprecations=1.79.0,compile-string-relative-url,misplaced-rest,with-private,function-name,adjacent-compounds
```

When using the JS API, add this to your [Sass options]:

[Sass options]: /documentation/js-api/interfaces/Options

```js
{
  fatalDeprecations: [
    sass.Version.parse("1.79.0"),
    'compile-string-relative-url',
    'misplaced-rest',
    'with-private',
    'function-name',
    'adjacent-compounds',
  ],
}
```

If your stylesheets compile cleanly with those options on the latest Sass
version, you're ready to go—Dart Sass 2 won't break you. If you still have some
deprecations you need to migrate, check out [the Sass migrator]. It can
automatically migrate many of the most common deprecations.

[the Sass migrator]: /documentation/cli/migrator

We're excited to get Dart Sass 2 into our users' hands, and to finally wave
farewell to having to support all those old deprecations. We hope the upgrade
process is smooth for all our users. Even when we have to make breaking changes,
we do our best to make them small and well-contained and to provide our users
with a smooth road forward. Above all, we want writing Sass to be fun!

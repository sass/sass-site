---
title: "`@import` is Deprecated"
author: Jennifer Thakar
date: 2024-07-18 17:00:00 -8
---

Back in 2019, we [released the Sass module system], adding new `@use` and
`@forward` rules to the language that were designed to replace `@import` and
make stylesheets more maintainable and less error-prone. We can now announce
that `@import` is officially deprecated as of Dart Sass 1.78.0.

[released the Sass module system]: /blog/the-module-system-is-launched

With 4.5 years since we released the module system and more than a year since
we passed the 80% Dart Sass usage share threshold we set for starting this
deprecation, we feel comfortable making this move. However, we understand that
this is a big change to the language and not all users have been able to fully
migrate off of `@import` so far.

## Controlling Deprecation Warnings

While users should treat this deprecation as a signal to migrate sooner rather
than later, for anyone who wishes to silence deprecation warnings for
`@import`, we recently added a new `--silence-deprecation` command line option.
Just pass `--silence-deprecation=import` to Sass and you won't have to worry
about the deprecation warnings while you complete the migration. Equivalent
options exist in the JS and Dart APIs.

On the other hand, users who have already migrated to the module system and
wish to prevent any backsliding can use the `--fatal-deprecation=import` to
treat any Sass `@import` rules as errors.

## Timeline

As previously announced, given the size of this change, we expect to wait at
least a year after this deprecation before we remove `@import` from the
language. While we expect Dart Sass 2.0.0 to be released soon with other,
smaller breaking changes, that release will not include any changes to
`@import`. Instead, we expect `@import` to be removed in Dart Sass 3.0.0.

## Migrator

Users migrating off of `@import` can use the Sass migrator to move to the module
system. Follow the [instructions] to install it, then run it
on your application:

```shellsession
$ sass-migrator module --migrate-deps <path/to/style.scss>
```

[instructions]: /documentation/cli/migrator/#installation

## Built-in Functions

Alongside this deprecation, we are also deprecating any uses of global built-in
Sass functions that are now available in built-in modules. The `global-builtin`
ID can be passed to the `--silence-deprecation` or `--fatal-deprecation` flags
on its own, or in combination with `import`. This deprecation will follow the
same timeline as `@import` for removal. For users who want to migrate off of
global functions but aren't ready to complete the module system migration,
we've also added a new `--builtin-only` flag to the module system migrator.

---
title: Migrator
table_of_contents: true
introduction: >
  The Sass migrator automatically updates your Sass files to help you move on to
  the latest and greatest version of the language. Each of its commands migrates
  a single feature, to give you as much control as possible over what you update
  and when.
---

## Usage

To use the Sass migrator, tell it [which migration][] you want to run and what
Sass files you want to migrate:

[which migration]: #migrations

```shellsession
sass-migrator <migration> <entrypoint.scss...>
```

By default, the migrator will only change files that you explicitly pass on the
command line. Passing the [`--migrate-deps` option][] tells the migrator to also
change all the stylesheets that are loaded using the [`@use` rule][],
[`@forward` rule][], or [`@import` rule][]. And if you want to do a test run to
see what changes will be made without actually saving them, you can pass
<code>[--dry-run][] [--verbose][]</code> (or `-nv` for short).

[`--migrate-deps` option]: #migrate-deps
[`@use` rule]: /documentation/at-rules/use
[`@forward` rule]: /documentation/at-rules/forward
[`@import` rule]: /documentation/at-rules/import
[--dry-run]: #dry-run
[--verbose]: #verbose

{% render 'code_snippets/example-module-migrator' %}

## Installation

You can install the Sass migrator from most of the same places that you can
install [Dart Sass](/dart-sass):

### Standalone

You can install the Sass migrator on Windows, Mac, or Linux by downloading the
package for your operating system [from GitHub][] and [adding it to your
`PATH`][].

[from GitHub]: {{ releases['migrator'].url }}
[adding it to your `PATH`]: https://katiek2.github.io/path-doc/

### npm

If you use Node.js, you can also install the Sass migrator using [npm][] by
running

[npm]: https://www.npmjs.com

```shellsession
npm install -g sass-migrator
```

### Chocolatey

If you use [the Chocolatey package manager][] for Windows, you can install the
Sass migrator by running

[the Chocolatey package manager]: https://chocolatey.org

```shellsession
choco install sass-migrator
```

### Homebrew

If you use [the Homebrew package manager][] for Mac OS X, you can install Dart
Sass by running

[the Homebrew package manager]: https://brew.sh

```shellsession
brew install sass/sass/migrator
```

## Global Options

These options are available for all migrators.

### `--migrate-deps`

This option (abbreviated `-d`) tells the migrator to change not just the
stylesheets that are explicitly passed on the command line, but also any
stylesheets that they depend on using the [`@use` rule][], [`@forward` rule][],
or [`@import` rule][].

```shellsession
$ sass-migrator module --verbose style.scss
Migrating style.scss
$ sass-migrator module --verbose --migrate-deps style.scss
Migrating style.scss
Migrating _theme.scss
Migrating _fonts.scss
Migrating _grid.scss
```

{% headsUp %}
  The [module migrator][] assumes that any stylesheet that is depended on using
  a [`@use` rule][] or a [`@forward` rule][] has already been migrated to the
  module system, so it won't attempt to migrate them, even when the
  `--migrate-deps` option is passed.

  [module migrator]: #module
  [`@use` rule]: /documentation/at-rules/use
  [`@forward` rule]: /documentation/at-rules/forward
{% endheadsUp %}

### `--load-path`

This option (abbreviated `-I`) tells the migrator a [load path][] where it
should look for stylesheets. It can be passed multiple times to provide multiple
load paths. Earlier load paths will take precedence over later ones.

Dependencies loaded from load paths are assumed to be third-party libraries, so
the migrator will not migrate them even when the [`--migrate-deps` option][] is
passed.

[load path]: /documentation/at-rules/use#load-paths

### `--dry-run`

This flag (abbreviated `-n`) tells the migrator not to save any changes to
disk. It instead prints the list of files that it would have changed. This is
commonly paired with the [`--verbose` option][] to print the contents of the
changes that would have been made as well.

[`--verbose` option]: #verbose

```shellsession
$ sass-migrator module --dry-run --migrate-deps style.scss
Dry run. Logging migrated files instead of overwriting...

style.scss
_theme.scss
_fonts.scss
_grid.scss
```

#### `--no-unicode`

This flag tells the Sass migrator only to emit ASCII characters to the terminal
as part of error messages. By default, or if `--unicode` is passed, the migrator
will emit non-ASCII characters for these messages. This flag does not affect the
CSS output.

```shellsession
$ sass-migrator --no-unicode module style.scss
line 1, column 9 of style.scss: Error: Could not find Sass file at 'typography'.
  ,
1 | @import "typography";
  |         ^^^^^^^^^^^^
  '
Migration failed!
$ sass-migrator --unicode module style.scss
line 1, column 9 of style.scss: Error: Could not find Sass file at 'typography'.
  ╷
1 │ @import "typography";
  │         ^^^^^^^^^^^^
  ╵
Migration failed!
```

### `--verbose`

This flag (abbreviated `-v`) tells the migrator to print extra information to
the console. By default, it just prints the name of files that are changed, but
when combined with the [`--dry-run` option][] it also prints those files' new
contents.

[`--dry-run` option]: #dry-run

```shellsession
$ sass-migrator module --verbose --dry-run style.scss
Dry run. Logging migrated files instead of overwriting...
<==> style.scss
@use "bootstrap" with (
  $body-bg: #000,
  $body-color: #111
);

@include bootstrap.media-breakpoint-up(sm) {
  .navbar {
    display: block;
  }
}
$ sass-migrator module --verbose style.scss
Migrating style.scss
```

## Migrations

### Color

This migration converts legacy color functions to the new color-space-compatible
functions.

### Division

This migration converts stylesheets that use [`/` as division] to use the
built-in `math.div` function instead.

[`/` as division]: /documentation/breaking-changes/slash-div

#### `--pessimistic`

By default, the migrator converts `/` operations to `math.div` even when it
isn't sure that it will be division when evaluated. It only leaves them as-is
when it can statically determine that they're doing something else (such as when
there's no SassScript involved, or when one of the operands is a string). The
`math.div` function currently functions identically to the `/` operator, so
this is safe to do, but may result in new warnings if one of the arguments to
`math.div` at runtime is not a number.

If you want to avoid this behavior, you can pass the `--pessimistic` flag. With
this flag, the migrator will only convert `/` operations that it knows for sure
are doing division. This will prevent any unnecessary `math.div` conversions,
but it's likely to leave some division unmigrated if it can't be statically
determined.

### Module

This migration converts stylesheets that use the old [`@import` rule][] to load
dependencies so that they use the Sass module system via the [`@use` rule][]
instead. It doesn't just naïvely change `@import`s to `@use`s—it updates
stylesheets intelligently so that they keep working the same way they did
before, including:

- Adding namespaces to uses of members (variables, mixins, and functions) from
  other modules.

- Adding new `@use` rules to stylesheets that were using members without
  importing them.

- Converting overridden default variables to [`with` clauses][].

  [`with` clauses]: /documentation/at-rules/use#configuration

- Automatically removing `-` and `_` prefixes from members that are used from
  other files (because otherwise they'd be considered [private][] and could only
  be used in the module they're declared).

  [private]: /documentation/at-rules/use#private-members

- Converting [nested imports][] to use the [`meta.load-css()` mixin][] instead.

  [nested imports]: /documentation/at-rules/import/#nesting
  [`meta.load-css()` mixin]: /documentation/modules/meta#load-css

{% headsUp %}
  Because the module migrator may need to modify both member definitions _and_
  member names, it's important to either run it with the [`--migrate-deps`
  option][] or ensure that you pass it all the stylesheets in your package or
  application.

  [`--migrate-deps` option]: #migrate-deps
{% endheadsUp %}

{% render 'code_snippets/example-module-migrator' %}

#### Loading Dependencies

The module migrator needs to be able to read all of the stylesheets depended on
by the ones it's migrating, even if the [`--migrate-deps` option][] is not
passed. If the migrator fails to find a dependency, you'll get an error.

```shellsession
$ ls .
style.scss  node_modules
$ sass-migrator module style.scss
Error: Could not find Sass file at 'dependency'.
  ,
1 | @import "dependency";
  |         ^^^^^^^^^^^^
  '
  style.scss 1:9  root stylesheet
Migration failed!
$ sass-migrator --load-path node_modules module style.scss
```

If you use a [load path][] when compiling your stylesheets, make sure to pass
that to the migrator using the [`--load-path` option][].

Unfortunately, the migrator does not support custom importers, but it does have
built-in support for resolving URLs starting with `~` by searching in
`node_modules`, similar to [what Webpack supports][].

[load path]: /documentation/at-rules/use#load-paths
[`--load-path` option]: #load-path
[what Webpack supports]: https://github.com/webpack-contrib/sass-loader#resolving-import-at-rules

#### `--remove-prefix`

This option (abbreviated `-p`) takes an identifier prefix to remove from the
beginning of all variable, mixin, and function names when they're migrated.
Members that don't start with this prefix will remain unchanged.

The [`@import` rule][] put all top-level members in one global scope, so when it
was the standard way of loading stylesheets, everyone was incentivized to add
prefixes to all their member names to avoid accidentally redefining some other
stylesheet's. The module system solves this problem, so it's useful to
automatically strip those old prefixes now that they're unnecessary.

```shellsession
$ cat style.scss
@import "theme";

@mixin app-inverted {
  color: $app-bg-color;
  background-color: $app-color;
}
$ sass-migrator --migrate-deps module --remove-prefix=app- style.scss
$ cat style.scss
@use "theme";

@mixin inverted {
  color: theme.$bg-color;
  background-color: theme.$color;
}
```

When you pass this option, the migrator will also generate an [import-only
stylesheet][] that [forwards][] all the members with the prefix added back, to
preserve backwards-compatibility for users who were importing the library.

[import-only stylesheet]: /documentation/at-rules/import/#import-only-files
[forwards]: /documentation/at-rules/forward

This option may be passed multiple times, or with multiple values separated by
commas. Each prefix will be removed from any members that have it. If a member
matches multiple prefixes, the longest matching prefix will be removed.

#### `--forward`

This option tells the migrator which members to forward using the [`@forward`
rule][]. It supports the following settings:

- `none` (the default) doesn't forward any members.

- `all` forwards all members except those that started with `-` or `_` in the
  original stylesheet, since that was commonly used to mark a package-private
  member before the module system was introduced.

- `prefixed` forwards only members that begin with the prefix passed to the
  [`--remove-prefix` option][]. This option may only be used in conjunction with
  the `--remove-prefix` option.

  [`--remove-prefix` option]: #remove-prefix

All files that are passed explicitly on the command line will forward members
that are transitively loaded by those files using the `@import` rule. Files
loaded using the [`--migrate-deps` option][] will not forward any new members.
This option is particularly useful when migrating a Sass library, because it
ensures that users of that library will still be able to access all the members
it defines.

```shellsession
$ cat _index.scss
@import "theme";
@import "typography";
@import "components";
$ sass-migrator --migrate-deps module --forward=all style.scss
$ cat _index.scss
@forward "theme";
@forward "typography";
@forward "components";
```

### Namespace

This migration allows you to easily change the [namespaces][] of the `@use`
rules in a stylesheet. This is useful if the namespaces that the module migrator
generates to resolve conflicts are non-ideal, or if you don't want to use the
default namespace that Sass determines based on the rule's URL.

[namespaces]: /documentation/at-rules/use#choosing-a-namespace

#### `--rename`

You can tell the migrator which namespace(s) you want it to change by passing
expressions to the `--rename` option.

These expressions are of the form `<old-namespace> to <new-namespace>` or
`url <rule-url> to <new-namespace>`. In these expressions, `<old-namespace>` and
`<rule-url>` are [regular expressions][] which match against the entirety of the
existing namespace or the `@use` rule's URL, respectively.

[regular expressions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

For simple use cases, this just looks like `--rename 'old to new'`, which would
rename a `@use` rule with the namespace `old` to instead be `new`.

However, you can also do this to accomplish more complicated renames. For
instance, say that you previously had a stylesheet that looked like this:

```scss
@import 'components/button/lib/mixins';
@import 'components/input/lib/mixins';
@import 'components/table/lib/mixins';
// ...
```

Since all of these URLs would have the default namespace `mixins` when migrated
to `@use` rules, the module migrator may end up generating something like this:

```scss
@use 'components/button/lib/mixins' as button-lib-mixins;
@use 'components/input/lib/mixins' as input-lib-mixins;
@use 'components/table/lib/mixins' as table-lib-mixins;
// ...
```

This is valid code since the namespaces don't conflict, but they're way more
complicated than they need to be. The relevant part of the URL is the component
name, so we can use the namespace migrator to extract that part out.

If we run the namespace migrator with
`--rename 'url components/(\w+)/lib/mixins to \1'`, we'll end up with:

```scss
@use 'components/button/lib/mixins' as button;
@use 'components/input/lib/mixins' as input;
@use 'components/table/lib/mixins' as table;
// ...
```

The rename script here says to find all of the `@use` rules whose URLs look like
`components/(\w+)/lib/mixins` (`\w+` in a regular expression means to match any
word of one or more characters). The `\1` in the output clause means to
substitute in the contents of the first set of parentheses in the regular
expression (called a [group][]).

[group]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges

If you wish to apply multiple renames, you can pass the `--rename` option
multiple times, or separate them with a semicolon or a line break. Only the
first rename that applies to a given rule will be used, so you could pass
something like `--rename 'a to b; b to a'` to swap the namespaces `a` and `b`.

#### `--force`

By default, if two or more `@use` rules have the same namespace after the
migration, the migrator will fail, and no changes will be made.

In this case, you'll usually want to adjust your `--rename` script to avoid
creating conflicts, but if you'd prefer to force the migration, you can instead
pass `--force`.

With `--force`, if any conflicts are encountered, the first `@use` rule will
get its preferred namespace, while subsequent `@use` rules with the same
preferred namespace will instead have a numerical suffix added to them.

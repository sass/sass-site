---
title: 'Breaking Change: Escaped Strings with sass:meta'
introduction: >
  Sass is moving towards a more consistent model of using escape codes in
  strings that represent Sass identifiers, particularly in `sass:meta` APIs.
---

There are two major issues with how Sass handles escape codes in identifiers
today:

1. Quoted strings are treated exactly the same as unquoted strings by
   `sass:meta` methods. This means that if you have a function named `foo\$`,
   you can't access it with `meta.get-function("foo$")` as you might expect. If
   you're using a quoted string, you have to write `meta.get-function("foo\\$")`
   instead.

2. Identifiers that need escape codes are only recognized if they're in
   "canonical form". This is the form that an unquoted string literal is
   normalized into when you write it directly in Sass, so most of the time it
   works fine, but it's possible to use [string.unquote] to create unquoted
   strings with non-canonical escape patterns. For example,
   `meta.get-function(string.unquote("foo\\24"))` wouldn't return the `foo\$`
   function despite `foo\24` parsing the same as `foo\$` in CSS.

[string.unquote]: /documentation/modules/string/#unquote

Now, you might be wondering: does this actually matter? Who's going around
writing Sass functions (or variables, mixins, or module namespaces) with escape
codes in them? And you're right, it probably doesn't matter much. **As long as
you're using plain identifiers without escapes, this change won't affect you.**

But on the Sass team, we believe that making sure every corner of the language
works in a sensible, useful way is important to making the whole thing
understandable and fun to use. When you're writing Sass, you shouldn't have to
worry about whether a weird escaping quirk will bite you, you should be free to
focus on your visual design.

That's why we're changing this behavior. In the future, referring to identifiers
using Sass strings will follow a few simple rules:

1. Quoted strings will refer to the identifier with *escapes resolved*. For
   example, `meta.get-function("foo$")` will return a function declared as
   `foo\$`.

2. Unquoted strings will refer to the identifier regardless of how its escapes
   are spelled. For example, `meta.get-function(foo\$)` will work (as it does
   today), but so will `meta.get-function(string.unquote("foo\\24"))`.

3. Unquoted strings that aren't valid CSS identifiers will throw an error when
   used to refer to an identifier. For example,
   `meta.get-function(string.unquote("foo$"))` will throw an error for the same
   reason you can't write `@function foo$()`.

This applies to `sass:meta` functions as well to the keys of maps that are
passed as keyword to functions or mixins using the `foo($map...)` syntax.

## Transition Period

{% compatibility 'dart: "1.109.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Sass 1.109.0, we'll emit deprecation warnings when passing in risky
strings to `sass:meta` and as keyword arguments. If you only use CSS identifiers
without escapes, whether or not they come from quoted strings, you won't see any
warnings. If they have escapes, you'll only see warnings if the strings are
quoted or if they're unquoted strings that aren't in canonical form.

If you're seeing these warnings and want to future-proof your stylesheets, the
best way to do so is to make sure you always use unquoted strings in canonical
form when referring to identifiers. This will work the same for the foreseeable
future.

### Phase 2

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 2.0.0, we'll introduce one small breaking change: Sass functions
and features that *return* identifier names will always return them in unquoted,
canonical form. This includes map keys from functions like
[`meta.module-functions()`] as well as map keys in argument lists captured via
`$args...`.

In order to give users affected by the broader change time to migrate, no other
changes will be applied in Dart Sass 2.0.0.

### Phase 3

{% compatibility 'dart: "3.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In Dart Sass 3.0.0, we'll complete this breaking change by interpreting quoted
and unquoted strings according to the three rules described above.

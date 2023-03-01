---
title: 'Feature Watch: CSS Imports and CSS Compatibility'
author: Natalie Weizenbaum
tags: blog
#date: 2018-08-13 14:17 PST
---

Dart Sass 1.11 has just been released, and with it a handful of new features.
This is an exciting moment, because it marks the first major new feature that's
been added to the language since Dart Sass was launched. It's also the first
release with features that have gone through the new process, from
[proposal](https://github.com/sass/language/blob/main/accepted/css-imports.md)
to [tests](https://github.com/sass/sass-spec/pull/1277) to
[implementation](https://github.com/sass/dart-sass/pull/436).

### CSS Imports

The biggest feature in Dart Sass 1.11 is support for importing plain CSS files.
This is a long-awaited feature, and while we'd initially planned on waiting on
it until we launched the upcoming module system, we ended up deciding to
[implement it earlier](/blog/request-for-commentsimporting-css-files).

You can now import a CSS file, say `styles.css`, just by writing `@import
"styles"`. That file will be parsed as plain CSS, which means that any Sass
features like variables or mixins or interpolation will be disallowed. The CSS
it defines will become part of your stylesheet, and can be `@extend`ed just like
any other styles.

There are a couple caveats: because SCSS is a superset of plain CSS, it will
still compile `@import "styles.css"` (with an explicit extension) to a CSS
`@import` rule. If you want to import a CSS file into your Sass compilation, you
must omit the extension.

Also, this feature isn't fully [implemented in
LibSass](https://github.com/sass/libsass/issues/2699) yet. It still has its old
behavior, where it imports CSS files but parses them as SCSS, with all the extra
Sass features allowed. This behavior will be deprecated soon, and eventually it
will produce errors for anything other than plain CSS, just like Dart Sass does
today.

### CSS `min()` and `max()`

Dart Sass 1.11 also adds support for CSS's `min()` and `max()` mathematical
functions. For those unfamiliar, these functions work a lot like `calc()`,
except they return the minimum or maximum of a series of values. For example,
you can write `width: max(50%, 100px)` to make your element either 50% of the
parent's width or 100px wide, whichever is greater.

Because Sass has its own functions named `min()` and `max()`, it was difficult
to use these CSS functions... until now. Dart Sass 1.11 will intelligently
decide whether to use the plain CSS functions or the built-in Sass functions
based on whether or not you're passing in dynamic Sass values. For example:

- The Sass function will be called if you pass a variable, like `max($width,
100px)`.
- The Sass function will be called if you call another Sass function, like
  `max(compute-width(), 100px)`.
- It will compile to a plain CSS function if you just use plain CSS numbers,
  like `max(50% + 10px, 100px)`.
- It will still compile to a plain CSS function even if you use interpolation,
  like `max(50% + #{$width / 2}, #{$width})`.

This preserves backwards-compatibility with existing uses of the Sass functions,
while also users to use the CSS functions the same way they would in plain CSS.

This feature isn't yet implemented in
[LibSass](https://github.com/sass/libsass/issues/2701) or [Ruby
Sass](https://github.com/sass/ruby-sass/issues/77).

### Range-Format Media Queries

CSS Media Queries Level 4 defines a [range
syntax](https://www.w3.org/TR/mediaqueries-4/#mq-range-context) for defining
certain media queries:

```css
@media (width > 500px) {
  /* ... */
}
```

Dart Sass 1.11 adds support for this syntax. It works just like existing media
query support: you can either use interpolation or plain Sass expressions to
inject Sass logic into the query, and they can still be nested.

```scss
@media (width > $width) {
  @media (height < #{$height}) {
    /* ... */
  }
}
```

This feature isn't yet implemented in
[LibSass](https://github.com/sass/libsass/issues/2698) or [Ruby
Sass](https://github.com/sass/ruby-sass/issues/75).

### Normalized Identifier Escapes

The last compatibility improvement is a bit of an edge case, but it's still
worth mentioning: the way Sass parses escapes in identifiers has been improved
to better match the CSS spec.

Escapes are now normalized to a standard format, which means that (for example)
`éclair` and `\E9clair` are parsed to the same value (in this case, `éclair`).
Prior to this change, if an escape was written, it would always be preserved
as-is, so `str-length(\E9clair)` would return `8` even though that identifier
means exactly the same thing to CSS as `éclair`.

We don't anticipate this affecting many users, but we always strive to bring
Sass as close to the semantics of CSS as possible. This is a small but important
step on that path.

This feature isn't yet implemented in
[LibSass](https://github.com/sass/libsass/issues/2700) or [Ruby
Sass](https://github.com/sass/ruby-sass/issues/76).

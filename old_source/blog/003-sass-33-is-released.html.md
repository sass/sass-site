---
title: Sass 3.3 is Released
author: Natalie Weizenbaum
# date: 2014-03-07 16:40 PST
---

After ironing out a bunch of bugs in numerous release candidates, we're finally
ready to release Sass 3.3.0, codename Maptastic Maple, for public consumption.
This release has a lot of exciting new features that you can read about in full
in [the changelog](/documentation/file.SASS_CHANGELOG.html), but there are three
that I want to draw your attention to in particular.

# Maps in SassScript

As language designers, most of our job is to listen to feedback from users and
act upon it. This is tricker than it sounds: users are very good at knowing the
precise thing that they want to accomplish, but they tend not to have a sense of
how that fits into the big picture. So we take a large volume of user requests,
try to distill the core needs that aren't being met, and see if we can come up
with features that hit as many of those as possible as simply as possible.

SassScript maps are a great example of this. We had a lot of users requesting
things like variable interpolation, so they could write things like
`$#{$theme-name}-background-color`. Other users wanted built-in functions that
worked with lists of pairs, or a way to get the name of a variable that was
passed to a function. We eventually realized the underlying feature that people
actually wanted: a way to associate values with names.

Most programming languages have a notion of maps[^1], which are associations
from "key" objects to "value" objects. Sass 3.3 adds support for these as a
first-class data structure. The syntax is designed to be very similar to that
used for `@media` queries. They look like this:

```scss
$map: (key1: value1, key2: value2, key3: value3);
```

Unlike lists, maps must always be surrounded by parentheses. `()`, which
previously referred to an empty list, now _also_ refers to an empty map; both
list and map operations will work on it.

Maps can't be used as CSS values, since they aren't valid CSS syntax. However,
there are a number of [new built-in
functions](/documentation/Sass/Script/Functions.html#map_functions) that allow
user-defined mixins and functions to use them. Here are a few particularly
useful ones:

* `map-get($map, $key)` looks up a value in a map using its key. For example,
  using the example above, `map-get($map, key2)` would return `value2`.

* `map-merge($map1, $map2)` merges two maps together. The keys in `$map2`
  overwrite those in `$map1`, so this is also a good way to add values to a map.
  For example, `map-merge($map, (key1: new-value))` would return `(key1:
  new-value, key2: value2, key3: value3)`.

* `map-remove($map, $key)` removes a value in a map. For example,
  `map-remove($map, $key)` would return `(key: value2, key3: value3)`.

In addition to the new map functions, all the existing list functions also work
on maps. The list functions will see each map as a list of pairs. For example,
`nth($map, 1)` will return `(key1 value1)`. Not only that, but `@each` has new
syntax for working with both maps and lists of pairs. For example:

```scss
@each $header, $size in (h1: 2em, h2: 1.5em, h3: 1.2em) {
  #{$header} {
    font-size: $size;
  }
}
```

produces:

```css
h1 {
  font-size: 2em;
}

h2 {
  font-size: 1.5em;
}

h3 {
  font-size: 1.2em;
}
```

# Source Maps

Continuing the map theme, Sass 3.3 comes with support for generating source maps
when compiling to CSS. Source maps are a standard format for telling browsers
how files they consume got generated. For Sass, this means that browsers'
development tools can now tell you exactly which line of your Sass source file
each style rule came from. Currently this is only well-supported in Chrome, but
hopefully other browsers will add support soon.

When compiling Sass from the command line, all you need to do to generate source
maps is pass the `--sourcemap` flag. Sass will automatically generate a
`.css.map` file next to the generated `.css` file. All you have to do then is
make sure your `.scss` or `.sass` file is visible to the browser, and you'll be
good to go.

# More Flexible `&`

When we released Sass 3.0, we added support for SCSS, which meant we had to
actually parse all the selectors in the document. This meant that you couldn't
just plop the parent selector, `&`, anywhere in a selector. Overall this was an
improvement: it caught more errors and encouraged users to write more flexible
mixins.

Unfortunately, it also made one important use-case harder. With the rise in
popularity of [BEM](http://gembem.com/), [OOCSS](http://oocss.org/), and
[SMACSS](http://smacss.com/), people became more and more interested in adding
suffixes to classes. When using Sass, they wanted to write mixins to do this,
and the restrictions on `&` made that very hard to do.

In Sass 3.3, we're loosening these restrictions. You can now write `&-suffix`
(or `&_suffix`, or even `&suffix` if you really want) and Sass will make it
work. If this fails to apply&mdash;for example, if `&` is `*`&mdash;Sass will
print a helpful error message.

# Deprecation: Variable Scope and `!global`

We don't always get everything right the first time, and in order to make Sass
the best language it can be we occasionally have to change old behavior.
Sometimes this happens in ways that might make existing stylesheets stop
functioning, so we have a policy of printing warnings for stylesheets that are
going to change in the future.

Sass 3.3 adds a number of deprecations, but the biggest one by far has to do
with the way variable scope works. Up until now, when you wrote `$var: value` in
a function, mixin, or CSS rule in Sass, it could do one of two things. If there
was a global variable named `$var`, it would overwrite that variable. Otherwise,
it would create a local variable that was only visible within the current set of
curly braces.

This was a pretty big problem, since any given variable assignment could
potentially be modifying a variable that it had no way of knowing existed. We
want to migrate to a better system where assigning to a variable in a local
scope won't overwrite a global variable unless the assignment explicitly says to
do so, as in `$var: value !global`.

In order to avoid breaking existing stylesheets, we haven't made this change
yet. Instead, if a global variable is overwritten by a local declaration, we now
print a deprecation warning suggesting that the user add `!global`. Right now,
`!global` doesn't do much other than make the warning go away, but in a future
release it will work as I described above.

# That's All

Actually, there's a lot more, but that's all I have room for in this post. If
you want to see the full assortment of new features, check out [the
changelog](/documentation/file.SASS_CHANGELOG.html#330_7_March_2014). You can
also play with the new features on [SassMeister](http://sassmeister.com/) or on
your own computer by running `gem update sass`. Enjoy!

[^1]: Some languages call them "hashes", "dictionaries", or "associative
    arrays". JavaScript calls them "objects" for weird historical reasons.

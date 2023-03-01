---
title: Sass 3.5 Release Candidate
author: Natalie Weizenbaum
# date: 2016-08-30 15:00 PST
---

I've just pushed the button to release Sass 3.5.0-rc.1. If it seems like it's
been a while since the last release, that's true! But there's a good reason. We
decided to enter feature freeze after the 3.5 release to give
[libsass](/libsass), the super-speedy C++ implementation of Sass, time to reach
feature parity with Sass 3.4. Libsass is much younger than Sass, and C++ is
generally a slower language to work in than Ruby, so this took some time. But it
paid off: libsass is now almost 100% compatible with Ruby Sass, differing only
in a few small bugs.

After the feature freeze lifted, we were primarily focused on designing the new
module system that will be the central feature of Sass 4.0. But we also found
some time to add some new features, which are the focus of this release.


## CSS Custom Property Support

Sass 3.5 now fully supports [CSS custom
properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables).
These posed a particular challenge for us, since the custom property syntax is
*extremely* broad. You can put just about anything on the right-hand side. For
example, this is totally valid, meaningful CSS:

```css
.wacky-property {
  --property: .%(#@$~`^[^_+]<;:"}"|?)*+
}
```

In particular, this means that SassScript expressions are *also* valid CSS,
which poses a problem for our goal of CSS compatibility. Wherever possible, we
want valid CSS to mean the same thing in Sass as it does in CSS. So treating
custom properties just like normal properties—which we did in 3.4—wasn't a good
solution. Not only was some valid CSS interpreted differently, some of it wasn't
even possible. The following CSS, taken straight from the Polymer docs, was next
to impossible to represent in Sass:

```css
:host {
  --my-toolbar-theme: {
    background-color: green;
    border-radius: 4px;
    border: 1px solid gray;
  };
}
```

On the other hand, we needed *some* way of including dynamic SassScript values
in custom properties. So we decided on a compromise: we'd treat custom
properties like we do selectors and at-rule values, and only allow `#{}` as a
means of including Sass values. While technically this is plain CSS, it's a very
small surface area and it's very easy to escape, so we're not too worried. This
means that in 3.5 you can write:

```scss
:host {
  --my-toolbar-theme: {
    background-color: #{$toolbar-background};
    border-radius: 4px;
    border: 1px solid gray;
  };
}
```

## New Data Type: First-Class Functions

In preparation for the module system that's coming in Sass 4.0, 3.5 adds a new
data type: first-class functions. This is just a way of referring to a function
that's more specific than just its name. You can get a first-class function by
passing its name to `get-function($name)`, and you can pass it to `call()` where
you used to pass the function name.

You might be wondering, "Why is this useful? I could already just pass the
function name." Well, right now, Sass has global scope. All functions (as well
as variables, mixins, and selectors) are visible to any code that's executing
later on. This makes some things, like `call()`, simple, but it also causes a
lot of problems. It's way too easy to accidentally overwrite a variable or
function that was defined elsewhere, and it's way too hard to figure out where
any given name was originally defined.

We aren't quite ready to talk widely about our plans for the 4.0 module system,
but one of the things we're sure of is that it won't use global scope. Each Sass
file will only be able to see a limited number of the names that have been
defined, and Sass libraries in particular won't be able to see anything defined
by the end-user stylesheets that import them. First-class functions allow users
to pass functions they define to libraries.

Any stylesheets that are currently passing around function names as strings
should switch to passing first-class functions instead. To this end, calling
`call()` with a string has been deprecated. It won't actually break until 4.0,
when it won't be much use anyway, but we strongly encourage users to switch to
`get-function()` immediately.

## New Syntax: Bracketed Lists

The new [CSS Grid
Layout](https://css-tricks.com/snippets/css/complete-guide-grid/) module added a
new type of syntax: identifiers surrounded by square brackets. We're always
striving to be totally compatible with CSS, which meant we needed to support
these brackets as well. Here's what they look like in CSS:

```css
.container {
  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
}
```

The solution was clear: Sass already has a [list data
type](/documentation/file.SASS_REFERENCE.html#lists), so we'd just allow lists
to have square brackets. So `[first]` is just a list containing the unquoted
string `first`. Like all Sass lists, bracketed lists can either be
space-separated or comma-separated: `[foo bar baz]` and `[foo, bar, baz]` are
both lists containing three elements.

We've also added function support for bracketed lists. The `is-bracketed($list)`
function returns whether a list is bracketed or not, and `join()` has a new
`$bracketed` parameter that allows the caller to choose whether or not the
resulting list will have brackets (by default, the result is bracketed if the
first list is).

## Smaller Features

We've added a `content-exists()` function that returns whether or not a content
block was passed to the current mixin. This allows mixins to optionally take a
content block, rather than having to define one mixin that takes content and one
that does not.

We've added the ability to add a trailing comma to argument lists. This matches
the behavior of lists and maps.

We've added a `$weight` parameter to the `invert()` function. This is a
percentage between 0% and 100% that indicates how inverted the resulting color
should be. It defaults to 100%.

## The Road to Release

This is just a release candidate, but it's in a place that we'd be happy
shipping it as the final release. We're not doing so because, now that we've
reached feature compatibility with libsass, we're committed to staying there.

Unfortunately, since [Marcel Greter moved on from the
project](/blog/thank-you-marcel), libsass has been moving pretty slowly lately.
If you or anyone you know would be interested in working on a project that would
benefit thousands of people, we're still looking for new contributors!

Until we have libsass compatibility, 3.5 will stay at a release candidate level.
But don't let that stop you from trying it out and letting us know what you
think! We're always interested in hearing feedback on [the mailing
list](https://groups.google.com/forum/#!forum/sass-lang)!

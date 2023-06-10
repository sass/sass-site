---
title: "Request for Comments: Nested Map Functions"
author: Natalie Weizenbaum
date: 2020-9-16 14:40:00 -8
---

As Sass libraries and design systems get more complex and have more users with
different needs, they tend to develop the need to share and override
configuration and design tokens. This configuration is often hierarchical, and
ends up being represented as maps that contain maps that contain still more
maps. Up until now, Sass's map functions haven't really made it easy to work
with this sort of nested map structure. But that's changing with the latest
language proposal, written by Sass core team member [Miriam Suzanne].

[Miriam Suzanne]: https://www.miriamsuzanne.com/

This proposal expands the existing map functions and adds a few new ones to make
working with nested maps much easier than it was before. It's based on helper
functions that pop up in all sorts of Sass projects around the web,
incorporating best practices back into the language itself.

## The Functions

Here are the new and improved functions this proposal adds:

### `map.get()` and `map.has-key()`

The [`map.get()`] and [`map.has-key()`] functions both now take any number of
keys as arguments. Each key drills deeper into a nested map, allowing you to
easily inspect nested values without needing to chain a bunch of function calls
together.

[`map.get()`]: /documentation/modules/map#get
[`map.has-key()`]: /documentation/modules/map#has-key

For example, let's take the following simplified configuration map:

```scss
$config: (
  "colors": (
    "primary": red,
    "secondary": blue
  )
)
```

For this map, `map.get($config, "colors", "primary")` gets the value of the
`"colors"` key (`("primary": red)`) then the value of the `"primary"` key and
returns `red`.

Similarly, `map.has-key($config, "colors", "primary")` returns `true` while
`map.has-key($config, "colors", "tertiary")` returns `false`.

### `map.merge()`

The [`map.merge()`] function can now be called as `map.merge($map1, $keys...,
$map2)`. This will merge `$map2` with a child of `$map1` at the location given
by the keys, updating the parent maps as it goes.

[`map.merge()`]: /documentation/modules/map#merge

For example, using the configuration map [defined above] `map.merge($config,
"colors", ("primary": green))` will return

[defined above]: #map-get-and-map-has-key

```
(
  "colors": (
    "primary": green,
    "secondary": blue
  )
)
```

### `map.set()`

The `map.set($map, $keys..., $value)` function is all-new. Although updating
individual values in maps was always possible with `map.merge()`, we've found
that users get confused by the absence of a dedicated `set()` function. This
function not only fills that role, but makes it possible to set values within
nested maps as well.

You can use `map.set()` for normal single-layer maps by just passing one key.
For example, `map.set(("wide": 200px, "narrow": 70px), "wide", 180px)` will
return `("wide": 180px, "narrow": 70px)`.

But you can also use it for nested maps. For example, `map.set($config,
"colors", "tertiary", yellow)` will return

```
(
  "colors": (
    "primary": red,
    "secondary": blue,
    "tertiary": yellow
  )
)
```

### `map.deep-remove()`

Because the existing [`map.remove()`] function already takes any number of
arguments, we couldn't just update it to work with nested maps. Instead, we
chose to add a new function just for nested maps, called `map.deep-remove($map,
$keys...)`. This function removes the value at the final key in the list, and
updates all the parent maps accordingly.

[`map.remove()`]: /documentation/modules/map#remove

For example, `map.deep-remove($config, "colors", "secondary")` will return
`("colors": ("primary": red))`.

### `map.deep-merge()`

The final new function may be the most exciting. `map.deep-merge($map1, $map2)`
works just like `map.merge()`, except that any nested maps are *also* merged,
including maps within those maps and so on. This makes it easy to combine two
configuration maps that have the same structure without having to manually merge
each level by hand.

For example, `map.deep-merge($config, ("colors": ("secondary": teal)))` returns

```
(
  "colors": (
    "primary": red,
    "secondary": teal
  )
)
```

## Let us know what you think!

If you're interested in learning more about this proposal, [read it in full] on
GitHub. It's open for comments and revisions for the next month, so if you'd
like to see something change please [file an issue] and we can discuss it!

[read it in full]: https://github.com/sass/sass/tree/main/accepted/nested-map-functions.md
[file an issue]: https://github.com/sass/sass/issues/new

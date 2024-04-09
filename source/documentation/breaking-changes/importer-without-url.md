---
title: "Breaking Change: Importer without URL"
introduction: |
  The JS and Dart APIs used to allow passing an `importer` (singular) argument to
  `compileString*()` without a corresponding `url`. This is now deprecated in
  favor of passing the importer to `importers` (plural) instead.
---

The [`importer` option] to `compileString()` and `compileStringAsync()` (and the
similar option in the Dart API) is intended to represent the importer that's
used to resolve relative URLs in the entrypoint file. The `compile()` and
`compileAsync()` functions don't have this option because they _always_ load the
entrypoint from the filesystem, so they use the filesystem importer; but if
you're loading the entrypoint from a Sass string you'll need to supply the
importer yourself.

[`importer` option]: /documentation/js-api/interfaces/StringOptionsWithImporter/index.html#importer

Relative loads in Sass are handled by resolving the loaded URL (`path/to/style`
in `@use "path/to/style"`) relative to the canonical URL for the file containing
it; the `url` parameter provides that canonical URL. Logically, it doesn't make
sense for an importer to handle relative loads without knowing what they're
relative _to_. However, instead of throwing an error, Sass historically handled
this by attempting to canonicalize the relative URL with the `importer`
parameter the same way it would if it were in the `importers` array, by calling
`canonicalize("path/to/style")`.

This behavior was always wrong. The only importers whose `canonicalize()`
functions should be passed relative URLs are the ones in the `importers`
(plural) parameter. In most cases, if you're seeing this deprecation message,
you can just move your importer to `importers` and it will continue to work.

## Transition Period

{% compatibility 'dart: "1.75.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Until Dart Sass 2.0.0, passing an `importer` without a `url` will produce a
deprecation message named `importer-without-url` instead of throwing an error.


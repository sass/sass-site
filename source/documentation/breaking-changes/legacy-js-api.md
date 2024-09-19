---
title: "Breaking Change: Legacy JS API"
introduction: |
  Dart Sass originally used an API based on the one used by Node Sass, but
  replaced it with a new, modern API in Dart Sass 1.45.0. The legacy JS API is
  now deprecated and will be removed in Dart Sass 2.0.0.
---

## Migrating Usage

### Entrypoints

The legacy JS API had two entrypoints for compiling Sass: `render` and
`renderSync`, which took in an options object that included either `file` (to
compile a file) or `data` (to compile a string). The modern API has four:
`compile` and `compileAsync` for compiling a file and `compileString` and
`compileStringAsync` for compiling a string. These functions take a path or
source string as their first argument and then an object of all other options
as their second argument. Unlike `render`, which used a callback, `compileAsync`
and `compileStringAsync` return a promise instead.

See the [usage documentation] for more details.

[usage documentation]: /documentation/js-api/#md:usage

### Importers

Importers in the legacy API consisted of a single function that took in the
dependency rule URL and the URL of the containing stylesheet (as well as a
`done` callback for asynchronous importers) and return an object with either
a `file` path on disk or the `contents` of the stylesheet to be loaded.

Modern API [`Importer`]s instead contain two methods: `canonicalize`, which takes
in a rule URL and returns the canonical form of that URL; and `load`, which
takes in a canonical URL and returns an object with the contents
of the loaded stylesheet. Asynchronous importers have both of these methods
return promises.

There's also a special [`FileImporter`] that redirects all loads to existing
files on disk, which should be used when migrating from legacy importers that
returned a `file` instead of `contents`.

[`Importer`]: /documentation/js-api/interfaces/importer/
[`ImporterResult`]: /documentation/js-api/interfaces/importerresult/
[`FileImporter`]: /documentation/js-api/interfaces/fileimporter/

### Custom Functions

In the legacy JS API, custom functions took a separate JS argument for each
Sass argument, with an additional `done` callback for asynchronous custom
functions. In the modern API, custom functions instead take a single JS argument
that contains a list of all Sass arguments, with asynchronous custom functions
returning a promise.

The modern API also uses a much more robust [`Value`] class that supports
type assertions and easy map and list lookups.

[`Value`]: /documentation/js-api/classes/value/

### Bundlers

If you're using a bundler or other tool that calls the Sass API rather than
using it directly, you may need to change the configuration you pass to that
tool to tell it to use the modern API.

Webpack should already use the modern API by default, but if you're getting
warnings, set `api` to `"modern"` or `"modern-compiler"`.
See [Webpack's documentation] for more details.

Vite still defaults to the legacy API, but you can similarly switch it by
setting `api` to `"modern"` or `"modern-compiler"`. See [Vite's documentation]
for more details.

[Webpack's documentation]: https://webpack.js.org/loaders/sass-loader/#api
[Vite's documentation]: https://vitejs.dev/config/shared-options.html#css-preprocessoroptions

## Silencing Warnings

While the legacy JS API was marked as deprecated in Dart Sass 1.45.0 alongside
the release of the modern API, we began emitting warnings for using it starting
in Dart Sass 1.79.0. If you're not yet able to migrate to the modern API but
want to silence the warnings for now, you can pass `legacy-js-api` in the
`silenceDeprecations` option:

```js
const sass = require('sass');

const result = sass.renderSync({
  silenceDeprecations: ['legacy-js-api'],
  ...
});
```

This will silence the warnings for now, but the legacy API will be removed
entirely in Dart Sass 2.0.0, so you should still plan to migrate off of it soon.

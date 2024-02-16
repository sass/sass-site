---
title: "Announcing `pkg:` Importers"
author: Natalie Weizenbaum
date: 2024-02-15 17:00:00 -8
---

Several months ago, we [asked for feedback] on a proposal for a new standard for
importers that could load packages from various different package managers using
the shared `pkg:` scheme, as well as a built-in `pkg:` importer that supports
Node.js's module resolution algorithm. Today, I'm excited to announce that this
feature has shipped in Dart Sass 1.71.0!

[asked for feedback]: /blog/rfc-package-importer

No longer will you have to manually add `node_modules` to your `loadPaths`
option and worry about whether nested packages will work at all. No longer will
you need to add `~`s to your URLs and give up all portability. Now you can just
pass `importers: [new NodePackageImporter()]` and write `@use 'pkg:library'` and
it'll work just how you want out of the box.

## What is a `pkg:` importer?

Think of a `pkg:` importer like a specification that anyone can implement by
writing a [custom importer] that follows [a few rules]. We've implemented one for
the Node.js module algorithm, but you could implement one that loads Sass files
from [RubyGems] or [PyPI] or [Composer]. This way, a Sass file doesn't have to
change the URLs it loads no matter where it's loading them from.

[custom importer]: /documentation/js-api/interfaces/Options/#importers
[a few rules]: /documentation/at-rules/use#rules-for-a-pkg-importer
[RubyGems]: https://rubygems.org/
[PyPI]: https://pypi.org/
[Composer]: https://getcomposer.org/

## What do `pkg:` URLs look like?

The simplest URL is just `pkg:library`. This will find the `library` package in
your package manager and load its primary entrypoint file, however that's
defined. You can also write `pkg:library/path/to/file`, in which case it will
look for `path/to/file` in the package's source directory instead. And as with
any Sass importer, it'll do the standard resolution to handle file extensions,
[partials], and [index files].

[partials]: /documentation/at-rules/use#partials
[index files]: /documentation/at-rules/use#index-files

## How do I publish an npm package that works with the Node.js `pkg:` importer?

The Node.js `pkg:` importer supports all the existing conventions for declaring
Sass files in `package.json`, so it should work with existing Sass packages out
of the box. If you're writing a new package, we recommend using the [`"exports"`
field] with a `"sass"` key to define which stylesheet to load by default:

[`"exports"` field]: https://nodejs.org/api/packages.html#conditional-exports

```json
{
  "exports": {
    "sass": "styles/index.scss"
  }
}
```

The Node.js `pkg:` importer supports the full range of `"exports"` features, so
you can also specify different locations for different subpaths:

```json
{
  "exports": {
    ".": {
      "sass": "styles/index.scss",
    },
    "./button.scss": {
      "sass": "styles/button.scss",
    },
    "./accordion.scss": {
      "sass": "styles/accordion.scss",
    }
  }
}
```

...or even patterns:

```json
{
  "exports": {
    ".": {
      "sass": "styles/index.scss",
    },
    "./*.scss": {
      "sass": "styles/*.scss",
    },
  }
}
```

---
title: "Request for Comments: Package Importer"
author: James Stuckey Weber
date: 2023-09-31 14:30:00 -8
---

Sass users often need to use styles from a dependency to customize an existing
theme or access styling utilities. Historically, Sass has not specified a
standard method for using packages from dependencies. This has led to a variety
of domain-specific solutions, including the `~` prefix in Webpack, and adding
`node_modules` to `loadPaths`.

This has been a common pain point, and can make it difficult to rely on
dependencies. It can also make it more difficult to move your project to a new
build process.

## Package Importers

We are proposing a new type of importer that allows users to use the `pkg:` URL
scheme to direct Sass to resolve the dependency URL using the resolution
standards and conventions for a specific environment.

To address the largest use case, we are proposing a built-in Package Importer
for the Node ecosystem. Our recommendation is for package authors to define a
`sass` [conditional export] for entry points to their package in their
distributed `package.json`. For example, a `package.json` containing:

[conditional export]: https://nodejs.org/api/packages.html#conditional-exports

```json
{
  "exports": {
    ".": {
      "sass": "./src/scss/index.scss",
      "import": "./dist/js/index.mjs",
      "default": "./dist/js/index.js"
    },
    "./utils": {
      "sass": "./src/scss/_utils.scss",
      "default": "./dist/js/utils.js"
    }
  }
}
```

would allow a package consumer to write:

```scss
@use "pkg:library";
@use "pkg:library/utils";
```

The Node Package Importer also supports several other ways of defining entry
points, which it resolves in the following order:

1. `sass`, `style`, or `default` condition in package.json `exports` that
   resolves to a Sass or CSS file.

2. If there is not a subpath, then find the root export:

   1. `sass` key at package.json root.

   2. `style` key at package.json root.

   3. `index` file at package root, resolved for file extensions and partials.

3. If there is a subpath, resolve that path relative to the package root, and
   resolve for file extensions and partials.

To better understand and allow for testing against the recommended algorithm, a
[Sass pkg: test] repository has been made with a rudimentary implementation of
the algorithm.

[sass pkg: test]: https://github.com/oddbird/sass-pkg-test

## Details

Because the Node ecosystem is primarily concerned with distributing JavaScript,
we needed to find a way to allow package authors to distribute Sass. In many
ways, the closest analog is to TypeScript types, as type definition files are
distributed alongside compiled code, and are often not the primary export in a
package.

Based on our [analysis] of over 400 packages for design libraries and
frameworks, we anticipate package consumers will be able to use `pkg:` URLs for
many packages without package authors needing to make changes. Package authors
will be able to better specify and document how to consume the packages.

Our analysis also showed that packages distributing Sass almost always did so
alongside JavaScript code. Some packages do specify a Sass file as a `sass` key
or a CSS file as a `style` key at the `package.json` root, both of which will be
supported by the Node Package Importer. We observed little usage of `main` or
`module` keys for CSS or Sass, which will not be supported.

While we observed low usage currently of [conditional exports] fields for
specifying Sass and CSS files, we expect this to grow as package authors adopt
conditional exports. In addition, build tools like [Vite], [Parcel] and [Sass
Loader for Webpack] all currently resolve Sass paths using the `sass` and
`style` custom conditions.

[analysis]: https://github.com/oddbird/sass-pkg-test/tree/main/analysis
[conditional exports]: https://nodejs.org/api/packages.html#conditional-exports
[Vite]: https://github.com/vitejs/vite/pull/7817
[Parcel]: https://github.com/parcel-bundler/parcel/blob/2d2400ded4615375ee6bd53ef77b4857ad1591dd/packages/transformers/sass/src/SassTransformer.js#L163
[Sass Loader for Webpack]: https://github.com/webpack-contrib/sass-loader/blob/02df41203adfda96959e56abb43bd35a89ec11ba/src/utils.js#L514

Users will need to opt-in to the new Package Importer by importing the
`nodePackageImporter` from `sass` and including it in the list of `importers`.
This won't be available for Sass in the browser.

## Next steps

This is still in the proposal phase, so we are open to feedback. Review the
proposal [on Github], and [open an issue] with any thoughts or concerns you may
have.

[on GitHub]: https://github.com/sass/sass/blob/main/proposal/package-importer.d.ts.md
[open an issue]: https://github.com/sass/sass/issues/new

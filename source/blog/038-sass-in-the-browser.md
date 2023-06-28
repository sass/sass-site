---
title: "Sass in the Browser"
author: Natalie Weizenbaum
date: 2023-06-28 16:30:00 -8
---

Over Sass's lifetime, we've seen many of the features we've pioneered adopted in
the browser. [CSS variables], [math functions], and most recently [nesting] were
all inspired by Sass. But running _Sass itself_ as a compiler in the browser was
never possible... until now.

[CSS variables]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
[math functions]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Functions#math_functions
[nesting]: https://www.w3.org/TR/css-nesting-1/

With the release of Dart Sass 1.63, we're officially adding support to the
`sass` npm package for running directly in the browser. No longer do creators of
playgrounds or web IDEs need to make server calls to compile their Sass. Now you
can just load it up and use it right on your very page.

You can try it right now, in fact! Just open up your developer console and run
this:

```js
const sass = await import('https://jspm.dev/sass');
sass.compileString('a {color: #663399}');
```

## How Else Can I Use It?

We've done our best to make sure that Sass in the browser is usable as many ways
as possible. It can be loaded using both [CommonJS `require()`] and [ES6
`import`]. It can be loaded by bundlers (we've tested with esbuild, Rollup,
Vite, and webpack), or it can be loaded with no bundling at all directly in the
browser.

[CommonJS `require()`]: https://nodejs.org/docs/latest/api/modules.html#requireid
[ES6 `import`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import

The only caveat is that it does depend on the [Immutable] library, so if you're
using it without any bundling at all you'll need to set up an [import map] so
that it can find that dependency. But if you're using a bundler or a CDN like
[JSPM] that pulls in dependencies for you, you won't need to worry about it.

[Immutable]: https://immutable-js.com/
[import map]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
[JSPM]: https://jspm.org

[The Dart Sass README] is the canonical location for more detailed information
about getting up and running with Dart Sass in the browser in any of the many
ways it supports.

[The Dart Sass README]: https://github.com/sass/dart-sass/blob/main/README.md#dart-sass-in-the-browser

## What APIs Are Available?

We've tried to make as much of the [JavaScript API] as possible available in the
browser. [Custom functions] and [importers] are both supported, along with the
full [Sass value API]. However, there are two categories of API that aren't
available in the browser:

[JavaScript API]: /documentation/js-api
[Custom functions]: /documentation/js-api/interfaces/options/#functions
[importers]: /documentation/js-api/interfaces/options/#importers
[Sass value API]: /documentation/js-api/classes/value/

1. Any API that expects a filesystem to exist. This means that you can't pass in
   a [`FileImporter`], but it also means that the [`compile`] and
   [`compileAsync`] functions aren't available since they take file paths.
   You'll need to use [`compileString`] or [`compileStringAsync`] instead.

   [`FileImporter`]: /documentation/js-api/interfaces/fileimporter/
   [`compile`]: /documentation/js-api/functions/compile
   [`compileAsync`]: /documentation/js-api/functions/compileAsync
   [`compileString`]: /documentation/js-api/functions/compileString
   [`compileStringAsync`]: /documentation/js-api/functions/compileStringAsync

2. The [legacy JavaScript API]. This API only exists for compatibility with the
   deprecated [`node-sass` package]. Since `node-sass` never supported running
   in the browser and this API has a much squishier distinction between loading
   from the filesystem and loading from other sources, we decided to just not
   support it in the browser at all.

   [legacy JavaScript API]: https://sass-lang.com/documentation/js-api/#md:legacy-api
   [`node-sass` package]: https://www.npmjs.com/package/node-sass

## Acknowledgements

I would particularly like to thank the fine folks at [OddBird] for implementing
browser support, especially [Ed Rivas] and [Jonny Gerig Meyer]. Without their
contributions, the road to getting this feature in place would have been much
longer and much more painful.

[OddBird]: https://www.oddbird.net/
[Ed Rivas]: https://github.com/jerivas
[Jonny Gerig Meyer]: https://github.com/jgerigmeyer

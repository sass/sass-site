---
title: "New JS API Release Candidate is Live"
author: Natalie Weizenbaum
date: 2021-11-20 16:15:00 -8
---

The new JavaScript API that we [announced a few months ago] is now fully
implemented in Dart Sass and ready for you to try! The new API is designed to be
more idiomatic, performant, and usable than the old one, and we hope it'll be
adopted swiftly by tooling packages.

Because this is such a substantial addition, we want to give users a chance to
kick the tires a bit before we set it in stone, so we've released it as a release
candidate in Dart Sass 1.45.0-rc.1. Download it, try it out, and let us know
what you think by [filing issues] or [sending us a tweet]. Unless major changes
are necessary, we plan to make a stable release some time next week.

[announced a few months ago]: /blog/request-for-comments-new-js-api
[filing issues]: https://github.com/sass/sass/issues/new
[sending us a tweet]: https://twitter.com/SassCSS

## How to use it

The new API comes with four new entrypoint functions: `compile()` and
`compileAsync()` take Sass file paths and return the result of compiling them to
CSS, while `compileString()` and `compileStringAsync()` take a
string of Sass source and compile it to CSS. Unlike the old API, the async
functions all return `Promise`s. As with the old API, the synchronous functions
are substantially faster than their async counterparts, so we recommend using
them if at all possible.

```js
const sass = require('sass');

const result = sass.compileString(`
h1 {
  font-size: 40px;
  code {
    font-face: Roboto Mono;
  }
}`);
console.log(result.css);
```

Check out [the API docs] for more details on the API, including the brand-new
importer and custom function APIs.

[the API docs]: /documentation/js-api

## What about the old API?

Once the new API has a stable release, we'll officially consider the old API to
be deprecated. Since it's still widely-used, we'll continue to maintain it for a
good long while going forward. Expect it to start printing a deprecation warning
in a year or so, and to be disabled for good once we release Dart Sass 2.0.0.

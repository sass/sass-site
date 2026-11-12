---
title: "Breaking Change: Default Exports"
introduction: |
  You must use `import * as sass from 'sass'` to load the Sass API with
  [ECMAScript modules].
  
  [ECMAScript modules]: https://nodejs.org/api/esm.html#modules-ecmascript-modules
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Historically, Dart Sass was only available as a CommonJS module. This meant that
Node.js users loading it from a project that used ECMAScript modules were able
to load it as though it provided a [default export]:

[default export]: https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_the_default_export

```js
import sass from 'sass'; // Don't do this anymore
```

This was never intended by the Sass team, and it didn't match the type
declarations provided with the package, but it _did_ work. We removed this
ability in Dart Sass 2.0.0 and now require that ECMAScript module users only use
the package's named exports:

```js
import * as sass from 'sass'; // Do this
```

The old behavior was deprecated in Dart Sass 1.54.0.

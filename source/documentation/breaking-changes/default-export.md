---
title: "Breaking Change: Default Exports"
introduction: |
  By default, Node.js allows [CommonJS modules] to be loaded from ECMAScript
  modules using the syntax `import sass from 'sass'`. This is now deprecated;
  ESM users should use `import * as sass from 'sass'` instead.

  [CommonJS modules]: https://nodejs.org/docs/latest/api/modules.html#modules-commonjs-modules
  [ECMAScript modules]: https://nodejs.org/api/esm.html#modules-ecmascript-modules
---

Historically, Dart Sass was only available as a CommonJS module. This meant that
anyone using it from a project that used Node.js's native ECMAScript module
support was able to load it as though it provided a [default export]:

[default export]: https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export#using_the_default_export

```js
import sass from 'sass'; // Don't do this anymore
```

This was never intended by the Sass team, and it didn't match the type
declarations provided with the package, but it _did_ work. We have decided to
remove this support in Dart Sass 2.0.0 and require that ECMAScript module users
only use the package's named exports:

```js
import * as sass from 'sass'; // Do this
```

## Transition Period

{% compatibility 'dart: "1.54.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Until Dart Sass 2.0.0, we will continue to support users loading Sass's default
export. The first time any properties on the default export are accessed, it
will emit a deprecation warning to `console.error()`. To avoid this error, use
`import * as sass from 'sass'` instead.

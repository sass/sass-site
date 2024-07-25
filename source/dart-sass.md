---
layout: has_no_sidebars
title: Dart Sass
no_container: true
introduction: >
  Dart Sass is the primary implementation of Sass, which means it gets new
  features before any other implementation. It's fast, easy to install, and it
  compiles to pure JavaScript which makes it easy to integrate into modern web
  development workflows. Find out more or help out with its development on
  [GitHub](https://github.com/sass/dart-sass).
---

<div class="sl-l-grid sl-l-grid--full sl-l-large-grid--fit sl-l-large-grid--gutters-large">
  <div class="sl-l-grid__column">

## Command Line

Dart Sass's stand-alone command-line executable uses the blazing-fast Dart VM to
compile your stylesheets. To install Dart Sass on the command line, check out
the [installation instructions](/install). Once you've got it running, you can
use it compile files:

```shellsession
sass source/index.scss css/index.css
```

See `sass --help` for additional information on the command-line interface.

### Dart Library

You can also use Dart Sass as a Dart library to get the speed of the Dart VM
plus the ability to define your own functions and importers. To add it to an
existing project:

1. [Install the Dart SDK][install]. Make sure its `bin` directory is [on your
   `PATH`][path].

   [install]: https://dart.dev/get-dart
   [path]: https://katiek2.github.io/path-doc/

2. Create a `pubspec.yaml` file like this:

```yaml
name: my_project
dev_dependencies:
  sass: ^{{ releases['dart-sass'].version }}
```

3. Run `dart pub get`.

4. Create a `compile-sass.dart` file like this:

```dart
import 'dart:io';
import 'package:sass/sass.dart' as sass;

void main(List<String> arguments) {
  var result = sass.compileToResult(arguments[0]);
  new File(arguments[1]).writeAsStringSync(result.css);
}
```

5. You can now use this to compile files:

```shellsession
dart compile-sass.dart styles.scss styles.css
```

6. Learn more about [writing Dart code][dart] (it's easy!) and about [Sass's
   Dart API][sass].

   [dart]: https://www.dartlang.org/guides/language/language-tour
   [sass]: https://pub.dev/documentation/sass/latest/sass/compileToResult.html

</div>
<div class="sl-l-grid__column">

## JavaScript Library

Dart Sass is also distributed as the pure JavaScript [`sass` package] and
[`sass-embedded` package] on npm. The pure JS version is slower than the
stand-alone executable, but it's easy to integrate into existing workflows and
it allows you to define custom functions and importers in JavaScript. You can
add it to your project using `npm install --save-dev sass` and `require()` it as
a library:

[`sass` package]: https://www.npmjs.com/package/sass
[`sass-embedded` package]: https://www.npmjs.com/package/sass-embedded

```js
const sass = require('sass');

const result = sass.compile('style.scss');
console.log(result.css);

// OR

const result = await sass.compileAsync('style.scss');
console.log(result.css);
```

When installed via npm, Dart Sass supports a [brand new JavaScript API], as well
as a [legacy API] that's fully compatible with the old Node Sass API. Note that
when using the `sass` package, the synchronous API functions are more than twice
as fast as the asynchronous API, due to the overhead of asynchronous callbacks.

[brand new JavaScript API]: /documentation/js-api/
[legacy API]: /documentation/js-api/#md:legacy-api

## Embedded Dart Sass

Dart Sass also supports the [Embedded Sass protocol], which allows any
programming language to communicate directly with the Dart VM to run Sass
compilation, including custom function and importer support. This has two major
benefits:

[Embedded Sass protocol]: https://github.com/sass/sass/blob/main/spec/embedded-protocol.md#the-embedded-sass-protocol

1. It makes it easy to create a wrapper library for Dart Sass for any
   programming language that can run a subprocess.

2. The Dart VM is very fast, so this provides a substantial performance boost
   even for JavaScript where the native `sass` package is available.

The following Embedded Sass wrapper packages are available. If you have another
one to add, please [send a pull request]!

[send a pull request]: https://github.com/sass/sass-site/edit/main/source/dart-sass.md

* **Node.js**: The [`sass-embedded` package] is maintained by the Sass team, and
  supports the same [official Sass JavaScript API] as the native-JS `sass` package.

  [official Sass JavaScript API]: /documentation/js-api/

* **Go**: The [`github.com/bep/godartsass` package] runs Embedded Sass and
  supports the [Hugo] static site generator.

  [`github.com/bep/godartsass` package]: https://github.com/bep/godartsass
  [Hugo]: https://gohugo.io/

* **Java**: The [`de.larsgrefer.sass` package] runs Embedded Sass in Java.

  https://mvnrepository.com/artifact/de.larsgrefer.sass

* **Ruby**: The [`sass-embedded` gem] is maintained by frequent Sass contributor
  なつき.

  [`sass-embedded` gem]: https://rubygems.org/gems/sass-embedded

* **Rust**: The [`sass-embedded` crate] runs Embedded Sass in Rust.

  [`sass-embedded` crate]: https://crates.io/crates/sass-embedded

  </div>
</div>

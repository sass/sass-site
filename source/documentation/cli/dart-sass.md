---
title: Dart Sass Command-Line Interface
table_of_contents: true
---

## Usage

The Dart Sass executable can be invoked in one of two modes.

### One-to-One Mode

```shellsession
sass <input.scss> [output.css]
```

One-to-one mode compiles a single input file (`input.scss`) to a single output
location (`output.css`). If no output location is passed, the compiled CSS is
printed to the terminal.

The input file is parsed as [SCSS][] if its extension is `.scss`, as the
[indented syntax][] if its extension is `.sass`, or as [plain CSS][] if its
extension is `.css`. If it doesn't have one of these three extensions, or if it
comes from standard input, it's parsed as SCSS by default. This can be
controlled with the [`--indented` flag][].

[SCSS]: /documentation/syntax#scss
[indented syntax]: /documentation/syntax#the-indented-syntax
[plain CSS]: /documentation/at-rules/import/#importing-css
[`--indented` flag]: #indented

The special string `-` can be passed in place of the input file to tell Sass to
read the input file from [standard input][]. Sass will default to parsing it as
SCSS unless the [`--indented` flag][] is passed.

[standard input]: https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)

### Many-to-Many Mode

{% compatibility 'dart: "1.4.0"' %}{% endcompatibility %}

```shellsession
sass [<input.scss>:<output.css>] [<input/>:<output/>]...
```

Many-to-many mode compiles one or more input files to one or more output files.
The inputs are separated from the outputs with colons. It can also compile all
Sass files in a directory to CSS files with the same names in another directory.

```shellsession
​# Compiles style.scss to style.css.
$ sass style.scss:style.css

​# Compiles light.scss and dark.scss to light.css and dark.css.
$ sass light.scss:light.css dark.scss:dark.css

​# Compiles all Sass files in themes/ to CSS files in public/css/.
$ sass themes:public/css
```

When compiling whole directories, Sass will ignore [partial files][] whose names
begin with `_`. You can use partials to separate out your stylesheets without
creating a bunch of unnecessary output files.

[partial files]: /documentation/at-rules/import/#partials

## Options

### Input and Output

These options control how Sass loads its input files and how it produces output
files.

#### `--stdin`

This flag is an alternative way of telling Sass that it should read its input
file from [standard input][]. When it's passed, no input file may be passed.

```shellsession
$ echo "h1 {font-size: 40px}" | sass --stdin h1.css
$ echo "h1 {font-size: 40px}" | sass --stdin
h1 {
  font-size: 40px;
}
```

The `--stdin` flag may not be used with [many-to-many mode][].

[many-to-many mode]: #many-to-many-mode

#### `--indented`

This flag tells Sass to parse the input file as the [indented syntax][]. If it's
used in [many-to-many mode][], all input files are parsed as the indented
syntax, although files they [use][] will have their syntax determined as usual.
The inverse, `--no-indented`, can be used to force all input files to be parsed
as [SCSS][] instead.

[use]: /documentation/at-rules/use

The `--indented` flag is mostly useful when the input file is coming from
[standard input][], so its syntax can't be automatically determined.

```shellsession
$ echo -e 'h1\n  font-size: 40px' | sass --indented -
h1 {
  font-size: 40px;
}
```

#### `--load-path`

This option (abbreviated `-I`) adds an additional [load path][] for Sass to look
for stylesheets. It can be passed multiple times to provide multiple load paths.
Earlier load paths will take precedence over later ones.

[load path]: /documentation/at-rules/use#load-paths

```shellsession
$ sass --load-path=node_modules/bootstrap/dist/css style.scss style.css
```

#### `--pkg-importer=node`

{% compatibility 'dart: "1.71.0"' %}{% endcompatibility %}

This option (abbreviated `-p node`) adds the [Node.js `pkg:` importer] to the
end of the load path, so that stylesheets can load dependencies using the
Node.js module resolution algorithm.

[Node.js `pkg:` importer]: /documentation/at-rules/use#node-js-package-importer

Support for additional built-in `pkg:` importers may be added in the future.

```shellsession
$ sass --pkg-importer=node style.scss style.css
```

#### `--style`

This option (abbreviated `-s`) controls the output style of the resulting CSS.
Dart Sass supports two output styles:

- `expanded` (the default) writes each selector and declaration on its own line.
- `compressed` removes as many extra characters as possible, and writes the
  entire stylesheet on a single line.

```shellsession
$ sass --style=expanded style.scss
h1 {
  font-size: 40px;
}

$ sass --style=compressed style.scss
h1{font-size:40px}
```

#### `--no-charset`

{% compatibility 'dart: "1.19.0"' %}{% endcompatibility %}

This flag tells Sass never to emit a `@charset` declaration or a UTF-8
[byte-order mark][]. By default, or if `--charset` is passed, Sass will insert
either a `@charset` declaration (in expanded output mode) or a byte-order mark
(in compressed output mode) if the stylesheet contains any non-ASCII characters.

[byte-order mark]: https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8

```shellsession
$ echo 'h1::before {content: "👭"}' | sass --no-charset
h1::before {
  content: "👭";
}

$ echo 'h1::before {content: "👭"}' | sass --charset
@charset "UTF-8";
h1::before {
  content: "👭";
}
```

#### `--error-css`

{% compatibility 'dart: "1.20.0"' %}{% endcompatibility %}

This flag tells Sass whether to emit a CSS file when an error occurs during
compilation. This CSS file describes the error in a comment _and_ in the
`content` property of `body::before`, so that you can see the error message in
the browser without needing to switch back to the terminal.

By default, error CSS is enabled if you're compiling to at least one file on
disk (as opposed to standard output). You can pass `--error-css` explicitly to
enable it even when you're compiling to standard out, or `--no-error-css` to
disable it everywhere. When it's disabled, the [`--update` flag][] and
[`--watch` flag][] will delete CSS files instead when an error occurs.

[`--watch` flag]: #watch

```shellsession
$ sass --error-css style.scss style.css
/* Error: Incompatible units em and px.
 *   ,
 * 1 | $width: 15px + 2em;
 *   |         ^^^^^^^^^^
 *   '
 *   test.scss 1:9  root stylesheet */

body::before {
  font-family: "Source Code Pro", "SF Mono", Monaco, Inconsolata, "Fira Mono",
      "Droid Sans Mono", monospace, monospace;
  white-space: pre;
  display: block;
  padding: 1em;
  margin-bottom: 1em;
  border-bottom: 2px solid black;
  content: "Error: Incompatible units em and px.\a   \2577 \a 1 \2502  $width: 15px + 2em;\a   \2502          ^^^^^^^^^^\a   \2575 \a   test.scss 1:9  root stylesheet";
}
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em;
  │         ^^^^^^^^^^
  ╵
  test.scss 1:9  root stylesheet
```

#### `--update`

{% compatibility 'dart: "1.4.0"' %}{% endcompatibility %}

If the `--update` flag is passed, Sass will only compile stylesheets whose
dependencies have been modified more recently than the corresponding CSS file
was generated. It will also print status messages when updating stylesheets.

```shellsession
$ sass --update themes:public/css
Compiled themes/light.scss to public/css/light.css.
```

### Source Maps

{% compatibility 'dart: "1.3.0"' %}{% endcompatibility %}

{% render 'doc_snippets/source-maps' %}

Dart Sass generates source maps by default for every CSS file it emits.

#### `--no-source-map`

If the `--no-source-map` flag is passed, Sass won't generate any source maps. it
cannot be passed along with other source map options.

```shellsession
$ sass --no-source-map style.scss style.css
```

#### `--source-map-urls`

This option controls how the source maps that Sass generates link back to the
Sass files that contributed to the generated CSS. Dart Sass supports two types
of URLs:

- `relative` (the default) uses relative URLs from the location of the source
  map file to the locations of the Sass source file.
- `absolute` uses the absolute [`file:` URLs][] of the Sass source files. Note
  that absolute URLs will only work on the same computer that the CSS was
  compiled.

[`file:` URLs]: https://en.wikipedia.org/wiki/File_URI_scheme

```shellsession
​# Generates a URL like "../sass/style.scss".
$ sass --source-map-urls=relative sass/style.scss css/style.css

​# Generates a URL like "file:///home/style-wiz/sassy-app/sass/style.scss".
$ sass --source-map-urls=absolute sass/style.scss css/style.css
```

#### `--embed-sources`

This flag tells Sass to embed the entire contents of the Sass files that
contributed to the generated CSS in the source map. This may produce very large
source maps, but it guarantees that the source will be available on any computer
no matter how the CSS is served.

```shellsession
$ sass --embed-sources sass/style.scss css.style.css
```

#### `--embed-source-map`

This flag tells Sass to embed the contents of the source map file in the
generated CSS, rather than creating a separate file and linking to it from the
CSS.

```shellsession
$ sass --embed-source-map sass/style.scss css.style.css
```

### Other Options

#### `--watch`

{% compatibility 'dart: "1.6.0"' %}{% endcompatibility %}

This flag (abbreviated `-w`) acts like the [`--update` flag][], but after the
first round compilation is done Sass stays open and continues compiling
stylesheets whenever they or their dependencies change.

[`--update` flag]: #update

Sass watches only the directories that you pass as-is on the command line,
parent directories of filenames you pass on the command line, and load paths. It
does not watch additional directories based on a file's `@import`/`@use`/
`@forward` rules.

```shellsession
$ sass --watch themes:public/css
Compiled themes/light.scss to public/css/light.css.

​# Then when you edit themes/dark.scss...
Compiled themes/dark.scss to public/css/dark.css.
```

#### `--poll`

{% compatibility 'dart: "1.8.0"' %}{% endcompatibility %}

This flag, which may only be passed along with `--watch`, tells Sass to manually
check for changes to the source files every so often instead of relying on the
operating system to notify it when something changes. This may be necessary if
you're editing Sass on a remote drive where the operating system's notification
system doesn't work.

```shellsession
$ sass --watch --poll themes:public/css
Compiled themes/light.scss to public/css/light.css.

​# Then when you edit themes/dark.scss...
Compiled themes/dark.scss to public/css/dark.css.
```

#### `--stop-on-error`

{% compatibility 'dart: "1.8.0"' %}{% endcompatibility %}

This flag tells Sass to stop compiling immediately when an error is detected,
rather than trying to compile other Sass files that may not contain errors. It's
mostly useful in [many-to-many mode][].

```shellsession
$ sass --stop-on-error themes:public/css
Error: Expected expression.
   ╷
42 │ h1 {font-face: }
   │                ^
   ╵
  themes/light.scss 42:16  root stylesheet
```

#### `--interactive`

{% compatibility 'dart: "1.5.0"' %}{% endcompatibility %}

This flag (abbreviated `-i`) tells Sass to run in interactive mode, where you
can write [SassScript expressions][] and see their results. Interactive mode
also supports [variables][] and [`@use` rules][].

[SassScript expressions]: /documentation/syntax/structure#expressions
[variables]: /documentation/variables
[`@use` rules]: /documentation/at-rules/use

```shellsession
$ sass --interactive
>> 1px + 1in
97px
>> @use "sass:map"
>> $map: ("width": 100px, "height": 70px)
("width": 100px, "height": 70px)
>> map.get($map, "width")
100px
```

#### `--color`

This flag (abbreviated `-c`) tells Sass to emit [terminal colors][], and the
inverse `--no-color` tells it not to emit colors. By default, it will emit
colors if it looks like it's being run on a terminal that supports them.

[terminal colors]: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors

<pre class="language-plaintext"><code>$ sass --color style.scss style.css
Error: Incompatible units em and px.
  <span style="color: blue">╷</span>
<span style="color: blue">1 │</span> $width: <span style="color: crimson">15px + 2em</span>
  <span style="color: blue">│</span>         <span style="color: crimson">^^^^^^^^^^</span>
  <span style="color: blue">╵</span>
  style.scss 1:9  root stylesheet

$ sass --no-color style.scss style.css
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em
  │         ^^^^^^^^^^
  ╵
  style.scss 1:9  root stylesheet</code></pre>

#### `--no-unicode`

{% compatibility 'dart: "1.17.0"' %}{% endcompatibility %}

This flag tells Sass only to emit ASCII characters to the terminal as part of
error messages. By default, or if `--unicode` is passed, Sass will emit non-ASCII
characters for these messages. This flag does not affect the CSS output.

```shellsession
$ sass --no-unicode style.scss style.css
Error: Incompatible units em and px.
  ,
1 | $width: 15px + 2em;
  |         ^^^^^^^^^^
  '
  test.scss 1:9  root stylesheet

$ sass --unicode style.scss style.css
Error: Incompatible units em and px.
  ╷
1 │ $width: 15px + 2em;
  │         ^^^^^^^^^^
  ╵
  test.scss 1:9  root stylesheet
```

#### `--quiet`

This flag (abbreviated `-q`) tells Sass not to emit any warnings when compiling.
By default, Sass emits warnings when deprecated features are used or when the
[`@warn` rule][] is encountered. It also silences the [`@debug` rule][].

[`@warn` rule]: /documentation/at-rules/warn
[`@debug` rule]: /documentation/at-rules/debug

```shellsession
$ sass --quiet style.scss style.css
```

#### `--quiet-deps`

This flag tells Sass not to emit deprecation warnings that come from
dependencies. It considers any file that's transitively imported through a [load
path] to be a "dependency". This flag doesn't affect the [`@warn` rule] or the
[`@debug` rule].

```shellsession
$ sass --load-path=node_modules --quiet-deps style.scss style.css
```

#### `--fatal-deprecation`

{% compatibility 'dart: "1.59.0"' %}{% endcompatibility %}

This option tells Sass to treat a particular type of deprecation warning as
an error. For example, this command tells Sass to treat deprecation
warnings for `/`-as-division as errors:

```shellsession
$ sass --fatal-deprecation=slash-div style.scss style.css
Error: Using / for division outside of calc() is deprecated and will be removed in Dart Sass 2.0.0.

Recommendation: math.div(4, 2) or calc(4 / 2)

More info and automated migrator: /documentation/breaking-changes/slash-div

This is only an error because you've set the slash-div deprecation to be fatal.
Remove this setting if you need to keep using this feature.
  ╷
1 │ a { b: (4/2); }
  │         ^^^
  ╵
  style.scss 1:9  root stylesheet
```

The following deprecation IDs can be passed to this option:

<table style="width:100%">
<thead>
  <tr style="text-align: left">
    <th>ID</th>
    <th>Version</th>
    <th>Description</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><code>call-string</code></td>
    <td>0.0.0</td>
    <td>Passing a string directly to <code>meta.call()</code>.</td>
  </tr>
  <tr>
    <td><code>elseif</code></td>
    <td>1.3.2</td>
    <td>Using <code>@elseif</code> instead of <code>@else if</code>.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/moz-document"><code>moz-document</code></a></td>
    <td>1.7.2</td>
    <td>Using <code>@-moz-document</code> (except for the empty url prefix hack).</td>
  </tr>
  <tr>
    <td><code>new-global</code></td>
    <td>1.17.2</td>
    <td>Declaring new variables with <code>!global</code>.</td>
  </tr>
  <tr>
    <td><code>color-module-compat</code></td>
    <td>1.23.0</td>
    <td>Using color module functions in place of plain CSS functions.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/slash-div"><code>slash-div</code></a></td>
    <td>1.33.0</td>
    <td>Using the <code>/</code> operator for division.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/bogus-combinators"><code>bogus-combinators</code></a></td>
    <td>1.54.0</td>
    <td>Leading, trailing, and repeated combinators.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/strict-unary"><code>strict-unary</code></a></td>
    <td>1.55.0</td>
    <td>Ambiguous <code>+</code> and <code>-</code> operators.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/function-units"><code>function-units</code></a></td>
    <td>1.56.0</td>
    <td>Passing invalid units to built-in functions.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/duplicate-var-flags"><code>duplicate-var-flags</code></a></td>
    <td>1.62.0</td>
    <td>Using multiple copies of <code>!global</code> or <code>!default</code> in a single variable declaration.</td>
  </tr>
  <tr>
    <td><a href="/documentation/breaking-changes/abs-percent"><code>abs-percent</code></a></td>
    <td>1.65.0</td>
    <td>Passing percentages to the Sass <code>abs()</code> function.</td>
  </tr>
  <tr>
    <td><code>fs-importer-cwd</code></td>
    <td>1.73.0</td>
    <td>Using the current working directory as an implicit load path.</td>
  </tr>
</tbody>
</table>

Alternatively, you can pass a Dart Sass version to treat all deprecations that
were present in that version as errors. For example,
`--fatal-deprecation=1.33.0` would treat all deprecations in the
table above up to and including `slash-div` as errors, but leave any newer
deprecations as warnings.

#### `--future-deprecation`

{% compatibility 'dart: "1.59.0"' %}{% endcompatibility %}

This option tells Sass to opt-in to a future type of deprecation warning
early, emitting warnings even though the deprecation is not yet active. This
option can be combined with `--fatal-deprecation` to emit errors instead of
warnings for a future deprecation.

The only currently available future deprecation type is `import`, as seen
here:

```shellsession
$ sass --future-deprecation=import style.scss style.css
Deprecation Warning on line 1, column 9 of style.scss:
Sass @import rules will be deprecated in the future.
Remove the --future-deprecation=import flag to silence this warning for now.
  ╷
1 │ @import 'dependency';
  │         ^^^^^^^^^^^^
  ╵
```

#### `--silence-deprecation`

{% compatibility 'dart: "1.74.0"' %}{% endcompatibility %}

This option tells Sass to silence a particular type of deprecation warning if
you wish to temporarily ignore the deprecation. Any of the deprecations listed
in the `--fatal-deprecation` section above can be passed here, though passing
in a version is not supported.

```shellsession
$ sass --silence-deprecation=slash-div style.scss style.css
```

#### `--trace`

This flag tells Sass to print the full Dart or JavaScript stack trace when an
error is encountered. It's used by the Sass team for debugging errors.

```shellsession
$ sass --trace style.scss style.css
Error: Expected expression.
   ╷
42 │ h1 {font-face: }
   │                ^
   ╵
  themes/light.scss 42:16  root stylesheet

package:sass/src/visitor/evaluate.dart 1846:7                        _EvaluateVisitor._addExceptionSpan
package:sass/src/visitor/evaluate.dart 1128:12                       _EvaluateVisitor.visitBinaryOperationExpression
package:sass/src/ast/sass/expression/binary_operation.dart 39:15     BinaryOperationExpression.accept
package:sass/src/visitor/evaluate.dart 1097:25                       _EvaluateVisitor.visitVariableDeclaration
package:sass/src/ast/sass/statement/variable_declaration.dart 50:15  VariableDeclaration.accept
package:sass/src/visitor/evaluate.dart 335:13                        _EvaluateVisitor.visitStylesheet
package:sass/src/visitor/evaluate.dart 323:5                         _EvaluateVisitor.run
package:sass/src/visitor/evaluate.dart 81:10                         evaluate
package:sass/src/executable/compile_stylesheet.dart 59:9             compileStylesheet
package:sass/src/executable.dart 62:15                               main
```

#### `--help`

This flag (abbreviated `-h`) prints a summary of this documentation.

```shellsession
$ sass --help
Compile Sass to CSS.

Usage: sass <input.scss> [output.css]
       sass <input.scss>:<output.css> <input/>:<output/>

...
```

#### `--version`

This flag prints the current version of Sass.

```shellsession
$ sass --version
{{ releases['dart-sass'].version }}
```

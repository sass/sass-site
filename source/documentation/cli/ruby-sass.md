---
title: Ruby Sass Command-Line Interface
table_of_contents: true
---

{% headsUp %}
  [Ruby Sass has reached end of life][] and is now totally unmaintained. Please
  switch to [Dart Sass][] or [LibSass][] at your earliest convenience.

  [Ruby Sass has reached end of life]: /blog/ruby-sass-is-unsupported
  [Dart Sass]: /dart-sass
  [LibSass]: /libsass
{% endheadsUp %}

## Usage

The Ruby Sass executable can be invoked in one of two modes.

### One-to-One Mode

```shellsession
sass [input.scss] [output.css]
```

One-to-one mode compiles a single input file (`input.scss`) to a single output
location (`output.css`). If no output location is passed, the compiled CSS is
printed to the terminal. If no input _or_ output is passed, the CSS is read from
[standard input][] and printed to the terminal.

[standard input]: https://en.wikipedia.org/wiki/Standard_streams#Standard_input_(stdin)

The input file is parsed as [SCSS][] if its extension is `.scss` or as the
[indented syntax][] if its extension is `.sass`. If it doesn't have one of these
two extensions, or if it comes from standard input, it's parsed as the
indented syntax by default. This can be controlled with the [`--scss` flag][].

[SCSS]: /documentation/syntax#scss
[indented syntax]: /documentation/syntax#the-indented-syntax
[`--scss` flag]: #scss

### Many-to-Many Mode

```shellsession
sass [<input.css>:<output.css>] [<input/>:<output/>] [input.css] [input/]...
```

Many-to-many mode compiles one or more input files to one or more output files.
The inputs are separated from the outputs with colons. It can also compile all
Sass files in a directory to CSS files with the same names in another directory.
Many-to-many mode is enabled when any argument contains a colon, _or_ when the
[`--update` flag][] or the [`--watch` flag][] is passed.

[`--update` flag]: #update
[`--watch` flag]: #watch

If an input file is passed without a corresponding output file, it's compiled to
a CSS file named after the input file, but with the extension replaced with
`.css`. If an input directory is passed without a corresponding output
directory, all the Sass files within it are compiled to CSS files in the same
directory.

```shellsession
$ sass style.scss:style.css
      write style.css
      write style.css.map
$ sass light.scss:light.css dark.scss:dark.css
      write light.css
      write light.css.map
      write dark.css
      write dark.css.map
$ sass themes:public/css
      write public/css/light.css
      write public/css/light.css.map
      write public/css/dark.css
      write public/css/dark.css.map
```

When compiling whole directories, Sass will ignore [partial files][] whose names
begin with `_`. You can use partials to separate out your stylesheets without
creating a bunch of unnecessary output files.

[partial files]: /documentation/at-rules/use/#partials

Many-to-many mode will only compile stylesheets whose dependencies have been
modified more recently than the corresponding CSS file was generated. It will
also print status messages when updating stylesheets.

## Options

### Common

#### `--load-path`

This option (abbreviated `-I`) adds an additional [load path][] for Sass to look
for stylesheets. It can be passed multiple times to provide multiple load paths.
Earlier load paths will take precedence over later ones.

[load path]: /documentation/at-rules/use#load-paths

```shellsession
$ sass --load-path=node_modules/bootstrap/dist/css style.scss style.css
```

Load paths are also loaded from the `SASS_PATH` [environment variable][], if
it's set. This variable should be a list of paths separated by `;` (on Windows)
or `:` (on other operating systems). Load paths on `SASS_PATH` take precedence
over load paths passed on the command line.

[environment variable]: https://en.wikipedia.org/wiki/Environment_variable

```shellsession
$ SASS_PATH=node_modules/bootstrap/dist/css sass style.scss style.css
```

#### `--require`

This option (abbreviated `-r`) loads a [Ruby gem][] before running Sass. It can
be used to load functions defined in Ruby into your Sass environment.

[Ruby gem]: https://rubygems.org/

```shellsession
$ sass --require=rails-sass-images style.scss style.css
```

#### `--compass`

This flag loads the [Compass framework][] and makes its mixins and functions
available for use in Sass.

[Compass framework]: http://compass-style.org/

```shellsession
$ sass --compass style.scss style.css
```

#### `--style`

This option (abbreviated `-t`) controls the output style of the resulting CSS.
Ruby Sass supports four output styles:

- `nested` (the default) indents CSS rules to match the nesting of the Sass
  source.
- `expanded` writes each selector and declaration on its own line.
- `compact` puts each CSS rule on its own single line.
- `compressed` removes as many extra characters as possible, and writes the
  entire stylesheet on a single line.

```shellsession
$ sass --style=nested
h1 {
  font-size: 40px; }
  h1 code {
    font-face: Roboto Mono; }

$ sass --style=expanded style.scss
h1 {
  font-size: 40px;
}
h1 code {
  font-face: Roboto Mono;
}

$ sass --style=compact style.scss
h1 { font-size: 40px; }
h1 code { font-face: Roboto Mono; }

$ sass --style=compressed style.scss
h1{font-size:40px}h1 code{font-face:Roboto Mono}
```

#### `--help`

This flag (abbreviated `-h` and `-?`) prints a summary of this documentation.

```shellsession
$ sass --help
Usage: sass [options] [INPUT] [OUTPUT]

Description:
  Converts SCSS or Sass files to CSS.

...
```

#### `--version`

This flag prints the current version of Sass.

```shellsession
$ sass --version
Sass 3.7.4
```

### Watching and Updating

These options affect [many-to-many mode][].

[many-to-many mode]: #many-to-many-mode

#### `--watch`

Enables [many-to-many mode][], and causes Sass to stay open and continue
compiling stylesheets whenever they or their dependencies change.

```shellsession
$ sass --watch themes:public/css
      write public/css/light.css
      write public/css/light.css.map

​# Then when you edit themes/dark.scss...
      write public/css/dark.css
      write public/css/dark.css.map
```

#### `--poll`

This flag, which may only be passed along with `--watch`, tells Sass to manually
check for changes to the source files every so often instead of relying on the
operating system to notify it when something changes. This may be necessary if
you're editing Sass on a remote drive where the operating system's notification
system doesn't work.

```shellsession
$ sass --watch --poll themes:public/css
      write public/css/light.css
      write public/css/light.css.map

​# Then when you edit themes/dark.scss...
      write public/css/dark.css
      write public/css/dark.css.map
```

#### `--update`

This flag enables [many-to-many mode][], even if none of the arguments are
colon-separated pairs.

```shellsession
$ sass --update style.scss
      write style.css
      write style.css.map
```

#### `--force`

This flag (abbreviated `-f`) may only be passed in [many-to-many mode][]. It
causes Sass files to _always_ be compiled to CSS files, instead of only being
compiled when the source files are more up-to-date than the output.

The `--force` flag may not be passed alongside the [`--watch` flag][].

```shellsession
$ sass --force style.scss:style.css
      write style.css
      write style.css.map
```

#### `--stop-on-error`

This flag may only be passed in [many-to-many mode][]. It tells Sass to stop
compiling immediately when an error is detected, rather than trying to compile
other Sass files that may not contain errors.

```shellsession
$ sass --stop-on-error themes:public/css
Error: Invalid CSS after "h1 {font-size: ": expected expression (e.g. 1px, bold), was "}"
        on line 1 of test.scss
  Use --trace for backtrace.
```

### Input and Output

These options control how Sass loads its input files and how it produces output
files.

#### `--scss`

This flag tells Sass to parse [standard input][] as [SCSS][].

```shellsession
$ echo "h1 {font-size: 40px}" | sass --scss
h1 {
  font-size: 40px;
}
```

#### `--sourcemap`

This option controls how Sass generates source maps, which are files that tell
browsers or other tools that consume CSS how that CSS corresponds to the Sass
files from which it was generated. They make it possible to see and even edit
your Sass files in browsers. See instructions for using source maps in
[Chrome][] and [Firefox][]. It has four possible values:

[Chrome]: https://developers.google.com/web/tools/chrome-devtools/javascript/source-maps
[Firefox]: https://developer.mozilla.org/en-US/docs/Tools/Style_Editor#Source_map_support

- `auto` (the default) uses relative URLs to link from the source map to the
  Sass stylesheets where possible, and absolute [`file:` URLs][] otherwise.
- `file` always uses absolute absolute `file:` URLs to link from the source map
  to the Sass stylesheets.
- `inline` includes the text of the Sass stylehseets in the source map directly.
- `none` doesn't generate source maps at all.

[`file:` URLs]: https://en.wikipedia.org/wiki/File_URI_scheme

```shellsession
​# Generates a URL like "../sass/style.scss".
$ sass --sourcemap=auto sass/style.scss css/style.css

​# Generates a URL like "file:///home/style-wiz/sassy-app/sass/style.scss".
$ sass --sourcemap=file sass/style.scss css/style.css

​# Includes the full text of sass/style.scss in the source map.
$ sass --sourcemap=inline sass/style.scss css/style.css

​# Doesn't generate a source map.
$ sass --sourcemap=none sass/style.scss css/style.css
```

#### `--stdin`

This flag (abbreviated `-s`) is tells Sass to read its input file from [standard
input][]. When it's passed, no input file may be passed.

```shellsession
$ echo -e 'h1\n  font-size: 40px' | sass --stdin
h1 {
  font-size: 40px;
}
```

The `--stdin` flag may not be used with [many-to-many mode][].

#### `--default-encoding`

This option (abbreviated `-E`) controls the default [character encoding][] that
Sass will use to load source files that don't [explicitly specify][] a character
encoding. It defaults to the operating system's default encoding.

[character encoding]: https://en.wikipedia.org/wiki/Character_encoding
[explicitly specify]: /documentation/syntax/parsing#input-encoding

```shellsession
$ sass --default-encoding=Shift-JIS style.scss style.css
```

#### `--unix-newlines`

This flag tells Sass to generate output files with whose lines are separated
with the U+000A LINE FEED character, as opposed to the operating system default
(on Windows, this is U+000D CARRIAGE RETURN followed by U+000A LINE FEED). It's
always true on systems that default to Unix-style newlines.

```shellsession
$ sass --unix-newlines style.scss style.css
```

#### `--debug-info`

This flag (abbreviated `-g`) causes Sass to emit dummy `@media` queries that
indicate where each style rule was defined in the source stylehseet.

{% headsUp %}
  This flag only exists for backwards-compatibility. Source maps are now the
  recommended way of mapping CSS back to the Sass that generated it.
{% endheadsUp %}

```shellsession
$ sass --debug-info style.scss
@media -sass-debug-info{filename{font-family:file\:\/\/\/home\/style-wiz\/sassy-app\/style\.scss}line{font-family:\000031}}
h1 {
  font-size: 40px; }
```

#### `--line-comments`

This flag (also available as `--line-numbers`, abbreviated as `-l`) causes Sass
to emit comments for every style rule that indicate where each style rule was
defined in the source stylesheet.

```shellsession
$ sass --line-numbers style.scss
/* line 1, style.scss */
h1 {
  font-size: 40px; }
```

### Other Options

#### `--interactive`

This flag (abbreviated `-i`) tells Sass to run in interactive mode, where you
can write [SassScript expressions][] and see their results. Interactive mode
also supports [variables][].

[SassScript expressions]: /documentation/syntax/structure#expressions
[variables]: /documentation/variables

```shellsession
$ sass --interactive
>> 1px + 1in
97px
>> $map: ("width": 100px, "height": 70px)
("width": 100px, "height": 70px)
>> map-get($map, "width")
100px
```

#### `--check`

This flag (abbreviated `-c`) tells Sass to verify that the syntax of its input
file is valid without executing that file. If the syntax is valid, it exits with
[status][] 0. It can't be used in [many-to-many mode][].

[status]: https://en.wikipedia.org/wiki/Exit_status

```shellsession
$ sass --check style.scss
```

#### `--precision`

This option tells Sass how many digits of [precision][] to use when emitting
decimal numbers.

[precision]: /documentation/values/numbers#precision

```shellsession
$ echo -e 'h1\n  font-size: (100px / 3)' | sass --precision=20
h1 {
  font-size: 33.333333333333336px; }
```

#### `--cache-location`

This option tells Sass where to store its cache of parsed files, so it can
run faster in future invocations. It defaults to `.sass-cache`.

```shellsession
$ sass --cache-location=/tmp/sass-cache style.scss style.css
```

#### `--no-cache`

This flag (abbreviated `-C`) tells Sass not to cache parsed files at all.

```shellsession
$ sass --no-cache style.scss style.css
```

#### `--trace`

This flag tells Sass to print the full Ruby stack trace when an error is
encountered. It's used by the Sass team for debugging errors.

```shellsession
Traceback (most recent call last):
        25: from /usr/share/gems/sass/bin/sass:13:in `<main>'
        24: from /usr/share/gems/sass/lib/sass/exec/base.rb:18:in `parse!'
        23: from /usr/share/gems/sass/lib/sass/exec/base.rb:50:in `parse'
        22: from /usr/share/gems/sass/lib/sass/exec/sass_scss.rb:63:in `process_result'
        21: from /usr/share/gems/sass/lib/sass/exec/sass_scss.rb:396:in `run'
        20: from /usr/share/gems/sass/lib/sass/engine.rb:290:in `render'
        19: from /usr/share/gems/sass/lib/sass/engine.rb:414:in `_to_tree'
        18: from /usr/share/gems/sass/lib/sass/scss/parser.rb:41:in `parse'
        17: from /usr/share/gems/sass/lib/sass/scss/parser.rb:137:in `stylesheet'
        16: from /usr/share/gems/sass/lib/sass/scss/parser.rb:697:in `block_contents'
        15: from /usr/share/gems/sass/lib/sass/scss/parser.rb:707:in `block_child'
        14: from /usr/share/gems/sass/lib/sass/scss/parser.rb:681:in `ruleset'
        13: from /usr/share/gems/sass/lib/sass/scss/parser.rb:689:in `block'
        12: from /usr/share/gems/sass/lib/sass/scss/parser.rb:697:in `block_contents'
        11: from /usr/share/gems/sass/lib/sass/scss/parser.rb:708:in `block_child'
        10: from /usr/share/gems/sass/lib/sass/scss/parser.rb:743:in `declaration_or_ruleset'
         9: from /usr/share/gems/sass/lib/sass/scss/parser.rb:820:in `try_declaration'
         8: from /usr/share/gems/sass/lib/sass/scss/parser.rb:1281:in `rethrow'
         7: from /usr/share/gems/sass/lib/sass/scss/parser.rb:807:in `block in try_declaration'
         6: from /usr/share/gems/sass/lib/sass/scss/parser.rb:999:in `value!'
         5: from /usr/share/gems/sass/lib/sass/scss/parser.rb:1161:in `sass_script'
         4: from /usr/share/gems/sass/lib/sass/script/parser.rb:68:in `parse'
         3: from /usr/share/gems/sass/lib/sass/script/parser.rb:855:in `assert_expr'
         2: from /usr/share/gems/sass/lib/sass/script/lexer.rb:240:in `expected!'
         1: from /usr/share/gems/sass/lib/sass/scss/parser.rb:1305:in `expected'
test.scss:1: Invalid CSS after "h1 {font-size: ": expected expression (e.g. 1px, bold), was "}" (Sass::SyntaxError)
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

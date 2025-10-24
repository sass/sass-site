---
layout: has_no_sidebars
title: LibSass
introduction: >
  LibSass was an implementation of Sass in C/C++, designed to be easy to
  integrate into many different languages. However, as time wore on it ended up
  lagging behind [Dart Sass](/dart-sass) in features and CSS compatibility. It
  reached its end of life in October 2025. any legacy projects still using
  LibSass or its wrapper libraries like Node Sass should migrate to
  [Dart Sass](/dart-sass).
---

## Migrating Away

LibSass stopped receiving feature updates before Dart Sass even launched, and it
had a number of known incompatibilities with the Sass specification. Since then,
Sass has grown and evolved to support the latest CSS features, so projects still
using LibSass will unfortunately have some serious catching up to do.

The following are the biggest known differences:

* LibSass only supports [`@import`] for loading files. Although Dart Sass
  versions through the 2.x will continue to support `@import`, it's deprecated
  in recent versions, and we recommend all code move to [`@use`] instead. The
  [Sass migrator] can automatically migrate projects from `@import` to `@use`.
  See [/d/import] for details.

  [`@import`]: /documentation/at-rules/import
  [`@use`]: /documentation/at-rules/use
  [Sass migrator]: /documentation/cli/migrator
  [/d/import]: /d/import

* LibSass uses `/` for division. Dart Sass 1.x does as well, but Dart Sass 2.x
  will use it as a list separator, so using it for division is deprecated. The
  [Sass migrator] can automatically migrate projects from `/` to the new
  [`math.div()`] function. See [/d/slash-div] for details.

  [`math.div()`]: /documentation/modules/math#div
  [/d/slash-div]: /d/slash-div

* LibSass parses custom properties like any other CSS property. Dart Sass parses
  them the same way it parses at-rules, as plain CSS except where SassScript is
  injected using interpolation. See [/d/css-vars] for details.

  [/d/css-vars]: /d/css-vars

* LibSass supports [`@extend`] rules with complex selector targets, like
  `@extend .foo.bar`, using semantics that don't match the way `@extend` is
  defined to work. These are not supported in Dart Sass. See
  [/d/extend-compound] for details.

  [`@extend`]: /documentation/at-rules/extend
  [/d/extend-compound]: /d/extend-compound

## Wrappers

LibSass was just a library. To run the code locally (i.e. to compile your
stylesheets), you also needed a wrapper. Below are the LibSass wrappers that
we're aware of having excited. Sometimes there are multiple wrappers per
language—in those cases, we put the most recently-updated wrapper first.

{% headsUp %}
  Like LibSass, these wrappers are end-of-life. They may not have compiled
  versions that are up-to-date with the most recent LibSass release from its
  sundown window.
{% endheadsUp %}

- <h3 id="sassc">Sass C</h3>

  [SassC](https://github.com/sass/sassc) (get it?) is a wrapper written in C.

  To run the compiler on your local machine, you need to build SassC. To build
  SassC, you must have either a local copy of the LibSass source or it must be
  installed into your system. For development, please use the source version.
  You must then setup an environment variable pointing to the LibSass folder,
  for example:

  ```shellsession
  export SASS_LIBSASS_PATH=/Users/hampton/path/libsass
  ```

  The executable will be in the bin folder. To run it, try something like:

  ```shellsession
  ./bin/sassc [input file] > output.css
  ```

- <h3 id="crystal">Crystal</h3>

  [sass.cr](https://github.com/straight-shoota/sass.cr) is a LibSass wrapper for
  the [Crystal programming language](https://crystal-lang.org/).

- <h3 id="go">Go</h3>

  [go-libsass](https://github.com/wellington/go-libsass) has the most active
  GoLang wrapper. [gosass](https://github.com/moovweb/gosass) is another LibSass
  wrapper.

  [C6](https://github.com/c9s/c6) is a Sass 3.2 compatible implementation
  written in pure GoLang that aims to extend Sass.
  [wellington/sass](https://github.com/wellington/sass) is an in-progress pure
  Go Sass lexer, parser, and compiler.

- <h3 id="java">Java</h3>

  There is one Java wrapper --- [jsass](https://github.com/bit3/jsass). There is
  also a plugin for Maven --- [LibSass Maven
  plugin](https://gitlab.com/haynes/libsass-maven-plugin).

- <h3 id="javascript">JavaScript</h3>

  The [sass.js](https://github.com/medialize/sass.js) project makes LibSass
  available as pure JavaScript. There's a way to [test it in the
  browser](https://sass.js.org/), too.

- <h3 id="lua">Lua</h3>

  The Lua wrapper is found at
  [lua-sass](https://github.com/craigbarnes/lua-sass).

- <h3 id="net">.NET</h3>

  [LibSass Host](https://github.com/Taritsyn/LibSassHost) is updated regularly,
  and is probably the best bet. There's also
  [libsass-net](https://github.com/sass/libsass-net) or
  [NSass](https://github.com/TBAPI-0KA/NSass), although they haven't been
  updated in a while.

- <h3 id="node">Node</h3>

  The [node-sass](https://github.com/sass/node-sass) project has proven to be
  popular, and we've taken it into the main Sass GitHub repo. Check out its
  package page [here](https://www.npmjs.com/package/node-sass), and [there's a
  dedicated twitter account](https://twitter.com/nodesass) for updates.

- <h3 id="perl">Perl</h3>

  The [CSS::Sass](https://github.com/sass/perl-libsass) project is updated
  regularly. There's the [Text-Sass-XS](https://github.com/ysasaki/Text-Sass-XS)
  project, too, although it hasn't been updated in a while.

- <h3 id="php">PHP</h3>

  The [SassPHP](https://github.com/absalomedia/sassphp) project is an updated
  fork of an [older PHP version](https://github.com/jamierumbelow/sassphp).

- <h3 id="python">Python</h3>

  The [libsass-python](https://github.com/sass/libsass-python) project is
  updated regularly. There are more details on [its own
  website](https://sass.github.io/libsass-python/).

  Three other Python projects,
  [python-scss](https://github.com/pistolero/python-scss),
  [pylibsass](https://github.com/rsenk330/pylibsass) and
  [SassPython](https://github.com/marianoguerra/SassPython), haven't been
  updated in a while.

- <h3 id="ruby">Ruby</h3>

  LibSass has also been ported back into Ruby for the
  [sassc-ruby](https://github.com/sass/sassc-ruby) project.

- <h3 id="r">R</h3>

  The [R](https://www.r-project.org/) [Sass
  package](https://github.com/rstudio/sass) wraps LibSass with additional
  caching and bundling methods. [Extended
  documentation](https://rstudio.github.io/sass/).

- <h3 id="rust">Rust</h3>

  The [`sass_rs`](https://github.com/compass-rs/sass-rs) crate is a LibSass
  wrapper and is updated regularly.

- <h3 id="scala">Scala</h3>

  The only Scala project, [Sass-Scala](https://github.com/kkung/Sass-Scala),
  hasn't been updated in a couple of years.

## About LibSass

This project was the brainchild of [Hampton
Lintorn-Catlin](https://twitter.com/HamptonMakes), the original creator of Sass.
[Aaron Leung](https://github.com/akhleung) was the initial primary developer,
and [Michael Mifsud](https://github.com/xzyfer) and [Marcel
Greter](https://github.com/mgreter) were the primary developers for its latter
years.

<figure>
  <img alt="LibSass logo" width="640" height="320" src="/assets/img/logos/libsass.png">
</figure>


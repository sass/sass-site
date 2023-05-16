---
layout: has_both_sidebars
title: LibSass
introduction: >
  LibSass is an implementation of Sass in C/C++, designed to be easy to
  integrate into many different languages. However, as time wore on it ended up
  lagging behind [Dart Sass](/dart-sass) in features and CSS compatibility.
  **LibSass is now deprecated**—new projects should use Dart Sass instead.
navigation: |
  ## Wrappers

  <nav class="sl-c-list-navigation-wrapper">

  - [SassC](#sass-c)
  - [Crystal](#crystal)
  - [Go](#go)
  - [Java](#java)
  - [JavaScript](#javascript)
  - [Lua](#lua)
  - [.NET](#.net)
  - [Node](#node)
  - [Perl](#perl)
  - [PHP](#php)
  - [Python](#python)
  - [Ruby](#ruby)
  - [R](#r)
  - [Rust](#rust)
  - [Scala](#scala)

  </nav>
complementary_content: |
  ## Resources

  - [Lightning fast Sass compiling with libsass, Node-sass and
    Grunt-sass](https://benfrain.com/lightning-fast-sass-compiling-with-libsass-node-sass-and-grunt-sass/)
    --- by Ben Frain, August 2013
  - [Node, Express and
    libSass](https://anotheruiguy.gitbooks.io/nodeexpreslibsass_from-scratch/content/index.html)
    --- Node, Express and libSass: a project from scratch workshop
---

## Wrappers

LibSass is just a library. To run the code locally (i.e. to compile your
stylesheets), you need an implementer, or "wrapper". There are a number of other
wrappers for LibSass. We encourage you to write your own wrapper --- the whole
point of LibSass is that we want to bring Sass to many other languages, not just
Ruby!

Below are the LibSass wrappers that we're currently aware of. Sometimes there
are multiple wrappers per language -- in those cases, we put the most
recently-updated wrapper first.

- ### Sass C

  [SassC](https://github.com/sass/sassc) (get it?) is a wrapper written in C.

  To run the compiler on your local machine, you need to build SassC. To build
  SassC, you must have either a local copy of the LibSass source or it must be
  installed into your system. For development, please use the source version.
  You must then setup an environment variable pointing to the LibSass folder,
  for example:

  ```shell
  export SASS_LIBSASS_PATH=/Users/hampton/path/libsass
  ```

  The executable will be in the bin folder. To run it, try something like:

  ```shell
  ./bin/sassc [input file] > output.css
  ```

- ### Crystal

  [sass.cr](https://github.com/straight-shoota/sass.cr) is a LibSass wrapper for
  the [Crystal programming language](https://crystal-lang.org/).

- ### Go

  [go-libsass](https://github.com/wellington/go-libsass) has the most active
  GoLang wrapper. [gosass](https://github.com/moovweb/gosass) is another LibSass
  wrapper.

  [C6](https://github.com/c9s/c6) is a Sass 3.2 compatible implementation
  written in pure GoLang that aims to extend Sass.
  [wellington/sass](https://github.com/wellington/sass) is an in-progress pure
  Go Sass lexer, parser, and compiler.

- ### Java

  There is one Java wrapper --- [jsass](https://github.com/bit3/jsass). There is
  also a plugin for Maven --- [LibSass Maven
  plugin](https://gitlab.com/haynes/libsass-maven-plugin).

- ### JavaScript

  The [sass.js](https://github.com/medialize/sass.js) project makes LibSass
  available as pure JavaScript. There's a way to [test it in the
  browser](https://sass.js.org/), too.

- ### Lua

  The Lua wrapper is found at
  [lua-sass](https://github.com/craigbarnes/lua-sass).

- ### .NET

  [LibSass Host](https://github.com/Taritsyn/LibSassHost) is updated regularly,
  and is probably the best bet. There's also
  [libsass-net](https://github.com/sass/libsass-net) or
  [NSass](https://github.com/TBAPI-0KA/NSass), although they haven't been
  updated in a while.

- ### Node

  The [node-sass](https://github.com/sass/node-sass) project has proven to be
  popular, and we've taken it into the main Sass GitHub repo. Check out its
  package page [here](https://www.npmjs.com/package/node-sass), and [there's a
  dedicated twitter account](https://twitter.com/nodesass) for updates.

- ### Perl

  The [CSS::Sass](https://github.com/sass/perl-libsass) project is updated
  regularly. There's the [Text-Sass-XS](https://github.com/ysasaki/Text-Sass-XS)
  project, too, although it hasn't been updated in a while.

- ### PHP

  The [SassPHP](https://github.com/absalomedia/sassphp) project is an updated
  fork of an [older PHP version](https://github.com/jamierumbelow/sassphp).

- ### Python

  The [libsass-python](https://github.com/sass/libsass-python) project is
  updated regularly. There are more details on [its own
  website](https://sass.github.io/libsass-python/).

  Three other Python projects,
  [python-scss](https://github.com/pistolero/python-scss),
  [pylibsass](https://github.com/rsenk330/pylibsass) and
  [SassPython](https://github.com/marianoguerra/SassPython), haven't been
  updated in a while.

- ### Ruby

  LibSass has also been ported back into Ruby for the
  [sassc-ruby](https://github.com/sass/sassc-ruby) project.

- ### R

  The [R](https://www.r-project.org/) [Sass
  package](https://github.com/rstudio/sass) wraps LibSass with additional
  caching and bundling methods. [Extended
  documentation](https://rstudio.github.io/sass/).

- ### Rust

  The [`sass_rs`](https://github.com/compass-rs/sass-rs) crate is a LibSass
  wrapper and is updated regularly.

- ### Scala

  The only Scala project, [Sass-Scala](https://github.com/kkung/Sass-Scala),
  hasn't been updated in a couple of years.

## About LibSass

This project is the brainchild of [Hampton
Lintorn-Catlin](https://twitter.com/HamptonMakes), the original creator of Sass.
[Aaron Leung](https://github.com/akhleung) is the primary developer.

<figure>
  <img alt="LibSass logo" width="640" height="320" src="/assets/img/logos/libsass.png">
</figure>

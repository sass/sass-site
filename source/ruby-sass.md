---
layout: has_no_sidebars
title: Ruby Sass
introduction: >
  Ruby Sass was the original implementation of Sass, but it reached its end of
  life as of 26 March 2019. It's no longer supported, and Ruby Sass users should
  migrate to another implementation.
---

- <h2>But Why?</h2>

  When Natalie and Hampton first created Sass in 2006, Ruby was the language at
  the cutting edge of web development, the basis of their already-successful
  [Haml][] templating language, and the language they used most in their
  day-to-day work. Writing Sass in Ruby made it readily available to their
  existing users and the whole booming Ruby ecosystem.

  [Haml]: https://haml.info/

  Since then, Node.js has become ubiquitous for frontend tooling while Ruby has
  faded into the background. At the same time, Sass projects have grown far
  larger than we initially envisioned them, and their performance needs have
  outpaced the speed Ruby can provide. Both [Dart Sass][] and [LibSass][] are
  blazing fast, easy to install, and are readily available on npm. Ruby Sass
  couldn't keep up, and it didn't make sense to spend the core team's resources
  on it any longer.

  [Dart Sass]: /dart-sass
  [LibSass]: /libsass

- <h2>Migrating Away</h2>

  If you run Ruby Sass using the command-line `sass` executable, all you need to
  do is install Dart Sass's [command-line executable][install] instead. The
  interface isn't identical, but most options work the same way.

  [install]: /install

  If you use the `sass` gem as a library, the [`sass-embedded`][] gem is the
  recommended way to move away from Ruby Sass. It bundles the Dart Sass
  command-line executable, and uses the [Embedded Sass Protocol][] to provide a Ruby
  API for compiling Sass and defining custom importers and functions. You can also
  use the [`dartsass-rails`][] or [`dartsass-sprockets`][] gem to plug smoothly into
  Ruby on Rails.

  [`sass-embedded`]: https://rubygems.org/gems/sass-embedded
  [Embedded Sass Protocol]: https://github.com/sass/sass/blob/HEAD/spec/embedded-protocol.md
  [`dartsass-rails`]: https://rubygems.org/gems/dartsass-rails
  [`dartsass-sprockets`]: https://rubygems.org/gems/dartsass-sprockets

  Alternately, if you're using a JS build system, you can integrate that with
  [Dart Sass][] as a JavaScript library.

  [Dart Sass]: /dart-sass

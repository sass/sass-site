---
title: "Embedded Sass is Live"
author: Natalie Weizenbaum
date: 2022-02-01 2:00 PST
---

After several years of planning and development, I'm excited to finally announce
the stable release of Embedded Dart Sass along with its first official wrapper,
the [`sass-embedded`] package available now on npm!

[`sass-embedded`]: https://www.npmjs.com/package/sass-embedded

Embedded Sass is an ongoing effort to make a highly-performant Sass library
available to as many different languages as possible, starting with Node.js.
Although Node.js already has access to the pure-JS `sass` package, the nature of
JavaScript inherently limits how quickly this package can process large Sass
files especially in asynchronous mode. We expect `sass-embedded` to be a major
boon to developers for whom compilation speed is a concern, particularly the
remaining users of `node-sass` for whom performance has been a major reason to
avoid Dart Sass.

The `sass-embedded` package fully supports the [new JS API] as well as the
[legacy API] other than a few cosmetic options. You can use it as a drop-in
replacement for the `sass` package, and it should work with all the same build
plugins and libraries. Note that `sass-embedded` is a bit faster in
*asynchronous* mode than it is in synchronous mode (whereas the `sass` package
was faster in synchronous mode). For substantial Sass files, running
`sass-embedded` in either mode will generally be much faster than `sass`.

[new JS API]: https://sass-lang.com/documentation/js-api#usage
[legacy API]: https://sass-lang.com/documentation/js-api#legacy-api

In order to limit the confusion about which version of which package supports
which feature, the `sass-embedded` package will always have the same version as
the `sass` package. When new features are added to the JS API, they'll be
supported at the same time in both packages, and when new language features are
added to Sass they'll always be included in a new `sass-embedded` release
straight away.

## How it Works

Embedded Sass is composed of three parts:

1. [The compiler], a Dart executable that wraps Dart Sass and does the actual
   heavy lifting of parsing and compiling the files. Dart native executables are
   generally much faster than JavaScript, so using them for the
   computationally-intensive work of stylesheet evaluation is where Embedded
   Sass gets its speed.

2. [The host], a library in any language (in this case JavaScript) that provides a
   usable end-user API for invoking the compiler. The host provides callers with
   configuration options, including the ability to define custom importers and
   Sass functions that are used by the compilation.

3. [The protocol], a [protocol-buffer]-based specification of how the host and
   the compiler communicate with one another. This communication happens over
   the standard input and output streams of the compiler executable, which is
   invoked by the host to perform each compilation.

[The compiler]: https://github.com/sass/dart-sass-embedded
[The host]: https://github.com/sass/embedded-host-node
[The protocol]: https://github.com/sass/embedded-protocol
[protocol-buffer]: https://en.wikipedia.org/wiki/Protocol_Buffers

## Other Languages

Embedded Sass was designed in part as a way for languages other than JavaScript
to have access to the full power of Sass compilation with custom importers and
functions, similarly to how C++ wrappers for [LibSass] worked in the past. We
hope that community members will use this protocol to implement embedded hosts
for many other popular frontend languages. If you end up doing so, message us
[on Twitter] or [Gitter] and we'll link it on this site!

[LibSass]: https://sass-lang.com/libsass
[on Twitter]: https://twitter.com/SassCSS
[Gitter]: https://gitter.im/sass/sass

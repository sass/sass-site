---
title: LibSass is Deprecated
author: Natalie Weizenbaum
tags: blog
#date: 2020-10-26 12:00 PST
---

After much discussion among the Sass core team, we've come to the conclusion
that it's time to officially declare that LibSass and the packages built on top
of it, including Node Sass, are deprecated. For several years now, it's been
clear that there's simply not enough engineering bandwidth behind LibSass to
keep it up-to-date with the latest developments in the Sass language (for
example, the most recent new language feature was added in [November 2018]). As
much as we've hoped to see this pattern turn around, even the excellent work of
long-time LibSass contributors Michael Mifsud and Marcel Greter couldn't keep up
with the fast pace of language development in both CSS and Sass.

[November 2018]: https://github.com/sass/libsass/releases/tag/3.5.5

I'll go into detail about what this means below, but here are the major points:

- We no longer recommend LibSass for new Sass projects. Use [Dart Sass] instead.

  [Dart Sass]: https://sass-lang.com/dart-sass

- We recommend all existing LibSass users make plans to eventually move onto
  Dart Sass, and that all Sass libraries make plans to eventually drop support
  for LibSass.

- We're no longer planning to add any new features to LibSass, including
  compatibility with new CSS features.

- LibSass and Node Sass will continue to be maintained indefinitely on a
  best-effort basis, including fixing major bugs and security issues and
  maintaining compatibility with the latest Node versions.

## Why deprecate?

For several years now, Sass has managed to exist in an ambiguous kind of state
where LibSass was an officially-supported implementation in theory, but its
feature surface was static in practice. As time has gone on, it's becoming
increasingly clear that this state causes substantial concrete problems for Sass
users. For example, we regularly see users confused as to why [plain-CSS `min()`
and `max()` don't work] and assuming Sass as a whole is at fault, when in fact
it's only LibSass that doesn't support that feature.

[plain-CSS `min()` and `max()` don't work]: https://github.com/sass/sass/issues/2849

Official support for LibSass doesn't just cause pain for individual users.
Because LibSass doesn't support the [Sass module system] that launched last
year, major shared Sass libraries have been unable to use it for fear that their
downstream users would be incompatible. By clearly indicating that all Sass
users should eventually move off of LibSass, we hope to make it more feasible
for these library authors to use more modern features.

[Sass module system]: https://sass-lang.com/blog/the-module-system-is-launched

LibSass has even inhibited the development of the Sass language itself. We've
been unable to move forward with the proposal for [treating `/` as a separator]
because any code they'd write would either produce deprecation warnings in Dart
Sass or fail to compile in LibSass. By marking LibSass as deprecated, this
becomes much more feasible, and Sass becomes much better at supporting the
latest versions of CSS.

[treating `/` as a separator]: https://github.com/sass/sass/blob/main/accepted/slash-separator.md

## What does "deprecated" mean?

We're choosing to use the term "deprecated" because it carries a lot of weight
in the programming community, and provides a strong signal that users should
start planning to move away from LibSass. However, it doesn't mean that the
project is entirely dead. Michael Mifsud, the lead maintainer of LibSass and
Node Sass, has affirmed that he plans to continue maintenance on the same level
as the past few years. This means that although there will be no more features
added (and as such LibSass will slowly drift further and further out of
compatibility with the latest CSS and Sass syntax), there will continue to be
maintenance releases indefinitely.

## What about portability and performance?

LibSass today has two major benefits over Dart Sass:

- **Portability**: since it's written in C++, it's easy to embed LibSass within
  other programming languages and provide a native-feeling API.

- **Performance**: calling out to LibSass via the C++ API is very fast relative
  to the speeds of code written directly in scripting languages. In particular,
  this means LibSass is substantially faster in JavaScript than Dart
  Sass-compiled-to-JS (although it's comparable to Dart Sass's command-line
  executable).

We're working on addressing both of those with the [Sass embedded protocol],
which runs a Sass compiler as a subprocess that can communicate with any host
language via message-passing. The embedded protocol supports all the features of
a native Sass API, including the ability to define custom importers and Sass
functions, while also providing the high performance of the CLI app. Dart Sass
has already implemented the compiler side of the embedded protocol, and a
JavaScript host for it is in active development.

[Sass embedded protocol]: https://github.com/sass/embedded-protocol

## How do I migrate?

If you're a user of Node Sass, migrating to Dart Sass is straightforward: just
replace `node-sass` in your `package.json` file with `sass`. Both packages
expose the same JavaScript API.

If you're using the SassC command-line interface, you can switch to [Dart Sass's
CLI]. Note that this doesn't have exactly the same interface as SassC, so you
may need to change a few flags.

[Dart Sass's CLI]: https://sass-lang.com/documentation/cli/dart-sass

If you're using LibSass through a wrapper library in another language, you can
either switch to the Dart Sass CLI or ask the maintainer of the LibSass wrapper
to convert it to a host for the [Sass embedded protocol]. The embedded protocol
allows any language to provide a native API that calls out to Dart Sass.

Please note that because activity on LibSass has been low for several years, it
has a number of outstanding bugs and behavioral variations from the Sass spec.
You may need to make minor updates to stylesheets to make them compatible with
Dart Sass. See [this list of major compatibility issues] for reference.

[this list of major compatibility issues]: https://github.com/sass/libsass/issues?q=is%3Aopen+is%3Aissue+label%3A%22Compatibility+-+P1+%E2%9A%A0%EF%B8%8F%22

## Thank you

Finally, I want to thank everyone who's put so much time and energy into LibSass
and Node Sass over the years. It will always be a towering achievement, and
Sass's popularity outside of the Ruby community is undoubtedly due in large part
to its existence. Many people have tried to implement Sass only to find that the
language is much deeper and more complex than they expected, and LibSass alone
among all of those implementations managed to become fully-featured enough to
provide real value for thousands if not millions of users. These maintainers
deserve to be proud of that work, and I hope they'll always consider themselves
part of the Sass community going forward.

---
title: Dart Sass 1.0.0 is Released
author: Natalie Weizenbaum
date: 2018-03-26 13:15:00 -8
---

I've just uploaded Dart Sass 1.0.0, the very first stable release, to
[GitHub](https://github.com/sass/dart-sass/releases/tag/1.0.0-rc.1),
[npm](https://www.npmjs.com/package/sass),
[Chocolatey](https://community.chocolatey.org/packages/sass),
[Homebrew](https://github.com/sass/homebrew-sass), and
[pub](http://pub.dartlang.org/packages/sass). After working on it for almost two
years, I'm thrilled to have a stable release out there and officially ready to
use in real-world applications. [All the reasons we chose
Dart](/blog/announcing-dart-sass) as the implementation language are bearing
fruit: Dart Sass is much faster than Ruby Sass, much easier to make available
across operating systems and language environments, and much more maintainable.

The 1.0.0 stable release indicates that Dart Sass is fully compatible with the
Sass language as defined by [the sass-spec test
suite](http://github.com/sass/sass-spec), and that its npm package is compatible
with the [Node Sass
API](https://github.com/sass/node-sass#usage), with the
exception of source map support which is [coming
soon](https://github.com/sass/dart-sass/issues/2).

I've also updated sass-lang.com to cover Dart Sass. The release bar now shows
the latest version of all three major implementations, as well as links to their
release notes and documentation about each one. The [install page](/install)
covers Dart Sass instead of Ruby Sass, and the [Dart Sass page](/dart-sass)
talks all about what Dart Sass is and the various ways it can be used.

### What's Next?

At first, the focus of Dart Sass was on compatibility with the Sass language.
Once we reached that and [graduated to a beta
release](/blog/dart-sass-is-in-beta), we shifted our focus to compatibility with
the Node Sass API. Now that we've reached that, our primary aim for the next
several months will be bringing the usability of Dart Sass up to (at least) the
standard of Ruby Sass and Node Sass.

This means focusing on a number of features outside the language that make
working with Sass pleasant. This includes [generating source
maps](https://github.com/sass/dart-sass/issues/2) from both the command-line
interface and the JavaScript API, [adding a live watch
mode](https://github.com/sass/dart-sass/issues/264), and [integrating Dart Sass
into the Node ecosystem](https://github.com/sass/dart-sass/issues/267). We've
also got our eye on the possibility of creating [a Ruby
gem](https://github.com/sass/dart-sass/issues/249) that embeds Dart Sass with a
Ruby Sass-like API.

Of course, I'll also continue to keep on top of bug fixes and new CSS features.
I probably won't personally have a lot of bandwidth for adding new language
features, but if anyone else is interested there are a number that [wouldn't be
too hard to
add](https://github.com/sass/sass/issues?utf8=%E2%9C%93&q=is%3Aopen+is%3Aissue+label%3A%22Help+Wanted%22+label%3APlanned).
Dart is a very easy language to learn, and I've written up a [helpful guide on
contributing](https://github.com/sass/dart-sass/blob/main/CONTRIBUTING.md#readme).

### What About Ruby Sass?

I'll be posting a more detailed post about the future of Ruby Sass soon, but the
abbreviated version is that it's now officially deprecated. I'll continue
maintaining it for one more year from the date this blog post goes live,
including fixing bugs and updating it to support new CSS features, but it won't
be getting any new language features. Once the one-year deprecation period is
up, the repository will be archived and no new versions will be released.

Of course, all that could change if someone is willing to step up as a new
maintainer! It's not an easy task, but it's a chance to work on something that's
used by tons of people every day. If you're interested, please email
[me](mailto:nex342@gmail.com) and [Chris](mailto:chris@eppsteins.net) and we'll
talk to you about next steps.

### Give It a Whirl

One of the big benefits of switching to Dart is increased portability, which
means it's easier than ever to install Sass. Give it a try on whichever is
easiest for you:

- Standalone tarballs are [available on
  GitHub](https://github.com/sass/dart-sass/releases/tag/1.0.0), which you can
  just download and run from the command line.

- You can get the pure-JavaScript version from npm by running `npm install -g
  sass`.

- [Chocolatey](https://chocolatey.org/) users on Windows can run `choco install
  sass` (or `choco upgrade sass` if you already have it).

- [Homebrew](https://brew.sh/) users on Mac OS X can run `brew install
  sass/sass/sass` (or `brew upgrade sass` if you already have it).

- Or if you're a Dart user, you can run `pub global activate sass`.

Now, get styling!

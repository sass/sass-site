---
title: Dart Sass is in Beta
author: Natalie Weizenbaum
date: 2017-06-05 13:00 PST
---

Last weekend was [three days long](https://en.wikipedia.org/wiki/Memorial_Day)
and the weather in Seattle was gorgeous. Contrary to stereotype, spring here is
often characterized by bright sunny days that aren't too hot, and on days like
that I love to curl up on the armchair in my living room and write some code.
This weekend, that meant finishing up the last few outstanding `@extend` bugs,
finally **making Dart Sass fully sass-spec compatible**[^1].

[^1]: Technically there are still two specs marked as "TODO". These test UTF-16
    support, which is currently [blocked on Dart
    support](https://github.com/dart-lang/sdk/issues/11744).

This is the milestone we've decided would mark the transition from alpha to beta
releases of Dart Sass. Dart Sass 1.0.0-beta.1 is up now on npm, pub, and
Chocolatey, and I encourage people to start trying it out in their own
applications. We've fixed all the bugs we know about, so now we need our
diligent users to find the rest of them and [tell
us](https://github.com/sass/dart-sass/issues/new)!

## Next Steps: Ruby Sass

There are a number of [intentional behavior
differences](https://github.com/sass/dart-sass#behavioral-differences-from-ruby-sass) between
Dart Sass and the existing implementations. All of these differences are things
we think improve the language, and many of them have also made Dart Sass much
easier to implement, but we recognize that they can make migration more
difficult. That's why our next priority is updating Ruby Sass by deprecating old
behavior or adding new behavior, as necessary.

Our long-term compatibility goal is to ensure, as much as possible, that **if a
stylesheet compiles without warnings on Ruby Sass, it will also work with Dart
Sass**. So a substantial portion of our effort in the near future be spent on
ensuring [all the compatibility
issues](https://github.com/sass/sass/labels/Dart%20Sass%20Compatibility) are
fixed. Once that's done, we'll release those changes as part of Ruby Sass 3.5.

## Next Steps: Dart Sass

On the Dart front, we have [a number of
issues](https://github.com/sass/dart-sass/milestone/1) outstanding that we want
to resolve before we release a stable version of 1.0.0. The majority of these
issues are focused on one thing: compatibility with the node-sass `render()`
API. This will make it easy to integrate Dart Sass into existing JS ecosystem
tools and workflows, since anything that works with node-sass will automatically
work with Dart Sass as well.

## Try It Out

As with all Dart Sass releases, 1.0.0-beta.1 is available on many platforms.
Give it a try on whichever is easiest for you:

* Standalone tarballs are [available on
  GitHub](https://github.com/sass/dart-sass/releases/tag/1.0.0-beta.1), which
  you can just download and run from the command line.

* [Chocolatey](https://chocolatey.org) users on Windows can just run `choco
  install sass --pre` (or `choco upgrade sass --pre` if you already have it).

* You can get the pure-JavaScript version from npm by running `npm install -g
  dart-sass`.

* Or if you're a Dart user, you can run `pub global activate sass`.

I'm very pleased to have 1.0.0-beta.1 tagged and out in the world, but the work
of a language maintainer is never done. I'm back to work, and if I hustle,
hopefully I'll be writing about 1.0.0-rc.1 soon!

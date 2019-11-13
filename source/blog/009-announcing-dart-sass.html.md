---
title: Announcing Dart Sass
author: Natalie Weizenbaum
date: 2016-10-31 13:28 PST
---

Over the past few months, I've been quietly working on a new project. Today I'm
ready to announce [Dart Sass](https://github.com/sass/dart-sass) to the world.
It's a totally new implementation of Sass, designed to be fast, easy to install,
and easy to hack on. It's not yet complete—I'm steadily working my way through
[sass-spec](https://github.com/sass/sass-spec)—so today I'm just releasing
version 1.0.0-alpha.1. But it's solid enough for you to download, play with, and
[start filing issues](https://github.com/sass/dart-sass/issues).

You can download a standalone archive [from the release
page](https://github.com/sass/dart-sass/releases/tag/1.0.0-alpha.1)—just extract
it, add the folder to your path, and run `dart-sass`. Dart also compiles to
JavaScript, so if you have [npm](https://www.npmjs.com/) installed you can
install the JS version by running `npm install -g dart-sass`. And, if you happen
to be a Dart user yourself, you can install it using `pub global install sass`.

## Why Rewrite Sass?

Over the past few years, there have been two primary implementations of Sass.
[Ruby Sass](https://github.com/sass/sass) was the original, written mostly by me
with substantial help from [Chris](https://twitter.com/chriseppstein). It's
high-level and easy to hack on, so it's where we iterate on new features and
where they first get released. Then there's
[LibSass](https://github.com/sass/libsass), the C++ implementation, originally
created by [Aaron](https://github.com/akhleung) and
[Hampton](https://github.com/hcatlin) and now maintained by
[Marcel](https://github.com/mgreter) and [Michael](https://github.com/xzyfer).
It's low-level, which makes it very fast and easy to install and embed in other
languages. In particular, its [Node.js
bindings](https://github.com/sass/node-sass) are a very popular way to use Sass
in the JavaScript world.

Each implementation's strengths complement the other's weaknesses. Where LibSass
is fast and portable, Ruby Sass is slow and difficult for non-Ruby-users to
install. Where Ruby Sass is easy to iterate on, LibSass's low-level language
makes it substantially harder to add new features. A complementary relationship
can be healthy, but it can also mean that neither solution is as good as it
needs to be. That's what we found when, in May, [Marcel officially left the
LibSass team](http://blog.sass-lang.com/posts/734390-thank-you-marcel)[^1].

[^1]: I say "officially" because he's still contributing to the project when he
    can, just not in an official maintainer capacity.

Without two people's worth of effort, we were no longer sure that LibSass could
keep pace with the speed Chris and I wanted to introduce changes into the
language. And it had been clear for a long time that Ruby Sass was far too slow
for use cases involving large stylesheets. We needed a new implementation, one
that could generate CSS quickly *and* add new features quickly.

## Why Dart?

We considered a number of possible languages, and ended up deciding on Dart for
a number of reasons. First, it's *really fast*—the Dart VM is generally much
faster than JavaScript VMs, and [early
benchmarks](https://github.com/sass/dart-sass/blob/master/perf.md)[^2] indicate
that, for large stylesheets, Dart Sass is 5-10x faster than Ruby Sass and only
about 1.5x slower than LibSass. I'll hazard a guess that it would be about
1.5-2x faster than an idiomatic JS implementation, but I can't say for sure. And
Dart's performance continues to get better all the time.

[^2]: Caveats apply: I'm not a benchmarking expert, and these tests were *ad
    hoc* and run against non-representative source stylesheets. If anyone is
    interested in working on more scientific benchmarks, please let me know!

At the same time, Dart is easy to work with—much more so than C++, and to some
extent even more than Ruby for such a large project. Granted, not as many people
are familiar with it as with JavaScript, but language implementations don't tend
to get many external contributions anyway. I'll be doing most of the work on the
new implementation, and Dart is the language that I'm personally most
comfortable with at the moment (when I'm not working on Sass, I'm on the Dart
team). Using Dart gives me a lot of extra velocity.

Unlike Ruby or JavaScript, Dart is *statically typed*, so every value's type can
be figured out without running the code. Unlike C++, it's *garbage collected*,
so we don't have to worry as much about cleaning up after ourselves. This makes
it easy to write, easy to modify, and easy to maintain. Maybe even more
importantly, it makes it easy to translate to other programming languages, which
will help LibSass get new features faster.

The last reason we chose Dart is something that only a few other languages can
boast: JavaScript compatibility. Dart can be compiled to JavaScript, which can
be used directly in Node.js or even potentially run in a browser. A huge chunk
of the Sass ecosystem built on node-sass, and we intend to make the JS version
of Dart Sass as close to API-compatible with node-sass as possible, so that it
can easily drop into existing tools and build systems.

The only downside is that there's a speed hit: Dart Sass is about twice as slow
running on V8 as it is running on the Dart VM. However, this still puts it
solidly 3-4x faster than Ruby Sass. Ultimately we also hope to provide an easy
path for users of the JS-compiled version to move to the Dart VM version as
little friction as possible.

##  What Will Happen to The Other Implementations?

Nothing's changing about LibSass's development. Michael's hard at work adding
features from [Sass
3.5](http://blog.sass-lang.com/posts/809572-sass-35-release-candidate), and we
expect that process to continue as new language features are added. The only
difference is that LibSass will no longer be required to be strictly compatible
with the latest version of the language in order for that version to launch,
since it will no longer be the only implementation with reasonable performance.

More flexibility translates into faster LibSass releases that prioritize the
features users want most. Strict compatibility meant that important features
like [CSS custom property support](https://github.com/sass/libsass/issues/2076)
can't be released until all the tiny tricky edge cases that were in the
corresponding Ruby Sass release, like [`:root`
unification](https://github.com/sass/libsass/issues/2071), are implemented as
well. We'll still strive for as much compatibility as possible, but we won't let
that stand in the way of velocity.

Ruby Sass, on the other hand, will eventually go away unless a new maintainer
appears. We don't want to make the transition sudden and risk fracturing the
ecosystem: Chris and I are committed to maintaining it for one year, which
includes keeping the language in sync with any new additions in Dart Sass. If
anyone is interested in volunteering as a maintainer after that period, we'd be
thrilled to mentor them and teach them the codebase over the coming year. But if
no one steps up, Ruby Sass will be officially considered deprecated and
unmaintained.

I want to emphasize that we aren't making the decision to stop developing Ruby
Sass lightly. This is a big change, and it's not an easy one for me—I've worked
on Ruby Sass continuously for almost ten years now, and it's difficult to let
that history go. But Chris and I have discussed this thoroughly, and we're
convinced this is the right move. We only have so much time to devote to Sass,
and it no longer makes sense to put that time into an implementation that's so
slow as to be infeasible for many of our largest users.

## What Next?

Before we release the first stable version of Dart Sass, there are a few big
things on our to-do list:

* Full sass-spec compatibility. There are still a bunch of corners of the
  language where Dart Sass does the wrong thing, especially with respect to
  `@extend`. I don't expect any individual incompatibility to be especially
  difficult to address, and sass-spec is pretty comprehensive, so it's just a
  matter of steadily reducing the number of failing specs until it hits zero.

* Close-enough node-sass `render()` compatibility in the npm package. The
  node-sass `render()` API is the main entrypoint to LibSass in the JavaScript
  world. It's how build systems run Sass, how users define custom Sass
  functions, and how [Eyeglass](https://github.com/sass-eyeglass/eyeglass)
  passes modules to Sass. We want to support this API with enough fidelity that
  the existing ecosystem works with JS-compiled Dart Sass.

* Dart Sass compatibility in Ruby Sass. There are some cases where Dart Sass
  intentionally differs from Ruby Sass, particularly when Ruby Sass's behavior
  is considered a bug. We should add deprecation messages in Ruby Sass and, if
  we can do so with minimal disruption, add support for the new behavior.

There's plenty more we'd like to do eventually, like supporting Sass in the
browser and providing a node-sass-compatible wrapper for Sass on the Dart VM,
but those aren't blocking the initial release.

## Onward Into the Future

The next couple months will see a lot of work go into getting Dart Sass stable
and compatible, and getting [Sass 3.5
features](http://blog.sass-lang.com/posts/809572-sass-35-release-candidate) into
LibSass. I think it's likely that early 2017 will see a stable release of Dart
Sass and a 3.5 release of LibSass. At that point we'll set our sight on the big
features and start working towards Sass 4.0 and its brand new module system.

Dart Sass is a big change, but it's an exciting one as well. It'll allow us to
get new features into users' hands faster, and to make those features *run*
faster. It'll make it possible for users to trivially install and run the
reference implementation. And it'll give us a performant way to run Sass in pure
JavaScript Sass for the first time ever. The benefits are large and tangible,
and I'm confident they're worth the costs.

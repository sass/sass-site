---
title: Ruby Sass is Deprecated
author: Natalie Weizenbaum
date: 2018-04-02 11:35 PST
---

With the release of [Dart Sass 1.0.0 stable](/blog/dart-sass-100-is-released)
last week, Ruby Sass was officially deprecated. I'll continue to maintain it
over the next year, but when 26 March 2019 rolls around it will reach its
official end-of-life. I encourage all users to start migrating away sooner
rather than later.

### The Deprecation Period

Over the next year, I'll continue to work on Ruby Sass in a limited capacity.
I'll triage and fix any bugs that are reported, unless they're minor or obscure
enough to be unlikely to pose a practical problem over the next year. I'll also
add support for any new CSS features that require changes to the Sass parser or
other parts of the language.

I won't be working on language features that aren't necessary for CSS support,
though. The latest and greatest features will be appearing exclusively in [Dart
Sass](/dart-sass) and [LibSass](/libsass) from here on out.

I also won't be accepting pull requests for new Ruby Sass features. While pull
requests are a great way to contribute to projects, they still take work on my
part to merge in, and it just doesn't make sense to spend time on that work when
the project is being turned down. If you're interested in contributing to Sass,
I highly recommend [contributing to Dart
Sass](https://github.com/sass/dart-sass/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)—Dart
is an extremely easy language to learn!

We're also be migrating the Ruby Sass repository to
https://github.com/sass/ruby-sass, so be sure to update your Git URLs. The old
repository URL will continue to work during the deprecation period, but it will
be frozen; all ongoing maintenance will happen at the new URL. Once the
deprecation period is over, the Git history for the old URL will be wiped and
replaced with feature specifications. See [this
issue](https://github.com/sass/sass/issues/2480) for the full plan.

### Migrating Away

We want to make it as easy as possible to migrate from Ruby Sass onto an
actively-maintained implementation. The best way to do that depends on how you
use Ruby Sass today.

If you use Ruby Sass as a command-line tool, the easiest way to migrate is to
[install Dart Sass](/install) as a command-line tool. It supports a similar
interface to Ruby Sass, although it currently doesn't support the `--watch` or
`--update` flags—[adding them](https://github.com/sass/dart-sass/issues/264) is
high priority, though!

If you use Ruby Sass as a plugin for a Ruby web app, particularly if you define
your own Sass functions in Ruby, the
[`sassc`](https://github.com/sass/sassc-ruby) gem provides access to
[LibSass](/libsass) from Ruby with a very similar API to Ruby Sass. In most
cases, you can just replace the `Sass` module with the `SassC` module and your
code will continue to work.

If you're using Rails, I particularly recommend using the
[`sassc-rails`](https://github.com/sass/sassc-rails) gem, which wraps up the
`sassc` gem and integrates it smoothly into the asset pipeline. Most of the time
you won't even need to change any of your code.

We're also planning to add support to Dart Sass for [embedding it in
Ruby](https://github.com/sass/dart-sass/issues/248) (and other programming
languages). This will allow Ruby users to get the latest and greatest features
as soon as they're implemented.

### End of Life

On 26 March 2019, the deprecation period for Ruby Sass will end and it will no
longer be maintained. The new `sass/ruby-sass` repository will be
[archived](https://help.github.com/articles/about-archiving-repositories/),
which means no changes will be made and no new issues or pull requests will be
accepted. The old `sass/sass` repository will have its Git history replaced with
feature specifications that have historically just been scattered around issue
comments.

Leading up to the end of life, we'll be migrating the user-focused [reference
documentation](/documentation/file.SASS_REFERENCE.html) from the Ruby Sass
repository to the Sass website. We could use some help doing the migration and
touching up the documentation, so if you're interested please [chime in on the
tracking issue](https://github.com/sass/sass-site/issues/205)!

#### Unless...

We're turning down support for Ruby Sass because the Sass team just doesn't have
the bandwidth to maintain it along with the other major implementations. But
there could be another solution. If someone from the community is willing to
step up and take on the mantle of maintainer, we'd be more than happy to show
them the ropes and help them keep Ruby Sass going.

Maintaining a language implementation isn't necessarily easy. It requires
keeping up with features as they're added to Dart Sass, as well as fixing bugs
and fielding pull requests. But it's also a great opportunity to work on a big
project with a lot of impact, and I'm happy to help get a new maintainer up to
speed. If you're interested, please email [me](mailto:nex342@gmail.com) and
[Chris](mailto:chris@eppsteins.net) and we'll talk about how to get started.

---
title: Ruby Sass Has Reached End-Of-Life
author: Natalie Weizenbaum
date: 2019-04-03 16:15:00 -8
---

One year has passed since we announced [the deprecation of Ruby
Sass](/blog/ruby-sass-is-deprecated), and it has now officially reached its
end-of-life. We will release one final version of the Ruby Sass gem that will
print a warning indicating that it's no longer receiving updates, and then
archive [the GitHub repository](https://github.com/sass/ruby-sass).

![A woman saying "Goodbye, my friend"](/assets/img/blog/020-goodbye.gif)

We will then merge the [sass/language](https://github.com/sass/language) repo
into the [sass/sass](https://github.com/sass/sass) repo. This means that
**anyone still depending on Ruby Sass from `github.com/sass/sass` will break.**
Going forward, the sass/sass repo will be the location for working on the
language specs, and will not contain any code. The sass/language repo will just
include links pointing to sass/sass.

### Migrating Away

If you haven't migrated away from Ruby Sass yet, now is the time. The best way
to do that depends on how you use Ruby Sass today.

If you use Ruby Sass as a command-line tool, the easiest way to migrate is to
[install Dart Sass](/install) as a command-line tool. It supports a similar
interface to Ruby Sass, and you can run `sass --help` for a full explanation of
its capabilities.

If you use Ruby Sass as a plugin for a Ruby web app, particularly if you define
your own Sass functions in Ruby, the
[`sassc`](https://github.com/sass/sassc-ruby) gem provides access to
[LibSass](/libsass) from Ruby with a very similar API to Ruby Sass. In most
cases, you can just replace the `Sass` module with the `SassC` module and your
code will continue to work.

If you're using Rails, we particularly recommend using the
[`sassc-rails`](https://github.com/sass/sassc-rails) gem, which wraps up the
`sassc` gem and integrates it smoothly into the asset pipeline. Most of the time
you won't even need to change any of your code.

### Farewell, Ruby Sass!

On a personal note, I started writing Ruby Sass in 2006 when I was just a
college kid coding in between homework assignments. I've worked on it (with
varying degrees of focus) continuously for the last 13 years, and I expect it'll
take me a long time to match that record with any other codebase. I'm glad to
see the language [moving forward](/blog/announcing-dart-sass), but at the same
time I'll miss Ruby Sass terribly.

I also want to take this opportunity to thank our users, especially those in the
Ruby community in which Sass was born, for appreciating the language we created
and evangelizing it so widely. Sass has an incredible userbase, and I've been so
proud to see how large and diverse it's grown over the years. Let's keep it up
as we move into a new era of Sass!

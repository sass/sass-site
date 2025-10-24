---
title: LibSass Has Reached End-Of-Life
author: Natalie Weizenbaum
date: 2025-10-22 16:15:00 -8
---

LibSass and the packages built on top of it have been deprecated [since October
2020]. In the five years since we made that announcement, the Sass language has
continued to evolve to support the latest CSS features like color spaces, and
[embedded sass] made it easy to run Dart Sass across numerous different
languages and platforms.[^1] Dart Sass now meets essentially all the use-cases
that LibSass once did.

[since October 2020]: /blog/libsass-is-deprecated
[embedded sass]: /blog/embedded-sass-is-live

[^1]: Intrepid Sass contributor [Natsuki](https://ntk.me/works/) is even working
    on a way to run it on platforms the Dart VM doesn't support, like BSD
    variants, by driving the embedded protocol using Node.js!

At the same time, development of LibSass has faltered. There hasn't been a new
commit to the source code repository since December 2023, and there are numerous
issues languishing unaddressed. The time has come to be clear: LibSass is no
longer maintained and will receive no future updates.

## Migrating Away

As they say, the best time to migrate away from LibSass was five years ago, but
the second best time is now. There is a large and growing list of
incompatibilities between it and Dart Sass, largely to more correctly support
CSS features. You'll need to make sure your stylesheets are building without
deprecation warnings and then do some visual checks as well to see if there are
any more subtle differences.

The [LibSass page] contains a summary of the most notable incompatibilities,
which may be helpful in knowing what to look for. Some of them also have
automated migrations available using the [Sass migrator].

[LibSass page]: /libsass
[Sass migrator]: /documentation/cli/migrator

## Thanks Again

I already mentioned this in the deprecation blog post, but thanks to everyone
who made LibSass happen. It was a crucial stepping stone to bring Sass outside
the Ruby bubble at a time when it was no longer the center of the web
development world, and I don't think it's an exaggeration to say that Sass is
still the world's most popular stylesheet preprocessor *because of* LibSass. But
all things that rise must also fall, and this project's time has come.

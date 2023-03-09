---
title: Module System Preview
author: Natalie Weizenbaum
date: 2019-09-04 15:14:00 -8
---

Exciting news, Sass fans! After a year of development and some iteration on the
spec, we're ready to launch a beta preview of the new Sass module system! We may
still make a few last-minute tweaks based on user feedback, so don't go using
itin production just yet, but please do take this opportunity to play around
with it and let us know what you think.

## Installing the Preview

The preview release is available on all the normal distribution channels as
version `1.23.0-module.beta.1`. You can download it from the [GitHub release
page](https://github.com/sass/dart-sass/releases/tag/1.23.0-module.beta.1), or
install it using one of the following commands (depending on your preferred
installation channel):

```shellsession
$ npm install --save-dev sass@1.23.0-module.beta.1

$ npm install -g sass@1.23.0-module.beta.1

$ brew install sass/sass/sass@1.23.0-module.beta.1

$ choco install sass --version 1.23.0.modulebeta-1

$ pub global activate sass 1.23.0-module.beta.1
```

Note that 1.23.0 may not *actually* be the final version number for the stable
module system release, it's just the next minor version number in Dart Sass's
release series.

## How to Use the Module System

The original [summary of the module
system](/blog/request-for-comments-module-system-proposal) is still a great way
to learn how it works. You can also check out the [official
proposal](https://github.com/sass/sass/blob/main/accepted/module-system.md)
for a much more detailed dive into its behavior.

## Sending Feedback

If you have opinions on the module system, please [file an issue on
GitHub](https://github.com/sass/language/issues/new) or just [tweet at
@SassCSS](https://twitter.com/SassCSS). We'll take anything from "it looks
awesome" to "it looks awful", although the more specific you can be the more
information we have to work with!

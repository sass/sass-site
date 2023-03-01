---
title: Dart Sass is On Chocolatey
author: Natalie Weizenbaum
tags: blog
#date: 2017-01-13 14:43 PST
---

One of the quieter benefits of [moving to Dart](/blog/announcing-dart-sass) is
how easy it is to distribute Dart applications. The Dart VM is able to bundle
all the sources for an application into one easy-to-load binary snapshot, which
means running a Dart application requires only three files: the `dart`
executable, the snapshot file, and a tiny shell script to invoke the app[^1].
This is a huge relief coming from Ruby, which required a whole installation of
executables and libraries in order to run a single app.

Those three files are what we distribute today [on our GitHub release
page](https://github.com/sass/dart-sass/releases). But finding, downloading, and
opening an archive and adding it to the command-line path is still a barrier to
entry that we'd like to avoid where possible. Today we're taking a step in that
direction by releasing [a Dart Sass
package](https://chocolatey.org/packages/sass) on
[Chocolatey](https://chocolatey.org/), the Windows package manager. You can
install it now using:

```
$ choco install sass -prerelease
```

This will give you a `sass` executable that runs Dart Sass on the (really fast)
Dart VM.

A large percentage of Sass users are on Windows, and it hasn't always been easy
for them to get the latest and greatest Sass versions without a bunch of
installation headaches. I'm excited that we can start taking advantage of our
new infrastructure to fix that.

In addition to Chocolatey, we'd love to get Dart Sass on
[Homebrew](http://brew.sh/) for our OS X users. If you're interested in helping
out with that, let us know—[this
issue](https://github.com/sass/dart-sass/issues/97) would be a great place to
start!

[^1]:
    There's also [an open
    issue](https://github.com/dart-lang/sdk/issues/27596) for bundling the VM
    and the snapshot into a single executable file, which would allow us to pare
    down our distribution to a single file.

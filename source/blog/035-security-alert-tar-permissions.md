---
title: "Security Alert: Tar Permissions"
author: Natalie Weizenbaum
date: 2022-12-09 16:00:00 -8
---

The Sass team was recently alerted by prolific external contributor [@ntkme] to
a security issue in our release process.

[@ntkme]: https://github.com/ntkme

## TL;DR

If you're using Linux or Mac OS, run `ls -ax path/to/sass`. If the last group of
letters in the first column contains `w`, you're vulnerable:

```
Vulnerable:
-rwxr-xrwx 1 nweiz primarygroup 407 Dec 13 12:33 sass-1.56.2/sass

Not vulnerable:
-rwxr-xr-x 1 nweiz primarygroup 407 Dec 13 12:33 sass-1.56.2/sass
```

If you're using the `sass-embedded` package, do the same thing for
`node_modules/sass-embedded/dist/lib/src/vendor/dart-sass-embedded/dart-sass-embedded`.

## Who's Affected?

While we don't expect this issue to be a problem for the vast majority of users,
it does affect the following groups:

* Users who downloaded the stand-alone Dart Sass, Dart Sass Embedded, or Sass
  Migrator `.tar.gz` archives from the Dart Sass website and extracted them as
  the Unix root user.

* Users who installed the `sass-embedded` npm package as the Unix root user
  prior to version 1.54.5.

* Users who installed the "non-native" version of the community-maintained
  `sass-embedded` RubyGems package as the Unix root user prior to version
  1.56.2.

* Users on multi-user systems who downloaded the stand-alone Dart Sass, Dart
  Sass Embedded, or Sass Migrator `.tar.gz` archives from the Dart Sass website
  and explicitly passed the `-p`/`--preserve-permissions` flag when extracting
  them.

Users who installed Dart Sass via the `sass` npm package, Homebrew, or
Chocolatey are categorically not at risk, nor are users on Windows.

We strongly recommend that users in these vulnerable groups delete and
re-install Sass. All the `.tar.gz` files on GitHub have been scrubbed to remove
the vulnerability, so you can reinstall the same version you were previously
using without needing to upgrade to the latest version.

This is a privilege-escalation issue, which means it could allow a hypothetical
attacker with access to a low-privilege account on your computer to escalate
their access to your account's privileges. However, this also means that it's
not a risk *unless* an attacker already has access to an account on your
machine.

## What went wrong?

We were inadvertently uploading `.tar.gz` archives with permissions metadata
indicating that executable files could be overwritten by all users, not just the
owner.

In most cases, this metadata is ignored when extracting the archives and the
permissions are set to only be writable by the user doing the extraction.
However, when extracting archives as the Unix root user or explicitly passing
the `-p`/`--preserve-permissions` flag, the permissions for the extracted files
are set according to the archive's metadata. Because the metadata was incorrect,
an attacker with access to a low-privilege account would be able to overwrite
the executable file and escalate their privileges once it's executed.

## How did this happen?

Dart Sass is automatically deployed to various different release platforms using
a Dart package called [`cli_pkg`], which is also written maintained by the Sass
team. This package uses the Dart [`archive`] package to generate `.tar.gz` files
for stand-alone release packages which are then uploaded to GitHub, and when
initially writing the code to use this package I wrote the following function:

[`cli_pkg`]: https://pub.dev/packages/cli_pkg
[`archive`]: https://pub.dev/packages/archive

```dart
ArchiveFile fileFromBytes(String path, List<int> data,
        {bool executable = false}) =>
    ArchiveFile(path, data.length, data)
      ..mode = executable ? 495 : 428
      ..lastModTime = DateTime.now().millisecondsSinceEpoch ~/ 1000;
```

My intention was to set the executable mode to `755` (read/write/execute for the
owner, read/execute only for the other users) and the non-executable mode to
`644` (read/write for the owner, read-only for other users). However, Dart
doesn't support literal octal numbers and I must have done the decimal-to-octal
conversion wrong. The actual permissions that got set were `757`
(read/write/execute for the owner **and other users**, read/execute for the
group) and `654` (read/write for the owner, read/execute for the group, and
read-only for other users).

This went unnoticed for several years, until @ntkme notified us of the issue
last week and provided a fix to `cli_pkg`.

## What's been done?

We've released `cli_pkg` 2.1.7 which sets the archive permissions correctly. In
addition, we've updated all `.tar.gz` files in the Dart Sass, Dart Sass
Embedded, and Sass Migrator repositories to correctly limit write permissions to
only the owner of the files. We're announcing the vulnerability here and on the
[@SassCSS Twitter account].

[@SassCSS Twitter account]: https://twitter.com/SassCSS

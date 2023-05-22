---
title: "Request for Comments: New Embedded Protocol"
author: Natalie Weizenbaum
date: 2023-05-19 16:00:00 -8
---

If you're not an author of a host package for the Embedded Sass Protocol, you
can skip this blog post—although if you're a big enough nerd, you may find it
interesting regardless!

We're planning to make a number of breaking changes to the Embedded Sass
Protocol, and we want your feedback before we lock in the new way of doing
things. We intend to make a number of breaking changes all at once to keep the
total number of disruptions to a minimum.

We're planning two major breaking changes:

1. The Dart Sass embedded host will no longer be released as a separate
   executable. It will now be bundled into the main Dart Sass executable,
   accessible by running `sass --embedded`.

2. Every packet in the embedded protocol now includes a compilation ID as part
   of the packet structure, rather than declaring it in the protocol buffer
   definitions.

We're using this opportunity to also introduce three much smaller breaking
changes:

1. The specification for the embedded protocol and the protocol buffer
   definition have been moved to [the Sass language repository] so that they can
   be updated at the same time as changes to the language and the JS API.

   [the Sass language repository]: https://github.com/sass/sass/blob/main/spec/embedded-protocol.md

2. The embedded protocol now explicitly declares optional fields using the
   protocol buffers language feature. This means that "default values" for
   various fields are no longer considered to be unset.

3. The `CompilationSuccess.loaded_urls` field has been moved to
   `CompilationResult.loaded_urls` so that it's available even when a
   compilation fails. This allows watcher implementations to know which files to
   watch to redo a failed compilation.

The repository-organization changes have already been made, but the changes to
the protocol itself are fully documented [in a proposal in the language
repository].

[in a proposal in the language repository]: https://github.com/sass/sass/blob/main/proposal/embedded-protocol-2.md

## Combining Executables

The primary benefit of folding Embedded Dart Sass into the main Dart Sass
executable is to provide embedded hosts an easy way to expose the standard Dart
Sass command-line API to users. Now every user who installs any embedded host
will have the full Dart Sass executable available to them at native Dart VM
speeds.

This also helps simplify the Sass team's organization by reducing the number of
separate repositories and release processes we need to manage.

## Wire-Level Compilation ID

We're pulling the compilation ID out to the protocol level in order to provide
better concurrency, particularly on the side of the embedded compiler. Sass
compilations done by the embedded compiler don't share any state between one
another, which means that they could in theory be run in totally separate worker
threads. However, with the embedded protocol as it exists today, directing each
message to the correct worker thread requires parsing the entire message on the
main thread to determine which compilation it belongs to, then parsing it
_again_ in the worker thread to actually handle it.

Making the compilation ID part of the protocol itself solves this issue. Each
endpoint can read the ID, look up the worker thread that's handling the
compilation, and pass the message on to that thread without parsing the rest of
the message. This makes concurrency both easier and more efficient, which will
help ensure that large compilations happen as fast as possible.

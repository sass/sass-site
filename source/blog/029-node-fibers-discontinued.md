---
title: "The Discontinuation of node-fibers"
author: Natalie Weizenbaum
date: 2021-3-26 15:00:00 -8
---

We have recently received the unfortunate but not entirely surprising news that
[the `node-fibers` package has reached its end-of-life] and will not be updated
for compatibility with Node 16. Dart Sass has historically allowed JavaScript
users to pass in `node-fibers` to improve the performance of the asynchronous
`render()` method, but going forward this will unfortunately no longer be an
option in Node 16 and on.

[the `node-fibers` package has reached its end-of-life]: https://github.com/laverdet/node-fibers/commit/8f2809869cc92c28c92880c4a38317ae3dbe654d

There are a number of [alternative options] for reclaiming this lost
performance, some of them which are available today, some which are in
development, and some which are theoretical but could be made real with pull
requests from users like you. Sadly, none of the options that are ready today
are drop-in solutions with the same level of ease-of-use as `node-fibers`, so if
that performance is crucial to you we recommend staying on Node 14 for the time
being.

[alternative options]: #reclaiming-performance

## What Happened?

In order to understand how we got here, it's important to know two pieces of
history. First, why does Dart Sass use `node-fibers` in the first place? And
second, why is `node-fibers` dying?

*This section is fairly technical, so feel free to [skip ahead] if you don't care
about the gory details.*

[skip ahead]: #reclaiming-performance

### Fibers in Sass

Dart Sass inherited its [JavaScript API] from the now-deprecated [Node Sass].
This API has two main functions for compiling Sass files: `renderSync()` which
synchronously returned the compiled CSS, and `render()` which instead takes a
callback to which it passes the compiled CSS asynchronously. Only `render()`
allowed asynchronous plugins, including widely-used importers such as webpack's
[`sass-loader`], so `render()` became very widely used in practice.

[JavaScript API]: /documentation/js-api
[Node Sass]: https://www.npmjs.com/package/node-sass
[`sass-loader`]: https://www.npmjs.com/package/sass-loader

For Node Sass, the performance difference between `render()` and `renderSync()`
was negligible, because it was built on C++ code which had few restrictions on
how it handled asynchrony. However, Dart Sass runs as pure JavaScript, which
makes it subject to JavaScript's strict async rules. Asynchrony in JavaScript is
*contagious*, which means that if any function (such as an importer plugin) is
asynchronous, then everything that calls it must be asynchronous, and so on
until the entire program is asynchronous.

And asynchrony in JavaScript isn't free. Every asynchronous function call has to
allocate callbacks, store them somewhere, and take a trip back to the event loop
before invoking those callbacks, and that all takes time. In fact, it takes
enough time that the asynchronous `render()` in Dart Sass tends to be 2-3x
slower than `renderSync()`.

Enter fibers. Fibers are a very cool concept, available in languages like Ruby
and C++, that give the programmer more control over asynchronous functions. They
can even allow a chunk of synchronous code (such as the Sass compiler) to call
asynchronous callbacks (such as the webpack plugin). The `node-fibers` package
did some arcane magick with the V8 virtual machine to implement Fibers in
JavaScript, which allowed Dart Sass to use the fast synchronous code to
implement the asynchronous `render()` API. And for a time, it was great.

### The Death of Fibers

Unfortunately, the arcane magick that `node-fibers` used involved accessing some
parts of V8 that were not officially part of its public API. There was no
guarantee that the interfaces they were using would stay the same from release
to release, and indeed they tended to change fairly regularly. For a long time,
those changes were small enough that it was possible to release a new version of
`node-fibers` that supported them, but with Node.js 16 the luck ran out.

The latest version of V8 involves some major overhauls to its internals. These
will eventually allow it to implement some cool improvements, so its hard to
begrudge, but a side effect is that the APIs `node-fibers` was using are
completely gone without an obvious replacement. This is no one's fault: since
those interfaces weren't part of V8's public API, they were under no obligation
to keep them stable. Sometimes in software that's just the way things go.

## Reclaiming Performance

There are a few options for getting back the performance that's lost by no
longer being able to pass `node-fibers` to `sass.render()`. In order from
nearest to longest term:

### Avoid Asynchronous Plugins

This is something you can do today. If it's at all possible to make the plugins
you pass in to Sass synchronous, you can use the `renderSync()` method which
doesn't need fibers to go fast. This may require rewriting some existing
plugins, but it will pay dividends immediately.

### Embedded Dart Sass

While it's not ready for prime-time yet, the Sass team is working on a project
called "embedded Dart Sass". This involves running Dart Sass as a *subprocess*,
rather than a library, and communicating with it using a special protocol. This
provides several important improvements over the existing alternatives:

* Unlike running `sass` from the command line, this will still work with plugins
  like the webpack importer. In fact, we plan to match the existing JavaScript
  API as closely as possible. This will probably run asynchronous plugins *even
  faster* than synchronous ones.

* Unlike the existing JS-compiled version, this will use the Dart VM. Due to the
  more static nature of the Dart language, the Dart VM runs Sass substantially
  faster than Node.js, which will provide about a 2x speed improvement for large
  stylesheets.

The Node.js host for Embedded Sass is still in active development, but there's
[a beta release] available (with minimal features) if you want to kick the
tires.

[a beta release]: https://www.npmjs.com/package/sass-embedded

### Worker Threads

We've explored the possibility of running the pure-JS Dart Sass in a Node.js
worker thread. Worker threads work a bit like fibers in that they make it
possible for synchronous code to wait for asynchronous callbacks to run.
Unfortunately, they're also *extremely* restrictive about what sorts of
information can be passed across the thread boundary, which makes it much harder
to use them to wrap a complex API like Sass's.

At the moment, the Sass team is focused on Embedded Sass, so we don't have the
spare bandwidth to dive into worker threads as an alternative. That said, we'd
be happy to help a motivated user implement this. If you're interested, follow
up on [the GitHub issue]!

[the GitHub issue]: https://github.com/sass/dart-sass/issues/868

### Reanimating `node-fibers`

There's one other potential solution, although it would take true dedication to
turn into reality. It would in principle be possible to add a new API to V8 that
would *officially* support the hooks `node-fibers` needs to do its good work.
This would allow the package to return gloriously to life and Sass to make
`render()` fast on into the future.

The Sass team has contacted both the V8 team and the owner of `node-fibers`, and
both of them are amenable to this idea in principle. While neither one has the
time to see it through to completion themselves, they've expressed willingness
to help an engineer who's willing to give it a shot.

This isn't a contribution for the faint of heart, though: it requires knowledge
of C++, a willingness to learn at least the basics of the `node-fibers` codebase
and V8's isolate APIs, and skills in both API design and human interaction to
negotiate a stable API that will meet the needs of `node-fibers` *and* that the
V8 team feels comfortable committing to maintain. But if you're interested,
please don't hesitate to [reach out]!

[reach out]: mailto:nweiz@google.com

---
title: "Node Sass is end-of-life"
author: Natalie Weizenbaum
date: 2024-07-24 15:00:00 -8
---

The time has finally come to retire Node Sass. This Node.js wrapper for LibSass
was the first official Sass compiler available in the JavaScript ecosystem and
was a huge part of Sass growing beyond the scope of the Ruby community where it
originated, but it hasn't received a new release in a year and a half and the
most recent set of maintainers no longer have the bandwidth to continue updating
it.

[The npm package] has been marked as deprecated, and [the GitHub repository] has
been archived to mitigate confusion about which Sass repositories are still
being developed. If you're still using Node Sass, we strongly recommend you take
this opportunity to migrate to the primary implementation, [Dart Sass], instead.

[The npm package]: https://www.npmjs.com/package/node-sass
[the GitHub repository]: https://github.com/sass/node-sass
[Dart Sass]: /dart-sass

The [LibSass] implementation that Node Sass used remains deprecated but not yet
end-of-life, as its maintainer Marcel Greter continues to make occasional fixes.
However, there is no longer an officially-supported way to use this
implementation from Node.js.

[LibSass]: https://sass-lang.com/libsass/

I want to take this opportunity to thank everyone who used Node Sass over the
years, as well as the major contributors:

* Michael Mifsud
* Adeel Mujahid
* Andrew Nesbitt
* Nick Schonning
* Marcin Cieślak

And of course all the contributors to the underlying LibSass project as well.
Without you, we wouldn't be here today!

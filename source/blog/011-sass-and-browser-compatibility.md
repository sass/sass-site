---
title: Sass and Browser Compatibility
author: Natalie Weizenbaum
tags: blog
date: 2017-02-10 17:46:00 -8
---

One of the core design principles of Sass has always been to **understand CSS as
little as possible**. As a CSS preprocessor of course we have to understand the
syntax of CSS, but as much as we can we try to avoid caring about the
_semantics_—the meaning behind the styles. This means that Sass has no idea
which properties are valid, which HTML elements actually exist, or even to a
large extent what the syntax of most @-rules is.

We get a lot of benefit from this. The less built-in knowledge Sass has about
CSS, the less likely it is to work poorly with new CSS features. Imagine having
to file a feature request every time you want to use a new CSS property—that
would suck! Instead, older versions of Sass will happily keep working unless the
actual _syntax_ changes, which is much rarer.

Because of this decoupling, we've never needed to worry much about browser
compatibility. Sass just passes whatever CSS its given on through. It's up to
the user to determine what works where, which gives them a lot of flexibility
and gives us designers one fewer tough decision to make.

But despite this general policy, there are always a few cases where CSS
knowledge turns out to be necessary. A big one is `@extend`, which needs to know
a lot about the meaning of selectors to properly unify them and weed out
duplicates. Property values sometimes require semantic knowledge as well—we have
to know how to interpret colors, for example.

One of those cases has leapt up to bite us. Long ago, we made the decision to
always emit transparent colors as the keyword `transparent`, because it was
supported on IE6 through 8 and the alternative `rgba()` syntax was not. But it
turns out that the opposite is true for more recent versions: in IE10, `:hover`
styles aren't triggered for elements with `background-color: transparent` but
they are with `background-color: rgba(0, 0, 0, 0)`. Thanks, IE!

So we were faced with a dilemma. Keep the existing behavior which was compatible
with old outdated browsers that no one uses, or choose a new behavior that works
better with modern browsers? The choice was pretty clear: we decided to always
emit `rgba(0, 0, 0, 0)`.

In addition, we wanted to come up with a general rule to guide us in determining
which browsers we were willing to consider outdated, and which we would continue
to support (whatever that meant for the behavior in question). We decided that
if a change would negatively affect less than 2% of the global market share of
browsers according to [StatCounter GlobalStats](http://gs.statcounter.com/), we
were willing to make it.

This limit isn't set in stone. We reserve the right to change it in the future,
and to make individual decisions that may affect more browsers. But this is the
general guideline we're paying attention to, and we wanted you all to know.

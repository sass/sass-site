---
title: Dropping Support For Old Ruby Versions
author: Natalie Weizenbaum
date: 2016-02-29 14:25:00 -8
---

As of version 3.5, Ruby Sass will drop support for Ruby 1.8.7 and Ruby 1.9.3. We
will continue to support Ruby 2.0.0 and higher.

Ruby 1.8.7 was retired by the Ruby maintainers in [June
2013](https://www.ruby-lang.org/en/news/2013/06/30/we-retire-1-8-7/), and Ruby
1.9.3 was retired in [February
2015](https://www.ruby-lang.org/en/news/2015/02/23/support-for-ruby-1-9-3-has-ended/).
Despite that, we continued to maintain support for older versions because Ruby
1.8.7 was installed by default on Mac OS X through Mountain Lion (which was
released in July 2012).

There are many users of Sass who aren't independently users of Ruby. We wanted
to minimize the amount of work these users need to do to use Sass, which means
letting it run on their machine without also requiring them to install a new
language.

That decision wasn't without costs, though. Most seriously, recent versions of
the [listen package](https://github.com/guard/listen) didn't support older Ruby
versions, and older versions of RubyGems weren't clever enough to avoid
downloading them on incompatible Ruby versions. To work around this, we bundled
an older version of `listen` with Sass and used it for users who didn't have a
compatible version installed elsewhere, but this produced constant compatibility
headaches.

These headaches led us to reevaluate our policy for supporting older Ruby
versions. We still cared a lot about users' built-in Ruby versions, but we
couldn't support them forever. We needed a way to determine when the benefit of
dropping support outweighed the costs.

We decided to use the analytics data for sass-lang.com to approximate the
proportion of our user base that was still using operating systems that shipped
with old Ruby versions. Before we looked at the data, we decided that we would
drop support for a Ruby version if it had been retired by the Ruby maintainers,
_and_ less than 2% of our visitors across the previous month were using an OS
that shipped it by default.

Once we did that, we looked at the data. 34.3% of our visitors were using OS X,
and 1.4% of OS X users were using Mountain Lion or earlier. We were clearly able
to drop support for 1.8.7. In addition, 1.9.3 was never shipped with OS X so we
were able to drop it as well. Ruby 2.0.0, despite retired [last
week](https://www.ruby-lang.org/en/news/2016/02/24/support-plan-of-ruby-2-0-0-and-2-1/),
was shipped with the most recent OS X version—we won't be dropping support for
it any time soon.

<img class="center" src="/assets/img/blog/006-sass-visitors.png" alt="sass-lang.com visitors by operating system">

For Sass 3.4, we're just planning on printing deprecation messages for users of
deprecated Ruby versions. But once 3.5 releases, support will be fully dropped
and we'll switch to using `listen` as a proper gem dependency. If you're on an
older version of OS X and you haven't upgraded your Ruby version, there are some
simple instructions [on the Ruby
site](https://www.ruby-lang.org/en/documentation/installation/#homebrew) for how
to do so easily using Homebrew.

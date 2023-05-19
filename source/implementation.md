---
layout: has_no_sidebars
title: Implementation Guide
introduction: >
  Sass has a thriving community of implementations, with more being produced all
  the time. The core team loves to see new implementations thrive and mature,
  and they want to help out in any way they can.
---

<ul class="list-tiled">
<li>

<h2>Resources</h2>

- [`sass-spec`](https://github.com/sass/sass-spec) is a suite of
  implementation-agnostic test cases for verifying that a Sass
  implementation behaves correctly. It's the best way to track your
  implementation's compatibility with the Sass reference implementation.

- [How `@extend` Works](https://gist.github.com/nex3/7609394) is a
  fairly comprehensive run-down of the algorithm used by Sass's
  trickiest feature. Natalie still says that the implementation of
  `@extend` is the hardest code she's ever had to write, but luckily you
  don't have to figure it out from scratch.

- **Reach out!** If you're working on a new implementation, we want to
  hear about it. Send an email to [Natalie](mailto:nex342@gmail.com) and
  [Chris](mailto:chris@eppsteins.net), tell us about the cool work
  you're doing, and ask about any corners of the language that don't
  quite make sense.

</li>
<li>

<h2>Requirements</h2>

We whole-heartedly love new implementations of Sass, but we do have a
few restrictions that we ask those implementations to follow in order to
call themselves "Sass", "Sass implementations", or the like. Sass is a
community as much as it is a language, and it's important that all
implementations are willing to work for the good of the community.

First, we ask that every implementation adopt the [Sass community
guidelines](/community-guidelines) for their own implementation-specific
communities. Much of what makes the Sass community strong is a culture
of kindness and respect, and having clear and explicit guidelines helps
produce that culture.

Second, we ask that implementations not extend the language without
agreement from the other major implementations and from the language
designers, Natalie and Chris. The only reason a Sass community exists at
all is because the language enables styles and frameworks to be shared
among designers, and it's crucial for sharing that Sass code that works
for one implementation works the same for all of them. In addition, it's
important that there be a unified vision for the language design.

</li>
<li>

<h2>Making Language Changes</h2>

Sass can still evolve as a language, of course. We have [a process][] for
proposing and iterating on new language features that anyone can
participate in. Language changes are discussed collaboratively, with
particular weight given to the maintainers of mature Sass implementations.
Attempts will be made to reach consensus with all stakeholders. However,
this may be impossible in some circumstances, and the ultimate say lies
with the lead designer of Sass, Natalie.

[a process]: https://github.com/sass/sass/blob/main/CONTRIBUTING.md

</li>
</ul>

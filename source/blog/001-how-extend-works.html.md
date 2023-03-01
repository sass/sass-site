---
title: How @extend Works
author: Natalie Weizenbaum
tags: blog
layout: base
# date: 2013-11-22 16:57 -8
---

_This was originally published as [a gist](https://gist.github.com/nex3/7609394)_.

[Aaron Leung](https://github.com/akhleung) is working on
[hcatlin/libsass](http://github.com/hcatlin/libsass) and was wondering how
`@extend` is implemented in the Ruby implementation of Sass. Rather than just
tell him, I thought I'd write up a public document about it so anyone who's
porting Sass or is just curious about how it works can see.

Note that this explanation is simplified in numerous ways. It's intended to
explain the most complex parts of a basic correct `@extend` transformation, but
it leaves out numerous details that will be important if full Sass compatibility
is desired. This should be considered an explication of the groundwork for
`@extend`, upon which full support can be built. For a complete understanding of
`@extend`, there's no substitute for consulting the [Ruby Sass
code](http://github.com/sass/ruby-sass/tree/master/lib/sass) and [its
tests](https://github.com/sass/ruby-sass/blob/master/test/sass/extend_test.rb).

This document assumes familiarity with the selector terminology defined in the
[Selectors Level 4](http://dev.w3.org/csswg/selectors4/#syntax) spec. Throughout
the document, selectors will be treated interchangeably with lists or sets of
their components. For example, a complex selector may be treated as a list of
compound selectors or a list of lists of simple selectors.

## Primitives

Following are a set of primitive objects, definitions, and operations that are
necessary for implementing `@extend`. Implementing these is left as an exercise
for the reader.

- A selector object is obviously necessary, since `@extend` is all about
  selectors. Selectors will need to be parsed thoroughly and semantically. It's
  necessary for the implementation to know a fair amount of the meaning behind
  the various different forms of selectors.

- A custom data structure I call a "subset map" is also necessary. A subset map
  has two operations: `Map.set(Set, Object)` and `Map.get(Set) => [Object]`. The
  former associates a value with a set of keys in the map. The latter looks up
  all values that are associated with _subsets_ of a set of keys. For example:

        map.set([1, 2], 'value1')
        map.set([2, 3], 'value2)
        map.set([3, 4], 'value3')
        map.get([1, 2, 3]) => ['value1', 'value2']

- A selector `S1` is a "superselector" of a selector `S2` if every element
  matched by `S2` is also matched by `S1`. For example, `.foo` is a
  superselector of `.foo.bar`, `a` is a superselector of `div a`, and `*` is a
  superselector of everything. The inverse of a superselector is a
  "subselector".

- An operation `unify(Compound Selector, Compound Selector) => Compound
Selector` that returns a selector that matches exactly those elements matched
  by both input selectors. For example, `unify(.foo, .bar)` returns `.foo.bar`.
  This only needs to work for compound or simpler selectors. This operation can
  fail (e.g. `unify(a, h1)`), in which case it should return `null`.

- An operation `trim([Selector List]) => Selector List` that removes complex
  selectors that are subselectors of other complex selectors in the input. It
  takes the input as multiple selector lists and only checks for subselectors
  across these lists since the prior `@extend` process won't produce intra-list
  subselectors. For example, if it's passed `[[a], [.foo a]]` it would return
  `[a]` since `.foo a` is a subselector of `a`.

- An operation `paths([[Object]]) => [[Object]]` that returns a list of all
  possible paths through a list of choices for each step. For example,
  `paths([[1, 2], [3], [4, 5, 6]])` returns `[[1, 3, 4], [1, 3, 5], [1, 3, 6],
[2, 3, 4], [2, 3, 5], [2, 3, 6]]`.

## The Algorithm

The `@extend` algorithm requires two passes: one to record the `@extend`s that
are declared in the stylesheet, and another to transform selectors using those
`@extend`s. This is necessary, since `@extend`s can affect selectors earlier in
the stylesheet as well.

### Recording Pass

In pseudocode, this pass can be described as follows:

```
let MAP be an empty subset map from simple selectors to (complex selector, compound selector) pairs
for each @extend in the document:
  let EXTENDER be the complex selector of the CSS rule containing the @extend
  let TARGET be the compound selector being @extended
  MAP.set(TARGET, (EXTENDER, TARGET))
```

### Transformation Pass

The transformation pass is more complicated than the recording pass. It's
described in pseudocode below:

```
let MAP be the subset map from the recording pass

define extend_complex(COMPLEX, SEEN) to be:
  let CHOICES be an empty list of lists of complex selectors
  for each compound selector COMPOUND in COMPLEX:
    let EXTENDED be extend_compound(COMPOUND, SEEN)
    if no complex selector in EXTENDED is a superselector of COMPOUND:
      add a complex selector composed only of COMPOUND to EXTENDED
    add EXTENDED to CHOICES

  let WEAVES be an empty list of selector lists
  for each list of complex selectors PATH in paths(CHOICES):
    add weave(PATH) to WEAVES
  return trim(WEAVES)

define extend_compound(COMPOUND, SEEN) to be:
  let RESULTS be an empty list of complex selectors
  for each (EXTENDER, TARGET) in MAP.get(COMPOUND):
    if SEEN contains TARGET, move to the next iteration

    let COMPOUND_WITHOUT_TARGET be COMPOUND without any of the simple selectors in TARGET
    let EXTENDER_COMPOUND be the last compound selector in EXTENDER
    let UNIFIED be unify(EXTENDER_COMPOUND, COMPOUND_WITHOUT_TARGET)
    if UNIFIED is null, move to the next iteration

    let UNIFIED_COMPLEX be EXTENDER with the last compound selector replaced with UNIFIED
    with TARGET in SEEN:
      add each complex selector in extend_complex(UNIFIED_COMPLEX, SEEN) to RESULTS
  return RESULTS

for each selector COMPLEX in the document:
  let SEEN be an empty set of compound selectors
  let LIST be a selector list comprised of the complex selectors in extend_complex(COMPLEX, SEEN)
  replace COMPLEX with LIST
```

A keen reader will have noticed an undefined function used in this pseudocode:
`weave`. `weave` is much more complicated than the other primitive operations,
so I wanted to explain it in detail.

### Weave

At a high level, the "weave" operation is pretty easy to understand. It's best
to think of it as expanding a "parenthesized selector". Imagine you could write
`.foo (.bar a)` and it would match every `a` element that has both a `.foo`
parent element _and_ a `.bar` parent element. `weave` makes this happen.

In order to match this `a` element, you need to expand `.foo (.bar a)` into the
following selector list: `.foo .bar a, .foo.bar a, .bar .foo a`. This matches
all possible ways that `a` could have both a `.foo` parent and a `.bar` parent.
However, `weave` does not in fact emit `.foo.bar a`; including merged selectors
like it would cause exponential output size and provide very little utility.

This parenthesized selector is passed in to `weave` as a list of complex
selectors. For example, `.foo (.bar a)` would be passed in as `[.foo, .bar a]`.
Similarly, `(.foo div) (.bar a) (.baz h1 span)` would be passed in as `[.foo
div, .bar a, .baz h1 span]`.

`weave` works by moving left-to-right through the parenthesized selector,
building up a list of all possible prefixes and adding to this list as each
parenthesized component is encountered. Here's the pseudocode:

```
let PAREN_SELECTOR be the argument to weave(), a list of complex selectors
let PREFIXES be an empty list of complex selectors

for each complex selector COMPLEX in PAREN_SELECTOR:
  if PREFIXES is empty:
    add COMPLEX to PREFIXES
    move to the next iteration

  let COMPLEX_SUFFIX be the final compound selector in COMPLEX
  let COMPLEX_PREFIX be COMPLEX without COMPLEX_SUFFIX
  let NEW_PREFIXES be an empty list of complex selectors
  for each complex selector PREFIX in PREFIXES:
    let WOVEN be subweave(PREFIX, COMPLEX_PREFIX)
    if WOVEN is null, move to the next iteration
    for each complex selector WOVEN_COMPLEX in WOVEN:
      append COMPLEX_SUFFIX to WOVEN_COMPLEX
      add WOVEN_COMPLEX to NEW_PREFIXES
  let PREFIXES be NEW_PREFIXES

return PREFIXES
```

This includes yet another undefined function, `subweave`, which contains most of
the logic of weaving together selectors. It's one of the most complicated pieces
of logic in the entire `@extend` algorithm -- it handles selector combinators,
superselectors, subject selectors, and more. However, the semantics are
extremely simple, and writing a baseline version of it is very easy.

Where `weave` weaves together many complex selectors, `subweave` just weaves
two. The complex selectors it weaves together are considered to have an implicit
identical trailing compound selector; for example, if it's passed `.foo .bar`
and `.x .y .z`, it weaves them together as though they were `.foo .bar E` and
`.x .y .z E`. In addition, it doesn't merge the two selectors in most cases, so
it would just return `.foo .bar .x .y .z, .x .y .z .foo .bar` in this case. An
extremely naive implementation could just return the two orderings of the two
arguments and be correct a majority of the time.

Delving into the full complexity of `subweave` is out of scope here, since it
falls almost entirely into the category of advanced functionality that this
document is intentionally avoiding. The code for it is located in
[`lib/sass/selector/sequence.rb`](https://github.com/sass/ruby-sass/blob/master/lib/sass/selector/sequence.rb)
and should be consulted when attempting a serious implementation.

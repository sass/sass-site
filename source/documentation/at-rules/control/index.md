---
title: Flow Control Rules
introduction: >
  Sass provides a number of at-rules that make it possible to control whether
  styles get emitted, or to emit them multiple times with small variations. They
  can also be used in [mixins](/documentation/at-rules/mixin) and
  [functions](/documentation/at-rules/function) to write small algorithms to
  make writing your Sass easier. Sass supports four flow control rules.
---

- [`@if`](/documentation/at-rules/control/if) controls whether or not a block is
  evaluated.

- [`@each`](/documentation/at-rules/control/each) evaluates a block for each
  element in a [list][] or each pair in a [map][].

- [`@for`](/documentation/at-rules/control/for) evaluates a block a certain
  number of times.

- [`@while`](/documentation/at-rules/control/while) evaluates a block until a
  certain condition is met.

[list]: /documentation/values/lists
[map]: /documentation/values/maps

---
title: "Request for Comments: HWB Functions"
author: Natalie Weizenbaum
date: 2020-10-06 16:00:00 -8
---

The CSS working group has been up to all sorts of exciting stuff recently in the
[Color Level 4] spec, and the Sass team is starting to think about how to
integrate those cool new features into Sass's color model. We need more time to
hammer out exactly the right designs for complex features like the Lab color
space, but that doesn't mean we can't add a few new color goodies.

[Color Level 4]: https://www.w3.org/TR/css-color-4/

Today we're announcing a proposal for one such feature: built-in Sass functions
for [HWB] colors! Once this proposal (drafted by Sass core team member [Miriam
Suzanne]) is accepted and implemented, you'll be able to write colors in HWB
syntax and adjust their whiteness and blackness the same way you can adjust a
color's saturation and lightness today.

[HWB]: https://www.w3.org/TR/css-color-4/#the-hwb-notation
[Miriam Suzanne]: https://www.miriamsuzanne.com/

## The Functions

Here are the new and improved functions this proposal adds:

### `color.hwb()`

The `color.hwb()` function defines a color using its hue, whiteness, and
blackness. Like the existing `rgb()` and `hsl()` functions, It can either use
the space-separated syntax defined in [the spec][HWB] (`hwb(270 20% 40%)`) or
the more Sass-y comma-separated syntax (`hwb(270, 20%, 40%)`). Because HWB
colors use the same sRGB colorspace as all other Sass color values, colors
created this way are fully compatible with all existing Sass color functions and
will be emitted as their RGB equivalents for maximum browser compatibility.

Note that *unlike* `rgb()` and `hsl()`, the proposal doesn't add this function
to the global scope yet. This is because Sass has a policy of never adding
support for new CSS syntax before at least one browser implements it. Specs have
a tendency to change until they're locked in by browsers, and if Sass ends up
supporting something different than the browsers themselves that's bad news!

### `color.whiteness()` and `color.blackness()`

These functions work like the `color.saturation()` and `color.lightness()`
functions do for HSL colors. They even work for colors that weren't created with
`color.hwb()`, so you can use them to check how pale or dark any color is.

Because HWB colors have the same notion of "hue" as HSL colors, the existing
`color.hue()` function already works perfectly!

### `color.scale()`, `color.adjust()`, and `color.change()`

All three color modification functions now support `$whiteness` and `$blackness`
arguments. If you want a color (again no matter how it was created) to be 20%
whiter, just pass it to `color.scale($color, $whiteness: 20%)` and there you go!

## Let us know what you think!

If you’re interested in learning more about this proposal, [read it in full] on
GitHub. It’s open for comments and revisions for the next month, so if you’d
like to see something change please [file an issue] and we can discuss it!

[read it in full]: https://github.com/sass/sass/tree/main/proposal/color-4-hwb.md
[file an issue]: https://github.com/sass/sass/issues/new

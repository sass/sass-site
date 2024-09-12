---
title: "Sass color spaces & wide gamut colors"
author: Miriam Suzanne
date: 2024-09-11 13:00:00 -8
---

Wide gamut colors are coming to Sass!

I should clarify. Wide gamut CSS color formats like `oklch(…)` and `color(display-p3 …)` have been available in all major browsers since May, 2023. But even before that, these new color formats were *allowed* in Sass. This is one of my favorite features of Sass: most new CSS *just works*, without any need for "official" support or updates. When Sass encounters unknown CSS, it passes that code along to the browser. Not everything needs to be pre-processed.

Often, that's all we need. When Cascade Layers and Container Queries rolled out in browsers, there was nothing more for Sass to do. But the new CSS color formats are a bit different. Since colors are a first-class data type in Sass, we don't always want to pass them along *as-is*. We often want to manipulate and manage colors before they go to the browser.

Already know all about color spaces? [Skip ahead to the new Sass features](#css-color-functions-in-sass)!

## The color format trade-off

CSS has historically been limited to `sRGB` color formats, which share two main features:

- They use an underlying [RGB color model](https://en.wikipedia.org/wiki/RGB_color_model) for representing & manipulating colors mathematically by controlling the relative amounts of `red`, `green`, and `blue` light.
- They can only represent colors in the [`sRGB` color gamut](https://en.wikipedia.org/wiki/SRGB) -- the default range of color that can be displayed on color monitors since the mid 1990s.

### Clear gamut boundaries

The previously available formats in CSS -- named colors (e.g. `red`), `hex` colors (e.g. `#f00`), and color functions (e.g. `rgb()`/`rgba()`, `hsl()`/`hsla()`, and more recently `hwb()`) -- are all ways of describing `sRGB` colors. Named colors are special, but the other formats use a 'coordinate' system, as though the colors of the gamut were projected into 3d space:

<figure>
<div style="display: grid; gap: var(--sl-gutter--quarter); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
<img src="/assets/img/blog/042-srgb.png" alt="sRGB gamut rendered in sRGB space forms a rainbow colored cube" width=600 height=600 />
<img src="/assets/img/blog/042-srgb-hsl.png" alt="sRGB gamut rendered in hsl space forms a rainbow-edged cylinder with black at the bottom and white at the top" width=600 height=600 />
<img src="/assets/img/blog/042-srgb-hwb.png" alt="sRGB gamut rendered in hwb space forms a rainbow-core top surface with a black-to-gray bottom and gray-to-white outside edge" width=600 height=600 />
</div>
<figcaption>
Images generated using
<a href="https://facelessuser.github.io/coloraide/demos">ColorAide</a>
by Isaac Muse.
</figcaption>
<figure>

Look at those nice, geometric shapes! RGB gives us a rainbow cube, while HSL and HWB (with their "polar" `hue` channels) arrange those same colors into cylinders. The clean boundaries make it easy for us to know (mathematically) what colors are *in gamut* or *out of gamut*. In `rgb()` we use values of `0-255`. Anything inside that range will be inside the cube, but if a channel goes below `0` or above `255`, we're no longer inside the `sRGB` gamut. In `hsl()` and `hwb()` the `hue` coordinates can keep going around the circle without ever reaching escape velocity, but the `saturation`, `lightness`, `whiteness`, and `blackness` channels go cleanly from `0-1` or `0%-100%`. Again, anything outside that range is outside the color space.

### Matching human perception

But that simplicity comes with limitations. The most obvious is that monitors keep getting better. These days, many monitors can display colors beyond `sRGB`, especially extending the range of bright greens available. If we simply extend our shapes with the new colors available, we're no longer dealing with clean geometry!

<div style="display: grid; gap: var(--sl-gutter--quarter); grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
<img src="/assets/img/blog/042-p3-srgb.png" alt="display-p3 gamut rendered in sRGB space adds unequal red and green horns to the sRGB cube" width=600 height=600 />
<img src="/assets/img/blog/042-p3-hsl.png" alt="display-p3 gamut rendered in hsl space creates a boot-like bulge of green near the base of the hsl cylinder" width=600 height=600 />
</div>

The crisp edges and clean math of `sRGB` formats were only possible because we knew exactly what colors could be displayed, and we arranged those colors to fit perfectly into a box. But human color perception is not so clear-cut, and it doesn't align perfectly with the gamut of any monitors on the market. When we attempt to space all the same colors *evenly* based on human perception rather than simple math, we get an entirely different shape with swooping edges. This is the `display-p3` gamut in `oklch` space:

<img src="/assets/img/blog/042-p3-oklch.png" alt="display-p3 gamut rendered in oklch space forms a skewed cube with a conic black base" width=600 height=600 />

The practical difference is particularly noticeable when we compare colors of the same 'lightness' in `hsl` vs `oklch`. Humans perceive yellow hues as lighter than blues. By scaling them to fit in the same range, `hsl` gives us a yellow that is much brighter than the blue:

<img src="/assets/img/blog/042-blue-yellow.jpg" alt="on the left a blue and much brighter yellow, on the right our yellow is much darker to match the blue tone" width=753 height=209 />

## New CSS formats give us the choice

Moving forward, there are two directions we could go with wide gamut colors:

- Color formats that re-fit larger and larger gamuts into simple coordinates, stretching the colors to preserve clean, geometric boundaries.
- Color formats that maintain their *perceptually uniform* spacing, without any regard for specific gamuts.

On the one hand, clean boundaries allow us to easily stay inside the range of available colors. Without those boundaries, it would be easy to *accidentally* request colors that aren't even physically possible. On the other hand, we expect these colors to be *perceived* by *other humans* -- and we need to make things *look* consistent, with enough contrast to be readable.

The [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) defines a number of new CSS color formats. Some of them maintain geometric access to specific color spaces. Like the more familiar `rgb()` and `hsl()` functions, the newer `hwb()` function still describes colors in the `sRGB` gamut, using `hue`, `whiteness`, and `blackness` channels.  It's an interesting format, and [I've written about it before](https://www.miriamsuzanne.com/2022/06/29/hwb-clamping/).

The rest of the gamut-bounded spaces are available using the `color(<space> <3-channels> / <alpha>)` function. Using that syntax we can define colors in `sRGB`, `srbg-linear`, `display-p3` (common for modern monitors), `a98-rgb`, `prophoto-rgb`, and `rec2020`. Each of these maps the specified gamut onto a range of (cubic) coordinates from `0-1` or `0%-100%`. Nice and clean.

In the same `color()` function, we can also access the 'device independent' (and gamut-less) `xyz` color spaces -- often used as an international baseline for converting between different color models. I won't get into [white points](https://www.w3.org/TR/css-color-4/#white-point) here, but we can specify `xyz-d65` (the default) explicitly, or use `xyz-d50` instead.

Working outwards from `xyz`, we get a number of new *theoretically unbounded* color formats -- prioritizing *perceptually uniform* distribution over clean geometry. These are available in functions of their own, including `lab()` (`lightness`, `a`, and `b`) and `lch()` (`lightness`, `chroma`, and `hue`) along with the newer 'ok' versions of each -- `oklab()` and `oklch()`. If you want the full history of these formats, [Eric Portis has written a great explainer](https://ericportis.com/posts/2024/okay-color-spaces/).

## TL;DR top priority new formats

For the color experts, it's great to have all this flexibility. For the rest of us, there are a few stand-out formats:

- `color(display-p3 …)` provides access to a wider gamut of colors, which are available on many modern displays, while maintaining a clear set of gamut boundaries.
- `oklch(…)` is the most intuitive and perceptually uniform space to work in, a newer alternative to `hsl(…)` -- `chroma` is very similar to `saturation`. But there are few guard rails here, and it's easy to end up outside the gamuts that any screen can possibly display. The coordinate system is still describing a cylinder, but the edges of human perception and display technology don't map neatly into that space.
- For transitions and gradients, if we want to go directly between hues (instead of going around the color wheel), `oklab(…)` is a good linear option. Usually, a transition or gradient between two in-gamut colors will stay in gamut -- but we can't always rely on that when we're dealing with extremes of saturation or lightness.

## CSS color functions in Sass

Sass now accepts all the new CSS formats, and treats them as first-class *colors* that we can manipulate, mix, convert, and inspect. These functions are all available globally:

- `lab()`, `oklab()`, `lch()`, and `oklch()`
-  `color()` using the `sRGB`, `srgb-linear`, `display-p3`, `a98-rgb`, `prophoto-rgb`, `rec2020`, `xyz`, `xyz-d65`, and `xyz-d50` color spaces
- `hwb()` (Sass previously had a `color.hwb()` function, which is now deprecated in favor of the global function)

The Sass color functions use the same syntax as the CSS functions, which means that a given color can be represented in a variety of different spaces. For example, these are all the same color:

{% codeExample 'color-fns', false %}
  @debug MediumVioletRed;
  @debug #C71585;
  @debug hsl(322.2 80.91% 43.14%);
  @debug oklch(55.34% 0.2217 349.7);
  @debug color(display-p3 0.716 0.1763 0.5105);
  ===
  @debug MediumVioletRed
  @debug #C71585
  @debug hsl(322.2 80.91% 43.14%)
  @debug oklch(55.34% 0.2217 349.7)
  @debug color(display-p3 0.716 0.1763 0.5105)
{% endcodeExample %}

## Sass colors hold their space

Historically, both CSS and Sass would treat the different color-spaces as *interchangeable*. When all the color formats describe the same color gamut using the same underlying model, you can provide a color using `hsl()` syntax, and the parser can eagerly convert it to `rgb()` without risking any data loss. That's no longer the case for modern color spaces.

In general, any color defined in a given space will remain in that space, and be emitted in that space. The space is defined by the function used, either one of the named spaced passed to `color()`, or the function name (e.g. `lab` for colors defined using the `lab()` function).

However, the `rgb`, `hsl`, and `hwb` spaces are considered "legacy spaces", and often get special handling for the sake of backwards compatibility. Legacy colors are still emitted in the most backwards-compatible format available. This matches CSS’s own backwards-compatibility behavior. Colors defined using hex notation or CSS color names are also considered part of the legacy `rgb` color space.

Sass provides a variety of tools for inspecting and working with these color spaces:

- We can inspect the space of a color using `color.space($color)`
- We can ask if the color is in a legacy space with `color.is-legacy($color)`
- We can *convert* a color from one space to another using `color.to-space($color, $space)`

All of these functions are provided by the built-in [Sass Color Module](https://sass-lang.com/documentation/modules/color/):

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $brand: MediumVioletRed;

  // results: rgb, true
  @debug color.space($brand);
  @debug color.is-legacy($brand);

  // result: oklch(55.34% 0.2217 349.7)
  @debug color.to-space($brand, 'oklch');

  // results: oklch, false
  @debug color.space($brand);
  @debug color.is-legacy($brand);
  ===
  @use 'sass:color'
  $brand: MediumVioletRed

  // results: rgb, true
  @debug color.space($brand)
  @debug color.is-legacy($brand)

  // result: oklch(55.34% 0.2217 349.7)
  @debug color.to-space($brand, 'oklch')

  // results: oklch, false
  @debug color.space($brand)
  @debug color.is-legacy($brand)
{% endcodeExample %}

Once we convert a color between spaces, we no longer consider those colors to be *equal*. But we can ask if they would render as 'the same' color, using the `color.same()` function:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $orange-rgb: #ff5f00;
  $orange-oklch: oklch(68.72% 20.966858279% 41.4189852913deg);

  // result: false
  @debug $orange-rgb == $orange-oklch;

  // result: true
  @debug color.same($orange-rgb, $orange-oklch);
  ===
  @use 'sass:color'
  $orange-rgb: #ff5f00
  $orange-oklch: oklch(68.72% 20.966858279% 41.4189852913deg)

  // result: false
  @debug $orange-rgb == $orange-oklch

  // result: true
  @debug color.same($orange-rgb, $orange-oklch)
{% endcodeExample %}

We can inspect the individual channels of a color using `color.channel()`. By default, it only supports channels that are available in the color's own space, but we can pass the `$space` parameter to return the value of the channel value after converting to the given space:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $brand: hsl(0 100% 25.1%);

  // result: 25.1%
  @debug color.channel($brand, "lightness");

  // result: 37.67%
  @debug color.channel($brand, "lightness", $space: oklch);
  ===
  @use 'sass:color';
  $brand: hsl(0 100% 25.1%)

  // result: 25.1%
  @debug color.channel($brand, "lightness")

  // result: 37.67%
  @debug color.channel($brand, "lightness", $space: oklch)
{% endcodeExample %}

CSS has also introduced the concept of 'powerless' and 'missing' color channels. For example, an `hsl` color with `0%` lightness will *always be black*. In that case, we can consider both the `hue` and `saturation` channels to be powerless. Changing their value won't have any impact on the resulting color. Sass allows us to ask if a channel is powerless using the `color.is-powerless()` function:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $grey: hsl(0 0% 60%);

  // result: true, because saturation is 0
  @debug color.is-powerless($grey, "hue");

  // result: false
  @debug color.is-powerless($grey, "lightness");
  ===
  @use 'sass:color';
  $grey: hsl(0 0% 60%);

  // result: true, because saturation is 0
  @debug color.is-powerless($grey, "hue")

  // result: false
  @debug color.is-powerless($grey, "lightness")
{% endcodeExample %}

Taking that a step farther, CSS also allows us to explicitly mark a channel as 'missing' or unknown. That can happen automatically if we convert a color like `gray` into a color space like `oklch` -- we don't have any information about the `hue`. We can also create colors with missing channels explicitly by using the `none` keyword, and inspect if a color channel is missing with the `color.is-missing()` function:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $brand: hsl(none 100% 25.1%);

  // result: false
  @debug color.is-missing($brand, "lightness");

  // result: true
  @debug color.is-missing($brand, "hue");
  ===
  @use 'sass:color'
  $brand: hsl(none 100% 25.1%)

  // result: false
  @debug color.is-missing($brand, "lightness")

  // result: true
  @debug color.is-missing($brand, "hue")
{% endcodeExample %}

Like CSS, Sass maintains missing channels where they can be meaningful, but treats them as a value of `0` when a channel value is required.

## Manipulating Sass colors

The existing `color.scale()`, `color.adjust()`, and `color.change()` functions will continue to work as expected. By default, all color manipulations are performed *in the space provided by the color*. But we can now also specify an explicit color space for transformations:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $brand: hsl(0 100% 25.1%);

  // result: hsl(0 100% 43.8%)
  @debug color.scale($brand, $lightness: 25%);

  // result: hsl(5.76 56% 45.4%)
  @debug color.scale($brand, $lightness: 25%, $space: oklch);
  ===
  @use 'sass:color'
  $brand: hsl(0 100% 25.1%)

  // result: hsl(0 100% 43.8%)
  @debug color.scale($brand, $lightness: 25%)

  // result: hsl(5.76 56% 45.4%)
  @debug color.scale($brand, $lightness: 25%, $space: oklch)
{% endcodeExample %}

Note that the returned color is still returned in the original color space, even when the adjustment is performed in a different space. That way we can start to use more advanced color spaces like `oklch` where they are useful, without necessarily relying on browsers to support those formats.

The existing `color.mix()` function will also maintain existing behavior *when both colors are in legacy color spaces*. Legacy mixing is always done in `rgb` space. We can opt into other mixing techniques using the new `$method` parameter, which is designed to match the CSS specification for describing [interpolation methods](https://www.w3.org/TR/css-color-4/#interpolation-space) – used in CSS gradients, filters, animations, and transitions as well as the new CSS `color-mix()` function.

For legacy colors, the method is optional. But for non-legacy colors, a method is required. In most cases, the method can simply be a color space name. But when we're using a color space with "polar hue" channel (such as `hsl`, `hwb`, `lch`, or `oklch`) we can also specify the *direction* we want to move around the color wheel: `shorter hue`, `longer hue`, `increasing hue`, or `decreasing hue`:

{% codeExample 'color-fns', false %}
  @use 'sass:color';

  // result: #660099
  @debug color.mix(red, blue, 40%);

  // result: rgb(176.2950613593, -28.8924497904, 159.1757183525)
  @debug color.mix(red, blue, 40%, $method: lab);

  // result: rgb(-129.55249236, 149.0291922672, 77.9649510422)
  @debug color.mix(red, blue, 40%, $method: oklch longer hue);
  ===
  @use 'sass:color'

  // result: #660099
  @debug color.mix(red, blue, 40%)

  // result: rgb(176.2950613593, -28.8924497904, 159.1757183525)
  @debug color.mix(red, blue, 40%, $method: lab)

  // result: rgb(-129.55249236, 149.0291922672, 77.9649510422)
  @debug color.mix(red, blue, 40%, $method: oklch longer hue)
{% endcodeExample %}


In this case, the first color in the mix is considered the "origin" color. Like the other functions above, we can use different spaces for mixing, but the result will always be returned in that origin color space.

## Working with gamut boundaries

So what happens when you go outside the gamut of a given display? Browsers are still debating the details, but everyone agrees we have to display *something*:

- Currently, browsers convert every color into `red`, `green`, and `blue` channels for display. If any of those channels are too high or two low for a given screen, they get *clamped* at the highest or lowest value allowed. This is often referred to as 'channel clipping'. It keeps the math simple, but it can have a weird effect on both the `hue` and `lightness` if some channels are clipped more than others.
- The CSS specification says that preserving `lightness` should be the highest priority, and provides an algorithm for reducing `chroma` until the color is in gamut. That's great for maintaining readable text, but it's more work for browsers, and it can be surprising when colors suddenly lose their vibrance.
- There's been some progress on a compromise approach, reducing `chroma` to get colors inside the `rec2020` gamut, and clipping from there.

Since browser behavior is still unreliable, and some color spaces (*cough* `oklch`) can easily launch us out of any available gamut, it can be helpful to do some gamut management in Sass.

We can use `color.is-in-gamut()` to test if a particular color is in a given gamut. Like our other color functions, this will default to the space the color is defined in, but we can provide a `$space` parameter to test it against a different gamut:

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $extra-pink: color(display-p3 0.951 0.457 0.7569);

  // result: true, for display-p3 gamut
  @debug color.is-in-gamut($extra-pink);

  // result: false, for srgb gamut
  @debug color.is-in-gamut($extra-pink, $space: srgb);
  ===
  @use 'sass:color'
  $extra-pink: color(display-p3 0.951 0.457 0.7569)

  // result: true, for display-p3 gamut
  @debug color.is-in-gamut($extra-pink)

  // result: false, for srgb gamut
  @debug color.is-in-gamut($extra-pink, $space: srgb)
{% endcodeExample %}

We can also use the `color.to-gamut()` function to explicitly move a color so that it is in a particular gamut. Since there are several options on the table, and no clear sense what default CSS will use long-term, this function currently requires an explicit `$method` parameter. The current options are `clip` (as is currently applied by browsers) or `local-minde` (as is currently specified):

{% codeExample 'color-fns', false %}
  @use 'sass:color';
  $extra-pink: oklch(90% 90% 0deg);

  // result: oklch(68.3601568298% 0.290089749 338.3604392249deg)
  @debug color.to-gamut($extra-pink, srgb, clip);

  // result: oklch(88.7173946522% 0.0667320674 355.3282956627deg)
  @debug color.to-gamut($extra-pink, srgb, local-minde);
  ===
  @use 'sass:color'
  $extra-pink: oklch(90% 90% 0deg)

  // result: oklch(68.3601568298% 0.290089749 338.3604392249deg)
  @debug color.to-gamut($extra-pink, srgb, clip)

  // result: oklch(88.7173946522% 0.0667320674 355.3282956627deg)
  @debug color.to-gamut($extra-pink, srgb, local-minde)
{% endcodeExample %}

All legacy and RGB-style spaces represent bounded gamuts of color. Since mapping colors into gamut is a lossy process, it should generally be left to browsers or done with caution. For that reason, out-of-gamut channel values are maintained by Sass, even when converting into gamut-bounded color spaces.

Legacy browsers require colors in the `srgb` gamut. However, most modern displays support the wider `display-p3` gamut.


## Deprecated functions

A number of existing functions only make sense for legacy colors, and so are being deprecated in favor of color-space-friendly functions like `color.channel()` and `color.adjust()`. Eventually these will be removed from Sass entirely, but all the same functionality is still available in the updated functions:

- `color.red()`
- `color.green()`
- `color.blue()`
- `color.hue()`
- `color.saturation()`
- `color.lightness()`
- `color.whiteness()`
- `color.blackness()`
- `adjust-hue()`
- `saturate()`
- `desaturate()`
- `transparentize()`/`fade-out()`
- `opacify()`/`fade-in()`
- `lighten()`/`darken()`

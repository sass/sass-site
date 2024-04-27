---
title: "@function"
table_of_contents: true
introduction: >
  Functions allow you to define complex operations on [SassScript
  values](/documentation/values) that you can re-use throughout your stylesheet.
  They make it easy to abstract out common formulas and behaviors in a readable
  way.
---

Functions are defined using the `@function` at-rule, which is written `@function
<name>(<arguments...>) { ... }`. A function's name can be any Sass identifier
that doesn't begin with `--`. It can only contain [universal statements], as
well as the [`@return` at-rule] which indicates the value to use as the result
of the function call. Functions are called using the normal CSS function syntax.

[universal statements]: /documentation/syntax/structure#universal-statements
[`@return` at-rule]: #return

{% codeExample 'functions' %}
  @function fibonacci($n) {
    $sequence: 0 1;
    @for $_ from 1 through $n {
      $new: nth($sequence, length($sequence)) + nth($sequence, length($sequence) - 1);
      $sequence: append($sequence, $new);
    }
    @return nth($sequence, length($sequence));
  }

  .sidebar {
    float: left;
    margin-left: fibonacci(4) * 1px;
  }
  ===
  @function fibonacci($n)
    $sequence: 0 1
    @for $_ from 1 through $n
      $new: nth($sequence, length($sequence)) + nth($sequence, length($sequence) - 1)
      $sequence: append($sequence, $new)
    @return nth($sequence, length($sequence))

  .sidebar
    float: left
    margin-left: fibonacci(4) * 1px
{% endcodeExample %}

{% funFact %}
  Function names, like all Sass identifiers, treat hyphens and underscores as
  identical. This means that `scale-color` and `scale_color` both refer to the
  same function. This is a historical holdover from the very early days of Sass,
  when it *only* allowed underscores in identifier names. Once Sass added
  support for hyphens to match CSS's syntax, the two were made equivalent to
  make migration easier.
{% endfunFact %}

{% headsUp %}
  While it's technically possible for functions to have side-effects like
  setting [global variables][], this is strongly discouraged. Use [mixins][] for
  side-effects, and use functions just to compute values.

  [global variables]: /documentation/variables#scope
  [mixins]: /documentation/at-rules/mixin
{% endheadsUp %}

## Arguments

{% comment %}
  When changing this section, don't forget to change the mixin arguments
  section as well!
{% endcomment %}

Arguments allow functions' behavior to be customized each time they're called.
The arguments are specified in the `@function` rule after the function's name,
as a list of variable names surrounded by parentheses. The function must be
called with the same number of arguments in the form of [SassScript
expressions][]. The values of these expression are available within the
function's body as the corresponding variables.

[SassScript expressions]: /documentation/syntax/structure#expressions

{% funFact %}
  Argument lists can also have trailing commas! This makes it easier to avoid
  syntax errors when refactoring your stylesheets.
{% endfunFact %}

### Optional Arguments

Normally, every argument a function declares must be passed when that function
is included. However, you can make an argument optional by defining a *default
value* which will be used if that arguments isn't passed. Default values use the
same syntax as [variable declarations][]: the variable name, followed by a colon
and a [SassScript expression][]. This makes it easy to define flexible function
APIs that can be used in simple or complex ways.

[variable declarations]: /documentation/variables
[SassScript expression]: /documentation/syntax/structure#expressions

{% codeExample 'optional-arguments' %}
  @function invert($color, $amount: 100%) {
    $inverse: change-color($color, $hue: hue($color) + 180);
    @return mix($inverse, $color, $amount);
  }

  $primary-color: #036;
  .header {
    background-color: invert($primary-color, 80%);
  }
  ===
  @function invert($color, $amount: 100%)
    $inverse: change-color($color, $hue: hue($color) + 180)
    @return mix($inverse, $color, $amount)


  $primary-color: #036
  .header
    background-color: invert($primary-color, 80%)
{% endcodeExample %}

{% funFact %}
  Default values can be any SassScript expression, and they can even refer to
  earlier arguments!
{% endfunFact %}

### Keyword Arguments

When a function is called, arguments can be passed by name in addition to
passing them by their position in the argument list. This is especially useful
for functions with multiple optional arguments, or with [boolean][] arguments
whose meanings aren't obvious without a name to go with them. Keyword arguments
use the same syntax as [variable declarations][] and [optional arguments][].

[variable declarations]: /documentation/variables
[boolean]: /documentation/values/booleans
[optional arguments]: #optional-arguments

{% codeExample 'keyword-arguments' %}
  $primary-color: #036;
  .banner {
    background-color: $primary-color;
    color: scale-color($primary-color, $lightness: +40%);
  }
  ===
  $primary-color: #036
  .banner
    background-color: $primary-color
    color: scale-color($primary-color, $lightness: +40%)
{% endcodeExample %}

{% headsUp %}
  Because *any* argument can be passed by name, be careful when renaming a
  function's arguments... it might break your users! It can be helpful to keep
  the old name around as an [optional argument][] for a while and printing a
  [warning][] if anyone passes it, so they know to migrate to the new argument.

  [optional argument]: #optional-arguments
  [warning]: /documentation/at-rules/warn
{% endheadsUp %}

### Taking Arbitrary Arguments

Sometimes it's useful for a function to be able to take any number of arguments.
If the last argument in a `@function` declaration ends in `...`, then all extra
arguments to that function are passed to that argument as a [list][]. This
argument is known as an [argument list][].

[list]: /documentation/values/lists
[argument list]: /documentation/values/lists#argument-lists

{% codeExample 'taking-arbitrary-arguments' %}
  @function sum($numbers...) {
    $sum: 0;
    @each $number in $numbers {
      $sum: $sum + $number;
    }
    @return $sum;
  }

  .micro {
    width: sum(50px, 30px, 100px);
  }
  ===
  @function sum($numbers...)
    $sum: 0
    @each $number in $numbers
      $sum: $sum + $number

    @return $sum


  .micro
    width: sum(50px, 30px, 100px)
{% endcodeExample %}

#### Taking Arbitrary Keyword Arguments

Argument lists can also be used to take arbitrary keyword arguments. The
[`meta.keywords()` function][] takes an argument list and returns any extra
keywords that were passed to the function as a [map][] from argument names (not
including `$`) to those arguments' values.

[`meta.keywords()` function]: /documentation/modules/meta#keywords
[map]: /documentation/values/maps

{% funFact %}
  If you don't ever pass an argument list to the [`meta.keywords()` function][],
  that argument list won't allow extra keyword arguments. This helps callers of
  your function make sure they haven't accidentally misspelled any argument
  names.

  [`meta.keywords()` function]: /documentation/modules/meta#keywords
{% endfunFact %}

#### Passing Arbitrary Arguments

Just like argument lists allow functions to take arbitrary positional or keyword
arguments, the same syntax can be used to *pass* positional and keyword
arguments to a function. If you pass a list followed by `...` as the last
argument of a function call, its elements will be treated as additional
positional arguments. Similarly, a map followed by `...` will be treated as
additional keyword arguments. You can even pass both at once!

{% codeExample 'passing-arbitrary-arguments' %}
  $widths: 50px, 30px, 100px;
  .micro {
    width: min($widths...);
  }
  ===
  $widths: 50px, 30px, 100px
  .micro
    width: min($widths...)
{% endcodeExample %}

{% funFact %}
  Because an [argument list][] keeps track of both positional and keyword
  arguments, you use it to pass both at once to another function. That makes it
  super easy to define an alias for a function!

  [argument list]: /documentation/values/lists#argument-lists

  {% codeExample 'passing-arbitrary-arguments-fun-fact' %}
    @function fg($args...) {
      @warn "The fg() function is deprecated. Call foreground() instead.";
      @return foreground($args...);
    }
    ===
    @function fg($args...)
      @warn "The fg() function is deprecated. Call foreground() instead."
      @return foreground($args...)
  {% endcodeExample %}
{% endfunFact %}

## `@return`

The `@return` at-rule indicates the value to use as the result of calling a
function. It's only allowed within a `@function` body, and each `@function` must
end with a `@return`.

When a `@return` is encountered, it immediately ends the function and returns
its result. Returning early can be useful for handling edge-cases or cases where
a more efficient algorithm is available without wrapping the entire function in
an [`@else` block][].

[`@else` block]: /documentation/at-rules/control/if#else

{% codeExample 'return', false %}
  @use "sass:string";

  @function str-insert($string, $insert, $index) {
    // Avoid making new strings if we don't need to.
    @if string.length($string) == 0 {
      @return $insert;
    }

    $before: string.slice($string, 0, $index);
    $after: string.slice($string, $index);
    @return $before + $insert + $after;
  }
  ===
  @use "sass:string"

  @function str-insert($string, $insert, $index)
    // Avoid making new strings if we don't need to.
    @if string.length($string) == 0
      @return $insert


    $before: string.slice($string, 0, $index)
    $after: string.slice($string, $index)
    @return $before + $insert + $after
{% endcodeExample %}

## Other Functions

In addition to user-defined function, Sass provides a substantial [core
library][] of built-in functions that are always available to use. Sass
implementations also make it possible to define [custom functions][] in the host
language. And of course, you can always call [plain CSS functions][] (even ones
with [weird syntax][]).

[core library]: /documentation/modules
[custom functions]: /documentation/js-api/interfaces/LegacySharedOptions#functions
[plain CSS functions]: #plain-css-functions
[weird syntax]: /documentation/syntax/special-functions

### Plain CSS Functions

Any function call that's not either a user-defined or
[built-in](/documentation/modules) function is compiled to a plain CSS function
(unless it uses [Sass argument
syntax](/documentation/at-rules/function/#arguments)). The arguments will be
compiled to CSS and included as-is in the function call. This ensures that Sass
supports all CSS functions without needing to release new versions every time a
new one is added.

{% codeExample 'plain-css-functions', false %}
  @debug var(--main-bg-color); // var(--main-bg-color)

  $primary: #f2ece4;
  $accent: #e1d7d2;
  @debug radial-gradient($primary, $accent); // radial-gradient(#f2ece4, #e1d7d2)
  ===
  @debug var(--main-bg-color)  // var(--main-bg-color)

  $primary: #f2ece4
  $accent: #e1d7d2
  @debug radial-gradient($primary, $accent)  // radial-gradient(#f2ece4, #e1d7d2)
{% endcodeExample %}

{% headsUp %}
  Because any unknown function will be compiled to CSS, it's easy to miss when
  you typo a function name. Consider running a [CSS linter][] on your
  stylesheet's output to be notified when this happens!

  [CSS linter]: https://stylelint.io/
{% endheadsUp %}

{% funFact %}
  Some CSS functions, like `calc()` and `element()` have unusual syntax. Sass
  [parses these functions specially][] as [unquoted strings][].

  [parses these functions specially]: /documentation/syntax/special-functions
  [unquoted strings]: /documentation/values/strings#unquoted
{% endfunFact %}

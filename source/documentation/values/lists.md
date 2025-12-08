---
title: Lists
table_of_contents: true
---

{% compatibility 'dart: true', 'libsass: "3.5.0"', 'ruby: "3.5.0"', 'feature: "Square Brackets"' %}
  Older implementations of LibSass and Ruby Sass didn't support lists with
  square brackets.
{% endcompatibility %}

Lists contain a sequence of other values. In Sass, elements in lists can be
separated by commas (`Helvetica, Arial, sans-serif`), spaces (`10px 15px 0 0`),
or [slashes] as long as it's consistent within the list. Unlike most other
languages, lists in Sass don't require special brackets; any [expressions]
separated with spaces or commas count as a list. However, you're allowed to
write lists with square brackets (`[line1 line2]`), which is useful when using
[`grid-template-columns`].

[slashes]: #slash-separated-lists
[expressions]: /documentation/syntax/structure#expressions
[`grid-template-columns`]: https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns

When writing lists without brackets, you can use parentheses to nest lists
within one another or disambiguate between list separators and other uses of
spaces or commas. For example, `(1, 2), (3, 4)` is a list that contains two
lists, each of which contains two numbers; and `adjust-font-stack((Helvetica,
Arial, sans-serif))` passes a single argument containing three font names to the
`adjust-font-stack` function.

Sass lists can contain one or even zero elements. A single-element list can be
written either `(<expression>,)` or `[<expression>]`, and a zero-element list
can be written either `()` or `[]`. Also, all [list functions][] will treat
individual values that aren't in lists as though they're lists containing that
value, which means you rarely need to explicitly create single-element lists.

[list functions]: /documentation/modules/list

{% headsUp %}
  Empty lists without brackets aren't valid CSS, so Sass won't let you use one
  in a property value.
{% endheadsUp %}

## Slash-Separated Lists

Lists in Sass can be separated by slashes, to represent values like the `font:
12px/30px` shorthand for setting `font-size` and `line-height` or the `hsl(80
100% 50% / 0.5)` syntax for creating a color with a given opacity value.
However, **slash-separated lists can't currently be written literally.** Sass
historically used the `/` character to indicate division, so while existing
stylesheets transition to using [`math.div()`] slash-separated lists can only be
written using [`list.slash()`].

[`math.div()`]: /documentation/modules/math#div
[`list.slash()`]: /documentation/modules/list#slash

For more details, see [Breaking Change: Slash as Division].

[Breaking Change: Slash as Division]: /documentation/breaking-changes/slash-div

## Using Lists

Sass provides a handful of [functions][] that make it possible to use lists to
write powerful style libraries, or to make your app's stylesheet cleaner and
more maintainable.

[functions]: /documentation/modules/list

### Indexes

Many of these functions take or return numbers, called *indexes*, that refer to
the elements in a list. The index 1 indicates the first element of the list.
Note that this is different than many programming languages where indexes start
at 0! Sass also makes it easy to refer to the end of a list. The index -1 refers
to the last element in a list, -2 refers to the second-to-last, and so on.

### Access an Element

Lists aren't much use if you can't get values out of them. You can use the
[`list.nth($list, $n)` function][] to get the element at a given index in a
list. The first argument is the list itself, and the second is the index of the
value you want to get out.

[`list.nth($list, $n)` function]: /documentation/modules/list#nth

{% render 'code_snippets/example-list-nth' %}

### Do Something for Every Element

This doesn't actually use a function, but it's still one of the most common ways
to use lists. The [`@each` rule][] evaluates a block of styles for each element
in a list, and assigns that element to a variable.

[`@each` rule]: /documentation/at-rules/control/each

{% render 'code_snippets/example-each-list' %}

### Add to a List

It's also useful to add elements to a list. The [`list.append($list, $val)`
function][] takes a list and a value, and returns a copy of the list with the
value added to the end. Note that because Sass lists are [immutable][], it
doesn't modify the original list.

[`list.append($list, $val)` function]: /documentation/modules/list#append
[immutable]: #immutability

{% codeExample 'lists', false %}
  @debug append(10px 12px 16px, 25px); // 10px 12px 16px 25px
  @debug append([col1-line1], col1-line2); // [col1-line1, col1-line2]
  ===
  @debug append(10px 12px 16px, 25px)  // 10px 12px 16px 25px
  @debug append([col1-line1], col1-line2)  // [col1-line1, col1-line2]
{% endcodeExample %}

### Find an Element in a List

If you need to check if an element is in a list or figure out what index it's
at, use the [`list.index($list, $value)` function][]. This takes a list and a
value to locate in that list, and returns the index of that value.

[`list.index($list, $value)` function]: /documentation/modules/list#index

{% render 'code_snippets/example-list-index' %}

If the value isn't in the list at all, `list.index()` returns [`null`][].
Because `null` is [falsey][], you can use `list.index()` with [`@if`][] or
[`if()`] to check whether a list does or doesn't contain a given value.

[`null`]: /documentation/values/null
[falsey]: /documentation/at-rules/control/if#truthiness-and-falsiness
[`@if`]: /documentation/at-rules/control/if
[`if()`]: /documentation/syntax/special-functions#if

{% codeExample 'list-index', false %}
  @use "sass:list";

  $valid-sides: top, bottom, left, right;

  @mixin attach($side) {
    @if not list.index($valid-sides, $side) {
      @error "#{$side} is not a valid side. Expected one of #{$valid-sides}.";
    }

    // ...
  }
  ===
  @use "sass:list"

  $valid-sides: top, bottom, left, right

  @mixin attach($side)
    @if not list.index($valid-sides, $side)
      @error "#{$side} is not a valid side. Expected one of #{$valid-sides}."


    // ...
{% endcodeExample %}

## Immutability

Lists in Sass are *immutable*, which means that the contents of a list value
never changes. Sass's list functions all return new lists rather than modifying
the originals. Immutability helps avoid lots of sneaky bugs that can creep in
when the same list is shared across different parts of the stylesheet.

You can still update your state over time by assigning new lists to the same
variable, though. This is often used in functions and mixins to collect a bunch
of values into one list.

{% codeExample 'immutability', false %}
  @use "sass:list";
  @use "sass:map";

  $prefixes-by-browser: ("firefox": moz, "safari": webkit, "ie": ms);

  @function prefixes-for-browsers($browsers) {
    $prefixes: ();
    @each $browser in $browsers {
      $prefixes: list.append($prefixes, map.get($prefixes-by-browser, $browser));
    }
    @return $prefixes;
  }

  @debug prefixes-for-browsers("firefox" "ie"); // moz ms
  ===
  @use "sass:list"
  @use "sass:map"

  $prefixes-by-browser: ("firefox": moz, "safari": webkit, "ie": ms)

  @function prefixes-for-browsers($browsers)
    $prefixes: ()
    @each $browser in $browsers
      $prefixes: list.append($prefixes, map.get($prefixes-by-browser, $browser))

    @return $prefixes


  @debug prefixes-for-browsers("firefox" "ie")  // moz ms
{% endcodeExample %}

## Argument Lists

When you declare a mixin or function that takes [arbitrary arguments][], the
value you get is a special list known as an *argument list*. It acts just like a
list that contains all the arguments passed to the mixin or function, with one
extra feature: if the user passed keyword arguments, they can be accessed as a
map by passing the argument list to the [`meta.keywords()` function][].

[arbitrary arguments]: /documentation/at-rules/mixin#taking-arbitrary-arguments
[`meta.keywords()` function]: /documentation/modules/meta#keywords

{% render 'code_snippets/example-mixin-arbitrary-keyword-arguments' %}

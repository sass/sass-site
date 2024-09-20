---
title: Strings
table_of_contents: true
introduction: >
  Strings are sequences of characters (specifically [Unicode code
  points](https://en.wikipedia.org/wiki/Code_point)). Sass supports two kinds of
  strings whose internal structure is the same but which are rendered
  differently: [quoted strings](#quoted), like `"Helvetica Neue"`, and [unquoted
  strings](#unquoted) (also known as *identifiers*), like `bold`. Together,
  these cover the different kinds of text that appear in CSS.
---

{% funFact %}
  You can convert a quoted string to an unquoted string using the
  [`string.unquote()` function][], and you can convert an unquoted string to a
  quoted string using the [`string.quote()` function][].

  [`string.unquote()` function]: /documentation/modules/string#unquote
  [`string.quote()` function]: /documentation/modules/string#quote

  {% codeExample 'fun-fact-strings', false %}
    @use "sass:string";

    @debug string.unquote(".widget:hover"); // .widget:hover
    @debug string.quote(bold); // "bold"
    ===
    @use "sass:string"

    @debug string.unquote(".widget:hover")  // .widget:hover
    @debug string.quote(bold)  // "bold"
  {% endcodeExample %}
{% endfunFact %}

## Escapes

All Sass strings support the standard CSS [escape codes][]:

[escape codes]: https://developer.mozilla.org/en-US/docs/Web/CSS/string#Syntax

* Any character other than a letter from A to F or a number from 0 to 9 (even a
  newline!) can be included as part of a string by writing `\` in front of it.

* Any character can be included as part of a string by writing `\` followed by
  its [Unicode code point number][] written in [hexadecimal][]. You can
  optionally include a space after the code point number to indicate where the
  Unicode number ends.

  [Unicode code point number]: https://en.wikipedia.org/wiki/List_of_Unicode_characters
  [hexadecimal]: https://en.wikipedia.org/wiki/Hexadecimal

{% codeExample 'escapes', false %}
  @debug "\""; // '"'
  @debug \.widget; // \.widget
  @debug "\a"; // "\a" (a string containing only a newline)
  @debug "line1\a line2"; // "line1\a line2"
  @debug "Nat + Liz \1F46D"; // "Nat + Liz 👭"
  ===
  @debug "\""  // '"'
  @debug \.widget  // \.widget
  @debug "\a"  // "\a" (a string containing only a newline)
  @debug "line1\a line2"  // "line1\a line2" (foo and bar are separated by a newline)
  @debug "Nat + Liz \1F46D"  // "Nat + Liz 👭"
{% endcodeExample %}

{% funFact %}
  For characters that are allowed to appear in strings, writing the Unicode
  escape produces exactly the same string as writing the character itself.
{% endfunFact %}

## Quoted

Quoted strings are written between either single or double quotes, as in
`"Helvetica Neue"`. They can contain [interpolation][], as well as any unescaped
character except for:

[interpolation]: /documentation/interpolation

* `\`, which can be escaped as `\\`;
* `'` or `"`, whichever was used to define that string, which can be escaped as
  `\'` or `\"`;
* newlines, which can be escaped as `\a ` (including a trailing space).

Quoted strings are guaranteed to be compiled to CSS strings that have the same
contents as the original Sass strings. The exact format may vary based on the
implementation or configuration—a string containing a double quote may be
compiled to `"\""` or `'"'`, and a non-[ASCII][] character may or may not be
escaped. But that should be parsed the same in any standards-compliant CSS
implementation, including all browsers.

[ASCII]: https://en.wikipedia.org/wiki/ASCII

{% codeExample 'quoted', false %}
  @debug "Helvetica Neue"; // "Helvetica Neue"
  @debug "C:\\Program Files"; // "C:\\Program Files"
  @debug "\"Don't Fear the Reaper\""; // "\"Don't Fear the Reaper\""
  @debug "line1\a line2"; // "line1\a line2"

  $roboto-variant: "Mono";
  @debug "Roboto #{$roboto-variant}"; // "Roboto Mono"
  ===
  @debug "Helvetica Neue"  // "Helvetica Neue"
  @debug "C:\\Program Files"  // "C:\\Program Files"
  @debug "\"Don't Fear the Reaper\""  // "\"Don't Fear the Reaper\""
  @debug "line1\a line2"  // "line1\a line2"

  $roboto-variant: "Mono"
  @debug "Roboto #{$roboto-variant}"  // "Roboto Mono"
{% endcodeExample %}

{% funFact %}
  When a quoted string is injected into another value via interpolation, [its
  quotes are removed][]! This makes it easy to write strings containing
  selectors, for example, that can be injected into style rules without adding
  quotes.

  [its quotes are removed]: /documentation/interpolation#quoted-strings
{% endfunFact %}

## Unquoted

Unquoted strings are written as CSS [identifiers][], following the syntax
diagram below. They may include [interpolation][] anywhere.

[identifiers]: https://drafts.csswg.org/css-syntax-3/#ident-token-diagram
[interpolation]: /documentation/interpolation

<figure>
  <object type="image/svg+xml" data="/assets/img/illustrations/identifier-diagram.svg"></object>
  <figcaption class="copyright">
    Railroad diagram copyright © 2018 W3C<sup>®</sup> (MIT, ERCIM, Keio, Beihang). W3C <a href="http://www.w3.org/Consortium/Legal/ipr-notice#Legal_Disclaimer">liability</a>, <a href="http://www.w3.org/Consortium/Legal/ipr-notice#W3C_Trademarks">trademark</a> and <a href="http://www.w3.org/Consortium/Legal/2015/copyright-software-and-document">permissive document license</a> rules apply.
  </figcaption>
</figure>

{% codeExample 'unquoted', false %}
  @debug bold; // bold
  @debug -webkit-flex; // -webkit-flex
  @debug --123; // --123

  $prefix: ms;
  @debug -#{$prefix}-flex; // -ms-flex
  ===
  @debug bold  // bold
  @debug -webkit-flex  // -webkit-flex
  @debug --123  // --123

  $prefix: ms
  @debug -#{$prefix}-flex  // -ms-flex
{% endcodeExample %}

{% headsUp %}
  Not all identifiers are parsed as unquoted strings:

  * [CSS color names][] are parsed as [colors][].
  * `null` is parsed as [Sass's `null` value][].
  * `true` and `false` are parsed as [Booleans][].
  * `not`, `and`, and `or` are parsed as [Boolean operators][].

  [CSS color names]: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords
  [colors]: /documentation/values/colors
  [Sass's `null` value]: /documentation/values/null
  [Booleans]: /documentation/values/booleans
  [Boolean operators]: /documentation/operators/boolean

  Because of this, it's generally a good idea to write quoted strings unless
  you're specifically writing the value of a CSS property that uses unquoted
  strings.
{% endheadsUp %}

### Escapes in Unquoted Strings

{% compatibility 'dart: "1.11.0"', 'libsass: false', 'ruby: false', 'feature: "Normalization"' %}
  LibSass, Ruby Sass, and older versions of Dart Sass don't normalize escapes in
  identifiers. Instead, the text in the unquoted string is the exact text the
  user wrote. For example, `\1F46D` and `👭` are not considered equivalent.
{% endcompatibility %}

When an unquoted string is parsed, the literal text of escapes are parsed as
part of the string. For example, `\a ` is parsed as the characters `\`, `a`, and
space. In order to ensure that unquoted strings that have the same meanings in
CSS are parsed the same way, though, these escapes are *normalized*. For each
code point, whether it's escaped or unescaped:

* If it's a valid identifier character, it's included unescaped in the unquoted
  string. For example, `\1F46D` returns the unquoted string `👭`.

* If it's a printable character other than a newline or a tab, it's included
  after a `\`. For example, `\21 ` returns the unquoted string `\!`.

* Otherwise, the lowercase Unicode escape is included with a trailing space. For
  example, `\7Fx` returns the unquoted string `\7f x`.

{% codeExample 'normalization', false %}
  @use "sass:string";

  @debug \1F46D; // 👭
  @debug \21; // \!
  @debug \7Fx; // \7f x
  @debug string.length(\7Fx); // 5
  ===
  @use "sass:string"

  @debug \1F46D  // 👭
  @debug \21  // \!
  @debug \7Fx  // \7f x
  @debug string.length(\7Fx)  // 5
{% endcodeExample %}

## String Indexes

Sass has a number of [string functions][] that take or return numbers, called
*indexes*, that refer to the characters in a string. The index 1 indicates the
first character of the string. Note that this is different than many programming
languages where indexes start at 0! Sass also makes it easy to refer to the end
of a string. The index -1 refers to the last character in a string, -2 refers to
the second-to-last, and so on.

[string functions]: /documentation/modules/string

{% codeExample 'string-indexes', false %}
  @use "sass:string";

  @debug string.index("Helvetica Neue", "Helvetica"); // 1
  @debug string.index("Helvetica Neue", "Neue"); // 11
  @debug string.slice("Roboto Mono", -4); // "Mono"
  ===
  @use "sass:string"

  @debug string.index("Helvetica Neue", "Helvetica")  // 1
  @debug string.index("Helvetica Neue", "Neue")  // 11
  @debug string.slice("Roboto Mono", -4)  // "Mono"
{% endcodeExample %}

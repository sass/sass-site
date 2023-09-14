---
title: sass:string
---

{% render 'doc_snippets/built-in-module-status' %}

{% function 'string.quote($string)', 'quote($string)', 'returns:string' %}
  Returns `$string` as a quoted string.

  {% codeExample 'quote' %}
    @use "sass:string";

    @debug string.quote(Helvetica); // "Helvetica"
    @debug string.quote("Helvetica"); // "Helvetica"
    ===
    @use "sass:string"

    @debug string.quote(Helvetica)  // "Helvetica"
    @debug string.quote("Helvetica")  // "Helvetica"
  {% endcodeExample %}
{% endfunction %}

{% function 'string.index($string, $substring)', 'str-index($string, $substring)', 'returns:number' %}
  Returns the first [index][] of `$substring` in `$string`, or `null` if
  `$string` doesn't contain `$substring`.

  [index]: /documentation/values/strings#string-indexes

  {% codeExample 'index' %}
    @use "sass:string";

    @debug string.index("Helvetica Neue", "Helvetica"); // 1
    @debug string.index("Helvetica Neue", "Neue"); // 11
    ===
    @use "sass:string"

    @debug string.index("Helvetica Neue", "Helvetica")  // 1
    @debug string.index("Helvetica Neue", "Neue")  // 11
  {% endcodeExample %}
{% endfunction %}

{% function 'string.insert($string, $insert, $index)', 'str-insert($string, $insert, $index)', 'returns:string' %}
  Returns a copy of `$string` with `$insert` inserted at [`$index`][].

  [`$index`]: /documentation/values/strings#string-indexes

  {% codeExample 'insert' %}
    @use "sass:string";

    @debug string.insert("Roboto Bold", " Mono", 7); // "Roboto Mono Bold"
    @debug string.insert("Roboto Bold", " Mono", -6); // "Roboto Mono Bold"
    ===
    @use "sass:string"

    @debug string.insert("Roboto Bold", " Mono", 7)  // "Roboto Mono Bold"
    @debug string.insert("Roboto Bold", " Mono", -6)  // "Roboto Mono Bold"
  {% endcodeExample %}

  If `$index` is higher than the length of `$string`, `$insert` is added to the
  end. If `$index` is smaller than the negative length of the string, `$insert`
  is added to the beginning.

  {% codeExample 'insert-2' %}
    @use "sass:string";

    @debug string.insert("Roboto", " Bold", 100); // "Roboto Bold"
    @debug string.insert("Bold", "Roboto ", -100); // "Roboto Bold"
    ===
    @use "sass:string"

    @debug string.insert("Roboto", " Bold", 100)  // "Roboto Bold"
    @debug string.insert("Bold", "Roboto ", -100)  // "Roboto Bold"
  {% endcodeExample %}
{% endfunction %}

{% function 'string.length($string)', 'str-length($string)', 'returns:number' %}
  Returns the number of characters in `$string`.

  {% codeExample 'length' %}
    @use "sass:string";

    @debug string.length("Helvetica Neue"); // 14
    @debug string.length(bold); // 4
    @debug string.length(""); // 0
    ===
    @use "sass:string"

    @debug string.length("Helvetica Neue")  // 14
    @debug string.length(bold)  // 4
    @debug string.length("")  // 0
  {% endcodeExample %}
{% endfunction %}

{% function 'string.slice($string, $start-at, $end-at: -1)', 'str-slice($string, $start-at, $end-at: -1)', 'returns:string' %}
  Returns the slice of `$string` starting at [index][] `$start-at` and ending at
  index `$end-at` (both inclusive).

  [index]: /documentation/values/strings#string-indexes

  {% codeExample 'slice' %}
    @use "sass:string";

    @debug string.slice("Helvetica Neue", 11); // "Neue"
    @debug string.slice("Helvetica Neue", 1, 3); // "Hel"
    @debug string.slice("Helvetica Neue", 1, -6); // "Helvetica"
    ===
    @use "sass:string"

    @debug string.slice("Helvetica Neue", 11)  // "Neue"
    @debug string.slice("Helvetica Neue", 1, 3)  // "Hel"
    @debug string.slice("Helvetica Neue", 1, -6)  // "Helvetica"
  {% endcodeExample %}
{% endfunction %}

{% function 'string.split($string, $separator, $limit: null)', 'returns:list' %}
  {% compatibility 'dart: "1.57.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

  Returns a bracketed, comma-separated list of substrings of `$string` that are
  separated by `$separator`. The `$separator`s aren't included in these
  substrings.

  If `$limit` is a number `1` or higher, this splits on at most that many
  `$separator`s (and so returns at most `$limit + 1` strings). The last
  substring contains the rest of the string, including any remaining
  `$separator`s.

  {% codeExample 'split' %}
    @use "sass:string";

    @debug string.split("Segoe UI Emoji", " "); // ["Segoe", "UI", "Emoji"]
    @debug string.split("Segoe UI Emoji", " ", $limit: 1); // ["Segoe", "UI Emoji"]
    ===
    @use "sass:string"

    @debug string.split("Segoe UI Emoji", " ")  // ["Segoe", "UI", "Emoji"]
    @debug string.split("Segoe UI Emoji", " ", $limit: 1)  // ["Segoe", "UI Emoji"]
  {% endcodeExample %}
{% endfunction %}

{% function 'string.to-upper-case($string)', 'to-upper-case($string)', 'returns:string' %}
  Returns a copy of `$string` with the [ASCII][] letters converted to upper
  case.

  [ASCII]: https://en.wikipedia.org/wiki/ASCII

  {% codeExample 'to-upper-case' %}
    @use "sass:string";

    @debug string.to-upper-case("Bold"); // "BOLD"
    @debug string.to-upper-case(sans-serif); // SANS-SERIF
    ===
    @use "sass:string"

    @debug string.to-upper-case("Bold")  // "BOLD"
    @debug string.to-upper-case(sans-serif)  // SANS-SERIF
  {% endcodeExample %}
{% endfunction %}

{% function 'string.to-lower-case($string)', 'to-lower-case($string)', 'returns:string' %}
  Returns a copy of `$string` with the [ASCII][] letters converted to lower
  case.

  [ASCII]: https://en.wikipedia.org/wiki/ASCII

  {% codeExample 'to-lower-case' %}
    @use "sass:string";

    @debug string.to-lower-case("Bold"); // "bold"
    @debug string.to-lower-case(SANS-SERIF); // sans-serif
    ===
    @use "sass:string"

    @debug string.to-lower-case("Bold")  // "bold"
    @debug string.to-lower-case(SANS-SERIF)  // sans-serif
  {% endcodeExample %}
{% endfunction %}

{% function 'string.unique-id()', 'unique-id()', 'returns:string' %}
  Returns a randomly-generated unquoted string that's guaranteed to be a valid
  CSS identifier and to be unique within the current Sass compilation.

  {% codeExample 'unique-id' %}
    @use "sass:string";

    @debug string.unique-id(); // uabtrnzug
    @debug string.unique-id(); // u6w1b1def
    ===
    @use "sass:string"

    @debug string.unique-id(); // uabtrnzug
    @debug string.unique-id(); // u6w1b1def
  {% endcodeExample %}
{% endfunction %}

{% function 'string.unquote($string)', 'unquote($string)', 'returns:string' %}
  Returns `$string` as an unquoted string. This can produce strings that aren't
  valid CSS, so use with caution.

  {% codeExample 'unquote' %}
    @use "sass:string";

    @debug string.unquote("Helvetica"); // Helvetica
    @debug string.unquote(".widget:hover"); // .widget:hover
    ===
    @use "sass:string"

    @debug string.unquote("Helvetica")  // Helvetica
    @debug string.unquote(".widget:hover")  // .widget:hover
  {% endcodeExample %}
{% endfunction %}

---
title: sass:list
---

{% render 'doc_snippets/built-in-module-status' %}

{% funFact %}
  In Sass, every [map][] counts as a list that contains a two-element list for
  each key/value pair. For example, `(1: 2, 3: 4)` counts as `(1 2, 3 4)`. So
  all these functions work for maps as well!

  [map]: /documentation/values/maps

  Individual values also count as lists. All these functions treat `1px` as a
  list that contains the value `1px`.
{% endfunFact %}

{% function 'list.append($list, $val, $separator: auto)', 'append($list, $val, $separator: auto)',  'returns:list' %}
  Returns a copy of `$list` with `$val` added to the end.

  If `$separator` is `comma`, `space`, or `slash`, the returned list is
  comma-separated, space-separated, or slash-separated, respectively. If it's
  `auto` (the default), the returned list will use the same separator as `$list`
  (or `space` if `$list` doesn't have a separator). Other values aren't allowed.

  [separator]: /documentation/values/lists

  Note that unlike [`list.join()`](#join), if `$val` is a list it's nested
  within the returned list rather than having all its elements added to the
  returned list.

  {% codeExample 'list-append' %}
    @use 'sass:list';

    @debug list.append(10px 20px, 30px); // 10px 20px 30px
    @debug list.append((blue, red), green); // blue, red, green
    @debug list.append(10px 20px, 30px 40px); // 10px 20px (30px 40px)
    @debug list.append(10px, 20px, $separator: comma); // 10px, 20px
    @debug list.append((blue, red), green, $separator: space); // blue red green
    ===
    @use 'sass:list'

    @debug list.append(10px 20px, 30px)  // 10px 20px 30px
    @debug list.append((blue, red), green)  // blue, red, green
    @debug list.append(10px 20px, 30px 40px)  // 10px 20px (30px 40px)
    @debug list.append(10px, 20px, $separator: comma)  // 10px, 20px
    @debug list.append((blue, red), green, $separator: space)  // blue red green
  {% endcodeExample %}
{% endfunction %}

{% function 'list.index($list, $value)', 'index($list, $value)', 'returns:number | null' %}
  Returns the [index][] of `$value` in `$list`.

  [index]: /documentation/values/lists#indexes

  If `$value` doesn't appear in `$list`, this returns [`null`][]. If `$value`
  appears multiple times in `$list`, this returns the index of its first
  appearance.

  [`null`]: /documentation/values/null

  {% render 'code_snippets/example-list-index' %}
{% endfunction %}

{% function 'list.is-bracketed($list)', 'is-bracketed($list)', 'returns:boolean' %}
  Returns whether `$list` has square brackets.

  {% codeExample 'list-is-bracketed' %}
    @use 'sass:list';

    @debug list.is-bracketed(1px 2px 3px); // false
    @debug list.is-bracketed([1px, 2px, 3px]); // true
    ===
    @use 'sass:list'

    @debug list.is-bracketed(1px 2px 3px)  // false
    @debug list.is-bracketed([1px, 2px, 3px])  // true
  {% endcodeExample %}
{% endfunction %}

{% function 'list.join($list1, $list2, $separator: auto, $bracketed: auto)', 'join($list1, $list2, $separator: auto, $bracketed: auto)', 'returns:list' %}
  Returns a new list containing the elements of `$list1` followed by the
  elements of `$list2`.

  {% headsUp %}
    Because individual values count as single-element lists, it's possible to
    use `list.join()` to add a value to the end of a list. However, *this is not
    recommended*, since if that value is a list it will be concatenated, which
    is probably not what you're expecting.

    Use [`list.append()`](#append) instead to add a single value to a list. Only
    use `list.join()` to combine two lists together into one.
  {% endheadsUp %}

  If `$separator` is `comma`, `space`, or `slash`, the returned list is
  comma-separated, space-separated, or slash-separated, respectively. If it's
  `auto` (the default), the returned list will use the same separator as
  `$list1` if it has a separator, or else `$list2` if it has a separator, or
  else `space`. Other values aren't allowed.

  If `$bracketed` is `auto` (the default), the returned list will be bracketed
  if `$list1` is. Otherwise, the returned list will have square brackets if
  `$bracketed` is [truthy] and no brackets if `$bracketed` is falsey.

  [truthy]: /documentation/values/booleans#truthiness-and-falsiness

  {% codeExample 'list-join' %}
    @use 'sass:list';

    @debug list.join(10px 20px, 30px 40px); // 10px 20px 30px 40px
    @debug list.join((blue, red), (#abc, #def)); // blue, red, #abc, #def
    @debug list.join(10px, 20px); // 10px 20px
    @debug list.join(10px, 20px, $separator: comma); // 10px, 20px
    @debug list.join((blue, red), (#abc, #def), $separator: space); // blue red #abc #def
    @debug list.join([10px], 20px); // [10px 20px]
    @debug list.join(10px, 20px, $bracketed: true); // [10px 20px]
    ===
    @use 'sass:list'

    @debug list.join(10px 20px, 30px 40px)  // 10px 20px 30px 40px
    @debug list.join((blue, red), (#abc, #def))  // blue, red, #abc, #def
    @debug list.join(10px, 20px)  // 10px 20px
    @debug list.join(10px, 20px, comma)  // 10px, 20px
    @debug list.join((blue, red), (#abc, #def), space)  // blue red #abc #def
    @debug list.join([10px], 20px)  // [10px 20px]
    @debug list.join(10px, 20px, $bracketed: true)  // [10px 20px]
  {% endcodeExample %}
{% endfunction %}

{% function 'list.length($list)', 'length($list)', 'returns:number' %}
  Returns the length of `$list`.

  This can also return the number of pairs in a map.

  {% codeExample 'list-length' %}
    @use 'sass:list';

    @debug list.length(10px); // 1
    @debug list.length(10px 20px 30px); // 3
    @debug list.length((width: 10px, height: 20px)); // 2
    ===
    @use 'sass:list'

    @debug list.length(10px)  // 1
    @debug list.length(10px 20px 30px)  // 3
    @debug list.length((width: 10px, height: 20px))  // 2
  {% endcodeExample %}
{% endfunction %}

{% function 'list.separator($list)', 'list-separator($list)', 'returns:unquoted string' %}
  Returns the name of the separator used by `$list`, either `space`, `comma`, or
  `slash`.

  If `$list` doesn't have a separator, returns `space`.

  {% codeExample 'list-separator' %}
    @use 'sass:list';

    @debug list.separator(1px 2px 3px); // space
    @debug list.separator((1px, 2px, 3px)); // comma
    @debug list.separator('Helvetica'); // space
    @debug list.separator(()); // space
    ===
    @use 'sass:list'

    @debug list.separator(1px 2px 3px)  // space
    @debug list.separator((1px, 2px, 3px))  // comma
    @debug list.separator('Helvetica')  // space
    @debug list.separator(())  // space
  {% endcodeExample %}
{% endfunction %}

{% function 'list.nth($list, $n)', 'nth($list, $n)' %}
  Returns the element of `$list` at [index][] `$n`.

  [index]: /documentation/values/lists#indexes

  If `$n` is negative, it counts from the end of `$list`. Throws an error if
  there is no element at index `$n`.

  {% render 'code_snippets/example-list-nth' %}
{% endfunction %}

{% function 'list.set-nth($list, $n, $value)', 'set-nth($list, $n, $value)', 'returns:list' %}
  Returns a copy of `$list` with the element at [index][] `$n` replaced with
  `$value`.

  [index]: /documentation/values/lists#indexes

  If `$n` is negative, it counts from the end of `$list`. Throws an error if
  there is no existing element at index `$n`.

  {% codeExample 'list-set-nth' %}
    @use 'sass:list';

    @debug list.set-nth(10px 20px 30px, 1, 2em); // 2em 20px 30px
    @debug list.set-nth(10px 20px 30px, -1, 8em); // 10px, 20px, 8em
    @debug list.set-nth((Helvetica, Arial, sans-serif), 3, Roboto); // Helvetica, Arial, Roboto
    ===
    @use 'sass:list'

    @debug list.set-nth(10px 20px 30px, 1, 2em); // 2em 20px 30px
    @debug list.set-nth(10px 20px 30px, -1, 8em); // 10px, 20px, 8em
    @debug list.set-nth((Helvetica, Arial, sans-serif), 3, Roboto); // Helvetica, Arial, Roboto
  {% endcodeExample %}
{% endfunction %}

{% function 'list.slash($elements...)', 'returns:list' %}
  Returns a slash-separated list that contains `$elements`.

  {% headsUp %}
    This function is a temporary solution for creating slash-separated lists.
    Eventually, they'll be written literally with slashes, as in
    `1px / 2px / solid`, but for the time being [slashes are used for division]
    so Sass can't use them for new syntax until the old syntax is removed.

    [slashes are used for division]: /documentation/breaking-changes/slash-div
  {% endheadsUp %}

  {% codeExample 'list-slash' %}
    @use 'sass:list';

    @debug list.slash(1px, 50px, 100px); // 1px / 50px / 100px
    ===
    @use 'sass:list'

    @debug list.slash(1px, 50px, 100px)  // 1px / 50px / 100px
  {% endcodeExample %}
{% endfunction %}

{% function 'list.zip($lists...)', 'zip($lists...)', 'returns:list' %}
  Combines every list in `$lists` into a single list of sub-lists.

  Each element in the returned list contains all the elements at that position
  in `$lists`. The returned list is as long as the shortest list in `$lists`.

  The returned list is always comma-separated and the sub-lists are always
  space-separated.

  {% codeExample 'list-zip' %}
    @use 'sass:list';

    @debug list.zip(10px 50px 100px, short mid long); // 10px short, 50px mid, 100px long
    @debug list.zip(10px 50px 100px, short mid); // 10px short, 50px mid
    ===
    @use 'sass:list'

    @debug list.zip(10px 50px 100px, short mid long)  // 10px short, 50px mid, 100px long
    @debug list.zip(10px 50px 100px, short mid)  // 10px short, 50px mid
  {% endcodeExample %}
{% endfunction %}

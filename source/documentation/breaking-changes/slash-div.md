---
title: 'Breaking Change: Slash as Division'
introduction: >
  Sass now treats `/` as a separator rather than a division operator everywhere
  except for `calc()` expressions.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In plain CSS, `/` has always been a separator. It was used since CSS 1 part of
the [`font` shorthand syntax] to separate `font-size` from `line-height`, and
more recently as an important part of the [`grid` shorthand syntax] and the [new
color syntax]. Treating it as a separator in Sass as well is necessary to meet
our core design goal of CSS compatibility.

[`font` shorthand syntax]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font#shorthand_property_order
[`grid` shorthand syntax]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid
[new color syntax]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value#syntax

Lists now support `/` as a separator just like commas and spaces.

{% codeExample 'slash-div' %}
  @use "sass:list";

  $list: "do" / "re" / "mi";
  @debug list.nth($list, 2); // "re"
  @debug list.separator($list); // slash
  ===
  @use "sass:list"

  $list: "do" / "re" / "mi"
  @debug list.nth($list, 2)  // "re"
  @debug list.separator($list)  // slash
{% endcodeExample %}

The slash separatorx binds more loosely than spaces but more tightly than
commas, so for example `1 2 / 3 4, 5` is equivalent to `((1 2) / (3 4)), 5`.

## Historical Behavior

Historically, Sass used complex heuristics to figure out whether to treat a `/`
as division or a separator. When two numbers were separated by `/`, Sass would
print the result as slash-separated instead of divided unless one of these
conditions was met:

* Either expression was anything other than a literal number (such as a variable
  or function call).
* The result was stored in a variable or returned by a function.
* The operation was surrounded by parentheses, unless those parentheses were
  outside a list that contained the operation.
* The result was used as part of another operation (other than `/`).
* The result was returned by a [calculation].

[calculation]: /documentation/values/calculations

{% codeExample 'slash-separated-numbers' %}
  @debug 15px / 30px; // 15px/30px
  @debug (10px + 5px) / 30px; // 0.5

  $result: 15px / 30px;
  @debug $result; // 0.5

  @function fifteen-divided-by-thirty() {
    @return 15px / 30px;
  }
  @debug fifteen-divided-by-thirty(); // 0.5

  @debug (15px/30px); // 0.5
  @debug (bold 15px/30px sans-serif); // bold 15px/30px sans-serif
  @debug 15px/30px + 1; // 1.5
  ===
  @debug 15px / 30px  // 15px/30px
  @debug (10px + 5px) / 30px  // 0.5

  $result: 15px / 30px
  @debug $result  // 0.5

  @function fifteen-divided-by-thirty()
    @return 15px / 30px

  @debug fifteen-divided-by-thirty()  // 0.5

  @debug (15px/30px)  // 0.5
  @debug (bold 15px/30px sans-serif)  // bold 15px/30px sans-serif
  @debug 15px/30px + 1  // 1.5
{% endcodeExample %}

For values other than numbers, a slash was never interpreted as division, but
instead returned an unquoted string.

{% codeExample 'slash-separated-strings' %}
  @use "sass:meta";

  $value: auto-flow / 1fr 1fr 1fr;
  @debug $value; // auto-flow/1fr 1fr 1fr
  @debug meta.type-of($value); // string
  ===
  @use "sass:meta"

  $value: auto-flow / 1fr 1fr 1fr
  @debug $value  // auto-flow/1fr 1fr 1fr
  @debug meta.type-of($value)  // string
{% endcodeExample %}

{% compatibility 'dart: "1.33.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 1.33.0, Dart Sass emitted the `slash-div` deprecation for all uses
of `/` that were treated as division operations rather than separators. This
release also added the [`math.div()` function] as the new recommended way to
write division in Sass, as well as support for `slash` as a list separator along
with the [`list.slash()` function] as a way to create them before literal syntax
existed. To write code that's compatible with both Dart Sass 1.x and Dart Sass
2.x, use `math.div()` for division and `list.slash()` to create slash-separated
lists.

[`math.div()` function]: /documentation/modules/math#div
[`list.slash()` function]: /documentation/modules/list#slash

### Automatic Migration

You can use [the Sass migrator] to automatically update your stylesheets to use
`math.div()` and `list.slash()`.

[the Sass migrator]: https://github.com/sass/migrator#readme

```shellsession
$ npm install -g sass-migrator
$ sass-migrator division **/*.scss
```

## `list.slash()`

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in 2.0.0, Dart Sass now emits the `slash-div` deprecation for the
[`list.slash()` function]. This function is no longer necessary, since it's now
possible to create literal slash-separated lists. It will eventually be removed
in Dart Sass 3.0.0.

{% render 'silencing_deprecations' %}

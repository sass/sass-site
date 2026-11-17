---
title: 'Breaking Change: Function Names'
introduction: >
  This small breaking change forbids user-defined functions whose names overlap
  with plain CSS function names that have special syntax, even if they're not
  lowercase. It also removes special parsing for function calls that had special
  syntax unnecessarily.
---

{% compatibility 'dart: "2.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

### User-Defined Function Names

Users may no longer define functions case-insensitively named `url`,
`expression`, or `element`. These function names have special parsing in CSS
which makes it very difficult to call them as Sass functions.

{% funFact %}
  As part of this change, some other restrictions on which function names were
  allowed were relaxed. Functions with vendor-style prefixes whose names
  end with `-url`, `-expression`, `-and`, `-or`, and `-not` will no longer
  produce errors.
{% endfunFact %}

{% codeExample 'function-name' %}
  @function URL($path) {
    @return url(https://example.org/#{$path});
  }
  ===
  @function URL($path)
    @return url(https://example.org/#{$path})
{% endcodeExample %}

### Function Calls

Vendor-prefixed versions of the `expression()` function or `progid:...()`
functions no longer have special parsing. No browser ever actually shipped a
vendor-prefixed versions of these functions, so having special parsing for them
is unnecessary. Vendor-prefixed `expression()` functions like
`-foo-expression()` are now parsed as normal Sass functions:

{% codeExample 'prefixed-expression' %}
  div {
    width: -foo-expression(1px + 1px);
  }
  ===
  div
    width: -foo-expression(1px + 1px)
{% endcodeExample %}

...and vendor-prefixed `progid:...()` functions like `-foo-progid:bar()` are
syntax errors because that's not generally valid CSS syntax.

{% codeExample 'prefixed-progid' %}
  div {
    filter: -foo-progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#000000',
      endColorstr='#FFFFFF'
    );
  }
  ===
  div
    filter: -foo-progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#000000',
      endColorstr='#FFFFFF'
    )
{% endcodeExample %}

## Historical Behavior

### User-Defined Function Names

Functions with the fully-lowercase names `url`, `expression`, or `element` have
always been forbidden, but if any letters were capitalized they were allowed.
Function names in CSS are case-insensitive, though, so Sass parsed *calls* to
uppercase versions of these functions as special syntax rather than Sass
function calls. This meant that functions defined with these names could
(almost) never be called. Defining functions with uppercase versions of these
names was deprecated in Dart Sass 1.98.0.

{% codeExample 'function-name' %}
  @function URL($path) {
    @return url(https://example.org/#{$path});
  }

  body {
    // Note that this does NOT call the function.
    background-image: URL(fuzzycat.png);
  }
  ===
  @function URL($path)
    @return url(https://example.org/#{$path})


  body
    // Note that this does NOT call the function.
    background-image: URL(fuzzycat.png)
  ===
  body {
    background-image: URL(fuzzycat.png);
  }
{% endcodeExample %}

### Function Calls

Vendor-prefixed `expression()` and `progid:...` functions were previously
treated as special-syntax functions whose contents weren't interpreted by Sass
at all.

{% codeExample 'prefixed-old' %}
  div {
    width: -foo-expression(1px + 1px);
    filter: -foo-progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#000000',
      endColorstr='#FFFFFF'
    );
  }
  ===
  div
    width: -foo-expression(1px + 1px)
    filter: -foo-progid:DXImageTransform.Microsoft.gradient(
      startColorstr='#000000',
      endColorstr='#FFFFFF'
    )
  ===
  div {
    width: -foo-expression(1px + 1px);
    filter: -foo-progid:DXImageTransform.Microsoft.gradient(startColorstr='#000000', endColorstr='#FFFFFF');
  }
{% endcodeExample %}

{% render 'silencing_deprecations' %}

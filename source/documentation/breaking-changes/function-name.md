---
title: 'Breaking Change: Function Names'
introduction: >
  This small breaking change forbids user-defined functions whose names overlap
  with plain CSS function names that have special syntax, even if they're not
  lowercase. It also removes special parsing for function calls that has special
  syntax unnecessarily.
---

### User-Defined Function Names

This change will forbid users from defining functions named `URL`, `EXPRESSION`,
or `ELEMENT`, or the same names with any combination of uppercase and lowercase
letters.

The fully-lowercase version of these names was already forbidden. Function names
in CSS are case-sensitive, though, so in order to be fully CSS-compatible Sass
needs to apply special parsing rules even to the uppercase versions. This means
that user-defined functions can't use those names, because the special parsing
needs to happen before the language knows which user-defined functions exist.

{% funFact %}
  As part of this change, some other restrictions on which function names were
  allowed have been relaxed. Functions with vendor-style prefixes whose names
  end with `-url`, `-expression`, `-and`, `-or`, and `-not` will no longer
  produce errors.
{% endfunFact %}

### Function Calls

This change will also remove special parsing for the `expression()` function or
`progid:...()` functions with vendor prefixes. No browser ever actually shipped
a vendor-prefixed versions of these function, so having special parsing for them
is unnecessary. Vendor-prefixed `expression()` functions like
`-foo-expression()` will be parsed as normal Sass functions, and vendor-prefixed
`progid:...()` functions like `-foo-progid:bar()` will be syntax errors because
that's not generally valid CSS syntax.

### Phase 1

{% compatibility 'dart: "1.98.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Currently, Dart Sass emits a deprecation warning if you define a function `URL`,
`EXPRESSION`, or `ELEMENT`, or the same names with any combination of uppercase
and lowercase letters. (Fully lowercase names were forbidden prior to this and
remain forbidden.)

Function calls with these names are still parsed as normal Sass function calls,
calling a user-defined function if one exists or falling back to a plain-CSS
function with normal SassScript argument parsing otherwise.

Dart Sass also emits a deprecation warning for calls to vendor-prefixed
`expression()` functions, but only if those functions will behave differently
when parsed as normal Sass functions. This includes calls whose arguments aren't
syntactically-valid SassScript expressions or whose arguments would be
meaningful in SassScript in a way they aren't in plain CSS, but not calls whose
arguments would be handled the same way in either case. It's always safe to use
interpolation in either case.

Dart Sass emits a deprecation warning for all vendor-prefixed `progid:...()` calls.

{% render 'silencing_deprecations' %}

### Phase 2

{% compatibility 'dart: false', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

In a future release, Dart Sass will emit an error for custom functions named
`URL`, `EXPRESSION`, or `ELEMENT`, or the same names with any combination of
uppercase and lowercase letters. Calls to these function names will be parsed as
[special functions] rather than normal SassScript.

Calls to vendor-prefixed `expression()` functions will be parsed as normal
SassScript, and calls to vendor-prefixed `progid:...()` functions will produce
errors.

[special functions]: /documentation/syntax/special-functions


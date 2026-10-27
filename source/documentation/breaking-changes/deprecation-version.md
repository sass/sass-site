---
title: 'Breaking Change: Deprecation Version'
introduction: >
  In the future, it will be an error to pass a
  [`Version`](/documentation/js-api/classes/version/) beyond the current
  implementation version to
  [`Options.fatalDeprecations`](/documentation/js-api/interfaces/options/#fatalDeprecations).
---

Currently, if you pass a `Version` that's greater than the version of the Sass
implementation you're using, *all* deprecations will be treated as fatal. This
means that when you upgrade Sass, any new deprecations will also be immediately
fatal. This probably isn't what you want: you don't know what behavior will be
deprecated in the future, so this could make any Sass release break your project
unexpectedly.

{% compatibility 'dart: "3.0.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Starting in Dart Sass 3.0.0, passing a `Version` beyond the current one will be
an error.

## Transition Period

{% compatibility 'dart: "1.107.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

Until Dart Sass 3.0.0 is released, passing a `Version` that's too large will
just produce a warning.

If you want to prepare for the upcoming breaking change, the easiest way is just
to pass your current Dart Sass implementation version. If you want to opt into
some future deprecations, you can write code to look for them on the
[`sass.deprecations`] record.

[`sass.deprecations`]: /documentation/js-api/variables/deprecations-1/

{% render 'silencing_deprecations' %}

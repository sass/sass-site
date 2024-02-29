---
title: 'Documentation'
introduction: >
  Sass is a stylesheet language that’s compiled to CSS. It allows you to use
  [variables](/documentation/variables), [nested
  rules](/documentation/style-rules#nesting),
  [mixins](/documentation/at-rules/mixin),
  [functions](/documentation/modules), and more, all with a fully
  CSS-compatible syntax. Sass helps keep large stylesheets well-organized and
  makes it easy to share design within and across projects.
---

- If you're looking for an introduction to Sass, check out [the
  tutorial](/guide).

- If you want to look up a built-in Sass function, look no further than [the
  built-in module reference](/documentation/modules).

- If you're calling Sass from JavaScript, you may want the [JS API
  documentation][js].

- Or the [Dart API documentation][dart] if you're calling it from Dart.

- Otherwise, use the table of contents for the language reference!

[js]: https://github.com/sass/node-sass#usage
[dart]: https://pub.dartlang.org/documentation/sass/latest/sass/sass-library.html

## Older Versions

This documentation is written for the most recent version of the Sass language.
If you're using [Dart Sass] {{ releases['dart-sass'].version }}, you'll have
access to all the features described here. But if you're using an older version
of Dart Sass or a deprecated Sass implementation like [LibSass] or [Ruby Sass],
there may be some behavioral differences.

[Dart Sass]: /dart-sass
[LibSass]: /libsass
[Ruby Sass]: /ruby-sass

Anywhere behavior differs between versions or implementations, the documentation
includes a compatibility indicator like this:

{% compatibility 'dart: true', 'libsass: "3.6.0"', 'ruby: false', 'feature: "Feature Name"' %}{% endcompatibility %}

Implementations with a "✓" fully support the feature in question, and
implementations with a "✗" don't support it all. Implementations with a version
number started supporting the feature in question at that version.
Implementations can also be marked as "partial":

{% compatibility 'dart: true', 'libsass: "partial"', 'ruby: false' %}
  Additional details go here.
{% endcompatibility %}

This indicates that the implementation only supports some aspects of the
feature. These compatibility indicators (and many others) have a "➤" button,
which can be clicked to show more details about exactly how the implementations
differ and which versions support which aspects of the feature in question.

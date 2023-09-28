---
title: Mixins
---

{% compatibility 'dart: "1.69.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

[Mixins] can also be values! You can't directly write a mixin as a value, but
you can pass a mixin's name to the [`meta.get-mixin()` function] to get it as a
value. Once you have a mixin value, you can pass it to the [`meta.apply()`
mixin] to call it. This is for libraries to be extensible in complex and
powerful ways.

[Mixins]: /documentation/at-rules/mixin
[`meta.get-mixin()` function]: /documentation/modules/meta#get-mixin
[`meta.apply()` function]: /documentation/modules/meta#apply

{% render 'code_snippets/example-first-class-mixin' %}

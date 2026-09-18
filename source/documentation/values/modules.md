---
title: Module Values
---

{% compatibility 'dart: "1.105.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

[Modules] can also be values! You can't directly write a module as a value, but
you can refer to a `@use`d module via [`meta.get-module()`] or load a new one
via [`meta.load()`]. Module values make it possible to choose whether or not to
loda a module based on your stylesheet's logic, or to conditionally load
different modules.

Once you have a module value, you can use various additional functions to
inspect and interact with it:

* [`meta.module-variables()`] and [`meta.global-variable-exists()`] allow you to
  inspect its variables.
* [`meta.get-function()`], [`meta.module-functions()`], and
  [`meta.function-exists()`] allow you to inspect its functions.
* [`meta.get-mixin()`], [`meta.module-mixins()`], and [`meta.mixin-exists()`]
  allow you to inspect its mixins.

In addition, you can use the [`meta.css()`] mixin to include the CSS that a
module value contains.

[Modules]: /documentation/at-rules/use
[`meta.get-module()`]: /documentation/modules/meta#get-module
[`meta.load()`]: /documentation/modules/meta#load
[`meta.module-variables()`]: /documentation/modules/meta#module-variables
[`meta.global-variable-exists()`]: /documentation/modules/meta#global-variable-exists
[`meta.get-function()`]: /documentation/modules/meta#get-function
[`meta.module-functions()`]: /documentation/modules/meta#module-functions
[`meta.function-exists()`]: /documentation/modules/meta#function-exists
[`meta.get-mixin()`]: /documentation/modules/meta#get-mixin
[`meta.module-mixins()`]: /documentation/modules/meta#module-mixins
[`meta.mixin-exists()`]: /documentation/modules/meta#mixin-exists

{% render 'code_snippets/example-first-class-module' %}

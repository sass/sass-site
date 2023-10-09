---
title: Function Values
---

{% render 'doc_snippets/call-impl-status' %}

[Functions][] can be values too! You can't directly write a function as a value,
but you can pass a function's name to the [`meta.get-function()` function][] to
get it as a value. Once you have a function value, you can pass it to the
[`meta.call()` function][] to call it. This is useful for writing *higher-order
functions* that call other functions.

[Functions]: /documentation/at-rules/function
[`meta.get-function()` function]: /documentation/modules/meta#get-function
[`meta.call()` function]: /documentation/modules/meta#call

{% render 'code_snippets/example-first-class-function' %}

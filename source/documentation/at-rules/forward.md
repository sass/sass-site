---
title: "@forward"
introduction: >
  The `@forward` rule loads a Sass stylesheet and makes its
  [mixins](/documentation/at-rules/mixin),
  [functions](/documentation/at-rules/function), and
  [variables](/documentation/variables) available when your stylesheet is
  loaded with the [`@use` rule](/documentation/at-rules/use). It makes it
  possible to organize Sass libraries across many files, while allowing their
  users to load a single entrypoint file.
---

The rule is written `@forward "<url>"`. It loads the module at the given URL
just like `@use`, but it makes the [public][] members of the loaded module
available to users of your module as though they were defined directly in your
module. Those members aren't available in your module, though—if you want that,
you'll need to write a `@use` rule as well. Don't worry, it'll only load the
module once!

[public]: /documentation/at-rules/use#private-members

If you *do* write both a `@forward` and a `@use` for the same module in the same
file, it's always a good idea to write the `@forward` first. That way, if your
users want to [configure the forwarded module][], that configuration will be
applied to the `@forward` before your `@use` loads it without any configuration.

[configure the forwarded module]: /documentation/at-rules/use#configuration

{% funFact %}
  The `@forward` rule acts just like `@use` when it comes to a module's CSS.
  Styles from a forwarded module will be included in the compiled CSS output,
  and the module with the `@forward` can [extend][] it, even if it isn't also
  `@use`d.

  [extend]: /documentation/at-rules/extend
{% endfunFact %}

{% codeExample 'forward' %}
  // src/_list.scss
  @mixin list-reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ---
  // bootstrap.scss
  @forward "src/list";
  ---
  // styles.scss
  @use "bootstrap";

  li {
    @include bootstrap.list-reset;
  }
  ===
  // src/_list.sass
  @mixin list-reset
    margin: 0
    padding: 0
    list-style: none
  ---
  // bootstrap.sass
  @forward "src/list"
  ---
  // styles.sass
  @use "bootstrap"

  li
    @include bootstrap.list-reset
  ===
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
{% endcodeExample %}

## Adding a Prefix

Because module members are usually used with [a namespace][], short and simple
names are usually the most readable option. But those names might not make sense
outside the module they're defined in, so `@forward` has the option of adding an
extra prefix to all the members it forwards.

This is written `@forward "<url>" as <prefix>-*`, and it adds the given prefix
to the beginning of every mixin, function, and variable name forwarded by the
module. For example, if the module defines a member named `reset` and it's
forwarded `as list-*`, downstream stylesheets will refer to it as `list-reset`.

[a namespace]: /documentation/at-rules/use#loading-members

{% codeExample 'prefix' %}
  // src/_list.scss
  @mixin reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ---
  // bootstrap.scss
  @forward "src/list" as list-*;
  ---
  // styles.scss
  @use "bootstrap";

  li {
    @include bootstrap.list-reset;
  }
  ===
  // src/_list.sass
  @mixin reset
    margin: 0
    padding: 0
    list-style: none
  ---
  // bootstrap.sass
  @forward "src/list" as list-*
  ---
  // styles.sass
  @use "bootstrap"

  li
    @include bootstrap.list-reset
  ===
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
{% endcodeExample %}

## Controlling Visibility

Sometimes, you don't want to forward *every* member from a module. You may want
to keep some members private so that only your package can use them, or you may
want to require your users to load some members a different way. You can control
exactly which members get forwarded by writing `@forward "<url>" hide
<members...>` or `@forward "<url>" show <members...>`.

The `hide` form means that the listed members shouldn't be forwarded, but
everything else should. The `show` form means that *only* the named members
should be forwarded. In both forms, you list the names of mixins, functions, or
variables (including the `$`).

{% codeExample 'controlling-visibility', false %}
  // src/_list.scss
  $horizontal-list-gap: 2em;

  @mixin list-reset {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  @mixin list-horizontal {
    @include list-reset;

    li {
      display: inline-block;
      margin: {
        left: -2px;
        right: $horizontal-list-gap;
      }
    }
  }
  ---
  // bootstrap.scss
  @forward "src/list" hide list-reset, $horizontal-list-gap;
  ===
  // src/_list.sass
  $horizontal-list-gap: 2em

  @mixin list-reset
    margin: 0
    padding: 0
    list-style: none


  @mixin list-horizontal
    @include list-rest

    li
      display: inline-block
      margin:
        left: -2px
        right: $horizontal-list-gap
  ---
  // bootstrap.sass
  @forward "src/list" hide list-reset, $horizontal-list-gap
{% endcodeExample %}

## Configuring Modules

{% compatibility 'dart: "1.24.0"', 'libsass: false', 'ruby: false' %}{% endcompatibility %}

The `@forward` rule can also load a module with [configuration][]. This mostly
works the same as it does for `@use`, with one addition: a `@forward` rule's
configuration can use the `!default` flag in its configuration. This allows a
module to change the defaults of an upstream stylesheet while still allowing
downstream stylesheets to override them.

[configuration]: /documentation/at-rules/use#configuration

{% codeExample 'configuration' %}
  // _library.scss
  $black: #000 !default;
  $border-radius: 0.25rem !default;
  $box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default;

  code {
    border-radius: $border-radius;
    box-shadow: $box-shadow;
  }
  ---
  // _opinionated.scss
  @forward 'library' with (
    $black: #222 !default,
    $border-radius: 0.1rem !default
  );
  ---
  // style.scss
  @use 'opinionated' with ($black: #333);
  ===
  // _library.sass
  $black: #000 !default
  $border-radius: 0.25rem !default
  $box-shadow: 0 0.5rem 1rem rgba($black, 0.15) !default

  code
    border-radius: $border-radius
    box-shadow: $box-shadow
  ---
  // _opinionated.sass
  @forward 'library' with ($black: #222 !default, $border-radius: 0.1rem !default)
  ---
  // style.sass
  @use 'opinionated' with ($black: #333)
  ===
  code {
    border-radius: 0.1rem;
    box-shadow: 0 0.5rem 1rem rgba(51, 51, 51, 0.15);
  }
{% endcodeExample %}

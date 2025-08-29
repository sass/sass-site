---
title: 'Breaking Change: Mixed Declarations'
introduction: >
  CSS changed the way it handles declarations mixed with nested rules, and
  we made sure Sass matched its behavior.
---

## The Story So Far

Historically, if you mixed together nested rules and declarations in Sass, it
would pull all the declarations to the beginning of the rule to avoid
duplicating the outer selector more than necessary. For example:

{% codeExample 'mixed-declarations-old' %}
  .example {
    color: red;

    &--serious {
      font-weight: bold;
    }

    font-weight: normal;
  }
  ===
  .example
    color: red

    &--serious
      font-weight: bold


    font-weight: normal
  ===
  .example {
    color: red;
    font-weight: normal;
  }

  .example--serious {
    font-weight: bold;
  }
{% endcodeExample %}

When [plain CSS Nesting] was first introduced, it behaved the same way. However,
after some consideration, [the CSS working group decided] it made more sense to
make the declarations apply in the order they appeared in the document, like so:

[plain CSS Nesting]: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting
[the CSS working group decided]: https://github.com/w3c/csswg-drafts/issues/8738

{% codeExample 'mixed-declarations-new' %}
  .example {
    color: red;

    &--serious {
      font-weight: bold;
    }

    font-weight: normal;
  }
  ===
  .example
    color: red

    &--serious
      font-weight: bold


    font-weight: normal
  ===
  .example {
    color: red;
  }

  .example--serious {
    font-weight: bold;
  }

  .example {
    font-weight: normal;
  }
{% endcodeExample %}

## Deprecating the Old Way

{% compatibility 'dart: "1.77.7"', 'libsass: false', 'ruby: false' %}
{% endcompatibility %}

The use of declarations _after_ nested rules was first deprecated in order to
notify users of the upcoming change and give them time to make their stylesheets
compatible with it.

Users who wanted to opt into the new CSS semantics early could wrap their nested
declarations in `& {}`:

{% codeExample 'mixed-declarations-opt-in' %}
  .example {
    color: red;

    &--serious {
      font-weight: bold;
    }

    & {
      font-weight: normal;
    }
  }
  ===
  .example
    color: red

    &--serious
      font-weight: bold


    &
      font-weight: normal
{% endcodeExample %}

{% render 'silencing_deprecations' %}

## The New Way

{% compatibility 'dart: "1.92.0"', 'libsass: false', 'ruby: false' %}
{% endcompatibility %}

Modern versions of Sass behave the same way as plain CSS: declarations are
emitted in the same order they're written, even if that involves duplicating the
rule that contains them to account for interleaved rules. The same is true for
loud (`/* */`-style) comments and at-rules without children.

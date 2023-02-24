---
title: Code Style Guide
introduction: >
  If you would like to contribute to this website's code, please adhere to the
  following code style guidelines.
---

- Please try to keep lines at a maximum of 80 characters.
- Favor clarity over brevity in naming anything.
- Pages, partials, and layouts end with `.liquid` or `.md`.

## Markup

For the most part, we use [LiquidJS][] and [Markdown][] for writing markup. If
you need to use regular HTML anywhere, write HTML5, but favor a strict XHTML
style:

- Use well-formed markup; elements are nested properly and do not overlap.
- Write elements and attributes in lowercase.
- Quote all attributes.
- Self-close empty elements with a space before the trailing slash: (`<hr />`)

## Style

This website uses Sass in the SCSS syntax. Make sure you're using the classes
that we have to offer before rewriting something, unless you can justify
otherwise.

- Use the style [Brad Frost writes about][bf] for clarity:
  - Note that older classes do not use this style yet, but we will refactor over
    time.
  - Use a `sl-` global namespace.
  - Use the class prefixes [Harry Roberts][hr] advocates, though we are using a
    much simpler set:
    - `c-` is for **components**. Example: `sl-c-card`.
    - `l-` is for **layouts**. Example: `sl-l-grid`.
    - `is-` and `has-` for states. Example: `sl-is-active`.
    - `js-` is for classes specifically created for JavaScript targeting.
      Exampe: `sl-js-toggle-navigation`
  - Use the [BEM][] syntax.
    - **Block** -- the overall component object. Example: `sl-c-card`.
    - **Element** -- any child of the block. Example: `sl-c-card__header`.
    - **Modifier** -- any variation. This can be put on a block. Example:
      `sl-c-card--primary`. It can also be put on an element Example:
      `sl-c-card__header--large`.
- Keep classes as flat as possible, and avoid nesting too deep.
- Avoid using element selectors **unless** you're using a wrapper utility to
  target everything inside (such as a class around a block of markdown or other
  longform text to style all its elements properly). This is specifically for
  when it doesn't make sense to use classes. Be mindful when do this. We can
  give you feedback in a code review for instances like this.
- For naming of variables, mixins, placeholder selectors, or classes, use the
  general-to-specific approach. See [this article][gts] for more details.
- Write comma-delimited selectors on separate lines.

[liquidjs]: https://liquidjs.com/
[markdown]: https://daringfireball.net/projects/markdown/
[bf]: https://bradfrost.com/blog/post/css-architecture-for-design-systems/
[hr]: https://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/
[bem]: https://getbem.com/introduction/
[gts]: https://webdesign.tutsplus.com/articles/quick-tip-name-your-sass-variables-modularly--webdesign-13364

---
layout: has_no_sidebars
h1: CSS with superpowers
no_container: true
is_home: true
eleventyComputed:
  section_bottom:
    - header: CSS Compatible
      body: >
        Sass is completely compatible with all versions of CSS. We take this
        compatibility seriously, so that you can seamlessly use any available
        CSS libraries.
    - header: Feature Rich
      body: >
        Sass boasts more features and abilities than any other CSS extension
        language out there. The Sass Core Team has worked endlessly to not only
        keep up, but stay ahead.
    - header: Mature
      body: >
        Sass has been actively supported for
        {{ 'Tue Nov 28 19:43:58 2006 +0000' | formatDistanceToNow }} by its
        loving Core Team.
    - header: Industry Approved
      body: >
        Over and over again, the industry is choosing Sass as the premier CSS
        extension language.
    - header: Large Community
      body: >
        Sass is actively supported and developed by a consortium of several tech
        companies and hundreds of developers.
    - header: Frameworks
      body: >
        There are an endless number of frameworks built with Sass.
        [Bootstrap](https://getbootstrap.com/), [Bourbon](http://bourbon.io/),
        and [Susy](http://susy.oddbird.net/) just to name a few.
---

<div class="sl-l-grid sl-l-grid--full sl-l-large-grid--fit sl-l-large-grid--center sl-l-large-grid--gutters-large">
  <div class="sl-l-grid__column">
    <p class="sl-c-introduction">
      Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.
    </p>
  </div>
  <p class="sl-l-grid__column">
    <img height="160" alt="Glasses" src="/assets/img/illustrations/glasses.svg">
  </p>
</div>

<!-- @@@ TODO: remove these sample code examples -->

```scss
// styles.scss
@use 'base';

.inverse {
  background-color: base.$primary-color;
  color: white;
}
```

```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}

.info {
  @include theme;
}
```

```css
/* This CSS will print because %message-shared is extended. */
.message,
.success,
.error,
.warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}
```

```scss
@use 'sass:math';

.container {
  display: flex;
}

article[role='main'] {
  width: math.div(600px, 960px) * 100%;
}
```

```scss
@debug math.pow(10, 2); // 100
@debug math.pow(100, math.div(1, 3)); // 4.6415888336
@debug math.pow(5, -2); // 0.04
```

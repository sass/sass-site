---
layout: has_no_sidebars
title: Install Sass
no_container: true
---

<div class="sl-l-grid sl-l-grid--full sl-l-large-grid--fit sl-l-large-grid--gutters-large">
  <div class="sl-l-grid__column">

## Applications

![Mouse](/assets/img/illustrations/mouse.svg)

There are a good many applications that will get you up and running
with Sass in a few minutes for Mac, Windows, and Linux. You can download
most of the applications for free but a few of them are paid apps
<small>(and totally worth it)</small>.

- [CodeKit](https://codekitapp.com/) (Paid) Mac
- [Hammer](http://hammerformac.com/) (Paid) Mac
- [LiveReload](http://livereload.com/) (Paid, Open Source) Mac Windows
- [Prepros](https://prepros.io/) (Paid) Mac Windows Linux
- [Scout-App](http://scout-app.io/) (Free, Open Source) Windows Linux Mac

## Libraries

The Sass team maintains two Node.js packages for Sass, both of which
support [the standard JavaScript API]. The [`sass` package] is pure
JavaScript, which is a little slower but can be installed on all platforms
Node.js supports. The [`sass-embedded` package] wraps a JS API around the
Dart VM, so it's faster but only supports Windows, Mac OS, and Linux.

[the standard JavaScript API]: /documentation/js-api
[`sass` package]: https://www.npmjs.com/package/sass
[`sass-embedded` package]: https://www.npmjs.com/package/sass-embedded

There are also community-maintained wrappers for the following languages:

- [Java](https://mvnrepository.com/artifact/de.larsgrefer.sass), including
  [Gradle](https://docs.freefair.io/gradle-plugins/current/reference/#_embedded_sass)
  and [Maven](https://github.com/HebiRobotics/sass-cli-maven-plugin) plugins
- [Ruby](https://github.com/ntkme/sass-embedded-host-ruby#readme)
- [Swift](https://github.com/johnfairh/swift-sass#readme)

</div>
<div class="sl-l-grid__column">

## Command Line

![Keyboard](/assets/img/illustrations/keyboard.svg)

When you install Sass on the command line, you'll be able to run the
`sass` executable to compile `.sass` and `.scss` files to `.css` files.
For example:

```shell
sass source/stylesheets/index.scss build/stylesheets/index.css
```

First install Sass using one of the options below, then run
`sass --version` to be sure it installed correctly. If it did, this will
include `{{ releases['dart-sass'].version }}`.
You can also run `sass --help` for more information
about the command-line interface.

Once it's all set up, **go and play**. If you're brand new to
Sass we've set up some resources to help you learn pretty darn quick.

<a href="/guide" class="sl-c-button sl-c-button--primary">Learn More About Sass</a>

Install Anywhere (Standalone)

: You can install Sass on Windows, Mac, or Linux by downloading the package for
your operating system [from
GitHub](https://github.com/sass/dart-sass/releases/tag/1.57.1) and [adding it to
your `PATH`](https://katiek2.github.io/path-doc/). That's all—there are no
external dependencies and nothing else you need to install.

Install Anywhere (npm)

: If you use Node.js, you can also install Sass using
[npm](https://www.npmjs.com/) by running

    ```shell
    npm install -g sass
    ```

    **However, please note** that this will install the pure JavaScript
    implementation of Sass, which runs somewhat slower than the other options
    listed here. But it has the same interface, so it'll be easy to swap in
    another implementation later if you need a bit more speed!

Install on Windows (Chocolatey)

: If you use the [Chocolatey package manager](https://chocolatey.org/) for
Windows, you can install Dart Sass by running

    ```shell
    choco install sass
    ```

Install on Mac OS X or Linux (Homebrew)

: If you use [the Homebrew package manager](https://brew.sh/) for Mac OS X or
Linux, you can install Dart Sass by running

    ```shell
    brew install sass/sass/sass
    ```

  </div>
</div>

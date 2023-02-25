# Contributing to the Sass website

The Sass website is open source. See a bug or typo? Have an idea? Do the
following:

- **Please read the [Implementation Guide][ig] and the [Style Guide][sg]**
  before contributing.
- Write a detailed description of what you're adding in the pull request
  (screenshots help).
- If there is new design or CSS, please add @Jina as a reviewer so she can see
  if it needs to be added to the style guide (or if a suitable alternative
  exists).
- Submit the pull request to the `main` branch.
- Drink whisky.

## Running Locally

### Install Node and Yarn

We recommend using [nvm](https://github.com/nvm-sh/nvm) for node version
management. [Install it](https://github.com/nvm-sh/nvm#installation-and-update)
if necessary, then run `nvm install` (once per active shell) to use the correct
version of node for development.

The correct [Yarn](https://yarnpkg.com/) version is included in the repo, and
will be used automatically for any `yarn` command.

To upgrade the node version used by the Sass website, update the version number
in these places and then run `nvm install` to upgrade:

- `package.json` (`engines.node` field)
- `.nvmrc`

To upgrade the yarn version, run `yarn set version latest`, then update the
version number in `package.json` (`engines.yarn` field) if necessary.

### Install dependencies

```
yarn
```

### Development tasks

Compile and run [Eleventy](https://www.11ty.dev/) server, with a watcher for
file changes:

```
yarn serve
```

The site will be compiled into `_site/` and available at http://localhost:8080.

You can also run individual commands:

```
# build the static site for development
yarn build

# format and lint all files
yarn lint
```

## Templates

- `.liquid` files are parsed as [LiquidJS](https://liquidjs.com/) templates.
  - To embed Markdown (or other languages) inside LiquidJS templates, use either
    the `{% markdown %}` tag or the [11ty `{% renderTemplate 'md' %}`
    tag](https://www.11ty.dev/docs/plugins/render/#rendertemplate). With the
    latter, note that multiple languages can be used, e.g.
    `{% renderTemplate 'liquid,md' %}`
  - To include partials, use either the
    [11ty `{% renderFile %}` tag](https://www.11ty.dev/docs/plugins/render/#renderfile)
    or the [LiquidJS `{% render %}` tag](https://liquidjs.com/tags/render.html).
    - Note that `renderFile` requires a relative path from the root directory,
      while `render` uses a relative path from the `/source/_includes/`
      directory.
    - Both tags create an encapsulated scope for the partial, so any variables
      used in the partial must be explicitly passed in.
    - `renderFile` allows overriding the template language (e.g.
      `{% renderFile 'source/_includes/footer_nav.md', data, 'liquid,md' %}`),
      while `render` always parses the partial as a LiquidJS template.
- `.md` files are parsed both as Markdown _and_ as LiquidJS templates.
- When using Markdown, remember that _indentation and whitespace (e.g newlines)
  matter_.

## Deploying

Every time a new commit is pushed to `main`, it will automatically be deployed
to sass-lang.com. Easy as that!

Thanks!

&mdash; Sass Core Team

[ig]: https://sass-lang.com/implementation
[sg]: https://sass-lang.com/styleguide

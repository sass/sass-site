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

* [Running Locally](#running-locally)
  * [Install Node](#install-node)
  * [Install Dependencies](#install-dependencies)
  * [Development Tasks](#development-tasks)
  * [Templates](#templates)
* [Deploying](#deploying)
* [Large Language Models](#large-language-models)

## Running Locally

### Install Node

We recommend using [nvm](https://github.com/nvm-sh/nvm) for node version
management. [Install it](https://github.com/nvm-sh/nvm#installation-and-update)
if necessary, then run `nvm install` (once per active shell) to use the correct
version of node for development.

To upgrade the node version used by the Sass website, update the version number
in these places and then run `nvm install` to upgrade:

- `package.json` (`engines.node` field)
- `.nvmrc`
- `netlify.toml`
- `Dockerfile`

### Install Dependencies

```
npm install
```

### Development Tasks

Compile and run [Eleventy](https://www.11ty.dev/) server, with a watcher for
file changes:

```
npm run serve
```

The site will be compiled into `_site/` and available at http://localhost:8080.

You can also run individual commands:

```
# build the static site for development
npm run build

# format and lint all files
npm run fix
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
  matter_. Custom tags attempt to strip leading whitespace from text contents
  (based on the whitespace of the first line of text) to allow for more readable
  indentation between tags -- see the `stripIndent` function in
  `source/helpers/type.ts` for details.

## Deploying

Every time a new commit is pushed to `main`, it will automatically be deployed
to sass-lang.com via [Netlify][]. Easy as that!

Thanks!

## Large Language Models

Do not submit any code or prose written or modified by large language models or
"artificial intelligence" such as GitHub Copilot or ChatGPT to this project.
These tools produce code that looks plausible, which means that not only is it
likely to contain bugs those bugs are likely to be difficult to notice on
review. In addition, because these models were trained indiscriminately and
non-consensually on open-source code with a variety of licenses, it's not
obvious that we have the moral or legal right to redistribute code they
generate.

&mdash; Sass Core Team

[ig]: https://sass-lang.com/implementation
[sg]: https://sass-lang.com/styleguide
[Netlify]: https://www.netlify.com/

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

## Deploying

Every time a new commit is pushed to `main`, it will automatically be deployed
to sass-lang.com. Easy as that!

Thanks!

&mdash; Sass Core Team

[ig]: https://sass-lang.com/implementation
[sg]: https://sass-lang.com/styleguide

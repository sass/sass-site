Contributing to the Sass website
================================

The Sass website is open source. See a bug or typo? Have an idea? Do the
following:

* **Please read the [Implementation Guide][ig] and the [Style Guide][sg]**
  before contributing.
* Write a detailed description of what you're adding in the pull request
  (screenshots help).
* If there is new design or CSS, please add @Jina as a reviewer so she can see
  if it needs to be added to the style guide (or if a suitable alternative
  exists).
* Submit the pull request to the `main` branch.
* Drink whisky.

## Running Locally

This site is built with [middleman][], a Ruby framework for building static
sites.

You will need [Ruby][], [rubygems](http://rubygems.org/) and [bundler][]
installed before you can run the site locally.

If the above dependencies are installed, in your command line of preference,
navigate to the project repo and run:

```
bundle install
bundle exec rake sass:import
bundle exec middleman
```

## Deploying

Every time a new commit is pushed to main, it will automatically be deployed
to sass-lang.com. Easy as that!

Thanks!

&mdash; Sass Core Team

[ig]:        https://sass-lang.com/implementation
[sg]:        https://sass-lang.com/styleguide
[middleman]: https://middlemanapp.com
[ruby]:      https://www.ruby-lang.org/en/downloads/
[bundler]:   https://bundler.io/

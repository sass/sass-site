Contributing to the Sass website
================================

**Please read the [Implementation Guide](https://sass-lang.com/implementation)**
The Sass website is open source. See a bug or typo? Have an idea? Just do the
following:

* Check out the style guide for design & code standards.
* Write a detailed description of what you're adding in the pull request
  (screenshots help).
* Add any new UI elements to the style guide.
* Submit the pull request to the `master` branch.
* Drink whisky.

## Running Locally

This site is built with [middleman](http://middlemanapp.com), a Ruby framework
for building static sites.

You will need [Ruby](https://www.ruby-lang.org/en/downloads/),
[rubygems](http://rubygems.org/) and [bundler](http://bundler.io/) installed
before you can run the site locally.

If the above dependencies are installed, in your command line of preference,
navigate to the project repo and run:

```
bundle install
bundle exec rake sass:import
bundle exec middleman
```

## Deploying

Every time a new commit is pushed to master, it will automatically be deployed
to sass-lang.com. Easy as that!

Thanks!

&mdash; [Team Sass Design](http://twitter.com/teamsassdesign)

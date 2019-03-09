require "html-proofer"
require "semantic"
require "yaml"
require "yard"

require File.dirname(__FILE__) + '/lib/raw_markdown_link'

task :test => ["sass:dart:version", "sass:libsass:version", "sass:ruby:version", :middleman, :test_without_rebuild]

task :test_without_rebuild do
  HTMLProofer.check_directory("build",
    url_ignore: [
      "https://www.drupal.org/dcoc", # This doesn't allow automated requests.
      "http://sass.logdown.com/posts/7081811", # This times out occasionally.
      # These fail on Travis only.
      "https://dnomak.com/flexiblegs/",
      "https://incident57.com/codekit/",
      "https://daringfireball.net/projects/markdown/",
      "#",
    ],
    assume_extension: true,
  ).run
end

namespace :sass do
  # Adds an implementation's version number to data/version.yml.
  def add_version(impl, version)
    path = 'data/version.yml'
    yaml = File.exist?(path) ? YAML.load(File.read(path)) : {}
    yaml[impl] = version
    File.open(path, 'w') {|f| f.write(YAML.dump(yaml))}
  end

  # Returns the latest tag in the current Git repository that's a valid semantic
  # version and is not a pre-release version *unless* only pre-release versions
  # are available.
  def latest_stable_tag
    tags = `git tag`.strip.split("\n").map do |v|
      begin
        Semantic::Version.new(v)
      rescue ArgumentError
        nil
      end
    end.compact.sort.reverse
    (tags.find {|t| !t.pre} || tags.first).to_s
  end

  namespace :dart do
    # Check out the latest commit of Dart Sass into the .dart-sass directory.
    task :checkout do
      unless Dir.exists?(".dart-sass")
        sh %{git clone git://github.com/sass/dart-sass .dart-sass}
      end

      Dir.chdir(".dart-sass") do
        sh %{git fetch}
        if ENV["DART_SASS_REVISION"]
          sh %{git checkout #{ENV["DART_SASS_REVISION"]}}
        else
          sh %{git checkout origin/master}
        end
      end
    end

    task :version => :checkout do
      add_version 'dart', Dir.chdir(".dart-sass") {latest_stable_tag}
    end
  end

  namespace :libsass do
    # Check out the latest commit of Dart Sass into the .libsass directory.
    task :checkout do
      unless Dir.exists?(".libsass")
        sh %{git clone git://github.com/sass/libsass .libsass}
      end

      Dir.chdir(".libsass") do
        sh %{git fetch}
        if ENV["LIBSASS_REVISION"]
          sh %{git checkout #{ENV["LIBSASS_REVISION"]}}
        else
          sh %{git checkout origin/master}
        end
      end
    end

    task :version => :checkout do
      add_version 'libsass', Dir.chdir(".libsass") {latest_stable_tag}
    end
  end

  namespace :ruby do
    # Check out the latest stable version of Ruby Sass into the .ruby-sass directory.
    task :checkout do
      unless Dir.exists?(".ruby-sass")
        sh %{git clone git://github.com/sass/ruby-sass .ruby-sass}
      end

      Dir.chdir(".ruby-sass") do
        sh %{git fetch}
        if ENV["RUBY_SASS_REVISION"]
          sh %{git checkout #{ENV["RUBY_SASS_REVISION"]}}
        else
          sh %{git checkout origin/stable}
          # Check out the most recent released stable version
          sh %{git checkout #{File.read("VERSION").strip}}
        end
      end
    end

    task :version => :checkout do
      add_version 'ruby', File.read(".ruby-sass/VERSION").strip
    end
  end

  desc "Import information from Sass implementations."
  task :import => ["dart:version", "libsass:version", "ruby:version"]
end

desc "Build the middleman-controlled portion of the site."
task :middleman do
  sh %{bundle exec middleman build --verbose}
end

desc "Build the site."
task "build" => ["sass:import", :middleman]

# Build the site on Heroku, then clean up unnecessary intermediate files.
task "assets:precompile" => :build do
  # Clean up unneccessary files to reduce slug size.
  sh %{rm -rf .dart-sass .libsass .ruby-sass .yardoc}
  sh %{bundle install --without=development}
end

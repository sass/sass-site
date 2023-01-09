require "html-proofer"
require "semantic"
require "yaml"

require File.dirname(__FILE__) + '/lib/raw_markdown_link'

task :test => [
  "sass:dart:version", "sass:libsass:version", "sass:typedoc:build", :middleman,
  :test_without_rebuild
]

task :test_without_rebuild do
  HTMLProofer.check_directory("build",
    url_ignore: [
      "https://www.drupal.org/dcoc", # This doesn't allow automated requests.
      # These are linked to from older blog posts. They redirect to updated
      # pages.
      %r{/documentation/file.SASS_REFERENCE.html(#.*)?},
      %r{/documentation/file.SASS_CHANGELOG.html(#.*)?},
      %r{/documentation/Sass/Script/Functions.html(#.*)?},
      "#",
    ],
    assume_extension: true,
    # These have the same links as blog posts
    file_ignore: ["blog.html", %r{blog/page/.*}],
    # Lots of external URLs fail flakily on CI, so we just don't check them
    # there.
    disable_external: ENV["CI"] == "true",
    # This error occurs (usually on GitHub) when the same IP requests a given
    # domain too often.
    http_status_ignore: [429],
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
        sh %{git clone https://github.com/sass/dart-sass .dart-sass}
      end

      Dir.chdir(".dart-sass") do
        sh %{git fetch}
        if ENV["DART_SASS_REVISION"]
          sh %{git checkout #{ENV["DART_SASS_REVISION"]}}
        else
          sh %{git checkout origin/main}
        end
      end
    end

    task :version => :checkout do
      add_version 'dart', Dir.chdir(".dart-sass") {latest_stable_tag}
    end
  end

  namespace :migrator do
    # Check out the latest commit of the Sass migrator into the .sass-migrator directory.
    task :checkout do
      unless Dir.exists?(".sass-migrator")
        sh %{git clone https://github.com/sass/migrator .sass-migrator}
      end

      Dir.chdir(".sass-migrator") do
        sh %{git fetch}
        if ENV["SASS_MIGRATOR_REVISION"]
          sh %{git checkout #{ENV["SASS_MIGRATOR_REVISION"]}}
        else
          sh %{git checkout origin/main}
        end
      end
    end

    task :version => :checkout do
      add_version 'migrator', Dir.chdir(".sass-migrator") {latest_stable_tag}
    end
  end

  namespace :libsass do
    # Check out the latest commit of LibSass into the .libsass directory.
    task :checkout do
      unless Dir.exists?(".libsass")
        sh %{git clone https://github.com/sass/libsass .libsass}
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

  namespace :typedoc do
    # Check out the latest commit of the Sass specification into the .language
    # directory.
    task :checkout do
      unless Dir.exists?(".language")
        sh %{git clone https://github.com/sass/sass .language}
      end

      Dir.chdir(".language") do
        sh %{git fetch}
        if ENV["LANGUAGE_REVISION"]
          sh %{git checkout #{ENV["LANGUAGE_REVISION"]}}
        else
          sh %{git checkout origin/main}
        end
      end
    end

    task :build => :checkout do
      Dir.chdir(".language") do
        sh %{npm install}
        sh %{ln -sf ../.language/node_modules ../tool/node_modules}
        sh %{npx typedoc \
            --plugin ../tool/typedoc-theme.ts --theme sass-site \
            --out ../source/documentation/js-api \
            --cleanOutputDir \
            js-api-doc/index.d.ts
        }
      end
      sh %{rm -r source/documentation/js-api/assets}
    end
  end

  desc "Import information from Sass implementations."
  task :import => ["dart:version", "libsass:version", "typedoc:build"]
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
  sh %{rm -rf .dart-sass .libsass}
  sh %{bundle install --without=development}
end

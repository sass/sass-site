require "semantic"
require "yaml"
require "yard"

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
        sh %{git clone git://github.com/sass/sass .ruby-sass}
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

    YARD::Rake::YardocTask.new(:doc) do |t|
      t.before = lambda do
        t.files = FileList.new('.ruby-sass/lib/**/*.rb') do |list|
          list.exclude('.ruby-sass/lib/sass/plugin/merb.rb')
          list.exclude('.ruby-sass/lib/sass/plugin/rails.rb')
        end.to_a
        t.options += FileList.new('.ruby-sass/yard/*.rb').to_a.map {|f| ['-e', f]}.flatten
        files = FileList.new('.ruby-sass/doc-src/*').to_a.sort_by {|s| s.size} + %w[.ruby-sass/MIT-LICENSE .ruby-sass/VERSION]
        t.options << '--files' << files.join(',')
        t.options << '--main' << '.ruby-sass/README.md'
        t.options << '--template-path' << 'yard'
      end

      t.after = lambda do
        sh %{rm -rf source/documentation}
        sh %{mv doc source/documentation}
        Dir['source/documentation/**/*.html'].each do |path|
          contents = File.read(path)
          File.open(path, 'w') {|file| file.write(contents.gsub(%r{css/common\.css}, '../assets/css/docs.css'))}
        end

        require 'nokogiri'
        doc = Nokogiri::HTML(File.read('source/documentation/file.SASS_REFERENCE.html'))

        doc.css("#filecontents").css("h1, h2, h3, h4, h5, h6").each do |h|
          next if h.inner_text.empty?
          h['id'] =
            case h.inner_text
            when "Referencing Parent Selectors: &"; "parent-selector"
            when /^Comments:/; "comments"
            when "Strings"; "sass-script-strings"
            when "Division and /"; "division-and-slash"
            when /^Subtraction,/; "subtraction"
            when "& in SassScript"; "parent-script"
            when "@-Rules and Directives"; "directives"
            when "@extend-Only Selectors"; "placeholders"
            when "@extend-Only Selectors"; "placeholders"
            when "@each"; "each-directive"
            when "Multiple Assignment"; "each-multi-assign"
            when "Mixin Directives"; "mixins"
            when /^Defining a Mixin:/; "defining_a_mixin"
            when /^Including a Mixin:/; "including_a_mixin"
            when "Arguments"; "mixin-arguments"
            when "Passing Content Blocks to a Mixin"; "mixin-content"
            else
              h.inner_text.downcase.gsub(/[^a-z _-]/, '').gsub(' ', '_')
            end
        end

        # Give each option an anchor.
        doc.css("#filecontents li p strong code").each do |c|
          c['id'] = c.inner_text.gsub(/:/, '') + '-option'
        end

        File.write('source/documentation/file.SASS_REFERENCE.html', doc.to_html)
      end
    end
    Rake::Task['sass:ruby:doc'].prerequisites.insert(0, 'sass:ruby:checkout')
    Rake::Task['sass:ruby:doc'].instance_variable_set('@comment', nil)
  end

  desc "Import information from Sass implementations."
  task :import => ["dart:version", "libsass:version", "ruby:version", "ruby:doc"]
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

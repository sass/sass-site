def bundle(cmd)
  old_bundle_gemfile = ENV["BUNDLE_GEMFILE"]
  ENV.delete("BUNDLE_GEMFILE")
  sh %{bundle #{cmd}}
ensure
  ENV["BUNDLE_GEMFILE"]
end

task :sass do
  unless Dir.exists?(".sass")
    sh %{git clone git://github.com/sass/sass .sass}
  end

  Dir.chdir(".sass") do
    sh %{rm -f Gemfile}
    sh %{git fetch}
    if ENV["SASS_REVISION"]
      sh %{git checkout #{ENV["SASS_REVISION"]}}
    else
      sh %{git checkout origin/stable}
      # Check out the most recent released stable version
      sh %{git checkout #{File.read("VERSION").strip}}
    end

    # Stable doesn't have a Gemfile, but it needs one to avoid using
    # this package's Gemfile. This should be removed when 3.3 is
    # released.
    File.open('Gemfile', 'w') do |f|
      f.puts <<GEMFILE
source "https://rubygems.org"
gemspec
gem 'rake'
GEMFILE
    end

    bundle 'install'
  end
end

task :sass_version => :sass do
  require 'yaml'
  version = File.read(".sass/VERSION").strip
  name = File.read(".sass/VERSION_NAME").strip
  File.open('data/version.yml', 'w') {|f| f.write(YAML.dump({'number' => version, 'name' => name}))}
end

task :sass_docs => :sass do
  ENV["RUBOCOP"] = "false"
  Dir.chdir(".sass") {bundle %{exec rake doc}}
  sh %{rm -rf source/documentation}
  sh %{cp -r .sass/doc source/documentation}
  Dir['source/documentation/**/*.html'].each do |path|
    contents = File.read(path)
    File.open(path, 'w') {|file| file.write(contents.gsub(%r{css/common\.css}, '../assets/css/docs.css'))}
  end
end

desc "Import information from Sass."
task :import_sass => [:sass_version, :sass_docs]

desc "Build the middleman-controlled portion of the site."
task :middleman do
  sh %{middleman build --verbose}
end

desc "Build the site."
task :build => [:check_ruby_version, :import_sass, :middleman]

task :check_ready_to_deploy do
  if `git config remote.heroku.url`.strip != "git@heroku.com:sass-lang.git"
    fail "You don't have a heroku remote, or it has the wrong URL."
  elsif !`git status --porcelain`.strip.empty?
    fail "You have uncommitted changes, not deploying."
  end
end

task :check_ruby_version do
  if RUBY_VERSION[0].to_i < 2
    fail "Ruby 2 is required"
  end
end

task :upload do
  sh %{git branch -D built-for-heroku} rescue nil
  sh %{git checkout -b built-for-heroku}
  sh %{git add --force build}
  sh %{git commit --message="Build."}
  sh %{git push --force heroku built-for-heroku:master}
  sh %{git checkout master}
end

desc "Deploy the site to heroku."
task :deploy => [:build, :upload]

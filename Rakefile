
# This is a helper function that properly sets up
# the environment in the .sass folder for bundle commands to work
def bundle(cmd)
  Bundler.with_clean_env do
    sh %{bundle #{cmd}}
  end
end


task :sass do
  unless Dir.exists?(".sass")
    sh %{git clone git://github.com/sass/sass .sass}
  end

  Dir.chdir(".sass") do
    sh %{git fetch}
    if ENV["SASS_REVISION"]
      sh %{git checkout #{ENV["SASS_REVISION"]}}
    else
      sh %{git checkout origin/stable}
      # Check out the most recent released stable version
      sh %{git checkout #{File.read("VERSION").strip}}
    end

    bundle %{install}
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
  Dir.chdir(".sass") { bundle %{exec rake doc}}
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
  sh %{bundle exec middleman build --verbose}
end

desc "Build the site."
task :build => [:import_sass, :middleman]

task :check_ready_to_deploy do
  if `git config remote.heroku.url`.strip != "git@heroku.com:sass-lang.git"
    fail "You don't have a heroku remote, or it has the wrong URL."
  elsif !`git status --porcelain`.strip.empty?
    fail "You have uncommitted changes, not deploying."
  end
end

task :upload do
  sh %{git branch -D built-for-heroku} rescue nil
  sh %{git checkout -b built-for-heroku} rescue nil
  sh %{git add --force build}
  sh %{git commit --message="Build."}
  sh %{git push --force heroku built-for-heroku:master}
  sh %{git checkout master}
end

task :clean do
  sh %{rm -rf .sass build}
end

desc "Deploy the site to heroku."
task :deploy => [:build, :upload]
task :deploy_clean => [:clean, :build, :upload]

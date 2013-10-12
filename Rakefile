def bundle(cmd)
  Bundler.with_clean_env {sh %{bundle #{cmd}}}
end

task :sass do
  unless Dir.exists?(".sass")
    sh %{git clone git://github.com/nex3/sass .sass}
  end

  Dir.chdir(".sass") do
    sh %{rm -f Gemfile}
    sh %{git fetch}
    sh %{git checkout origin/stable}
    # Check out the most recent released stable version
    sh %{git checkout #{File.read("VERSION").strip}}

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
  Dir.chdir(".sass") {bundle %{exec rake doc}}
  sh %{rm -rf source/assets/doc}
  sh %{cp -r .sass/doc source/assets/doc}
  sh %{find source/assets/doc -name '*.html' } +
    %{-exec sed 's/css\\/common\\.css/..\\/stylesheets\\/docs.css/g' -i {} \\;}
end

desc "Import information from Sass."
task :import_sass => [:sass_version, :sass_docs]

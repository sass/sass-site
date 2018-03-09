require 'yard'

namespace :sass do
  # Check out the latest stable version of Ruby Sass into the .sass directory.
  task :checkout do
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
    end
  end

  task :version => :checkout do
    require 'yaml'
    version = File.read(".sass/VERSION").strip
    name = File.read(".sass/VERSION_NAME").strip
    File.open('data/version.yml', 'w') {|f| f.write(YAML.dump({'number' => version, 'name' => name}))}
  end

  YARD::Rake::YardocTask.new(:doc) do |t|
    t.before = lambda do
      t.files = FileList.new('.sass/lib/**/*.rb') do |list|
        list.exclude('.sass/lib/sass/plugin/merb.rb')
        list.exclude('.sass/lib/sass/plugin/rails.rb')
      end.to_a
      t.options += FileList.new('.sass/yard/*.rb').to_a.map {|f| ['-e', f]}.flatten
      files = FileList.new('.sass/doc-src/*').to_a.sort_by {|s| s.size} + %w[.sass/MIT-LICENSE .sass/VERSION]
      t.options << '--files' << files.join(',')
      t.options << '--main' << '.sass/README.md'
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
  Rake::Task['sass:doc'].prerequisites.insert(0, 'sass:checkout')
  Rake::Task['sass:doc'].instance_variable_set('@comment', nil)

  desc "Import information from Sass."
  task :import => [:doc, :version]
end

desc "Build the middleman-controlled portion of the site."
task :middleman do
  sh %{bundle exec middleman build --verbose}
end

desc "Build the site."
task :build => ["sass:import", :middleman]

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

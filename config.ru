require "rubygems"

if ENV["HEROKU"].nil? || ENV["HEROKU"] == 'false'
  require "middleman"
  run Middleman.server
else
  require "rack/rewrite"

  use Rack::Rewrite do
    r301 %r{/docs/yardoc/(.*)}, '/documentation/$1'
    r301 '/tutorial.html', '/guide'
    r301 '/download.html', '/install'
    r301 '/documentation', '/documentation/'
    r301 '/documentation/_index.html', '/documentation/'

    moved_permanently   '/try.html', 'http://www.sassmeister.com'

    rewrite(%r{^(.*)/([^/.]+)$}, lambda do |match, rack_env|
        path = "#{File.dirname(__FILE__)}/build#{match[0]}"
        next "#{match[1]}/#{match[2]}/index.html" if Dir.exists?(path)
        next match[0] if File.exists?(path)
        "#{match[0]}.html"
    end)
  end

  use Rack::Static, :urls => [""], :root => 'build', :index => 'index.html'

  run lambda {}
end

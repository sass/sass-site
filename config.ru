require "rubygems"

require "rack/rewrite"
require "rack/contrib/not_found"
require "rack/contrib/try_static"

use Rack::Rewrite do
  r301 %r{/docs/yardoc/(.*)}, '/documentation/$1'
  r301 '/tutorial.html', '/guide'
  r301 '/download.html', '/install'
  r301 '/documentation', '/documentation/'
  r301 '/documentation/_index.html', '/documentation/'
  r301 '/try', 'http://sassmeister.com'
  r301 '/try.html', 'http://sassmeister.com'
end

if ENV["HEROKU"].nil? || ENV["HEROKU"] == 'false'
  require "middleman"

  server = Middleman.server
  run Rack::Cascade.new([
    server,
    lambda {|env| server.call(env.merge!('PATH_INFO' => '/404'))}
  ])
else
  use Rack::TryStatic,
    :urls => ["/"], :root => 'build', :index => 'index.html',
    :try => ['.html', '/index.html']

  run Rack::NotFound.new("build/404/index.html")
end

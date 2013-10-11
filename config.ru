# Old reqs for the Rack file... may need this if using GH pages or some
# other service
# ===============================================================================

#require "rubygems"
#require "middleman"
#require "typogruby"
#run Middleman.server

# For Heroku Staging Static Build
# ===============================================================================
# Modified version of TryStatic, from rack-contrib
# https://github.com/rack/rack-contrib/blob/master/lib/rack/contrib/try_static.rb

# Serve static files under a `build` directory:
# - `/` will try to serve your `build/index.html` file
# - `/foo` will try to serve `build/foo` or `build/foo.html` in that order
# - missing files will try to serve build/404.html or a tiny default 404 page

module Rack

  class TryStatic

    def initialize(app, options)
      @app = app
      @try = ['', *options.delete(:try)]
      @static = ::Rack::Static.new(lambda { [404, {}, []] }, options)
    end

    def call(env)
      orig_path = env['PATH_INFO']
      found = nil
      @try.each do |path|
        resp = @static.call(env.merge!({'PATH_INFO' => orig_path + path}))
        break if 404 != resp[0] && found = resp
      end
      found or @app.call(env.merge!('PATH_INFO' => orig_path))
    end
  end

end

use Rack::Deflater
use Rack::Auth::Basic, "Restricted Area" do |username, password|
  [username, password] == ['teamsassypants', 'super.sassy.pants']
end

use Rack::TryStatic, :root => "build", :urls => %w[/], :try => ['.html', 'index.html', '/index.html']


# Run your own Rack app here or use this one to serve 404 messages:
run lambda{ |env|
  not_found_page = File.expand_path("../build/404.html", __FILE__)
  if File.exist?(not_found_page)
    [ 404, { 'Content-Type'  => 'text/html'}, [File.read(not_found_page)] ]
  else
    [ 404, { 'Content-Type'  => 'text/html' }, ['404 - page not found'] ]
  end
}





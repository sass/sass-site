require "rubygems"

require "rack/conditional"
require "rack/rewrite"
require "rack/ssl"
require "rack/contrib/not_found"
require "rack/contrib/try_static"

# Make sure we don't force SSL on domains that don't have SSL certificates.
use Rack::Conditional, proc {|env| env["SERVER_NAME"] == "sass-lang.com"}, Rack::SSL

use Rack::Deflater

use Rack::TryStatic,
    urls: ["/"], root: 'build', index: 'index.html',
    try: ['.html', '/index.html']

run Rack::NotFound.new("build/404.html")

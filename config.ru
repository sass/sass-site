require "rubygems"

require "rack/conditional"
require "rack/rewrite"
require "rack/ssl"
require "rack/contrib/not_found"
require "rack/contrib/try_static"

# Make sure we don't force SSL on domains that don't have SSL certificates.
use Rack::Conditional, proc {|env| env["SERVER_NAME"] == "sass-lang.com"}, Rack::SSL

use Rack::Rewrite do
  r301 %r{/docs/yardoc/(.*)}, '/documentation/$1'
  r301 '/tutorial.html', '/guide'
  r301 '/download.html', '/install'
  r301 '/try', 'http://sassmeister.com'
  r301 '/try.html', 'http://sassmeister.com'
  r301 '/about', '/'
  r301 '/about.html', '/'

  r301 '/documentation/file.SASS_REFERENCE.html', '/documentation'
  r301 '/documentation/file.SASS_CHANGELOG.html', 'https://github.com/sass/dart-sass/blob/master/CHANGELOG.md'
  r301 '/documentation/file.INDENTED_SYNTAX.html', '/documentation/syntax'
  r301 '/documentation/file.SCSS_FOR_SASS_USERS.html', '/documentation/syntax'
  r301 '/documentation/Sass/Script/Functions.html', '/documentation/functions'
  r301 '/documentation/Sass/Script/Functions', '/documentation/functions'
  r301 %r{/documentation/(Sass.*)}, 'http://www.rubydoc.info/gems/sass/$1'

  r301 %r{/(.+)/$}, '/$1'
  r301 %r{/(.+)/index\.html$}, '/$1'

  r301 %r{/blog/(.*)}, 'http://sass.logdown.com/$1'
end

use Rack::Deflater

use Rack::TryStatic,
    urls: ["/"], root: 'build', index: 'index.html',
    try: ['.html', '/index.html']

run Rack::NotFound.new("build/404.html")

require "rubygems"
require "middleman"
require "typogruby"
require "rack/rewrite"

use Rack::Rewrite do
  r301 %r{/docs/yardoc/(.*)}, '/documentation/$1'
  r301 %r{/tutorial\.html}, '/guide'
  r301 %r{/download\.html}, '/install'
end

run Middleman.server
require "builder"
require 'susy'
require 'breakpoint'
require 'middleman-syntax'
# TODO: Make this work
# require "kss"
# require 'typogruby'
# require 'nokogiri'
#use Rack::typogruby
#module Rack
#  class Typo
#    def initialize(app)
#      @app = app
#    end
#    def call(env)
#      status, headers, response = @app.call(env)
#      if headers["Content-Type"].include? "text/html"
#        s = ""
#        response.body.each { |x| s << x}
#        doc = Nokogiri::HTML(s)
#        doc.encoding = 'UTF-8'
#        doc.at_css("body").traverse do |node|
#          if node.text?
#            node.replace(Nokogiri::HTML.fragment(Typogruby.improve(node.content)))
#          end
#        end

#        response.body = doc.to_html.lines.to_a
#      end
#      [status, headers, response]
#    end
#  end
#end
#activate :typogruby

activate :livereload
activate :directory_indexes
activate :automatic_image_sizes
activate :syntax,
         :linenos => 'table', # inline or table
         :linenostart => 2

set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
set :markdown_engine, :redcarpet
set :css_dir,    'assets/stylesheets'
set :js_dir,     'assets/javascripts'
set :images_dir, 'assets/images'

compass_config do |config|
  config.output_style = :condensed
end

with_layout :layout_2_column do
  page "/*", :layout => "layout_2_column"
end
with_layout :styleguide do
  page "/styleguide/*"
  #@styleguide = Kss::Parser.new('source/css')
end

page "/documentation/*", :directory_index => false



configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :gzip
  activate :cache_buster
  activate :asset_hash
  activate :favicon_maker,
    :favicon_maker_input_dir   => "source/assets/images/ico",
    :favicon_maker_output_dir  => "build/assets/images/ico"

  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  compass_config do |config|
    config.output_style = :compressed
  end
end

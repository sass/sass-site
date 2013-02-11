# ----------------------------------------------
# Page Processing
# ----------------------------------------------
set :markdown_engine, :redcarpet
set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
# ----------------------------------------------
# Livereload
# ----------------------------------------------
activate :livereload

# ----------------------------------------------
# CSS Processing
# ----------------------------------------------

# Susy grids in Compass
# First: gem install susy --pre
require 'susy'

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
  # config.sass_options = { :line_comments => true, :debug_info => true }
end

# ----------------------------------------------
# Code Coloring
# ----------------------------------------------

activate :syntax

# ----------------------------------------------
# Better Typography
# ----------------------------------------------

# TODO: Make this work

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



# ----------------------------------------------
# Page options, layouts, aliases and proxies
# ----------------------------------------------

# Per-page layout changes:
#
# With no layout
page "/responsive.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

# ----------------------------------------------
# Styleguide
# ----------------------------------------------

# Use KSS for awesome styleguide support
# require "kss"
#
# page "/styleguide/*", :layout => "styleguide" do
#   @styleguide = Kss::Parser.new('source/css')
# end

# ----------------------------------------------
# Helpers
# ----------------------------------------------

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

activate :directory_indexes

# Methods defined in the helpers block are available in templates
# helpers do
#   def some_helper
#     "Helping"
#   end
# end

helpers do
  # Generates a styleguide block.
  # def styleguide_block(section, &block)
  #   @section = @styleguide.section(section)
  #   @example_html = kss_capture{ block.call }
  #   @_out_buf << partial('styleguide/block')
  # end
#
  # # Captures the result of a block within an erb template without # spitting it
  # # to the output buffer.
  # def kss_capture(&block)
  #   out, @_out_buf = @_out_buf, ""
  #   yield
  #   @_out_buf
  # ensure
  #   @_out_buf = out
  # end

  # Calculate the years for a copyright
  def copyright_years(start_year)
    end_year = Date.today.year
    if start_year == end_year
      start_year.to_s
    else
      start_year.to_s + '-' + end_year.to_s
    end
  end
end

# ----------------------------------------------
# Directories
# ----------------------------------------------

set :css_dir, 'assets/stylesheets'

set :js_dir, 'assets/javascripts'

set :images_dir, 'assets/images'

activate :cache_buster

# ----------------------------------------------
# Build-specific configuration
# ----------------------------------------------

configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Create favicon/touch icon set from source/favicon_base.png
  activate :favicon_maker

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end
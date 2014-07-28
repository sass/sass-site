require 'susy'
require 'breakpoint'
require 'middleman-syntax'

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
set :css_dir,    'assets/css'
set :js_dir,     'assets/js'
set :images_dir, 'assets/img'

compass_config do |config|
  config.output_style = :condensed
end

with_layout :layout_2_column do
  page "/*", :layout => "layout_2_column"
end

with_layout :styleguide do
  page "/styleguide/*"
end

page "/humans.txt", :layout => false
page "/documentation/*", :directory_index => false


configure :build do
  activate :minify_css
  activate :minify_javascript
  activate :cache_buster
  activate :asset_hash
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  compass_config do |config|
    config.output_style = :compressed
  end
end

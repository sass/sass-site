require 'breakpoint'
require 'middleman-syntax'
require 'susy'

activate :automatic_image_sizes
activate :autoprefixer do |config|
  config.browsers = ["last 2 versions", "Explorer >= 9"]
  config.remove   = false
  config.cascade  = false
  config.inline   = true
  # config.ignore   = ['hacks.css']
end
activate :directory_indexes
activate :syntax

compass_config do |config|
  config.output_style = :expanded
end

set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true,
               :with_toc_data => true
set :markdown_engine, :redcarpet
set :css_dir,    'assets/css'
set :js_dir,     'assets/js'
set :images_dir, 'assets/img'

page "/humans.txt",                :layout => false
page "/sitemap.xml",               :layout => false

with_layout :styleguide do
  page "/styleguide/*"
end

with_layout :reference do
  page "/documentation/*"
end

configure :development do
  config[:host] = 'http://localhost:4567'
  activate :livereload
end

configure :build do
  config[:host] = data.sitemap.url
  activate :asset_hash
  activate :gzip
  activate :minify_css
  activate :minify_html
  activate :minify_javascript
  activate :relative_assets

  set :relative_links, true

  compass_config do |config|
    config.output_style = :compressed
  end
end

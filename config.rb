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
page "/404.html",                  :layout => :layout_2_column
page "/about.html",                :layout => :layout_2_column
page "/guide.html",                :layout => :layout_2_column
page "/libsass.html",              :layout => :layout_2_column
page "/sitemap.html",              :layout => :layout_2_column
page "/community-guidelines.html", :layout => :layout_2_column

with_layout :styleguide do
  page "/styleguide/*"
end

with_layout :reference do
  page "/documentation/*"
end

configure :development do
  activate :livereload
end

configure :build do
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

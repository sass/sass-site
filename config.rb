require 'breakpoint'
require 'builder'
require 'middleman-syntax'
require 'susy'
require 'typogruby'

activate :directory_indexes
activate :syntax

set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true
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
page "/documentation/*",           :directory_index => false

with_layout :styleguide do
  page "/styleguide/*"
end


@documentation         = {}
documentation_uri      = 'http://sass-lang.com/documentation/file.SASS_REFERENCE.html'
documentation_raw      = open(documentation_uri).read
documentation_sections = documentation_raw.split(/(<h2.+<\/p>)/)
documentation_sections.each do |section|
  if section =~ /<h2 id=(\w+)>/
    id = $1
    @documentation[id] = section
    proxy "/documentation/#{id}", 'documentation.html'
  end
end
ignore 'documentation.html'


configure :development do
  activate :livereload

  compass_config do |config|
    config.output_style = :expanded
  end
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

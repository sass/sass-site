require 'middleman-syntax'
require 'susy'

activate :automatic_image_sizes
activate :autoprefixer do |config|
  config.browsers = ['last 2 versions']
  # config.ignore   = ['hacks.css']
end
activate :directory_indexes
activate :livereload
activate :syntax

set :markdown, :fenced_code_blocks => true,
               :autolink => true,
               :smartypants => true,
               :with_toc_data => true
set :markdown_engine, :redcarpet
set :css_dir,    'assets/css'
set :js_dir,     'assets/js'
set :images_dir, 'assets/img'

page '/*.xml',                     :layout => false
page '/*.json',                    :layout => false
page '/*.txt',                     :layout => false
page '/*.html',                    :layout => :has_navigation
page '/community.html',            :layout => :has_complementary
page '/community-guidelines.html', :layout => :has_complementary
page '/libsass.html',              :layout => :has_both_sidebars
page '/404.html',                  :layout => :has_no_sidebars
page '/install.html',              :layout => :has_no_sidebars
page '/dart-sass.html',            :layout => :has_no_sidebars
page '/ruby-sass.html',            :layout => :has_no_sidebars
page '/implementation.html',       :layout => :has_no_sidebars
page '/styleguide/*',              :layout => :section_styleguide
page '/documentation/*',           :layout => :section_reference

configure :development do
  config[:host] = 'http://localhost:4567'
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
end

before_render do |body, _, _, template_class|
  if current_page.data.table_of_contents &&
     template_class == Middleman::Renderers::RedcarpetTemplate
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC.new)
    markdown.render(body).sub(/<ul( |>)/, '<ul class="table-of-contents"\1') + body
  end
end

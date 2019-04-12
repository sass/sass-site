require 'middleman-syntax'

require_relative 'lib/rack/try_dynamic'

use Rack::TryDynamic, try: ['.html', '/index.html']

activate :automatic_image_sizes
activate :autoprefixer do |config|
  config.browsers = ['last 2 versions']
  # config.ignore   = ['hacks.css']
end
activate :livereload
activate :syntax

set :markdown, fenced_code_blocks: true,
               autolink: true,
               smartypants: true,
               with_toc_data: true
Haml::Filters::Markdown.options.merge! fenced_code_blocks: true,
                                       autolink: true
set :markdown_engine, :redcarpet
set :css_dir,    'assets/css'
set :js_dir,     'assets/js'
set :images_dir, 'assets/img'

page '/*.xml',                     :layout => false
page '/*.json',                    :layout => false
page '/*.txt',                     :layout => false
page '/*.html',                    :layout => :has_no_sidebars
page '/404.html',                  :layout => :has_no_sidebars
page '/about.html',                :layout => :has_no_sidebars
page '/implementation.html',       :layout => :has_no_sidebars
page '/install.html',              :layout => :has_no_sidebars
page '/dart-sass.html',            :layout => :has_no_sidebars
page '/ruby-sass.html',            :layout => :has_no_sidebars
page '/community.html',            :layout => :has_complementary
page '/community-guidelines.html', :layout => :has_complementary
page '/libsass.html',              :layout => :has_both_sidebars
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

  set :relative_links, true
end

before_render do |body, page, _, template_class|
  if current_page.data.table_of_contents &&
     template_class == Middleman::Renderers::RedcarpetTemplate
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC.new)
    fragment = Nokogiri::HTML::DocumentFragment.parse(markdown.render(body))

    # The JS API's header names are uniquely large and difficult to break up
    # effectively. We do some post-processing to clean them up.
    if page.start_with?("js-api.")
      fragment.css("a code").each do |code|
        code.content = code.content.
          gsub(/^types\.[A-Za-z]+\./, '').
          gsub(/^[a-z]+\./, '').
          gsub(/^new types\./, 'new ').
          gsub(/\(.+\)$/, '()')
      end
    end

    # Modify the default Markdown table of contents to have overview links and
    # section classes.
    fragment.css("li > ul").each do |ul|
      a = ul.parent.elements.first
      a.add_class("section")
      ul.elements.before('<li class="overview"><a>Overview</a></li>')
      ul.elements.first.elements.first['href'] = a['href']
    end

    current_page.add_metadata(table_of_contents: fragment.to_html)
    body
  end
end

after_render do |content, path, locs|
  # Only modify the original page's rendering.
  next if path.include?("source/layouts/")

  content.gsub(%r{^<(h[0-6])(.*?)</\1>}m) do |header_text|
    header = Nokogiri::HTML::DocumentFragment.parse(header_text).children.first
    id = header.attr(:id)
    header.children.before("<a class='anchor' href='##{id}'></a>") if id
    header.to_html
  end
end

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

activate :blog do |blog|
  blog.prefix = "blog"
  blog.default_extension = ".md"
  blog.sources = "{id}-{title}.html"
  blog.permalink = "/{title}.html"
  blog.paginate = true
  blog.summary_length = 1000
end

set :markdown, fenced_code_blocks: true,
               autolink: true,
               smartypants: true,
               footnotes: true,
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
page '/blog/*',                    :layout => :blog

for dir in ['docs/yardoc', 'documentation'] do
  redirect "#{dir}/file.SASS_REFERENCE.html", to: '/documentation'
  redirect "#{dir}/file.SASS_CHANGELOG.html", to: 'https://github.com/sass/dart-sass/blob/master/CHANGELOG.md'
  redirect "#{dir}/file.INDENTED_SYNTAX.html", to: '/documentation/syntax'
  redirect "#{dir}/file.SCSS_FOR_SASS_USERS.html", to: '/documentation/syntax'
  redirect "#{dir}/Sass/Script/Functions.html", to: '/documentation/modules'
  redirect "#{dir}/Sass/Script/Functions.html", to: '/documentation/modules'
  redirect "#{dir}/functions.html", to: '/documentation/modules'
  redirect "#{dir}/functions/css.html", to: '/documentation/at-rules/function#plain-css-functions'

  Dir['source/documentation/modules/*.html.md.erb'].each do |file|
    module_name = File.basename(file, ".html.md.erb")
    redirect "#{dir}/functions/#{module_name}.html", to: "/documentation/modules/#{module_name}"
  end
end

Dir['source/documentation/breaking-changes/**'].each do |file|
  basename = File.basename(file).gsub(/\..*/, '')
  redirect "d/#{basename}.html", to: "/documentation/breaking-changes/#{basename}"
end

for url in %w[d/random-with-units documentation/breaking-changes/random-with-units
    d/color-units documentation/breaking-changes/color-units] do
  # Middleman and GitHub Pages require the origin URL to contain an extension,
  # otherwise it will serve the redirect as "octet-stream".
  redirect "#{url}.html", to: "/documentation/breaking-changes/function-units"
end

redirect 'tutorial.html', to: '/guide'
redirect 'download.html', to: '/install'
redirect 'try.html', to: 'https://www.sassmeister.com'
redirect 'about.html', to: '/'
redirect 'blog/posts/560719.html', to: '/blog/dropping-support-for-old-ruby-versions'
redirect 'blog/posts/1305238.html', to: '/blog/dart-sass-is-on-chocolatey'
redirect 'blog/posts/1404451.html', to: '/blog/sass-and-browser-compatibility'
redirect 'blog/posts/1909151.html', to: '/blog/dart-sass-is-in-beta'
redirect 'blog/posts/7081811.html', to: '/blog/ruby-sass-is-deprecated'

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

    # Expand the page's table of contents to the deepest level possible without
    # making it longer than the most-collapsed-possible documentation table of
    # contents.
    entries = fragment.css("> li")
    total_entries = entries.count
    loop do
      child_entries = entries.css("> ul > li")
      total_entries += child_entries.count
      break if total_entries > data.documentation.toc.count

      sections = entries.xpath("a[following-sibling::ul]")
      sections.add_class("section open")
      break if sections.empty?

      entries = child_entries
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
    header.children.before("<a class='anchor' href='##{id}'><span class='visuallyhidden'>#{header.text} permalink</span></a>") if id
    header.to_html
  end
end

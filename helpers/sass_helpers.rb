# coding: utf-8
require "pathname"

module SassHelpers
  def page_title
    title = "Sass: "
    if data.page.title
      title << data.page.title
    else
      title << "Syntactically Awesome Style Sheets"
    end
    title
  end

  def copyright_years(start_year)
    end_year = Date.today.year
    if start_year == end_year
      start_year.to_s
    else
      start_year.to_s + '&ndash;' + end_year.to_s
    end
  end

  def pages_for_group(group_name)
    group = data.nav.find do |g|
      g.name == group_name
    end

    pages = []

    return pages unless group

    if group.directory
      pages << sitemap.resources.select { |r|
        r.path.match(%r{^#{group.directory}}) && !r.data.hidden
      }.map do |r|
        ::Middleman::Util.recursively_enhance({
          :title => r.data.title,
          :path  => r.url
        })
      end.sort_by { |p| p.title }
    end

    pages << group.pages if group.pages

    pages.flatten
  end

  # Returns the version for the given implementation (`:dart`, `:ruby`, or
  # `:libsass`), or `nil` if it hasn't been made available yet.
  def impl_version(impl)
    data.version && data.version[impl]
  end

  # Returns the URL tag for the latest release of the given implementation.
  def release_url(impl)
    version = impl_version(impl)
    repo =
      case impl
      when :dart; "dart-sass"
      when :libsass; "libsass"
      when :ruby; "sass"
      end

    if version
      "https://github.com/sass/#{repo}/releases/tag/#{version}"
    else
      "https://github.com/sass/#{repo}/releases"
    end
  end

  # Returns HTML for a note about the given implementation.
  #
  # The contents should be supplied as a block.
  def impl_note
    concat(content_tag :aside, [
      content_tag(:i, 'TODO(jina): style this div'),
      content_tag(:strong, 'Implementation note:'),
      _render_markdown(capture {yield})
    ], class: 'impl-note')
  end

  # Renders a status dashboard for each implementation's support for a feature.
  #
  # Each implementation's value can be `true`, indicating that that
  # implementation fully supports the feature; `false`, indicating that it does
  # not yet support the feature; or a string, indicating the version it started
  # supporting the feature.
  #
  # When possible, prefer using the start version rather than `true`.
  def impl_status(dart: nil, libsass: nil, ruby: nil)
    raise ArgumentError.new("Missing argument dart.") if dart.nil?
    raise ArgumentError.new("Missing argument libsass.") if libsass.nil?
    raise ArgumentError.new("Missing argument ruby.") if ruby.nil?

    content_tag :table, [
      _impl_status_row('Dart Sass', dart),
      _impl_status_row('LibSass', libsass),
      _impl_status_row('Ruby Sass', ruby),
    ], class: 'impl-status'
  end

  # Renders a single row for `impl_status`.
  def _impl_status_row(name, status)
    status_text =
      if status == true
        "✓"
      elsif status == false
        "✗"
      else
        "since #{status}"
      end

    content_tag :tr, [
      content_tag(:th, name, class: 'name'),
      content_tag(:th, status_text, class: 'status'),
    ], class: status ? 'supported' : 'unsupported'
  end

  # A helper method that renders a chunk of Markdown text.
  def _render_markdown(content)
    @@redcarpet ||= Redcarpet::Markdown.new(
      Redcarpet::Render::HTML,
      markdown)
    @@redcarpet.render(content)
  end
end

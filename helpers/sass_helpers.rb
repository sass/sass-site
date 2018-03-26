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
end

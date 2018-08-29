require "pathname"
require "redcarpet"
require "rouge"
require "rouge/plugins/redcarpet"

module SassHelpers
  @@unique_id = 0

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

  # Renders a code example.
  #
  # This takes a block of SCSS and/or indented syntax code, and emits HTML that
  # (combined with JS) will allow users to choose which to display.
  #
  # The SCSS should be separated from the Sass with `===`. For example, in Haml:
  #
  #     - example do
  #       :plain
  #         .foo {
  #           color: blue;
  #         }
  #         ===
  #         .foo
  #           color: blue
  #
  # Different sections can be separated within one syntax (for example, to
  # indicate different files) with `---`. For example, in Haml:
  #
  #     - example do
  #       :plain
  #         // _reset.scss
  #         * {margin: 0}
  #         ---
  #         // base.scss
  #         @import 'reset';
  #         ===
  #         // _reset.sass
  #         *
  #           margin: 0;
  #         ---
  #         // base.sass
  #         @import reset
  #
  # Padding is added to the bottom of each section to make it the same length as
  # the section in the other language.
  def example
    contents = capture_haml {yield}
    scss, sass = contents.split("\n===\n")
    throw ArgumentError.new("Couldn't find === in:\n#{contents}") if sass.nil?

    scss_sections = scss.split("\n---\n").map(&:strip)
    sass_sections = sass.split("\n---\n").map(&:strip)

    # Calculate the lines of padding to add to the bottom of each section so
    # that it lines up with the same section in the other syntax.
    scss_paddings = []
    sass_paddings = []
    max_num_sections = [scss_sections, sass_sections].map(&:length).max
    max_num_sections.times do |i|
      scss_section = scss_sections[i]
      sass_section = sass_sections[i]
      scss_lines = scss_section.lines.count
      sass_lines = sass_section.lines.count
      max_lines = [scss_lines, sass_lines].max

      last_scss_section = i == scss_sections.length - 1
      last_sass_section = i == sass_sections.length - 1

      # Add 2 lines to each additional section: 1 for the extra padding, and 1
      # for the extra margin.
      if last_scss_section && !last_sass_section
        scss_paddings << sass_lines +
            sass_sections[(i + 1)..-1].sum {|s| s.lines.count + 2} -
            scss_lines
        break
      elsif last_sass_section && !last_scss_section
        sass_paddings << scss_lines +
            scss_sections[(i + 1)..-1].sum {|s| s.lines.count + 2} -
            scss_lines
        break
      end

      if max_lines > scss_lines
        scss_paddings << max_lines - scss_lines
        sass_paddings << nil
      elsif max_lines > sass_lines
        sass_paddings << max_lines - sass_lines
        scss_paddings << nil
      else
        sass_paddings << nil
        scss_paddings << nil
      end
    end

    @@unique_id += 1
    haml_concat content_tag(:div, [
      _syntax_div("SCSS", scss_sections, scss_paddings),
      _syntax_div("Sass", sass_sections, sass_paddings)
    ], class: "code-example", "data-unique-id": @@unique_id)
  end

  # Returns the text of an example div for a single syntax.
  def _syntax_div(name, sections, paddings)
    content_tag(:div, [
      content_tag(:h3, "#{name} Syntax"),
      *sections.zip(paddings).map do |section, padding|
        html = _render_markdown("```#{name.downcase}\n#{section}\n```")

        # Multiply the lines of padding by 2em, and add 1em to compensate for
        # the existing padding that we're overriding.
        padding ? html.sub("<pre ", "<pre style='padding-bottom: #{padding * 2 + 1}em'") : html
      end
    ], id: "example-#{@@unique_id}-#{name.downcase}")
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

  # A helper method that renders a chunk of Markdown text.
  def _render_markdown(content)
    @@redcarpet ||= Redcarpet::Markdown.new(
      Class.new(Redcarpet::Render::HTML) {include Rouge::Plugins::Redcarpet},
      markdown)
    find_and_preserve(@@redcarpet.render(content))
  end
end

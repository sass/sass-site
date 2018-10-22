require "pathname"
require "redcarpet"
require "rouge"
require "rouge/plugins/redcarpet"

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
  #
  # A third section may optionally be provided to represent compiled CSS. If
  # it's not passed and `autogen_css` is `true`, it's generated from the SCSS
  # source.
  #
  # If `syntax` is either `:sass` or `:scss`, the first section will be
  # interpreted as that syntax and the second will be interpreted (or
  # auto-generated) as the CSS output.
  def example(autogen_css: true, syntax: nil, &block)
    contents = _capture(&block)

    if syntax == :scss
      scss, css = contents.split("\n===\n")
    elsif syntax == :sass
      sass, css = contents.split("\n===\n")
    else
      scss, sass, css = contents.split("\n===\n")
      throw ArgumentError.new("Couldn't find === in:\n#{contents}") if sass.nil?
    end

    scss_sections = scss ? scss.split("\n---\n").map(&:strip) : []
    sass_sections = sass ? sass.split("\n---\n").map(&:strip) : []

    if css.nil? && autogen_css
      if scss_sections.length != 1
        throw ArgumentError.new(
                "Can't auto-generate CSS from more than one SCSS file.")
      end

      css = Sass::Engine.new(scss, syntax: :scss, style: :expanded).render
    end
    css_sections = css ? css.split("\n---\n").map(&:strip) : []

    # Calculate the lines of padding to add to the bottom of each section so
    # that it lines up with the same section in the other syntax.
    scss_paddings = []
    sass_paddings = []
    css_paddings = []
    max_num_sections =
      [scss_sections, sass_sections, css_sections].map(&:length).max
    max_num_sections.times do |i|
      scss_section = scss_sections[i]
      sass_section = sass_sections[i]
      css_section = css_sections[i]
      scss_lines = (scss_section || "").lines.count
      sass_lines = (sass_section || "").lines.count
      css_lines = (css_section || "").lines.count

      last_scss_section = i == scss_sections.length - 1
      last_sass_section = i == sass_sections.length - 1
      last_css_section = i == css_sections.length - 1

      max_lines = [
        last_scss_section ? 0 : scss_lines,
        last_sass_section ? 0 : sass_lines,
        last_css_section ? 0 : css_lines
      ].max

      scss_paddings <<
        if last_scss_section
          # Make sure the last section has as much padding as all the rest of
          # the other syntaxes' sections.
          _total_padding(sass_sections[i..-1], css_sections[i..-1]) -
            scss_lines - 2
        elsif max_lines > scss_lines
          max_lines - scss_lines
        end

      sass_paddings <<
        if last_sass_section
          _total_padding(scss_sections[i..-1], css_sections[i..-1]) -
            sass_lines - 2
        elsif max_lines > sass_lines
          max_lines - sass_lines
        end

      css_paddings <<
        if last_css_section
          _total_padding(scss_sections[i..-1], sass_sections[i..-1]) -
            css_lines - 2
        elsif max_lines > css_lines
          max_lines - css_lines
        end
    end

    @unique_id ||= 0
    @unique_id += 1
    id = @unique_id
    contents = []
    if scss
      contents <<
        _syntax_div("SCSS Syntax", "scss", scss_sections, scss_paddings, id)
    end

    if sass
      contents <<
        _syntax_div("Sass Syntax", "sass", sass_sections, sass_paddings, id)
    end

    if css
      contents <<
        _syntax_div("CSS Output", "css", css_sections, css_paddings, id)
    end

    text = content_tag(:div, contents,
      class: "code-example",
      "data-unique-id": @unique_id)
    if block_is_haml?(block)
      haml_concat text
    else
      concat text
    end
  end

  # Returns the number of lines of padding that's needed to match the height of
  # the `<pre>`s generated for `sections1` and `sections2`.
  def _total_padding(sections1, sections2)
    [sections1, sections1].map(&:length).max.times.sum do |i|
      # Add 2 lines to each additional section: 1 for the extra padding, and 1
      # for the extra margin.
      [
        (sections1[i] || "").lines.count,
        (sections2[i] || "").lines.count
      ].max + 2
    end
  end

  # Returns the text of an example div for a single syntax.
  def _syntax_div(name, syntax, sections, paddings, id)
    content_tag(:div, [
      content_tag(:h3, name),
      *sections.zip(paddings).map do |section, padding|
        html = _render_markdown("```#{syntax}\n#{section}\n```")

        # Multiply the lines of padding by 2em, and add 1em to compensate for
        # the existing padding that we're overriding.
        if padding
          html.sub("<pre ", "<pre style='padding-bottom: #{padding * 2 + 1}em'")
        else
          html
        end
      end
    ], id: "example-#{id}-#{syntax}", class: syntax)
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
    @redcarpet ||= Redcarpet::Markdown.new(
      Class.new(Redcarpet::Render::HTML) { include Rouge::Plugins::Redcarpet },
      markdown
    )
    find_and_preserve(@redcarpet.render(content))
  end

  # Captures the contents of `block` from ERB or Haml.
  def _capture(&block)
    block_is_haml?(block) ? capture_haml(&block) : capture(&block)
  end
end

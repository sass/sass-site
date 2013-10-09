module SassHelpers
  def page_title
    title = "Sass: "
    if data.page.title
      title << data.page.title
    else
      title << "CSS with Super Powers"
    end
    title
  end

  def copyright_years(start_year)
    end_year = Date.today.year
    if start_year == end_year
      start_year.to_s
    else
      start_year.to_s + '-' + end_year.to_s
    end
  end

  # # Generates a styleguide block.
  # def styleguide_block(section, &block)
  #   @section = @styleguide.section(section)
  #   @example_html = kss_capture{ block.call }
  #   @_out_buf << partial('styleguide/block')
  # end
  # # Captures the result of a block within an erb template without # spitting it
  # # to the output buffer.
  # def kss_capture(&block)
  #   out, @_out_buf = @_out_buf, ""
  #   yield
  #   @_out_buf
  # ensure
  #   @_out_buf = out
  # end
end

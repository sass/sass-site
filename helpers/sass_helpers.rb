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
end

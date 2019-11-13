xml.instruct!
xml.feed xmlns: "http://www.w3.org/2005/Atom" do
  blog_url = "#{config[:host]}/blog"
  xml.title "Sass Blog"
  xml.id blog_url
  xml.link href: blog_url
  xml.link href: "#{config[:host]}/feed.xml", rel: "self"
  xml.updated(blog.articles.first.date.to_time.iso8601) unless blog.articles.empty?

  blog.articles[0..5].each do |article|
    xml.entry do
      url = config[:host] + article.url
      xml.title article.title
      xml.link href: url, rel: "alternate"
      xml.id url
      xml.published article.date.to_time.iso8601
      xml.updated File.mtime(article.source_file).iso8601
      xml.author { xml.name article.data.author }
      xml.content article.body, "type" => "html"
    end
  end
end

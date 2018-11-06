require 'html-proofer'

class RawMarkdownLink < HTMLProofer::Check
  def run
    @html.search('//text()').each do |node|
      text = create_element(node)

      if node.text =~ /(\[[^\]]+\](\[[^\]]*\]|\([^)]+\)))/
        add_issue "Broken Markdown link #{$1}.", line: text.line
      end
    end
  end
end

source "https://rubygems.org"

gem "rake"
gem "rack"

group :development do
  gem "middleman", "~>3.1.5"
  # gem "middleman-favicon-maker"
  gem "middleman-livereload"
  gem "middleman-syntax"
  gem "redcarpet"
  gem "susy", "2.0.0.alpha.4"
  gem "breakpoint"
  gem "typogruby"
  gem "wdm", "~> 0.1.0", :platforms => [:mswin, :mingw]
  platforms :mri_18 do
    gem "ruby18_source_location"
  end
end

group :deploy do
  gem 'rack-rewrite'
end

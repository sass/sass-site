# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "rake"
gem "rack"
gem "rack-rewrite"
gem "rack-contrib"

group :development do
  gem "middleman", "~>3.1.5"
  # gem "middleman-favicon-maker"
  gem "middleman-livereload"
  gem "middleman-syntax"
  gem "normalize-rails", :require => false
  gem "redcarpet"
  gem "susy", "2.0.0.alpha.4"
  gem "breakpoint"
  gem "typogruby"
  gem "wdm", "~> 0.1.0", :platforms => [:mswin, :mingw]
  platforms :mri_18 do
    gem "ruby18_source_location"
  end
end

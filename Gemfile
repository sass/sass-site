# If you have OpenSSL installed, we recommend updating
# the following line to use "https"
source 'http://rubygems.org'

gem "rake"
gem "rack"
gem "rack-rewrite"
gem "rack-contrib"

group :development do
  gem "breakpoint",            "2.4.2", :require => false
  gem "builder",               "~> 3.2.2"
  gem "compass",               "1.0.0.alpha.21"
  gem "middleman",             "~>3.1.5"
  gem "middleman-livereload"
  gem "middleman-syntax"
  gem "normalize-rails",       :require => false
  gem "redcarpet"
  gem "sass",                  "~> 3.3.11"
  gem "susy",                  "~> 2.1.3"
  gem "typogruby"
  gem "wdm",                   "~> 0.1.0", :platforms => [:mswin, :mingw]
  platforms :mri_18 do
    gem "ruby18_source_location"
  end
end

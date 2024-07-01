#!/usr/bin/env bash

# Exit on error or pipe failure
set -eo pipefail

# Print each command and its arguments
set -x

# Clone and fetch the sass/sass repo
if [[ ! -d ".language" ]]; then
  git clone https://github.com/sass/sass .language
fi
cd .language

# Netlify caches this directory, which means that if it gets into a weird state
# it can break all future deploys. Avoid that by resetting it every time.
git reset --hard HEAD

git fetch
if [[ "$LANGUAGE_REVISION" ]]; then
  git checkout "$LANGUAGE_REVISION"
else
  git checkout origin/main
fi
git clean -fX
cd ..

# Build the JS API docs
cd .language
npm install
ln -sf ../.language/node_modules ../tool/node_modules
npm run typedoc -- \
  --plugin ../tool/typedoc-theme.js --theme sass-site \
  --out ../source/documentation/js-api \
  --cleanOutputDir
cd ..
rm -r source/documentation/js-api/assets

# Turn off printing commands
set +x

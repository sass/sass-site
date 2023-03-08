'use strict';

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const yaml = require('js-yaml');

const codeExample = require('./source/helpers/codeExample.ts').default;
const compatibility = require('./source/helpers/compatibility.ts');
const components = require('./source/helpers/components.ts');
const dates = require('./source/helpers/dates.ts');
const { liquidEngine, markdownEngine } = require('./source/helpers/engines.ts');
const page = require('./source/helpers/page.ts');
const type = require('./source/helpers/type.ts');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('source/assets/dist');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.watchIgnores.add('source/_data/versionCache.json');

  eleventyConfig.setLibrary('liquid', liquidEngine);
  eleventyConfig.setLibrary('md', markdownEngine);
  eleventyConfig.addDataExtension('yml, yaml', (contents) =>
    yaml.load(contents),
  );

  // Components
  eleventyConfig.addPairedLiquidShortcode('code', components.codeBlock);
  eleventyConfig.addPairedLiquidShortcode('codeExample', codeExample);
  // Ideally this could be used with named args, but that's not supported yet in
  // 11ty's implementation of LiquidJS:
  // https://github.com/11ty/eleventy/issues/2679
  // In the meantime, the args are: `dart`, `libsass`, `ruby`, `feature`
  eleventyConfig.addPairedLiquidShortcode(
    'compatibility',
    compatibility.compatibility,
  );
  eleventyConfig.addPairedLiquidShortcode('funFact', components.funFact);
  eleventyConfig.addLiquidFilter('implStatus', compatibility.implStatus);

  // Type
  eleventyConfig.addLiquidShortcode('lorem', type.getLorem);
  eleventyConfig.addPairedLiquidShortcode('markdown', type.markdown);
  eleventyConfig.addLiquidFilter('markdown', type.markdown);
  eleventyConfig.addPairedLiquidShortcode(
    'markdownInline',
    type.markdownInline,
  );
  eleventyConfig.addLiquidFilter('markdownInline', type.markdownInline);
  eleventyConfig.addPairedLiquidShortcode('typogr', type.typogr);
  eleventyConfig.addLiquidFilter('typogr', type.typogr);

  // Dates
  eleventyConfig.addLiquidFilter(
    'formatDistanceToNow',
    dates.formatDistanceToNow,
  );

  // Page
  eleventyConfig.addLiquidFilter('isTypedoc', page.isTypedoc);

  // plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

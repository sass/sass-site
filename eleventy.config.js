'use strict';

const {EleventyRenderPlugin} = require('@11ty/eleventy');
const {
  absoluteUrl,
  convertHtmlToAbsoluteUrls,
  dateToRfc3339,
  getNewestCollectionItemDate,
} = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const yaml = require('js-yaml');

const componentsPlugin =
  require('./source/helpers/components/index.ts').default;
const datesPlugin = require('./source/helpers/dates.ts').default;
const {liquidEngine, markdownEngine} = require('./source/helpers/engines.ts');
const pagesPlugin = require('./source/helpers/pages.ts').default;
const typePlugin = require('./source/helpers/type.ts').default;
const functionPlugin = require('./source/helpers/function.ts').default;

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('source/assets/dist');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');
  eleventyConfig.addPassthroughCopy('source/icon.png');
  eleventyConfig.addPassthroughCopy('source/browserconfig.xml');
  eleventyConfig.addPassthroughCopy('source/tile.png');
  eleventyConfig.addPassthroughCopy('source/tile-wide.png');
  eleventyConfig.addPassthroughCopy('source/robots.txt');

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.watchIgnores.add('source/_data/versionCache.json');

  eleventyConfig.setLibrary('liquid', liquidEngine);
  eleventyConfig.setLibrary('md', markdownEngine);
  eleventyConfig.addDataExtension('yml, yaml', contents => yaml.load(contents));
  eleventyConfig.addDataExtension('ts', (_, filepath) => require(filepath));

  // register filters and shortcodes
  eleventyConfig.addPlugin(componentsPlugin);
  eleventyConfig.addPlugin(datesPlugin);
  eleventyConfig.addPlugin(pagesPlugin);
  eleventyConfig.addPlugin(typePlugin);
  eleventyConfig.addPlugin(functionPlugin);

  // rss plugin
  eleventyConfig.addLiquidFilter('absoluteUrl', absoluteUrl);
  eleventyConfig.addLiquidFilter(
    'getNewestCollectionItemDate',
    getNewestCollectionItemDate
  );
  eleventyConfig.addLiquidFilter('dateToRfc3339', dateToRfc3339);
  eleventyConfig.addLiquidFilter(
    'htmlToAbsoluteUrls',
    convertHtmlToAbsoluteUrls
  );

  // other plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPlugin(syntaxHighlight, {
    errorOnInvalidLanguage: true,
  });

  eleventyConfig.setQuietMode(true);

  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

'use strict';

const path = require('path');
const { EleventyRenderPlugin } = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const yaml = require('js-yaml');
const { LoremIpsum } = require('lorem-ipsum');
const markdown = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownDefList = require('markdown-it-deflist');
const typogrify = require('typogr');
const { Liquid } = require('liquidjs');
const {
  getImplStatus,
  canSplit,
  generateCodeExample,
} = require('./source/helpers/sass_helpers.ts');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('source/assets/dist');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');

  eleventyConfig.setLiquidOptions({
    jsTruthy: true,
  });
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.watchIgnores.add('source/_data/versionCache.json');

  const mdown = markdown({
    html: true,
    typographer: true,
  })
    .use(markdownDefList)
    .use(markdownItAttrs);

  eleventyConfig.setLibrary('md', mdown);
  eleventyConfig.addDataExtension('yml, yaml', (contents) =>
    yaml.load(contents),
  );

  // Shortcodes...
  const lorem = new LoremIpsum();
  eleventyConfig.addLiquidShortcode('lorem', (type, number = 1) => {
    switch (type) {
      case 'sentence':
      case 'sentences':
        return lorem.generateSentences(number);
      case 'paragraph':
      case 'paragraphs':
        return lorem.generateParagraphs(number);
      case 'word':
      case 'words':
        return lorem.generateWords(number);
    }
    return '';
  });

  const engine = new Liquid({
    root: path.resolve(__dirname, 'source/_includes/'),
    extname: '.liquid',
  });
  eleventyConfig.addLiquidShortcode(
    'codeExample',
    (contents, exampleName, autogenCSS = true, syntax = null) => {
      const codeExample = generateCodeExample(contents, autogenCSS);
      return engine.renderFile('code_example.liquid', {
        code: codeExample,
        exampleName: exampleName,
      });
    },
  );

  // Paired shortcodes...
  eleventyConfig.addPairedLiquidShortcode('markdown', (content) =>
    mdown.render(content),
  );

  eleventyConfig.addPairedLiquidShortcode('markdownInline', (content) =>
    mdown.renderInline(content),
  );

  eleventyConfig.addPairedLiquidShortcode('typogr', (content) =>
    typogrify.typogrify(content),
  );

  // Filters...
  eleventyConfig.addLiquidFilter('formatDistanceToNow', (date) => {
    return formatDistanceToNow(new Date(date));
  });

  eleventyConfig.addLiquidFilter('markdown', (content) =>
    mdown.render(content),
  );

  eleventyConfig.addLiquidFilter('markdownInline', (content) =>
    mdown.renderInline(content),
  );

  eleventyConfig.addLiquidFilter('typogr', (content) =>
    typogrify.typogrify(content),
  );

  eleventyConfig.addLiquidFilter('isTypedoc', (page) =>
    page.url.startsWith('/documentation/js-api/'),
  );

  eleventyConfig.addLiquidFilter(
    'implStatus',
    (
      dart = null,
      libsass = null,
      ruby = null,
      node = null,
      feature = null,
      markdown = null,
    ) => {
      const data = {
        dart: getImplStatus(dart),
        libsass: getImplStatus(libsass),
        ruby: getImplStatus(ruby),
        node: getImplStatus(node),
        feature: feature,
        markdown: markdown,
      };
      return data;
    },
  );

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

'use strict';

const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const yaml = require('js-yaml');
const markdown = require('markdown-it');
const markdownDefList = require('markdown-it-deflist');
const typogrify = require('typogr');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('source/assets/dist');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');

  eleventyConfig.addWatchTarget('source/assets/dist');
  eleventyConfig.addWatchTarget('source/assets/img');

  eleventyConfig.setLiquidOptions({
    jsTruthy: true,
  });
  eleventyConfig.setUseGitIgnore(false);

  const mdown = markdown({
    html: true,
    breaks: false,
    typographer: true,
  })
    .disable('code')
    .use(markdownDefList);

  eleventyConfig.setLibrary('md', mdown);
  eleventyConfig.addDataExtension('yaml', yaml.load);

  // Paired shortcodes...
  eleventyConfig.addPairedLiquidShortcode('markdown', (content) =>
    typogrify.typogrify(mdown.render(content)),
  );

  eleventyConfig.addPairedLiquidShortcode('markdownInline', (content) =>
    typogrify.typogrify(mdown.renderInline(content)),
  );

  // Filters...
  eleventyConfig.addLiquidFilter('formatDistanceToNow', (date) => {
    return formatDistanceToNow(new Date(date));
  });

  eleventyConfig.addLiquidFilter('markdown', (content) =>
    typogrify.typogrify(mdown.render(content)),
  );

  eleventyConfig.addLiquidFilter('markdownInline', (content) =>
    typogrify.typogrify(mdown.renderInline(content)),
  );

  eleventyConfig.addLiquidFilter('typogr', (content) =>
    typogrify.typogrify(content),
  );

  eleventyConfig.addLiquidFilter('isTypedoc', (page) =>
    page.url.startsWith('/documentation/js-api/'),
  );

  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

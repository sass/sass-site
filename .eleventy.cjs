'use strict';

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addWatchTarget('source/assets/sass');
  eleventyConfig.addWatchTarget('source/assets/js');

  eleventyConfig.addPassthroughCopy('source/assets/dist');

  eleventyConfig.addWatchTarget('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');

  eleventyConfig.setLiquidOptions({
    jsTruthy: true,
  });

  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

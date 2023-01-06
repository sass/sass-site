'use strict';

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts'
    },
  };
};

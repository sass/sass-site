'use strict';

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const yaml = require('js-yaml');
const markdown = require('markdown-it');
const markdownDefList = require('markdown-it-deflist');
const typogrify = require('typogr');
const sass = require('sass');

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
  }).use(markdownDefList);

  eleventyConfig.setLibrary('md', mdown);
  eleventyConfig.addDataExtension('yml, yaml', (contents) =>
    yaml.load(contents),
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
    'codeExample',
    (contents, autogenCSS=true, syntax=null) => {
      //TODO when are values for syntax passed in?
      //TODO add tests 
      const splitContents = contents.split('===');      
      
      const scssContents = splitContents[0];
      const sassContents = splitContents[1];
      const cssContents = splitContents[2];

      const scssExamples = scssContents.split('---')
      const sassExamples = sassContents.split('---')

      let cssExample;
      if(cssContents){
        cssExample = cssContents
      }
      else if(!cssContents && autogenCSS) {
        // TODO check first if you even have scss or sass to generate css from
        // TODO what if no scss but sass?
        cssExample = '';
        scssExamples.forEach((scssSnippet) => {
          const generatedCSS = sass.compileString(scssSnippet);
          cssExample += generatedCSS.css;
        });
      }

      return {
        scss: scssExamples, 
        css: cssExample,
        sass: sassExamples,
        splitLocation: '50.0%' //TODO dynamically determine
      };
    },
  );

  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // settings
  return {
    dir: {
      input: 'source',
      includes: '_includes',
      layouts: '_layouts',
    },
  };
};

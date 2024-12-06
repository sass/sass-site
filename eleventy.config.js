'use strict';

import {EleventyRenderPlugin} from '@11ty/eleventy';
import {
  absoluteUrl,
  convertHtmlToAbsoluteUrls,
  dateToRfc3339,
  getNewestCollectionItemDate,
} from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import * as yaml from 'js-yaml';

import componentsPlugin from './source/helpers/components/index.ts';
import datesPlugin from './source/helpers/dates.ts';
import {liquidEngine, markdownEngine} from './source/helpers/engines.ts';
import pagesPlugin from './source/helpers/pages.ts';
import typePlugin from './source/helpers/type.ts';
import functionPlugin from './source/helpers/function.ts';

/**
 * @param {import('@11ty/eleventy').UserConfig} eleventyConfig
 * @returns {void}
 */
export default function (eleventyConfig) {
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
  // eleventyConfig.addDataExtension('ts', {
  //   parser: filepath => import(filepath),
  //   read: false,
  // });

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
}

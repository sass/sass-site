'use strict';

const path = require('path');

const { EleventyRenderPlugin } = require('@11ty/eleventy');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const yaml = require('js-yaml');
const { Liquid } = require('liquidjs');
const { LoremIpsum } = require('lorem-ipsum');
const markdown = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownDefList = require('markdown-it-deflist');
const Prism = require('prismjs');
const PrismLoader = require('prismjs/components/index.js');
const typogrify = require('typogr');

const {
  generateCodeExample,
  getImplStatus,
} = require('./source/helpers/sass_helpers.ts');

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('source/assets/dist');
  eleventyConfig.addPassthroughCopy('source/assets/img');
  eleventyConfig.addPassthroughCopy('source/favicon.ico');

  const liquidEngine = new Liquid({
    root: [
      path.resolve(__dirname, 'source/_includes/'),
      path.resolve(__dirname, 'source/'),
    ],
    extname: '.liquid',
    strictFilters: true,
    jsTruthy: true,
  });

  eleventyConfig.setLibrary('liquid', liquidEngine);
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

  // Paired shortcodes...

  // Ideally this could be used with named args, but that's not supported yet in
  // 11ty's implementation of LiquidJS:
  // https://github.com/11ty/eleventy/issues/2679
  // In the meantime, the args are: `dart`, `libsass`, `ruby`, `feature`
  eleventyConfig.addPairedLiquidShortcode(
    'compatibility',
    async (details, dart = null, libsass = null, ruby = null, feature = null) =>
      liquidEngine.renderFile('compatibility', {
        details,
        dart,
        libsass,
        ruby,
        feature,
      }),
  );

  eleventyConfig.addPairedLiquidShortcode(
    'codeExample',
    async (contents, exampleName, autogenCSS = true, syntax = null) => {
      const code = generateCodeExample(contents, autogenCSS, syntax);
      return liquidEngine.renderFile('code_examples/code_example', {
        code,
        exampleName,
      });
    },
  );

  eleventyConfig.addPairedLiquidShortcode('funFact', async (contents) =>
    liquidEngine.renderFile('fun_fact', {
      contents,
    }),
  );

  eleventyConfig.addPairedLiquidShortcode('markdown', (content) =>
    mdown.render(content),
  );

  eleventyConfig.addPairedLiquidShortcode('markdownInline', (content) =>
    mdown.renderInline(content),
  );

  eleventyConfig.addPairedLiquidShortcode('typogr', (content) =>
    typogrify.typogrify(content),
  );

  eleventyConfig.addPairedLiquidShortcode('code', (content, language) => {
    if (!Prism.languages[language]) {
      PrismLoader(language);
    }
    const html = Prism.highlight(content, Prism.languages[language], language);
    const attr = `language-${language}`;
    return `<pre class="${attr}"><code class="${attr}">${html}</code></pre>`;
  });

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

  eleventyConfig.addLiquidFilter('implStatus', (status) =>
    getImplStatus(status),
  );

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

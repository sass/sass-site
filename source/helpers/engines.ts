import slugify from '@sindresorhus/slugify';
import {Liquid} from 'liquidjs';
import markdown from 'markdown-it';
import markdownAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownDefList from 'markdown-it-deflist';
import markdownItFootnote from 'markdown-it-footnote';
import * as p from 'node:path';
import {fileURLToPath} from 'node:url';

import {renderPermalink} from './components/anchors.js';

/**
 * Returns Markdown engine with custom configuration and plugins.
 *
 * @see https://github.com/markdown-it/markdown-it
 * @see https://github.com/markdown-it/markdown-it-deflist
 * @see https://github.com/arve0/markdown-it-attrs
 * @see https://github.com/valeriangalliat/markdown-it-anchor
 */
export const markdownEngine = markdown({
  html: true,
  typographer: false,
})
  .use(markdownDefList)
  .use(markdownItAttrs)
  .use(markdownItFootnote)
  .use(markdownAnchor, {
    level: 2,
    permalink: renderPermalink,
    slugify: s => slugify(s),
  });

/** The directory that contains this file. */
const dirname = p.dirname(fileURLToPath(import.meta.url));

/**
 * Returns LiquidJS engine with custom configuration.
 *
 * @see https://liquidjs.com/
 */
export const liquidEngine = new Liquid({
  root: [
    p.resolve(dirname, '../_includes/'),
    p.resolve(dirname, '../'),
  ],
  extname: '.liquid',
  strictFilters: true,
  jsTruthy: true,
});

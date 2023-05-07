import { Liquid } from 'liquidjs';
import markdown from 'markdown-it';
import markdownAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownDefList from 'markdown-it-deflist';
import path from 'path';

import { renderPermalink } from './components/anchors';

/**
 * Returns Markdown engine with custom configuration and plugins.
 *
 * @see https://github.com/markdown-it/markdown-it
 * @see https://github.com/markdown-it/markdown-it-deflist
 * @see https://github.com/arve0/markdown-it-attrs
 */
export const markdownEngine = markdown({
  html: true,
  typographer: true,
})
  .use(markdownDefList)
  .use(markdownItAttrs)
  .use(markdownAnchor, {
    level: [2,3],
    permalink: renderPermalink,
  });

/**
 * Returns LiquidJS engine with custom configuration.
 *
 * @see https://liquidjs.com/
 */
export const liquidEngine = new Liquid({
  root: [
    path.resolve(__dirname, '../_includes/'),
    path.resolve(__dirname, '../'),
  ],
  extname: '.liquid',
  strictFilters: true,
  jsTruthy: true,
});

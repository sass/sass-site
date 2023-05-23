import { Liquid } from 'liquidjs';
import markdown from 'markdown-it';
import markdownAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownDefList from 'markdown-it-deflist';
import path from 'path';

import { renderPermalink } from './components/anchors';

/**
 * Identical to `markdown-it-anchor`'s default slugify function, but removes
 * leading dashes to match the behavior of the old Ruby site.
 * @see https://github.com/valeriangalliat/markdown-it-anchor/blob/649582d58185b00cfb2ceee9b6b4cd6aafc645b7/index.js#L3
 */
function slugify(s: string): string {
  const slug = encodeURIComponent(
    String(s).trim().toLowerCase().replace(/\s+/g, '-'),
  );
  return slug.replace(/^-+/, '');
}

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
  typographer: true,
})
  .use(markdownDefList)
  .use(markdownItAttrs)
  .use(markdownAnchor, {
    level: 2,
    permalink: renderPermalink,
    slugify,
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

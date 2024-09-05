import {LoremIpsum} from 'lorem-ipsum';
import seedrandom from 'seedrandom';
import truncate from 'truncate-html';
import {typogrify} from 'typogr';

import {markdownEngine} from './engines';

/** A generator for filler text. */
const lorem = new LoremIpsum({
  random: seedrandom("Feelin' Sassy!"),
});

/**
 * Returns block of generated `lorem ipsum` text.
 *
 * @see https://github.com/knicklabs/lorem-ipsum.js
 */
export function getLorem(type: string, number = 1): string {
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
}

/**
 * Strips leading whitespace from each line of a string,
 * based on the whitespace of the first line.
 *
 * @see https://github.com/sindresorhus/strip-indent
 * @see https://github.com/jamiebuilds/min-indent
 */
export function stripIndent(contents: string): string {
  // Find leading whitespace of first line (ignoring initial newlines)
  const match = /^[\n\r]*([ \t]*)(?=\S)/.exec(contents);
  if (match?.[1]?.length) {
    // Strip leading whitespace based on first line
    return contents.replaceAll(
      new RegExp(`^[ \\t]{${match[1].length}}`, 'gm'),
      ''
    );
  }
  return contents;
}

/**
 * Truncates an HTML string without breaking tags.
 *
 * @see https://github.com/oe/truncate-html
 */
export function truncateHTML(html: string, words = 170): string {
  return truncate(html, words, {byWords: true, keepWhitespaces: true});
}

/**
 * Renders block of Markdown into HTML.
 */
export function markdown(content: string): string {
  return markdownEngine.render(stripIndent(content));
}

/**
 * Renders single line of Markdown into HTML, without wrapping `<p>`.
 */
export function markdownInline(content: string): string {
  return markdownEngine.renderInline(content);
}

/**
 * Applies various transformations to plain text in order to yield
 * typographically-improved HTML.
 *
 * @see https://github.com/ekalinin/typogr.js
 */
export function typogr(content: string): string {
  return typogrify(content);
}

/**
 * Appends full page URL to internal links (for embedding in another page).
 */
export function replaceInternalLinks(content: string, url: string): string {
  return content.replace(/href="#/g, `href="${url}#`);
}

/**
 * Checks if a given string starts with a comparison string.
 */
export function startsWith(str: string, check: string): boolean {
  return str.startsWith(check);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function typePlugin(eleventyConfig: any): void {
  // filters...
  eleventyConfig.addLiquidFilter('truncateHTML', truncateHTML);
  eleventyConfig.addLiquidFilter('markdown', markdown);
  eleventyConfig.addLiquidFilter('markdownInline', markdownInline);
  eleventyConfig.addLiquidFilter('typogr', typogr);
  eleventyConfig.addLiquidFilter('replaceInternalLinks', replaceInternalLinks);
  eleventyConfig.addLiquidFilter('startsWith', startsWith);

  // shortcodes...
  eleventyConfig.addLiquidShortcode('lorem', getLorem);

  // paired shortcodes...
  eleventyConfig.addPairedLiquidShortcode('markdown', markdown);
  eleventyConfig.addPairedLiquidShortcode('typogr', typogr);
}

import { highlight, languages } from 'prismjs';
import PrismLoader from 'prismjs/components/index';

import { liquidEngine } from '../engines';
import { default as codeExample } from './codeExample';
import { compatibility, implStatus } from './compatibility';

export { codeExample };
export { compatibility, implStatus };

/**
 * Returns HTML for a fun fact that's not directly relevant to the main
 * documentation.
 */
export const funFact = async (contents: string) =>
  liquidEngine.renderFile('fun_fact', {
    contents,
  });

/**
 * Returns HTML for a heads-up warning related to the main
 * documentation.
 */
export const headsUp = async (contents: string, useMarkdown = true) =>
  liquidEngine.renderFile('heads_up', {
    contents,
    useMarkdown,
  });

/**
 * Returns HTML for a code block with syntax highlighting via [Prism][].
 *
 * This should be equivalent to the [11ty `{% highlight %}` tag][hl-tag], except
 * this tag can wrap dynamic content (partials, variables, etc), while the 11ty
 * tag only wraps plain text.
 *
 * [Prism]: https://prismjs.com/
 * [hl-tag]: https://www.11ty.dev/docs/plugins/syntaxhighlight/#usage
 *
 * @see https://prismjs.com/
 */
export const codeBlock = (contents: string, language: string, padding = 0) => {
  if (!languages[language]) {
    PrismLoader(language);
  }
  const code = `${contents}${'\n'.repeat(padding + 1)}`;
  const html = highlight(code, languages[language], language);
  const attr = `language-${language}`;
  return `<pre class="${attr}"><code class="${attr}">${html}</code></pre>`;
};

type DocToc = {
  [key: string]: string | DocToc[];
};
/**
 * Returns `text` and `href` for a documentation table-of-contents section.
 */
export const getDocTocData = (data: DocToc) => {
  const text = Object.keys(data).filter((key) => key !== ':children')[0];
  const href = data[text] as string;
  return { text, href };
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-explicit-any */
export default function componentsPlugin(eleventyConfig: any) {
  // filters...
  eleventyConfig.addLiquidFilter('implStatus', implStatus);
  eleventyConfig.addLiquidFilter('getDocTocData', getDocTocData);

  // paired shortcodes...
  eleventyConfig.addPairedLiquidShortcode('code', codeBlock);
  eleventyConfig.addPairedLiquidShortcode('codeExample', codeExample);
  // Ideally this could be used with named args, but that's not supported yet in
  // 11ty's implementation of LiquidJS:
  // https://github.com/11ty/eleventy/issues/2679
  // In the meantime, check the order in the function definition of
  // `compatibility` in `source/helpers/components/compatibility.ts`.
  eleventyConfig.addPairedLiquidShortcode('compatibility', compatibility);
  eleventyConfig.addPairedLiquidShortcode('funFact', funFact);
  eleventyConfig.addPairedLiquidShortcode('headsUp', headsUp);
}

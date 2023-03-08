import { highlight, languages } from 'prismjs';
import PrismLoader from 'prismjs/components/index';

import { liquidEngine } from './engines';

/**
 * Returns HTML for a fun fact that's not directly relevant to the main
 * documentation.
 */
export const funFact = async (contents: string) =>
  liquidEngine.renderFile('fun_fact', {
    contents,
  });

/**
 * Returns HTML for a code block with syntax highlighting via [Prism][].
 *
 * [Prism]: https://prismjs.com/
 *
 * @see https://prismjs.com/
 */
export const codeBlock = (contents: string, language: string) => {
  if (!languages[language]) {
    PrismLoader(language);
  }
  const html = highlight(contents, languages[language], language);
  const attr = `language-${language}`;
  return `<pre class="${attr}"><code class="${attr}">${html}</code></pre>`;
};

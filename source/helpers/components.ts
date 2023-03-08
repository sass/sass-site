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
 * This should be equivalent to the [11ty `{% highlight %}` tag][hl-tag], except
 * this tag can wrap dynamic content (partials, variables, etc), while the 11ty
 * tag only wraps plain text.
 *
 * [Prism]: https://prismjs.com/
 * [hl-tag]: https://www.11ty.dev/docs/plugins/syntaxhighlight/#usage
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

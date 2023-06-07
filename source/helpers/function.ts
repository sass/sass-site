import * as cheerio from 'cheerio';
import stripIndent from 'strip-indent';

import { codeBlock } from './components';

const links: Record<string, string> = {
  number: '/documentation/values/numbers',
  string: '/documentation/values/strings',
  'quoted string': '/documentation/values/strings#quoted',
  'unquoted string': '/documentation/values/strings#unquoted',
  color: '/documentation/values/colors',
  list: '/documentation/values/lists',
  map: '/documentation/values/maps',
  boolean: '/documentation/values/booleans',
  null: '/documentation/values/null',
  function: '/documentation/values/functions',
  selector: '/documentation/modules/selector#selector-values',
};

const returnTypeLink = (returnType: string) =>
  returnType
    .split('|')
    .map((type) => {
      type = type.trim();
      const link = links[type];
      if (!link) {
        throw new Error(`Unknown type ${type}`);
      }
      return `<a href="${link}">${type}</a>`;
    })
    .join(' | ');

/** Renders API docs for a Sass function (or mixin).
 *
 * The function's name is parsed from the signature. The API description is
 * passed as a Markdown block. If `returns:type` is passed as the last argument,
 * it's included as the function's return type.
 *
 * Multiple signatures may be passed, in which case they're all included in
 * sequence.
 */
export function _function(content: string, ...signatures: string[]) {
  // Parse the last argument as the return type, if it's present
  const returns = signatures.at(-1)?.match(/returns?:\s*(.*)/)?.[1];
  if (returns) {
    signatures.pop();
  }

  // Highlight each signature
  const names: string[] = [];
  const highlightedSignatures = signatures.map((signature) => {
    signature = stripIndent(signature).trim();
    const [name] = signature.split('(', 2);
    const nameWithoutNamespace = name.split('.').at(-1) || name;
    const html = codeBlock(`@function ${signature}`, 'scss');
    const $ = cheerio.load(html);
    const signatureElements = $('pre code')
      .contents()
      .filter((index, element) => $(element).text() !== '@function');
    // Add a class to make it easier to index function documentation.
    if (!names.includes(nameWithoutNamespace)) {
      names.push(nameWithoutNamespace);
      const nameEl = signatureElements
        .filter((index, element) => {
          return $(element).text() == nameWithoutNamespace;
        })
        .eq(0);
      nameEl.addClass('docSearch-function');
      nameEl.attr('name', name);
    }
    return signatureElements
      .toArray()
      .map((el) => $.html(el))
      .join('')
      .trim();
  });

  // Add the return type after the last signature
  let mergedSignatures = highlightedSignatures.join('\n');
  if (returns) {
    mergedSignatures += ` <span class="token comment">//=> ${returnTypeLink(
      returns,
    )}</span>`;
  }

  // Assemble the final HTML
  const $ = cheerio.load('');
  const div = $('<div></div>')
    .addClass('sl-c-callout sl-c-callout--function')
    .attr('id', names[0]);
  const pre = $('<pre></pre>').addClass('signature language-scss');
  const anchor = $('<a></a>').addClass('anchor').attr('href', `#${names[0]}`);
  const code = $('<code></code>')
    .addClass('language-scss')
    .html(mergedSignatures);
  pre.append(anchor).append(code);
  div.append(pre).append(content);
  $('body').append(div);
  names.slice(1).forEach((name) => {
    const div = $('<div></div>').attr('id', name);
    $('body').append(div);
  });
  return $('body').html() || '';
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access,
                  @typescript-eslint/no-unsafe-call,
                  @typescript-eslint/no-explicit-any */
export default function typePlugin(eleventyConfig: any) {
  eleventyConfig.addPairedLiquidShortcode('function', _function);
}

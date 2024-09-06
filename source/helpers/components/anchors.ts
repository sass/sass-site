import Token from 'markdown-it/lib/token.mjs';
import type anchor from 'markdown-it-anchor';
import type {StateCore} from 'markdown-it';

/**
 * Custom permalink function, inspired by `linkInsideHeader`,
 * modified to include title text in permalink a11y text.
 * @see https://github.com/valeriangalliat/markdown-it-anchor#custom-permalink
 * @see https://github.com/valeriangalliat/markdown-it-anchor/blob/649582d58185b00cfb2ceee9b6b4cd6aafc645b7/permalink.js#L76
 */
export function renderPermalink(
  slug: string,
  opts: anchor.LinkInsideHeaderPermalinkOptions,
  state: StateCore,
  idx: number
): void {
  // https://github.com/valeriangalliat/markdown-it-anchor/blob/649582d58185b00cfb2ceee9b6b4cd6aafc645b7/permalink.js#L148-L151
  const title = state.tokens[idx + 1]?.children
    ?.filter(
      (token: Token) => token.type === 'text' || token.type === 'code_inline'
    )
    .reduce((acc, t) => acc + t.content, '');

  opts.class = 'anchor';
  opts.ariaHidden = false;
  opts.symbol = `<span class="visuallyhidden">${
    title || 'section'
  } permalink</span>`;

  // https://github.com/valeriangalliat/markdown-it-anchor/blob/649582d58185b00cfb2ceee9b6b4cd6aafc645b7/permalink.js#L77-L97
  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ...(opts.class ? [['class', opts.class]] : []),
        ['href', `#${slug}`],
        ...(opts.ariaHidden ? [['aria-hidden', 'true']] : []),
      ],
    }),
    Object.assign(new state.Token('html_inline', '', 0), {
      content: opts.symbol,
      meta: {isPermalinkSymbol: true},
    }),
    new state.Token('link_close', 'a', -1),
  ];

  state.tokens[idx + 1]?.children?.push(...linkTokens);
}

import Token from 'markdown-it/lib/token';
import anchor from 'markdown-it-anchor/types';

// Custom permalink function, inspired by and modification of linkInsideHeader
// More context on custom permalink fns: https://github.com/valeriangalliat/markdown-it-anchor#custom-permalink
// linkInsideHeader function: https://github.com/valeriangalliat/markdown-it-anchor/blob/649582d58185b00cfb2ceee9b6b4cd6aafc645b7/permalink.js#L76
export const renderPermalink: anchor.PermalinkGenerator = (
  slug,
  opts: anchor.LinkInsideHeaderPermalinkOptions,
  state,
  idx,
) => {
  opts.ariaHidden = false;

  const title = state?.tokens[idx + 1].children
    ?.filter(
      (token: Token) => token.type === 'text' || token.type === 'code_inline',
    )
    .reduce((acc, t) => acc + t.content, '');

  const linkTokens = [
    Object.assign(new state.Token('link_open', 'a', 1), {
      attrs: [
        ['class', 'anchor'],
        ['href', `#${slug}`],
        ...(opts.ariaHidden ? [['aria-hidden', 'true']] : []),
      ],
    }),
    Object.assign(new state.Token('html_inline', '', 0), {
      content: `<span class="visuallyhidden">${
        title ? title : 'section'
      } permalink'</span>`,
    }),
    new state.Token('link_close', 'a', -1),
  ];

  state?.tokens[idx + 1]?.children?.push(...linkTokens);
};

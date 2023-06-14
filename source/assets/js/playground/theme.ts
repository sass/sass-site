import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const playgroundHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.special(tags.variableName), tags.tagName],
    color: 'var(--sl-color--code-base)'
  },
  { tag: tags.keyword,
    color: 'var(--sl-color--code-bright-dark)',
    fontWeight: '600'
  },
  { tag: tags.definitionKeyword,
    color: 'var(--sl-color--code-dark)',
    fontWeight: '600'
  },
  { tag: tags.comment,
    color: 'var(--sl-color--code-muted)',
    fontStyle: 'italic'
  },
  { tag: tags.propertyName,
    color: 'var(--sl-color--code-warm)',
    fontWeight: '600'
  },
  { tag: tags.className,
    color: 'var(--sl-color--code-cool)',
    fontWeight: '600'
  },
]);

export { playgroundHighlightStyle };

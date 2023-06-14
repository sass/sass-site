import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const playgroundHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.special(tags.variableName), tags.tagName],
    color: 'var(--sl-color--code-base)'
  },
  { tag: tags.className,
    color: 'var(--sl-color--code-cool)',
    fontWeight: '600'
  },
  { tag: tags.comment,
    color: 'var(--sl-color--code-muted)',
    fontStyle: 'italic'
  },
  { tag: tags.keyword,
    color: 'var(--sl-color--code-bright-dark)',
    fontWeight: '600'
  },
  { tag: tags.controlKeyword,
    color: 'var(--sl-color--code-dark)',
    fontWeight: '600'
  },
  { tag: tags.definitionKeyword,
    color: 'var(--sl-color--code-dark)',
    fontWeight: '600'
  },
  { tag: tags.moduleKeyword,
    color: 'green'
  },
  { tag: tags.operator,
    color: 'var(--sl-color--code-muted-dark)',
    fontWeight: '600'
  },
  { tag: tags.propertyName,
    color: 'var(--sl-color--code-warm)',
    fontWeight: '600'
  },
  { tag: tags.punctuation,
    color: 'var(--sl-color--code-muted-dark)'
  },
  { tag: tags.string,
    color: 'var(--sl-color--code-bright)'
  },
  { tag: tags.unit,
    color: 'var(--sl-color--code-base)'
  },
  { tag: tags.atom,
    color: 'var(--sl-color--code-base)'
  },
  { tag: tags.labelName,
    color: 'var(--sl-color--code-dark)',
    fontWeight: '600'
  }
]);
export { playgroundHighlightStyle };

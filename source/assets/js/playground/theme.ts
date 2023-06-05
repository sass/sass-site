import { HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { EditorView } from 'codemirror';

// TODO: Consider moving to vendor scss
const playgroundTheme = EditorView.baseTheme({
  '&': {
    // TODO: Make dynamic
    height: '500px',
    'font-size': 'var(--sl-font-size--x-small)',
    'background-color': 'var(--sl-color--code-background)',
    color: 'var(--sl-color--code-text)',
  },
  '.cm-gutters': {
    'background-color': 'var(--sl-color--code-background)',
    'border-right': 'none',
  },
  '.cm-content': {
    // Pull from _typography?
    'font-family':
      "'Source Code Pro', 'SF Mono', monaco, inconsolata, 'Fira Mono', 'Droid Sans Mono', monospace, monospace;",
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
});

const playgroundHighlightStyle = HighlightStyle.define([
  {
    tag: [tags.special(tags.variableName), tags.tagName],
    color: '#445588',
    fontWeight: 'bold',
  },
  { tag: tags.definitionKeyword, fontWeight: 'bold' },
  { tag: tags.comment, color: '#006666', fontStyle: 'italic' },
  { tag: tags.propertyName, color: '#990000' },
]);

export { playgroundTheme, playgroundHighlightStyle };

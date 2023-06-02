import { EditorView } from 'codemirror';

// TODO: Consider moving to vendor scss
const playgroundTheme = EditorView.baseTheme({
  '&': {
    // TODO: Make dynamic
    height: '500px',
    'font-size': 'var(--sl-font-size--small)',
    'background-color': 'var(--sl-color--code-background)',
  },
  '.cm-gutters': {
    'background-color': 'var(--sl-color--code-background)',
    'border-right': 'none',
  },
  '.cm-scroller': {
    overflow: 'auto',
  },
});

export { playgroundTheme };

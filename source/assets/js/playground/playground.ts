import { sass as langSass } from '@codemirror/lang-sass';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { compileString } from '../sass.default.js';
import { editorSetup, outputSetup } from './editor-setup.js';
import { playgroundTheme } from './theme.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const editor = new EditorView({
  extensions: [
    editorSetup,
    langSass(),
    playgroundTheme,
    EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        updateCSS(v.state.doc.toString());
      }
    }),
  ],
  parent: document.getElementById('editor') || document.body,
});
const viewer = new EditorView({
  extensions: [outputSetup, langSass(), playgroundTheme],
  parent: document.getElementById('css-view') || document.body,
});

function updateCSS(val: string) {
  const css = parse(val);
  const text = Text.of(css.split('\n'));
  viewer.dispatch({
    changes: {
      from: 0,
      to: viewer.state.doc.toString().length,
      insert: text,
    },
  });
}

function parse(css: string): string {
  let result;
  try {
    result = compileString(css, { syntax: 'scss' }).css;
  } catch (error) {
    result = error?.toString();
  }

  return result;
}

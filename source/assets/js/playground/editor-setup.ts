import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands';
import { css as langCss } from '@codemirror/lang-css';
import { sass as langSass } from '@codemirror/lang-sass';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import {
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';

import { playgroundHighlightStyle, playgroundTheme } from './theme.js';

const editorSetup = (() => [
  [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    dropCursor(),
    indentOnInput(),
    syntaxHighlighting(playgroundHighlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightActiveLine(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
      indentWithTab,
    ]),
  ],
  langSass(),
  playgroundTheme,
])();

const outputSetup = (() => [
  [
    lineNumbers(),
    highlightSpecialChars(),
    foldGutter(),
    syntaxHighlighting(playgroundHighlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    highlightActiveLine(),
    EditorState.readOnly.of(true),
  ],
  langCss(),
  playgroundTheme,
])();

export { editorSetup, outputSetup };

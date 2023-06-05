/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
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
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { EditorState } from '@codemirror/state';
import {
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
} from '@codemirror/view';

import { playgroundHighlightStyle, playgroundTheme } from './theme.js';

const editorSetup = (() => [
  [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    // foldGutter(),
    // drawSelection(),
    dropCursor(),
    // EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(playgroundHighlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    // rectangularSelection(),
    // crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      ...lintKeymap,
    ]),
  ],
  langSass(),
  playgroundTheme,
])();

const outputSetup = (() => [
  [
    lineNumbers(),
    highlightSpecialChars(),
    // foldGutter(),
    syntaxHighlighting(playgroundHighlightStyle),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    highlightActiveLine(),
    EditorState.readOnly.of(true),
  ],
  langCss(),
  playgroundTheme,
])();

export { editorSetup, outputSetup };

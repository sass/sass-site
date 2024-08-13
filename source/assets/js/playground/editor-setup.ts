/* eslint-disable node/no-extraneous-import */
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
import {css as langCss} from '@codemirror/lang-css';
import {sass as langSass} from '@codemirror/lang-sass';
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
} from '@codemirror/language';
import {lintKeymap} from '@codemirror/lint';
import {EditorState, Compartment} from '@codemirror/state';
import {
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  drawSelection,
} from '@codemirror/view';

import {playgroundHighlightStyle} from './theme.js';
import {EditorView} from 'codemirror';

const syntax = new Compartment();

const changeSyntax = (
  view: EditorView,
  indented = false,
  newValue: string | undefined
) => {
  view.dispatch({
    effects: syntax.reconfigure(langSass({indented})),
  });
  if (newValue) {
    view.dispatch({
      changes: [{from: 0, to: view.state.doc.length, insert: newValue}],
    });
  }
};

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
    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    highlightActiveLine(),
    drawSelection(),
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
  syntax.of(langSass()),
])();

const outputSetup = (() => [
  [
    lineNumbers(),
    highlightSpecialChars(),
    foldGutter(),
    syntaxHighlighting(playgroundHighlightStyle),
    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
    highlightActiveLine(),
    EditorState.readOnly.of(true),
  ],
  langCss(),
])();

const defaultContents = {
  indented: `@use "sass:list"
@use "sass:color"

$font-stack: Helvetica, sans-serif
$primary-color: #333

body 
  font: $font-stack

a
  color: $primary-color
  &:hover
    color: color.adjust($primary-color, $lightness: 20%)

@debug list.append($font-stack, Arial)`,
  scss: `@use "sass:list";
@use "sass:color";

$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: $font-stack
}

a {
  color: $primary-color;
  &:hover{
    color: color.adjust($primary-color, $lightness: 20%);
  }
}

@debug list.append($font-stack, Arial);`,
};

export {changeSyntax, editorSetup, outputSetup, defaultContents};

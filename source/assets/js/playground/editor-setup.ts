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
import {Compartment, EditorState} from '@codemirror/state';
import {
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view';

import {playgroundHighlightStyle} from './theme.js';
import playgroundCompletions from './autocomplete.js';
import {EditorView} from 'codemirror';

const syntax = new Compartment();

// Sets the `view` uses `indented` syntax, and optionally update the contents
// with `newValue`.
function changeSyntax(
  view: EditorView,
  indented = false,
  newValue: string | undefined
): void {
  view.dispatch({
    effects: syntax.reconfigure(langSass({indented})),
  });
  if (newValue) {
    view.dispatch({
      changes: [{from: 0, to: view.state.doc.length, insert: newValue}],
    });
  }
}

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
    autocompletion({override: playgroundCompletions}),
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

$font-stack: Helvetica, Arial
$primary-color: #333

body 
  $font-stack: list.append($font-stack, sans-serif)
  font: $font-stack

a
  color: $primary-color

  &:hover
    color: color.scale($primary-color, $lightness: 20%)

@debug $font-stack`,
  scss: `@use "sass:list";
@use "sass:color";

$font-stack: Helvetica, Arial;
$primary-color: #333;

body {
  $font-stack: list.append($font-stack, sans-serif);
  font: $font-stack;
}

a {
  color: $primary-color;

  &:hover{
    color: color.scale($primary-color, $lightness: 20%);
  }
}

@debug $font-stack;`,
};

export {changeSyntax, editorSetup, outputSetup, defaultContents};

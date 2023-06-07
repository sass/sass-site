import { Diagnostic, setDiagnostics } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';

import {
  compileString,
  Exception,
  OutputStyle,
  Syntax,
} from '../vendor/playground';
import { editorSetup, outputSetup } from './editor-setup.js';

type PlaygroundState = {
  inputFormat: Syntax;
  outputFormat: OutputStyle;
  inputValue: string;
  compilerHasError: boolean;
};

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(func: Function, timeout = 200) {
  let timer: number;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer);
    // Call window.setTimeout, as this is run in the browser, and not in the NodeJS context as the rest of the project
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function setupPlayground() {
  const playgroundState: PlaygroundState = {
    inputFormat: 'scss',
    outputFormat: 'expanded',
    compilerHasError: false,
    inputValue: '',
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const editor = new EditorView({
    extensions: [
      ...editorSetup,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          playgroundState.inputValue = editor.state.doc.toString();
          debouncedUpdateCSS();
        }
      }),
    ],
    parent: document.getElementById('editor') || document.body,
  });

  // Setup CSS view
  const viewer = new EditorView({
    extensions: [...outputSetup],
    parent: document.getElementById('css-view') || document.body,
  });

  type TabbarItemDataset =
    | {
        value: Syntax;
        setting: 'inputFormat';
      }
    | {
        value: OutputStyle;
        setting: 'outputFormat';
      };
  function attachListeners() {
    function clickHandler(event: Event) {
      if (event.currentTarget instanceof HTMLElement) {
        const settings = event.currentTarget.dataset as TabbarItemDataset;
        if (settings.setting === 'inputFormat') {
          playgroundState.inputFormat = settings.value;
        } else {
          playgroundState.outputFormat = settings.value;
        }

        updateButtonState();
        debouncedUpdateCSS();
      }
    }
    const options = document.querySelectorAll('[data-value]');
    Array.from(options).forEach((option) => {
      option.addEventListener('click', clickHandler);
    });
  }

  function updateButtonState() {
    const inputFormatTab = document.querySelector(
      '[data-setting="inputFormat"]',
    ) as HTMLDivElement;
    inputFormatTab.dataset.active = playgroundState.inputFormat;

    const outputFormatTab = document.querySelector(
      '[data-setting="outputFormat"]',
    ) as HTMLDivElement;
    outputFormatTab.dataset.active = playgroundState.outputFormat;
  }
  function updateErrorState() {
    const editorWrapper = document.querySelector(
      '[data-compiler-has-error]',
    ) as HTMLDivElement;
    editorWrapper.dataset.compilerHasError =
      playgroundState.compilerHasError.toString();
  }

  function updateCSS() {
    const result = parse(playgroundState.inputValue);
    if ('css' in result) {
      const text = Text.of(result.css.split('\n'));
      viewer.dispatch({
        changes: {
          from: 0,
          to: viewer.state.doc.toString().length,
          insert: text,
        },
      });
      editor.dispatch(setDiagnostics(editor.state, []));
      playgroundState.compilerHasError = false;
    } else {
      const diagnostic = errorToDiagnostic(result.error);
      const transaction = setDiagnostics(editor.state, [diagnostic]);
      editor.dispatch(transaction);
      playgroundState.compilerHasError = true;
    }
    updateErrorState();
  }
  const debouncedUpdateCSS = debounce(updateCSS);

  type ParseResultSuccess = { css: string };
  type ParseResultError = { error: Exception | unknown };
  type ParseResult = ParseResultSuccess | ParseResultError;

  function parse(css: string): ParseResult {
    try {
      const result = compileString(css, {
        syntax: playgroundState.inputFormat,
        style: playgroundState.outputFormat,
      });
      return { css: result.css };
    } catch (error) {
      return { error };
    }
  }

  function errorToDiagnostic(error: Exception | unknown): Diagnostic {
    if (error instanceof Exception) {
      return {
        from: error.span.start.offset,
        to: error.span.end.offset,
        severity: 'error',
        message: error.toString(),
      };
    } else {
      let errorString = 'Unknown compilation error';
      if (typeof error === 'string') errorString = error;
      else if (typeof error?.toString() === 'string')
        errorString = error.toString();
      return {
        from: 0,
        to: 0,
        severity: 'error',
        message: errorString,
      };
    }
  }

  attachListeners();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

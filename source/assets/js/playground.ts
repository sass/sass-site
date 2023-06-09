import { Diagnostic, setDiagnostics } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';
import debounce from 'lodash.debounce';
import { compileString, Exception, OutputStyle, Syntax } from 'sass';

import { editorSetup, outputSetup } from './playground/editor-setup.js';

type PlaygroundState = {
  inputFormat: Syntax;
  outputFormat: OutputStyle;
  inputValue: string;
  compilerHasError: boolean;
};

function setupPlayground() {
  const initialState: PlaygroundState = {
    inputFormat: 'scss',
    outputFormat: 'expanded',
    compilerHasError: false,
    inputValue: '',
  };

  const playgroundState = new Proxy(initialState, {
    set(state: PlaygroundState, prop: keyof PlaygroundState, ...rest) {
      // Set state first so called functions have access
      const set = Reflect.set(state, prop, ...rest);
      if (['inputFormat', 'outputFormat'].includes(prop)) {
        updateButtonState();
        debouncedUpdateCSS();
      } else if (prop === 'compilerHasError') {
        updateErrorState();
      } else if (prop === 'inputValue') {
        debouncedUpdateCSS();
      }
      return set;
    },
  });

  const editor = new EditorView({
    extensions: [
      ...editorSetup,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          playgroundState.inputValue = editor.state.doc.toString();
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
      }
    }
    const options = document.querySelectorAll('[data-value]');
    Array.from(options).forEach((option) => {
      option.addEventListener('click', clickHandler);
    });
  }
  /**
   * updateButtonState
   * Applies playgroundState to the buttons
   * Called by state's proxy setter
   */
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

  /**
   * updateErrorState
   * Applies error state
   * Called by state's proxy setter
   */
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
  }
  const debouncedUpdateCSS = debounce(updateCSS, 200);

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

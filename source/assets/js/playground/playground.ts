import { Diagnostic, setDiagnostics } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { compileString } from '../vendor/playground';
import { editorSetup, outputSetup } from './editor-setup.js';

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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const editor = new EditorView({
    extensions: [
      ...editorSetup,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
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

  function getSettingsFromDOM(): {
    'input-format': string;
    'output-format': string;
  } {
    const options = document.querySelectorAll('[data-active]');
    const settings = Array.from(options).reduce((acc, option) => {
      acc[option.dataset.setting] = option.dataset.active as string;
      return acc;
    }, {});
    return settings;
  }
  function setCompilerHasError(value: boolean) {
    const editorWrapper = document.querySelector(
      '[data-compiler-has-error]',
    ) as HTMLDivElement;
    editorWrapper.dataset.compilerHasError = value.toString();
  }

  type TabbarItemDataset = {
    value: string;
    setting: string;
  };
  function attachListeners() {
    const options = document.querySelectorAll('[data-value]');

    function clickHandler(event) {
      const settings = event.currentTarget.dataset as TabbarItemDataset;

      const tabbar = document.querySelector(
        `[data-active][data-setting="${settings.setting}"]`,
      );
      const currentValue = tabbar?.dataset.active;
      if (currentValue !== settings.value) {
        tabbar.dataset.active = settings.value;

        debouncedUpdateCSS();
      }
    }
    Array.from(options).forEach((option) => {
      option.addEventListener('click', clickHandler);
    });
  }

  function updateCSS() {
    const val = editor.state.doc.toString();
    const result = parse(val);
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
      setCompilerHasError(false);
    } else {
      const diagnostic = errorToDiagnostic(result.error);
      const transaction = setDiagnostics(editor.state, [diagnostic]);
      editor.dispatch(transaction);
      setCompilerHasError(true);
    }
  }
  const debouncedUpdateCSS = debounce(updateCSS);

  type ParseResultSuccess = { css: string };
  type ParseResultError = { error: string };
  type ParseResult = ParseResultSuccess | ParseResultError;

  function parse(css: string): ParseResult {
    const settings = getSettingsFromDOM();
    try {
      const result = compileString(css, {
        syntax: settings['input-format'],
        style: settings['output-format'],
      });
      return { css: result.css };
    } catch (error) {
      return { error };
    }
  }

  function errorToDiagnostic(error): Diagnostic {
    return {
      from: error.span.start.offset,
      to: error.span.end.offset,
      severity: 'error',
      message: error?.toString() || 'Compilation error',
    };
  }

  attachListeners();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

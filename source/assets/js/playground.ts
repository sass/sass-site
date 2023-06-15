import { setDiagnostics } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';
import debounce from 'lodash/debounce';
import { compileString, Logger, OutputStyle, Syntax } from 'sass';

import { displayForConsoleLog } from './playground/console-utils.js';
import { editorSetup, outputSetup } from './playground/editor-setup.js';
import {
  base64ToState,
  errorToDiagnostic,
  ParseResult,
  PlaygroundState,
  stateToBase64,
} from './playground/utils.js';

function setupPlayground() {
  const hashState = base64ToState(location.hash);

  const initialState: PlaygroundState = {
    inputFormat: hashState.inputFormat || 'scss',
    outputFormat: hashState.outputFormat || 'expanded',
    compilerHasError: false,
    inputValue: hashState.inputValue || '',
    debugOutput: [],
  };

  // Proxy intercepts setters and triggers side effects
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
      if (['inputFormat', 'outputFormat', 'inputValue'].includes(prop)) {
        updateURL();
      }
      return set;
    },
  });

  // Setup input sass view
  const editor = new EditorView({
    doc: playgroundState.inputValue,
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

  // Apply initial state to dom
  function applyInitialState() {
    updateButtonState();
    debouncedUpdateCSS();
    updateErrorState();
  }

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
    // Settings buttons handlers
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

    // Copy URL handlers
    const copyURLButton = document.getElementById('playground-copy-url');
    const copiedAlert = document.getElementById('playground-copied-alert');

    let timer: undefined | number;

    copyURLButton?.addEventListener('click', () => {
      void navigator.clipboard.writeText(location.href);
      copiedAlert?.classList.add('show');
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        copiedAlert?.classList.remove('show');
      }, 3000);
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
    const inputButtons = inputFormatTab.querySelectorAll('[data-value]');
    inputButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.dataset.active = String(
        button.dataset.value === playgroundState.inputFormat,
      );
    });

    const outputFormatTab = document.querySelector(
      '[data-setting="outputFormat"]',
    ) as HTMLDivElement;
    const outputButtons = outputFormatTab.querySelectorAll('[data-value]');
    outputButtons.forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.dataset.active = String(
        button.dataset.value === playgroundState.outputFormat,
      );
    });
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

  /**
   * updateDebugOutput
   * Applies debug output state
   * Called at end of updateCSS, and not by a debugOutput setter
   * debugOutput may be updated multiple times during the sass compilation,
   * so the output is collected through the compilation and the display updated just once.
   */
  function updateDebugOutput() {
    const console = document.querySelector('.console') as HTMLDivElement;
    console.innerHTML = playgroundState.debugOutput
      .map(displayForConsoleLog)
      .join('\n');
  }

  function updateCSS() {
    playgroundState.debugOutput = [];
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
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        { type: 'error', error: result.error },
      ];
    }
    updateDebugOutput();
  }
  const debouncedUpdateCSS = debounce(updateCSS, 200);

  const logger: Logger = {
    warn(message, options) {
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        { message, options, type: 'warn' },
      ];
    },
    debug(message, options) {
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        { message, options, type: 'debug' },
      ];
    },
  };

  function parse(css: string): ParseResult {
    try {
      const result = compileString(css, {
        syntax: playgroundState.inputFormat,
        style: playgroundState.outputFormat,
        logger: logger,
      });
      return { css: result.css };
    } catch (error) {
      return { error };
    }
  }

  function updateURL() {
    const hash = stateToBase64(playgroundState);
    history.replaceState('playground', '', `#${hash}`);
  }

  attachListeners();
  applyInitialState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

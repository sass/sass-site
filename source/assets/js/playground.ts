import { Diagnostic, setDiagnostics } from '@codemirror/lint';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';
import debounce from 'lodash.debounce';
import {
  compileString,
  Exception,
  Logger,
  OutputStyle,
  SourceSpan,
  Syntax,
} from 'sass';

import { editorSetup, outputSetup } from './playground/editor-setup.js';

type ConsoleLogDebug = {
  options: {
    span: SourceSpan;
  };
  message: string;
  type: 'debug';
};

type ConsoleLogWarning = {
  options: {
    deprecation: boolean;
    span?: SourceSpan | undefined;
    stack?: string | undefined;
  };
  message: string;
  type: 'warn';
};
type ConsoleLogError = {
  type: 'error';
  error: Exception | unknown;
};
type ConsoleLog = ConsoleLogDebug | ConsoleLogWarning | ConsoleLogError;

type PlaygroundState = {
  inputFormat: Syntax;
  outputFormat: OutputStyle;
  inputValue: string;
  compilerHasError: boolean;
  debugOutput: ConsoleLog[];
};

/**
 * Encode the HTML in a user-submitted string to print safely using innerHTML
 * Adapted from https://vanillajstoolkit.com/helpers/encodehtml/
 * @param  {string} str  The user-submitted string
 * @return {string} The sanitized string
 */
function encodeHTML(str: string): string {
  return str.replace(/[^\w-_. ]/gi, function (c) {
    return `&#${c.charCodeAt(0)};`;
  });
}

function setupPlayground() {
  const hashState = base64ToState(location.hash);

  const initialState: PlaygroundState = {
    inputFormat: hashState.inputFormat || 'scss',
    outputFormat: hashState.outputFormat || 'expanded',
    compilerHasError: false,
    inputValue: hashState.inputValue || '',
    debugOutput: [],
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
      if (['inputFormat', 'outputFormat', 'inputValue'].includes(prop)) {
        updateURL();
      }
      return set;
    },
  });

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

  function updateDebugOutput() {
    const console = document.querySelector('.console') as HTMLDivElement;
    console.innerHTML = playgroundState.debugOutput
      .map(displayForConsoleLog)
      .join('\n');
  }

  function lineNumberFormatter(number?: number): string {
    if (typeof number === 'undefined') return '';
    number = number + 1;
    return `${number} `;
  }

  function displayForConsoleLog(item: ConsoleLog): string {
    const data: { type: string; lineNumber?: number; message: string } = {
      type: item.type,
      lineNumber: undefined,
      message: '',
    };
    if (item.type === 'error') {
      if (item.error instanceof Exception) {
        data.lineNumber = item.error.span.start.line;
      }
      data.message = item.error?.toString() || '';
    } else if (['debug', 'warn'].includes(item.type)) {
      data.message = item.message;
      let lineNumber = item.options.span?.start?.line;
      if (typeof lineNumber === 'undefined') {
        const stack = 'stack' in item.options ? item.options.stack : '';
        const needleFromStackRegex = /^- (\d+):/;
        const match = stack?.match(needleFromStackRegex);
        if (match && match[1]) {
          // Stack trace starts at 1, all others come from span, which starts at 0, so adjust before formatting.
          lineNumber = parseInt(match[1]) - 1;
        }
      }
      data.lineNumber = lineNumber;
    }

    return `<p><span class="console-type console-type-${data.type}">@${
      data.type
    }</span>:${lineNumberFormatter(data.lineNumber)} ${encodeHTML(
      data.message,
    )}</p>`;
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

  type ParseResultSuccess = { css: string };
  type ParseResultError = { error: Exception | unknown };
  type ParseResult = ParseResultSuccess | ParseResultError;

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

  function updateURL() {
    const hash = stateToBase64(playgroundState);
    history.replaceState('playground', '', `#${hash}`);
  }

  // State is persisted to the URL's hash format in the following format:
  // [inputFormat, outputFormat, ...inputValue] = hash;
  // inputFormat: 0=indented 1=scss
  // outputFormat: 0=compressed 1=expanded
  function stateToBase64(state: PlaygroundState): string {
    const inputFormatChar = state.inputFormat === 'scss' ? 1 : 0;
    const outputFormatChar = state.outputFormat === 'expanded' ? 1 : 0;
    const persistedState = `${inputFormatChar}${outputFormatChar}${state.inputValue}`;
    return btoa(encodeURIComponent(persistedState));
  }

  function base64ToState(string: string): Partial<PlaygroundState> {
    const state: Partial<PlaygroundState> = {};
    // Remove hash
    const decoded = decodeURIComponent(atob(string.slice(1)));

    if (!/\d\d.*/.test(decoded)) return {};
    state.inputFormat = decoded.charAt(0) === '1' ? 'scss' : 'indented';
    state.outputFormat = decoded.charAt(1) === '1' ? 'expanded' : 'compressed';
    state.inputValue = decoded.slice(2);

    return state;
  }

  attachListeners();
  applyInitialState();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

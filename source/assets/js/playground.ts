import {setDiagnostics} from '@codemirror/lint';
import {Text} from '@codemirror/state';
import {EditorView} from 'codemirror';
import debounce from 'lodash/debounce';
import {Logger, OutputStyle, Syntax, compileString, info} from 'sass';

import {displayForConsoleLog} from './playground/console-utils.js';

import {
  changeSyntax,
  defaultContents,
  editorSetup,
  outputSetup,
} from './playground/editor-setup.js';
import {
  ParseResult,
  PlaygroundState,
  customLoader,
  deserializeState,
  logsToDiagnostics,
  serializeState,
} from './playground/utils.js';

function setupPlayground(): void {
  const hash = location.hash.slice(1);
  const hashState = deserializeState(hash);

  const inputFormat = hashState.inputFormat || 'scss';

  const initialState: PlaygroundState = {
    inputFormat,
    outputFormat: hashState.outputFormat || 'expanded',
    compilerHasError: false,
    inputValue: hashState.inputValue || defaultContents[inputFormat],
    debugOutput: [],
    selection: hashState.selection || null,
  };

  // Proxy intercepts setters and triggers side effects
  const playgroundState = new Proxy(initialState, {
    set(state: PlaygroundState, prop: keyof PlaygroundState, ...rest) {
      const previousInputFormat = state.inputFormat;
      // Set state first so called functions have access
      const set = Reflect.set(state, prop, ...rest);
      if (prop === 'inputFormat') {
        let newValue: string | undefined = undefined;
        // Show the default content in the new syntax if the editor still has
        // the default content in the old syntax.
        if (
          playgroundState.inputValue === defaultContents[previousInputFormat]
        ) {
          newValue = defaultContents[state.inputFormat];
        }
        changeSyntax(editor, state.inputFormat === 'indented', newValue);
      }
      if (['inputFormat', 'outputFormat'].includes(prop)) {
        updateButtonState();
        debouncedUpdateCSS();
      } else if (prop === 'compilerHasError') {
        updateErrorState();
      } else if (prop === 'inputValue') {
        debouncedUpdateCSS();
      }
      if (
        ['inputFormat', 'outputFormat', 'inputValue', 'selection'].includes(
          prop
        )
      ) {
        debounceUpdateURL();
      }
      return set;
    },
  });

  // Setup input Sass view
  const editor = new EditorView({
    doc: playgroundState.inputValue,
    extensions: [
      ...editorSetup,
      EditorView.updateListener.of(v => {
        if (v.docChanged) {
          playgroundState.inputValue = editor.state.doc.toString();
        }

        if (v.selectionSet) {
          playgroundState.selection = editorSelectionToStateSelection();
        }
      }),
    ],
    parent: document.querySelector('.sl-code-is-source') || undefined,
  });

  if (playgroundState.inputFormat === 'indented') {
    changeSyntax(editor, true, undefined);
  }

  // Setup CSS view
  const viewer = new EditorView({
    extensions: [...outputSetup],
    parent: document.querySelector('.sl-code-is-compiled') || undefined,
  });

  /**
   * Returns a playground state selection for the current single non-empty
   * selection, or `null` otherwise.
   */
  function editorSelectionToStateSelection():
    | PlaygroundState['selection']
    | null {
    const sel = editor.state.selection;
    if (sel.ranges.length !== 1) return null;

    const range = sel.ranges[0];
    if (range.empty) return null;

    const fromLine = editor.state.doc.lineAt(range.from);
    const toLine = editor.state.doc.lineAt(range.to);
    return [
      fromLine.number,
      range.from - fromLine.from + 1,
      toLine.number,
      range.to - toLine.from + 1,
    ];
  }

  /** Updates the editor's selection based on `playgroundState.selection`. */
  function updateSelection(): void {
    if (playgroundState.selection === null) {
      const sel = editor.state.selection;
      const isEmpty = sel.ranges.length === 1 && sel.ranges[0].empty;
      if (!isEmpty) {
        editor.dispatch({
          selection: {anchor: 0, head: 0},
          scrollIntoView: true,
        });
      }
    } else {
      try {
        const [fromL, fromC, toL, toC] = playgroundState.selection;
        const fromLine = editor.state.doc.line(fromL);
        const toLine = editor.state.doc.line(toL);

        editor.dispatch({
          selection: {
            anchor: fromLine.from + fromC - 1,
            head: toLine.from + toC - 1,
          },
          effects: EditorView.scrollIntoView(fromLine.from, {
            y: 'center',
          }),
        });
      } catch {
        // (ignored)
      }
    }
  }

  function goToSelection(selection: PlaygroundState['selection']): void {
    playgroundState.selection = selection;
    updateSelection();
    editor.focus();
  }

  // Apply initial state to dom
  function applyInitialState(): void {
    updateButtonState();
    debouncedUpdateCSS();
    updateErrorState();
    updateSelection();
  }

  type TabbarItemDataset =
    | {
        value: Exclude<Syntax, 'css'>;
        setting: 'inputFormat';
      }
    | {
        value: OutputStyle;
        setting: 'outputFormat';
      };
  function attachListeners(): void {
    // Settings buttons handlers
    function clickHandler(event: Event): void {
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
    Array.from(options).forEach(option => {
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
  function updateButtonState(): void {
    const inputFormatTab = document.querySelector(
      '[data-setting="inputFormat"]'
    ) as HTMLDivElement;
    const inputButtons = inputFormatTab.querySelectorAll('[data-value]');
    inputButtons.forEach(button => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.dataset.active = String(
        button.dataset.value === playgroundState.inputFormat
      );
    });

    const outputFormatTab = document.querySelector(
      '[data-setting="outputFormat"]'
    ) as HTMLDivElement;
    const outputButtons = outputFormatTab.querySelectorAll('[data-value]');
    outputButtons.forEach(button => {
      if (!(button instanceof HTMLButtonElement)) return;
      button.dataset.active = String(
        button.dataset.value === playgroundState.outputFormat
      );
    });
  }

  /**
   * updateErrorState
   * Applies error state
   * Called by state's proxy setter
   */
  function updateErrorState(): void {
    const editorWrapper = document.querySelector(
      '[data-compiler-has-error]'
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
  function updateDebugOutput(): void {
    const console = document.querySelector(
      '.sl-c-playground__console'
    ) as HTMLDivElement;
    console.innerHTML = playgroundState.debugOutput
      .map(item => displayForConsoleLog(item, playgroundState))
      .join('\n');
    console.querySelectorAll('a.console-location').forEach(link => {
      (link as HTMLAnchorElement).addEventListener('click', event => {
        if (!(event.metaKey || event.altKey || event.shiftKey))
          event.preventDefault();
        const range = (event.currentTarget as HTMLAnchorElement).dataset.range
          ?.split(',')
          .map(n => parseInt(n));
        if (range && range.length === 4) {
          const [fromL, fromC, toL, toC] = range;
          goToSelection([fromL, fromC, toL, toC]);
        }
      });
    });
  }

  function updateDiagnostics(): void {
    const diagnostics = logsToDiagnostics(playgroundState.debugOutput);
    const transaction = setDiagnostics(editor.state, diagnostics);
    editor.dispatch(transaction);
  }

  function updateCSS(): void {
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
      playgroundState.compilerHasError = false;
    } else {
      playgroundState.compilerHasError = true;
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        {type: 'error', error: result.error},
      ];
    }
    updateDebugOutput();
    updateDiagnostics();
  }
  const debouncedUpdateCSS = debounce(updateCSS, 200);

  const logger: Logger = {
    warn(message, options) {
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        {message, options, type: 'warn'},
      ];
    },
    debug(message, options) {
      playgroundState.debugOutput = [
        ...playgroundState.debugOutput,
        {message, options, type: 'debug'},
      ];
    },
  };

  function parse(css: string): ParseResult {
    try {
      const result = compileString(css, {
        syntax: playgroundState.inputFormat,
        style: playgroundState.outputFormat,
        logger: logger,
        importer: customLoader,
      });
      return {css: result.css};
    } catch (error) {
      return {error};
    }
  }

  const debounceUpdateURL = debounce(updateURL, 200);

  function updateURL(): void {
    const hash = serializeState(playgroundState);
    history.replaceState('playground', '', `#${hash}`);
  }

  function updateSassVersion(): void {
    const version = info.split('\t')[1];
    const versionSpan = document.querySelector(
      '.sl-c-playground__tabbar-version'
    ) as HTMLSpanElement;
    versionSpan.innerText = `v${version}`;
  }

  attachListeners();
  applyInitialState();
  updateSassVersion();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

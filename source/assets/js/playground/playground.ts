import { sass as langSass } from '@codemirror/lang-sass';
import { Text } from '@codemirror/state';
import { EditorView } from 'codemirror';

import { compileString } from '../sass.default.js';
import { editorSetup, outputSetup } from './editor-setup.js';
import { playgroundTheme } from './theme.js';

function setupPlayground() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const editor = new EditorView({
    extensions: [
      editorSetup,
      langSass(),
      playgroundTheme,
      EditorView.updateListener.of((v) => {
        if (v.docChanged) {
          updateCSS();
        }
      }),
    ],
    parent: document.getElementById('editor') || document.body,
  });

  // Setup CSS view
  const viewer = new EditorView({
    // TODO: Confirm lang sass is good for CSS.
    extensions: [outputSetup, langSass(), playgroundTheme],
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

        updateCSS();
      }
    }
    Array.from(options).forEach((option) => {
      option.addEventListener('click', clickHandler);
    });
  }

  function updateCSS() {
    const val = editor.state.doc.toString();
    const css = parse(val);
    const text = Text.of(css.split('\n'));
    viewer.dispatch({
      changes: {
        from: 0,
        to: viewer.state.doc.toString().length,
        insert: text,
      },
    });
  }

  function parse(css: string): string {
    const settings = getSettingsFromDOM();
    let result = '';
    try {
      result = compileString(css, {
        syntax: settings['input-format'],
        style: settings['output-format'],
      }).css;
    } catch (error) {
      result = error?.toString() || '';
    }

    return result;
  }

  attachListeners();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupPlayground);
} else {
  setupPlayground();
}

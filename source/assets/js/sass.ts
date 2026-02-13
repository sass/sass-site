import * as sassModule from 'sass';

import './vendor';
import './components';

// Make Sass available as a global so that users can experiment with the API in
// their dev consoles.
declare global {
  // There doesn't seem to be any other way to declare this that TypeScript will
  // accept.
  // eslint-disable-next-line no-var
  var sass: typeof sassModule;
}

globalThis.sass = sassModule;

window.addEventListener('DOMContentLoaded', () => {
  const styles = window.getComputedStyle(document.body);
  const display = `
    font-family: ${styles.getPropertyValue('--sl-font-family--display')};
    color: ${styles.getPropertyValue('--sl-color--pale-sky')};
    font-size: 2.5em;
    line-height: 1.25;
    text-rendering: optimizelegibility;
  `;
  const text = `
    font-family: ${styles.getPropertyValue('--sl-font-family--text')};
    color: ${styles.getPropertyValue('--sl-color--pale-sky')};
    font-size: 1.3em;
    line-height: 1.5;
    text-rendering: optimizelegibility;
  `;
  const code = `
    font-family: ${styles.getPropertyValue('--sl-font-family--code')};
    color: ${styles.getPropertyValue('--sl-color--code-text')};
    vertical-align: baseline;
    font-size: 1.6em;
    line-height: 1;
    white-space: nowrap;
    text-rendering: optimizelegibility;
  `;

  console.log('%cWelcome to the Sass JS API sandbox!', display);

  console.log(
    '%cThis console comes with the %csass%c JavaScript API preloaded for you ' +
      'to experiment with. For example, you can run %csass.compileString("a ' +
      '{&[href] {font-weight: bold}}")%c to compile a stylesheet or %cnew ' +
      'sass.SassColor({red: 102, green: 51, blue: 153})%c to create a color ' +
      'value.\n\n' +
      'See https://sass-lang.com/documentation/js-api for full API ' +
      'documentation.',
    text,
    code,
    text,
    code,
    text,
    code,
    text
  );
});

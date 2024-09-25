import {Exception, SourceSpan} from 'sass';

import {PlaygroundSelection, PlaygroundState, serializeState} from './utils';

import Color from 'colorjs.io';
import {colorSwatchView} from './color-decorator';

export interface ConsoleLogDebug {
  options: {
    span: SourceSpan;
  };
  message: string;
  type: 'debug';
}

export interface ConsoleLogWarning {
  options: {
    deprecation: boolean;
    span?: SourceSpan | undefined;
    stack?: string | undefined;
    deprecationType?: {
      id: string;
    };
  };
  message: string;
  type: 'warn';
}

export interface ConsoleLogError {
  type: 'error';
  error: Exception | unknown;
}

export type ConsoleLog = ConsoleLogDebug | ConsoleLogWarning | ConsoleLogError;

/**
 * `message` is untrusted.
 *
 * Write with `innerText` and then retrieve using `innerHTML` to encode message
 * for safe display.
 * @param  {string} message The user-submitted string
 * @return {string} The sanitized string
 */
function encodeHTML(message: string): string {
  const el = document.createElement('div');
  el.innerText = message;
  return el.innerHTML;
}

// Returns undefined if no range, or a link to the state, including range.
function selectionLink(
  playgroundState: PlaygroundState,
  range: PlaygroundSelection
): string | undefined {
  if (!range) return undefined;
  return serializeState({...playgroundState, selection: range});
}

// Returns a safe HTML string for a console item.
export function displayForConsoleLog(
  item: ConsoleLog,
  playgroundState: PlaygroundState
): string {
  let lineNumber: number | undefined;
  let message: string;
  let range: PlaygroundSelection = null;

  if (item.type === 'error') {
    if (item.error instanceof Exception) {
      const span = item.error.span;
      lineNumber = span.start.line;
      range = [
        span.start.line + 1,
        span.start.column + 1,
        span.end.line + 1,
        span.end.column + 1,
      ];
    }
    message = encodeHTML(item.error?.toString() ?? '');
  } else {
    message = encodeHTML(item.message);
    if (item.options.span) {
      const span = item.options.span;
      lineNumber = span.start.line;
      range = [
        span.start.line + 1,
        span.start.column + 1,
        span.end.line + 1,
        span.end.column + 1,
      ];
    } else if ('stack' in item.options) {
      const match = item.options.stack?.match(/^- (\d+):(\d+) /);
      if (match) {
        // Stack trace starts at 1, all others come from span, which starts at
        // 0, so adjust before formatting.
        lineNumber = parseInt(match[1]) - 1;
        range = [
          parseInt(match[1]),
          parseInt(match[2]),
          parseInt(match[1]),
          parseInt(match[2]),
        ];
      }
    }
    if (item.type === 'debug') {
      try {
        const color = new Color(item.message);
        const colorSwatch = colorSwatchView(
          color.toString(),
          color.inGamut('p3')
        );
        message = message + colorSwatch.outerHTML;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Ignore
      }
    }

    if (item.type === 'warn' && item.options.deprecationType?.id) {
      const safeLink = `https://sass-lang.com/d/${item.options.deprecationType.id}`;
      message = message.replace(
        safeLink,
        `<a href="${safeLink}" target="_blank">${safeLink}</a>`
      );
    }
  }
  const link = selectionLink(playgroundState, range);

  const locationStart = link
    ? `<a href="#${link}" class="console-location" data-range=${range}>`
    : '<div class="console-location">';

  const locationEnd = link ? '</a>' : '</div>';

  return `<div class="console-line">${locationStart}<span class="console-type console-type-${
    item.type
  }">@${item.type}</span>${
    lineNumber !== undefined ? `:${lineNumber + 1}` : ''
  }${locationEnd}<div class="console-message">${message}</div></div>`;
}

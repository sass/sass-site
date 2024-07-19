import {Exception, SourceSpan} from 'sass';

import {PlaygroundState, serializeState} from './utils';

export type ConsoleLogDebug = {
  options: {
    span: SourceSpan;
  };
  message: string;
  type: 'debug';
};

export type ConsoleLogWarning = {
  options: {
    deprecation: boolean;
    span?: SourceSpan | undefined;
    stack?: string | undefined;
  };
  message: string;
  type: 'warn';
};

export type ConsoleLogError = {
  type: 'error';
  error: Exception | unknown;
};

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

function lineNumberFormatter(number?: number): string {
  if (number === undefined) return '';
  number = number + 1;
  return `${number}`;
}

function selectionLink(
  playgroundState: PlaygroundState,
  range?: PlaygroundState['selection']
) {
  if (!range) return '';
  return serializeState({...playgroundState, selection: range});
}

export function displayForConsoleLog(
  item: ConsoleLog,
  playgroundState: PlaygroundState
): string {
  const data: {
    type: string;
    lineNumber?: number;
    message: string;
    range?: PlaygroundState['selection'];
  } = {
    type: item.type,
    lineNumber: undefined,
    message: '',
    range: null,
  };
  if (item.type === 'error') {
    if (item.error instanceof Exception) {
      const span = item.error.span;
      data.lineNumber = span.start.line;
      data.range = [
        span.start.line + 1,
        span.start.column + 1,
        span.end.line + 1,
        span.end.column + 1,
      ];
    }
    data.message = item.error?.toString() || '';
  } else if (['debug', 'warn'].includes(item.type)) {
    data.message = item.message;
    let lineNumber = item.options.span?.start?.line;
    if (item.options.span) {
      const span = item.options.span;
      data.lineNumber = span.start.line;
      data.range = [
        span.start.line + 1,
        span.start.column + 1,
        span.end.line + 1,
        span.end.column + 1,
      ];
    }

    if (typeof lineNumber === 'undefined') {
      const stack = 'stack' in item.options ? item.options.stack : '';
      const needleFromStackRegex = /^- (\d+):(\d+) /;
      const match = stack?.match(needleFromStackRegex);
      if (match?.[1]) {
        // Stack trace starts at 1, all others come from span, which starts at
        // 0, so adjust before formatting.
        lineNumber = parseInt(match[1]) - 1;
      }
      if (match?.[2]) {
        data.range = [
          parseInt(match[1]),
          parseInt(match[2]),
          parseInt(match[1]),
          parseInt(match[2]),
        ];
      }
    }
    data.lineNumber = lineNumber;
  }
  const link = selectionLink(playgroundState, data.range);

  const locationStart = link
    ? `<a href="#${link}" class="console-location" data-range=${data.range}>`
    : '<div class="console-location">';

  const locationEnd = link ? '</a>' : '</div>';

  return `<div class="console-line">${locationStart}<span class="console-type console-type-${
    data.type
  }">@${data.type}</span>:${lineNumberFormatter(
    data.lineNumber
  )}${locationEnd}<div class="console-message">${encodeHTML(data.message)}</div></div>`;
}

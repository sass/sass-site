import { Exception, SourceSpan } from 'sass';

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
  if (typeof number === 'undefined') return '';
  number = number + 1;
  return `${number}`;
}

export function displayForConsoleLog(item: ConsoleLog): string {
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
      if (match?.[1]) {
        // Stack trace starts at 1, all others come from span, which starts at
        // 0, so adjust before formatting.
        lineNumber = parseInt(match[1]) - 1;
      }
    }
    data.lineNumber = lineNumber;
  }

  return `<div class="console-line"><div class="console-location"><span class="console-type console-type-${
    data.type
  }">@${data.type}</span>:${lineNumberFormatter(
    data.lineNumber,
  )}</div><div class="console-message">${encodeHTML(data.message)}</div></div>`;
}

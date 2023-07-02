/* eslint-disable node/no-extraneous-import */
import {Diagnostic} from '@codemirror/lint';
import {Exception, OutputStyle, Syntax} from 'sass';

import {ConsoleLog, ConsoleLogDebug, ConsoleLogWarning} from './console-utils';

export type PlaygroundState = {
  inputFormat: Syntax;
  outputFormat: OutputStyle;
  inputValue: string;
  compilerHasError: boolean;
  debugOutput: ConsoleLog[];
};

// State is persisted to the URL's hash format in the following format:
// [inputFormat, outputFormat, ...inputValue] = hash;
// inputFormat: 0=indented 1=scss
// outputFormat: 0=compressed 1=expanded
export function stateToBase64(state: PlaygroundState): string {
  const inputFormatChar = state.inputFormat === 'scss' ? 1 : 0;
  const outputFormatChar = state.outputFormat === 'expanded' ? 1 : 0;
  const persistedState = `${inputFormatChar}${outputFormatChar}${state.inputValue}`;
  return btoa(encodeURIComponent(persistedState));
}

export function base64ToState(string: string): Partial<PlaygroundState> {
  const state: Partial<PlaygroundState> = {};
  let decoded;
  try {
    decoded = decodeURIComponent(atob(string));
  } catch (error) {
    return {};
  }

  if (!/\d\d.*/.test(decoded)) return {};
  state.inputFormat = decoded.charAt(0) === '1' ? 'scss' : 'indented';
  state.outputFormat = decoded.charAt(1) === '1' ? 'expanded' : 'compressed';
  state.inputValue = decoded.slice(2);

  return state;
}

type ParseResultSuccess = {css: string};
type ParseResultError = {error: Exception | unknown};
export type ParseResult = ParseResultSuccess | ParseResultError;

export function errorToDiagnostic(error: Exception | unknown): Diagnostic {
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

export function debugToDiagnostic(logItem: ConsoleLogDebug): Diagnostic {
  return {
    from: logItem.options.span.start.offset,
    to: logItem.options.span.end.offset,
    severity: 'info',
    message: logItem.message,
  };
}

export function warnToDiagnostic(
  logItem: ConsoleLogWarning
): Diagnostic | null {
  if (!logItem.options.span) return null;
  return {
    from: logItem.options.span.start.offset,
    to: logItem.options.span.end.offset,
    severity: 'warning',
    message: logItem.message,
  };
}

export function logsToDiagnostics(logs: ConsoleLog[]): Diagnostic[] {
  const diagnostics = logs.flatMap(log => {
    if (log.type === 'error') return errorToDiagnostic(log.error);
    else if (log.type === 'warn') return warnToDiagnostic(log);
    else if (log.type === 'debug') return debugToDiagnostic(log);
    else return null;
  });
  // Remove empties
  return diagnostics.filter(
    (diagnostic): diagnostic is Diagnostic => !!diagnostic
  );
}

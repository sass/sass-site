/* eslint-disable node/no-extraneous-import */
import {Diagnostic} from '@codemirror/lint';
import {Exception, Importer, OutputStyle, Syntax} from 'sass';
import {deflate, inflate} from 'pako';

import {ConsoleLog, ConsoleLogDebug, ConsoleLogWarning} from './console-utils';

const PLAYGROUND_LOAD_ERROR_MESSAGE =
  'The Sass Playground does not support loading stylesheets.';

export type PlaygroundState = {
  inputFormat: Exclude<Syntax, 'css'>;
  outputFormat: OutputStyle;
  inputValue: string;
  compilerHasError: boolean;
  debugOutput: ConsoleLog[];

  /**
   * `[fromLine, fromColumn, toLine, toColumn]`; all 1-indexed. If this is null,
   * the editor has no selection.
   */
  selection: [number, number, number, number] | null;
};

export function serializeState(state: PlaygroundState): string {
  const contents = serializeStateContents(state);
  const params = serializeStateParams(state);
  return `${contents}${params ? `?${params}` : ''}`;
}

/**
 * Serializes contents of the playground (input, input format & output format)
 * to a base 64 string of the format `[inputFormat, outputFormat, ...inputValue]`
 * where,
 * - `inputFormat`: 0=indented 1=scss
 * - `outputFormat`: 0=compressed 1=expanded
 */
function serializeStateContents(state: PlaygroundState): string {
  const inputFormatChar = state.inputFormat === 'scss' ? 1 : 0;
  const outputFormatChar = state.outputFormat === 'expanded' ? 1 : 0;
  const persistedState = `${inputFormatChar}${outputFormatChar}${state.inputValue}`;
  return deflateToBase64(persistedState);
}

/**
 * Serializes `state`'s non-boolean, non-textual parameters to a set of URL
 * parameters that can be added to the URL hash.
 */
function serializeStateParams(state: PlaygroundState): string | null {
  const params = new URLSearchParams();

  if (state.selection) {
    const [fromL, fromC, toL, toC] = state.selection;
    params.set('s', `L${fromL}C${fromC}-L${toL}C${toC}`);
  }

  return params.size === 0 ? null : params.toString();
}

/** Compresses `input` and returns a base64 string of the compressed bytes. */
function deflateToBase64(input: string): string {
  const deflated = deflate(input);
  // btoa() input can't contain multi-byte characters, so it must be manually
  // decoded into an ASCII string. TextDecoder can't take multi-byte characters,
  // and encodeURIComponent doesn't escape all characters.
  return btoa(String.fromCharCode(...deflated));
}

/** Decompresses a base64 `input` into the original string. */
function inflateFromBase64(input: string): string {
  const base64 = atob(input);
  const deflated = new Uint8Array(base64.length);
  // Manually encode the inflated string because it was manually decoded without
  // TextDecode. TextEncoder would generate a different representation for the
  // given input.
  for (let i = 0; i < base64.length; i++) {
    deflated[i] = base64.charCodeAt(i);
  }
  return inflate(deflated, {to: 'string'});
}

export function deserializeState(input: string): Partial<PlaygroundState> {
  const state: Partial<PlaygroundState> = {};
  const [contents, query] = input.split('?');
  if (contents) deserializeStateContents(state, contents);
  if (query) deserializeStateParams(state, query);
  return state;
}

/**
 * Updates `state` with the result of deserializing `input`, which should be in
 * the format produced by `serializeStateContents`.
 */
function deserializeStateContents(
  state: Partial<PlaygroundState>,
  input: string
): void {
  let decoded: string;
  try {
    decoded = inflateFromBase64(input);
  } catch (error) {
    // For backwards compatibility, decode the URL using the old decoding
    // strategy if the URL could not be inflated.
    try {
      decoded = decodeURIComponent(atob(input));
    } catch (error) {
      return;
    }
  }

  if (!/\d\d.*/.test(decoded)) return;
  state.inputFormat = decoded.charAt(0) === '1' ? 'scss' : 'indented';
  state.outputFormat = decoded.charAt(1) === '1' ? 'expanded' : 'compressed';
  state.inputValue = decoded.slice(2);
}

/**
 * Updates `state` with the result of deserializing `input`, which should be in
 * the format produced by `serializeStateParams`.
 */
function deserializeStateParams(
  state: Partial<PlaygroundState>,
  input: string
): void {
  const params = new URLSearchParams(input);

  const s = params.has('s')
    ? /^L(?<fromL>\d+)C(?<fromC>\d+)-L(?<toL>\d+)C(?<toC>\d+)$/i.exec(
        params.get('s') as string
      )?.groups
    : null;
  if (s) {
    state.selection = [+s['fromL'], +s['fromC'], +s['toL'], +s['toC']];
  }
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

export const customLoader: Importer<'sync'> = {
  canonicalize() {
    throw new Error(PLAYGROUND_LOAD_ERROR_MESSAGE);
  },
  load: () => null,
};

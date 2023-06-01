import stripIndent from 'strip-indent';

import { liquidEngine } from '../engines';

/**
 * Renders a status dashboard for each implementation's support for a feature.
 *
 * Each implementation's value can be:
 *
 * - `true`, indicating that that implementation fully supports the feature;
 * - `false`, indicating that it does not yet support the feature at all;
 * - `'partial'`, indicating that it has limited or incorrect support for the
 *   feature;
 * - or a string, indicating the version it started supporting the feature.
 *
 * When possible, prefer using the start version rather than `true`.
 *
 * If `feature` is passed, it should be a terse (one- to three-word) description
 * of the particular feature whose compatibility is described. This should be
 * used whenever the status isn't referring to the entire feature being
 * described by the surrounding prose.
 *
 * This takes an optional Markdown block (`details`) that should provide more
 * information about the implementation differences or the old behavior.
 */
export const compatibility = async (details: string, ...opts: string[]) => {
  const options = parseCompatibilityOpts(...opts);
  return liquidEngine.renderFile('compatibility', {
    details: stripIndent(details),
    ...options,
  });
};

interface CompatibilityOptions {
  dart: string | boolean | null;
  libsass: string | boolean | null;
  node: string | boolean | null;
  ruby: string | boolean | null;
  feature: string | null;
  useMarkdown: boolean;
}

const extend = <
  K extends keyof CompatibilityOptions,
  V extends CompatibilityOptions[K],
>(
  value: V,
  obj: CompatibilityOptions,
  key: K,
) => {
  obj[key] = value;
};

/**
 * Take text `inputs` list and convert it into an object of all arguments
 * suitable for the `compatibility.liquid` template.
 */
const parseCompatibilityOpts = (...args: string[]): CompatibilityOptions => {
  const keyValueRegex = /(\w+):(.*)/;
  const defaults = {
    dart: null,
    libsass: null,
    node: null,
    ruby: null,
    feature: null,
    useMarkdown: true,
  };
  for (const input of args) {
    if (typeof input !== 'string') {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Received non-string argument to {% compatibility %} tag:\n${input}`,
      );
    }
    let [, key, value] = input.match(keyValueRegex) || [];
    key = key?.trim();
    value = value?.trim();
    if (key && value && Object.hasOwn(defaults, key)) {
      switch (value) {
        case 'true':
          (value as CompatibilityOptions[keyof CompatibilityOptions]) = true;
          break;
        case 'false':
          (value as CompatibilityOptions[keyof CompatibilityOptions]) = false;
          break;
        case 'null':
          (value as CompatibilityOptions[keyof CompatibilityOptions]) = null;
          break;
      }
      extend(
        value as CompatibilityOptions[keyof CompatibilityOptions],
        defaults,
        key as keyof CompatibilityOptions,
      );
    } else {
      throw new Error(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `Received unexpected argument to {% compatibility %} tag:\n${input}`,
      );
    }
  }
  return defaults;
};

/**
 * Renders a single row for `compatibility`.
 */
export const implStatus = (status: string | boolean | null) => {
  switch (status) {
    case true:
      return '✓';
    case false:
      return '✗';
    case 'partial':
    case null:
      return status;
    default:
      return `since ${status}`;
  }
};

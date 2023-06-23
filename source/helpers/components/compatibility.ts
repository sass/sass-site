import {liquidEngine} from '../engines';
import {stripIndent} from '../type';

/**
 * Renders a status dashboard for each implementation's support for a feature.
 *
 * Each implementation's value can be:
 *
 * - `true`, indicating that that implementation fully supports the feature;
 * - `false`, indicating that it does not yet support the feature at all;
 * - `"partial"`, indicating that it has limited or incorrect support for the
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
}

const extend = <
  K extends keyof CompatibilityOptions,
  V extends CompatibilityOptions[K]
>(
  value: V,
  obj: CompatibilityOptions,
  key: K
) => {
  obj[key] = value;
};

/**
 * Take a list of string `args` and converts it into an object of all arguments
 * suitable for the `compatibility.liquid` template.
 *
 * This can be removed once 11ty adds support for named Liquid arguments.
 * @see https://github.com/11ty/eleventy/issues/2679
 */
const parseCompatibilityOpts = (...args: string[]): CompatibilityOptions => {
  const opts = {
    dart: null,
    libsass: null,
    node: null,
    ruby: null,
    feature: null,
  };
  const keyValueRegex = /(.*?):(.*)/;
  for (const arg of args) {
    if (typeof arg !== 'string') {
      throw new Error(
        `Received non-string argument to {% compatibility %} tag: ${arg}`
      );
    }
    const match = arg.match(keyValueRegex);
    if (!match) {
      throw new Error(
        `Arguments should be in the format 'key:value'; received ${arg}.`
      );
    }
    const key: string = match[1].trim();
    let value: string | boolean | null = match[2].trim();
    try {
      // handles true, false, null, numbers, strings...
      value = JSON.parse(value) as string | boolean | null;
    } catch (e) {
      throw new Error(
        `Unable to parse argument ${key} with value ${
          value as string
        }. Try wrapping it in double quotes: ${key}:"${value as string}"`
      );
    }
    if (key && Object.hasOwn(opts, key)) {
      extend(value, opts, key as keyof CompatibilityOptions);
    } else {
      throw new Error(
        `Received unexpected argument to {% compatibility %} tag: ${arg}`
      );
    }
  }
  return opts;
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

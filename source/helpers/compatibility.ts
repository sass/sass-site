import { liquidEngine } from './engines';

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
export const compatibility = async (
  details: string,
  dart: string | boolean | null = null,
  libsass: string | boolean | null = null,
  ruby: string | boolean | null = null,
  feature: string | null = null,
) =>
  liquidEngine.renderFile('compatibility', {
    details,
    dart,
    libsass,
    ruby,
    feature,
  });

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

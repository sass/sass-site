import fs from 'node:fs';
import sass from 'sass';

import {liquidEngine} from '../engines';

/**
 * The set of Dart Sass 1.x deprecations prior to 1.106.0 that aren't erors in
 *  Dart Sass 2.
 */
const nonDartSass2 = new Set([
  sass.deprecations['color-module-compat'],
  sass.deprecations['import'],
  sass.deprecations['global-builtin'],
  sass.deprecations['if-function'],
]);

/**
 * Renders a table of deprecations with the given status.
 */
export default async function deprecations(
  _: string,
  status: 'active' | 'future' | 'obsolete',
): Promise<string> {
  const deprecations = [];
  for (const [id, deprecation] of Object.entries(sass.deprecations)) {
    if (deprecation.status === status) {
      deprecations.push({
        id: id,
        deprecatedIn: deprecation.deprecatedIn,
        obsoleteIn: deprecation.obsoleteIn,
        description: deprecation.description,
        removedInDartSass2:
          deprecation.deprecatedIn.major < 2 &&
          deprecation.deprecatedIn.minor < 106 &&
          deprecation.obsoleteIn === null &&
          !nonDartSass2.has(deprecation),
        hasWebpage: fs.existsSync(
          `source/documentation/breaking-changes/${id}.md`,
        ),
      });
    }
  }

  return liquidEngine.renderFile('deprecations', {
    deprecations,
    status,
    hasDartSass2Footnote: deprecations.some(
      deprecation => deprecation.removedInDartSass2,
    ),
  });
}

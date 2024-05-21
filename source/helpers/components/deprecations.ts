import fs from 'node:fs';
import sass from 'sass';

import {liquidEngine} from '../engines';

/**
 * Renders a table of deprecations with the given status.
 */
export default async function deprecations(
  _: string,
  status: 'active' | 'future'
) {
  const deprecations = [];
  for (const [id, deprecation] of Object.entries(sass.deprecations)) {
    if (deprecation.status === status) {
      deprecations.push({
        id: id,
        deprecatedIn: deprecation.deprecatedIn,
        description: deprecation.description,
        hasWebpage: fs.existsSync(
          `source/documentation/breaking-changes/${id}.md`
        ),
      });
    }
  }
  return liquidEngine.renderFile('deprecations', {
    deprecations,
    status,
  });
}

import * as fs from 'node:fs';
import * as p from 'node:path';
import { fileURLToPath } from 'url';

/** Returns `path` without any file extensions. */
function withoutExtensions(path: string): string {
  return path.substring(0, path.indexOf('.'));
}

/** A list of breaking change URLs. */
export const breaking: string[] = fs
  .readdirSync(p.join(p.dirname(fileURLToPath(import.meta.url)), '../documentation/breaking-changes'))
  .filter(path => path.endsWith('.md'))
  .map(path => withoutExtensions(p.basename(path)));

/** A set of redirects from multiple sources to one target. */
export interface MultipleRedirect {
  /** The source URLs that should redirect to `to`. */
  from: string[];

  /** The URL to redirect to. */
  to: string;
}

/** A list of redirects from mmultiple sources to single targets. */
export const multiple: MultipleRedirect[] = [
  {
    from: [
      '/d/random-with-units',
      '/documentation/breaking-changes/random-with-units',
      '/d/color-units',
      '/documentation/breaking-changes/color-units',
    ],
    to: '/documentation/breaking-changes/function-units',
  },
  {
    from: [
      '/docs/yardoc/file.SASS_REFERENCE.html',
      '/documentation/file.SASS_REFERENCE.html',
    ],
    to: '/documentation',
  },
  {
    from: [
      '/docs/yardoc/file.SASS_CHANGELOG.html',
      '/documentation/file.SASS_CHANGELOG.html',
    ],
    to: 'https://github.com/sass/dart-sass/blob/main/CHANGELOG.md',
  },
  {
    from: [
      '/docs/yardoc/file.INDENTED_SYNTAX.html',
      '/documentation/file.INDENTED_SYNTAX.html',
      '/docs/yardoc/file.SCSS_FOR_SASS_USERS.html',
      '/documentation/file.SCSS_FOR_SASS_USERS.html',
    ],
    to: '/documentation/syntax',
  },
  {
    from: [
      '/docs/yardoc/Sass/Script/Functions.html',
      '/documentation/Sass/Script/Functions.html',
      '/docs/yardoc/functions.html',
      '/documentation/functions.html',
    ],
    to: '/documentation/modules',
  },
  {
    from: [
      '/docs/yardoc/functions/css.html',
      '/documentation/functions/css.html',
    ],
    to: '/documentation/at-rules/function/#plain-css-functions',
  },
];

import * as fs from 'fs';
import * as p from 'path';

function withoutExtensions(path: string): string {
  return path.substring(0, path.indexOf('.'));
}

module.exports = {
  breaking: fs
    .readdirSync(p.join(__dirname, '../documentation/breaking-changes'))
    .filter(path => path.endsWith('.md'))
    .map(path => withoutExtensions(p.basename(path))),
  multiple: [
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
  ],
};

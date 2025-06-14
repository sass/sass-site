import {globSync} from 'fast-glob';
import {readFileSync} from 'fs';
import path from 'path';

const toc = readFileSync(
  path.resolve(__dirname, '../source/_data/documentation.yml')
);
const indexPage = readFileSync(
  path.resolve(__dirname, '../source/documentation/breaking-changes/index.md')
);

const missingNavEntries = [];
const missingIndexEntries = [];

for (const page of globSync('*.md', {
  cwd: path.resolve(__dirname, '../source/documentation/breaking-changes'),
  ignore: ['index.md'],
})) {
  const basename = path.basename(page, '.md');

  if (!toc.includes(`/documentation/breaking-changes/${basename}/`)) {
    missingNavEntries.push(basename);
  }

  if (!indexPage.includes(`/documentation/breaking-changes/${basename}`)) {
    missingIndexEntries.push(basename);
  }
}

if (missingIndexEntries.length > 0) {
  console.log(
    'The source/documentation/breaking-changes/index.md file is missing the following breaking changes:\n' +
      missingIndexEntries.join('\n')
  );
  process.exitCode = 1;
}

if (missingNavEntries.length > 0) {
  console.log(
    'The source/_data/documentation.yml file is missing the following breaking changes:\n' +
      missingNavEntries.join('\n')
  );
  process.exitCode = 1;
}

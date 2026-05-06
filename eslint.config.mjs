import {defineConfig, globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';
import gts from 'gts';

export default defineConfig([
  globalIgnores([
    '.language/**',
    '.vscode/**',
    'coverage/**',
    'node_modules/**',
    'package-lock.json',
    'source/_data/versionCache.json',
    'source/assets/js/playground/module-metadata.ts',
    'source/assets/js/vendor/**',
    'source/assets/sass/vendor/**',
    'source/blog/*.md',
    'source/documentation/js-api/**',
    'tool/typedoc-theme.js',
    '!source/assets/js/vendor/index.js',

    // Eleventy
    'source/assets/dist/**',
    '_site/**',
  ]),
  {
    extends: [tseslint.configs.recommended, gts],
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {allowExpressions: true},
      ],
      '@typescript-eslint/no-empty-interface': ['error'],
      'func-style': ['error', 'declaration'],
      'prefer-const': ['error', {destructuring: 'all'}],
      'sort-imports': ['error', {ignoreDeclarationSort: true}],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },
]);

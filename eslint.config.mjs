import {defineConfig, globalIgnores} from 'eslint/config';
import tseslint from 'typescript-eslint';
import gts from 'gts';
import etc from 'eslint-plugin-etc';

export default defineConfig([
  globalIgnores([
    '/tool/typedoc-theme.js',
    '/source/_data/versionCache.json',
    '/source/assets/dist/',
    '/source/assets/js/vendor/**',
    '/source/assets/sass/vendor/',
    '/source/blog/*.md',
    '/source/documentation/js-api',
    'coverage/',
    'node_modules/',
    'package-lock.json',
    '!/source/assets/js/vendor/index.js',
  ]),
  {
    extends: [tseslint.configs.recommended, gts],
    plugins: {
      etc,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {allowExpressions: true},
      ],
      '@typescript-eslint/no-empty-interface': ['error'],
      'func-style': ['error', 'declaration'],
      'prefer-const': ['error', {destructuring: 'all'}],
      'sort-imports': ['error', {ignoreDeclarationSort: true}],
      'etc/prefer-interface': ['error'],
    },
  },
]);

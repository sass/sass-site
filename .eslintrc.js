module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'script',
    ecmaVersion: 2021,
    tsconfigRootDir: __dirname,
    warnOnUnsupportedTypeScriptVersion: false,
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['import', 'simple-import-sort', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        sourceType: 'module',
        project: ['tsconfig.json'],
      },
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        'import/order': 0,
        'sort-imports': 0,
        'simple-import-sort/imports': 1,
      },
    },
  ],
  rules: {
    'import/order': 1,
    'simple-import-sort/imports': 0,
    '@typescript-eslint/no-var-requires': 0,
    'no-console': 1,
    'no-warning-comments': [1, { terms: ['todo', 'fixme', '@@@'] }],
  },
};

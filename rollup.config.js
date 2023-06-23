const {babel} = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const inject = require('@rollup/plugin-inject');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');
const {defineConfig} = require('rollup');

const prod = process.env.BABEL_ENV === 'production';

const plugins = [
  nodeResolve({
    extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
    browser: true,
  }),
  commonjs(),
  babel({extensions: ['.js', '.ts'], babelHelpers: 'bundled'}),
  inject({
    $: 'jquery',
    jQuery: 'jquery',
  }),
];

if (prod) {
  plugins.push(terser());
}

module.exports = defineConfig({
  input: 'source/assets/js/sass.ts',
  output: {
    file: 'source/assets/dist/js/sass.js',
    format: 'iife',
    sourcemap: !prod,
  },
  plugins,
});

import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import inject from '@rollup/plugin-inject';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import { defineConfig } from 'rollup';

const prod = process.env.BABEL_ENV === 'production';

const plugins = [
  nodeResolve({
    extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
    browser: true,
  }),
  commonjs(),
  babel({ extensions: ['.js', '.ts'], babelHelpers: 'bundled' }),
  inject({
    $: 'jquery',
    jQuery: 'jquery',
  }),
];

if (prod) {
  plugins.push(terser());
}

export default defineConfig({
  input: 'source/assets/js/sass.ts',
  output: {
    file: 'source/assets/dist/js/sass.js',
    format: 'iife',
    sourcemap: !prod,
  },
  plugins,
});

import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import inject from "@rollup/plugin-inject";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const prod = process.env.BABEL_ENV === "production";

const plugins = [
  nodeResolve({ browser: true }),
  commonjs(),
  inject({
    $: "jquery",
    jQuery: "jquery",
  }),
  babel({ babelHelpers: "bundled" }),
];

if (prod) {
  plugins.push(terser());
}

export default {
  input: "source/assets/js/sass.js",
  output: {
    file: "source/assets/dist/js/sass.js",
    format: "iife",
    sourcemap: !prod,
  },
  plugins,
};

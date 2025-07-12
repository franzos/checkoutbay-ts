import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from "rollup-plugin-copy"; // Add this line

export default {
  input: "src/main.ts",
  output: [
    {
      file: "dist/embed.js",
      format: "iife",
      name: "CheckoutBay",
      sourcemap: false,
    },
    {
      file: "dist/embed.min.js",
      format: "iife",
      name: "CheckoutBay",
      plugins: [terser()],
      sourcemap: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      sourceMap: false,
      declaration: false,
      declarationMap: false,
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    copy({
      targets: [
        {
          src: "dist/embed.min.js",
          dest: "../checkoutbay/public/",
        },
      ],
      hook: "writeBundle",
    }),
  ],
};
import babel from "rollup-plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import compiler from "@ampproject/rollup-plugin-closure-compiler";
import copy from "rollup-plugin-copy";
import nodeResolve from "@rollup/plugin-node-resolve";
import prettier from "rollup-plugin-prettier";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";

import tsc from "./tsc-plugin.js";

const PRETTY = !!process.env.PRETTY;
const SOURCE_DIR = "packages/react-router";
const OUTPUT_DIR = "build/react-router";

export default function ({ watch }) {
  // JS modules for bundlers
  const modules = [
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/index.js`,
        format: "esm",
        sourcemap: !PRETTY
      },
      external: ["history", "prop-types", "react"],
      plugins: [
        tsc({ build: true, watch }),
        babel({
          exclude: /node_modules/,
          presets: [
            ["@babel/preset-env", { loose: true }],
            "@babel/preset-react"
          ],
          plugins: ["babel-plugin-dev-expression"]
        }),
        compiler(),
        copy({
          targets: [
            { src: `${SOURCE_DIR}/package.json`, dest: OUTPUT_DIR },
            { src: `${SOURCE_DIR}/README.md`, dest: OUTPUT_DIR },
            { src: "LICENSE", dest: OUTPUT_DIR }
          ],
          verbose: true
        })
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  // JS modules for <script type=module>
  const webModules = [
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/react-router.development.js`,
        format: "esm",
        sourcemap: !PRETTY
      },
      external: ["history", "prop-types", "react"],
      plugins: [
        tsc(),
        babel({
          exclude: /node_modules/,
          presets: ["@babel/preset-modules", "@babel/preset-react"],
          plugins: ["babel-plugin-dev-expression"]
        }),
        replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
        compiler()
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    },
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/react-router.production.min.js`,
        format: "esm",
        sourcemap: !PRETTY
      },
      external: ["history", "prop-types", "react"],
      plugins: [
        tsc(),
        babel({
          exclude: /node_modules/,
          presets: [
            [
              "@babel/preset-modules",
              {
                // Don't spoof `.name` for Arrow Functions, which breaks when minified anyway.
                loose: true
              }
            ],
            [
              "@babel/preset-react",
              {
                // Compile JSX Spread to Object.assign(), which is reliable in ESM browsers.
                useBuiltIns: true
              }
            ]
          ],
          plugins: [
            "babel-plugin-dev-expression",
            [
              "babel-plugin-transform-remove-imports",
              {
                test: /^prop-types$/
              }
            ]
          ]
        }),
        replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
        compiler(),
        terser({ ecma: 8, safari10: true })
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  // UMD modules for <script> tags and CommonJS (node)
  const globals = [
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/umd/react-router.development.js`,
        format: "umd",
        sourcemap: !PRETTY,
        globals: { history: "HistoryLibrary", react: "React" },
        name: "ReactRouter"
      },
      external: ["history", "react"],
      plugins: [
        tsc(),
        babel({
          exclude: /node_modules/,
          presets: [
            ["@babel/preset-env", { loose: true }],
            "@babel/preset-react"
          ],
          plugins: ["babel-plugin-dev-expression"]
        }),
        replace({ "process.env.NODE_ENV": JSON.stringify("development") }),
        nodeResolve(), // for prop-types
        commonjs(), // for prop-types
        compiler()
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    },
    {
      input: `${SOURCE_DIR}/index.tsx`,
      output: {
        file: `${OUTPUT_DIR}/umd/react-router.production.min.js`,
        format: "umd",
        sourcemap: !PRETTY,
        globals: { history: "HistoryLibrary", react: "React" },
        name: "ReactRouter"
      },
      external: ["history", "react"],
      plugins: [
        tsc(),
        babel({
          exclude: /node_modules/,
          presets: [
            ["@babel/preset-env", { loose: true }],
            "@babel/preset-react"
          ],
          plugins: [
            "babel-plugin-dev-expression",
            [
              "babel-plugin-transform-remove-imports",
              {
                test: /^prop-types$/
              }
            ]
          ]
        }),
        replace({ "process.env.NODE_ENV": JSON.stringify("production") }),
        compiler(),
        terser()
      ].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  // Node entry points
  const node = [
    {
      input: `${SOURCE_DIR}/node-main.js`,
      output: {
        file: `${OUTPUT_DIR}/main.js`,
        format: "cjs"
      },
      plugins: [compiler()].concat(PRETTY ? prettier({ parser: "babel" }) : [])
    }
  ];

  return [...modules, ...webModules, ...globals, ...node];
}

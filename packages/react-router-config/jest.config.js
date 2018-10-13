"use strict";

var path = require("path");

var ReactVersion = process.env.REACT_VERSION || "16.5";

module.exports = {
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "^react-router$": "<rootDir>/../react-router/cjs/react-router.js",
    "^react-router-config$": "<rootDir>/cjs/react-router-config.js"
  },
  modulePaths: [
    "<rootDir>/../../react/v" + ReactVersion + "/node_modules",
    "<rootDir>/node_modules"
  ],
  rootDir: path.resolve(__dirname),
  setupFiles: ["raf/polyfill"],
  testMatch: ["**/__tests__/**/*-test.js"],
  testURL: "http://localhost/"
};

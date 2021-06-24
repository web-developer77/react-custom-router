module.exports = {
  testMatch: ["**/__tests__/*-test.js"],
  transform: {
    "\\.js$": "./jest-transformer.js"
  },
  globals: {
    __DEV__: true
  },
  moduleNameMapper: {
    "^react-router$": "<rootDir>/../../build/react-router",
    "^react-router-dom$": "<rootDir>/../../build/react-router-dom",
    "^react-router-dom\\/server$":
      "<rootDir>/../../build/react-router-dom/server"
  }
};

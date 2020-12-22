const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    ['@babel/preset-env', { loose: true, targets: { node: 'current' } }],
    '@babel/preset-react'
  ],
  plugins: ['babel-plugin-dev-expression']
});

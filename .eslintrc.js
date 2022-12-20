'use strict'

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
  },
  overrides: [{
    files: ['*.test.js'],
    rules: {
      'no-template-curly-in-string': 'off',
      'no-unused-expressions': 'off',
      'n/no-path-concat': 'off'
    }
  }]
}

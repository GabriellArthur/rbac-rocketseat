const { FlatCompat } = require('@eslint/eslintrc')
const simpleImportSort = require('eslint-plugin-simple-import-sort')

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  ...compat.extends('@rocketseat/eslint-config/next'),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
    },
  },
]
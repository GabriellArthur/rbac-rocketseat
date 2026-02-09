/** @typedef {import('eslint').Linter.Config} ESLintConfig */
module.exports = {
  extends: [
    '@rocketseat/eslint-config/node',
  ],
  plugins: [
    'simple-import-sort',
  ],
  rules: {
    'simple-import-sort/imports': 'error',
  },
}
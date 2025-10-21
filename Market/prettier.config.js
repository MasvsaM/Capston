/** @type {import('prettier').Config} */
module.exports = {
  arrowParens: 'avoid',
  endOfLine: 'lf',
  printWidth: 100,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  bracketSpacing: true,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular'
      }
    },
    {
      files: '*.scss',
      options: {
        singleQuote: false
      }
    }
  ]
};

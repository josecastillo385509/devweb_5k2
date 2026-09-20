const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['node_modules/', 'coverage/', 'public/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // `next` debe declararse en los manejadores de error de Express aunque no se use
      'no-unused-vars': ['error', { argsIgnorePattern: '^(_|next$)' }],
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: { globals: { ...globals.jest } },
  },
];

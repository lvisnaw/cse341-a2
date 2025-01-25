import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'], // Target all JavaScript files
    ignores: ['**/testContact.js'], // Exclude testContact.js
    languageOptions: {
      sourceType: 'commonjs', // Use CommonJS modules
      ecmaVersion: 'latest', // Enable the latest ECMAScript features
      globals: {
        ...globals.node, // Include Node.js-specific globals like require, module, process
      },
    },
    rules: {
      'semi': ['error', 'always'], // Enforce semicolons
      'quotes': ['error', 'single'], // Enforce single quotes
      'no-unused-vars': 'warn', // Warn for unused variables
      'no-console': 'off', // Allow console statements (useful for Node.js)
      'eqeqeq': ['error', 'always'], // Enforce strict equality checks
    },
  },
  pluginJs.configs.recommended, // Extend ESLint's recommended rules
];

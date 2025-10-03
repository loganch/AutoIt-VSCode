import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Code style
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // Import rules
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',
      'import/no-absolute-path': 'error',
      'import/no-dynamic-require': 'warn',
      'import/no-self-import': 'error',
      'import/no-cycle': 'error',
      'import/no-useless-path-segments': 'error',

      // Variables
      'no-shadow': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',

      // Async/Await
      'no-return-await': 'error',
      'require-await': 'error',

      // Best practices
      'no-new': 'warn',
      'no-alert': 'warn',
      'no-eq-null': 'error',
      eqeqeq: ['error', 'always'],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
      'no-implicit-globals': 'error',
      'no-invalid-this': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
      'no-multi-assign': 'error',
      'no-nested-ternary': 'error',
      'no-return-assign': 'error',
      'no-throw-literal': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',

      // ES6+ features
      'prefer-destructuring': ['error', { object: true, array: false }],
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',

      // Strict mode
      strict: ['error', 'global'],

      // Symbols
      'symbol-description': 'error',

      // Variables declaration
      'vars-on-top': 'error',

      // Comparisons
      yoda: 'error',
    },
    settings: {
      'import/core-modules': ['vscode'],
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs', '.cjs'],
        },
      },
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.min.js'],
  },
];

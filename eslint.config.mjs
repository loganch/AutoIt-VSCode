import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
      },
    },
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto' }],

      // Code style preferences
      'prefer-template': 'off',
      'no-plusplus': 'off',
      'no-continue': 'off',
      'no-param-reassign': 'off',
      'no-restricted-syntax': 'off',
      'no-bitwise': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',

      // Spacing and formatting
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      'comma-style': 'error',
      'computed-property-spacing': 'error',
      'eol-last': 'error',
      'func-call-spacing': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'linebreak-style': 'off', // Handled by Prettier with endOfLine: 'auto'
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'semi-spacing': 'error',
      'space-before-blocks': 'error',
      'space-before-function-paren': [
        'error',
        { anonymous: 'always', named: 'never', asyncArrow: 'always' },
      ],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',

      // JSDoc (Note: valid-jsdoc and require-jsdoc are deprecated in ESLint 9+)
      // Consider using eslint-plugin-jsdoc if you need these rules

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
      'no-undef': 'error',
      'no-shadow': 'error',
      'no-redeclare': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',

      // Async/Await
      'no-return-await': 'error',
      'require-await': 'error',

      // Best practices
      'no-new': 'warn',
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-script-url': 'error',
      'no-alert': 'warn',
      'no-debugger': 'error',
      'no-eq-null': 'error',
      eqeqeq: ['error', 'always'],
      'no-fallthrough': 'error',
      'no-case-declarations': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-empty-function': ['error', { allow: ['arrowFunctions', 'functions', 'methods'] }],
      'no-floating-decimal': 'error',
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',
      'no-invalid-this': 'error',
      'no-loop-func': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
      'no-multi-assign': 'error',
      'no-negated-condition': 'off',
      'no-nested-ternary': 'error',
      'no-new-object': 'error',
      'no-new-wrappers': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-sequences': 'error',
      'no-shadow-restricted-names': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-undefined': 'off',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'no-with': 'error',

      // ES6+ features
      'prefer-destructuring': ['error', { object: true, array: false }],
      'prefer-named-capture-group': 'off',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'require-unicode-regexp': 'off',
      'require-yield': 'error',

      // Sorting (disabled - conflicts with prettier and manual organization)
      'sort-imports': 'off',
      'sort-vars': 'off',

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

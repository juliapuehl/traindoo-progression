module.exports = {
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping.Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    //"plugin:jsx-a11y/recommended",
    'plugin:react-hooks/recommended',
    //"plugin:jest/recommended",
    //"plugin:testing-library/react",
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: [
    'import', // eslint-plugin-import plugin. https://www.npmjs.com/package/eslint-plugin-import
    'react',
    '@typescript-eslint',
    //"jest"
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    //project: "./tsconfig.json",
  },

  root: true, // For configuration cascading.
  rules: {
    'no-console': 'warn',
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    ////// TODO: fix errors
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-case-declarations': 'warn',
    /////
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'react/react-in-jsx-scope': 'off',
    'prefer-const': 'warn',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn', // or error
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'max-len': [
      'warn',
      {
        code: 120,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect', // Detect react version
    },
  },
};

import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'warn', // Enforce propTypes without skipping undeclared ones
      'no-unused-vars': 'warn',
      'semi': ['warn', 'always'], // Enforce semicolons at the end of statements
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
      'react/jsx-max-props-per-line': ['warn', { 'maximum': 1 }],
      'react/jsx-wrap-multilines': ['warn', { 'declaration': true, 'assignment': true, 'return': true, 'arrow': true }],
      'quotes': ['warn', 'single'],
      'no-useless-concat': 'warn',
      'template-curly-spacing': ['warn', 'never'],
      'react/jsx-closing-tag-location': 'warn',
      'react/self-closing-comp': ['warn', { 'component': true, 'html': true }],
      'react/jsx-closing-bracket-location': ['warn', 'line-aligned'],
      'react/jsx-equals-spacing': ['warn', 'never'],
      'react/jsx-indent': ['warn', 4],
      'react/jsx-indent-props': ['warn', 4],
      'react/jsx-props-no-multi-spaces': 'warn',
      'react/jsx-tag-spacing': ['warn', { 'closingSlash': 'never', 'beforeSelfClosing': 'always', 'afterOpening': 'never' }],
      'no-unneeded-ternary': ['warn', { 'defaultAssignment': false }],
      'no-var': 'warn',
      'no-console': 'warn',
      'no-duplicate-imports': 'warn',
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
      'no-else-return': 'warn',
      'no-trailing-spaces': 'warn',
      'prefer-const': 'warn',
      'no-multi-spaces': 'warn',
      'arrow-spacing': 'warn',
      'react/jsx-no-undef': 'warn',
      'react/jsx-pascal-case': 'warn',
      'arrow-parens': ['warn', 'always'],
    },
  },
];

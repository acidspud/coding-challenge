import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import eslintJs from '@eslint/js';

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      // Add any specific rules or overrides here
      'eol-last': ['error', 'always'],
      'indent': ['error', 4],
      'linebreak-style': ['error', 'unix'],
      'no-trailing-spaces': 'error',
      'quotes': ['error', 'single'],
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+ with new JSX transform
      'semi': ['error', 'never'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

const browserGlobals = {
  Blob: 'readonly',
  Buffer: 'readonly',
  File: 'readonly',
  FormData: 'readonly',
  HTMLFormElement: 'readonly',
  React: 'readonly',
  Request: 'readonly',
  URL: 'readonly',
  URLSearchParams: 'readonly',
  console: 'readonly',
  document: 'readonly',
  fetch: 'readonly',
  navigator: 'readonly',
  process: 'readonly',
  setTimeout: 'readonly',
  window: 'readonly',
};

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', '.data/**', '**/* 2.*'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: browserGlobals,
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
];

export default config;

import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';

const browserGlobals = {
  Blob: 'readonly',
  Buffer: 'readonly',
  FormData: 'readonly',
  React: 'readonly',
  console: 'readonly',
  fetch: 'readonly',
  process: 'readonly',
  window: 'readonly',
};

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', '.data/**'],
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

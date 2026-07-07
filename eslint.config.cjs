const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const security = require('eslint-plugin-security');

module.exports = [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      security
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^h$' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }]
    }
  },
  {
    ignores: ['dist/**', 'coverage/**']
  }
];

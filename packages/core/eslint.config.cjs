const js = require('@eslint/js');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const security = require('eslint-plugin-security');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['src/**/*.spec.ts', 'src/**/*.spec.tsx', 'src/**/*.stories.ts', 'src/**/*.stories.tsx'],
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
      'getter-return': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }]
    }
  },
  {
    ignores: ['dist/**', 'coverage/**']
  }
];

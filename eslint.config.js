import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import pluginVitest from '@vitest/eslint-plugin';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  /** @type {import('eslint').Linter.Config} */ // https://github.com/typescript-eslint/typescript-eslint/issues/2153
  {
    rules: {
      // promise
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-unused-expressions': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-expressions': 'error',
      // ===
      eqeqeq: ['error', 'always', { null: 'ignore' }], // https://eslint.org/docs/latest/rules/eqeqeq
      // type cast
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'error',
      // react
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // 'react-hooks/exhaustive-deps': 'warn',
      // warn
      'no-unused-vars': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      'no-empty': 'warn',
      'no-inner-declarations': 'off',
      'no-constant-condition': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      // warn
      '@typescript-eslint/no-this-alias': 'warn',
      // warn regex
      'no-useless-escape': 'warn',
      // warn misc comment
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-irregular-whitespace': 'warn',
    },
  },
  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
];

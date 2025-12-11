import { defineConfig, globalIgnores } from 'eslint/config';
import ngneers from '@ngneers/eslint-config-angular';
import { tsPlugin } from 'angular-eslint';
import globals from 'globals';

export function getEslintConfig(tsconfigPath) {
  return defineConfig([
    ngneers.configs.angular,
    {
      languageOptions: {
        globals: {
          ...globals.browser,
          ...globals.node,
        },
        parserOptions: {
          project: tsconfigPath,
        },
      },
    },
    {
      files: ['**/*.spec.ts', '**/*.test.ts', '**/test/**/*.ts'],
      languageOptions: {
        globals: {
          ...globals.vitest,
        },
      },
    },
    {
      files: ['**/*.ts'],
      plugins: { '@angular-eslint': tsPlugin },
      rules: {
        '@angular-eslint/component-class-suffix': 'off',
        '@angular-eslint/prefer-on-push-component-change-detection': 'error',
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['ngn', 'demo', 'dummy'],
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['ngn'],
            style: 'camelCase',
          },
        ],
      },
    },
    {
      files: ['**/*.html'],
      rules: {
        '@angular-eslint/template/no-autofocus': 'off',
      },
    },
    globalIgnores(['dist', '.angular', 'node_modules']),
  ]);
}

import { defineConfig, globalIgnores } from 'eslint/config';
import ngneers from '@ngneers/eslint-config-angular';
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
      rules: {
        '@angular-eslint/component-class-suffix': 'off',
      },
    },
    {
      files: ['**/*.html'],
      rules: {
        '@angular-eslint/template/no-autofocus': 'off',
      },
    },
    globalIgnores(['dist', '.angular', 'node_modules', '**/fontawesome']),
  ]);
}

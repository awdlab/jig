import { defineConfig, globalIgnores } from 'eslint/config';
import ngneers from '@ngneers/eslint-config';
import globals from 'globals';

export function getEslintConfig(tsconfigPath) {
  return defineConfig([
    ngneers.configs.common,
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
          fail: 'readonly',
        },
      },
    },
    globalIgnores(['dist', '.angular', 'node_modules']),
  ]);
}

import { defineConfig, globalIgnores } from 'eslint/config';
import ngneers from '@ngneers/eslint-config';
import globals from 'globals';

export default defineConfig([
  ngneers.configs.common,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.lib.json',
      },
    },
  },
  globalIgnores(['dist', 'node_modules', 'tools']),
]);

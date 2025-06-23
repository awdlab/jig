import ngneersCfg from '@ngneers/eslint-config-angular';

export default [
  {
    ignores: ['test/**/*', '**/jest.config.ts', 'eslint.config.mjs'],
  },
  ngneersCfg,
  {
    rules: {},
  },
];

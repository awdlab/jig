import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: import.meta.dirname,
    environment: 'node',
    include: ['**/*.spec.ts'],
  },
});

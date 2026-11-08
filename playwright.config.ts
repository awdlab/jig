import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Maximum duration for a single test. Long-running tests override via test.setTimeout(). */
  timeout: 60 * 1000, // 60 seconds
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  failOnFlakyTests: true,
  // '50%' scales with the runner's cores (Playwright's recommended default) instead of a fixed 2.
  workers: process.env['CI'] ? '50%' : undefined,
  outputDir: 'tests/results',
  /* See https://playwright.dev/docs/test-reporters */
  reporter: [
    ...(process.env['CI'] ? [['list'] as const] : []),
    ['html', { outputFile: 'tests/results/test-report.html' }],
    ['junit', { outputFile: 'tests/results/test-report.xml' }],
  ],
  snapshotDir: 'tests/snapshots',
  expect: {
    toHaveScreenshot: {
      // Stricter than the stock 0.2, which scores light focus/hover tints as identical.
      threshold: 0.02,
    },
  },
  use: {
    trace: 'retain-on-failure',
    connectOptions: process.env['CI'] ? undefined : { wsEndpoint: 'ws://127.0.0.1:3000/' },
    actionTimeout: 5000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm run test-wrapper:serve --port 4222 --host "0.0.0.0" --allowed-hosts',
    url: 'http://localhost:4222',
    reuseExistingServer: !process.env['CI'],
  },
});

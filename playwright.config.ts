import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  failOnFlakyTests: true,
  workers: process.env['CI'] ? 2 : undefined,
  outputDir: 'tests/results',
  /* See https://playwright.dev/docs/test-reporters */
  reporter: [
    ...(process.env['CI'] ? [['list'] as const] : []),
    ['html', { outputFile: 'tests/results/test-report.html' }],
    ['junit', { outputFile: 'tests/results/test-report.xml' }],
  ],
  snapshotDir: 'tests/snapshots',
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

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  webServer: {
    command: 'pnpm run test-wrapper:serve --port 4222 --host "0.0.0.0" --allowed-hosts',
    url: 'http://localhost:4222',
    reuseExistingServer: !process.env['CI'],
  },
});

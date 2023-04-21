import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { resolve } from 'path';

const IS_CI = Boolean(process.env.GITHUB_ACTIONS);
const PORT = Number(process.env.PORT || 3000);
const E2E_BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${PORT}`;

/** See https://playwright.dev/docs/test-configuration */
export default defineConfig({
  // @TODO: Mockttp
  // globalSetup: './global-setup',
  // globalTeardown: './global-teardown',

  testDir: './test/e2e',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met. For
     * example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: IS_CI,
  // Limit the number of failures on CI to save resources
  maxFailures: IS_CI ? 10 : undefined,
  /* Don't retry on CI for now */
  retries: IS_CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: IS_CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: IS_CI ? 'github' : 'list',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: E2E_BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* See: https://playwright.dev/docs/api/class-page#page-get-by-test-id */
    testIdAttribute: 'data-test-id',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test/results/',

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run start',
    port: PORT,
    reuseExistingServer: !IS_CI,
  },
});

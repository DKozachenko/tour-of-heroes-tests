import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  timeout: 10000,
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 3,
  reporter: 'dot',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    screenshot: 'off',
    video: 'off',
    headless: true,
    testIdAttribute: 'pw-automation-id',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 10,
      maxDiffPixelRatio: 0.1,
    },
    toMatchSnapshot: {
      maxDiffPixels: 10,
      maxDiffPixelRatio: 0.1,
    },
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
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: false,
  },
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  name: 'Tour of heroes:Report',
  testDir: 'tests',
  testMatch: '*.spec.ts',
  outputDir: 'test-output',
  preserveOutput: 'never',
  quiet: false,
  timeout: 10000,
  fullyParallel: false,
  forbidOnly: true,
  ignoreSnapshots: false,
  retries: 0,
  workers: 1,
  updateSnapshots: 'none',
  reportSlowTests: {
    threshold: 5000,
    max: 5,
  },
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'html-report' }],
    ['junit', { outputFile: 'report/test-results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
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
    timeout: 60000,
    url: 'http://localhost:4200',
    reuseExistingServer: false,
  },
});

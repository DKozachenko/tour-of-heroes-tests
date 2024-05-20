import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  name: 'Tour of heroes:Local',
  testDir: 'tests',
  testMatch: '*.spec.ts',
  outputDir: 'test-output',
  preserveOutput: 'always',
  quiet: false,
  timeout: 10000,
  fullyParallel: true,
  forbidOnly: false,
  ignoreSnapshots: false,
  retries: 0,
  workers: undefined,
  updateSnapshots: 'missing',
  snapshotPathTemplate: 'snapshots/{testFileName}/{arg}.snap.png',
  reportSlowTests: null,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    screenshot: 'only-on-failure',
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
    reuseExistingServer: true,
  },
});

import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

const DESKTOP_SNAPSHOT_PATH_TEMPLATE = 'snapshots/{testFileName}/{arg}-desktop.snap.png';
const MOBILE_SNAPSHOT_PATH_TEMPLATE = 'snapshots/{testFileName}/{arg}-mobile.snap.png';

export const BASE_CONFIG: PlaywrightTestConfig = defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.ts',
  outputDir: 'test-output',
  timeout: 10000,
  ignoreSnapshots: false,
  snapshotPathTemplate: DESKTOP_SNAPSHOT_PATH_TEMPLATE,
  use: {
    baseURL: 'http://localhost:4200',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
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
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
      snapshotPathTemplate: DESKTOP_SNAPSHOT_PATH_TEMPLATE,
    },

    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
      snapshotPathTemplate: DESKTOP_SNAPSHOT_PATH_TEMPLATE,
    },

    {
      name: 'Webkit',
      use: { ...devices['Desktop Safari'] },
      snapshotPathTemplate: DESKTOP_SNAPSHOT_PATH_TEMPLATE,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      snapshotPathTemplate: MOBILE_SNAPSHOT_PATH_TEMPLATE,
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      snapshotPathTemplate: MOBILE_SNAPSHOT_PATH_TEMPLATE,
    },
  ],
  webServer: {
    command: 'npm run start',
    timeout: 60000,
    // Нужен именно localhost
    // https://github.com/microsoft/playwright/issues/16834#issuecomment-1699124292
    url: 'http://localhost:4200',
  },
});

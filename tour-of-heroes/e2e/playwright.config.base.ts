import { PlaywrightTestConfig, defineConfig, devices } from '@playwright/test';

const snapshotPathTemplateFactory = (projectName: string) => `snapshots/{testFileName}/{arg}-${projectName}.snap.png`;

export const BASE_CONFIG: PlaywrightTestConfig = defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.ts',
  outputDir: 'test-output',
  timeout: 10000,
  ignoreSnapshots: false,
  use: {
    baseURL: 'http://localhost:4200',
    locale: 'ru-RU',
    timezoneId: 'Europe/Moscow',
    video: 'off',
    headless: true,
    testIdAttribute: 'pw-automation-id',
  },
  expect: {
    timeout: 5000,
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
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
      snapshotPathTemplate: snapshotPathTemplateFactory('chrome'),
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
      snapshotPathTemplate: snapshotPathTemplateFactory('firefox'),
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
      snapshotPathTemplate: snapshotPathTemplateFactory('safari'),
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      snapshotPathTemplate: snapshotPathTemplateFactory('mobile-chrome'),
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      snapshotPathTemplate: snapshotPathTemplateFactory('mobile-safari'),
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

import { PlaywrightTestConfig, defineConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'Tour of heroes:Report',
  preserveOutput: 'never',
  quiet: false,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  updateSnapshots: 'none',
  ignoreSnapshots: false,
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
    ...BASE_CONFIG.use,
    trace: 'retain-on-failure',
    screenshot: 'off',
  },
  webServer: {
    ...BASE_CONFIG.webServer,
    reuseExistingServer: false,
  } as PlaywrightTestConfig['webServer'],
});

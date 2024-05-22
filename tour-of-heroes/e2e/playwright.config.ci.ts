import { PlaywrightTestConfig, defineConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'Tour of heroes:CI',
  preserveOutput: 'failures-only',
  quiet: true,
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 1,
  updateSnapshots: 'none',
  reportSlowTests: {
    threshold: 5000,
    max: 5,
  },
  reporter: [['github'], ['dot']],
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

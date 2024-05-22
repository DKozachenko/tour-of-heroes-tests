import { defineConfig, PlaywrightTestConfig } from '@playwright/test';
import { BASE_CONFIG } from './playwright.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  name: 'Tour of heroes:Local',
  preserveOutput: 'always',
  quiet: false,
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  workers: undefined,
  updateSnapshots: 'missing',
  reportSlowTests: null,
  reporter: 'line',
  use: {
    ...BASE_CONFIG.use,
    trace: 'on',
    screenshot: 'only-on-failure',
  },
  webServer: {
    ...BASE_CONFIG.webServer,
    reuseExistingServer: true,
  } as PlaywrightTestConfig['webServer'],
});

import { defineConfig } from '@playwright/test';
import localConfig from './playwright.config.local';

export default defineConfig({
  ...localConfig,
  name: 'Tour of heroes:Local:Docker',
  updateSnapshots: 'all',
  ignoreSnapshots: false,
});

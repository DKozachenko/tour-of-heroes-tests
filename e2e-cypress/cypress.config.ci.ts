import { defineConfig } from 'cypress';
import { BASE_CONFIG } from './cypress.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  retries: 0,
  reporter: 'progress',
  slowTestThreshold: 5000,
  watchForFileChanges: false
});

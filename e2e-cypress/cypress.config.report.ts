import { defineConfig } from 'cypress';
import { addMatchImageSnapshotPlugin } from '@simonsmith/cypress-image-snapshot/plugin';
import { BASE_CONFIG } from './cypress.config.base';

export default defineConfig({
  ...BASE_CONFIG,
  e2e: {
    ...BASE_CONFIG.e2e,
    setupNodeEvents(on) {
      addMatchImageSnapshotPlugin(on)
    },
    slowTestThreshold: 5000,
  },
  retries: 0,
  watchForFileChanges: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'e2e-cypress/cypress.report.config.json',
  },
});

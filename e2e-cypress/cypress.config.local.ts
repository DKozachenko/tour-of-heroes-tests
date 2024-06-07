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
    slowTestThreshold: undefined,
  },
  retries: 0,
  watchForFileChanges: true,
  reporter: 'nyan',
  reporterOptions: undefined
});

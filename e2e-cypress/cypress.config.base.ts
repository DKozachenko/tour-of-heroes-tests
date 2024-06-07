export const BASE_CONFIG: Cypress.ConfigOptions = {
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'e2e-cypress/support/commands.ts',
    fixturesFolder: 'e2e-cypress/fixtures',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'e2e-cypress/screenshots',
    downloadsFolder: 'e2e-cypress/downloads',
    specPattern: 'e2e-cypress/**/*.spec.ts',
  },
};

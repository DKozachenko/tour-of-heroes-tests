/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};
import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';
import { Options } from 'cypress-image-snapshot';

addMatchImageSnapshotCommand({
  failureThreshold: 0.3,
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.1 },
  e2eSpecDir: 'e2e-cypress/tests',
  customSnapshotsDir: 'snapshots',
  snapFilenameExtension: '.snap',
  diffFilenameExtension: '.diff',
});

declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(id: string): Chainable<JQuery<HTMLElement>>;
      step(description: string, callback: Function): void;
      shouldHaveUrl(url: string): Chainable<string>;
      toHaveSnapshot(name: string, options?: Options): void;
    }
  }
}

Cypress.Commands.add('getByTestId', (id: string) => {
  return cy.get(`[cy-automation-id=${id}]`);
});

Cypress.Commands.add('step', (description: string, callback: Function) => {
  cy.log(description);
  callback();
});

Cypress.Commands.add('shouldHaveUrl', (url: string) => {
  return cy.url().should('satisfy', (fullUrl: string) => fullUrl.endsWith(url));
});

Cypress.Commands.add('toHaveSnapshot', (name: string, options?: Options) => {
  // Для локального запуска через open нужно игнорировать снепшоты, тк они сделаны
  // в окружении разработчика и вероятнее всего будут отличатся от CI
  // https://docs.cypress.io/guides/references/legacy-configuration#isInteractive
  if (Cypress.config('isInteractive')) {
    // "cypress open" mode
    cy.log(`Ignore making snaphost with name: ${name} and options: ${options} in local environment`);
  } else {
    // "cypress run" mode
    if (options) {
      cy.matchImageSnapshot(name, options);
    } else {
      cy.matchImageSnapshot(name);
    }
  }
});

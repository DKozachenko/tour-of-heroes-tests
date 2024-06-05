export class AppPageObject {
  constructor() {}

  get dashboardLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('dashboard-navigation-link');
  }

  get heroesLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heroes-navigation-link');
  }

  get messagesComponent(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('messages-component');
  }

  get messagesWrapper(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('messages-wrapper');
  }

  get messagesHeading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('messages-heading');
  }

  get messagesClearButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('messages-clear-button');
  }

  get messages(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('message');
  }
}

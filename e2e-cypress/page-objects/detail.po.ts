export class DetailPageObject {
  constructor() {}

  get wrapper(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('wrapper');
  }

  get heading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heading');
  }

  get heroId(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-id');
  }

  get heroNameLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-name-label');
  }

  get heroNameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-name-input');
  }

  get saveButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('save-button');
  }

  get backButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('back-button');
  }

  waitForHeroDetailLoaded(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.wrapper.should('be.visible');
  }
}

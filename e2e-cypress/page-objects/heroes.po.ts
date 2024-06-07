export class HeroesPageObject {
  constructor() {}

  get heading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heading');
  }

  get createDiv(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('create-div');
  }

  get createLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('create-label');
  }

  get createInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('create-input');
  }

  get addButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('add-button');
  }

  get heroList(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heroes');
  }

  get heroItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-item');
  }

  get heroLinks(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-link');
  }

  get heroButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-button');
  }

  waitForHeroesItemsLoaded(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.heroItems.first({ timeout: 5000 }).should('be.visible');
  }
}

export class DashboardPageObject {
  constructor() {}

  get heading(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heading');
  }

  get heroesMenu(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('heroes-menu');
  }

  get heroLinks(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-link');
  }

  get heroSearch(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('hero-search');
  }

  get searchComponentWrapper(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('search-component');
  }

  get searchLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('search-label');
  }

  get searchInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('search-input');
  }

  get searchResult(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('search-result');
  }

  get searchLinks(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.getByTestId('search-link');
  }

  waitForHeroesLinksLoaded(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.heroLinks.first({ timeout: 5000 }).should('be.visible');
  }

  waitForSearchLinksVisible(): Cypress.Chainable<JQuery<HTMLElement>> {
    return this.searchLinks.first({ timeout: 5000 }).should('be.visible');
  }
}

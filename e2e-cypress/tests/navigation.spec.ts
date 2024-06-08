import { AppPageObject } from '../page-objects';

describe('Navigation', () => {
  it('Navigate to /dashboard route while initial routing', () => {
    cy.step('Go to main page', () => cy.visit('/'));
    cy.shouldHaveUrl('/dashboard');
  });

  it('Navigate to /heroes route if heroes navigation button has clicked', () => {
    const appPageObject = new AppPageObject();

    cy.step('Go to main page', () => cy.visit('/'));
    cy.step('Click on "Heroes" button', () => appPageObject.heroesLink.click());

    cy.shouldHaveUrl('/heroes');
  });

  it('Navigate to /dashboard route if dashboard navigation button has clicked', () => {
    const appPageObject = new AppPageObject();

    cy.step('Go to heroes page', () => cy.visit('/heroes'));
    cy.step('Click on "Dashboard" button', () =>
      appPageObject.dashboardLink.click()
    );
    cy.shouldHaveUrl('/dashboard');
  });
});

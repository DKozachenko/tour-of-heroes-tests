import { DashboardPageObject, DetailPageObject, HeroesPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

describe('Pages', () => {
  it('Display "dashboard" page', () => {
    cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

    const dashboardPageObject = new DashboardPageObject();
    cy.step('Wait for loading all heroes links', () => dashboardPageObject.waitForHeroesLinksLoaded());

    cy.shouldHaveUrl('/dashboard');
    cy.title().should('be.eq', 'Tour of Heroes');
    cy.matchImageSnapshot('dashboard-page', {
      capture: 'fullPage'
    });
  });

  it('Display "heroes" page', () => {
    cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

    const heroesPageObject = new HeroesPageObject();
    cy.step('Wait for loading all heroes items', () => heroesPageObject.waitForHeroesItemsLoaded());

    cy.shouldHaveUrl('/heroes');
    cy.title().should('be.eq', 'Tour of Heroes');
    cy.matchImageSnapshot('heroes-page', {
      capture: 'fullPage'
    });
  });

  it('Display "detail" page', () => {
    const heroId = MOCK_HEROES[1].id;
    cy.step('Go to "detail" page', () => cy.visit(`/detail/${heroId}`));

    const detailPageObject = new DetailPageObject();
    cy.step('Wait for loading hero detail', () => detailPageObject.waitForHeroDetailLoaded());

    cy.shouldHaveUrl(`/detail/${heroId}`);
    cy.title().should('be.eq', 'Tour of Heroes');
    cy.matchImageSnapshot('detail-page', {
      capture: 'fullPage'
    });
  });
});

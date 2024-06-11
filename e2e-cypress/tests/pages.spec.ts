import {
  DashboardPageObject,
  DetailPageObject,
  HeroesPageObject,
} from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Pages', () => {
  VIEWPORTS.forEach((viewport: Viewport) => {
    context(`${viewport} screen`, () => {
      beforeEach(() => {
        switch (viewport) {
          case 'Desktop':
          default:
            cy.desktopViewport();
            break;
          case 'Mobile':
            cy.mobileViewport();
            break;
        }
      });

      it('Display "dashboard" page', () => {
        cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

        const dashboardPageObject = new DashboardPageObject();
        cy.step('Wait for loading all heroes links', () =>
          dashboardPageObject.waitForHeroesLinksLoaded()
        );

        cy.shouldHaveUrl('/dashboard');
        cy.title().should('be.eq', 'Tour of Heroes');
        cy.toHaveSnapshot('dashboard-page', undefined, {
          capture: 'fullPage',
        });
      });

      it('Display "heroes" page', () => {
        cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

        const heroesPageObject = new HeroesPageObject();
        cy.step('Wait for loading all heroes items', () =>
          heroesPageObject.waitForHeroesItemsLoaded()
        );

        cy.shouldHaveUrl('/heroes');
        cy.title().should('be.eq', 'Tour of Heroes');
        cy.toHaveSnapshot('heroes-page', undefined, {
          capture: 'fullPage',
        });
      });

      it('Display "detail" page', () => {
        const heroId = MOCK_HEROES[1].id;
        cy.step('Go to "detail" page', () => cy.visit(`/detail/${heroId}`));

        const detailPageObject = new DetailPageObject();
        cy.step('Wait for loading hero detail', () =>
          detailPageObject.waitForHeroDetailLoaded()
        );

        cy.shouldHaveUrl(`/detail/${heroId}`);
        cy.title().should('be.eq', 'Tour of Heroes');
        cy.toHaveSnapshot('detail-page', undefined, {
          capture: 'fullPage',
        });
      });
    });
  });
});

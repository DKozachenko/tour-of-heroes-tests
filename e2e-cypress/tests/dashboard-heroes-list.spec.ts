import { DashboardPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Dashboard Heroes List', () => {
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

      describe('Layout', () => {
        it('Contain heroes list including 4 links with hero names and hero id as href attribute', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          const displayedHeroes = MOCK_HEROES.slice(1, 5);
          dashboardPageObject.heroesMenu.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          cy.toHaveSnapshot('heroes-menu', dashboardPageObject.heroesMenu);
          dashboardPageObject.heroLinks.should(
            'have.length',
            displayedHeroes.length
          );

          dashboardPageObject.heroLinks.each((link, i) => {
            const heroLink = cy.wrap(link);
            const hero = displayedHeroes[i];

            heroLink.should('contain.text', hero.name);
            heroLink.should('have.attr', 'href', `/detail/${hero.id}`);
            cy.toHaveSnapshot(`hero-link #${i + 1}`, heroLink);
          });
        });

        xit('Highlight by black color hero links while hover', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          dashboardPageObject.heroLinks.each((link, i) => {
            const heroLink = cy.wrap(link);

            cy.step(`Hover on link #${i + 1}`, () =>
              heroLink.trigger('mouseenter')
            );

            heroLink.should('have.css', 'background-color', 'rgb(0, 0, 0)');
            heroLink.should('have.css', `hero-link-hover #${i + 1}`);
            cy.toHaveSnapshot(`hero-link-hover #${i + 1}`, heroLink);
          });
        });
      });

      describe('Functional', () => {
        it('Navigate to /detail:id route if hero link in hero list has clicked', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          const heroIndex = 2;
          const hero = MOCK_HEROES.slice(1, 5)[heroIndex];

          const heroLink = dashboardPageObject.heroLinks.eq(heroIndex);
          const heroLinkCopy = dashboardPageObject.heroLinks.eq(heroIndex);

          heroLink.invoke('attr', 'href').then((href: string | undefined) => {
            cy.step(`Click on hero list item #${heroIndex + 1}`, () =>
              // For some reason, a non-copy of an element turns into null
              heroLinkCopy.click()
            );

            cy.wrap(href).should('be.eq', `/detail/${hero.id}`);
            cy.shouldHaveUrl(href ?? '');
          });
        });
      });
    });
  });
});

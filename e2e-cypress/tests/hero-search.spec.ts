import { DashboardPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Hero Search', () => {
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
        it('Contain label and input', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          dashboardPageObject.searchComponentWrapper.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          dashboardPageObject.searchLabel.should('have.text', 'Hero Search');
          dashboardPageObject.searchInput.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          cy.toHaveSnapshot('hero-search', dashboardPageObject.heroSearch);
        });

        xit('Drop outline of input while hover over it', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Hover on search input', () =>
            dashboardPageObject.searchInput.trigger('mouseenter')
          );

          dashboardPageObject.searchInput.should(
            'have.css',
            'outline-style',
            'none'
          );
          cy.toHaveSnapshot(
            'hero-search-hover',
            dashboardPageObject.heroSearch
          );
        });

        it('Change outline of input while focus on it', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Focus on search input', () =>
            dashboardPageObject.searchInput.focus()
          );

          dashboardPageObject.searchInput.should(
            'have.css',
            'outline-color',
            'rgb(51, 102, 153)'
          );
          cy.toHaveSnapshot(
            'hero-search-focus',
            dashboardPageObject.heroSearch
          );
        });

        it('Contain search results', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const testInputValue = 'b';
          cy.step(`Fill search input with value: ${testInputValue}`, () =>
            dashboardPageObject.searchInput.type(testInputValue)
          );

          cy.step('Wait for visibility search results', () =>
            dashboardPageObject.waitForSearchLinksVisible()
          );
          cy.toHaveSnapshot(
            'hero-search-results',
            dashboardPageObject.heroSearch
          );
        });

        xit('Highlight by dark color search link while hover', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const testInputValue = 'b';
          cy.step(`Fill search input with value: ${testInputValue}`, () =>
            dashboardPageObject.searchInput.type(testInputValue)
          );

          cy.step('Wait for visibility search results', () =>
            dashboardPageObject.waitForSearchLinksVisible()
          );
          const firstSearchLink = dashboardPageObject.searchLinks.first();

          cy.step('Hover on 1 link', () =>
            firstSearchLink.trigger('mouseenter')
          );

          firstSearchLink.should(
            'have.css',
            'background-color',
            'rgb(67, 90, 96)'
          );
          cy.toHaveSnapshot('hero-search-link-hover', firstSearchLink);
        });
      });

      describe('Functional', () => {
        it('Contain empty result list at start', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          dashboardPageObject.searchResult.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          dashboardPageObject.searchLinks.should('have.length', 0);
        });

        it('Contain empty result list if less than 300ms has passed', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const testInputValue = 'test value';
          cy.step(`Fill search input with value: ${testInputValue}`, () =>
            dashboardPageObject.searchInput.type(testInputValue)
          );
          dashboardPageObject.searchLinks.should('have.length', 0);
        });

        it('Contain same result list if new input value is the same as previous (more than 300ms has passed)', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const oldSearchValue = 'bom';
          const newSearchValue = 'b';
          cy.step(`Fill search input with value: ${oldSearchValue}`, () =>
            dashboardPageObject.searchInput.type(oldSearchValue)
          );
          cy.step('Wait for visibility search results', () =>
            dashboardPageObject.waitForSearchLinksVisible()
          );

          dashboardPageObject.searchLinks
            .its('length')
            .then((length: number) => {
              cy.step(`Fill search input with value: ${newSearchValue}`, () =>
                dashboardPageObject.searchInput.type(newSearchValue)
              );
              cy.step(`Fill search input with value: ${oldSearchValue}`, () =>
                dashboardPageObject.searchInput.type(oldSearchValue)
              );
              cy.step('Wait for visibility search results', () =>
                dashboardPageObject.waitForSearchLinksVisible()
              );

              dashboardPageObject.searchLinks.should('have.length', length);
            });
        });

        it('Contain empty result list if input string is empty string or contains only whitespace', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const emptyString = '';
          const onlyWhitespace = '        ';
          cy.step(`Fill search input with value: ${emptyString}`, () =>
            // https://github.com/cypress-io/cypress/issues/3587#issuecomment-572293406
            dashboardPageObject.searchInput.clear()
          );
          cy.step('Wait for getting values', () => cy.wait(1000));

          dashboardPageObject.searchLinks.should('have.length', 0);

          cy.step(`Fill search input with value: ${onlyWhitespace}`, () =>
            dashboardPageObject.searchInput.type(onlyWhitespace)
          );
          cy.step('Wait for getting values', () => cy.wait(1000));

          dashboardPageObject.searchLinks.should('have.length', 0);
        });

        it('Contain result list with suitable items if input string appears in heroes names', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          const testInputValue = 'b';
          const displayedHeroes = MOCK_HEROES.filter((hero) =>
            hero.name.includes(testInputValue)
          );
          cy.step(`Fill search input with value: ${testInputValue}`, () =>
            dashboardPageObject.searchInput.type(testInputValue)
          );
          cy.step('Wait for visibility search results', () =>
            dashboardPageObject.waitForSearchLinksVisible()
          );

          dashboardPageObject.searchLinks.should(
            'have.length',
            displayedHeroes.length
          );
          dashboardPageObject.searchLinks.each((link, i) => {
            const heroLink = cy.wrap(link);
            const hero = displayedHeroes[i];

            heroLink.should('contain.text', hero.name);
            heroLink.should('have.attr', 'href', `/detail/${hero.id}`);
          });
        });
      });
    });
  });
});

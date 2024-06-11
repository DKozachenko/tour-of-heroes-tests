import {
  AppPageObject,
  DashboardPageObject,
  DetailPageObject,
  HeroesPageObject,
} from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Messages', () => {
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
        it('Contain red heading, clear button and first message about fetching heroes', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const appPageObject = new AppPageObject();
          const dashboardPageObject = new DashboardPageObject();

          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          appPageObject.messagesWrapper.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          appPageObject.messagesHeading.should('contain.text', 'Messages');
          appPageObject.messagesHeading.should(
            'have.css',
            'color',
            'rgb(168, 0, 0)'
          );
          appPageObject.messagesClearButton.should(
            'contain.text',
            'Clear messages'
          );
          cy.toHaveSnapshot('clear-button', appPageObject.messagesClearButton);
          appPageObject.messages.should('have.length', 1);
          appPageObject.messages
            .first()
            .should('contain.text', 'HeroService: fetched heroes');
          cy.toHaveSnapshot('messages', appPageObject.messagesComponent);
        });

        // Нет возможности протестить hover состояние
        // https://github.com/cypress-io/cypress/issues/10
        xit('Change background color and color of clear button while hover over it', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const appPageObject = new AppPageObject();

          cy.step('Hover on clear button', () =>
            appPageObject.messagesClearButton.trigger('mouseenter')
          );

          appPageObject.messagesClearButton.should(
            'have.css',
            'color',
            'rgb(255, 255, 255)'
          );
          appPageObject.messagesClearButton.should(
            'have.css',
            'background-color',
            'rgb(66, 84, 92)'
          );
          cy.toHaveSnapshot('clear-button', appPageObject.messagesClearButton);
        });
      });

      describe('Functional', () => {
        it('Show message about fetching heroes after fetching heroes', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const appPageObject = new AppPageObject();

          appPageObject.messages.should('have.length', 0);

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          appPageObject.messages.should('have.length', 1);
          appPageObject.messages
            .first()
            .should('contain.text', 'HeroService: fetched heroes');
        });

        it('Show message about fetching hero with id after fetching hero detail', () => {
          const existedHeroId = MOCK_HEROES[0].id;
          cy.step('Go to "detail" page', () =>
            cy.visit(`/detail/${existedHeroId}`)
          );

          const appPageObject = new AppPageObject();

          appPageObject.messages.should('have.length', 0);

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          appPageObject.messages.should('have.length', 1);
          appPageObject.messages
            .first()
            .should(
              'contain.text',
              `HeroService: fetched hero id=${existedHeroId}`
            );
        });

        it('Show message about updating hero after saving hero with new data', () => {
          // Сначала нужно перейти на страницу дашборда, чтобы навигации
          // впоследствии было куда возвращаться с помощью `location.back()`
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          cy.step('Click on first hero link', () =>
            dashboardPageObject.heroLinks.first().click()
          );

          const firstDisplayedtHeroId = MOCK_HEROES[1].id;

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          const newHeroName = 'test value';
          cy.step(`Fill hero name input with value: ${newHeroName}`, () =>
            detailPageObject.heroNameInput.type(newHeroName)
          );

          cy.step('Click on "save" button', () =>
            detailPageObject.saveButton.click()
          );

          const appPageObject = new AppPageObject();
          appPageObject.messages.should('have.length', 4);
          appPageObject.messages
            .eq(2)
            .should(
              'contain.text',
              `HeroService: updated hero id=${firstDisplayedtHeroId}`
            );
        });

        it('Show message about deleting hero after hero deletion', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesdPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesdPageObject.waitForHeroesItemsLoaded()
          );

          cy.step('Click on first hero delete button', () =>
            heroesdPageObject.heroButtons.first().click()
          );

          cy.step('Wait for deleting hero', () => cy.wait(1000));

          const firsDisplayedtHeroId = MOCK_HEROES[0].id;

          const appPageObject = new AppPageObject();
          appPageObject.messages.should('have.length', 2);
          appPageObject.messages
            .last()
            .should(
              'contain.text',
              `HeroService: deleted hero id=${firsDisplayedtHeroId}`
            );
        });

        it('Do not show messages if clear button has clicked', () => {
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          const appPageObject = new AppPageObject();
          cy.step('Click on "clear" button', () =>
            appPageObject.messagesClearButton.click()
          );

          appPageObject.messagesWrapper.should('not.exist');
          appPageObject.messages.should('have.length', 0);
        });
      });
    });
  });
});

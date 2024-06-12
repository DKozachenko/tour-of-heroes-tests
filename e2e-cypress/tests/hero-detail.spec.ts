import { DashboardPageObject, DetailPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Hero Detail', () => {
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
        it('Contain heading, hero information, label, input and 2 buttons', () => {
          const hero = MOCK_HEROES[0];
          cy.step('Go to "detail" page', () => cy.visit(`/detail/${hero.id}`));

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          detailPageObject.heading.should(
            'contain.text',
            `${hero.name.toUpperCase()} Details`
          );
          detailPageObject.heroId.should('contain.text', `id: ${hero.id}`);
          detailPageObject.heroNameLabel.should('contain.text', 'Hero name:');
          detailPageObject.heroNameInput.should('have.value', hero.name);
          detailPageObject.backButton.should('contain.text', 'go back');
          detailPageObject.saveButton.should('contain.text', 'save');
          cy.toHaveSnapshot('hero-detail', detailPageObject.wrapper);
        });

        xit('Change background color of buttons while hover over it', () => {
          const hero = MOCK_HEROES[0];
          cy.step('Go to "detail" page', () => cy.visit(`/detail/${hero.id}`));

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          cy.step('Hover on "back" button', () =>
            detailPageObject.backButton.trigger('mouseenter')
          );

          detailPageObject.backButton.should(
            'have.css',
            'background-color',
            'rgb(207, 216, 220)'
          );
          cy.toHaveSnapshot('back-button-hover', detailPageObject.backButton);

          cy.step('Hover on "save" button', () =>
            detailPageObject.saveButton.trigger('mouseenter')
          );

          detailPageObject.saveButton.should(
            'have.css',
            'background-color',
            'rgb(207, 216, 220)'
          );
          cy.toHaveSnapshot('save-button-hover', detailPageObject.saveButton);
        });
      });

      describe('Functional', () => {
        it('Change heading according to input value changes', () => {
          const hero = MOCK_HEROES[0];
          cy.step('Go to "detail" page', () => cy.visit(`/detail/${hero.id}`));

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          const inputValue1 = 'new name';
          cy.step(`Fill hero name input with value: ${inputValue1}`, () =>
            detailPageObject.heroNameInput.type(inputValue1)
          );

          detailPageObject.heading.should(
            'contain.text',
            `${inputValue1.toUpperCase()} Details`
          );

          const inputValue2 = 'test';
          cy.step(`Fill hero name input with value: ${inputValue2}`, () =>
            detailPageObject.heroNameInput.type(inputValue2)
          );
        });

        it('Navigate to "dashboard" page if "back" button has clicked', () => {
          // First you need to go to the dashboard page so that navigation
          // later has somewhere to return using `location.back()`
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          cy.step('Click on first hero link', () =>
            dashboardPageObject.heroLinks.first().click()
          );

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          cy.step('Click on "back" button', () =>
            detailPageObject.backButton.click()
          );

          cy.shouldHaveUrl('dashboard');
        });

        it('Navigate to "dashboard" page if "save" button has clicked', () => {
          // First you need to go to the dashboard page so that navigation
          // later has somewhere to return using `location.back()`
          cy.step('Go to "dashboard" page', () => cy.visit('/dashboard'));

          const dashboardPageObject = new DashboardPageObject();
          cy.step('Wait for loading all heroes links', () =>
            dashboardPageObject.waitForHeroesLinksLoaded()
          );

          cy.step('Click on first hero link', () =>
            dashboardPageObject.heroLinks.first().click()
          );

          const detailPageObject = new DetailPageObject();
          cy.step('Wait for loading hero detail', () =>
            detailPageObject.waitForHeroDetailLoaded()
          );

          cy.step('Click on "back" button', () =>
            detailPageObject.saveButton.click()
          );

          cy.shouldHaveUrl('dashboard');
        });
      });
    });
  });
});

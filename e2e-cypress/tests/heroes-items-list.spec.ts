import { HeroesPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';
import { VIEWPORTS, Viewport } from '../types';

describe('Heroes Items List', () => {
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
        it('Contain heading, create section, heroes list of items with links with hero names and hero id as href attribute', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const displayedHeroes = [...MOCK_HEROES];
          heroesPageObject.heading.should('contain.text', 'My Heroes');
          heroesPageObject.createDiv.then(($el) => {
            Cypress.dom.isAttached($el);
          });
          cy.toHaveSnapshot('create-section', heroesPageObject.createDiv);
          heroesPageObject.heroItems.should(
            'have.length',
            displayedHeroes.length
          );

          heroesPageObject.heroLinks.each((link, i) => {
            const heroLink = cy.wrap(link);
            const hero = displayedHeroes[i];

            heroLink.should('contain.text', `${hero.id} ${hero.name}`);
            heroLink.should('have.attr', 'href', `/detail/${hero.id}`);
            cy.toHaveSnapshot(`hero-link #${i + 1}`, heroLink);
          });
        });

        xit('Change background color and color of add button while hover over it', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();

          cy.step('Hover on add button', () =>
            heroesPageObject.addButton.trigger('mouseenter')
          );

          heroesPageObject.addButton.should(
            'have.css',
            'color',
            'rgb(255, 255, 255)'
          );
          heroesPageObject.addButton.should(
            'have.css',
            'background-color',
            'rgb(66, 84, 92)'
          );
          cy.toHaveSnapshot('add-button-hover', heroesPageObject.addButton);
        });

        xit('Change background color of link and item indent while hover over it', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const firstHeroItem = heroesPageObject.heroItems.first();
          const firstHeroLink = heroesPageObject.heroLinks.first();

          cy.step('Hover on first hero item', () =>
            firstHeroItem.trigger('mouseenter')
          );

          firstHeroItem.should('have.css', 'left', '1.6px');
          firstHeroLink.should('have.css', 'color', 'rgb(44, 58, 65)');
          firstHeroLink.should(
            'have.css',
            'background-color',
            'rgb(230, 230, 230)'
          );
          cy.toHaveSnapshot('hero-item-hover', firstHeroItem);
        });

        xit('Change background color and color of delete button of hero item while hover over it', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const firstHeroButton = heroesPageObject.heroButtons.first();
          cy.step('Hover on first hero delete button', () =>
            firstHeroButton.trigger('mouseenter')
          );

          firstHeroButton.should('have.css', 'color', 'rgb(255, 255, 255)');
          firstHeroButton.should(
            'have.css',
            'background-color',
            'rgb(82, 82, 82)'
          );
          cy.toHaveSnapshot('delete-hero-button-hover', firstHeroButton);
        });
      });

      describe('Functional', () => {
        it('Add new hero with typed name', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const newHeroName = 'test name';

          cy.step(`Fill add input with value: ${newHeroName}`, () =>
            heroesPageObject.createInput.type(newHeroName)
          );

          cy.step('Click on add button', () =>
            heroesPageObject.addButton.click()
          );

          cy.step('Wait for adding new item', () => cy.wait(1000));

          heroesPageObject.heroItems.should(
            'have.length',
            MOCK_HEROES.length + 1
          );
          heroesPageObject.heroLinks
            .last()
            .should(
              'contain.text',
              `${MOCK_HEROES[MOCK_HEROES.length - 1].id + 1} ${newHeroName}`
            );
        });

        it('Delete chosen hero', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const deletedHeroIndex = 4;
          const deletedHero = MOCK_HEROES[deletedHeroIndex];

          cy.step('Click on delete hero button', () =>
            heroesPageObject.heroButtons.eq(deletedHeroIndex).click()
          );

          heroesPageObject.heroItems.should(
            'have.length',
            MOCK_HEROES.length - 1
          );

          let isDeletedHeroInList = false;
          heroesPageObject.heroLinks.each((link, i) => {
            const heroLink = cy.wrap(link);

            heroLink.invoke('text').then((text: string) => {
              isDeletedHeroInList = text.includes(deletedHero.name);
            });
          });
          cy.wrap(isDeletedHeroInList).should('be.false');
        });

        it('Navigate to /detail:id route if hero item in hero list has clicked', () => {
          cy.step('Go to "heroes" page', () => cy.visit('/heroes'));

          const heroesPageObject = new HeroesPageObject();
          cy.step('Wait for loading all heroes items', () =>
            heroesPageObject.waitForHeroesItemsLoaded()
          );

          const hero = MOCK_HEROES[0];

          const firstHeroItem = heroesPageObject.heroItems.first();
          const firstHeroLink = heroesPageObject.heroLinks.first();
          firstHeroLink
            .invoke('attr', 'href')
            .then((href: string | undefined) => {
              cy.step('Click on first hero item', () => firstHeroItem.click());

              cy.wrap(href).should('be.eq', `/detail/${hero.id}`);
              cy.shouldHaveUrl(href ?? '');
            });
        });
      });
    });
  });
});

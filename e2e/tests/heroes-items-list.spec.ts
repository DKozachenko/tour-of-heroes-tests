import { test, expect } from '@playwright/test';
import { HeroesPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

test.describe('Heroes Items List', () => {
  test.describe('Layout', async () => {
    test('Contain heading, create section, heroes list of items with links with hero names and hero id as href attribute', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const displayedHeroes = [...MOCK_HEROES];
      await expect(heroesPageObject.heading).toHaveText('My Heroes');
      await expect(heroesPageObject.createDiv).toBeAttached();
      await expect(heroesPageObject.createDiv).toHaveScreenshot(
        'create-section'
      );
      await expect(heroesPageObject.heroItems).toHaveCount(
        displayedHeroes.length
      );

      const heroLinksAll = await heroesPageObject.heroLinks.all();
      for (let i = 0; i < heroLinksAll.length; ++i) {
        const heroLink = heroLinksAll[i];
        const hero = displayedHeroes[i];

        await expect(heroLink).toContainText(`${hero.id} ${hero.name}`);
        await expect(heroLink).toHaveAttribute('href', `/detail/${hero.id}`);
        await expect(heroLink).toHaveScreenshot(`hero-link #${i + 1}`);
      }
    });

    test('Change background color and color of add button while hover over it', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);

      await test.step('Hover on add button', async () =>
        await heroesPageObject.addButton.hover());

      await expect(heroesPageObject.addButton).toHaveCSS(
        'color',
        'rgb(255, 255, 255)'
      );
      await expect(heroesPageObject.addButton).toHaveCSS(
        'background-color',
        'rgb(66, 84, 92)'
      );
      await expect(heroesPageObject.addButton).toHaveScreenshot(
        'add-button-hover'
      );
    });

    test('Change background color of link and item indent while hover over it', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const firstHeroItem = heroesPageObject.heroItems.first();
      const firstHeroLink = heroesPageObject.heroLinks.first();

      await test.step('Hover on first hero item', async () =>
        await firstHeroItem.hover());

      await expect(firstHeroItem).toHaveCSS('left', '1.6px');
      await expect(firstHeroLink).toHaveCSS('color', 'rgb(44, 58, 65)');
      await expect(firstHeroLink).toHaveCSS(
        'background-color',
        'rgb(230, 230, 230)'
      );
      await expect(firstHeroItem).toHaveScreenshot('hero-item-hover');
    });

    test('Change background color and color of delete button of hero item while hover over it', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const firstHeroButton = heroesPageObject.heroButtons.first();
      await test.step('Hover on first hero delete button', async () =>
        await firstHeroButton.hover());

      await expect(firstHeroButton).toHaveCSS('color', 'rgb(255, 255, 255)');
      await expect(firstHeroButton).toHaveCSS(
        'background-color',
        'rgb(82, 82, 82)'
      );
      await expect(firstHeroButton).toHaveScreenshot(
        'delete-hero-button-hover'
      );
    });
  });

  test.describe('Functional', async () => {
    test('Add new hero with typed name', async ({ page }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const newHeroName = 'test name';

      await test.step(`Fill add input with value: ${newHeroName}`, async () =>
        await heroesPageObject.createInput.fill(newHeroName));

      await test.step('Click on add button', async () =>
        await heroesPageObject.addButton.click());

      await test.step('Wait for adding new item', async () =>
        await page.waitForTimeout(1000));

      expect(heroesPageObject.heroItems).toHaveCount(MOCK_HEROES.length + 1);
      expect(heroesPageObject.heroLinks.last()).toContainText(
        `${MOCK_HEROES[MOCK_HEROES.length - 1].id + 1} ${newHeroName}`
      );
    });

    test('Delete chosen hero', async ({ page }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const deletedHeroIndex = 4;
      const deletedHero = MOCK_HEROES[deletedHeroIndex];

      await test.step('Click on delete hero button', async () =>
        await heroesPageObject.heroButtons.nth(deletedHeroIndex).click());

      await expect(heroesPageObject.heroItems).toHaveCount(
        MOCK_HEROES.length - 1
      );

      const heroLinksAll = await heroesPageObject.heroLinks.all();
      let isDeletedHeroInList = false;
      for (const heroLink of heroLinksAll) {
        const textContent = <string>await heroLink.textContent();
        isDeletedHeroInList = textContent.includes(deletedHero.name);
      }
      expect(isDeletedHeroInList).toBeFalsy();
    });

    test('Navigate to /detail:id route if hero item in hero list has clicked', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes items', async () =>
        await heroesPageObject.waitForHeroesItemsLoaded());

      const hero = MOCK_HEROES[0];

      const firstHeroItem = heroesPageObject.heroItems.first();
      const firstHeroLink = heroesPageObject.heroLinks.first();
      const heroLinkHrefAttribute =
        (await firstHeroLink.getAttribute('href')) ?? '';

      await test.step('Click on first hero item', async () =>
        await firstHeroItem.click());

      expect(heroLinkHrefAttribute).toBe(`/detail/${hero.id}`);
      await expect(page).toHaveURL(heroLinkHrefAttribute);
    });
  });
});

import { test, expect } from '@playwright/test';
import { DashboardPageObject, DetailPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

test.describe('Hero Detail', () => {
  test.describe('Layout', async () => {
    test('Contain heading, hero information, label, input and 2 buttons', async ({
      page,
    }) => {
      const hero = MOCK_HEROES[0];
      await test.step('Go to "detail" page', async () =>
        await page.goto(`/detail/${hero.id}`));

      const detailPageObject = new DetailPageObject(page);
      await test.step('Wait for loading hero detail', async () =>
        await detailPageObject.waitForHeroDetailLoaded());

      await expect(detailPageObject.heading).toHaveText(
        `${hero.name.toUpperCase()} Details`
      );
      await expect(detailPageObject.heroId).toHaveText(`id: ${hero.id}`);
      await expect(detailPageObject.heroNameLabel).toHaveText('Hero name:');
      await expect(detailPageObject.heroNameInput).toHaveValue(hero.name);
      await expect(detailPageObject.backButton).toHaveText('go back');
      await expect(detailPageObject.saveButton).toHaveText('save');
      await expect(detailPageObject.wrapper).toHaveScreenshot('hero-detail');
    });

    test('Change background color of buttons while hover over it', async ({
      page,
    }) => {
      const hero = MOCK_HEROES[0];
      await test.step('Go to "detail" page', async () =>
        await page.goto(`/detail/${hero.id}`));

      const detailPageObject = new DetailPageObject(page);
      await test.step('Wait for loading hero detail', async () =>
        await detailPageObject.waitForHeroDetailLoaded());

      await test.step('Hover on "back" button', async () =>
        await detailPageObject.backButton.hover());

      await expect(detailPageObject.backButton).toHaveCSS(
        'background-color',
        'rgb(207, 216, 220)'
      );
      await expect(detailPageObject.backButton).toHaveScreenshot(
        'back-button-hover'
      );

      await test.step('Hover on "save" button', async () =>
        await detailPageObject.saveButton.hover());

      await expect(detailPageObject.saveButton).toHaveCSS(
        'background-color',
        'rgb(207, 216, 220)'
      );
      await expect(detailPageObject.saveButton).toHaveScreenshot(
        'save-button-hover'
      );
    });
  });

  test.describe('Functional', async () => {
    test('Change heading according to input value changes', async ({
      page,
    }) => {
      const hero = MOCK_HEROES[0];
      await test.step('Go to "detail" page', async () =>
        await page.goto(`/detail/${hero.id}`));

      const detailPageObject = new DetailPageObject(page);
      await test.step('Wait for loading hero detail', async () =>
        await detailPageObject.waitForHeroDetailLoaded());

      const inputValue1 = 'new name';
      await test.step(`Fill hero name input with value: ${inputValue1}`, async () =>
        await detailPageObject.heroNameInput.fill(inputValue1));

      await expect(detailPageObject.heading).toHaveText(
        `${inputValue1.toUpperCase()} Details`
      );

      const inputValue2 = 'test';
      await test.step(`Fill hero name input with value: ${inputValue2}`, async () =>
        await detailPageObject.heroNameInput.fill(inputValue2));
    });

    test('Navigate to "dashboard" page if "back" button has clicked', async ({
      page,
    }) => {
      // Сначала нужно перейти на страницу дашборда, чтобы навигации
      // впоследствии было куда возвращаться с помощью `location.back()`
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Wait for loading all heroes links', async () =>
        await dashboardPageObject.waitForHeroesLinksLoaded());

      await test.step('Click on first hero link', async () =>
        await dashboardPageObject.heroLinks.first().click());

      const firstDisplayedtHeroId = MOCK_HEROES[1].id;

      await test.step(`Wait for navigation to "detail/${firstDisplayedtHeroId}" page`, async () =>
        await page.waitForURL(`detail/${firstDisplayedtHeroId}`));

      const detailPageObject = new DetailPageObject(page);
      await test.step('Wait for loading hero detail', async () =>
        await detailPageObject.waitForHeroDetailLoaded());

      await test.step('Click on "back" button', async () =>
        await detailPageObject.backButton.click());

      await test.step('Wait for navigation to "dashboard" page', async () =>
        await page.waitForURL('dashboard'));

      await expect(page).toHaveURL('dashboard');
    });

    test('Navigate to "dashboard" page if "save" button has clicked', async ({
      page,
    }) => {
      // Сначала нужно перейти на страницу дашборда, чтобы навигации
      // впоследствии было куда возвращаться с помощью `location.back()`
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Wait for loading all heroes links', async () =>
        await dashboardPageObject.waitForHeroesLinksLoaded());

      await test.step('Click on first hero link', async () =>
        await dashboardPageObject.heroLinks.first().click());

      const firstDisplayedtHeroId = MOCK_HEROES[1].id;

      await test.step(`Wait for navigation to "detail/${firstDisplayedtHeroId}" page`, async () =>
        await page.waitForURL(`detail/${firstDisplayedtHeroId}`));

      const detailPageObject = new DetailPageObject(page);
      await test.step('Wait for loading hero detail', async () =>
        await detailPageObject.waitForHeroDetailLoaded());

      await test.step('Click on "back" button', async () =>
        await detailPageObject.saveButton.click());

      await test.step('Wait for navigation to "dashboard" page', async () =>
        await page.waitForURL('dashboard'));

      await expect(page).toHaveURL('dashboard');
    });
  });
});

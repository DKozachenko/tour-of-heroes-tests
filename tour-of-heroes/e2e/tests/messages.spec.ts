import { test, expect } from '@playwright/test';
import {
  AppPageObject,
  DashboardPageObject,
  DetailsPageObject,
  HeroesPageObject,
} from '../page-objects';
import {
  waitForHeroDetailsLoaded,
  waitForHeroesItemsLoaded,
  waitForHeroesLinksLoaded,
} from '../helpers';
import { MOCK_HEROES } from '../mocks';

test.describe('Messages', () => {
  test.describe('Layout', async () => {
    test('Contain red heading, clear button and first message about fetching heroes', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const appPageObject = new AppPageObject(page);
      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Wait for loading all heroes', async () =>
        await waitForHeroesLinksLoaded(dashboardPageObject));

      await expect(appPageObject.messagesWrapper).toBeAttached();
      await expect(appPageObject.messagesHeading).toHaveText('Messages');
      await expect(appPageObject.messagesHeading).toHaveCSS(
        'color',
        'rgb(168, 0, 0)'
      );
      await expect(appPageObject.messagesClearButton).toHaveText(
        'Clear messages'
      );
      await expect(appPageObject.messagesClearButton).toHaveScreenshot(
        'clear-button'
      );

      await expect(appPageObject.messages).toHaveCount(1);
      await expect(appPageObject.messages.first()).toHaveText(
        'HeroService: fetched heroes'
      );
      await expect(appPageObject.messagesComponent).toHaveScreenshot(
        'messages'
      );
    });

    test('Change background color and color of clear button while hover over it', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const appPageObject = new AppPageObject(page);

      await test.step('Hover on clear button', async () =>
        await appPageObject.messagesClearButton.hover());

      await expect(appPageObject.messagesClearButton).toHaveCSS(
        'color',
        'rgb(255, 255, 255)'
      );
      await expect(appPageObject.messagesClearButton).toHaveCSS(
        'background-color',
        'rgb(66, 84, 92)'
      );
      await expect(appPageObject.messagesClearButton).toHaveScreenshot(
        'clear-button-hover'
      );
    });
  });

  test.describe('Functional', async () => {
    test('Show message about fetching heroes after fetching heroes', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const appPageObject = new AppPageObject(page);

      await expect(appPageObject.messages).toHaveCount(0);

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Wait for loading all heroes', async () =>
        await waitForHeroesLinksLoaded(dashboardPageObject));

      await expect(appPageObject.messages).toHaveCount(1);
      await expect(appPageObject.messages.first()).toHaveText(
        'HeroService: fetched heroes'
      );
    });

    test('Show message about fetching hero with id after fetching hero detail', async ({
      page,
    }) => {
      const existedHeroId = MOCK_HEROES[0].id;
      await test.step('Go to "detail" page', async () =>
        await page.goto(`/detail/${existedHeroId}`));

      const appPageObject = new AppPageObject(page);

      await expect(appPageObject.messages).toHaveCount(0);

      const detailsPageObject = new DetailsPageObject(page);
      await test.step('Wait for loading hero details', async () =>
        await waitForHeroDetailsLoaded(detailsPageObject));

      await expect(appPageObject.messages).toHaveCount(1);
      await expect(appPageObject.messages.first()).toHaveText(
        `HeroService: fetched hero id=${existedHeroId}`
      );
    });

    test('Show message about updating hero after saving hero with new data', async ({
      page,
    }) => {
      // Сначала нужно перейти на страницу дашборда, чтобы навигации
      // впоследствии было куда возвращаться с помощью `location.back()`
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Wait for loading all heroes', async () =>
        await waitForHeroesLinksLoaded(dashboardPageObject));

      await test.step('Click on first hero link', async () =>
        await dashboardPageObject.heroLinks.first().click());

      const firstDisplayedtHeroId = MOCK_HEROES[1].id;

      await test.step(`Wait for navigation to "detail/${firstDisplayedtHeroId}" page`, async () =>
        await page.waitForURL(`detail/${firstDisplayedtHeroId}`));

      const detailsPageObject = new DetailsPageObject(page);
      await test.step('Wait for loading hero details', async () =>
        await waitForHeroDetailsLoaded(detailsPageObject));

      const newHeroName = 'test value';
      await test.step(`Fill hero name input with value: ${newHeroName}`, async () =>
        await detailsPageObject.heroNameInput.fill(newHeroName));

      await test.step('Click on "save" button', async () =>
        await detailsPageObject.saveButton.click());

      await test.step('Wait for navigation to "dashboard" page', async () =>
        await page.waitForURL('dashboard'));

      const appPageObject = new AppPageObject(page);
      await expect(appPageObject.messages).toHaveCount(4);
      await expect(appPageObject.messages.nth(2)).toHaveText(
        `HeroService: updated hero id=${firstDisplayedtHeroId}`
      );
    });

    test('Show message about deleting hero after hero deletion', async ({
      page,
    }) => {
      await test.step('Go to "heroes" page', async () =>
        await page.goto('/heroes'));

      const heroesdPageObject = new HeroesPageObject(page);
      await test.step('Wait for loading all heroes', async () =>
        await waitForHeroesItemsLoaded(heroesdPageObject));

      await test.step('Click on first hero delete button', async () =>
        await heroesdPageObject.heroButtons.first().click());

      await test.step('Wait for deleting hero', async () =>
        await page.waitForTimeout(1000));

      const firsDisplayedtHeroId = MOCK_HEROES[0].id;

      const appPageObject = new AppPageObject(page);
      await expect(appPageObject.messages).toHaveCount(2);
      await expect(appPageObject.messages.last()).toHaveText(
        `HeroService: deleted hero id=${firsDisplayedtHeroId}`
      );
    });

    test('Do not show messages if clear button has clicked', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboarddPageObject = new DashboardPageObject(page);
      // TODO: го запихаем эти хелперы в PO
      await test.step('Wait for loading all heroes', async () =>
        await waitForHeroesLinksLoaded(dashboarddPageObject));

      const appPageObject = new AppPageObject(page);
      await test.step('Click on "clear" button', async () =>
        await appPageObject.messagesClearButton.click());

      await expect(appPageObject.messagesWrapper).not.toBeAttached();
      await expect(appPageObject.messages).toHaveCount(0);
    });
  });
});
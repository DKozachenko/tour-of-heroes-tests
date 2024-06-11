import { test, expect } from '@playwright/test';
import { DashboardPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

test.describe('Hero Search', () => {
  test.describe('Layout', async () => {
    test('Contain label and input', async ({ page }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await expect(dashboardPageObject.searchComponentWrapper).toBeAttached();
      await expect(dashboardPageObject.searchLabel).toHaveText('Hero Search');
      await expect(dashboardPageObject.searchInput).toBeAttached();
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search'
      );
    });

    test('Drop outline of input while hover over it', async ({ page }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Hover on search input', async () =>
        await dashboardPageObject.searchInput.hover());

      await expect(dashboardPageObject.searchInput).toHaveCSS(
        'outline-style',
        'none'
      );
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-hover'
      );
    });

    test('Change outline of input while focus on it', async ({ page }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Focus on search input', async () =>
        await dashboardPageObject.searchInput.focus());

      await expect(dashboardPageObject.searchInput).toHaveCSS(
        'outline-color',
        'rgb(51, 102, 153)'
      );
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-focus'
      );
    });

    test('Contain search results', async ({ page }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      await test.step(`Fill search input with value: ${testInputValue}`, async () =>
        await dashboardPageObject.searchInput.fill(testInputValue));

      await test.step('Wait for visibility search results', async () =>
        await dashboardPageObject.waitForSearchLinksVisible());
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-results'
      );
    });

    test('Highlight by dark color search link while hover', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      await test.step(`Fill search input with value: ${testInputValue}`, async () =>
        await dashboardPageObject.searchInput.fill(testInputValue));

      await test.step('Wait for visibility search results', async () =>
        await dashboardPageObject.waitForSearchLinksVisible());
      const firstSearchLink = dashboardPageObject.searchLinks.first();

      test.step('Hover on 1 link', async () => await firstSearchLink.hover());

      await expect(firstSearchLink).toHaveCSS(
        'background-color',
        'rgb(67, 90, 96)'
      );
      await expect(firstSearchLink).toHaveScreenshot('hero-search-link-hover');
    });
  });

  test.describe('Functional', async () => {
    test('Contain empty result list at start', async ({ page }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      await expect(dashboardPageObject.searchResult).toBeAttached();
      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain empty result list if less than 300ms has passed', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'test value';
      await test.step(`Fill search input with value: ${testInputValue}`, async () =>
        await dashboardPageObject.searchInput.fill(testInputValue));
      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain same result list if new input value is the same as previous (more than 300ms has passed)', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const oldSearchValue = 'bom';
      const newSearchValue = 'b';
      await test.step(`Fill search input with value: ${oldSearchValue}`, async () =>
        await dashboardPageObject.searchInput.fill(oldSearchValue));
      await test.step('Wait for visibility search results', async () =>
        await dashboardPageObject.waitForSearchLinksVisible());

      const oldResultElementsCount =
        await dashboardPageObject.searchLinks.count();
      await test.step(`Fill search input with value: ${newSearchValue}`, async () =>
        await dashboardPageObject.searchInput.fill(newSearchValue));
      await test.step(`Fill search input with value: ${oldSearchValue}`, async () =>
        await dashboardPageObject.searchInput.fill(oldSearchValue));
      await test.step('Wait for visibility search results', async () =>
        await dashboardPageObject.waitForSearchLinksVisible());

      await expect(dashboardPageObject.searchLinks).toHaveCount(
        oldResultElementsCount
      );
    });

    test('Contain empty result list if input string is empty string or contains only whitespace', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const emptyString = '';
      const onlyWhitespace = '        ';
      await test.step(`Fill search input with value: ${emptyString}`, async () =>
        await dashboardPageObject.searchInput.fill(emptyString));
      await test.step('Wait for getting values', async () =>
        await page.waitForTimeout(1000));

      await expect(dashboardPageObject.searchLinks).toHaveCount(0);

      await test.step(`Fill search input with value: ${onlyWhitespace}`, async () =>
        await dashboardPageObject.searchInput.fill(onlyWhitespace));
      await test.step('Wait for getting values', async () =>
        await page.waitForTimeout(1000));

      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain result list with suitable items if input string appears in heroes names', async ({
      page,
    }) => {
      await test.step('Go to "dashboard" page', async () =>
        await page.goto('/dashboard'));

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      const displayedHeroes = MOCK_HEROES.filter((hero) =>
        hero.name.includes(testInputValue)
      );
      await test.step(`Fill search input with value: ${testInputValue}`, async () =>
        await dashboardPageObject.searchInput.fill(testInputValue));
      await test.step('Wait for visibility search results', async () =>
        await dashboardPageObject.waitForSearchLinksVisible());

      await expect(dashboardPageObject.searchLinks).toHaveCount(
        displayedHeroes.length
      );
      const searchLinksAll = await dashboardPageObject.searchLinks.all();
      for (let i = 0; i < searchLinksAll.length; ++i) {
        const heroLink = searchLinksAll[i];
        const hero = displayedHeroes[i];

        await expect(heroLink).toHaveText(hero.name);
        await expect(heroLink).toHaveAttribute('href', `/detail/${hero.id}`);
      }
    });
  });
});

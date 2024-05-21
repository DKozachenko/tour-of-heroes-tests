import { test, expect } from '@playwright/test';
import { DashboardPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

async function waitForHeroesResultVisible(
  dashboardPageObject: DashboardPageObject
): Promise<void> {
  await dashboardPageObject.searchLinks.first().waitFor({
    state: 'visible',
    timeout: 1000,
  });
}

test.describe('Hero Search', () => {
  test.describe('Layout', async () => {
    test('Contain label and input', async ({ page }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await expect(dashboardPageObject.searchComponentWrapper).toBeAttached();
      await expect(dashboardPageObject.searchLabel).toHaveText('Hero Search');
      await expect(dashboardPageObject.searchInput).toBeAttached();
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search'
      );
    });

    test('Drop outline of input while hover over it', async ({ page }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Наведение на поле ввода поиска', async () => {
        await dashboardPageObject.searchInput.hover();

        // TODO: переделать на toHaveCss
        const outline = await dashboardPageObject.searchInput.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('outline')
        );
        expect(outline).toBe('rgb(0, 0, 0) none 0px');
      });

      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-hover'
      );
    });

    test('Change outline of input while focus on it', async ({ page }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await test.step('Фокус на поле ввода поиска', async () => {
        await dashboardPageObject.searchInput.focus();

        const outline = await dashboardPageObject.searchInput.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('outline')
        );
        expect(outline).toBe('rgb(51, 102, 153) auto 1px');
      });

      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-focus'
      );
    });

    test('Contain search results', async ({ page }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      await test.step(`Ввод в поле поиска значение: ${testInputValue}`, async () => {
        await dashboardPageObject.searchInput.fill(testInputValue);
      });

      await test.step('Ожидание видимости списка результатов', async () => {
        await waitForHeroesResultVisible(dashboardPageObject);
      });
      await expect(dashboardPageObject.heroSearch).toHaveScreenshot(
        'hero-search-results'
      );
    });

    test('Highlight by dark color search link while hover', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      await test.step(`Ввод в поле поиска значение: ${testInputValue}`, async () => {
        await dashboardPageObject.searchInput.fill(testInputValue);
      });

      await test.step('Ожидание видимости списка результатов', async () => {
        await waitForHeroesResultVisible(dashboardPageObject);
      });
      const firstSearchLink = dashboardPageObject.searchLinks.first();

      test.step('Наведение на 1 ссылку', async () => {
        await firstSearchLink.hover();

        const bgColor = await firstSearchLink.evaluate((el) =>
          window.getComputedStyle(el).getPropertyValue('background-color')
        );
        expect(bgColor).toBe('rgb(67, 90, 96)');
      });
      await expect(firstSearchLink).toHaveScreenshot('hero-search-link-hover');
    });
  });

  test.describe('Functional', async () => {
    test('Contain empty result list at start', async ({ page }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await expect(dashboardPageObject.searchResult).toBeAttached();
      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain empty result list if less than 300ms has passed', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'test value';
      await test.step(`Ввод в поле поиска значение: ${testInputValue}`, async () => {
        await dashboardPageObject.searchInput.fill(testInputValue);
      });
      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain same result list if new input value is the same as previous (more than 300ms has passed)', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const oldSearchValue = 'bom';
      const newSearchValue = 'b';
      await test.step(`Ввод в поле поиска значение: ${oldSearchValue}`, async () => {
        await dashboardPageObject.searchInput.fill(oldSearchValue);
      });
      await test.step('Ожидание видимости списка результатов', async () => {
        await waitForHeroesResultVisible(dashboardPageObject);
      });
      const oldResultElementsCount =
        await dashboardPageObject.searchLinks.count();
      await test.step(`Ввод в поле поиска значение: ${newSearchValue}`, async () => {
        await dashboardPageObject.searchInput.fill(newSearchValue);
      });
      await test.step(`Ввод в поле поиска значение: ${oldSearchValue}`, async () => {
        await dashboardPageObject.searchInput.fill(oldSearchValue);
      });
      await test.step('Ожидание видимости списка результатов', async () => {
        await waitForHeroesResultVisible(dashboardPageObject);
      });

      await expect(dashboardPageObject.searchLinks).toHaveCount(
        oldResultElementsCount
      );
    });

    test('Contain empty result list if input string is empty string or contains only whitespace', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const emptyString = '';
      const onlyWhitespace = '        ';
      await test.step(`Ввод в поле поиска значение: ${emptyString}`, async () => {
        await dashboardPageObject.searchInput.fill(emptyString);
      });
      await test.step('Ожидание исполнения запроса', async () => {
        await page.waitForTimeout(1000);
      });

      await expect(dashboardPageObject.searchLinks).toHaveCount(0);

      await test.step(`Ввод в поле поиска значение: ${onlyWhitespace}`, async () => {
        await dashboardPageObject.searchInput.fill(onlyWhitespace);
      });
      await test.step('Ожидание исполнения запроса', async () => {
        await page.waitForTimeout(1000);
      });

      await expect(dashboardPageObject.searchLinks).toHaveCount(0);
    });

    test('Contain result list with suitable items if input string appears in heroes names', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      const testInputValue = 'b';
      const displayedHeroes = MOCK_HEROES.filter((hero) =>
        hero.name.includes(testInputValue)
      );
      await test.step(`Ввод в поле поиска значение: ${testInputValue}`, async () => {
        await dashboardPageObject.searchInput.fill(testInputValue);
      });
      await test.step('Ожидание видимости списка результатов', async () => {
        await waitForHeroesResultVisible(dashboardPageObject);
      });

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

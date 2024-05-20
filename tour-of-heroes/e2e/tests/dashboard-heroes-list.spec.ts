import { test, expect } from '@playwright/test';
import { DashboardPageObject } from '../page-objects';
import { MOCK_HEROES } from '../mocks';

async function waitForHeroesListLoaded(
  dashboardPageObject: DashboardPageObject
): Promise<void> {
  await test.step('Ожидание загрузки всех героев', async () => {
    await dashboardPageObject.heroLinks.first().waitFor({
      state: 'visible',
      timeout: 2000,
    });
  });
}

test.describe('Dashboard Heroes List', () => {
  test.describe('Layout', async () => {
    test('Contain heroes list including 4 links with hero names and hero id as href attribute', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await waitForHeroesListLoaded(dashboardPageObject);

      const displayedHeroes = MOCK_HEROES.slice(1, 5);
      await expect(dashboardPageObject.heroesMenu).toBeAttached();
      await expect(dashboardPageObject.heroesMenu).toHaveScreenshot(
        'heroes-menu'
      );
      await expect(dashboardPageObject.heroLinks).toHaveCount(
        displayedHeroes.length
      );

      const heroLinksAll = await dashboardPageObject.heroLinks.all();
      for (let i = 0; i < heroLinksAll.length; ++i) {
        const heroLink = heroLinksAll[i];
        const hero = displayedHeroes[i];

        await expect(heroLink).toHaveText(hero.name);
        await expect(heroLink).toHaveAttribute('href', `/detail/${hero.id}`);
        await expect(heroLink).toHaveScreenshot(`hero-link #${i + 1}`);
      }
    });

    test('Highlight by black color hero links while hover', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await waitForHeroesListLoaded(dashboardPageObject);

      const heroLinksAll = await dashboardPageObject.heroLinks.all();
      for (let i = 0; i < heroLinksAll.length; ++i) {
        const heroLink = heroLinksAll[i];

        test.step(`Наведение на ${i + 1} ссылку`, async () => {
          await heroLink.hover();

          const bgColor = await heroLink.evaluate((el) => {
            return window
              .getComputedStyle(el)
              .getPropertyValue('background-color');
          });
          expect(bgColor).toBe('rgb(0, 0, 0)');
        });

        await expect(heroLink).toHaveScreenshot(`hero-link-hover #${i + 1}`);
      }
    });
  });

  test.describe('Functional', async () => {
    test('Navigate to /detail:id route if hero link in hero list has clicked', async ({
      page,
    }) => {
      await test.step('Переход на страницу "dashboard"', async () => {
        await page.goto('/dashboard');
      });

      const dashboardPageObject = new DashboardPageObject(page);
      await waitForHeroesListLoaded(dashboardPageObject);

      const heroIndex = 2;
      const hero = MOCK_HEROES.slice(1, 5)[heroIndex];

      const heroLink = dashboardPageObject.heroLinks.nth(heroIndex);
      const heroLinkHrefAttribute = (await heroLink.getAttribute('href')) ?? '';

      await test.step(`Клик на ${
        heroIndex + 1
      } элемент списка с героями`, async () => {
        await heroLink.click();
      });

      expect(heroLinkHrefAttribute).toBe(`/detail/${hero.id}`);
      await expect(page).toHaveURL(heroLinkHrefAttribute);
    });
  });
});

import { test, expect } from '@playwright/test';
import {
  AppPageObject,
  DashboardPageObject,
  HeroesPageObject,
} from '../page-objects';
import { MOCK_HEROES } from '../mocks';

test.describe('Navigation', () => {
  // TODO: а поч комменты то на англ, то на рус
  test('Navigate to /dashboard route while initial routing', async ({
    page,
  }) => {
    await test.step('Переход на главную', async () => {
      await page.goto('/');
    });
    await expect(page).toHaveURL('/dashboard');
  });

  test('Navigate to /heroes route if heroes navigation button has clicked', async ({
    page,
  }) => {
    const appPageObject = new AppPageObject(page);

    await test.step('Переход на главную', async () => {
      await page.goto('/');
    });
    await test.step('Клик на кнопку "Heroes"', async () => {
      await appPageObject.heroesLink.click();
    });

    await expect(page).toHaveURL('/heroes');
  });

  test('Navigate to /dashboard route if dashboard navigation button has clicked', async ({
    page,
  }) => {
    const appPageObject = new AppPageObject(page);

    await test.step('Переход на страницу "heroes"', async () => {
      await page.goto('/heroes');
    });
    await test.step('Клик на кнопку "Dashboard"', async () => {
      await appPageObject.dashboardLink.click();
    });

    await expect(page).toHaveURL('/dashboard');
  });

  test('Navigate to /detail:id route if hero link in hero list has clicked', async ({
    page,
  }) => {
    await test.step('Переход на страницу "heroes"', async () => {
      await page.goto('/heroes');
    });

    const heroesPageObject = new HeroesPageObject(page);

    const heroIndex = 5;
    const hero = MOCK_HEROES[heroIndex];

    const heroItem = heroesPageObject.heroItems.nth(heroIndex);

    await test.step(`Клик на ${
      heroIndex + 1
    } элемент списка с героями`, async () => {
      await heroItem.click();
    });

    await expect(page).toHaveURL(`/detail/${hero.id}`);
  });
});

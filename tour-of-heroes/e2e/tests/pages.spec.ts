import { test, expect } from '@playwright/test';
import { DashboardPageObject, HeroesPageObject } from '../page-objects';

test.describe('Pages', () => {
  test('Display "dashboard" page', async ({ page }) => {
    await test.step('Go to "dashboard" page', async () =>
      await page.goto('/dashboard'));

    const dashboardPageObject = new DashboardPageObject(page);
    await test.step('Wait for loading all heroes links', async () =>
      await dashboardPageObject.waitForHeroesLinksLoaded());

    await expect(page).toHaveURL('/dashboard');
    await expect(page).toHaveTitle('Tour of Heroes');
    await expect(page).toHaveScreenshot('dashboard-page', { fullPage: true });
  });

  test('Display "heroes" page', async ({ page }) => {
    await test.step('Go to "heroes" page', async () =>
      await page.goto('/heroes'));

    const heroesPageObject = new HeroesPageObject(page);
    await test.step('Wait for loading all heroes items', async () =>
      await heroesPageObject.waitForHeroesItemsLoaded());

    await expect(page).toHaveURL('/heroes');
    await expect(page).toHaveTitle('Tour of Heroes');
    await expect(page).toHaveScreenshot('heroes-page', { fullPage: true });
  });
});

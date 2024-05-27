import { test, expect } from '@playwright/test';
import { DashboardPageObject, HeroesPageObject } from '../page-objects';
import { waitForHeroesItemsLoaded, waitForHeroesLinksLoaded } from '../helpers';

test.describe('Pages', () => {
  test('Display "dashboard" page', async ({ page }) => {
    await test.step('Go to "dashboard" page', async () =>
      await page.goto('/dashboard'));

    const dashboardPageObject = new DashboardPageObject(page);
    await test.step('Wait for loading all heroes', async () =>
      await waitForHeroesLinksLoaded(dashboardPageObject));

    await expect(page).toHaveURL('/dashboard');
    await expect(page).toHaveTitle('Tour of Heroes');
    await expect(page).toHaveScreenshot('dashboard-page', { fullPage: true });
  });

  test('Display "heroes" page', async ({ page }) => {
    await test.step('Go to "heroes" page', async () =>
      await page.goto('/heroes'));

    const heroesPageObject = new HeroesPageObject(page);
    await test.step('Wait for loading all heroes', async () =>
      await waitForHeroesItemsLoaded(heroesPageObject));

    await expect(page).toHaveURL('/heroes');
    await expect(page).toHaveTitle('Tour of Heroes');
    await expect(page).toHaveScreenshot('heroes-page', { fullPage: true });
  });
});

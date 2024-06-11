import { test, expect } from '@playwright/test';
import { AppPageObject } from '../page-objects';

test.describe('Navigation', () => {
  test('Navigate to /dashboard route while initial routing', async ({
    page,
  }) => {
    await test.step('Go to main page', async () => await page.goto('/'));
    await expect(page).toHaveURL('/dashboard');
  });

  test('Navigate to /heroes route if heroes navigation button has clicked', async ({
    page,
  }) => {
    const appPageObject = new AppPageObject(page);

    await test.step('Go to main page', async () => await page.goto('/'));
    await test.step('Click on "Heroes" button', async () =>
      await appPageObject.heroesLink.click());

    await expect(page).toHaveURL('/heroes');
  });

  test('Navigate to /dashboard route if dashboard navigation button has clicked', async ({
    page,
  }) => {
    const appPageObject = new AppPageObject(page);

    await test.step('Go to "heroes" page', async () =>
      await page.goto('/heroes'));
    await test.step('Click on "Dashboard" button', async () =>
      await appPageObject.dashboardLink.click());

    await expect(page).toHaveURL('/dashboard');
  });
});

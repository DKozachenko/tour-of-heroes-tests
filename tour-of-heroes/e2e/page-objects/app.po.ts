import { Locator, Page } from 'playwright/test';

export class AppPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get dashboardLink(): Locator {
    return this.page.getByTestId('dashboard-navigation-link');
  }

  get heroesLink(): Locator {
    return this.page.getByTestId('heroes-navigation-link');
  }
}

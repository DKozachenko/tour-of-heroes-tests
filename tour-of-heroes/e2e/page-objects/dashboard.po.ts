import { Locator, Page } from 'playwright/test';

export class DashboardPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get searchInput(): Locator {
    return this.page.getByTestId('search-input');
  }

  get searchLinks(): Locator {
    return this.page.getByTestId('search-link');
  }
}

import { Locator, Page } from 'playwright/test';

export class DashboardPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading(): Locator {
    return this.page.getByTestId('heading');
  }

  get heroesMenu(): Locator {
    return this.page.getByTestId('heroes-menu');
  }

  get heroLinks(): Locator {
    return this.page.getByTestId('hero-link');
  }

  get heroSearch(): Locator {
    return this.page.getByTestId('hero-search');
  }

  get searchInput(): Locator {
    return this.page.getByTestId('search-input');
  }

  get searchLinks(): Locator {
    return this.page.getByTestId('search-link');
  }
}

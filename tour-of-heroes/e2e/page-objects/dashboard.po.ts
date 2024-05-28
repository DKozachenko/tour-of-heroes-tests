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

  get searchComponentWrapper(): Locator {
    return this.page.getByTestId('search-component');
  }

  get searchLabel(): Locator {
    return this.page.getByTestId('search-label');
  }

  get searchInput(): Locator {
    return this.page.getByTestId('search-input');
  }

  get searchResult(): Locator {
    return this.page.getByTestId('search-result');
  }

  get searchLinks(): Locator {
    return this.page.getByTestId('search-link');
  }

  waitForHeroesLinksLoaded(): Promise<void> {
    return this.heroLinks.first().waitFor({
      state: 'visible',
      timeout: 5000,
    });
  }

  waitForSearchLinksVisible(): Promise<void> {
    return this.searchLinks.first().waitFor({
      state: 'visible',
      timeout: 5000,
    });
  }
}

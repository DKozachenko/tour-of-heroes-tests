import { Locator, Page } from 'playwright/test';

export class HeroesPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heroItems(): Locator {
    return this.page.getByTestId('hero-item');
  }

  get heroButtons(): Locator {
    return this.page.getByTestId('hero-button');
  }
}

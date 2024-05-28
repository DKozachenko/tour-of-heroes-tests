import { Locator, Page } from 'playwright/test';

export class DetailPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get wrapper(): Locator {
    return this.page.getByTestId('wrapper');
  }

  get heroNameInput(): Locator {
    return this.page.getByTestId('hero-name-input');
  }

  get saveButton(): Locator {
    return this.page.getByTestId('save-button');
  }

  waitForHeroDetailLoaded(): Promise<void> {
    return this.wrapper.waitFor({
      state: 'visible',
      timeout: 5000,
    });
  }
}
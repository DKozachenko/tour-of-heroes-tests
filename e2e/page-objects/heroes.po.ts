import { Locator, Page } from 'playwright/test';

export class HeroesPageObject {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get heading(): Locator {
    return this.page.getByTestId('heading');
  }

  get createDiv(): Locator {
    return this.page.getByTestId('create-div');
  }

  get createLabel(): Locator {
    return this.page.getByTestId('create-label');
  }

  get createInput(): Locator {
    return this.page.getByTestId('create-input');
  }

  get addButton(): Locator {
    return this.page.getByTestId('add-button');
  }

  get heroList(): Locator {
    return this.page.getByTestId('heroes');
  }

  get heroItems(): Locator {
    return this.page.getByTestId('hero-item');
  }

  get heroLinks(): Locator {
    return this.page.getByTestId('hero-link');
  }

  get heroButtons(): Locator {
    return this.page.getByTestId('hero-button');
  }

  waitForHeroesItemsLoaded(): Promise<void> {
    return this.heroItems.first().waitFor({
      state: 'visible',
      timeout: 5000,
    });
  }
}

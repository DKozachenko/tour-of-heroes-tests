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

  get messagesComponent(): Locator {
    return this.page.getByTestId('messages-component');
  }

  get messagesWrapper(): Locator {
    return this.page.getByTestId('messages-wrapper');
  }

  get messagesHeading(): Locator {
    return this.page.getByTestId('messages-heading');
  }

  get messagesClearButton(): Locator {
    return this.page.getByTestId('messages-clear-button');
  }

  get messages(): Locator {
    return this.page.getByTestId('message');
  }
}

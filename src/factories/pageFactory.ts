import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export function createPageObject(name: string, page: Page) {
  switch (name) {
    case 'login':
      return new LoginPage(page);
    default:
      throw new Error(`Unknown page object: ${name}`);
  }
}

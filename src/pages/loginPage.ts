import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the practice login page. Accepts an optional path override.
   */
  async goto(path = '/practice-test-login/') {
    await super.goto(path);
  }

  /**
   * Perform login using resilient label/role locators where possible.
   */
  async login(username: string, password: string) {
    // The practice site uses labels for Username / Password — prefer label-based locators
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);

    // Click the submit button; match common button text
    const submit = this.page.getByRole('button', { name: /submit|log ?in|login/i });
    await submit.click();
  }

  /**
   * Try to find a post-login indicator (text or logout link). Returns the first matching Locator or null.
   */
  async getPostLoginIndicator(): Promise<Locator | null> {
    const candidates: Locator[] = [];
    candidates.push(this.page.getByText(/logged in successfully/i));
    candidates.push(this.page.getByText(/successfully logged in/i));
    candidates.push(this.page.getByText(/welcome/i));
    candidates.push(this.page.getByRole('link', { name: /logout|log out/i }));

    for (const c of candidates) {
      try {
        if (await c.count() > 0) return c;
      } catch (e) {
        // ignore and continue
      }
    }
    return null;
  }
}

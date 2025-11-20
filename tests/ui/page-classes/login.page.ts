import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly userProfileMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('//input[@name="email"]');
    this.passwordInput = page.locator('//input[@name="password"]');
    this.loginButton = page.locator('//button[@type="submit"]');
    this.userProfileMenu = page.locator('//span[@class="UserProfileMenu_userName__2EIdh"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await this.userProfileMenu.isVisible();
  }
}

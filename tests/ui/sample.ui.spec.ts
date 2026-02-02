import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/loginPage';

test.describe('UI sample tests', () => {
  test('login to practice site with provided credentials', async ({ page, baseURL }) => {
    const login = new LoginPage(page);

    // Go to the practice site login page using configured baseURL
    await login.goto('/practice-test-login/');

    // Use credentials provided
    await login.login('student', 'Password123');

    // Check for a post-login indicator (text or logout link)
    const indicator = await login.getPostLoginIndicator();
    expect(indicator).not.toBeNull();
    if (indicator) {
      await expect(indicator).toBeVisible();
    }
  });
});

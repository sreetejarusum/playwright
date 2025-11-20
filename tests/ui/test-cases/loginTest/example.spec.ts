import { expect } from '@playwright/test';
import { test } from '../baseFixture';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('successful login using CSV data', async ({ loginPage, credentials }) => {
  // Assuming the first set of credentials from the CSV for this test
  const user = credentials[0];
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  // Add assertions here to verify successful login, e.g., checking for a dashboard element
  await loginPage.verifyLoginSuccess();
  // await expect(loginPage.userProfileMenu).toBeVisible();
});

test('successful login with another user from CSV', async ({ loginPage, credentials }) => {
  // Assuming the second set of credentials from the CSV for this test
  const user = credentials[1];
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  await expect(loginPage.userProfileMenu).toBeVisible();
});

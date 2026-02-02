import { test, expect } from '@playwright/test';

test('Verify VSkills Playwright Mock Test Page', async ({ page }) => {
    await page.goto('https://www.vskills.in/practice/playwright-mock-test-practice-questions');

    // Verify Title
    await expect(page).toHaveTitle(/Playwright Practice Questions/i);

    // Verify Heading
    await expect(page.locator('h1').first()).toContainText('Playwright Mock Test');
});

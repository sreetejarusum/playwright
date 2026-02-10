import { test, expect } from '@playwright/test';
import path from 'path';

test('shadow dom xpath piercing test', async ({ page }) => {
    const filePath = 'file://' + path.resolve('tests/fixtures/shadow-test.html');
    await page.goto(filePath);

    // Test 1: CSS (should work)
    const cssLocator = page.locator('#host #shadow-btn');
    await expect(cssLocator).toBeVisible();
    console.log('CSS locator works');

    // Test 2: XPath nested (might fail)
    const xpathLocator = page.locator('#host').locator('xpath=.//button');
    try {
        await expect(xpathLocator).toBeVisible({ timeout: 2000 });
        console.log('Nested XPath locator works');
    } catch (e) {
        console.log('Nested XPath locator failed as expected');
    }

    // Test 3: XPath direct (should fail)
    const directXpath = page.locator('xpath=//button[@id="shadow-btn"]');
    try {
        await expect(directXpath).toBeVisible({ timeout: 2000 });
        console.log('Direct XPath locator works');
    } catch (e) {
        console.log('Direct XPath locator failed as expected');
    }

    // Test 4: getByText nested (should work)
    const textLocator = page.locator('#host').getByText('Text inside shadow');
    try {
        await expect(textLocator).toBeVisible({ timeout: 2000 });
        console.log('Nested getByText works');
    } catch (e) {
        console.log('Nested getByText failed');
    }
});

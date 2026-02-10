import { test, expect, Locator } from '@playwright/test';
import { UIUtils } from '../../src/utils/uiUtils/UIUtils';
import path from 'path';

test.describe('Shadow DOM Utilities Test', () => {
    let uiUtils: UIUtils;
    const filePath = 'file://' + path.resolve('tests/fixtures/shadow-test.html');

    test.beforeEach(async ({ page }) => {
        uiUtils = new UIUtils(page);
        await page.goto(filePath);
    });

    test('should find and click element inside shadow DOM using CSS', async ({ page }) => {
        // CSS piercing is native in Playwright
        await uiUtils.clickInShadow('#host', '#shadow-btn');
        // No specific action on click in our HTML, but we just verify it doesn't throw
    });

    test('should find and click element inside shadow DOM using XPath', async ({ page }) => {
        // XPath piercing is NOT native, handled by our utility
        await uiUtils.clickInShadow('#host', 'xpath=.//button[@id="shadow-btn"]');
    });

    test('should fill input inside shadow DOM using XPath', async ({ page }) => {
        const testText = 'Hello Shadow';
        await uiUtils.fillInShadow('#host', 'xpath=.//input[@id="shadow-input"]', testText);

        // Verify value
        const val = await page.evaluate(() => {
            const host = document.querySelector('#host');
            const input = host?.shadowRoot?.querySelector('#shadow-input') as HTMLInputElement;
            return input?.value;
        });
        expect(val).toBe(testText);
    });

    test('should throw error if shadow host not found (XPath)', async () => {
        // XPath triggers immediate check via evaluateHandle
        await expect(uiUtils.findInShadow('#non-existent', 'xpath=.//button'))
            .rejects.toThrow('Failed to find element in shadow DOM');
    });

    test('should not throw on findInShadow for non-existent CSS (lazy locator)', async () => {
        // CSS returns a Locator immediately without checking existence
        const locator = await uiUtils.findInShadow('#non-existent', '#shadow-btn');
        expect(locator).toBeDefined();
        // It would only fail when we try to use it
        await expect((locator as Locator).click({ timeout: 500 }))
            .rejects.toThrow();
    });

    test('should throw error if inner element not found (XPath)', async () => {
        await expect(uiUtils.findInShadow('#host', 'xpath=.//div[@id="wrong"]'))
            .rejects.toThrow('Element "xpath=.//div[@id="wrong"]" not found in shadow DOM of "#host"');
    });
});

import { Locator, Page, expect } from '@playwright/test';

export class AssertionUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private getLocator(locator: string | Locator): Locator {
        return typeof locator === 'string' ? this.page.locator(locator) : locator;
    }

    // =========================================================================
    // Element Assertions
    // =========================================================================

    async assertVisible(locator: string | Locator) {
        await expect(this.getLocator(locator)).toBeVisible();
    }

    async assertHidden(locator: string | Locator) {
        await expect(this.getLocator(locator)).toBeHidden();
    }

    async assertEnabled(locator: string | Locator) {
        await expect(this.getLocator(locator)).toBeEnabled();
    }

    async assertDisabled(locator: string | Locator) {
        await expect(this.getLocator(locator)).toBeDisabled();
    }

    async assertText(locator: string | Locator, expected: string) {
        await expect(this.getLocator(locator)).toHaveText(expected);
    }

    async assertContainsText(locator: string | Locator, expected: string) {
        await expect(this.getLocator(locator)).toContainText(expected);
    }

    async assertAttribute(locator: string | Locator, attr: string, value: string) {
        await expect(this.getLocator(locator)).toHaveAttribute(attr, value);
    }

    // =========================================================================
    // Page Assertions
    // =========================================================================

    async assertUrl(expected: string | RegExp) {
        await expect(this.page).toHaveURL(expected);
    }

    async assertTitle(expected: string | RegExp) {
        await expect(this.page).toHaveTitle(expected);
    }

    async assertPageContainsText(text: string) {
        // Check if body (or generally page) contains text
        await expect(this.page.locator('body')).toContainText(text);
    }
}

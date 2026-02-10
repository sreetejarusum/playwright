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
        try {
            await expect(this.getLocator(locator)).toBeVisible();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not visible: ${error.message}`);
        }
    }

    async assertHidden(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeHidden();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not hidden: ${error.message}`);
        }
    }

    async assertEnabled(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeEnabled();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not enabled: ${error.message}`);
        }
    }

    async assertDisabled(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeDisabled();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not disabled: ${error.message}`);
        }
    }

    async assertText(locator: string | Locator, expected: string) {
        try {
            await expect(this.getLocator(locator)).toHaveText(expected);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not have text "${expected}": ${error.message}`);
        }
    }

    async assertContainsText(locator: string | Locator, expected: string) {
        try {
            await expect(this.getLocator(locator)).toContainText(expected);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not contain text "${expected}": ${error.message}`);
        }
    }

    async assertAttribute(locator: string | Locator, attr: string, value: string) {
        try {
            await expect(this.getLocator(locator)).toHaveAttribute(attr, value);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not have attribute "${attr}" with value "${value}": ${error.message}`);
        }
    }

    async assertChecked(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeChecked();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not checked: ${error.message}`);
        }
    }

    async assertNotChecked(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).not.toBeChecked();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is checked (expected unchecked): ${error.message}`);
        }
    }

    async assertValue(locator: string | Locator, expectedValue: string) {
        try {
            await expect(this.getLocator(locator)).toHaveValue(expectedValue);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not have value "${expectedValue}": ${error.message}`);
        }
    }

    async assertCount(locator: string | Locator, expectedCount: number) {
        try {
            await expect(this.getLocator(locator)).toHaveCount(expectedCount);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not have count ${expectedCount}: ${error.message}`);
        }
    }

    async assertEditable(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeEditable();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not editable: ${error.message}`);
        }
    }

    async assertFocused(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeFocused();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not focused: ${error.message}`);
        }
    }

    async assertClass(locator: string | Locator, expectedClass: string | RegExp) {
        try {
            await expect(this.getLocator(locator)).toHaveClass(expectedClass);
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} does not have class "${expectedClass}": ${error.message}`);
        }
    }

    async assertEmpty(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeEmpty();
        } catch (error: any) {
            throw new Error(`Assertion failed: ${locator} is not empty: ${error.message}`);
        }
    }

    // =========================================================================
    // Page Assertions
    // =========================================================================

    async assertUrl(expected: string | RegExp) {
        try {
            await expect(this.page).toHaveURL(expected);
        } catch (error: any) {
            throw new Error(`Assertion failed: URL does not match "${expected}": ${error.message}`);
        }
    }

    async assertTitle(expected: string | RegExp) {
        try {
            await expect(this.page).toHaveTitle(expected);
        } catch (error: any) {
            throw new Error(`Assertion failed: Title does not match "${expected}": ${error.message}`);
        }
    }

    async assertPageContainsText(text: string) {
        try {
            // Check if body (or generally page) contains text
            await expect(this.page.locator('body')).toContainText(text);
        } catch (error: any) {
            throw new Error(`Assertion failed: Page does not contain text "${text}": ${error.message}`);
        }
    }
}

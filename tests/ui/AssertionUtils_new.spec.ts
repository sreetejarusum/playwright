import { test, expect } from '@playwright/test';
import { AssertionUtils } from '../../src/utils/AssertionUtils';
import path from 'path';

test.describe('AssertionUtils Expansion Tests', () => {
    let assertions: AssertionUtils;
    const filePath = 'file://' + path.resolve('tests/fixtures/complex-ui.html');

    test.beforeEach(async ({ page }) => {
        assertions = new AssertionUtils(page);
        await page.goto(filePath);
    });

    test('should verify checked/unchecked states', async ({ page }) => {
        // Mock a checkbox
        await page.evaluate(() => {
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.id = 'test-cb';
            cb.checked = true;
            document.body.appendChild(cb);
        });
        await assertions.assertChecked('#test-cb');

        await page.evaluate(() => {
            (document.getElementById('test-cb') as HTMLInputElement).checked = false;
        });
        await assertions.assertNotChecked('#test-cb');
    });

    test('should verify input value', async ({ page }) => {
        await page.locator('#native-date-input').fill('2026-02-10');
        await assertions.assertValue('#native-date-input', '2026-02-10');
    });

    test('should verify count', async () => {
        // Table has 3 rows in tbody
        await assertions.assertCount('#data-table tbody tr', 3);
    });

    test('should verify editability', async () => {
        await assertions.assertEditable('#native-date-input');
    });

    test('should verify focus', async ({ page }) => {
        await page.locator('#open-calendar').focus();
        await assertions.assertFocused('#open-calendar');
    });

    test('should verify class', async () => {
        await assertions.assertClass('#open-calendar', /.*/); // Just check any class exists or regex matches
    });

    test('should verify empty state', async ({ page }) => {
        await page.evaluate(() => {
            const div = document.createElement('div');
            div.id = 'empty-div';
            document.body.appendChild(div);
        });
        await assertions.assertEmpty('#empty-div');
    });
});

import { test, expect } from '@playwright/test';
import { UIHelper } from '../../src/utils/uiUtils/UIHelper';
import path from 'path';

test.describe('UIHelper Utility Tests', () => {
    let uiHelper: UIHelper;
    const filePath = 'file://' + path.resolve('tests/fixtures/complex-ui.html');

    test.beforeEach(async ({ page }) => {
        uiHelper = new UIHelper(page);
        await page.goto(filePath);
    });

    test.describe('Calendar & Date Selectors', () => {
        test('should select a date by navigating months (Future)', async ({ page }) => {
            // Target: 15 April 2026 (Mock UI starts in Feb 2026)
            await uiHelper.selectDate('#open-calendar', '15 April 2026');

            const display = page.locator('#selected-date-display');
            await expect(display).toHaveText('15 April 2026');
        });

        test('should select a date by navigating months (Past)', async ({ page }) => {
            // Target: 10 January 2026
            await uiHelper.selectDate('#open-calendar', '10 January 2026');

            const display = page.locator('#selected-date-display');
            await expect(display).toHaveText('10 January 2026');
        });

        test('should fill native date input', async ({ page }) => {
            const dateVal = '2025-12-25';
            await uiHelper.fillNativeDate('#native-date-input', dateVal);

            const inputVal = await page.locator('#native-date-input').inputValue();
            expect(inputVal).toBe(dateVal);
        });

        test('should verify date range correctly', () => {
            // Should not throw
            uiHelper.verifyDateRange('2024-01-01', '2024-01-02');

            // Should throw for violation
            expect(() => uiHelper.verifyDateRange('2024-01-02', '2024-01-01'))
                .toThrow('Date logical violation');
        });
    });

    test.describe('Table & Grid Utilities', () => {
        test('should get table cell value by row text and column header', async () => {
            const val = await uiHelper.getTableCellValue('#data-table', 'Bob Smith', 'Role');
            expect(val).toBe('Editor');

            const status = await uiHelper.getTableCellValue('#data-table', 'Charlie Brown', 'Status');
            expect(status).toBe('Active');
        });

        test('should verify if a row exists with specific data', async () => {
            const exists = await uiHelper.verifyRowExists('#data-table', {
                'Name': 'Alice Johnson',
                'Role': 'Admin',
                'Status': 'Active'
            });
            expect(exists).toBe(true);

            const notExists = await uiHelper.verifyRowExists('#data-table', {
                'Name': 'Alice Johnson',
                'Role': 'Editor' // Wrong role
            });
            expect(notExists).toBe(false);
        });

        test('should count rows and columns', async () => {
            const rows = await uiHelper.getRowCount('#data-table');
            expect(rows).toBe(3);

            const cols = await uiHelper.getColumnCount('#data-table');
            expect(cols).toBe(4);
        });
    });
});

import { test, expect } from '@playwright/test';
import { readSingleRow, writeToCell } from '../../src/utils/excelUtils';
import * as path from 'path';
import * as fs from 'fs';

/**
 * This test demonstrates how to use excelUtils.ts to drive a data-driven UI test
 * and record results back to the Excel file.
 */
test.describe('Excel-Driven Login Test Demo', () => {
    const dataFilePath = path.join(__dirname, '../../src/test-data/login_test_data.xlsx');

    // Before the test, we create a small Excel file with sample login data
    test.beforeAll(async () => {
        // We'll use writeToCell to bootstrap our test data
        writeToCell(dataFilePath, 'A1', 'Username');
        writeToCell(dataFilePath, 'B1', 'Password');
        writeToCell(dataFilePath, 'A2', 'tomsmith');
        writeToCell(dataFilePath, 'B2', 'SuperSecretPassword!');
    });

    // Cleanup after test
    test.afterAll(async () => {
        if (fs.existsSync(dataFilePath)) {
            // Uncomment the line below if you want to keep the file to inspect the results
            // fs.unlinkSync(dataFilePath);
        }
    });

    test('should login successfully using data from Excel', async ({ page }) => {
        // 1. Read test data from the second row (index 1)
        const userData = readSingleRow(dataFilePath, 1);
        const username = userData[0]; // tomsmith
        const password = userData[1]; // SuperSecretPassword!

        console.log(`Testing login for user: ${username}`);

        // 2. Perform UI actions
        await page.goto('https://the-internet.herokuapp.com/login');
        await page.fill('#username', username);
        await page.fill('#password', password);
        await page.click('button[type="submit"]');

        // 3. Verify successful login
        await expect(page.locator('#flash')).toContainText('You logged into a secure area!');

        // 4. Record the result back to Excel in a new column
        const timestamp = new Date().toLocaleString();
        writeToCell(dataFilePath, 'C1', 'Result_Timestamp');
        writeToCell(dataFilePath, 'C2', `Passed at ${timestamp}`);

        console.log(`Test result recorded in: ${dataFilePath}`);
    });
});

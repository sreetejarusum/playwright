import { test, expect } from '@playwright/test';
import { DateUtils } from '../../src/utils/DateUtils';

/**
 * This test demonstrates how to use DateUtils.ts in real UI automation scenarios.
 */
test.describe('DateUtils Usage Demo', () => {

    test('should use DateUtils for search and screenshot naming', async ({ page }) => {

        const fromDate = DateUtils.getFutureDate(2, 'YYYY-MM-DD'); // 2 days from now
        const toDate = DateUtils.getFutureDate(5, 'YYYY-MM-DD'); // 5 days from now

        console.log(`Searching for stay: ${fromDate} to ${toDate}`);

        // Simple demo site interaction (using Google search as a placeholder for navigation + date input demo)
        await page.goto('https://www.google.com');

        // Let's pretend we are typing dates into some inputs
        const searchBox = page.locator('textarea[name="q"]');
        await searchBox.fill(`From: ${fromDate}, To: ${toDate}`);
        await page.keyboard.press('Enter');

        // 2. Use DateUtils for dynamic assertions
        // For example, checking if a copyright year is current
        const currentYear = DateUtils.getCurrentDate('YYYY');
        console.log(`Verifying copyright year: ${currentYear}`);

        // Most sites have the year in the footer
        const pageContent = await page.textContent('body');
        // This is a loose check just for the demo
        if (pageContent?.includes(currentYear)) {
            console.log('Current year found in page content.');
        }

        // 3. Generate a file-safe timestamp for a screenshot
        const timestamp = DateUtils.getFileSafeTimestamp();
        const screenshotPath = `test-results/screenshots/search_results_${timestamp}.png`;

        console.log(`Saving screenshot to: ${screenshotPath}`);
        await page.screenshot({ path: screenshotPath });

        expect(timestamp).toMatch(/^\d{8}_\d{6}$/);
    });

    test('should demonstrate month boundary calculations', async () => {
        const today = new Date();
        const firstDay = DateUtils.formatDate(DateUtils.getFirstDayOfMonth(today), 'DD MMM YYYY');
        const lastDay = DateUtils.formatDate(DateUtils.getLastDayOfMonth(today), 'DD MMM YYYY');

        console.log(`Current Month Window: ${firstDay} to ${lastDay}`);

        expect(firstDay).toContain('01');
    });
});

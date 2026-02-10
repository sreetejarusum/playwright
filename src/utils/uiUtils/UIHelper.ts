import { Page, Locator, expect } from '@playwright/test';

/**
 * UIHelper.ts
 * Reusable utility methods for handling complex UI components in Playwright.
 */
export class UIHelper {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // =========================================================================
    // 1. Calendar & Date Selectors
    // =========================================================================

    /**
     * Handles interactive date pickers by navigating months/years until the target date is visible and selectable.
     * @param pickerLocator The locator to open the calendar (e.g., a button or input).
     * @param targetDate The date to select in "D Month YYYY" format (e.g., "15 October 2024").
     * @param options Configuration for selectors (optional).
     */
    async selectDate(pickerLocator: string | Locator, targetDate: string, options?: {
        nextBtn?: string,
        prevBtn?: string,
        currentMonthYearLabel?: string,
        daySelector?: string
    }) {
        const nextBtn = options?.nextBtn || '#next-month';
        const prevBtn = options?.prevBtn || '#prev-month';
        const currentMonthYearLabel = options?.currentMonthYearLabel || '#current-month-year';
        const daySelector = options?.daySelector || '.calendar-day';

        // 1. Open picker
        const picker = typeof pickerLocator === 'string' ? this.page.locator(pickerLocator) : pickerLocator;
        await picker.click();

        // 2. Parse target date
        const [targetDay, targetMonth, targetYear] = targetDate.split(' ');
        const targetMonthsTotal = (parseInt(targetYear) * 12) + this.getMonthIndex(targetMonth);

        // 3. Navigate to correct Month/Year
        let maxRetries = 24; // 2 years limit for safety
        while (maxRetries > 0) {
            const displayedLabel = await this.page.locator(currentMonthYearLabel).innerText();
            const [dispMonth, dispYear] = displayedLabel.split(' ');
            const dispMonthsTotal = (parseInt(dispYear) * 12) + this.getMonthIndex(dispMonth);

            if (dispMonthsTotal === targetMonthsTotal) break;

            if (dispMonthsTotal < targetMonthsTotal) {
                await this.page.locator(nextBtn).click();
            } else {
                await this.page.locator(prevBtn).click();
            }
            maxRetries--;
        }

        if (maxRetries === 0) throw new Error(`Target date "${targetDate}" not found within retry limit.`);

        // 4. Click the day
        // Use filter to find exact text match to avoid partial matches (e.g., '1' matching '11')
        await this.page.locator(daySelector).filter({ hasText: new RegExp(`^${targetDay}$`) }).click();
    }

    /**
     * Handles standard HTML5 <input type="date"> fields.
     * @param selector The CSS selector or locator for the date input.
     * @param date The date in YYYY-MM-DD format.
     */
    async fillNativeDate(selector: string | Locator, date: string) {
        const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
        try {
            await locator.fill(date);
        } catch (error: any) {
            throw new Error(`Failed to fill native date ${date}: ${error.message}`);
        }
    }

    /**
     * Validates that the start date is before the end date.
     * @param startDate Date string (parsable by JS Date).
     * @param endDate Date string (parsable by JS Date).
     * @throws Error if logic is violated.
     */
    verifyDateRange(startDate: string, endDate: string) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error(`Invalid date provided: ${startDate} or ${endDate}`);
        }

        if (start > end) {
            throw new Error(`Date logical violation: Start date (${startDate}) cannot be after End date (${endDate}).`);
        }
    }

    // =========================================================================
    // 2. Table & Grid Utilities
    // =========================================================================

    /**
     * Finds a row by its text and returns the value from a specific column.
     * @param tableSelector Selector for the <table> element.
     * @param rowText Unique text in the target row.
     * @param columnHeader Exact text of the column header to retrieve value from.
     */
    async getTableCellValue(tableSelector: string, rowText: string, columnHeader: string): Promise<string> {
        const table = this.page.locator(tableSelector);

        // 1. Find column index
        const headers = await table.locator('th').allInnerTexts();
        const colIndex = headers.indexOf(columnHeader);
        if (colIndex === -1) throw new Error(`Column "${columnHeader}" not found in table ${tableSelector}`);

        // 2. Find row containing text and get the cell at index
        const row = table.locator('tr').filter({ hasText: rowText });
        const cellValue = await row.locator('td').nth(colIndex).innerText();
        return cellValue.trim();
    }

    /**
     * Checks if a row containing specific key-value pairs exists in the grid.
     * @param tableSelector Selector for the table.
     * @param expectedData Object where keys are column headers and values are expected cell texts.
     */
    async verifyRowExists(tableSelector: string, expectedData: Record<string, string>): Promise<boolean> {
        const table = this.page.locator(tableSelector);
        const headers = await table.locator('th').allInnerTexts();

        // Map headers to indices
        const indices: Record<string, number> = {};
        for (const [key, value] of Object.entries(expectedData)) {
            const idx = headers.indexOf(key);
            if (idx === -1) throw new Error(`Header "${key}" not found in table.`);
            indices[key] = idx;
        }

        const rows = await table.locator('tbody tr').all();
        for (const row of rows) {
            let rowMatches = true;
            for (const [header, expectedValue] of Object.entries(expectedData)) {
                const cellText = await row.locator('td').nth(indices[header]).innerText();
                if (cellText.trim() !== expectedValue) {
                    rowMatches = false;
                    break;
                }
            }
            if (rowMatches) return true;
        }
        return false;
    }

    /**
     * Counts the number of body rows in a table.
     */
    async getRowCount(tableSelector: string): Promise<number> {
        return await this.page.locator(`${tableSelector} tbody tr`).count();
    }

    /**
     * Counts the number of columns in a table (based on headers).
     */
    async getColumnCount(tableSelector: string): Promise<number> {
        return await this.page.locator(`${tableSelector} th`).count();
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private getMonthIndex(monthName: string): number {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const index = months.indexOf(monthName);
        if (index === -1) throw new Error(`Invalid month name: ${monthName}`);
        return index;
    }
}

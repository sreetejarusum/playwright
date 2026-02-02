import { Page, Locator, Frame, BrowserContext, expect } from '@playwright/test';

export class UIUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // =========================================================================
    // 1. Navigation
    // =========================================================================

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async reloadPage() {
        await this.page.reload();
    }

    async goBack() {
        await this.page.goBack();
    }

    async goForward() {
        await this.page.goForward();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
    }

    // =========================================================================
    // 2. Click & Mouse Actions
    // =========================================================================

    async click(locator: string | Locator) {
        await this.getLocator(locator).click();
    }

    async doubleClick(locator: string | Locator) {
        await this.getLocator(locator).dblclick();
    }

    async rightClick(locator: string | Locator) {
        await this.getLocator(locator).click({ button: 'right' });
    }

    async hover(locator: string | Locator) {
        await this.getLocator(locator).hover();
    }

    async clickByText(text: string) {
        await this.page.getByText(text).click();
    }

    async clickByRole(role: any, name: string) {
        await this.page.getByRole(role, { name: name }).click();
    }

    async clickIfVisible(locator: string | Locator) {
        const loc = this.getLocator(locator);
        if (await loc.isVisible()) {
            await loc.click();
        }
    }

    async forceClick(locator: string | Locator) {
        await this.getLocator(locator).click({ force: true });
    }

    // =========================================================================
    // 3. Keyboard Actions
    // =========================================================================

    async type(locator: string | Locator, text: string) {
        await this.getLocator(locator).type(text);
    }

    async clearAndType(locator: string | Locator, text: string) {
        const loc = this.getLocator(locator);
        await loc.clear();
        await loc.fill(text);
    }

    async pressKey(key: string) {
        await this.page.keyboard.press(key);
    }

    async pressSequentialKeys(keys: string[]) {
        for (const key of keys) {
            await this.page.keyboard.press(key);
        }
    }

    async keyboardShortcut(shortcut: string) { // e.g., 'Control+A'
        await this.page.keyboard.press(shortcut);
    }

    async enter() {
        await this.page.keyboard.press('Enter');
    }

    async tab() {
        await this.page.keyboard.press('Tab');
    }

    // =========================================================================
    // 4. Input / Form Actions
    // =========================================================================

    async setInputValue(locator: string | Locator, value: string) {
        await this.getLocator(locator).fill(value);
    }

    async clearInput(locator: string | Locator) {
        await this.getLocator(locator).clear();
    }

    async getInputValue(locator: string | Locator): Promise<string> {
        return await this.getLocator(locator).inputValue();
    }

    async isInputEditable(locator: string | Locator): Promise<boolean> {
        return await this.getLocator(locator).isEditable();
    }

    async uploadFile(locator: string | Locator, filePath: string) {
        await this.getLocator(locator).setInputFiles(filePath);
    }

    async uploadMultipleFiles(locator: string | Locator, files: string[]) {
        await this.getLocator(locator).setInputFiles(files);
    }

    // =========================================================================
    // 5. Advanced UI Interactions (Dropdowns, Drag & Drop, Multi-Select)
    // =========================================================================

    // Dropdowns
    async selectByValue(locator: string | Locator, value: string) {
        await this.getLocator(locator).selectOption({ value: value });
    }

    async selectByLabel(locator: string | Locator, label: string) {
        await this.getLocator(locator).selectOption({ label: label });
    }

    async selectByIndex(locator: string | Locator, index: number) {
        await this.getLocator(locator).selectOption({ index: index });
    }

    async getSelectedOption(locator: string | Locator): Promise<string[]> {
        return await this.getLocator(locator).selectOption({}); // Returns array of selected values
    }

    async selectMultiOptions(locator: string | Locator, values: string[]) {
        await this.getLocator(locator).selectOption(values);
    }

    // Drag & Drop
    async dragAndDrop(source: string | Locator, target: string | Locator) {
        const sourceLoc = this.getLocator(source);
        const targetLoc = this.getLocator(target);
        await sourceLoc.dragTo(targetLoc);
    }

    async dragByOffset(locator: string | Locator, x: number, y: number) {
        const loc = this.getLocator(locator);
        await loc.hover();
        await this.page.mouse.down();
        await this.page.mouse.move(x, y);
        await this.page.mouse.up();
    }

    // HTML5 Drag & Drop fallback (simplified version, robust implementation often requires JS exec)
    async html5DragDrop(source: string | Locator, target: string | Locator) {
        // Generic implementation often provided by libraries, keeping it same as dragAndDrop for now unless specific JS needed
        await this.dragAndDrop(source, target);
    }

    // Checkboxes / Radio Buttons
    async selectCheckbox(locator: string | Locator) {
        await this.getLocator(locator).check();
    }

    async unselectCheckbox(locator: string | Locator) {
        await this.getLocator(locator).uncheck();
    }

    async toggleCheckbox(locator: string | Locator) {
        const loc = this.getLocator(locator);
        if (await loc.isChecked()) {
            await loc.uncheck();
        } else {
            await loc.check();
        }
    }

    async isCheckboxChecked(locator: string | Locator): Promise<boolean> {
        return await this.getLocator(locator).isChecked();
    }

    async selectRadioButton(locator: string | Locator) {
        await this.getLocator(locator).check(); // Radio buttons use check()
    }

    // This is tricky as radio buttons are usually a group. 
    // Usually checking requires locating the specific radio button to check.
    // Finding "which one is checked" in a group usually involves querying the group.
    async getSelectedRadio(groupLocator: string | Locator): Promise<string | null> {
        // Implementation depends heavily on DOM structure. 
        // Assuming groupLocator covers all radios, we find the checked one.
        const loc = this.getLocator(groupLocator);
        // This might need refinement based on usage
        return null;
    }


    // =========================================================================
    // 6. Scroll Utilities
    // =========================================================================

    async scrollToTop() {
        await this.page.evaluate(() => window.scrollTo(0, 0));
    }

    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    async scrollIntoView(locator: string | Locator) {
        await this.getLocator(locator).scrollIntoViewIfNeeded();
    }

    async scrollByPixels(x: number, y: number) {
        await this.page.mouse.wheel(x, y);
    }

    // =========================================================================
    // 7. JavaScript Executor Utilities
    // =========================================================================

    async executeJS(script: string) {
        return await this.page.evaluate(script);
    }

    async executeJSOnElement(locator: string | Locator, script: string) {
        const element = await this.getLocator(locator).elementHandle();
        return await this.page.evaluate(script, element);
    }

    async getAttribute(locator: string | Locator, attr: string): Promise<string | null> {
        return await this.getLocator(locator).getAttribute(attr);
    }

    async setAttribute(locator: string | Locator, attr: string, value: string) {
        const loc = this.getLocator(locator);
        await loc.evaluate((element, args) => {
            element.setAttribute(args.attr, args.value);
        }, { attr, value });
    }

    async removeAttribute(locator: string | Locator, attr: string) {
        const loc = this.getLocator(locator);
        await loc.evaluate((element, arg) => {
            element.removeAttribute(arg);
        }, attr);
    }

    async highlightElement(locator: string | Locator) {
        const loc = this.getLocator(locator);
        await loc.evaluate((element) => {
            element.style.border = '2px solid red';
            element.style.backgroundColor = 'yellow';
        });
    }

    // =========================================================================
    // 8. Wait & Sync Utilities
    // =========================================================================

    async waitForElementVisible(locator: string | Locator) {
        await this.getLocator(locator).waitFor({ state: 'visible' });
    }

    async waitForElementHidden(locator: string | Locator) {
        await this.getLocator(locator).waitFor({ state: 'hidden' });
    }

    async waitForElementEnabled(locator: string | Locator) {
        await expect(this.getLocator(locator)).toBeEnabled();
    }

    async waitForText(locator: string | Locator, text: string) {
        await expect(this.getLocator(locator)).toContainText(text);
    }

    async waitForUrl(url: string) {
        await this.page.waitForURL(url);
    }

    async waitForTitle(title: string | RegExp) {
        await expect(this.page).toHaveTitle(title);
    }

    async waitForApiResponse(url: string, status: number = 200) {
        await this.page.waitForResponse(response => response.url().includes(url) && response.status() === status);
    }

    async waitForRequest(url: string) {
        await this.page.waitForRequest(request => request.url().includes(url));
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }

    // =========================================================================
    // 9. Browser / Context Utilities
    // =========================================================================

    async openNewTab() {
        // This usually happens by clicking a link with target=_blank, or programmatically:
        // Playwright handles contexts. To "open" one, we might mean create a page in context.
        const newPage = await this.page.context().newPage();
        return newPage;
    }

    async switchToTab(index: number): Promise<Page> {
        const pages = this.page.context().pages();
        if (index < pages.length) {
            const newPage = pages[index];
            await newPage.bringToFront();
            return newPage;
        }
        throw new Error(`Tab index ${index} out of bounds`);
    }

    async closeTab() {
        await this.page.close();
    }

    async closeBrowser() {
        await this.page.context().browser()?.close();
    }

    async switchToFrame(nameOrLocator: string | Locator): Promise<Frame> {
        // simplified logic
        if (typeof nameOrLocator === 'string') {
            const frame = this.page.frame({ name: nameOrLocator });
            if (frame) return frame;
            // If not found by name, try to find element handle and content frame
        }
        // Ideally returns the frame object to chain simple calls
        throw new Error("Frame switching logic relies on returned Frame object in Playwright, not global state switch.");
    }

    // Playwright doesn't "switch" context like Selenium. You execute commands ON the frame.
    // So switchToFrame typically just returns the frame to use.

    async switchToParentFrame() {
        // Not applicable in Playwright as we don't switch global context
    }

    async handlePopup() {
        // Usually event listener
        const [popup] = await Promise.all([
            this.page.waitForEvent('popup'),
            // Trigger the popup action here (passed as callback usually)
        ]);
        return popup;
    }

    async acceptAlert() {
        this.page.once('dialog', dialog => dialog.accept());
    }

    async dismissAlert() {
        this.page.once('dialog', dialog => dialog.dismiss());
    }

    async getAlertText(): Promise<string> {
        return new Promise<string>(resolve => {
            this.page.once('dialog', dialog => {
                resolve(dialog.message());
                dialog.dismiss(); // Default behavior to not block
            });
        });
    }


    // Helper
    private getLocator(locator: string | Locator): Locator {
        return typeof locator === 'string' ? this.page.locator(locator) : locator;
    }
}

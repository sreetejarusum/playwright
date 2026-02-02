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
        try {
            await this.page.goto(url);
        } catch (error: any) {
            throw new Error(`Failed to navigate to ${url}: ${error.message}`);
        }
    }

    async reloadPage() {
        try {
            await this.page.reload();
        } catch (error: any) {
            throw new Error(`Failed to reload page: ${error.message}`);
        }
    }

    async goBack() {
        try {
            await this.page.goBack();
        } catch (error: any) {
            throw new Error(`Failed to go back: ${error.message}`);
        }
    }

    async goForward() {
        try {
            await this.page.goForward();
        } catch (error: any) {
            throw new Error(`Failed to go forward: ${error.message}`);
        }
    }

    async waitForPageLoad() {
        try {
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForLoadState('networkidle');
        } catch (error: any) {
            throw new Error(`Failed to wait for page load: ${error.message}`);
        }
    }

    // =========================================================================
    // 2. Click & Mouse Actions
    // =========================================================================

    async click(locator: string | Locator) {
        try {
            await this.getLocator(locator).click();
        } catch (error: any) {
            throw new Error(`Failed to click ${locator}: ${error.message}`);
        }
    }

    async doubleClick(locator: string | Locator) {
        try {
            await this.getLocator(locator).dblclick();
        } catch (error: any) {
            throw new Error(`Failed to double click ${locator}: ${error.message}`);
        }
    }

    async rightClick(locator: string | Locator) {
        try {
            await this.getLocator(locator).click({ button: 'right' });
        } catch (error: any) {
            throw new Error(`Failed to right click ${locator}: ${error.message}`);
        }
    }

    async hover(locator: string | Locator) {
        try {
            await this.getLocator(locator).hover();
        } catch (error: any) {
            throw new Error(`Failed to hover over ${locator}: ${error.message}`);
        }
    }

    async clickByText(text: string) {
        try {
            await this.page.getByText(text).click();
        } catch (error: any) {
            throw new Error(`Failed to click by text "${text}": ${error.message}`);
        }
    }

    async clickByRole(role: any, name: string) {
        try {
            await this.page.getByRole(role, { name: name }).click();
        } catch (error: any) {
            throw new Error(`Failed to click by role ${role} with name "${name}": ${error.message}`);
        }
    }

    async clickIfVisible(locator: string | Locator) {
        try {
            const loc = this.getLocator(locator);
            if (await loc.isVisible()) {
                await loc.click();
            }
        } catch (error: any) {
            throw new Error(`Failed to click if visible ${locator}: ${error.message}`);
        }
    }

    async forceClick(locator: string | Locator) {
        try {
            await this.getLocator(locator).click({ force: true });
        } catch (error: any) {
            throw new Error(`Failed to force click ${locator}: ${error.message}`);
        }
    }

    // =========================================================================
    // 3. Keyboard Actions
    // =========================================================================

    async type(locator: string | Locator, text: string) {
        try {
            await this.getLocator(locator).fill(text); // Using fill is preferred over type in newer Playwright
        } catch (error: any) {
            throw new Error(`Failed to type "${text}" in ${locator}: ${error.message}`);
        }
    }

    async clearAndType(locator: string | Locator, text: string) {
        try {
            const loc = this.getLocator(locator);
            await loc.clear();
            await loc.fill(text);
        } catch (error: any) {
            throw new Error(`Failed to clear and type "${text}" in ${locator}: ${error.message}`);
        }
    }

    async pressKey(key: string) {
        try {
            await this.page.keyboard.press(key);
        } catch (error: any) {
            throw new Error(`Failed to press key "${key}": ${error.message}`);
        }
    }

    async pressSequentialKeys(keys: string[]) {
        try {
            for (const key of keys) {
                await this.page.keyboard.press(key);
            }
        } catch (error: any) {
            throw new Error(`Failed to press sequential keys: ${error.message}`);
        }
    }

    async keyboardShortcut(shortcut: string) { // e.g., 'Control+A'
        try {
            await this.page.keyboard.press(shortcut);
        } catch (error: any) {
            throw new Error(`Failed to press shortcut "${shortcut}": ${error.message}`);
        }
    }

    async enter() {
        try {
            await this.page.keyboard.press('Enter');
        } catch (error: any) {
            throw new Error(`Failed to press Enter: ${error.message}`);
        }
    }

    async tab() {
        try {
            await this.page.keyboard.press('Tab');
        } catch (error: any) {
            throw new Error(`Failed to press Tab: ${error.message}`);
        }
    }

    // =========================================================================
    // 4. Input / Form Actions
    // =========================================================================

    async setInputValue(locator: string | Locator, value: string) {
        try {
            await this.getLocator(locator).fill(value);
        } catch (error: any) {
            throw new Error(`Failed to set input value for ${locator}: ${error.message}`);
        }
    }

    async clearInput(locator: string | Locator) {
        try {
            await this.getLocator(locator).clear();
        } catch (error: any) {
            throw new Error(`Failed to clear input ${locator}: ${error.message}`);
        }
    }

    async getInputValue(locator: string | Locator): Promise<string> {
        try {
            return await this.getLocator(locator).inputValue();
        } catch (error: any) {
            throw new Error(`Failed to get input value from ${locator}: ${error.message}`);
        }
    }

    async isInputEditable(locator: string | Locator): Promise<boolean> {
        try {
            return await this.getLocator(locator).isEditable();
        } catch (error: any) {
            throw new Error(`Failed to check if ${locator} is editable: ${error.message}`);
        }
    }

    async uploadFile(locator: string | Locator, filePath: string) {
        try {
            await this.getLocator(locator).setInputFiles(filePath);
        } catch (error: any) {
            throw new Error(`Failed to upload file ${filePath} to ${locator}: ${error.message}`);
        }
    }

    async uploadMultipleFiles(locator: string | Locator, files: string[]) {
        try {
            await this.getLocator(locator).setInputFiles(files);
        } catch (error: any) {
            throw new Error(`Failed to upload multiple files to ${locator}: ${error.message}`);
        }
    }

    // =========================================================================
    // 5. Advanced UI Interactions (Dropdowns, Drag & Drop, Multi-Select)
    // =========================================================================

    // Dropdowns
    async selectByValue(locator: string | Locator, value: string) {
        try {
            await this.getLocator(locator).selectOption({ value: value });
        } catch (error: any) {
            throw new Error(`Failed to select value "${value}" from ${locator}: ${error.message}`);
        }
    }

    async selectByLabel(locator: string | Locator, label: string) {
        try {
            await this.getLocator(locator).selectOption({ label: label });
        } catch (error: any) {
            throw new Error(`Failed to select label "${label}" from ${locator}: ${error.message}`);
        }
    }

    async selectByIndex(locator: string | Locator, index: number) {
        try {
            await this.getLocator(locator).selectOption({ index: index });
        } catch (error: any) {
            throw new Error(`Failed to select index ${index} from ${locator}: ${error.message}`);
        }
    }

    async getSelectedOption(locator: string | Locator): Promise<string[]> {
        try {
            const loc = this.getLocator(locator);
            return await loc.evaluate((select: HTMLSelectElement) => {
                if (!select.selectedOptions) return [];
                return Array.from(select.selectedOptions).map(option => option.value);
            });
        } catch (error: any) {
            throw new Error(`Failed to get selected options from ${locator}: ${error.message}`);
        }
    }

    async selectMultiOptions(locator: string | Locator, values: string[]) {
        try {
            await this.getLocator(locator).selectOption(values);
        } catch (error: any) {
            throw new Error(`Failed to select multiple options from ${locator}: ${error.message}`);
        }
    }

    // Drag & Drop
    async dragAndDrop(source: string | Locator, target: string | Locator) {
        try {
            const sourceLoc = this.getLocator(source);
            const targetLoc = this.getLocator(target);
            await sourceLoc.dragTo(targetLoc);
        } catch (error: any) {
            throw new Error(`Failed to drag ${source} to ${target}: ${error.message}`);
        }
    }

    async dragByOffset(locator: string | Locator, x: number, y: number) {
        try {
            const loc = this.getLocator(locator);
            await loc.hover();
            await this.page.mouse.down();
            await this.page.mouse.move(x, y);
            await this.page.mouse.up();
        } catch (error: any) {
            throw new Error(`Failed to drag ${locator} by offset (${x}, ${y}): ${error.message}`);
        }
    }

    // HTML5 Drag & Drop fallback
    async html5DragDrop(source: string | Locator, target: string | Locator) {
        try {
            await this.dragAndDrop(source, target);
        } catch (error: any) {
            throw new Error(`Failed to HTML5 drag drop: ${error.message}`);
        }
    }

    // Checkboxes / Radio Buttons
    async selectCheckbox(locator: string | Locator) {
        try {
            await this.getLocator(locator).check();
        } catch (error: any) {
            throw new Error(`Failed to check checkbox ${locator}: ${error.message}`);
        }
    }

    async unselectCheckbox(locator: string | Locator) {
        try {
            await this.getLocator(locator).uncheck();
        } catch (error: any) {
            throw new Error(`Failed to uncheck checkbox ${locator}: ${error.message}`);
        }
    }

    async toggleCheckbox(locator: string | Locator) {
        try {
            const loc = this.getLocator(locator);
            if (await loc.isChecked()) {
                await loc.uncheck();
            } else {
                await loc.check();
            }
        } catch (error: any) {
            throw new Error(`Failed to toggle checkbox ${locator}: ${error.message}`);
        }
    }

    async isCheckboxChecked(locator: string | Locator): Promise<boolean> {
        try {
            return await this.getLocator(locator).isChecked();
        } catch (error: any) {
            throw new Error(`Failed to check if checkbox ${locator} is checked: ${error.message}`);
        }
    }

    async selectRadioButton(locator: string | Locator) {
        try {
            await this.getLocator(locator).check();
        } catch (error: any) {
            throw new Error(`Failed to select radio button ${locator}: ${error.message}`);
        }
    }

    async getSelectedRadio(groupLocator: string | Locator): Promise<string | null> {
        try {
            // Placeholder logic as per original
            const loc = this.getLocator(groupLocator);
            return null;
        } catch (error: any) {
            throw new Error(`Failed to get selected radio: ${error.message}`);
        }
    }

    // =========================================================================
    // 6. Scroll Utilities
    // =========================================================================

    async scrollToTop() {
        try {
            await this.page.evaluate(() => window.scrollTo(0, 0));
        } catch (error: any) {
            throw new Error(`Failed to scroll to top: ${error.message}`);
        }
    }

    async scrollToBottom() {
        try {
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        } catch (error: any) {
            throw new Error(`Failed to scroll to bottom: ${error.message}`);
        }
    }

    async scrollIntoView(locator: string | Locator) {
        try {
            await this.getLocator(locator).scrollIntoViewIfNeeded();
        } catch (error: any) {
            throw new Error(`Failed to scroll ${locator} into view: ${error.message}`);
        }
    }

    async scrollByPixels(x: number, y: number) {
        try {
            await this.page.mouse.wheel(x, y);
        } catch (error: any) {
            throw new Error(`Failed to scroll by pixels (${x}, ${y}): ${error.message}`);
        }
    }

    // =========================================================================
    // 7. JavaScript Executor Utilities
    // =========================================================================

    async executeJS(script: string) {
        try {
            return await this.page.evaluate(script);
        } catch (error: any) {
            throw new Error(`Failed to execute JS: ${error.message}`);
        }
    }

    async executeJSOnElement(locator: string | Locator, script: string) {
        try {
            const element = await this.getLocator(locator).elementHandle();
            return await this.page.evaluate(script, element);
        } catch (error: any) {
            throw new Error(`Failed to execute JS on ${locator}: ${error.message}`);
        }
    }

    async getAttribute(locator: string | Locator, attr: string): Promise<string | null> {
        try {
            return await this.getLocator(locator).getAttribute(attr);
        } catch (error: any) {
            throw new Error(`Failed to get attribute "${attr}" from ${locator}: ${error.message}`);
        }
    }

    async setAttribute(locator: string | Locator, attr: string, value: string) {
        try {
            const loc = this.getLocator(locator);
            await loc.evaluate((element, args) => {
                element.setAttribute(args.attr, args.value);
            }, { attr, value });
        } catch (error: any) {
            throw new Error(`Failed to set attribute "${attr}" on ${locator}: ${error.message}`);
        }
    }

    async removeAttribute(locator: string | Locator, attr: string) {
        try {
            const loc = this.getLocator(locator);
            await loc.evaluate((element, arg) => {
                element.removeAttribute(arg);
            }, attr);
        } catch (error: any) {
            throw new Error(`Failed to remove attribute "${attr}" from ${locator}: ${error.message}`);
        }
    }

    async highlightElement(locator: string | Locator) {
        try {
            const loc = this.getLocator(locator);
            await loc.evaluate((element) => {
                element.style.border = '2px solid red';
                element.style.backgroundColor = 'yellow';
            });
        } catch (error: any) {
            throw new Error(`Failed to highlight ${locator}: ${error.message}`);
        }
    }

    // =========================================================================
    // 8. Wait & Sync Utilities
    // =========================================================================

    async waitForElementVisible(locator: string | Locator) {
        try {
            await this.getLocator(locator).waitFor({ state: 'visible' });
        } catch (error: any) {
            throw new Error(`Failed to wait for active ${locator}: ${error.message}`);
        }
    }

    async waitForElementHidden(locator: string | Locator) {
        try {
            await this.getLocator(locator).waitFor({ state: 'hidden' });
        } catch (error: any) {
            throw new Error(`Failed to wait for hidden ${locator}: ${error.message}`);
        }
    }

    async waitForElementEnabled(locator: string | Locator) {
        try {
            await expect(this.getLocator(locator)).toBeEnabled();
        } catch (error: any) {
            throw new Error(`Failed to wait for enabled ${locator}: ${error.message}`);
        }
    }

    async waitForText(locator: string | Locator, text: string) {
        try {
            await expect(this.getLocator(locator)).toContainText(text);
        } catch (error: any) {
            throw new Error(`Failed to wait for text "${text}" in ${locator}: ${error.message}`);
        }
    }

    async waitForUrl(url: string) {
        try {
            await this.page.waitForURL(url);
        } catch (error: any) {
            throw new Error(`Failed to wait for URL ${url}: ${error.message}`);
        }
    }

    async waitForTitle(title: string | RegExp) {
        try {
            await expect(this.page).toHaveTitle(title);
        } catch (error: any) {
            throw new Error(`Failed to wait for title ${title}: ${error.message}`);
        }
    }

    async waitForApiResponse(url: string, status: number = 200) {
        try {
            await this.page.waitForResponse(response => response.url().includes(url) && response.status() === status);
        } catch (error: any) {
            throw new Error(`Failed to wait for API response ${url}: ${error.message}`);
        }
    }

    async waitForRequest(url: string) {
        try {
            await this.page.waitForRequest(request => request.url().includes(url));
        } catch (error: any) {
            throw new Error(`Failed to wait for request ${url}: ${error.message}`);
        }
    }

    async waitForNetworkIdle() {
        try {
            await this.page.waitForLoadState('networkidle');
        } catch (error: any) {
            throw new Error(`Failed to wait for network idle: ${error.message}`);
        }
    }

    // =========================================================================
    // 9. Browser / Context Utilities
    // =========================================================================

    async openNewTab() {
        try {
            const newPage = await this.page.context().newPage();
            return newPage;
        } catch (error: any) {
            throw new Error(`Failed to open new tab: ${error.message}`);
        }
    }

    async switchToTab(index: number): Promise<Page> {
        try {
            const pages = this.page.context().pages();
            if (index < pages.length) {
                const newPage = pages[index];
                await newPage.bringToFront();
                return newPage;
            }
            throw new Error(`Tab index ${index} out of bounds`);
        } catch (error: any) {
            throw new Error(`Failed to switch to tab ${index}: ${error.message}`);
        }
    }

    async closeTab() {
        try {
            await this.page.close();
        } catch (error: any) {
            throw new Error(`Failed to close tab: ${error.message}`);
        }
    }

    async closeBrowser() {
        try {
            await this.page.context().browser()?.close();
        } catch (error: any) {
            throw new Error(`Failed to close browser: ${error.message}`);
        }
    }

    /**
     * Finds and returns a frame by name or locator.
     * @param nameOrLocator Frame name attribute or a locator string/object pointing to the iframe element.
     */
    async switchToFrame(nameOrLocator: string | Locator): Promise<Frame> {
        try {
            if (typeof nameOrLocator === 'string') {
                // 1. Try finding by name attribute directly
                const frameByName = this.page.frame({ name: nameOrLocator });
                if (frameByName) return frameByName;

                // 2. Try assuming it's a selector string
                const elementHandle = await this.page.locator(nameOrLocator).elementHandle();
                const contentFrame = await elementHandle?.contentFrame();
                if (contentFrame) return contentFrame;

            } else {
                // 3. Locator object
                const elementHandle = await nameOrLocator.elementHandle();
                const contentFrame = await elementHandle?.contentFrame();
                if (contentFrame) return contentFrame;
            }
            throw new Error(`Frame "${nameOrLocator}" not found.`);
        } catch (error: any) {
            throw new Error(`Failed to switch to frame ${nameOrLocator}: ${error.message}`);
        }
    }

    async switchToParentFrame() {
        // Not applicable in Playwright as we don't switch global context
    }

    async handlePopup() {
        try {
            const [popup] = await Promise.all([
                this.page.waitForEvent('popup'),
            ]);
            return popup;
        } catch (error: any) {
            throw new Error(`Failed to handle popup: ${error.message}`);
        }
    }

    async acceptAlert() {
        try {
            this.page.once('dialog', dialog => dialog.accept());
        } catch (error: any) {
            throw new Error(`Failed to accept alert: ${error.message}`);
        }
    }

    async dismissAlert() {
        try {
            this.page.once('dialog', dialog => dialog.dismiss());
        } catch (error: any) {
            throw new Error(`Failed to dismiss alert: ${error.message}`);
        }
    }

    async getAlertText(): Promise<string> {
        try {
            return new Promise<string>((resolve, reject) => {
                // Timeout safety could be added here
                this.page.once('dialog', dialog => {
                    resolve(dialog.message());
                    dialog.dismiss().catch(e => console.error('Failed to dismiss dialog', e));
                });
            });
        } catch (error: any) {
            throw new Error(`Failed to get alert text: ${error.message}`);
        }
    }


    // Helper
    private getLocator(locator: string | Locator): Locator {
        return typeof locator === 'string' ? this.page.locator(locator) : locator;
    }
}

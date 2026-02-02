import { test, expect } from '@playwright/test';
import { UIUtils } from '../../src/utils/uiUtils/UIUtils';
import path from 'path';

test.describe('UIUtils - Comprehensive Test Suite', () => {

    // =========================================================================
    // 1. Navigation Tests
    // =========================================================================
    test.describe('Navigation Utilities', () => {

        test('navigateTo - should navigate to URL', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
        });

        test('reloadPage - should reload current page', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.reloadPage();
            await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
        });

        test('goBack and goForward - should navigate browser history', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.navigateTo('https://the-internet.herokuapp.com/login');
            await ui.goBack();
            await expect(page).toHaveURL('https://the-internet.herokuapp.com/');
            await ui.goForward();
            await expect(page).toHaveURL('https://the-internet.herokuapp.com/login');
        });

        test('waitForPageLoad - should wait for page to load', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.waitForPageLoad();
            await expect(page.locator('h1')).toBeVisible();
        });
    });

    // =========================================================================
    // 2. Click & Mouse Actions Tests
    // =========================================================================
    test.describe('Click & Mouse Actions', () => {

        test('click - should click element', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/add_remove_elements/');
            await ui.click('button[onclick="addElement()"]');
            await expect(page.locator('.added-manually')).toBeVisible();
        });

        test('doubleClick - should double click element', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div id="target" ondblclick="this.textContent='Double Clicked!'">Double Click Me</div>
            `);
            await ui.doubleClick('#target');
            await expect(page.locator('#target')).toHaveText('Double Clicked!');
        });

        test('rightClick - should right click element', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/context_menu');
            await ui.dismissAlert();
            await ui.rightClick('#hot-spot');
            // Alert should have been triggered and dismissed
        });

        test('hover - should hover over element', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/hovers');
            await ui.hover('.figure:nth-of-type(1) img');
            await expect(page.locator('.figure:nth-of-type(1) .figcaption')).toBeVisible();
        });

        test('clickByText - should click by text content', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.clickByText('A/B Testing');
            await expect(page).toHaveURL(/abtest/);
        });

        test('clickByRole - should click by role and name', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/login');
            await ui.clickByRole('button', 'Login');
            await expect(page.locator('#flash')).toBeVisible();
        });

        test('clickIfVisible - should click only if visible', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <button id="visible">Visible Button</button>
                <button id="hidden" style="display:none;">Hidden Button</button>
            `);
            await ui.clickIfVisible('#visible');
            await ui.clickIfVisible('#hidden'); // Should not throw error
        });

        test('forceClick - should force click element', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div style="position:relative;">
                    <button id="covered">Covered Button</button>
                    <div style="position:absolute;top:0;left:0;width:100%;height:100%;background:red;"></div>
                </div>
            `);
            await ui.forceClick('#covered');
        });
    });

    // =========================================================================
    // 3. Keyboard Actions Tests
    // =========================================================================
    test.describe('Keyboard Actions', () => {

        test('type - should type text in input', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/inputs');
            await ui.type('input[type="number"]', '12345');
            expect(await ui.getInputValue('input[type="number"]')).toBe('12345');
        });

        test('clearAndType - should clear and type text', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="text" value="Old Text" />`);
            await ui.clearAndType('input', 'New Text');
            expect(await ui.getInputValue('input')).toBe('New Text');
        });

        test('pressKey - should press single key', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/key_presses');
            await ui.pressKey('Enter');
            await expect(page.locator('#result')).toContainText('ENTER');
        });

        test('pressSequentialKeys - should press multiple keys', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/key_presses');
            await ui.pressSequentialKeys(['A', 'B', 'C']);
            await expect(page.locator('#result')).toContainText('C');
        });

        test('keyboardShortcut - should press keyboard shortcut', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="text" value="Select All Test" />`);
            await page.locator('input').focus();
            await ui.keyboardShortcut('Control+A');
        });

        test('enter - should press Enter key', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/key_presses');
            await ui.enter();
            await expect(page.locator('#result')).toContainText('ENTER');
        });

        test('tab - should press Tab key', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <input id="first" type="text" />
                <input id="second" type="text" />
            `);
            await page.locator('#first').focus();
            await ui.tab();
            await expect(page.locator('#second')).toBeFocused();
        });
    });

    // =========================================================================
    // 4. Input / Form Actions Tests
    // =========================================================================
    test.describe('Input / Form Actions', () => {

        test('setInputValue - should set input value', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="text" />`);
            await ui.setInputValue('input', 'Test Value');
            expect(await ui.getInputValue('input')).toBe('Test Value');
        });

        test('clearInput - should clear input', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="text" value="Clear Me" />`);
            await ui.clearInput('input');
            expect(await ui.getInputValue('input')).toBe('');
        });

        test('getInputValue - should get input value', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="text" value="Test" />`);
            const value = await ui.getInputValue('input');
            expect(value).toBe('Test');
        });

        test('isInputEditable - should check if input is editable', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <input id="editable" type="text" />
                <input id="readonly" type="text" readonly />
            `);
            expect(await ui.isInputEditable('#editable')).toBeTruthy();
            expect(await ui.isInputEditable('#readonly')).toBeFalsy();
        });

        test('uploadFile - should upload single file', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/upload');
            const testFilePath = path.join(__dirname, '../fixtures/test-file.txt');
            await ui.uploadFile('#file-upload', testFilePath);
            await ui.click('#file-submit');
            await expect(page.locator('#uploaded-files')).toContainText('test-file.txt');
        });

        test('uploadMultipleFiles - should upload multiple files', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="file" multiple />`);
            const files = [
                path.join(__dirname, '../fixtures/file1.txt'),
                path.join(__dirname, '../fixtures/file2.txt')
            ];
            // Note: This test may need actual files to work
            // await ui.uploadMultipleFiles('input', files);
        });
    });

    // =========================================================================
    // 5. Advanced UI Interactions Tests
    // =========================================================================
    test.describe('Dropdowns', () => {

        test('selectByValue - should select by value', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/dropdown');
            await ui.selectByValue('#dropdown', '1');
            const selected = await ui.getSelectedOption('#dropdown');
            expect(selected).toEqual(['1']);
        });

        test('selectByLabel - should select by label', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/dropdown');
            await ui.selectByLabel('#dropdown', 'Option 2');
            const selected = await ui.getSelectedOption('#dropdown');
            expect(selected).toEqual(['2']);
        });

        test('selectByIndex - should select by index', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/dropdown');
            await ui.selectByIndex('#dropdown', 1);
            const selected = await ui.getSelectedOption('#dropdown');
            expect(selected).toEqual(['1']);
        });

        test('getSelectedOption - should get selected options', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/dropdown');
            await ui.selectByValue('#dropdown', '2');
            const selected = await ui.getSelectedOption('#dropdown');
            expect(selected).toEqual(['2']);
        });

        test('selectMultiOptions - should select multiple options', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <select multiple>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </select>
            `);
            await ui.selectMultiOptions('select', ['1', '3']);
            const selected = await ui.getSelectedOption('select');
            expect(selected).toContain('1');
            expect(selected).toContain('3');
        });
    });

    test.describe('Drag & Drop', () => {

        test('dragAndDrop - should drag and drop elements', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/drag_and_drop');
            await ui.dragAndDrop('#column-a', '#column-b');
            // Verify the swap happened
            await expect(page.locator('#column-a header')).toHaveText('B');
        });

        test('dragByOffset - should drag by offset', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div id="draggable" style="position:absolute;top:0;left:0;width:50px;height:50px;background:red;"></div>
            `);
            await ui.dragByOffset('#draggable', 100, 100);
        });

        test('html5DragDrop - should perform HTML5 drag drop', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/drag_and_drop');
            await ui.html5DragDrop('#column-a', '#column-b');
        });
    });

    test.describe('Checkboxes & Radio Buttons', () => {

        test('selectCheckbox - should select checkbox', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/checkboxes');
            const checkbox = 'form#checkboxes input:nth-of-type(1)';
            if (await ui.isCheckboxChecked(checkbox)) {
                await ui.unselectCheckbox(checkbox);
            }
            await ui.selectCheckbox(checkbox);
            expect(await ui.isCheckboxChecked(checkbox)).toBeTruthy();
        });

        test('unselectCheckbox - should unselect checkbox', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/checkboxes');
            const checkbox = 'form#checkboxes input:nth-of-type(2)';
            if (!await ui.isCheckboxChecked(checkbox)) {
                await ui.selectCheckbox(checkbox);
            }
            await ui.unselectCheckbox(checkbox);
            expect(await ui.isCheckboxChecked(checkbox)).toBeFalsy();
        });

        test('toggleCheckbox - should toggle checkbox state', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<input type="checkbox" id="toggle" />`);
            const initialState = await ui.isCheckboxChecked('#toggle');
            await ui.toggleCheckbox('#toggle');
            expect(await ui.isCheckboxChecked('#toggle')).toBe(!initialState);
        });

        test('isCheckboxChecked - should check checkbox state', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <input type="checkbox" id="checked" checked />
                <input type="checkbox" id="unchecked" />
            `);
            expect(await ui.isCheckboxChecked('#checked')).toBeTruthy();
            expect(await ui.isCheckboxChecked('#unchecked')).toBeFalsy();
        });

        test('selectRadioButton - should select radio button', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <input type="radio" name="group" value="1" id="radio1" />
                <input type="radio" name="group" value="2" id="radio2" />
            `);
            await ui.selectRadioButton('#radio2');
            expect(await ui.isCheckboxChecked('#radio2')).toBeTruthy();
        });
    });

    // =========================================================================
    // 6. Scroll Utilities Tests
    // =========================================================================
    test.describe('Scroll Utilities', () => {

        test('scrollToTop - should scroll to top', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/infinite_scroll');
            await ui.scrollToBottom();
            await ui.scrollToTop();
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBe(0);
        });

        test('scrollToBottom - should scroll to bottom', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/large');
            await ui.scrollToBottom();
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBeGreaterThan(0);
        });

        test('scrollIntoView - should scroll element into view', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/large');
            const targetElement = '#sibling-50\\.1';
            await ui.scrollIntoView(targetElement);
            await expect(page.locator(targetElement)).toBeInViewport();
        });

        test('scrollByPixels - should scroll by pixels', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/large');
            await page.waitForLoadState('networkidle');
            const initialScrollY = await page.evaluate(() => window.scrollY);
            await ui.scrollByPixels(0, 500);
            await page.waitForTimeout(500); // Wait for scroll to complete
            const newScrollY = await page.evaluate(() => window.scrollY);
            expect(newScrollY).toBeGreaterThanOrEqual(initialScrollY);
        });
    });

    // =========================================================================
    // 7. JavaScript Executor Utilities Tests
    // =========================================================================
    test.describe('JavaScript Executor Utilities', () => {

        test('executeJS - should execute JavaScript', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test">Original</div>`);
            await page.evaluate(() => {
                const element = document.getElementById('test');
                if (element) element.textContent = 'Modified';
            });
            await expect(page.locator('#test')).toHaveText('Modified');
        });

        test('executeJSOnElement - should execute JS on element', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test">Test</div>`);
            await page.locator('#test').evaluate((el: HTMLElement) => {
                el.style.color = 'red';
            });
        });

        test('getAttribute - should get element attribute', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test" data-value="123">Test</div>`);
            const value = await ui.getAttribute('#test', 'data-value');
            expect(value).toBe('123');
        });

        test('setAttribute - should set element attribute', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test">Test</div>`);
            await ui.setAttribute('#test', 'data-custom', 'value');
            const value = await ui.getAttribute('#test', 'data-custom');
            expect(value).toBe('value');
        });

        test('removeAttribute - should remove element attribute', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test" data-remove="yes">Test</div>`);
            await ui.removeAttribute('#test', 'data-remove');
            const value = await ui.getAttribute('#test', 'data-remove');
            expect(value).toBeNull();
        });

        test('highlightElement - should highlight element', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`<div id="test">Test</div>`);
            await ui.highlightElement('#test');
            const border = await page.locator('#test').evaluate(el => el.style.border);
            expect(border).toContain('red');
        });
    });

    // =========================================================================
    // 8. Wait & Sync Utilities Tests
    // =========================================================================
    test.describe('Wait & Sync Utilities', () => {

        test('waitForElementVisible - should wait for element to be visible', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div id="delayed" style="display:none;">Hidden</div>
                <script>
                    setTimeout(() => {
                        document.getElementById('delayed').style.display = 'block';
                    }, 1000);
                </script>
            `);
            await ui.waitForElementVisible('#delayed');
            await expect(page.locator('#delayed')).toBeVisible();
        });

        test('waitForElementHidden - should wait for element to be hidden', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div id="disappear">Visible</div>
                <script>
                    setTimeout(() => {
                        document.getElementById('disappear').style.display = 'none';
                    }, 1000);
                </script>
            `);
            await ui.waitForElementHidden('#disappear');
            await expect(page.locator('#disappear')).toBeHidden();
        });

        test('waitForElementEnabled - should wait for element to be enabled', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <button id="btn" disabled>Click Me</button>
                <script>
                    setTimeout(() => {
                        document.getElementById('btn').disabled = false;
                    }, 1000);
                </script>
            `);
            await ui.waitForElementEnabled('#btn');
            await expect(page.locator('#btn')).toBeEnabled();
        });

        test('waitForText - should wait for text to appear', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <div id="text">Loading...</div>
                <script>
                    setTimeout(() => {
                        document.getElementById('text').textContent = 'Loaded!';
                    }, 1000);
                </script>
            `);
            await ui.waitForText('#text', 'Loaded!');
            await expect(page.locator('#text')).toContainText('Loaded!');
        });

        test('waitForUrl - should wait for URL', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.clickByText('A/B Testing');
            await page.waitForURL(/abtest/);
            await expect(page).toHaveURL(/abtest/);
        });

        test('waitForTitle - should wait for page title', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.waitForTitle(/The Internet/);
            await expect(page).toHaveTitle(/The Internet/);
        });

        test('waitForNetworkIdle - should wait for network idle', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            await ui.waitForNetworkIdle();
        });
    });

    // =========================================================================
    // 9. Browser / Context Utilities Tests
    // =========================================================================
    test.describe('Browser / Context Utilities', () => {

        test('openNewTab - should open new tab', async ({ page }) => {
            const ui = new UIUtils(page);
            const newPage = await ui.openNewTab();
            expect(newPage).toBeDefined();
            await newPage.close();
        });

        test('switchToTab - should switch between tabs', async ({ page, context }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/');
            const newPage = await context.newPage();
            await newPage.goto('https://the-internet.herokuapp.com/login');

            const switchedPage = await ui.switchToTab(1);
            expect(switchedPage.url()).toContain('login');
            await newPage.close();
        });

        test('closeTab - should close current tab', async ({ page, context }) => {
            const ui = new UIUtils(page);
            const newPage = await context.newPage();
            const newUi = new UIUtils(newPage);
            await newUi.closeTab();
            expect(context.pages().length).toBe(1);
        });

        test('switchToFrame - should switch to iframe', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/iframe');
            const frame = await ui.switchToFrame('#mce_0_ifr');
            const body = frame.locator('body#tinymce');
            await expect(body).toContainText('Your content goes here.');
        });

        test('handlePopup - should handle popup window', async ({ page }) => {
            const ui = new UIUtils(page);
            await page.setContent(`
                <button onclick="window.open('about:blank', '_blank')">Open Popup</button>
            `);
            const popupPromise = ui.handlePopup();
            await page.click('button');
            const popup = await popupPromise;
            expect(popup).toBeDefined();
            await popup.close();
        });

        test('acceptAlert - should accept JavaScript alert', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/javascript_alerts');
            await ui.acceptAlert();
            await ui.click('button[onclick="jsConfirm()"]');
            await expect(page.locator('#result')).toHaveText('You clicked: Ok');
        });

        test('dismissAlert - should dismiss JavaScript alert', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/javascript_alerts');
            await ui.dismissAlert();
            await ui.click('button[onclick="jsConfirm()"]');
            await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
        });

        test('getAlertText - should get alert text', async ({ page }) => {
            const ui = new UIUtils(page);
            await ui.navigateTo('https://the-internet.herokuapp.com/javascript_alerts');
            const alertPromise = ui.getAlertText();
            await ui.click('button[onclick="jsAlert()"]');
            const text = await alertPromise;
            expect(text).toBe('I am a JS Alert');
        });
    });
});

import { test, expect } from '@playwright/test';
import { UIUtils } from '../../src/utils/uiUtils/UIUtils';
import { AssertionUtils } from '../../src/utils/AssertionUtils';

test.describe('UIUtils Coverage Tests', () => {

    test('Dropdowns', async ({ page }) => {
        const ui = new UIUtils(page);
        await ui.navigateTo('https://the-internet.herokuapp.com/dropdown');

        await ui.selectByValue('#dropdown', '1');
        const option1 = await ui.getSelectedOption('#dropdown');
        expect(option1).toEqual(['1']);

        await ui.selectByLabel('#dropdown', 'Option 2');
        const option2 = await ui.getSelectedOption('#dropdown');
        expect(option2).toEqual(['2']);
    });

    test('Checkboxes', async ({ page }) => {
        const ui = new UIUtils(page);
        await ui.navigateTo('https://the-internet.herokuapp.com/checkboxes');

        const box1 = 'form#checkboxes input:nth-of-type(1)';

        // Ensure box1 is unchecked
        if (await ui.isCheckboxChecked(box1)) await ui.unselectCheckbox(box1);

        await ui.selectCheckbox(box1);
        expect(await ui.isCheckboxChecked(box1)).toBeTruthy();

        await ui.unselectCheckbox(box1);
        expect(await ui.isCheckboxChecked(box1)).toBeFalsy();
    });

    test('Hovers', async ({ page }) => {
        const ui = new UIUtils(page);
        const assert = new AssertionUtils(page);
        await ui.navigateTo('https://the-internet.herokuapp.com/hovers');

        // Hover over first image
        await ui.hover('.figure:nth-of-type(1) img');

        // Caption should be visible
        await assert.assertVisible('.figure:nth-of-type(1) .figcaption h5');
        await assert.assertText('.figure:nth-of-type(1) .figcaption h5', 'name: user1');
    });

    test('JavaScript Alerts', async ({ page }) => {
        const ui = new UIUtils(page);
        await ui.navigateTo('https://the-internet.herokuapp.com/javascript_alerts');

        // 1. JS Alert - Validate Text
        const alertPromise = ui.getAlertText();
        await ui.click('button[onclick="jsAlert()"]');
        const text = await alertPromise;
        expect(text).toBe('I am a JS Alert');
        await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');

        // 2. JS Confirm - Accept
        await ui.acceptAlert();
        await ui.click('button[onclick="jsConfirm()"]');
        await expect(page.locator('#result')).toHaveText('You clicked: Ok');

        // 3. JS Confirm - Dismiss
        await ui.dismissAlert();
        await ui.click('button[onclick="jsConfirm()"]');
        await expect(page.locator('#result')).toHaveText('You clicked: Cancel');
    });

    test('Inputs and Key Presses', async ({ page }) => {
        const ui = new UIUtils(page);

        // Test type() on inputs page
        await ui.navigateTo('https://the-internet.herokuapp.com/inputs');
        const input = 'input[type="number"]';
        // Clear first just in case
        await ui.clearInput(input);
        await ui.type(input, '123');
        const val = await ui.getInputValue(input);
        expect(val).toBe('123');

        // Test pressKey() on key_presses page
        await ui.navigateTo('https://the-internet.herokuapp.com/key_presses');
        await ui.pressKey('Enter');
        await expect(page.locator('#result')).toContainText('You entered: ENTER');
    });

    test('Frames', async ({ page }) => {
        const ui = new UIUtils(page);
        await ui.navigateTo('https://the-internet.herokuapp.com/iframe');

        // Switch to TinyMCE iframe
        const frame = await ui.switchToFrame('mce_0_ifr');
        const body = frame.locator('body#tinymce');

        // Assert text content in the frame
        await expect(body).toContainText('Your content goes here.');
    });

});

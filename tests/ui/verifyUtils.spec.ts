
import { test, expect } from '@playwright/test';
import { UIUtils } from '../../src/utils/uiUtils/UIUtils';
// import { AssertionUtils } from '../../src/utils/AssertionUtils';
import { AssertionUtils } from '../../src/utils/AssertionUtils';

test('Verify UI Utilities Compilation and Basic Execution', async ({ page }) => {
    const ui = new UIUtils(page);
    const assert = new AssertionUtils(page);

    // 1. Navigation (Mocked or simple)
    await ui.navigateTo('https://example.com');
    await assert.assertUrl(/example.com/);
    await assert.assertTitle(/Example Domain/);

    // 2. Element Interactions
    const h1 = 'h1';
    await assert.assertVisible(h1);
    await assert.assertText(h1, 'Example Domain');

    // 3. Actions
    // Just calling methods to ensure no runtime errors on valid locators
    // We can't easily click things on example.com that navigate without changing context, so just basic checks
    await ui.clickIfVisible('h1');

    // 4. Assertions
    await assert.assertPageContainsText('Example Domain');

    console.log('UI Utilities verification passed!');
});

const { test } = require('@playwright/test')


test('UI Basics', async ({ page }) => {
    await page.goto('https://www.udemy.com/');
});


test('Second Test with scratch', async function ({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://chat.deepseek.com/');

});

test('Compact Test method', async ({ page }) => {
    await page.goto('https://www.google.com/');

});

test('Kaleyra Test method', async ({ page }) => {
    await page.goto('https://vskills.in/practice/playwright-mock-test-practice-questions');

})
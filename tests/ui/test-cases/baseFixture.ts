import { test as baseTest, expect, type Page } from '@playwright/test';
import { LoginPage } from '../page-classes/login.page';
import { readCsv } from '../../../utils/csv-utils';
import { SessionManager } from '../../../utils/SessionManager';
import path from 'path';

interface MyTestFixtures {
  loginPage: LoginPage;
  credentials: any[];
}

interface MyWorkerFixtures {
  sessionTeardown: void;
}

export const test = baseTest.extend<MyTestFixtures, MyWorkerFixtures>({
  page: async ({ }, use) => {
    const sessionManager = SessionManager.getInstance();
    await sessionManager.initializeBrowser('chromium'); // Default to chromium, can be parameterized
    const page = await sessionManager.getPage();
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  credentials: [async ({ }, use) => {
    const allCredentials = await readCsv(path.join(process.cwd(), 'test-data/login-credentials.csv'));
    await use(allCredentials);
  }, { scope: 'worker' }],
  sessionTeardown: [async ({ }, use) => {
    await use();
    await SessionManager.getInstance().closeBrowser();
  }, { scope: 'worker', auto: true }],
});

test.beforeEach(async ({ page, baseURL }) => {
  console.log(`Navigating to: ${baseURL}`);
  await page.goto(baseURL || '/');
});

test.afterEach(async ({ }) => {
  // Assuming there's a logout mechanism, e.g., a logout button or a direct URL
  // This is a placeholder and needs to be implemented based on your application's logout flow.
  console.log('Performing logout and closing browser...');
  // await page.click('#logoutButton'); // Example: clicking a logout button
  // await page.goto('/logout'); // Example: navigating to a logout URL

  // Close context via manager (keeps browser open for next test)
  await SessionManager.getInstance().closeContext();
});

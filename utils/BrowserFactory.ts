import { Browser, BrowserType, chromium, firefox, webkit, LaunchOptions } from '@playwright/test';

export type BrowserName = 'chromium' | 'firefox' | 'webkit';

export class BrowserFactory {
    public static async createBrowser(browserName: BrowserName, options?: LaunchOptions): Promise<Browser> {
        let browserType: BrowserType;

        switch (browserName) {
            case 'chromium':
                browserType = chromium;
                break;
            case 'firefox':
                browserType = firefox;
                break;
            case 'webkit':
                browserType = webkit;
                break;
            default:
                throw new Error(`Unsupported browser: ${browserName}`);
        }

        return await browserType.launch(options);
    }
}

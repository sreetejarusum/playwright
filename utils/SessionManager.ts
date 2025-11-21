import { Browser, BrowserContext, Page, LaunchOptions } from '@playwright/test';
import { BrowserFactory, BrowserName } from './BrowserFactory';

export class SessionManager {
    private static instance: SessionManager;
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    private constructor() { }

    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    public async initializeBrowser(browserName: BrowserName, options?: LaunchOptions): Promise<void> {
        if (!this.browser) {
            this.browser = await BrowserFactory.createBrowser(browserName, options);
        }
    }

    public async createContext(): Promise<BrowserContext> {
        if (!this.browser) {
            throw new Error('Browser not initialized. Call initializeBrowser first.');
        }
        if (!this.context) {
            this.context = await this.browser.newContext();
        }
        return this.context;
    }

    public async getPage(): Promise<Page> {
        if (!this.context) {
            await this.createContext();
        }
        if (!this.page) {
            // @ts-ignore
            this.page = await this.context.newPage();
        }
        // @ts-ignore
        return this.page;
    }

    public async closeContext(): Promise<void> {
        if (this.page) {
            await this.page.close();
            this.page = null;
        }
        if (this.context) {
            await this.context.close();
            this.context = null;
        }
    }

    public async closeBrowser(): Promise<void> {
        await this.closeContext();
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

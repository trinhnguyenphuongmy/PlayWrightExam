import { test as base } from '@playwright/test';
import { PageManagerHelper } from '../helpers/PageManagerHelper';
import { logger } from '../helpers/LoggerHelper';
import { HomePage } from '../pages/web/HomePage';
import { MyAccountPage } from "../pages/web/MyAccountPage";

type MyFixtures = {
    // homePage: HomePage;
    // myAccountPage: MyAccountPage;
    pages: PageManagerHelper;
};

export const test = base.extend<MyFixtures>({
    /*  Method 1: Intialize every page object needed */
    // homePage: async ({ page }, use) => {
    //     const homePage = new HomePage(page);
    // },
    // myAccountPage: async ({ page }, use) => {
    //     const myAccountPage = new MyAccountPage(page);
    // },

    /*  Method 2: Using PageManagerHelper to intialize page objects (which using Lazy initialization)*/
    pages: async ({ page }, use) => {
        const manager = new PageManagerHelper(page);
        await use(manager);
    },
});

test.beforeEach(async ({ pages, baseURL }) => {
    logger.clear();
    logger.info(`Navigate to the AUT ${baseURL}`);
    await pages.getPage(HomePage).openAUT();
});

test.afterEach(async ({ page }, testInfo) => {
    await page.waitForTimeout(3000);
    const logs = logger.getLogs();
    if (logs.trim()) {
        await testInfo.attach('execution-log', {
            body: logs,
            contentType: 'text/plain',
        });
    }
});
import { test as base } from "@playwright/test";
import { PageManagerHelper } from "../helpers/PageManagerHelper";
import { logger } from "../helpers/LoggerHelper";
import { HomePage } from "../pages/web/HomePage";
import { MyAccountPage } from "../pages/web/MyAccountPage";
import { AbstractPageAssertion } from "../assertions/AbstractPageAssertion";

type MyFixtures = {
  pages: PageManagerHelper;
  abstractPageAssertion: AbstractPageAssertion<HomePage>;
};

export const test = base.extend<MyFixtures>({
  /*  Method 2: Using PageManagerHelper to intialize page objects (which using Lazy initialization)*/
  pages: async ({ page }, use) => {
    const manager = new PageManagerHelper(page);
    await use(manager);
  },
  abstractPageAssertion: async ({ page }, use) => {
    const homePage = new HomePage(page);
    const abstractPageAssertion = new AbstractPageAssertion<HomePage>(homePage);
    await use(abstractPageAssertion);
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
    await testInfo.attach("execution-log", {
      body: logs,
      contentType: "text/plain",
    });
  }
});

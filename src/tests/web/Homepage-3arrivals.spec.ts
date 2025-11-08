import { expect } from "@playwright/test";
import { test } from "../../common/BaseTest";
import { logger } from "../../helpers/LoggerHelper";
import { HomePage } from "../../pages/web/HomePage";
import { MyAccountPage } from "../../pages/web/MyAccountPage";
import { SiteMenu } from "../../data/enums/SiteMenu";

test.describe("Verify Homepage with three Arrivals only", () => {
  test("Verify Homepage with three Arrivals only", async ({ pages }) => {
    const homePage = pages.getPage(HomePage);
    const myAccountPage = pages.getPage(MyAccountPage);

    logger.info("Navigate to the web page");
    //1) Open the browser
    await test.step("1) Open the browser", async () => {
      //Covered in BaseTest.ts
    });

    // 2) Enter the URL “http://practice.automationtesting.in/”
    await test.step(`2) Enter the URL “http://practice.automationtesting.in/”`, async () => {
      //Covered in BaseTest.ts
    });

    logger.info("Click on Shop Menu");
    // 3) Click on Shop Menu
    await test.step("3) Click on Shop Menu", async () => {
      await homePage.clickLinkButton(SiteMenu.SHOP);
    });

    logger.info("Now click on Home menu button");
    // 4) Now click on Home menu button
    await test.step("4) Now click on Home menu button", async () => {
      await homePage.clickHomeButton();
    });

    logger.info("Test whether the Home page has Three Arrivals  only");
    logger.info("The Home page must contains only three Arrivals ");
    // 5) Test whether the Home page has Three Arrivals  only
    // 6) The Home page must contains only three Arrivals
    await test.step("5, 6) Test whether the Home page has Three Arrivals  only", async () => {
      expect(await homePage.countNumberOfArrivals()).toBe(3);
    });
  });
});

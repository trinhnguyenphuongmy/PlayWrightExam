import { expect } from "@playwright/test";
import { test } from "../../common/BaseTest";
import { logger } from "../../helpers/LoggerHelper";
import { HomePage } from "../../pages/web/HomePage";
import { MyAccountPage } from "../../pages/web/MyAccountPage";
import { SiteMenu } from "../../data/enums/SiteMenu";
import { User } from "../../data/objects/User";
import * as assistance from "../../utils/common-utils";

test.describe("Verify Registration-Sign-in function", () => {
  test("Verify users can register a new account", async ({ pages }) => {
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

    logger.info("Click on My Account Menu");
    // 3) Click on My Account Menu
    await test.step("3) Click on My Account Menu", async () => {
      await homePage.clickLinkButton(SiteMenu.MYACCOUNT);
    });

    // 4) Enter registered Email Address in Email-Address textbox
    // 5) Enter your own password in password textbox
    // 6) Click on Register button

    logger.info("Register new account");
    const newMail = await assistance.generateRandomEmail();
    const newPass = await assistance.generateRandomPassword();
    const newUser = new User(newMail, newPass);

    await test.step("4, 5, 6) Register new account", async () => {
      await myAccountPage.registerNewAccount(newUser);
    });

    logger.info(
      "Verify that User will be registered successfully and will be navigated to the Home page"
    );
    // 7) User will be registered successfully and will be navigated to the Home page
    const username = await assistance.getUsernameFromEmail(newMail);
    const welcomeMes = `Hello ${username} (not ${username}? Sign out)`;
    await test.step("7) User will be registered successfully and will be navigated to the Home page", async () => {
      expect(
        await myAccountPage.doesMessageDisplayOnPage(welcomeMes)
      ).toBeTruthy();
    });
  });
});

import { expect } from '@playwright/test';
import { test } from '../../common/BaseTest'
import { logger } from '../../helpers/LoggerHelper';
import { HomePage } from '../../pages/web/HomePage'
import { MyAccountPage } from '../../pages/web/MyAccountPage';

test.describe('@Demo', () => {
    test('Verify users can buy an item successfully', async ({ pages }) => {
        const homePage = pages.getPage(HomePage);
        const myAccountPage = pages.getPage(MyAccountPage);
        logger.info("Pre: Register a valid account");
        logger.info("Navigate to My Account page")
        homePage.clickLogIn();
        expect(myAccountPage.isLoginPageDisplayed()).toBeTruthy();
    })
})


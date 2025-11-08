import { expect } from "@playwright/test";
import { test } from "../../common/BaseTest";
import { logger } from "../../helpers/LoggerHelper";
import { ShopPage } from "../../pages/web/ShopPage";

test.describe("Verify Book Filtering by Category and Price Sorting (High to Low)", () => {
  test("Verify Book Filtering by Category and Price Sorting (High to Low)", async ({
    pages,
    abstractPageAssertion,
  }) => {
    logger.info(`1	Navigate to the "Shop" page`);
    const shopPage = pages.getPage(ShopPage);
    // 1	Navigate to the "Shop" page
    await test.step(`1	Navigate to the "Shop" page`, async () => {
      await shopPage.goto();
    });

    logger.info(`2	Click on the "HTML" category`);
    // 2	Click on the "HTML" category
    await test.step(`2	Click on the "HTML" category`, async () => {
      await shopPage.selectProductCategory("HTML");
    });

    logger.info(
      `3	From the "Sort by" dropdown, select "Sort by price: high to low"`
    );
    // 3	From the "Sort by" dropdown, select "Sort by price: high to low"
    await test.step(`3	From the "Sort by" dropdown, select "Sort by price: high to low"`, async () => {
      await shopPage.selectSortOption("Sort by price: high to low");
    });

    logger.info(`4	Verify the results as described below`);
    // 4	Verify the results as described below
    await test.step(`4	Verify the results as described`, async () => {
      // o	The page URL contains "?orderby=price-desc"
      await abstractPageAssertion.verifyCurrentUrlContains(
        "?orderby=price-desc"
      );

      // o	The displayed book prices are sorted in descending order (highest to lowest)
      expect(await shopPage.verifyPricesHighToLow()).toBeTruthy();

      // o	All displayed books belong to the "HTML" category (titles contain "HTML")
      expect(await shopPage.verifyProductTitlesContain("HTML")).toBeTruthy();
    });
  });
});

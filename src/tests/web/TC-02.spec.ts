import { expect } from "@playwright/test";
import { ShopPage } from "../../pages/web/ShopPage";
import { BasketPage } from "../../pages/web/BasketPage";
import { CheckOutPage } from "../../pages/web/CheckOutPage";
import { SiteMenu } from "../../data/enums/SiteMenu";
import { test } from "../../common/BaseTest";
import { logger } from "../../helpers/LoggerHelper";
import { Product } from "../../data/objects/Product";
import * as assistance from "../../utils/common-utils";

test.describe("VVerify User Can Add Multiple Books to Cart and Verify Total Price Calculation", () => {
  test("Verify User Can Add Multiple Books to Cart and Verify Total Price Calculation", async ({
    pages,
    abstractPageAssertion,
  }) => {
    logger.info(`1	Navigate to the "Shop" page`);
    const shopPage = pages.getPage(ShopPage);
    // 1	Navigate to the "Shop" page
    await test.step(`1	Navigate to the "Shop" page`, async () => {
      await shopPage.goto();
    });

    logger.info(
      `2	Add two random books (each from a different category) by clicking "ADD TO BASKET" button for each`
    );
    // 2	Add two random books (each from a different category) by clicking "ADD TO BASKET" button for each
    const selectedProducts =
      await shopPage.addRandomProductsFromDifferentCategories(
        ["Android", "HTML", "JavaScript", "Selenium"],
        2
      );
    const totalPrice = assistance.getTotalPriceOfProducts(selectedProducts);
    await test.step(`2	Add two random books (each from a different category) by clicking "ADD TO BASKET" button for each`, async () => {
      console.log("Returned Total Price:", totalPrice);
    });

    logger.info(
      `3	Verify that the cart icon displays the correct number of items (2)`
    );
    // 3	Verify that the cart icon displays the correct number of items (2).
    await test.step(`3	Verify that the cart icon displays the correct number of items (2)`, async () => {
      expect(await shopPage.getCartItemCount()).toBe(2);
    });

    // 4	Verify that the cart subtotal equals the sum of the added book prices.
    logger.info(
      `4	Verify that the cart subtotal equals the sum of the added book prices`
    );
    await test.step(`4	Verify that the cart subtotal equals the sum of the added book prices`, async () => {
      expect(await shopPage.getCartSubtotal()).toBe(totalPrice);
    });

    // 5	Click on the "Cart" icon in the header to open the Cart page.
    logger.info(
      `5	Click on the "Cart" icon in the header to open the Cart page`
    );
    const basketPage = pages.getPage(BasketPage);
    await test.step(`5	Click on the "Cart" icon in the header to open the Cart page`, async () => {
      await basketPage.open();
    });

    // 6	Verify that all added books appear in the cart with correct details (Product Name, Unit Price, Quantity).
    logger.info(
      `6	Verify that all added books appear in the cart with correct details (Product Name, Unit Price, Quantity)`
    );
    await test.step(`6	Verify that all added books appear in the cart with correct details (Product Name, Unit Price, Quantity)`, async () => {
      expect(await basketPage.cartProductsMatch(selectedProducts)).toBeTruthy();
    });

    // 7	Verify price calculations:
    //    • Subtotal = Sum of all item prices × quantity.
    //    • Tax is displayed (if applicable).
    //    • Total = Subtotal + Tax (if any).
    logger.info(`7	Verify price calculations`);
    await test.step(`7	Verify price calculations`, async () => {
      expect(
        await basketPage.verifyCartTotals(
          totalPrice,
          await basketPage.getTaxFromUI()
        )
      );
    });
  });
});

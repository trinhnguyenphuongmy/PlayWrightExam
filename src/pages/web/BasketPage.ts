import { Product } from "../../data/objects/Product";
import * as assistance from "../../utils/common-utils";
import { GeneralPage } from "./GeneralPage";

export class BasketPage extends GeneralPage {
  // -----------------------
  // ✅ Locators (Top of class)
  // -----------------------
  private readonly cartTableRows = this.page.locator(
    "table.shop_table.cart tbody tr.cart_item"
  );

  private readonly productNameCell = "td.product-name a";
  private readonly productUnitPriceCell = "td.product-price .amount";
  private readonly productQtyInput = "td.product-quantity input.qty";
  private readonly productSubtotalCell = "td.product-subtotal .amount";

  private readonly taxAmountRow = this.page.locator(".tax-rate .amount");
  private readonly totalAmountRow = this.page.locator(".order-total .amount");

  private readonly updateBasketBtn = this.page.getByRole("button", {
    name: "Update Basket",
  });

  private readonly applyCouponBtn = this.page.getByRole("button", {
    name: "Apply Coupon",
  });

  private readonly proceedToCheckoutBtn = this.page.getByRole("link", {
    name: "Proceed to Checkout",
  });

  async open() {
    await this.cartLnk.click();
  }

  async proceedToCheckout() {
    await this.proceedToCheckoutBtn.click();
  }

  /**
   * Verify each product in cart matches expected Product[] list
   */
  async cartProductsMatch(expectedProducts: Product[]): Promise<boolean> {
    try {
      const rowCount = await this.cartTableRows.count();
      if (rowCount !== expectedProducts.length) return false;

      for (let i = 0; i < expectedProducts.length; i++) {
        const expected = expectedProducts[i];
        const row = this.cartTableRows.nth(i);

        await assistance.sleep(500); // stability wait

        const cartProductName = (
          await row.locator(this.productNameCell).innerText()
        ).trim();

        const cartUnitPrice = Number(
          (await row.locator(this.productUnitPriceCell).innerText())
            .replace(/[₹,]/g, "")
            .trim()
        );

        const cartQuantity = Number(
          await row.locator(this.productQtyInput).inputValue()
        );

        const cartSubtotal = Number(
          (await row.locator(this.productSubtotalCell).innerText())
            .replace(/[₹,]/g, "")
            .trim()
        );

        const expectedSubtotal =
          Number(expected.getUnitPrice()) * expected.getQuantity();

        if (
          cartProductName !== expected.getProductName() ||
          cartUnitPrice !== Number(expected.getUnitPrice()) ||
          cartQuantity !== expected.getQuantity() ||
          cartSubtotal !== expectedSubtotal
        ) {
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Error validating cart:", err);
      return false;
    }
  }

  /**
   * Reads tax value from basket summary
   */
  async getTaxFromUI(): Promise<number> {
    if ((await this.taxAmountRow.count()) === 0) return 0;

    return Number(
      (await this.taxAmountRow.innerText()).replace(/[₹,]/g, "").trim()
    );
  }

  /**
   * Verifies: Total = Subtotal + Tax
   */
  async verifyCartTotals(subtotal: number, tax: number): Promise<boolean> {
    try {
      const expectedTotal = subtotal + tax;

      const uiTotal = Number(
        (await this.totalAmountRow.innerText()).replace(/[₹,]/g, "").trim()
      );

      console.log(`Subtotal: ${subtotal}`);
      console.log(`Tax: ${tax}`);
      console.log(`Expected Total: ${expectedTotal}`);
      console.log(`UI Total: ${uiTotal}`);

      return uiTotal === expectedTotal;
    } catch (error) {
      console.error("Error validating cart totals:", error);
      return false;
    }
  }
}

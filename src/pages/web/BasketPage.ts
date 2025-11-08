import { Product } from "../../data/objects/Product";
import { GeneralPage } from "./GeneralPage";

export class BasketPage extends GeneralPage {
  private readonly updateBasketBtn = this.page.getByRole("button", {
    name: "Update Basket",
  });
  private readonly applyCouponBtn = this.page.getByRole("button", {
    name: "Apply Coupon",
  });

  private readonly proceedToChkoutBtn = this.page.getByRole("link", {
    name: "Proceed to Checkout",
  });

  async proceedToCheckOut() {
    await this.proceedToChkoutBtn.click();
  }

  async open() {
    await this.cartLnk.click();
  }

  async cartProductsMatch(expectedProducts: Product[]): Promise<boolean> {
    try {
      const cartRows = this.page.locator(
        "table.shop_table.cart tbody tr.cart_item"
      );

      const rowCount = await cartRows.count();
      if (rowCount !== expectedProducts.length) return false;

      for (let i = 0; i < expectedProducts.length; i++) {
        const expected = expectedProducts[i];
        const row = cartRows.nth(i);

        const cartProductName = (
          await row.locator("td.product-name a").innerText()
        ).trim();

        const cartUnitPrice = (
          await row.locator("td.product-price .amount").innerText()
        )
          .replace(/[₹,]/g, "")
          .trim();

        const cartQuantity = Number(
          await row.locator("td.product-quantity input.qty").inputValue()
        );

        const cartSubtotal = (
          await row.locator("td.product-subtotal .amount").innerText()
        )
          .replace(/[₹,]/g, "")
          .trim();

        const expectedSubtotal =
          Number(expected.getUnitPrice()) * expected.getQuantity();

        // If any mismatch found → return false immediately
        if (
          cartProductName !== expected.getProductName() ||
          Number(cartUnitPrice) !== Number(expected.getUnitPrice()) ||
          cartQuantity !== expected.getQuantity() ||
          Number(cartSubtotal) !== expectedSubtotal
        ) {
          return false;
        }
      }

      return true; // all matched
    } catch (err) {
      console.error("Error validating cart:", err);
      return false;
    }
  }

  async getTaxFromUI(): Promise<number> {
    const taxLocator = this.page.locator(".tax-rate .amount");

    if ((await taxLocator.count()) === 0) return 0; // no tax shown

    const taxText = await taxLocator.innerText();

    return Number(taxText.replace(/[₹,]/g, "").trim());
  }

  async verifyCartTotals(subtotal: number, tax: number): Promise<boolean> {
    try {
      // Calculate expected total internally
      const expectedTotal = subtotal + tax;

      // Get Total from UI
      const uiTotal = Number(
        (await this.page.locator(".order-total .amount").innerText())
          .replace(/[₹,]/g, "")
          .trim()
      );

      // Debug logs (useful during failures)
      console.log(`Subtotal (input): ${subtotal}`);
      console.log(`Tax (input): ${tax}`);
      console.log(`Expected Total (subtotal + tax): ${expectedTotal}`);
      console.log(`UI Total: ${uiTotal}`);

      // Compare expected vs UI total
      if (uiTotal !== expectedTotal) {
        console.log("Cart Total DOES NOT match expected calculation.");
        return false;
      }

      console.log("✅ Cart Total Verified Successfully.");
      return true;
    } catch (error) {
      console.error("⚠️ Error validating cart totals:", error);
      return false;
    }
  }
}

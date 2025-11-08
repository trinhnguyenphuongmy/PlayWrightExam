import { AbstractPage } from "./AbstractPage";

export class GeneralPage extends AbstractPage {
  protected readonly loginLink = this.page.getByRole("link", {
    name: "My Account",
  });
  protected readonly cartLnk = this.page.locator(".cartcontents");
  protected readonly cartTotal = this.page.locator(
    ".wpmenucart-contents .amount"
  );

  public async clickLogIn() {
    await this.loginLink.click();
  }

  public async closePopup() {
    await this.page.getByRole("button", { name: "Close" }).click();
  }

  async getCartItemCount(): Promise<number> {
    const cartText = await this.cartLnk.innerText();

    // cartText example: "1 item" or "3 items"
    const itemCount = parseInt(cartText);

    return itemCount;
  }

  async getCartSubtotal(): Promise<number> {
    const subtotalText = await this.cartTotal.innerText();

    return parseFloat(subtotalText.replace(/[₹,]/g, ""));
  }
}

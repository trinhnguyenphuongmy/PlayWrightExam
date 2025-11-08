import { AbstractPage } from "./AbstractPage";

export class GeneralPage extends AbstractPage {
  protected readonly loginLink = this.page.getByRole("link", {
    name: "My Account",
  });

  public async clickLogIn() {
    await this.loginLink.click();
  }

  public async closePopup() {
    await this.page.getByRole("button", { name: "Close" }).click();
  }
}

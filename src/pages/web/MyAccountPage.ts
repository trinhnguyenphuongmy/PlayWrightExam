import { GeneralPage } from "./GeneralPage";
import { User } from "../../data/objects/User";
import * as assistance from "../../utils/common-utils";

export class MyAccountPage extends GeneralPage {
  private readonly registerNameInput = this.page.getByRole("textbox", {
    name: "Email address *",
    exact: true,
  });
  private readonly registerPassword = this.page.locator("#reg_password");
  private readonly passwordStrength = this.page.locator(
    ".woocommerce-password-strength"
  );
  private readonly registerBtn = this.page.getByRole("button", {
    name: "Register",
  });

  private readonly usernameInput = this.page.getByRole("textbox", {
    name: "Username or email address",
  });
  private readonly passwordInput = this.page.getByRole("textbox", {
    name: "Password",
  });
  private readonly loginButton = this.page.getByRole("button", {
    name: "Log in",
  });

  private readonly pageContent = this.page.locator(
    ".woocommerce-MyAccount-content"
  );

  public async registerNewAccount(registerUser: User) {
    await this.registerNameInput.fill(registerUser.getUsername());
    await assistance.sleep(1000);
    await this.registerPassword.click();
    await this.page.keyboard.type(registerUser.getPassword(), { delay: 100 });
    await assistance.sleep(1000);
    await this.passwordStrength.waitFor({ state: "visible" });
    await assistance.sleep(1000);
    await this.registerBtn.waitFor({ state: "visible" });
    await this.registerBtn.click();
    await this.waitForPageLoadedCompletely();
  }

  public async login(userAccount: User) {
    await this.usernameInput.fill(userAccount.getUsername());
    await this.passwordInput.fill(userAccount.getPassword());
    await this.loginButton.click();
  }

  public async isLoginPageDisplayed(): Promise<boolean> {
    const [result1, result2, result3] = await Promise.all([
      this.usernameInput.isVisible(),
      this.passwordInput.isVisible(),
      this.loginButton.isVisible(),
    ]);
    return result1 && result2 && result3;
  }

  public async doesMessageDisplayOnPage(expectedMes: string): Promise<boolean> {
    const content = await this.pageContent.textContent();
    return content?.includes(expectedMes) || false;
  }
}

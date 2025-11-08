import { GeneralPage } from "./GeneralPage";
import { BillingDetailsData } from "../../data/data/BillingDetails";

export class CheckOutPage extends GeneralPage {
  private readonly firstNameInput = this.page.getByRole("textbox", {
    name: "First Name *",
  });
  private readonly lastNameInput = this.page.getByRole("textbox", {
    name: "Last Name *",
  });
  private readonly companyNameInput = this.page.getByRole("textbox", {
    name: "Company Name",
  });
  private readonly addressInput = this.page.getByRole("textbox", {
    name: "Street address *",
  });
  private readonly emailInput = this.page.getByRole("textbox", {
    name: "Email Address *",
  });
  private readonly phoneInput = this.page.getByRole("textbox", {
    name: "Phone *",
  });
  private readonly countryCombobox = this.page.locator(".country_select");
  private readonly apartmentInput = this.page.getByRole("textbox", {
    name: "Address *",
    exact: true,
  });

  private readonly postcodeInput = this.page.getByRole("textbox", {
    name: "Postcode / ZIP",
  });
  private readonly cityInput = this.page.getByRole("textbox", {
    name: "Town / City *",
  });
  private readonly placeOrderButton = this.page.getByRole("button", {
    name: "Place order",
  });

  /**
   * Add product to basket.
   */
  async addProductToBasket(productName: string) {
    const targetAddBtn = await this.page
      .getByRole("listitem")
      .filter({ hasText: productName })
      .getByRole("link")
      .nth(1)
      .click();
  }

  /**
   * Select payment method.
   */
  async selectPaymentMethod(targetMethod: string) {
    const targetMethodLbl = this.page.getByText(targetMethod);
    await targetMethodLbl.click();
  }

  /**
   * Fill in mandatory checkout fields.
   */
  async fillValidCheckoutInformation(): Promise<void> {
    await this.firstNameInput.fill(BillingDetailsData.validFirstName);
    await this.lastNameInput.fill(BillingDetailsData.validLastName);
    await this.companyNameInput.fill(BillingDetailsData.validCompanyName);
    await this.countryCombobox.first().click();
    await this.page
      .getByRole("option", { name: BillingDetailsData.validCountry })
      .click();
    await this.addressInput.fill(BillingDetailsData.validAddress);
    await this.apartmentInput.fill(BillingDetailsData.validApartment);
    await this.postcodeInput.fill(BillingDetailsData.validPostcode);
    await this.cityInput.fill(BillingDetailsData.validCity);
    await this.phoneInput.fill(BillingDetailsData.validPhone);
    await this.emailInput.fill(BillingDetailsData.validEmail);
    await this.selectPaymentMethod(BillingDetailsData.validPaymentMethod);
  }

  /**
   * Place order.
   */
  async placeOrder() {
    await this.placeOrderButton.click();
  }
}

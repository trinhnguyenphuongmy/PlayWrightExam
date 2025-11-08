import { Page, Locator } from "@playwright/test";
import * as assistance from "../../utils/common-utils";

export abstract class AbstractPage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public get getPage(): Page {
    return this.page;
  }

  async openAUT(): Promise<void> {
    await this.page.goto("/");
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async clickLinkButton(linkBtnName: string): Promise<void> {
    const targetPageBtn = this.page.getByRole("link", { name: linkBtnName });
    await targetPageBtn.click();
    await this.waitForPageLoadedCompletely();
  }

  async waitForPageLoadedCompletely() {
    await this.page.waitForLoadState("domcontentloaded");
    await assistance.sleep(2);
  }

  public async countNumberOfControls(controlLocator: Locator): Promise<number> {
    return await controlLocator.count();
  }
}

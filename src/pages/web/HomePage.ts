import { GeneralPage } from "./GeneralPage";

export class HomePage extends GeneralPage {
  private readonly searchInput = this.page.locator('input[name="q"]');
  private readonly searchButton = this.page.locator('button[type="submit"]');
  private readonly header = this.page.locator("h1");
  private readonly homeButton = this.page.getByAltText(
    "Automation Practice Site"
  );
  private readonly allSliders = this.page.locator(
    '.n2-ss-loaded [class*="n2-ss-slider-"]'
  );
  private readonly allArrivals = this.page.locator(
    ".themify_builder_sub_row.sub_row_1-0-2 .sub_column"
  );

  public async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  public async getHeaderText(): Promise<string> {
    return (await this.header.textContent()) ?? "";
  }

  public async countNumberOfSliders(): Promise<number> {
    return await this.countNumberOfControls(this.allSliders);
  }

  public async countNumberOfArrivals(): Promise<number> {
    return await this.countNumberOfControls(this.allArrivals);
  }

  async clickHomeButton(): Promise<void> {
    await this.homeButton.click();
    await this.waitForPageLoadedCompletely();
  }
}

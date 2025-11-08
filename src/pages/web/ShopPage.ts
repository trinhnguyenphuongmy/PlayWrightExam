import { GeneralPage } from "./GeneralPage";

export class ShopPage extends GeneralPage {
  private readonly slider = this.page.locator(".price_slider");
  private readonly handles = this.slider.locator(".ui-slider-handle");
  private readonly minPriceLbl = this.page.locator("#min_price");
  private readonly maxPriceLbl = this.page.locator("#max_price");

  /**
   * Điều chỉnh thanh trượt giá theo giá trị mong muốn.
   * @param {import('@playwright/test').Page} page - Đối tượng trang Playwright
   * @param {number} targetMin - Giá trị min mong muốn (VD: 200)
   * @param {number} targetMax - Giá trị max mong muốn (VD: 400)
   */
  async adjustPriceSliderByValue(
    targetMin: number,
    targetMax: number
  ): Promise<void> {
    // Đợi slider sẵn sàng
    await this.slider.waitFor();

    // Lấy thông tin min/max từ input ẩn
    const minPrice = parseFloat(
      (await this.minPriceLbl.getAttribute("data-min")) || ""
    );
    const maxPrice = parseFloat(
      (await this.maxPriceLbl.getAttribute("data-max")) || ""
    );

    // Lấy kích thước thanh trượt
    const box = await this.slider.boundingBox();
    if (!box) throw new Error("Không tìm thấy slider trên trang.");

    const centerY = box.y + box.height / 2;

    // Tính vị trí theo giá trị (tỷ lệ theo min/max)
    const leftPercent = (targetMin - minPrice) / (maxPrice - minPrice);
    const rightPercent = (targetMax - minPrice) / (maxPrice - minPrice);

    const leftX = box.x + box.width * leftPercent;
    const rightX = box.x + box.width * rightPercent;

    // Kéo handle trái
    const leftHandle = this.handles.nth(0);
    await leftHandle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(leftX, centerY, { steps: 15 });
    await this.page.mouse.up();

    // Kéo handle phải
    const rightHandle = this.handles.nth(1);
    await rightHandle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(rightX, centerY, { steps: 15 });
    await this.page.mouse.up();
  }
}

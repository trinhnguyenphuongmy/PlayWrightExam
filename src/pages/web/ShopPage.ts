import { GeneralPage } from "./GeneralPage";
import * as assistance from "../../utils/common-utils";
import { Product } from "../../data/objects/Product";

export class ShopPage extends GeneralPage {
  private readonly slider = this.page.locator(".price_slider");
  private readonly handles = this.slider.locator(".ui-slider-handle");
  private readonly minPriceLbl = this.page.locator("#min_price");
  private readonly maxPriceLbl = this.page.locator("#max_price");
  private readonly sortCombobox = this.page.getByRole("combobox");

  async goto() {
    await this.navigateTo("/shop");
  }

  async selectProductCategory(targetItem: string): Promise<void> {
    const cat = this.page
      .getByRole("link", { name: targetItem, exact: true })
      .first();
    await cat.click();
    await this.waitForPageLoadedCompletely();
  }

  async addRandomProductToBasket() {
    const products = await this.page.getByRole("listitem").all();
    const randomIndex = Math.floor(Math.random() * products.length);

    await products[randomIndex]
      .getByRole("button", { name: /add to basket/i })
      .click();
  }

  async addProductToBasket(productName: string) {
    await this.page
      .getByRole("listitem")
      .filter({ hasText: productName })
      .getByRole("link")
      .nth(1)
      .click();
  }

  /**
   * Add N random products from different categories
   * Returns: Product[] (full product details)
   */
  async addRandomProductsFromDifferentCategories(
    categories: string[],
    count: number
  ): Promise<Product[]> {
    if (count > categories.length)
      throw new Error("Cannot pick more unique categories than provided");

    const selectedProducts: Product[] = [];
    const usedIndexes = new Set<number>();

    while (usedIndexes.size < count) {
      usedIndexes.add(Math.floor(Math.random() * categories.length));
    }

    for (const index of usedIndexes) {
      const category = categories[index];

      await this.selectProductCategory(category);

      const cards = await this.page.locator("li.product").all();
      const randomIndex = Math.floor(Math.random() * cards.length);
      const productCard = cards[randomIndex];

      const productName = (await productCard.locator("h3").innerText()).trim();
      const productPrice = (
        await productCard.locator(".price .amount").first().innerText()
      )
        .replace(/[₹,]/g, "")
        .trim();

      await productCard.getByRole("link", { name: /add to basket/i }).click();
      await this.page.locator("li.wpmenucartli a").click();

      const cartRow = this.page.locator("tr.cart_item", {
        hasText: productName,
      });
      const unitPrice = (
        await cartRow.locator("td.product-price .amount").innerText()
      )
        .replace(/[₹,]/g, "")
        .trim();

      const quantity = Number(
        await cartRow.locator("td.product-quantity input.qty").inputValue()
      );

      selectedProducts.push(
        new Product(productName, productPrice, unitPrice, quantity)
      );

      await this.page.goBack();
    }

    return selectedProducts;
  }

  /**
   * Read TAX from UI (₹)
   */
  async getTaxFromUI(): Promise<number> {
    const taxText = await this.page
      .locator("tr.tax-rate td .amount")
      .innerText();
    return Number(taxText.replace(/[₹,]/g, "").trim());
  }

  /**
   * Read TOTAL from UI (₹)
   */
  async getTotalFromUI(): Promise<number> {
    const totalText = await this.page
      .locator("tr.order-total td .amount")
      .innerText();
    return Number(totalText.replace(/[₹,]/g, "").trim());
  }

  /**
   * Verify: total = subtotal + tax
   * subtotal is computed from product list
   * @param products Product[]
   */
  async verifyCartTotals(products: Product[]): Promise<boolean> {
    const subtotal = products.reduce(
      (sum, p) => sum + Number(p.getUnitPrice()) * p.getQuantity(),
      0
    );

    const tax = await this.getTaxFromUI();
    const total = await this.getTotalFromUI();

    console.log("Calculated subtotal:", subtotal);
    console.log("UI tax:", tax);
    console.log("UI total:", total);

    return total === subtotal + tax;
  }

  /** ---------------- existing functions below ---------------- **/

  async verifyPricesHighToLow(): Promise<boolean> {
    const prices = await this.page.$$eval("ul.products li .price", (nodes) => {
      return nodes.map((node) => {
        const priceEl =
          node.querySelector("ins .woocommerce-Price-amount") ||
          node.querySelector(".woocommerce-Price-amount");

        return priceEl
          ? parseFloat(priceEl.textContent!.replace(/[₹,]/g, ""))
          : 0;
      });
    });

    const sortedPrices = [...prices].sort((a, b) => b - a);
    return JSON.stringify(prices) === JSON.stringify(sortedPrices);
  }

  async verifyProductTitlesContain(keyword: string): Promise<boolean> {
    const titles = await this.page.$$eval("ul.products li h3", (nodes) =>
      nodes.map((node) => node.textContent?.trim() || "")
    );
    return titles.every((t) => t.toLowerCase().includes(keyword.toLowerCase()));
  }

  async selectSortOption(targetOption: string): Promise<void> {
    await this.sortCombobox.click();
    await assistance.sleep(500);
    await this.sortCombobox.selectOption(targetOption);
    await this.waitForPageLoadedCompletely();
  }

  async adjustPriceSliderByValue(
    targetMin: number,
    targetMax: number
  ): Promise<void> {
    const box = await this.slider.boundingBox();
    if (!box) throw new Error("Slider not found");

    const minVal = parseFloat(
      (await this.minPriceLbl.getAttribute("data-min")) || ""
    );
    const maxVal = parseFloat(
      (await this.maxPriceLbl.getAttribute("data-max")) || ""
    );

    const leftX =
      box.x + box.width * ((targetMin - minVal) / (maxVal - minVal));
    const rightX =
      box.x + box.width * ((targetMax - minVal) / (maxVal - minVal));
    const centerY = box.y + box.height / 2;

    const leftHandle = this.handles.nth(0);
    const rightHandle = this.handles.nth(1);

    await leftHandle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(leftX, centerY);
    await this.page.mouse.up();

    await rightHandle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(rightX, centerY);
    await this.page.mouse.up();
  }
}

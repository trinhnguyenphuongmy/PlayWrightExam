import { GeneralPage } from "./GeneralPage";
import * as assistance from "../../utils/common-utils";
import { Product } from "../../data/objects/Product";

export class ShopPage extends GeneralPage {
  // -----------------------
  // ✅ Locators (Top of class)
  // -----------------------

  private readonly productListItems = this.page.getByRole("listitem");
  private readonly productCards = this.page.locator("li.product");
  private readonly addToBasketBtn = "a.button"; // generic add to basket button inside product
  private readonly productNameSelector = "h3";
  private readonly productPriceSelector = ".price .amount";
  private readonly categorySidebar = this.page.locator(".product-categories");
  private readonly cartIcon = this.page.locator("li.wpmenucartli a");

  private readonly slider = this.page.locator(".price_slider");
  private readonly sliderHandles = this.slider.locator(".ui-slider-handle");

  private readonly minPriceHiddenLbl = this.page.locator("#min_price");
  private readonly maxPriceHiddenLbl = this.page.locator("#max_price");

  private readonly sortCombobox = this.page.getByRole("combobox");

  // -----------------------
  // ✅ Actions
  // -----------------------

  async goto() {
    await this.navigateTo("/shop");
  }

  /**
   * Add product by name
   */
  async addProductToBasket(productName: string) {
    await this.productListItems
      .filter({ hasText: productName })
      .getByRole("link")
      .nth(1)
      .click();
  }

  /**
   * Add a random product to basket
   */
  async addRandomProductToBasket() {
    const products = await this.productListItems.all();
    const randomIndex = Math.floor(Math.random() * products.length);

    console.log(`Adding product at index: ${randomIndex}`);

    await products[randomIndex]
      .getByRole("button", { name: /add to basket/i })
      .click();
  }

  /**
   * Return any 2 different random categories from list
   */
  async getTwoDifferentRandomCategories(
    categories: string[]
  ): Promise<string[]> {
    if (categories.length < 2)
      throw new Error("Input array must contain at least 2 categories.");

    const pickedIndexes = new Set<number>();
    while (pickedIndexes.size < 2) {
      pickedIndexes.add(Math.floor(Math.random() * categories.length));
    }

    return [...pickedIndexes].map((index) => categories[index]);
  }

  /**
   * Adds random products from different categories (count)
   * Returns the list of selected Product objects
   */
  async addRandomProductsFromDifferentCategories(
    categories: string[],
    count: number
  ): Promise<Product[]> {
    if (count > categories.length) {
      throw new Error(
        `Count (${count}) cannot exceed available categories (${categories.length})`
      );
    }

    const selectedProducts: Product[] = [];
    const usedIndexes = new Set<number>();

    while (usedIndexes.size < count) {
      usedIndexes.add(Math.floor(Math.random() * categories.length));
    }

    for (const index of usedIndexes) {
      const category = categories[index];

      // Open category in sidebar
      await this.categorySidebar
        .getByRole("link", { name: new RegExp(category, "i") })
        .first()
        .click();

      const productCards = await this.productCards.all();
      const randomIndex = Math.floor(Math.random() * productCards.length);
      const productCard = productCards[randomIndex];

      // Extract product name & listing price
      const productName = (
        await productCard.locator(this.productNameSelector).innerText()
      ).trim();
      const displayedPrice = (
        await productCard.locator(this.productPriceSelector).first().innerText()
      )
        .replace(/[₹,]/g, "")
        .trim();

      // Add to basket
      await productCard.locator(this.addToBasketBtn).click();
      await assistance.sleep(2000);

      // Open cart to confirm pricing
      await this.cartIcon.click();
      await assistance.sleep(2000);

      const cartRow = this.page.locator("tr.cart_item", {
        hasText: productName,
      });

      const unitPrice = Number(
        (await cartRow.locator("td.product-price .amount").innerText())
          .replace(/[₹,]/g, "")
          .trim()
      );

      const quantity = Number(
        await cartRow.locator("td.product-quantity input.qty").inputValue()
      );

      selectedProducts.push(
        new Product(productName, displayedPrice, String(unitPrice), quantity)
      );

      // return to shop
      await this.page.goBack();
    }

    return selectedProducts;
  }

  /**
   * Verify prices sorted high → low
   */
  async verifyPricesHighToLow(): Promise<boolean> {
    const prices = await this.page.$$eval("ul.products li .price", (nodes) =>
      nodes.map((node) => {
        const priceEl =
          node.querySelector("ins .woocommerce-Price-amount") ||
          node.querySelector(".woocommerce-Price-amount");

        return priceEl
          ? parseFloat(priceEl.textContent!.replace(/[₹,]/g, ""))
          : 0;
      })
    );

    const sorted = [...prices].sort((a, b) => b - a);
    return JSON.stringify(prices) === JSON.stringify(sorted);
  }

  /**
   * Verify all product titles contain keyword (case-insensitive)
   */
  async verifyProductTitlesContain(keyword: string): Promise<boolean> {
    const titles = await this.page.$$eval("ul.products li h3", (nodes) =>
      nodes.map((node) => node.textContent?.trim() || "")
    );

    return titles.every((title) =>
      title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async selectSortOption(targetOption: string): Promise<void> {
    await this.sortCombobox.selectOption(targetOption);
    await this.waitForPageLoadedCompletely();
  }

  /**
   * Adjust price slider to given min/max
   */
  async adjustPriceSliderByValue(
    targetMin: number,
    targetMax: number
  ): Promise<void> {
    await this.slider.waitFor();

    const minPrice = parseFloat(
      (await this.minPriceHiddenLbl.getAttribute("data-min")) || ""
    );
    const maxPrice = parseFloat(
      (await this.maxPriceHiddenLbl.getAttribute("data-max")) || ""
    );

    const sliderBox = await this.slider.boundingBox();
    if (!sliderBox) throw new Error("Slider not found.");

    const centerY = sliderBox.y + sliderBox.height / 2;

    const leftX =
      sliderBox.x +
      sliderBox.width * ((targetMin - minPrice) / (maxPrice - minPrice));
    const rightX =
      sliderBox.x +
      sliderBox.width * ((targetMax - minPrice) / (maxPrice - minPrice));

    await this.sliderHandles.nth(0).hover();
    await this.page.mouse.down();
    await this.page.mouse.move(leftX, centerY, { steps: 15 });
    await this.page.mouse.up();

    await this.sliderHandles.nth(1).hover();
    await this.page.mouse.down();
    await this.page.mouse.move(rightX, centerY, { steps: 15 });
    await this.page.mouse.up();
  }
}

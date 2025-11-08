import { GeneralPage } from "./GeneralPage";
import * as assistance from "../../utils/common-utils";
import { Product } from "../../data/objects/Product";

export class ShopPage extends GeneralPage {
  private readonly slider = this.page.locator(".price_slider");
  private readonly handles = this.slider.locator(".ui-slider-handle");
  private readonly minPriceLbl = this.page.locator("#min_price");
  private readonly maxPriceLbl = this.page.locator("#max_price");
  private readonly sortCombobox = this.page.getByRole("combobox");

  async addProductToBasket(productName: string) {
    const targetAddBtn = await this.page
      .getByRole("listitem")
      .filter({ hasText: productName })
      .getByRole("link")
      .nth(1)
      .click();
  }

  /**
   * Add random product to basket
   */
  async addRandomProductToBasket() {
    // get all product listitems
    const products = await this.page.getByRole("listitem").all();

    // choose a random index
    const randomIndex = Math.floor(Math.random() * products.length);

    console.log(`Adding product at index: ${randomIndex}`);

    // click the Add to basket button inside that product
    await products[randomIndex]
      .getByRole("button", { name: /add to basket/i })
      .click();
  }

  async getTwoDifferentRandomCategories(
    categories: string[]
  ): Promise<string[]> {
    if (categories.length < 2) {
      throw new Error("Input array must contain at least 2 categories.");
    }

    const usedIndexes = new Set<number>();

    while (usedIndexes.size < 2) {
      const randomIndex = Math.floor(Math.random() * categories.length);
      usedIndexes.add(randomIndex);
    }

    return [...usedIndexes].map((index) => categories[index]);
  }

  /**
   * Adds one random product from each of N different categories.
   * Returns the list of all added products.
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

    // pick distinct categories randomly
    while (usedIndexes.size < count) {
      usedIndexes.add(Math.floor(Math.random() * categories.length));
    }

    for (const index of usedIndexes) {
      const category = categories[index];

      // Open category

      await this.page
        .locator(".product-categories")
        .getByRole("link", { name: new RegExp(category, "i") })
        .first()
        .click();

      // Get products in this category
      const productCards = await this.page.locator("li.product").all();
      const randomIndex = Math.floor(Math.random() * productCards.length);
      const productCard = productCards[randomIndex];

      // Extract product details
      await assistance.sleep(3000);
      const productName = (await productCard.locator("h3").innerText()).trim();

      const productPriceText = await productCard
        .locator(".price .amount")
        .first()
        .innerText();
      const productPrice = productPriceText.replace(/[₹,]/g, "").trim();

      await assistance.sleep(2000);
      await productCard.getByRole("link", { name: /add to basket/i }).click();

      // After adding, go to cart page to get accurate unit price
      await assistance.sleep(3000);
      await this.page.locator("li.wpmenucartli a").click(); // redirect to basket page

      const cartRow = this.page.locator("tr.cart_item", {
        hasText: productName,
      });

      const unitPriceText = await cartRow
        .locator("td.product-price .amount")
        .innerText();

      await assistance.sleep(2000);
      const unitPrice = unitPriceText.replace(/[₹,]/g, "").trim();

      const quantity = Number(
        await cartRow.locator("td.product-quantity input.qty").inputValue()
      );

      // Save full product info
      selectedProducts.push(
        new Product(productName, productPrice, unitPrice, quantity)
      );

      await assistance.sleep(3000);
      await this.page.goBack(); // return to products list
    }

    return selectedProducts;
  }

  /**
   * Navigate to Shop page
   */

  async goto() {
    await this.navigateTo("/shop");
  }

  /**
   * Select product category
   */

  async selectProductCategory(targetItem: string): Promise<void> {
    const targetCatergory = this.page.getByRole("link", {
      name: targetItem,
      exact: true,
    });
    await targetCatergory.click();
    await this.waitForPageLoadedCompletely();
  }

  async verifyPricesHighToLow(): Promise<boolean> {
    // Select all LI elements that contain product price
    const prices = await this.page.$$eval(
      "ul.products li .price",
      (priceNodes) => {
        return priceNodes.map((node) => {
          // Look for discounted price (<ins>) first, else take normal price
          const priceEl =
            node.querySelector("ins .woocommerce-Price-amount") ||
            node.querySelector(".woocommerce-Price-amount");

          // Extract number, remove ₹ and convert to float
          if (!priceEl) return 0; // fallback if not found

          return parseFloat(priceEl.textContent!.replace(/[₹,]/g, ""));
        });
      }
    );

    console.log("Captured Prices:", prices);

    // Copy array and sort it descending (high → low)
    const sortedPrices = [...prices].sort((a, b) => b - a);

    // Return true/false if actual == expected order
    return JSON.stringify(prices) === JSON.stringify(sortedPrices);
  }

  /**
   * Verify all product names contain the given keyword
   */
  async verifyProductTitlesContain(keyword: string): Promise<boolean> {
    // Grab all product titles inside the product list
    const productTitles = await this.page.$$eval(
      "ul.products li h3",
      (titleNodes) => titleNodes.map((node) => node.textContent?.trim() || "")
    );

    console.log("Product Titles Found:", productTitles);

    // Case-insensitive comparison
    const allContain = productTitles.every((title) =>
      title.toLowerCase().includes(keyword.toLowerCase())
    );

    return allContain;
  }

  /**
   * Select sort option
   */

  async selectSortOption(targetOption: string): Promise<void> {
    await this.sortCombobox.click();
    await assistance.sleep(1000);
    await this.sortCombobox.selectOption(targetOption);
    await this.waitForPageLoadedCompletely();
  }

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

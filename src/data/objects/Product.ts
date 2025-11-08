export class Product {
  constructor(
    private productName: string,
    private productPrice: string,
    private unitPrice: string,
    private quantity: number
  ) {}

  getProductName() {
    return this.productName;
  }

  getProductPrice() {
    return this.productPrice;
  }

  getUnitPrice() {
    return this.unitPrice;
  }

  getQuantity() {
    return this.quantity;
  }
}

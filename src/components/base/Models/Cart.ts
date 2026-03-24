import { IProduct } from "../../../types";

export class Cart {
  private products: IProduct[];

  constructor() {
    this.products = [];
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct) {
    this.products.push(product);
  }

  removeProduct(id: string) {
    return (this.products = this.products.filter((n) => n.id !== id));
  }

  clearCart() {
    this.products = [];
  }

  getAllCost(): number {
    return this.products.reduce((acc, el) => acc + (el.price ?? 0), 0);
  }

  getQuantity(): number {
    return this.products.length;
  }

  hasProduct(id: string): boolean {
    return this.products.some((n) => n.id === id);
  }
}

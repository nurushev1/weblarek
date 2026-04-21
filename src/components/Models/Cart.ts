import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
  private products: IProduct[];
  private events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.events = events;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  addProduct(product: IProduct) {
    this.products.push(product);

    this.events.emit('cart:changed', {
      products: this.products,
    });
  }

  removeProduct(id: string) {
    this.products = this.products.filter((n) => n.id !== id);

    this.events.emit('cart:changed', {
      products: this.products,
    });
  }

  clearCart() {
    this.products = [];

    this.events.emit('cart:changed', {
      products: this.products,
    });
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
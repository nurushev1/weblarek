import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ProductCatalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.products = [];
    this.selectedProduct = null;
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;

    this.events.emit('catalog:changed', {
      products: this.products,
    });
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((n) => n.id === id);
  }

  setSelectedProduct(product: IProduct) {
    this.selectedProduct = product;

    this.events.emit('product:selected', {
      product: this.selectedProduct,
    });
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
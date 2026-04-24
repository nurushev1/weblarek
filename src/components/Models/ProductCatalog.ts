import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class ProductCatalog {
  private products: IProduct[] = []
  private selectedProduct: IProduct | null = null
  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  setProducts(products: IProduct[]): void {
    this.products = products.slice()
    this.events.emit<IProduct[]>('catalog:change', this.products.slice())
  }

  getProducts(): IProduct[] {
    return this.products
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find(el => el.id === id)
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product
    this.events.emit<IProduct>('catalog:item-selected', product)
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct
  }
}
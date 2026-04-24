import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Cart {
  private products: IProduct[] = []
  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  getProducts(): IProduct[] {
    return this.products
  }

  addProduct(product: IProduct): void {
    this.products.push(product)
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
  }

  removeProduct(id: string): IProduct[] {
    this.products = this.products.filter(p => p.id !== id)
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
    return this.products
  }

  clearCart(): void {
    this.products = []
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
  }

  getAllCost(): number {
    return this.products.reduce((acc, el) => acc + (el.price ?? 0), 0)
  }

  getQuantity(): number {
    return this.products.length
  }

  hasProduct(id: string): boolean {
    return this.products.some(p => p.id === id)
  }
}
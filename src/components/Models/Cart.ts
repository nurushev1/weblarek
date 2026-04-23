import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Cart {
  private items: IProduct[] = []
  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  getItems(): IProduct[] {
    return this.items
  }

  addItem(product: IProduct): void {
    this.items.push(product)
    this.events.emit<IProduct[]>('cart:change', this.items.slice())
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter(p => p.id !== product.id)
    this.events.emit<IProduct[]>('cart:change', this.items.slice())
  }

  clearCart(): void {
    this.items = []
    this.events.emit<IProduct[]>('cart:change', this.items.slice())
  }

  getTotal(): number {
    return this.items.reduce((total, product) => {
      return total + (product.price ?? 0)
    }, 0)
  }

  getCount(): number {
    return this.items.length
  }

  contains(productId: string): boolean {
    return this.items.some(product => product.id === productId)
  }
}
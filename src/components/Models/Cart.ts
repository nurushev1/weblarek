import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Cart {
  private products: IProduct[] = []
  private events: IEvents

  constructor(events: IEvents){
    this.events = events
  }

  getProducts(): IProduct[] {
    return this.products
  }

  addProduct(product: IProduct): void {
    this.products.push(product)
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
  }

  removeProduct(product: IProduct): void {
    this.products = this.products.filter(p => p.id !== product.id)
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
  }

  clear(): void {
    this.products = []
    this.events.emit<IProduct[]>('cart:change', this.products.slice())
  }

  getTotalPrice(): number {
    return this.products.reduce((total, product) => {
      return total + (product.price ?? 0)
    }, 0)
  }

  getItemCount(): number {
    return this.products.length
  }

  hasProduct(productId: string): boolean {
    return this.products.some(product => product.id === productId)
  }
}
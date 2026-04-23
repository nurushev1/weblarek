import { IProduct } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class ProductCatalog {
  private items: IProduct[] = []
  private selected: IProduct | null = null
  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  setItems(items: IProduct[]): void {
    this.items = items.slice()
    this.events.emit<IProduct[]>('catalog:change', this.items.slice())
  }

  getItems(): IProduct[] {
    return this.items
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(el => el.id === id)
  }

  selectItem(item: IProduct): void {
    this.selected = item
    this.events.emit<IProduct>('catalog:item-selected', item)
  }

  getSelected(): IProduct | null {
    return this.selected
  }
}
import {IProduct} from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class ProductCatalog {
  private itemList: IProduct[] = []
  private selectedItem: IProduct|null = null
  private events: IEvents

  constructor(events: IEvents){
    this.events = events
  }

   updateItemList(items: IProduct[]): void {
    this.itemList = items.slice()
    this.events.emit<IProduct[]>('catalog:change', this.itemList.slice())
   }

   getItemList(): IProduct[] {
    return this.itemList
   }

   getItemById(id: string): IProduct|undefined {
    return this.itemList.find(el => el.id === id)
   }

   setSelectedItem(item: IProduct): void {
    this.selectedItem = item
    this.events.emit<IProduct>('catalog:item-selected', item)
   }

   getSelectedItem(): IProduct|null {
    return this.selectedItem
   }
}
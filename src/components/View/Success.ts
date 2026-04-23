import { Component } from "../base/Component" 
import { IOrderResponse } from "../../types";
import { IEvents } from "../base/Events"
import { ensureElement } from "../../utils/utils" 

export class Success extends Component<IOrderResponse> {
  protected title: HTMLElement
  protected closeButton: HTMLButtonElement
  protected description: HTMLElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.description = ensureElement<HTMLElement>(
      '.order-success__description',
      container
    )

    this.title = ensureElement<HTMLElement>(
      '.order-success__title',
      container
    )

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      container
    )

    this.closeButton.addEventListener('click', () => {
      this.events.emit('success:close')
    })
  }

  setTotal(value: number): void {
    this.description.textContent = `Списано ${value} синапсов`
  }
}
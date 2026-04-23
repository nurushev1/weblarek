import { ensureElement } from "../../utils/utils" 
import { TPayment } from "../../types";
import { IEvents } from "../base/Events"
import { Form } from "./Form";

export class OrderForm extends Form {
  protected addressInput: HTMLInputElement
  protected cardButton: HTMLButtonElement
  protected cashButton: HTMLButtonElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this.cardButton = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container
    )

    this.cashButton = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container
    )

    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container
    )

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order:change', { payment: 'card' })
    })

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order:change', { payment: 'cash' })
    })

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:change', {
        address: this.addressInput.value
      })
    })
  }

  setAddressValue(value: string): void {
    this.addressInput.value = value
  }

  setPaymentMethod(status: TPayment): void {
    this.cardButton.classList.toggle(
      'button_alt-active',
      status === 'card'
    )

    this.cashButton.classList.toggle(
      'button_alt-active',
      status === 'cash'
    )
  }

  protected onSubmit(): void {
    this.events.emit('order:submit')
  }
}
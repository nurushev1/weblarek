import { ensureElement } from "../../utils/utils" 
import { IEvents } from "../base/Events"
import { Form } from "./Form";

export class ContactsForm extends Form {
  protected emailInput: HTMLInputElement
  protected phoneInput: HTMLInputElement

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events)

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    )

    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    )

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        email: this.emailInput.value
      })
    })

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:change', {
        phone: this.phoneInput.value
      })
    })
  }

  setEmailValue(value: string): void {
    this.emailInput.value = value
  }

  setPhoneValue(value: string): void {
    this.phoneInput.value = value
  }

  protected onSubmit(): void {
    this.events.emit('contacts:submit')
  }
}
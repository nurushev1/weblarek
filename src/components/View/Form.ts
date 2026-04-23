import { Component } from "../base/Component" 
import { ensureElement } from "../../utils/utils" 
import { IEvents } from "../base/Events"

export abstract class Form extends Component<HTMLElement> {
  protected submitButton: HTMLButtonElement
  protected errors: HTMLElement

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container)

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    )

    this.errors = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    )

    this.container.addEventListener('submit', (e) => {
      e.preventDefault()
      this.onSubmit()
    })
  }

  setError(message: string): void {
    this.errors.textContent = message
    this.errors.classList.toggle('form__errors-active', !!message)
  }

  setSubmitState(enabled: boolean): void {
    this.submitButton.disabled = !enabled
  }

  protected abstract onSubmit(): void
}
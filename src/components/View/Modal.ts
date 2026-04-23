import { Component } from "../base/Component" 
import { ensureElement } from "../../utils/utils" 
import { IEvents } from "../base/Events"

export class Modal extends Component<HTMLElement> {
  protected content: HTMLElement
  protected closeButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container)

    this.content = ensureElement<HTMLElement>(
      '.modal__content',
      this.container
    )

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    )

    this.closeButton.addEventListener('click', () => {
      this.close()
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target === event.currentTarget) {
        this.close()
      }
    });
  }

  open(content: HTMLElement): void {
    this.container.classList.add('modal_active')
    this.content.replaceChildren(content)
  }

  close(): void {
    this.container.classList.remove('modal_active')
    this.events.emit('modal:close')
  }
}
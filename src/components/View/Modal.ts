import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Modal extends Component<unknown> {
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.contentElement = ensureElement(
      '.modal__content',
      this.container
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      '.modal__close',
      this.container
    );

    this.closeButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  clear() {
    this.contentElement.innerHTML = '';
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.clear();
    this.events.emit('modal:close');
  }
}
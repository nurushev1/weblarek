import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IBasket {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected button: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.listElement = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );

    this.priceElement = ensureElement<HTMLElement>(
      '.basket__price',
      this.container
    );

    this.button = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );

    this.button.addEventListener('click', () => {
      this.events.emit('order:start');
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.button.disabled = value;
  }
}
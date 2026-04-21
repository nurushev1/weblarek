import { ProductCard } from './ProductCard';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../types';

export class BasketCard extends ProductCard {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;
  protected _id!: string;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.indexElement = ensureElement<HTMLElement>(
      '.basket__item-index',
      this.container
    );

    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
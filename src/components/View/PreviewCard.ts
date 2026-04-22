import { ProductCard } from './ProductCard';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../../types';

export class PreviewCard extends ProductCard {
  protected button: HTMLButtonElement;
  protected _id: string = '';
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.events = events;

    this.button = ensureElement<HTMLButtonElement>(
      '.card__button',
      this.container
    );

    this.button.addEventListener('click', () => {
      if (!this._id) return;

      this.events.emit('product:toggle', { id: this._id });
    });
  }

  set id(value: string) {
    this._id = value;
  }

  set inCart(value: boolean) {
    this.button.textContent = value
      ? 'Удалить из корзины'
      : 'В корзину';
  }
}
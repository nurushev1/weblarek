import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

interface IProductCard {
  title: string;
  price: number | null;
  image: string;
}

export abstract class ProductCard extends Component<IProductCard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      '.card__title',
      this.container
    );

    this.priceElement = ensureElement<HTMLElement>(
      '.card__price',
      this.container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      '.card__image',
      this.container
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} ₽`;
  }

  set image(value: string) {
    this.imageElement.src = CDN_URL + value;
  };
}
import { ProductCard } from './ProductCard';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

export type TCardCatalog = {
  category: string;
  image: string;
};

export class CardCatalog extends ProductCard {
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      '.card__category',
      this.container
    );

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }
}
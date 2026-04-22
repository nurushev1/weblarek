import { ProductCard } from './ProductCard';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

type CategoryKey = keyof typeof categoryMap;

interface ICardActions {
  onClick?: (event: MouseEvent) => void;
}

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

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const key = value as CategoryKey;

    if (categoryMap[key]) {
      this.categoryElement.classList.add(categoryMap[key]);
    }
  }
}
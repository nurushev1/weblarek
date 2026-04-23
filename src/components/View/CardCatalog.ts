import { ProductCard } from "./ProductCard";
import { IProduct } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class CardCatalog extends ProductCard {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(protected events: IEvents, onSelect: () => void) {
    super(events, "#card-catalog");

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.container.addEventListener("click", onSelect);
  }

  render(product: IProduct): HTMLElement {
    this.setBaseData(product);

    this.categoryElement.className =
      `card__category ${categoryMap[product.category as keyof typeof categoryMap]}`;

    this.categoryElement.textContent = product.category;

    this.setImage(
      this.imageElement,
      `${CDN_URL}/${product.image}`,
      product.title
    );

    return this.container;
  }
}
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ProductCard } from "./ProductCard";
import { IProduct } from "../../types";
import { categoryMap, CDN_URL } from "../../utils/constants";

export class PreviewCard extends ProductCard {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(protected events: IEvents, onAction: () => void) {
    super(events, "#card-preview");

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );

    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.actionButton.addEventListener("click", onAction);
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

    this.descriptionElement.textContent = product.description;

    return this.container;
  }

  setActionText(text: string): void {
    this.actionButton.textContent = text;
  }

  setActionDisabled(disabled: boolean): void {
    this.actionButton.disabled = disabled;
  }
}
import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ProductCard } from "./ProductCard";

export class BasketCard extends ProductCard {
  protected index: HTMLElement;
  protected removeButton: HTMLButtonElement;

  constructor(protected events: IEvents, onRemove: () => void) {
    super(events, "#card-basket");

    this.index = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    this.removeButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.removeButton.addEventListener("click", onRemove);
  }

  render(product: IProduct & { index?: number }): HTMLElement {
    this.setBaseData(product);

    this.index.textContent = String((product.index ?? 0) + 1);

    return this.container;
  }
}
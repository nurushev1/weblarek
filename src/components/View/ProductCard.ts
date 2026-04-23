import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IProduct } from "../../types";
import { cloneTemplate, ensureElement } from "../../utils/utils";

export abstract class ProductCard extends Component<IProduct> {
  protected priceElement: HTMLElement;
  protected titleElement: HTMLElement;

  constructor(protected events: IEvents, template: string) {
    super(cloneTemplate<HTMLElement>(template));

    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
  }

  protected setBaseData(product: IProduct): void {
    this.titleElement.textContent = product.title;
    this.priceElement.textContent = product.price
      ? `${product.price} синапсов`
      : "Бесценно";
  }

  abstract render(product: IProduct): HTMLElement;
}
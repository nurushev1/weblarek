import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";

interface IBasketData {
  items: HTMLElement[],
  total: number
}

export class Basket extends Component<IBasketData> {
  protected list: HTMLElement
  protected price: HTMLElement
  protected title: HTMLElement
  protected orderButton: HTMLButtonElement

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container)

    this.orderButton = ensureElement<HTMLButtonElement>(
      '.basket__button',
      this.container
    );

    this.title = ensureElement<HTMLElement>(
      '.modal__title',
      this.container
    );

    this.price = ensureElement<HTMLElement>(
      '.basket__price',
      this.container
    );

    this.list = ensureElement<HTMLElement>(
      '.basket__list',
      this.container
    );

    this.items = []

    this.orderButton.addEventListener('click', () => {
      this.events.emit('cart:order')
    });
  }

  set items(value: HTMLElement[] | undefined | null) {
    if (!value || value.length === 0) {
      this.list.innerHTML = 'Корзина пуста'
      this.list.classList.add('basket__list-disabled')
      this.orderButton.disabled = true
    } else {
      this.list.replaceChildren(...value)
      this.list.classList.remove('basket__list-disabled')
      this.orderButton.disabled = false
    }
  }

  set total(value: number) {
    this.price.textContent = `${value} синапсов`
  }
}
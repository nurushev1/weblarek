import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

type TPayment = 'card' | 'cash';

export class OrderForm extends Form {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.events = events;

    this.cardButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container
    );

    this.cardButton.addEventListener('click', () => {
      this.setPayment('card');
    });

    this.cashButton.addEventListener('click', () => {
      this.setPayment('cash');
    });

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('order:submit');
    });
  }

  protected setPayment(payment: TPayment) {
    this.cardButton.classList.toggle(
      'button_alt-active',
      payment === 'card'
    );

    this.cashButton.classList.toggle(
      'button_alt-active',
      payment === 'cash'
    );

    this.events.emit('order:payment', { payment });
  }
}
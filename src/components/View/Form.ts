import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IForm {
  valid: boolean;
  errors: string;
}

export class Form extends Component<IForm> {
  protected submitButton: HTMLButtonElement;
  protected errorElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);

    this.events = events;

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );

    this.errorElement = ensureElement<HTMLElement>(
      '.form__errors',
      this.container
    );

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.events.emit('form:submit');
    });

    this.container.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;

      if (!target.name) return;

      this.events.emit('form:change', {
        field: target.name,
        value: target.value,
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorElement.textContent = value;
  }
}
import { Form } from './Form';
import { IEvents } from '../base/Events';

export class ContactsForm extends Form {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.container.addEventListener('submit', (event: Event) => {
      event.preventDefault();
      events.emit('contacts:submit');
    });
  }
}
import { IBuyer, TPayment, IErrors } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Buyer {
  private payment: TPayment = ''
  private address: string = ''
  private email: string = ''
  private phone: string = ''

  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) {
      this.payment = data.payment
      this.events.emit('buyer:changed', { field: 'payment' })
    }

    if (data.address !== undefined) {
      this.address = data.address
      this.events.emit('buyer:changed', { field: 'address' })
    }

    if (data.email !== undefined) {
      this.email = data.email
      this.events.emit('buyer:changed', { field: 'email' })
    }

    if (data.phone !== undefined) {
      this.phone = data.phone
      this.events.emit('buyer:changed', { field: 'phone' })
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    }
  }

  clearData() {
    this.payment = ''
    this.address = ''
    this.email = ''
    this.phone = ''
    this.events.emit('buyer:changed')
  }

  validateData(): IErrors {
    const errors: IErrors = {}

    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты'
    }

    if (!this.address.trim()) {
      errors.address = 'Введите адрес'
    }

    if (!this.email.trim()) {
      errors.email = 'Введите email'
    }

    if (!this.phone.trim()) {
      errors.phone = 'Введите телефон'
    }

    return errors
  }
}
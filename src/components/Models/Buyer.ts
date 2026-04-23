import { IBuyer, TPayment, IErrors } from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Buyer {
  private paymentMethod: TPayment = ''
  private address: string = ''
  private phone: string = ''
  private email: string = ''
  private events: IEvents

  constructor(events: IEvents) {
    this.events = events
  }

  setPaymentMethod(payment: TPayment): void {
    this.paymentMethod = payment;
    this.events.emit('buyer:changed', { field: 'paymentMethod' })
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed', { field: 'address' })
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed', { field: 'email' })
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed', { field: 'phone' })
  }

  getBuyerData(): IBuyer {
    return {
      payment: this.paymentMethod,
      address: this.address,
      phone: this.phone,
      email: this.email
    }
  }

  reset(): void {
    this.paymentMethod = ''
    this.address = ''
    this.phone = ''
    this.email = ''
    this.events.emit('buyer:changed')
  }

  validate(): IErrors {
    const errors: IErrors = {};

    if (!this.paymentMethod) {
      errors.payment = 'Выберите способ оплаты'
    }
    if (!this.address.trim()) {
      errors.address = 'Введите адрес'
    }
    if (!this.phone.trim()) {
      errors.phone = 'Введите телефон'
    }
    if (!this.email.trim()) {
      errors.email = 'Введите email'
    }

    return errors
  }
}
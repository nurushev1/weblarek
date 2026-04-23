import {IBuyer, TPayment, IErrors} from '../../types/index.ts'
import { IEvents } from '../base/Events.ts'

export class Buyer {
  private payment: TPayment = ''
  private address: string = ''
  private phone: string = ''
  private email: string = ''
  private events: IEvents

  constructor(events: IEvents){
    this.events = events
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('buyer:changed', { field: 'payment' })
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

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email
    }
  }

  clearData(): void {
  this.payment = ''
  this.address = ''
  this.phone = ''
  this.email = ''
  this.events.emit('buyer:changed')
  }

  validation(): IErrors {
    const errors: IErrors = {};
    
    if (!this.payment) {
      errors.payment = 'Выберите способ оплаты'
    }
    if (!this.address.trim()) {
      errors.address = 'Введите адрес'
    }
    if (!this.phone.trim()) {
      errors.phone = 'ВВедите телефон'
    }
    if (!this.email.trim()) {
      errors.email = 'Введите email'
    }
    return errors
  }
}
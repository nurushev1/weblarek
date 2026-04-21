import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  private payment: TPayment;
  private address: string;
  private email: string;
  private phone: string;

  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;

    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";
  }

  setData(data: Partial<IBuyer>) {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    this.events.emit("buyer:changed", this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearData() {
    this.payment = "";
    this.address = "";
    this.email = "";
    this.phone = "";

    this.events.emit("buyer:changed", this.getData());
  }

  validateData(): Partial<Record<keyof IBuyer, string>> {
    const result: Partial<Record<keyof IBuyer, string>> = {};

    if (this.payment === "") {
      result.payment = "Не выбран вид оплаты";
    }

    if (this.address === "") {
      result.address = "Укажите адрес";
    }

    if (this.email === "") {
      result.email = "Укажите емэйл";
    }

    if (this.phone === "") {
      result.phone = "Укажите номер телефона";
    }

    return result;
  }
}
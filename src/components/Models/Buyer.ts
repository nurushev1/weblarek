import { IBuyer, TPayment } from "../../types";

export class Buyer {
  private payment: TPayment;
  private address: string;
  private email: string;
  private phone: string;

  constructor() {
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
  }

  validateData(): Partial<Record<keyof IBuyer, string>> {
    let result: Partial<Record<keyof IBuyer, string>> = {};
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

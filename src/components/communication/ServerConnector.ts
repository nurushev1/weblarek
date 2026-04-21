import {
  IProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";
import { IApi } from "../../types";

export class ServerConnector {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProductsResponse> {
    const response = await this.api.get<IProductsResponse>("/product/");
    return response;
  }

  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    const response = await this.api.post<IOrderResponse>("/order/", order);
    return response;
  }
}

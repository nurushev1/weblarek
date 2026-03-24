import {
  IProductsResponse,
  IProductResponse,
  IOrderRequest,
  IOrderSuccess,
  IOrderError,
  IOrderResponse,
} from "../../../types";
import { Api } from "../Api";

export class ServerConnector {
  private api: Api;

  constructor(api: Api) {
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

import { IApi, IProduct, IOrderRequest, IOrderResponse } from "../../types/index.ts";

export class ServerConnector {
    constructor(private readonly httpClient: IApi) {}

    async getProducts(): Promise<IProduct[]> {
        const result = await this.httpClient.get<{ products: IProduct[] }>("/product/");
        return result.products;
    }

    async postOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.httpClient.post<IOrderResponse>('/order/', order);
    }
}
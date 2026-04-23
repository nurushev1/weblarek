import { IApi, IProduct, IOrderRequest, IOrderResponse } from "../../types/index.ts";

export class ServerConnector {
    constructor(private readonly api: IApi) {}

    async fetchProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>("/product/")
        return response.items
    }

    async createOrder(order: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order)
    }
}
import { Api, ApiListResponse } from './base/api';
import {
	IProductItem,
	IOrderResult,
	IOrder,
} from '../types';
export interface IWebStoreApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrder,
		total: number,
		items: string[]) => Promise<Partial<IOrderResult>>;
}
export default class WebStoreApi extends Api implements IWebStoreApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProductItem> {
		return this.get(`/product/${id}`).then((item: IProductItem) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	orderProducts(order: IOrder,
		total: number,
		items: string[]
	): Promise<Partial<IOrderResult>> {
		const data = { ...order, total, items };
		return this.post('/order', data);
	}
}

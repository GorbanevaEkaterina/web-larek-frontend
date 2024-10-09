import { Api} from './base/api';
import { IWebStoreApi, IProductItem,IProducts, IOrderResult, IOrder } from "../types";

export default class WebStoreApi extends Api implements IWebStoreApi {
    readonly cdn: string;

    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }
    async getProductItem(id: string): Promise<IProductItem> {
		return (await this.get(`/product/${id}`)) as IProductItem;
	}
    
    async getProductList(): Promise<IProducts> {
        return (await this.get('/product/')) as IProducts;
    }

   
    async orderProducts(order: IOrder): Promise<IOrderResult> {
		return (await this.post('/order', order)) as IOrderResult;
	}

}
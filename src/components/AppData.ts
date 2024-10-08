import {Model} from "./base/Model";
import {OrderFormErrors, IAppState, IProductItem, IOrder} from "../types";
import { IEvents } from './base/events';

export class AppState extends Model<IAppState> {
    catalog: IProductItem[] = [];
    basket: IProductItem[] = [];
    order: IOrder = {
		address: '',
		payment: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	preview: string | null;
    
    // constructor(data: Partial<IAppState>, protected events: IEvents) {
	// 	super(data, events);
	// 	this.catalog = [];
	// 	this.basket = [];
	// 	this.cleanOrder();
	// }

    setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addBasket(item: IProductItem) {
		this.basket.push(item);
		this.emitChanges('basket:changed');
	}
	updateCardsBasket(){
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	cleanBasketState() {
		this.basket = [];
		this.updateCardsBasket();
	}
	removeBasket(item: IProductItem) {
		this.basket = this.basket.filter((basketItem) => basketItem.id !== item.id);
		this.updateCardsBasket();
	}

	setBasketPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
		};
	


	getTotalBasket(): number {
		return this.basket.reduce((a, b) => {
			return a + b.price;
		}, 0);
	}

	cleanOrder() {
		this.order = {
			address: '',
			payment: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		
	}

}
import { Model } from './base/Model';
import { IEvents } from './base/events';
import {  FormErrors, IAppState, IProductItem, IOrder } from '../types';

export class AppState extends Model<IAppState>  {
	basket:  IProductItem[] = [];
	catalog: IProductItem[];
	order: IOrder = {
		address: '',
		payment: 'card',
		email: '',
		phone: '',	
	};
	preview: string | null;
	formErrors: FormErrors = {};
	
	
	setCatalog(items: IProductItem[]) {
		this.catalog = items;
		this.emitChanges('catalog:changed', { catalog: this.catalog });
	}
	getBasketCount() {
		return this.basket.length;
		}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('card:select', item);
		
	}
	addBasket(item: IProductItem) {
		this.basket.push(item);
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	inBasket(id: string) {
		return this.basket.some((item) => item.id === id);
		
	}

	

	removeBasket(item: IProductItem) {
		this.basket = this.basket.filter((id) => id != item);
		this.emitChanges('basket:changed', { basket: this.basket });
	}
	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed', { basket: this.basket });
	}

	setOrderField(field: keyof IOrder, value: string) {
		this.order[field] = value;
		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrorsOrder:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// setContactsField(field: keyof FormErrors, value: string) {
	// 	this.order[field] = value;
	// 	if (this.validateOrder()) {
	// 		this.events.emit('order:ready', this.order);
	// 	}

	// 	if (this.validateContacts()) {
	// 		this.events.emit('contacts:ready', this.order);
	// 	}
	// }

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Укажите email';
		}

		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		}
		this.formErrors = errors;
		this.events.emit('formErrorsContacts:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}

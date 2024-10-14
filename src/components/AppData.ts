import { Model } from './base/Model';
import { IEvents } from './base/events';
import { FormErrorsContacts,FormErrorsOrder,IContactsForm,PaymentMethod, IOrder, IProductItem, IBasket } from '../types';

export class AppState {
	basket: IBasket = {
		items: [],
		total: 0,
	};
	items: IProductItem[] = [];
	order: IOrder = {
		address: '',
		payment: 'card',
		email: '',
		phone: '',
		items: [],
		
	};
	preview: IProductItem = null;
	formErrorsOrder: FormErrorsOrder = {};
	formErrorsContacts: FormErrorsContacts = {};

	constructor (protected events: IEvents) {}
	
	setCatalog(items: IProductItem[]) {
		this.items = items;
		this.events.emit('items:change', this.items);
	}
	getBasketCount() {
		return this.basket.items.length;
		}

	setPreview(item: IProductItem) {
		this.preview = item;
		this.events.emit('preview:change', item);
	}

	inBasket(item: IProductItem) {
		return this.basket.items;
	}

	// addBasket(item: IProductItem) {
	// 	this.basket.push(item.id);
	// 	this.basket.total += item.price;
	// 	this.events.emit('basket:change', this.basket);
	// }

	// removeBasket(item: IProductItem) {
	// 	this.basket.items = this.basket.items.filter((id) => id != item.id);
	// 	this.basket.total -= item.price;
	// 	this.events.emit('basket:change', this.basket);
	// }
	// getBasket() {
	// 	return this.catalog.filter((item) => this.basket.has(item.id));
	// }
	

	// getTotalPrice() {
	// 	return this.basket.items.reduce((acc, itemId) => {
	// 		const item = this.items.find((item) => item.id === itemId);
	// 		return item ? acc + item.price : acc;
	// 	}, 0);
	// }

	// clearBasket() {
	// 	this.basket.items = [];
	// 	this.basket.total = 0;
	// 	this.events.emit('basket:change');
	// }

	// clearOrder() {
	// 	this.order = {
	// 		payment: null,
	// 		address: '',
	// 		email: '',
	// 		phone: '',
	// 		items: [],
	// 	};
	// }

	// setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
	// 	this.order[field] = value;
	// 	if (this.validateOrder(field)) {
	// 		this.events.emit('order:ready', this.order);
	// 	}
	// }

	// validateOrder(field: keyof IOrder) {
	// 	const errors: Partial<Record<keyof IOrder, string>> = {};

	// 	// Проверка для полей email и phone
	// 	if (field === 'email' || field === 'phone') {
	// 		// полноценная проверка почты
	// 		const emailError = !this.order.email;
	// 		// полноценная проверка телефона	
	// 		const phoneError = !this.order.phone;
			
	// 		if (emailError && phoneError) {
	// 			errors.email = `Необходимо указать электронную почту и телефон`;
	// 		} else if (emailError) {
	// 			errors.email = `Необходимо указать электронную почту`;
	// 		} else if (phoneError) {
	// 			errors.phone = `Необходимо указать телефон`;
	// 		}
	// 	} else if (!this.order.address) errors.address = 'Необходимо указать адрес';
	// 	else if (!this.order.payment)
	// 		errors.address = 'Необходимо выбрать тип оплаты';

	// 	this.formErrors = errors;
	// 	this.events.emit(Events.FORM_ERRORS_CHANGE, this.formErrors);
	// 	return Object.keys(errors).length === 0;
	// }
}

import { Model } from './base/Model';
import { FormErrors, IAppState, IProductItem, IOrder } from '../types';

export class AppState extends Model<IAppState> {
	basket: IProductItem[] = [];
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
		this.emitChanges('catalog:changed');
	}
	getBasketCount() {
		return this.basket.length;
	}
	getTotalBasket() {
		return this.basket.reduce((sum, item) => {
			return sum + item.price;
		}, 0);
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.emitChanges('card:select', item);
	}
	addBasket(item: IProductItem) {
		this.basket.push(item);
		this.emitChanges('basket:changed');
		this.emitChanges('сounter:change');
	}

	inBasket(id: string) {
		return this.basket.some((item) => item.id === id);
	}
	getProductIDs(): string[] {
		return this.basket.map((item) => item.id);
	}

	removeBasket(item: IProductItem) {
		this.basket = this.basket.filter((id) => id != item);
		this.emitChanges('basket:changed');
		this.emitChanges('сounter:change');
	}
	clearBasket() {
		this.basket = [];
		this.emitChanges('basket:changed');
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
		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('orderErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	clearOrder(): IOrder {
		return (this.order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		});
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Укажите email';
		}

		if (!this.order.phone) {
			errors.phone = 'Укажите телефон';
		}
		this.formErrors = errors;
		this.events.emit('contactsErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}

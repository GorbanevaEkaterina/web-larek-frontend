// модель продукта(товара) *
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	status: boolean;
}
// заказ оформлен *
export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}
// список продуктов *
export interface IProducts {
	total: number;
	items: IProductItem[];
}
// главная страница *
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}
// главная страница отображение *
export interface IAppState {
	catalog: IProductItem[];
	basket: Set<string>;
	order: IOrder | null;
	preview: string | null;
}
//  запросы *
export interface IWebStoreApi {
	getProductList: () => Promise<IProducts>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

// события *
export enum Events {
	ITEMS_CHANGED = 'items:changed',
	ADD_PRODUCT = 'cart:add-product',
	REMOVE_PRODUCT = 'cart:remove-product',
	CREATE_ORDER = 'cart:create-order',
	BASKET_OPEN = 'cart:open',
	OPEN_PREVIEW = 'product:open-preview',
	CHANGED_PREVIEW = 'product:changed-preview',
	FORM_ERRORS_CHANGE = 'form:errors-changed',
	ORDER_OPEN = 'order:open',
	ORDER_CLEAR = 'order:clear',
	SET_PAYMENT_METHOD = 'order:set-payment-method',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
}

// данные заказа *
export interface IOrder {
	payment: string | null;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

//ошибки *
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
};

//перечень категорий товаров *
export enum ItemCategory {
	SoftSkill = 'soft',
	HardSkill = 'hard',
	Button = 'button',
	Other = 'other',
	Additional = 'additional',
}


	


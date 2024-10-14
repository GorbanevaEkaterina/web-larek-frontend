// модель продукта(товара) 
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// главная страница 
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// корзина
export interface IBasket {
	total: number;
	items: HTMLElement[];
}

// данные заказа 
export interface IOrder extends IContactsForm {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	items: [],
	
}

export type PaymentMethod = 'cash' | 'card';


// заказ оформлен 
export interface IOrderResult {
	id: string;
	total: number;
	
}

export type OrderForm = Omit<IOrder, 'total' | 'items'>;

export interface IContacts extends IContactsForm {
	items: string[];
}

export interface IContactsForm {
	email: string;
	phone: string;
}

//  запросы 
export interface IWebStoreApi {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrder) => Promise<IOrderResult>;
}

// ошибки

export type FormErrorsOrder = Partial<Record<keyof IOrder, string>>;
export type FormErrorsContacts = Partial<Record<keyof IContacts, string>>;

//перечень категорий товаров 
export enum ItemCategory {
	SoftSkill = 'soft',
	HardSkill = 'hard',
	Button = 'button',
	Other = 'other',
	Additional = 'additional',
}
	


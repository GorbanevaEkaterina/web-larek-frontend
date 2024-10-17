// модель продукта(товара) 
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IAppState {
    catalog: IProductItem[];
    preview: string | null;
    order: IOrder | null;
	formErrors: FormErrors;
	basket: IProductItem[];

}

// главная страница 
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
	basket: HTMLElement;
}

// корзина
export interface IBasket {
	items: IProductItem[];
}

export interface IFormState {
	valid: boolean;
	errors: string[];
}

// данные заказа 
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	
}


export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

// заказ оформлен 
export interface IOrderResult {
	id: string;
	total: number;
	
}







export interface ISuccess {
	total: number;
}
// ошибки

export type FormErrors = Partial<Record<keyof IOrder, string>>;

//перечень категорий товаров 
export enum ItemCategory {
	SoftSkill = 'soft',
	HardSkill = 'hard',
	Button = 'button',
	Other = 'other',
	Additional = 'additional',
}
	

export interface IProduct {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
	buttonText?: string;
	selected?: boolean;
}

export interface IBasketProduct {
	title: string;
	price: number | null;
	index: number;
}
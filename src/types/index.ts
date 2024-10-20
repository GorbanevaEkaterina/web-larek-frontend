// структуру для товара в приложении.
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Интерфейс для хранения состояния всего приложения.
export interface IAppState {
    catalog: IProductItem[];
    preview: string | null;
    order: IOrder | null;
	formErrors: FormErrors;
	basket: IProductItem[];

}

// Интерфейс для представления состояния страницы.

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
	basket: HTMLElement;
	wrapper: HTMLElement;
}

// Интерфейс для представления структуры корзины.
export interface IBasket {
	items: IProductItem[];
}

// Интерфейс для управления состоянием формы.
export interface IFormState {
	valid: boolean;
	errors: string[];
}

// Интерфейс для представления информации о заказе.
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	
}

// Интерфейс для описания действий, связанных с продуктом.
export interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

// Интерфейс для представления результатов оформления заказа.
export interface IOrderResult {
	id: string;
	total: number;
	
}

// Интерфейс для представления успешного результата операции.

export interface ISuccess {
	total: number;
}

// Тип, представляющий объект, который может содержать ошибки формы. Ключами являются ключи из IOrder, а значениями — строки с описанием ошибок.

export type FormErrors = Partial<Record<keyof IOrder, string>>;
 

// Интерфейс для представления отдельных деталей продукта.
export interface IProduct {
	id: string;
	description?: string;
	image?: string;
	title: string;
	category?: string;
	price: number | null;
	buttonText?: string;
	index?: number;
	selected?: boolean;
}

// Интерфейс для представления товара в корзине.

export interface IBasketProduct {
	title: string;
	price: number | null;
	index: number;
}


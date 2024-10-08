
// модель продукта(товара)
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    index?: number;
	buttonName?: string;
}

// главная страница
export interface IAppState {
    catalog: IProductItem[];
	basket: IProductItem[];
	order: IOrder | null;
	preview: string | null;
}

// способ оплаты и адрес
export interface IUserDataForm {
	payment: string;
	address: string;
}
// почта и телефон
export interface IUserContactsForm {
	email: string;
	phone: string;
}

// export interface IOrderForm {
//     payment: string;
//     email: string;
//     phone: string;
//     address: string;
    
// }

// данные заказа
export interface IOrder extends IUserDataForm, IUserContactsForm {
    items: string[];
    total: number;
}

export type IOrderPerson = IUserDataForm & IUserContactsForm;

export type OrderFormErrors = Partial<Record<keyof IOrderPerson, string>>;

// заказ оформлен
export interface IOrderResult {
    id: string[];
    total: number;
}

export type CatalogChangeEvent = {
	catalog: IProductItem[];
};


export interface IAppForm {
  IOrderPerson: IOrderPerson;
  formErrors: OrderFormErrors;
}


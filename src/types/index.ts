
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
	basket: IProductItem[];
	order: IOrder;
	orderFormErrors: OrderFormErrors;
	contactsFormErrors: ContactsFormErrors;
}
// export interface IUser {
//     email: string;
//     phone: number;
//     address: string;
// }

export interface IUserDataForm {
	payment: string;
	address: string;
}

export interface IUserContactsForm {
	email: string;
	phone: string;
}

export interface IOrderForm {
    payment: string;
    email: string;
    phone: string;
    address: string;
    
}

export interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}

export interface IOrderResult {
    id: string;
    total: number;
}
export type FormName = 'order' | 'contacts';

export interface IAnyForm extends IOrderForm, IUserContactsForm {}
export type OrderFormErrors = Partial<Record<keyof IOrderForm, string>>;
export type ContactsFormErrors = Partial<Record<keyof IUserContactsForm, string>>;
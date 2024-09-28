export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IProductList {
    total: number;
    catalog: IProductItem[];
    basket: string[];
    order: IOrder | null;
    loading: boolean;
    preview: string | null;
} 

export interface IAppState {
    catalog: IProductList[];
    preview: string | null;
    order: IOrder | null;
}
export interface IUser {
    email: string;
    phone: number;
    address: string;
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

export type FormErrors = Partial<Record<keyof IOrder, string>>;
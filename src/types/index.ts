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
    items: IProductItem[]
} 

export interface IUser {
    payment: string;
    email: string;
    phone: number;
    address: string;
}

export interface IOrderForm {
    email: string;
    phone: string;
}

export interface IOrder extends IOrderForm {
    id: string;
    items: string[]
}

export interface IOrderResult {
    id: string;
}
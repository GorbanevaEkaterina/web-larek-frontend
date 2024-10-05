import {Model} from "./base/Model";
import {FormErrors, IAppState, IProductList , IProductItem, IOrder, IOrderForm} from "../types";

export const orderDefault: IOrder = {
    address: '',
    email: '',
    phone: '',
    payment: '',
    items: [],
    total: 0
}



export class AppState extends Model<IAppState> {
    catalog: IProductItem[];
    order: IOrder = Object.assign({}, orderDefault)
    preview: string | null;
    formErrors: FormErrors = {};

    setCatalog(items: IProductItem[]) {
        this.catalog = items;
        this.emitChanges('item: changed', {catlog: this.catalog});
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview: changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;
        
        if(this.validateOrder()) {
            this.events.emit('order: ready', this.order);
        }
    }

    getOrderItems() {
        return this.catalog.filter((item) => this.order.items.includes(item.id));
    }

    getTotal() {
        return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id ===c).price, 0)
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};

        if(!this.order.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if(!this.order.address) {
            errors.address = 'Укажите адрес';
        }
        if(!this.order.email) {
            errors.email = 'Укажите email';
        }
        if(!this.order.phone) {
            errors.phone = 'Укажите телефон';
        }

        this.formErrors = errors;

        this.events.emit('formError: change', this.formErrors);

        return Object.keys(errors).length === 0;
    }

    addItemsToBasket(item: IProductItem) {
        if(item.price === null){
            alert('К сожалению этот товар не продаётся, обратите своё внимание на другие позиции.')
        } else {
        this.order.items.push(item.id);
        this.emitChanges('basket: change', item)}
    }

    deleteItemsFromBasket(item: IProductItem) {
        this.order.items = this.order.items.filter((OrderedItem) => OrderedItem !== item.id);
        this.emitChanges('basket: change', item);
    }

    clearBasket() {
       this.order = Object.assign({}, orderDefault, { items: []});
        this.emitChanges('basket: change', {}) 
    }

    isItemAdded(item: IProductItem) {
        if(this.order.items.includes(item.id)) {
            return true;
        } 
        return false;
    }

    isItemHasPrice(item: IProductItem) {
        if(item.price) {
            return true;
        }
        return false;
    }
}
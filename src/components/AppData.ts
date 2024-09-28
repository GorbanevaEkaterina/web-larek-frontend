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
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProductItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    setOrderField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }
}
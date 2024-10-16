import { ensureElement } from '../utils/utils';
import { IProductActions } from '../types/index';
import { Product } from '../components/common/Product';

export class ProductCatalog extends Product {
	protected _selected: boolean;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _categoryColor = new Map<string, string>([
		['софт-скил', '_soft'],
		['хард-скил', '_hard'],
		['кнопка', '_button'],
		['другое', '_other'],
		['дополнительное', '_additional'],
	]);

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category?.classList?.remove('card__category_soft');
		this._category?.classList?.remove('card__category_other');
		this._category?.classList?.add(
			`card__category${this._categoryColor.get(value)}`
		);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}
}

export class CatalogProdactsView extends ProductCatalog {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._description = ensureElement<HTMLElement>('.card__text', container);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;
					this.setText(descTemplate, str);
					return descTemplate;
				})
			);
		} else {
			this.setText(this._description, value);
		}
	}
}

export class BasketProduct extends Product {
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super(container, actions);

		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
		this._button = ensureElement<HTMLButtonElement>(
			`.basket__item-delete`,
			container
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}

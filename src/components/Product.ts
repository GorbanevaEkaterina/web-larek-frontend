import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IProductItem, ItemCategory } from '../types/index';

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export class Product extends Component<IProductItem> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _description: HTMLElement;
	protected _categoryColor = new Map<string, string>([
		['софт-скил', '_soft'],
		['хард-скил', '_hard'],
		['кнопка', '_button'],
		['другое', '_other'],
		['дополнительное', '_additional'],
	]);

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IProductActions
	) {
		super(container);

		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._image = container.querySelector(`.${blockName}__image`);
		this._category = container.querySelector(`.${blockName}__category`);
		this._button = container.querySelector('button');
		this._description = container.querySelector(`.${blockName}__description`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}
	set category(value: string) {
		this.setText(this._category, value);
		this._category?.classList?.remove('card__category_soft');
		this._category?.classList?.remove('card__category_other');
		this._category?.classList?.add(
			`card__category${this._categoryColor.get(value)}`
		);
	}

	get category(): keyof typeof ItemCategory {
		return this._category.textContent as keyof typeof ItemCategory;
	}

	set price(value: string | null) {
		this.setText(this._price, value ?? '');
	}

	get price(): string {
		return this._price.textContent || null;
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
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
	set button(value: string) {
		this.setText(this._button, value);
	}
}

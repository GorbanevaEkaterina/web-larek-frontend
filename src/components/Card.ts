import { categoryChange } from "../utils/constants";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    description?: string;
    image: string;
    category?: string;
    price: number;
    index?: string;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _category?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _description?: HTMLElement;
	protected _index?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
        this._image = container.querySelector(`.card__image`);
		this._category = container.querySelector(`.card__category`);
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._index = container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick); 
            }
            else {
                container.addEventListener('click', actions.onClick);
            }
        
    }

    private getCategoryClass(value: string) {
		const categorySetting = categoryChange[value] || 'unknown';
		return 'card__category_' + categorySetting;
	}

    
    set title(value: string) {
		this._title.textContent = value;
	}

	set price(value: number | null) {
		this.setText(this._price, `${this.price} синапсов`);
		if (!value) {
			this.setDisabled(this._button, true);
		}
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string) {
		this._category.textContent = value;
		const backgroundColorClass = this.getCategoryClass(value);
		this._category.classList.add(backgroundColorClass);
	}

	set description(value: string) {
		this._description.textContent = value;
	}

	set inBasket(isInBasket: boolean) {
		this._button.textContent = isInBasket ? 'Убрать' : 'В корзину';
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}
}


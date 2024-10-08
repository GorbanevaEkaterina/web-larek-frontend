import { createElement, ensureElement} from '../../utils/utils';
import { Component } from '../base/Component';
import {priceString} from "../../utils/utils";
import { EventEmitter } from '../base/events';

interface IBasket {
	items: HTMLElement[];
	total: number;
	button: string[];
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('address: open');
			});
		}

		this.items = [];
		
	}

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Ваша корзина пуста',
				})
			);
		}
	}
	set selected(items: number) {
        if ( items === 0 ) {
            this.setDisabled(this._button, true);
        } else {
            this.setDisabled(this._button, false);
        }
    }

	set total(total: number) {
		this._total.textContent = priceString(total);
	}

}

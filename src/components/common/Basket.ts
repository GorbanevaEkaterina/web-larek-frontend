import { createElement, ensureElement} from '../../utils/utils';
import { Component } from '../base/Component';
import { EventEmitter } from '../base/events';

interface IBasket {
	items: HTMLElement[];
	total: number;
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
				events.emit('order: open');
			});
		}

		this.items = [];
		this.disableButton(true);
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

	set total(total: number) {
		this.setText(this._total, `${total} синапсов`);
	}

	disableButton(disabled: boolean) {
		this.setDisabled(this._button, disabled);
	}
}

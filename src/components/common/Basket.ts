import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IBasket } from '../../types';




export class Basket extends Component<IBasket> {
	static template = ensureElement<HTMLTemplateElement>('#basket');
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLTemplateElement, protected events?: IEvents) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);
		this.list = [];

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}
		
		this.disableButton(true);
	}
	protected disableButton(disabled: boolean){
		this.setDisabled(this._button, disabled);
	}
	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.disableButton(false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Ваша корзина пуста',
				})
			);
			// this.disableButton(true);
		}
	}

	set total(total: number) {
		this.setText(this._total, total.toString() + ' синапсов');
		
	}
}

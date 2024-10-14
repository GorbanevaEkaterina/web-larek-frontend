import { Form } from './common/Form';
import {  IOrder } from '../types';
import { IEvents } from './base/events';

export class Order extends Form<IOrder> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton = container.querySelector<HTMLButtonElement>(
			'button[name="card"]'
		);
		this._cashButton = container.querySelector<HTMLButtonElement>(
			'button[name="cash"]'
		);
	
		this._onlineButton.addEventListener('click', () => {
			this.payment = 'card';
			this.onInputChange('payment', 'card');
		});
		this._cashButton.addEventListener('click', () => {
			this.payment = 'cash';
			this.onInputChange('payment', 'cash');
		});
	}
	

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: string) {
		this._onlineButton.classList.toggle('button_alt-active', value === 'card');
		this._cashButton.classList.toggle('button_alt-active', value === 'cash');
	}
}

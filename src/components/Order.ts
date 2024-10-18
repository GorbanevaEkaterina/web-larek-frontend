import { Form } from './common/Form';
import {  IOrder } from '../types';
import { IEvents } from './base/events';
import {ensureElement} from '../utils/utils'

export class Order extends Form<Partial<IOrder>> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton = container.querySelector<HTMLButtonElement>(
			'button[name="card"]'
		);
		this._cashButton = container.querySelector<HTMLButtonElement>(
			'button[name="cash"]'
		);

		this._address = ensureElement<HTMLInputElement>(
			'input',
			this.container
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
		this._address.value = value;
	}

	set payment(value: string) {
		this._onlineButton.classList.toggle('button_alt-active', value === 'card');
		this._cashButton.classList.toggle('button_alt-active', value === 'cash');
	}
}

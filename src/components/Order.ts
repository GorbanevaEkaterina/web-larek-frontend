import { Form } from './common/Form';
import { Events,IOrder } from '../types';
import { IEvents } from './base/events';


export class UserDataForm extends Form<IOrder> {
	protected _onlineButton: HTMLButtonElement;
	protected _cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton = container.querySelector<HTMLButtonElement>('button[name="card"]');
		this._cashButton = container.querySelector<HTMLButtonElement>('button[name="cash"]');
		this._addressInput = container.querySelector<HTMLInputElement>('input[name="address"]');

		this._onlineButton.addEventListener('click', () => this.togglePaymentMethod('card'));
		this._cashButton.addEventListener('click', () => this.togglePaymentMethod('cash'));
			
	}
	toggleCard(state: boolean = true) {
		this.toggleClass(this._onlineButton, 'button_alt-active', state);
	}

	toggleCash(state: boolean = true) {
		this.toggleClass(this._cashButton, 'button_alt-active', state);
	}

	togglePaymentMethod(selectedPayment: string) {
		const isCardActive = this._onlineButton.classList.contains('button_alt-active');
		const isCashActive = this._cashButton.classList.contains('button_alt-active');

		if (selectedPayment === 'card') {
			this.toggleCard(!isCardActive);
			this.payment = isCardActive ? null : 'card';
			if (!isCardActive) this.toggleCash(false);
		} else if (selectedPayment === 'cash') {
			this.toggleCash(!isCashActive);
			this.payment = isCashActive ? null : 'cash';
			if (!isCashActive) this.toggleCard(false);
		}
	}

	resetPaymentButtons() {
		this.toggleCard(false);
		this.toggleCash(false);
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

	set payment(value: string) {
		this.events.emit(Events.SET_PAYMENT_METHOD, { paymentType: value });
	}
	
}

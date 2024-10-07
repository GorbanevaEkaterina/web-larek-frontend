import { IUserContactsForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Contacts extends Form<IUserContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	cleanFieldValues() {
		this.email = '';
		this.phone = '';
	}
}
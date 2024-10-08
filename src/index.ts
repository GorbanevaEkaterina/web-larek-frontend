import './scss/styles.scss';

import {WebStoreApi} from "./components/WebStoreApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm, IProductItem, IAnyForm, FormName, IUserContactsForm} from "./types";
import { Form } from './components/common/Form';
import { Card } from './components/Product';
import { Order} from "./components/Order";
import {Success} from "./components/common/Success";
import { Contacts } from './components/Contacts';

const events = new EventEmitter();
const api = new WebStoreApi(CDN_URL, API_URL);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemlate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemlate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

//Бизнес-логика

const onFormErrorsChange = (input: {
	errors: Partial<IAnyForm>;
	form: Form<IAnyForm>;
}) => {
	input.form.valid = Object.values(input.errors).every((text) => {
		return !text;
	});
	input.form.errors = Object.values(input.errors)
		.filter((i) => !!i)
		.join('; ');
};

const renderForm = (formName: FormName) => {
	const form = formName === 'order' ? order : contacts;
	form.cleanFieldValues();
	modal.render({
		content: form.render({
			valid: false,
			errors: [],
		}),
	});
};

events.on('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			image: item.image,
			category: item.category,
		});
	});
});

events.on('card:select', (item: IProductItem) => {
	const card: Card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (!appData.isInBasket(item)) {
				appData.addBasket(item);
			} else {
				appData.removeBasket(item);
			}
			card.inBasket = appData.isInBasket(item);
		},
	});
	card.inBasket = appData.isInBasket(item);
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
		}),
	});
});

events.on('basket:changed', () => {
	page.counter = appData.getNumberBasket();
	basket.items = appData.basket.map((item, index) => {
		const card: Card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => appData.removeBasket(item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		});
	});
	const totalNumber = appData.getTotalBasket();
	basket.total = totalNumber;
	basket.disableButton(!totalNumber);
});
events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('basket:open', () => {
	modal.render({ content: basket.render() });
});

events.on('order:open', () => {
	appData.cleanOrder();
	renderForm('order');
});

events.on(
	/^(order|contacts)\..*:change/,
	(data: { field: keyof IAnyForm; value: string }) => {
		appData.setField(data.field, data.value);
	}
);

events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	onFormErrorsChange({ errors, form: order });
});

events.on('contactsFormErrors:change', (errors: Partial<IUserContactsForm>) => {
	onFormErrorsChange({ errors, form: contacts });
});

events.on('order:submit', () => {
	renderForm('contacts');
});

events.on('contacts:submit', () => {
	appData.prepareOrder();
	api
		.orderItem(appData.getOrderData())
		.then(() => {
			modal.render({
				content: success.render({
					total: appData.getTotalBasket(),
				}),
			});
			appData.cleanBasketState();
		})
		.catch((err) => {
			console.error(err);
		})
		.finally(() => {
			appData.cleanOrder();
		});
});

events.on('success:submit', () => modal.close());

api
	.getProductList()
	.then((result) => {
		appData.setCatalog(result);
	})
	.catch((err) => {
		console.error(err);
	});
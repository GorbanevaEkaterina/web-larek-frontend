import './scss/styles.scss';

import WebStoreApi from './components/WebStoreApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import {
	IOrder,
	IProductItem,
	Events
} from './types';

import { BasketItem, CatalogItem } from './components/Product';
import { UserDataForm } from './components/Order';
import { Success } from './components/common/Success';
import { Contacts } from './components/Contacts';

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemlate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const events = new EventEmitter();
const api = new WebStoreApi(API_URL);
const appData = new AppState({}, events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
//
const basket = new Basket(cloneTemplate(basketTemlate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const userDataForm = new UserDataForm(cloneTemplate(orderTemplate), events);
// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});









//Бизнес-логика

//1. Get запрос на получение всех продуктов магазина.
api
.getProductList()
.then(appData.setCatalog.bind(appData))
.catch(console.error);
//2. Обрабатываем событие, которое выводит(отображает) карточки продуктов на главной странице.
events.on<CatalogChangeEvent>(Events.ITEMS_CHANGED, () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit(Events.OPEN_PREVIEW, item),
		});
		return card.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price !== null ? item.price.toString() + ' синапсов' : '',
			category: item.category,
		});
	});
	page.counter = appData.getBasket().length;
});

// // Открыть корзину
// events.on('basket:open', () => {
// 	modal.render({
// 		content: createElement<HTMLElement>('div', {}, [basket.render()]),
// 	});
// });

// //превью карточки
// events.on('card:select', (item: IProductItem) => {
// 	appData.setBasketPreview(item);
// });

// // добавление и удаления в корзину
// events.on('card:selected', (item: IProductItem) => {
// 	if (appData.basket.indexOf(item) === -1) {
// 		appData.addBasket(item);
// 		events.emit('cardBasket:add', item);
// 	} else {
// 		appData.removeBasket(item);
// 		events.emit('cardBasket:remove', item);
// 	}
// });

// // Изменена открытая выбранная карточка в отдельном окне(превью)
// events.on('preview:changed', (item: IProductItem) => {
// 	const card = new Product('card', cloneTemplate(cardPreviewTemplate), {
// 		onClick: () => {
// 			events.emit('card:selected', item);
// 			card.buttonName =
// 				appData.basket.indexOf(item) === -1 ? 'Купить' : 'Удалить';
// 		},
// 	});

// 	modal.render({
// 		content: card.render({
// 			category: item.category,
// 			title: item.title,
// 			description: item.description,
// 			image: item.image,
// 			price: item.price,
// 			buttonName: appData.basket.indexOf(item) === -1 ? 'Купить' : 'Удалить',
// 		}),
// 	});
// });

// events.on('basket:changed', (items: IProductItem[]) => {
// 	basket.items = items.map((item, index) => {
// 		const card = new Product('card', cloneTemplate(cardBasketTemplate), {
// 			onClick: () => {
// 				events.emit('card:delete', item);
// 			},
// 		});
// 		return card.render({
// 			title: item.title,
// 			price: item.price,
// 			index: index + 1,
// 		});
// 	});
// 	basket.selected = appData.basket.length;
// 	const total = appData.getTotalBasket();
// 	basket.total = total;
// 	appData.order.total = total;
// 	appData.order.items = appData.basket.map((item) => item.id);
// });

// // удаление продукта(карточки) из корзины в корзине
// events.on('card:delete', (item: IProductItem) => appData.removeBasket(item));

// //изменение кол-ва карточек в корзине
// events.on('counter:changed', (item: string[]) => {
// 	page.counter = appData.basket.length;
// });

// // Открыть форму с адресом и способом оплаты
// events.on('address:open', () => {
// 	userOrder.clearFormAddress(); // очищаем модалку при след.покупке

// 	events.emit('address:change', { field: 'payment', value: '' });
// 	events.emit('address:change', { field: 'address', value: '' });

// 	modal.render({
// 		content: userOrder.render({
// 			payment: '',
// 			address: '',
// 			valid: false,
// 			errors: [],
// 		}),
// 	});
// });

// // Открыть форму с контактами и способом оплаты
// events.on('contacts:open', () => {
// 	modal.render({
// 		content: contactsOrder.render({
// 			phone: '',
// 			email: '',
// 			valid: false,
// 			errors: [],
// 		}),
// 	});
// });

// // Изменилось состояние валидации формы с адресом доставки
// events.on('formErrors:change', (errors: Partial<IUserDataForm>) => {
// 	const { payment, address } = errors;
// 	userOrder.valid = !payment && !address;

// 	// console.log(`payment: ${payment}`);
// 	// console.log(`address: ${address}`);

// 	userOrder.errors = Object.values({ payment, address })
// 		.filter((i) => !!i)
// 		.join('; ');
// });

// // Изменения в поле адреса доставки
// events.on(
// 	'address:change',
// 	(data: { field: keyof IUserDataForm; value: string }) => {
// 		formData.setAddressField(data.field, data.value);
// 	}
// );

// // Изменилось состояние валидации формы с контактами
// events.on('formErrors:change', (errors: Partial<IUserContactsForm>) => {
// 	const { email, phone } = errors;
// 	contactsOrder.valid = !email && !phone;
// 	contactsOrder.errors = Object.values({ phone, email })
// 		.filter((i) => !!i)
// 		.join('; ');
// });

// // Изменения в полях контакты
// events.on(
// 	'contacts:change',
// 	(data: { field: keyof IUserContactsForm; value: string }) => {
// 		formData.setContactsField(data.field, data.value);
// 	}
// );

// // доступность кнопки, если инпут c адресом заполнен
// events.on('address:ready', () => {
// 	userOrder.valid = true;
// });

// // при отправки формы с адресом, открываем модалку с контактами
// events.on('address:submit', () => {
// 	events.emit('contacts:open');
// });

// // доступность кнопки с контактами
// events.on('contacts:ready', () => {
// 	contactsOrder.valid = true;
// });

// // при отправки контактов, открывется успешное окно
// events.on('contacts:submit', () => {
// 	events.emit('success:open');
// });

// // успешно
// events.on('success:open', () => {
// 	const data: IOrder = {
// 		payment: formData.orderPerson.payment,
// 		address: formData.orderPerson.address,
// 		email: formData.orderPerson.email,
// 		phone: formData.orderPerson.phone,
// 		total: appData.order.total,
// 		items: appData.order.items,
// 	};
// 	api
// 		.orderProducts(data)
// 		.then((result) => {
// 			appData.cleanBasketState();
// 			appData.cleanOrder();
// 			formData.clearDataOrder();
// 			const success = new Success(cloneTemplate(successTemplate), {
// 				onClick: () => {
// 					modal.close();
// 				},
// 			});

// 			// success.total = result.total.toString();
// 			// modal.render({
// 			// 	content: success.render({}),
// 			// });
// 		})

// 		.catch((err) => {
// 			console.log(err);
// 		});
// });

// // Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
// 	page.locked = true;
// });

// // ... и разблокируем
// events.on('modal:close', () => {
// 	page.locked = false;
// });

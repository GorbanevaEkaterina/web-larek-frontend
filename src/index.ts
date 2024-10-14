import './scss/styles.scss';

import WebStoreApi from './components/WebStoreApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState} from './components/AppData';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { IOrder, IProductItem} from './types';
import { Product} from './components/Product';
import { Order } from './components/Order';
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
const appData = new AppState(events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
//
const basket = new Basket(cloneTemplate(basketTemlate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
	},
});

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
// //2. Обрабатываем событие, которое выводит(отображает) карточки продуктов на главной странице.
// events.on<CatalogChangeEvent>(Events.ITEMS_CHANGED, () => {
// 	page.catalog = appData.catalog.map((item) => {
// 		const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
// 			onClick: () => events.emit(Events.OPEN_PREVIEW, item),
// 		});
// 		return card.render({
// 			title: item.title,
// 			image: CDN_URL + item.image,
// 			description: item.description,
// 			price: item.price !== null ? item.price.toString() + ' синапсов' : '',
// 			category: item.category,
// 		});
// 	});
// 	page.counter = appData.getBasket().length;
// });

// //2.Блокируем прокрутку страницы если открыта модалка
// events.on(Events.MODAL_OPEN, () => {
// 	page.locked = true;
// });

// // ... и разблокируем
// events.on(Events.MODAL_CLOSE, () => {
// 	page.locked = false;
// 	appData.clearOrder();
// });

// //3.превью карточки
// events.on(Events.OPEN_PREVIEW, (item: IProductItem) => {
// 	appData.setPreview(item);
// });

// //4.Изменена открытая выбранная карточка в отдельном окне(превью)
// events.on(Events.CHANGED_PREVIEW, (item: IProductItem) => {
// 	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
// 		onClick: () => {
// 			events.emit(Events.ADD_PRODUCT, item);
// 		},
// 	});

// 	modal.render({
// 		content: card.render({
// 			category: item.category,
// 			title: item.title,
// 			description: item.description,
// 			image: CDN_URL + item.image,
// 			price: item.price !== null ? item.price?.toString() + ' синапсов' : '',
// 			status: {
// 				status: item.price === null || appData.basket.has(item.id),
// 			},
// 		}),
// 	});
// });

// events.on('basket:change', () => {
// 	page.counter = appData.getBasketCount();
// 	const items = appData.getBasket().map((item, index) => {
// 				const product = new BasketItem(cloneTemplate(cardBasketTemplate), {
// 					onClick: () => events.emit(Events.REMOVE_PRODUCT, item),
// 				});
// 				return product.render({
// 					index: index + 1,
// 			        title: item.title,
// 					price: item.price?.toString() || '0',
// 				})
// 	});
// 	basket.render({
// 		items,
// 		total: appData.getTotalPrice(),
// 		});
// });

// events.on('basket: open', () => {
// 	modal.render({ content: basket.render() });
	
// })

// //5.Открыть корзину
// events.on(Events.BASKET_OPEN, () => {
// 	const items = appData.getBasket().map((item, index) => {
// 		const product = new BasketItem(cloneTemplate(cardBasketTemplate), {
// 			onClick: () => events.emit(Events.REMOVE_PRODUCT, item),
// 		});
// 		return product.render({
// 			index: index + 1,
// 			title: item.title,
// 			description: item.description,
// 			price: item.price?.toString() || '0',
// 			category: item.category,
// 		});
// 	});
// 	modal.render({
// 		content: createElement<HTMLElement>('div', {}, [
// 			basket.render({
// 				items,
// 				total: appData.getTotalPrice(),
// 			}),
// 		]),
// 	});
// });

// //6.добавить в корзину
// events.on(Events.ADD_PRODUCT, (item: IProductItem) => {
// 	appData.addBasket(item);
// 	modal.close();
// });
// //7.удалить из корзины
// events.on(Events.REMOVE_PRODUCT, (item: IProductItem) => {
// 	appData.removeBasket(item);
// });

// //8.работа с формой заказа
// events.on(/(^order|^contacts):submit/, () => {
// 	if (!appData.order.email || !appData.order.address || !appData.order.phone)
// 		return events.emit(Events.ORDER_OPEN);
// 	const items = appData.getBasket();
// 	events.emit(Events.CREATE_ORDER);

// 	api
// 		.orderProducts({
// 			...appData.order,
// 			items: items.map((i) => i.id),
// 			total: appData.getTotalPrice(),
// 		})
// 		.then((result) => {
// 			modal.render({
// 				content: success.render({
// 					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
// 					description: !result.error
// 						? `Списано ${result.total} синапсов`
// 						: result.error,
// 				}),
// 			});
// 		})
// 		.catch((err) => {
// 			console.error(err);
// 		})
// 		.finally(() => {});
// });

// //9.очистка корзины после отправки заказа
// events.on(Events.ORDER_CLEAR, () => {
// 	appData.clearBasket();
// 	appData.clearOrder();
// 	userDataForm.resetPaymentButtons();
// });

// //10.Изменилось состояние валидации форм
// events.on(Events.FORM_ERRORS_CHANGE, (errors: Partial<IOrder>) => {
// 	const { email, phone, address, payment } = errors;
// 	userDataForm.valid = !address && !payment;
// 	userDataForm.errors = Object.values(errors)
// 		.filter((i) => !!i)
// 		.join(', ');

// 	contacts.valid = !email && !phone;
// 	contacts.errors = Object.values(errors)
// 		.filter((i) => !!i)
// 		.join(', ');
// });

// //11.Изменилось одно из полей
// events.on(
// 	/(^order|^contacts)\..*:change/,
// 	(data: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
// 		appData.setOrderField(data.field, data.value);
// 	}
// );
// //12.Открыть форму заказа
// events.on(Events.ORDER_OPEN, () => {
// 	if (!appData.order.address && !appData.order.payment) {
// 		const data = { address: '' };
// 		modal.render({
// 			content: userDataForm.render({
// 				valid: false,
// 				errors: [],
// 				...data,
// 			}),
// 		});
// 	} else {
// 		const data = { phone: '', email: '' };
// 		modal.render({
// 			content: contacts.render({
// 				valid: false,
// 				errors: [],
// 				...data,
// 			}),
// 		});
// 	}
// });

// events.on(Events.SET_PAYMENT_METHOD, (data: { paymentType: string }) => {
// 	appData.setOrderField('payment', data.paymentType);
// });

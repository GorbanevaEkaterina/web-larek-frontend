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
import { ProductCatalog,CatalogProdactsView,BasketProduct} from './components/ProductCatalog';
import { Product} from './components/common/Product';
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
const api = new WebStoreApi(CDN_URL, API_URL);
const appData = new AppState({}, events);
// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
//
const basket = new Basket(cloneTemplate(basketTemlate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);

// const success = new Success(cloneTemplate(successTemplate), {
// 	onClick: () => {
// 		modal.close();
// 	},
// });

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//Бизнес-логика

//1. Get запрос на получение всех продуктов магазина.
api
	.getProductList()
	.then((items) => {
		appData.setCatalog(items as IProductItem[]);
	})
	.catch(console.error);

	// 3.превью карточки
// events.on('card:select', (item: IProductItem) => {
// 	appData.setPreview(item);
// });

//2. Обрабатываем событие, которое выводит(отображает) карточки продуктов на главной странице.
events.on('catalog:changed',() => {
	page.catalog = appData.catalog.map((item) => {
		const product = new ProductCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return product.render({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

//2.Блокируем прокрутку страницы если открыта модалка
events.on('modal: open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal: close', () => {
	page.locked = false;
	
});


events.on('card:select', (item: IProductItem) => {
	const productInBasket = appData.inBasket(item.id);
	const product = new CatalogProdactsView(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (productInBasket) {
				events.emit('card:deleteFromBasketView', item);
			} else {
				events.emit('card:toBasket', item);
			}
		},
	});
	modal.render({
		content: product.render({
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
			buttonText: productInBasket ? 'Удалить из корзины' : 'Добавить в корзину',
		}),
		
	});
})


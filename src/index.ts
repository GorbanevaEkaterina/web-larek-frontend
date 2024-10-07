import './scss/styles.scss';

import {WebStoreApi} from "./components/WebStoreApi";
import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {AppState} from "./components/AppData";
import {Page} from "./components/Page";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Modal} from "./components/common/Modal";
import {Basket} from "./components/common/Basket";
import {IOrderForm, IProductItem} from "./types";
import { Card } from './components/Card';
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
const constantsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success'); 

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

//Бизнес-логика
//Изменились элементы каталога, отрисовка карточек товара
events.on('item: changed', () => {
   page.catalog = appData.catalog.map((item) => {
    const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
        onClick: () => events.emit('card: selected', item)
    });
    
    card.id = item.id;
    return card.render({
        title: item.title,
        category: item.category,
        image: item.image,
        price: item.price
    });
   });

   page.counter = appData.getOrderItems().length;
});

//Открытие карточки товара
events.on('card: selected', (item: IProductItem) => {
    appData.setPreview(item);
});

//Изменение карточки товара, добавление в корзину
events.on('preview: changed', (item: IProductItem) => {  
    
    const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            appData.addItemsToBasket(item);
            modal.close();
        }
    });
    
    if(item) {
        if (item.price === null) {
            card.setButtonText('Товар не продается')
            card.addBlockButton(true);
        }
        else if(appData.isItemHasPrice(item) && !appData.isItemAdded(item)){
            card.addBlockButton(false);
        } 
        else {
            card.addBlockButton(true);
        }
    
        modal.render({   
            content: card.render ({
                title: item.title,
                category: item.category,
                image: item.image,
                price: item.price,
                description: item.description
            })
        });
    } else {
        modal.close();
    }
});

//Открытие карзины
events.on('basket: open', () => {
    modal.render({content: basket.render()})
});

//Изменение корзины
events.on('basket: change', () => {
    
    const order = appData.getOrderItems();
    page.counter = order.length;
    basket.items = order.map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => {
                appData.deleteItemsFromBasket(item);
            }
        });
        return card.render({
            index: String(index + 1),
            title: item.title,
            price: item.price
        });
    });
    basket.total = appData.getTotal();
})

//Открытие формы заказа с адресом и способом оплаты
//Выбор способа оплаты 
events.on('order: open', () => {
    appData.order = Object.assign({}, orderDefault, {
        items: appData.order.items
    });

    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
    appData.order.total = appData.getTotal();
});

//Отправка формы заказа, открытие формы контакты клиента
events.on('order: submit', () => {
    modal.render({
        content: clientContacts.render({
            email: '',
            phone: '',
            valid: false,
            errors: []
        })
 
    });
})

//Отправка формы контакты клиента, открытие окна успех
events.on('contacts: submit', () => {
        appData.getOrderItems().filter(p => p.price === null).forEach(product => appData.order.items = appData.order.items.filter(i => i != product.id)
        ) 
    api.orderItem(appData.order)
    .then(() => {
        const success = new Success(cloneTemplate(successTemplate), {
            onClick: () => {
                modal.close();
            }
        });
        modal.render({
            content: success.render({
                total: appData.order.total
            })
        });
        appData.clearBasket();
        order.payment = '';
    })
    .catch((err) => console.error(err));
}
);

//Валидация полей
events.on('formError: change', (errors: Partial<IOrderForm>) => {
    const {payment, email, phone, address} = errors;
    order.valid = !payment && !address;
    order.errors = Object.values({payment, address}).filter((e) => !!e).join('; ');
    clientContacts.valid = !email && !phone;
    clientContacts.errors = Object.values({email, phone}).filter((e) => !!e).join('; ');
})

events.on(/^(order\..*|contacts\..*): change/, (data: {
    field: keyof IOrderForm;
    value: string
}) => {
    appData.setOrderField(data.field, data.value);
})

// Блокируем прокрутку страницы если открыто модальное окно
events.on('modal: open', () => {
	page.locked = true;
});

// Разблокируем прокрутку
events.on('modal: close', () => {
	page.locked = false;
}); 

//Получаем товар с сервера 
api.getProductList()
.then(appData.setCatalog.bind(appData))
.catch(err => {
    console.log(err);
});
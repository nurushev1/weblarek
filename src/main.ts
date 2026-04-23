import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { TPayment, IOrderRequest, IProduct } from './types';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { ServerConnector } from './components/communication/ServerConnector';

import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL } from './utils/constants';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Success } from './components/View/Success';

import { CardCatalog } from './components/View/CardCatalog';
import { PreviewCard } from './components/View/PreviewCard';
import { BasketCard } from './components/View/BasketCard';

import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';

// ===================== INIT =====================

const events = new EventEmitter();

const http = new Api(API_URL);
const apiClient = new ServerConnector(http);

const productCatalog = new ProductCatalog(events);
const shoppingCart = new Cart(events);
const checkout = new Buyer(events);

// ===================== DOM =====================

const galleryEl = ensureElement<HTMLElement>('.gallery');
const modalEl = ensureElement<HTMLElement>('.modal');
const headerEl = ensureElement<HTMLElement>('.header');

const basketTpl = ensureElement<HTMLTemplateElement>('#basket');
const orderTpl = ensureElement<HTMLTemplateElement>('#order');
const contactsTpl = ensureElement<HTMLTemplateElement>('#contacts');
const successTpl = ensureElement<HTMLTemplateElement>('#success');

const productGallery = new Gallery(galleryEl);
const uiModal = new Modal(modalEl, events);
const appHeader = new Header(events, headerEl);

const basket = new Basket(cloneTemplate(basketTpl), events);
const orderForm = new OrderForm(cloneTemplate(orderTpl), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTpl), events);
const success = new Success(cloneTemplate(successTpl), events);

apiClient.getProducts()
  .then(products => {
    productCatalog.setItems(products);
  })
  .catch(error => console.error("Ошибка API:", error));

events.on('catalog:change', () => {
  const products = productCatalog.getItems();

  const cards = products.map(product => {
    const card = new CardCatalog(events, () => {
      events.emit('product:select', product);
    });

    return card.render(product);
  });

  productGallery.render({ items: cards });
});

events.on('product:select', (product: IProduct) => {
  productCatalog.selectItem(product);
});

events.on('catalog:item-selected', (product: IProduct) => {
  const preview = new PreviewCard(events, () => {
    if (shoppingCart.contains(product.id)) {
      shoppingCart.removeItem(product);
    } else {
      shoppingCart.addItem(product);
    }
    uiModal.close();
  });

  const element = preview.render(product);

  if (product.price === null) {
    preview.setActionText('Недоступно');
    preview.setActionDisabled(true);
  } else {
    preview.setActionDisabled(false);

    preview.setActionText(
      shoppingCart.contains(product.id)
        ? 'Удалить из корзины'
        : 'Купить'
    );
  }

  uiModal.open(element);
});

events.on('cart:open', () => {
  uiModal.open(basket.render());
});

events.on('cart:change', () => {
  appHeader.counter = shoppingCart.getCount();

  const items = shoppingCart.getItems().map((product, index) => {
    return new BasketCard(events, () => {
      shoppingCart.removeItem(product);
    }).render({ ...product, index });
  });

  basket.render({
    items,
    total: shoppingCart.getTotal()
  });
});

events.on('basket:order', () => {
  const errors = checkout.validate();
  const data = checkout.getBuyerData();

  orderForm.setError(
    [errors.payment, errors.address].filter(Boolean).join('. ')
  );

  orderForm.setSubmitState(!errors.payment && !errors.address);
  orderForm.setPaymentMethod(data.payment);
  orderForm.setAddressValue(data.address);

  uiModal.open(orderForm.render());
});

events.on('order:change', (data: { payment?: TPayment; address?: string }) => {
  if (data.payment) checkout.setPaymentMethod(data.payment);
  if (data.address) checkout.setAddress(data.address);
});

events.on('order:submit', () => {
  const errors = checkout.validate();
  const data = checkout.getBuyerData();

  contactsForm.setError(
    [errors.email, errors.phone].filter(Boolean).join('. ')
  );

  contactsForm.setSubmitState(!errors.email && !errors.phone);
  contactsForm.setEmailValue(data.email);
  contactsForm.setPhoneValue(data.phone);

  uiModal.open(contactsForm.render());
});

events.on('contacts:change', (data: { email?: string; phone?: string }) => {
  if (data.email) checkout.setEmail(data.email);
  if (data.phone) checkout.setPhone(data.phone);
});

events.on('buyer:changed', () => {
  const errors = checkout.validate();
  const data = checkout.getBuyerData();

  orderForm.setError(
    [errors.payment, errors.address].filter(Boolean).join('. ')
  );

  orderForm.setSubmitState(!errors.payment && !errors.address);
  orderForm.setPaymentMethod(data.payment);
  orderForm.setAddressValue(data.address);

  contactsForm.setError(
    [errors.email, errors.phone].filter(Boolean).join('. ')
  );

  contactsForm.setSubmitState(!errors.email && !errors.phone);
  contactsForm.setEmailValue(data.email);
  contactsForm.setPhoneValue(data.phone);
});

events.on('contacts:submit', () => {
  const orderData: IOrderRequest = {
    ...checkout.getBuyerData(),
    items: shoppingCart.getItems().map(p => p.id),
    total: shoppingCart.getTotal()
  };

  apiClient.postOrder(orderData)
    .then(result => {
      if (!result) return;

      shoppingCart.clearCart();
      checkout.reset();

      success.setTotal(result.total);
      uiModal.open(success.render());
    })
    .catch(error => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('success:close', () => {
  uiModal.close();
});